// src/components/tasks/EditTaskDialog.tsx

import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
     Select,
     SelectContent,
     SelectItem,
     SelectTrigger,
     SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
     Popover,
     PopoverContent,
     PopoverTrigger,
} from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider'; // <-- 1. IMPORT SLIDER
import { Task, Priority } from '@/types/task';
import { cn } from '@/lib/utils';

interface EditTaskDialogProps {
     task: Task | null;
     onEditTask: (taskId: string, taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
     open: boolean;
     onOpenChange: (open: boolean) => void;
}

export function EditTaskDialog({ task, onEditTask, open, onOpenChange }: EditTaskDialogProps) {
     // Internal form state
     const [title, setTitle] = useState('');
     const [description, setDescription] = useState('');
     const [priority, setPriority] = useState<Priority>('medium');
     const [dueDate, setDueDate] = useState<Date | undefined>();
     const [estimatedHours, setEstimatedHours] = useState('');
     const [tags, setTags] = useState('');
     const [progress, setProgress] = useState(0); // <-- 2. ADD STATE FOR PROGRESS

     // Pre-fill the form
     useEffect(() => {
          if (task) {
               setTitle(task.title);
               setDescription(task.description || '');
               setPriority(task.priority);
               setDueDate(task.dueDate);
               setEstimatedHours(task.estimatedHours?.toString() || '');
               setTags(task.tags.join(', '));
               setProgress(task.progress || 0); // <-- 3. SET PROGRESS STATE
          }
     }, [task]);

     const handleSubmit = (e: React.FormEvent) => {
          e.preventDefault();
          if (!title.trim() || !task) return;

          const updatedTaskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> = {
               title: title.trim(),
               description: description.trim() || undefined,
               priority,
               dueDate,
               estimatedHours: estimatedHours ? parseFloat(estimatedHours) : undefined,
               progress: progress, // <-- 4. UPDATE THIS LINE
               tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
               completed: progress === 100 ? true : task.completed,
               roles: task.roles
          };

          // If progress was just set to 100, also update 'completed'
          if (progress === 100) {
               updatedTaskData.completed = true;
          }
          // If progress is moved from 100 to something else, un-complete it
          else if (task.progress === 100 && progress < 100) {
               updatedTaskData.completed = false;
          }

          onEditTask(task.id, updatedTaskData);
          onOpenChange(false); // Close dialog
     };

     return (
          <Dialog open={open} onOpenChange={onOpenChange}>
               <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                         <DialogTitle>Edit Task</DialogTitle>
                         <DialogDescription>
                              Update your task details below.
                         </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                         <div className="space-y-2">
                              <Label htmlFor="title">Task Title *</Label>
                              <Input
                                   id="title"
                                   placeholder="Enter task title..."
                                   value={title}
                                   onChange={(e) => setTitle(e.target.value)}
                                   required
                              />
                         </div>

                         <div className="space-y-2">
                              <Label htmlFor="description">Description</Label>
                              <Textarea
                                   id="description"
                                   placeholder="Describe your task..."
                                   value={description}
                                   onChange={(e) => setDescription(e.target.value)}
                                   rows={3}
                              />
                         </div>

                         {/* --- 6. ADD THE SLIDER HERE --- */}
                         <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                   <Label>Progress</Label>
                                   <span className="text-sm font-medium text-muted-foreground">{progress}%</span>
                              </div>
                              <Slider
                                   value={[progress]}
                                   onValueChange={(value) => setProgress(value[0])}
                                   max={100}
                                   step={5} // Snaps to 5% intervals
                              />
                         </div>
                         {/* --- END OF SLIDER --- */}

                         <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                   <Label htmlFor="priority">Priority</Label>
                                   <Select value={priority} onValueChange={(value: Priority) => setPriority(value)}>
                                        <SelectTrigger>
                                             <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                             <SelectItem value="low">
                                                  {/* ... */}
                                             </SelectItem>
                                             <SelectItem value="medium">
                                                  {/* ... */}
                                             </SelectItem>
                                             <SelectItem value="high">
                                                  {/* ... */}
                                             </SelectItem>
                                        </SelectContent>
                                   </Select>
                              </div>

                              <div className="space-y-2">
                                   <Label htmlFor="estimatedHours">Estimated Hours</Label>
                                   <Input
                                        id="estimatedHours"
                                        type="number"
                                        step="0.5"
                                        min="0"
                                        placeholder="2.5"
                                        value={estimatedHours}
                                        onChange={(e) => setEstimatedHours(e.target.value)}
                                   />
                              </div>
                         </div>

                         <div className="space-y-2">
                              <Label>Due Date</Label>
                              {/* ... Popover code ... */}
                         </div>

                         <div className="space-y-2">
                              <Label htmlFor="tags">Tags</Label>
                              <Input
                                   id="tags"
                                   placeholder="work, urgent, design (comma separated)"
                                   value={tags}
                                   onChange={(e) => setTags(e.target.value)}
                              />
                         </div>

                         <DialogFooter>
                              <Button
                                   type="button"
                                   variant="outline"
                                   onClick={() => onOpenChange(false)}
                              >
                                   Cancel
                              </Button>
                              <Button
                                   type="submit"
                                   className="bg-gradient-primary text-white hover:opacity-90"
                                   disabled={!title.trim()}
                              >
                                   Update Task
                              </Button>
                         </DialogFooter>
                    </form>
               </DialogContent>
          </Dialog>
     );
}