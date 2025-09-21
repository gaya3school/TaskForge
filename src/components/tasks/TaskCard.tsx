import { Clock, Tag, MoreHorizontal, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Task } from "@/types/task";

interface TaskCardProps {
  task: Task;
  onComplete?: (taskId: string) => void;
  onEdit?: (taskId: string) => void;
}

export function TaskCard({ task, onComplete, onEdit }: TaskCardProps) {
  const priorityColors = {
    high: "border-l-priority-high bg-red-50 dark:bg-red-950/20",
    medium: "border-l-priority-medium bg-yellow-50 dark:bg-yellow-950/20", 
    low: "border-l-priority-low bg-green-50 dark:bg-green-950/20"
  };

  const formatDueDate = (date?: Date) => {
    if (!date) return null;
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return "Overdue";
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    return `${diffDays} days`;
  };

  return (
    <Card className={cn(
      "task-card border-l-4",
      priorityColors[task.priority]
    )}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-2">
              <h3 className="font-medium text-card-foreground truncate">
                {task.title}
              </h3>
              <Badge 
                variant="secondary" 
                className={cn(
                  "text-xs capitalize",
                  task.priority === 'high' && "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
                  task.priority === 'medium' && "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300",
                  task.priority === 'low' && "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
                )}
              >
                {task.priority}
              </Badge>
            </div>
            
            {task.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {task.description}
              </p>
            )}

            <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
              {task.dueDate && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span className={cn(
                    formatDueDate(task.dueDate) === "Overdue" && "text-destructive font-medium"
                  )}>
                    {formatDueDate(task.dueDate)}
                  </span>
                </div>
              )}
              
              {task.estimatedHours && (
                <span>{task.estimatedHours}h estimated</span>
              )}

              {task.tags.length > 0 && (
                <div className="flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  <span>{task.tags.slice(0, 2).join(', ')}</span>
                  {task.tags.length > 2 && <span>+{task.tags.length - 2}</span>}
                </div>
              )}
            </div>

            {/* Progress Bar */}
            <div className="mt-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">Progress</span>
                <span className="text-xs font-medium">{task.progress}%</span>
              </div>
              <Progress value={task.progress} className="h-1.5" />
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onComplete?.(task.id)}
              className="h-8 w-8 p-0"
            >
              <CheckCircle2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit?.(task.id)}
              className="h-8 w-8 p-0"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}