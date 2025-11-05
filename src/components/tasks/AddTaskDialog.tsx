// 1. Import React for React.ReactNode

import { pipeline } from '@xenova/transformers';
import React, { useState, useEffect, useRef } from 'react';
import { Plus, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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

// 2. Define the props interface (Fix for line 36)
interface AddTaskDialogProps {
  // This type now correctly matches the 'addTask' function in useTasks.ts
  onAddTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'roles'>) => void;
  children?: React.ReactNode;
}

export function AddTaskDialog({ onAddTask, children }: AddTaskDialogProps) {
  // 3. Move the ref INSIDE the component (Fix for line 34)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const classifier = useRef<any | null>(null);

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState<Date>();
  const [estimatedHours, setEstimatedHours] = useState('');
  const [tags, setTags] = useState('');
  const [isModelLoading, setIsModelLoading] = useState(false);

  // Load the ML model
  // Inside AddTaskDialog.tsx

  useEffect(() => {
    // We can keep the simpler logging now
    if (open && !classifier.current) {
      console.log('Attempting to load ML model...');
      setIsModelLoading(true);

      const options = {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        progress_callback: (progress: any) => {
          console.log('Loading progress:', progress);
        }
      };

      // --- THIS IS THE FINAL CLEAN CALL ---
      pipeline('zero-shot-classification', 'Xenova/distilbert-base-uncased-mnli', options)
        .then((model) => {
          console.log('ML model loaded successfully!', model);
          classifier.current = model;
          setIsModelLoading(false);
        })
        .catch(err => {
          console.error("Failed to load pipeline:", err);
          setIsModelLoading(false);
        });
    }
  }, [open]);


  // Handle description blur
  const handleDescriptionBlur = async () => {
    if (!classifier.current || !description.trim() || priority !== 'medium' || isModelLoading) {
      return;
    }
    const candidate_labels = ['urgent', 'important', 'casual'];
    const result = await classifier.current(description, candidate_labels) as { labels: string[], scores: number[] };
    const bestLabel = result.labels[0];

    if (bestLabel === 'urgent') {
      setPriority('high');
    } else if (bestLabel === 'important') {
      setPriority('medium');
    } else if (bestLabel === 'casual') {
      setPriority('low');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    // This object type now matches the onAddTask prop type perfectly
    const newTask: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'roles'> = {
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      dueDate,
      estimatedHours: estimatedHours ? parseFloat(estimatedHours) : undefined,
      progress: 0,
      tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
      completed: false,
    };

    // 5. Removed 'as any' (Fix for line 96)
    onAddTask(newTask);

    // Reset form
    setTitle('');
    setDescription('');
    setPriority('medium');
    setDueDate(undefined);
    setEstimatedHours('');
    setTags('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className="bg-gradient-primary text-white hover:opacity-90">
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>
            Add a new task to your workflow. Fill in the details below.
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
            {isModelLoading && (
              <p className="text-xs text-muted-foreground pt-1">
                AI is warming up...
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your task..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={handleDescriptionBlur}
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
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-primary text-white hover:opacity-90"
              disabled={!title.trim() || isModelLoading}
            >
              {isModelLoading ? 'Warming up...' : 'Create Task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}