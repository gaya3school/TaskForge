// src/pages/Home.tsx

import { useTasks } from '@/hooks/useTasks';
import { TaskList } from '@/components/tasks/TaskList';
import { TaskCalendar } from '@/components/calendar/TaskCalendar';
import { AddTaskDialog } from '@/components/tasks/AddTaskDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ListTodo, Calendar } from 'lucide-react';

export default function Home() {
  // We replace all the local state and handlers with our single, powerful hook
  const { tasks, addTask, completeTask } = useTasks();

  const handleTaskEdit = (taskId: string) => {
    console.log('Edit task:', taskId); // Placeholder for future edit functionality
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
            onTaskEdit={handleTaskEdit}
          />
        </TabsContent>
        
        <TabsContent value="calendar" className="mt-6">
          <TaskCalendar
            tasks={tasks}
            onTaskComplete={completeTask}
            onTaskEdit={handleTaskEdit}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}