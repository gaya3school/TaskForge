import { useState } from 'react';
import { Task, PermissionLevel } from '@/types/task';
import { useTasks } from '@/hooks/useTasks';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import {
     Dialog,
     DialogContent,
     DialogDescription,
     DialogHeader,
     DialogTitle,
     DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
     Select,
     SelectContent,
     SelectItem,
     SelectTrigger,
     SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner'; // Using sonner for toasts

interface ShareTaskDialogProps {
     task: Task | null;
     open: boolean;
     onOpenChange: (open: boolean) => void;
}

// Helper to get initials
const getInitials = (email: string) => email.substring(0, 2).toUpperCase();

export function ShareTaskDialog({ task, open, onOpenChange }: ShareTaskDialogProps) {
     const { user: currentUser } = useAuth();
     const { updateTaskRoles } = useTasks();

     const [emailToShare, setEmailToShare] = useState('');
     const [permission, setPermission] = useState<PermissionLevel>('viewer');
     const [isFindingUser, setIsFindingUser] = useState(false);

     if (!task || !currentUser) return null;

     // Find user in /users collection by their email
     const findUserByEmail = async (email: string) => {
          const usersRef = collection(db, 'users');
          const q = query(usersRef, where('email', '==', email));
          const querySnapshot = await getDocs(q);

          if (querySnapshot.empty) {
               return null;
          }

          // Return the user data (including uid)
          return querySnapshot.docs[0].data() as { uid: string, email: string };
     };

     const handleAddCollaborator = async () => {
          if (!emailToShare) return;
          setIsFindingUser(true);

          const userToShare = await findUserByEmail(emailToShare);

          if (!userToShare) {
               toast.error("User not found", { description: `No user exists with the email ${emailToShare}.` });
               setIsFindingUser(false);
               return;
          }

          if (userToShare.uid === currentUser.uid) {
               toast.info("You are already the owner of this task.");
               setIsFindingUser(false);
               return;
          }

          // Create the new roles map
          const newRoles = {
               ...task.roles,
               [userToShare.uid]: permission
          };

          try {
               await updateTaskRoles(task.id, newRoles);
               toast.success("Collaborator added!", { description: `${emailToShare} can now access this task.` });
               setEmailToShare('');
          } catch (error) {
               toast.error("Failed to add collaborator.");
          }

          setIsFindingUser(false);
     };

     // Get an array of [uid, role] pairs, filtering out the owner
     const collaborators = Object.entries(task.roles)
          .filter(([uid, role]) => role !== 'owner');
     // Note: We can't show emails yet, only UIDs. We'll fix this later.

     return (
          <Dialog open={open} onOpenChange={onOpenChange}>
               <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                         <DialogTitle>Share Task: {task.title}</DialogTitle>
                         <DialogDescription>
                              Invite others to collaborate on this task.
                         </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                         <Label>Add new collaborator</Label>
                         <div className="flex items-center gap-2">
                              <Input
                                   placeholder="Enter user email..."
                                   value={emailToShare}
                                   onChange={(e) => setEmailToShare(e.target.value)}
                              />
                              <Select value={permission} onValueChange={(v) => setPermission(v as PermissionLevel)}>
                                   <SelectTrigger className="w-[120px]">
                                        <SelectValue />
                                   </SelectTrigger>
                                   <SelectContent>
                                        <SelectItem value="viewer">Viewer</SelectItem>
                                        <SelectItem value="editor">Editor</SelectItem>
                                        <SelectItem value="manager">Manager</SelectItem>
                                   </SelectContent>
                              </Select>
                              <Button onClick={handleAddCollaborator} disabled={isFindingUser}>
                                   {isFindingUser ? "Adding..." : "Add"}
                              </Button>
                         </div>
                    </div>

                    <div className="space-y-3">
                         <Label>Current Collaborators</Label>
                         <div className="space-y-2 max-h-48 overflow-y-auto">
                              {/* Owner (You) */}
                              <div className="flex items-center justify-between">
                                   <div className="flex items-center gap-2">
                                        <Avatar className="h-8 w-8">
                                             <AvatarFallback className="bg-gradient-primary text-white">
                                                  {getInitials(currentUser.email || 'Me')}
                                             </AvatarFallback>
                                        </Avatar>
                                        <span className="text-sm font-medium">{currentUser.email} (You)</span>
                                   </div>
                                   <span className="text-sm text-muted-foreground">Owner</span>
                              </div>

                              {/* Other Collaborators */}
                              {collaborators.map(([uid, role]) => (
                                   <div key={uid} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                             <Avatar className="h-8 w-8">
                                                  <AvatarFallback>{getInitials(uid)}</AvatarFallback>
                                             </Avatar>
                                             <span className="text-sm font-medium truncate w-32">{uid}</span>
                                             <span className="text-xs text-muted-foreground">(Email lookup not built yet)</span>
                                        </div>
                                        <span className="text-sm text-muted-foreground capitalize">{role}</span>
                                   </div>
                              ))}
                         </div>
                    </div>

                    <DialogFooter>
                         <Button variant="outline" onClick={() => onOpenChange(false)}>Done</Button>
                    </DialogFooter>
               </DialogContent>
          </Dialog>
     );
}