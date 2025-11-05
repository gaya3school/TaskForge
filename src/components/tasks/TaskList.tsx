import { Task, Priority } from "@/types/task";
import { TaskCard } from "./TaskCard";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TaskListProps {
  tasks: Task[];
  onTaskComplete?: (taskId: string) => void;
  onTaskEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onShare?: (task: Task) => void;
}

export function TaskList({
  tasks,
  onTaskComplete,
  onTaskEdit,
  onDelete,
  onShare
}: TaskListProps) {

  const groupedTasks = tasks.reduce((acc, task) => {
    if (!task.completed) {
      if (!acc[task.priority]) {
        acc[task.priority] = [];
      }
      acc[task.priority].push(task);
    }
    return acc;
  }, {} as Record<Priority, Task[]>);

  const priorityOrder: Priority[] = ['high', 'medium', 'low'];
  const priorityLabels = {
    high: 'High Priority',
    medium: 'Medium Priority',
    low: 'Low Priority'
  };

  const priorityEmojis = {
    high: '🔥',
    medium: '⚡',
    low: '🌱'
  };

  return (
    <div className="space-y-6">
      {priorityOrder.map((priority) => {
        const priorityTasks = groupedTasks[priority] || [];

        if (priorityTasks.length === 0) return null;

        return (
          <div key={priority} className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">{priorityEmojis[priority]}</span>
              <h3 className="text-lg font-semibold text-foreground">
                {priorityLabels[priority]}
              </h3>
              <span className="text-sm text-muted-foreground">
                ({priorityTasks.length})
              </span>
            </div>

            <ScrollArea className="max-h-96">
              <div className="space-y-3">
                {priorityTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onComplete={onTaskComplete}
                    onEdit={onTaskEdit}     // <-- Passes the function
                    onDelete={onDelete}   // <-- Passes the function
                    onShare={onShare}     // <-- Passes the function
                  />
                ))}
              </div>
            </ScrollArea>
          </div>
        );
      })}

      {Object.keys(groupedTasks).length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🎉</div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            All caught up!
          </h3>
          <p className="text-muted-foreground">
            No pending tasks. Great work!
          </p>
        </div>
      )}
    </div>
  );
}