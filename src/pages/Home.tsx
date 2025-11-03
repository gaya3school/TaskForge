import { useState } from 'react'; // 1. Import useState
import { useTasks } from '@/hooks/useTasks';
import { TaskList } from '@/components/tasks/TaskList';
import { TaskCalendar } from '@/components/calendar/TaskCalendar';
import { AddTaskDialog } from '@/components/tasks/AddTaskDialog';
import { EditTaskDialog } from '@/components/tasks/EditTaskDialog'; // 2. Import EditTaskDialog
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ListTodo, Calendar } from 'lucide-react';
import { Task } from '@/types/task'; // 3. Import Task type

export default function Home() {
  // 4. Get the new editTask function
  const { tasks, addTask, completeTask, editTask } = useTasks();

  // 5. Add state to track which task is being edited
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  // 6. Update handleTaskEdit to set the state
  const handleTaskEdit = (task: Task) => {
    setTaskToEdit(task);
  };

  // 7. Add a new handler for submitting the edit
  const handleEditTaskSubmit = (taskId: string, updates: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    editTask(taskId, updates);
    setTaskToEdit(null); // Close the dialog
  };

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
          <TaskList
            tasks={tasks}
            onTaskComplete={completeTask}
            onTaskEdit={handleTaskEdit} // 8. This now works
          />
        </TabsContent>

        <TabsContent value="calendar" className="mt-6">
          {/* 9. Also update TaskCalendar's onTaskEdit prop type (in the file itself) */}
          <TaskCalendar
            tasks={tasks}
            onTaskComplete={completeTask}
            onTaskEdit={handleTaskEdit} // 10. And pass the handler here
          />
        </TabsContent>
      </Tabs>

      {/* 11. Render the Edit Task Dialog */}
      <EditTaskDialog
        task={taskToEdit}
        open={!!taskToEdit}
        onOpenChange={(open) => !open && setTaskToEdit(null)}
        onEditTask={handleEditTaskSubmit}
      />
    </div>
  );
}