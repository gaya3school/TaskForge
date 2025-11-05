import { useState } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { TaskList } from '@/components/tasks/TaskList';
import { TaskCalendar } from '@/components/calendar/TaskCalendar';
import { AddTaskDialog } from '@/components/tasks/AddTaskDialog';
import { EditTaskDialog } from '@/components/tasks/EditTaskDialog';
import { ShareTaskDialog } from '@/components/tasks/ShareTaskDialog'; // <-- 1. ADD THIS IMPORT
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ListTodo, Calendar, Loader2 } from 'lucide-react';
import { Task } from '@/types/task';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner'; // <-- 2. ADD THIS IMPORT

export default function Home() {
  // 3. Get 'deleteTask' from your hook
  const { tasks, loading, addTask, completeTask, editTask, deleteTask } = useTasks(); // <-- 3. ADD 'deleteTask'

  // Edit state (you already have this)
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  // 4. Add state for the Share dialog
  const [taskToShare, setTaskToShare] = useState<Task | null>(null); // <-- 4. ADD THIS STATE

  // Edit handler (you already have this)
  const handleTaskEdit = (task: Task) => {
    setTaskToEdit(task);
  };

  // Edit submit handler (you already have this)
  const handleEditTaskSubmit = (taskId: string, updates: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    editTask(taskId, updates);
    setTaskToEdit(null);
  };

  // 5. Add handler for opening the Share dialog
  const handleShareTask = (task: Task) => { // <-- 5. ADD THIS HANDLER
    setTaskToShare(task);
  };

  // 6. Add handler for deleting a task
  const handleDeleteTask = (taskId: string) => { // <-- 6. ADD THIS HANDLER
    // Optional: Add a confirmation dialog
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        deleteTask(taskId);
        toast.success("Task deleted successfully.");
      } catch (error) {
        toast.error("Failed to delete task.");
      }
    }
  };

  // Loading skeleton (you already have this)
  const TaskLoadingSkeleton = () => (
    <div className="space-y-6">
      <div className="space-y-3">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-24 w-full" />
      </div>
    </div>
  );

  return (
    <div className="space-y-6 dotted-grid">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Task Management</h1>
          <p className="text-muted-foreground">
            You have {tasks.filter(t => !t.completed).length} pending tasks
          </p>
        </div>
        <AddTaskDialog onAddTask={addTask} />
      </div>

      <Tabs defaultValue="tasks" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="tasks" className="flex items-center gap-2">
            <ListTodo className="h-4 w-4" />
            Tasks
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Calendar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="mt-6">
          {loading ? (
            <TaskLoadingSkeleton />
          ) : (
            <TaskList
              tasks={tasks}
              onTaskComplete={completeTask}
              onTaskEdit={handleTaskEdit}
              onShare={handleShareTask}    // <-- 7. ADD THIS PROP
              onDelete={handleDeleteTask}  // <-- 8. ADD THIS PROP
            />
          )}
        </TabsContent>

        <TabsContent value="calendar" className="mt-6">
          {loading ? (
            <div className="flex justify-center items-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <TaskCalendar
              tasks={tasks}
              onTaskComplete={completeTask}
              onTaskEdit={handleTaskEdit}
              onShare={handleShareTask}    // <-- 9. ADD THIS PROP
              onDelete={handleDeleteTask}  // <-- 10. ADD THIS PROP
            />
          )}
        </TabsContent>
      </Tabs>

      {/* Edit Dialog (you already have this) */}
      <EditTaskDialog
        task={taskToEdit}
        open={!!taskToEdit}
        onOpenChange={(open) => !open && setTaskToEdit(null)}
        onEditTask={handleEditTaskSubmit}
      />

      {/* 11. Add the Share Dialog to be rendered */}
      <ShareTaskDialog
        task={taskToShare}
        open={!!taskToShare}
        onOpenChange={(open) => !open && setTaskToShare(null)}
      />
    </div>
  );
}