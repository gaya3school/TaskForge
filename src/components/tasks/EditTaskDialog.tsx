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
import { Task, Priority } from '@/types/task';
import { cn } from '@/lib/utils';

interface EditTaskDialogProps {
     task: Task | null; // The task to edit
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

     // This is the key: Pre-fill the form when a task is passed in
     useEffect(() => {
          if (task) {
               setTitle(task.title);
               setDescription(task.description || '');
               setPriority(task.priority);
               setDueDate(task.dueDate);
               setEstimatedHours(task.estimatedHours?.toString() || '');
               setTags(task.tags.join(', '));
          }
     }, [task]); // This effect runs when `task` changes

     const handleSubmit = (e: React.FormEvent) => {
          e.preventDefault();
          if (!title.trim() || !task) return; // Need a task to edit

          const updatedTaskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> = {
               title: title.trim(),
               description: description.trim() || undefined,
               priority,
               dueDate,
               estimatedHours: estimatedHours ? parseFloat(estimatedHours) : undefined,
               progress: task.progress, // Keep existing progress
               tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
               completed: task.completed, // Keep existing completion status
          };

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

                         <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                   <Label htmlFor="priority">Priority</Label>
                                   <Select value={priority} onValueChange={(value: Priority) => setPriority(value)}>
                                        <SelectTrigger>
                                             <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                             <SelectItem value="low">
                                                  <div className="flex items-center gap-2">
                                                       <div className="w-2 h-2 rounded-full bg-priority-low" />
                                                       Low Priority
                                                  </div>
                                             </SelectItem>
                                             <SelectItem value="medium">
                                                  <div className="flex items-center gap-2">
                                                       <div className="w-2 h-2 rounded-full bg-priority-medium" />
                                                       Medium Priority
                                                  </div>
                                             </SelectItem>
                                             <SelectItem value="high">
                                                  <div className="flex items-center gap-2">
                                                       <div className="w-2 h-2 rounded-full bg-priority-high" />
                                                       High Priority
                                                  </div>
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
                              <Popover>
                                   <PopoverTrigger asChild>
                                        <Button
                                             variant="outline"
                                             className={cn(
                                                  "w-full justify-start text-left font-normal",
                                                  !dueDate && "text-muted-foreground"
                                             )}
                                        >
                                             <CalendarIcon className="mr-2 h-4 w-4" />
                                             {dueDate ? format(dueDate, "PPP") : <span>Pick a due date</span>}
                                        </Button>
                                   </PopoverTrigger>
                                   <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                             mode="single"
                                             selected={dueDate}
                                             onSelect={setDueDate}
                                             initialFocus
                                             className={cn("p-3 pointer-events-auto")}
                                        />
                                   </PopoverContent>
                              </Popover>
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