import { Clock, Tag, MoreHorizontal, CheckCircle2, Timer, UserPlus, Trash2, Edit } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Task } from "@/types/task";
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";

interface TaskCardProps {
  task: Task;
  onComplete?: (taskId: string) => void;
  onEdit?: (task: Task) => void;     // Expects the Task object
  onDelete?: (taskId: string) => void; // Expects the Task ID
  onShare?: (task: Task) => void;    // Expects the Task object
}

export function TaskCard({ task, onComplete, onEdit, onDelete, onShare }: TaskCardProps) {
  const navigate = useNavigate();
  const { user } = useAuth();

  // --- Permission logic (unchanged) ---
  const userRole = user && task.roles ? task.roles[user.uid] : null;
  const canDelete = userRole === 'owner' || userRole === 'manager';
  const canEdit = userRole === 'owner' || userRole === 'manager' || userRole === 'editor';
  const canShare = userRole === 'owner' || userRole === 'manager';

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

  const handleStartFocus = () => {
    if (task.estimatedHours && task.estimatedHours > 0 && task.progress < 100) {
      const totalMinutes = task.estimatedHours * 60;
      const remainingProgress = (100 - task.progress) / 100;
      const remainingMinutes = Math.round(totalMinutes * remainingProgress);

      if (remainingMinutes > 0) {
        navigate(`/focus?time=${remainingMinutes}`);
      } else {
        navigate('/focus');
      }
    } else {
      navigate('/focus');
    }
  };

  // --- EXPLICIT CLICK HANDLERS (THE FIX) ---
  // These functions are called by the dropdown menu items.
  // They explicitly call the props passed from Home.tsx.
  const handleEditClick = () => {
    onEdit?.(task);
  }

  const handleShareClick = () => {
    onShare?.(task);
  }

  const handleDeleteClick = () => {
    onDelete?.(task.id);
  }
  // --- END OF FIX ---

  return (
    <Card className={cn(
      "task-card border-l-4",
      priorityColors[task.priority]
    )}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {/* ... (All the task info is unchanged) ... */}
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
            <div className="mt-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">Progress</span>
                <span className="text-xs font-medium">{task.progress}%</span>
              </div>
              <Progress value={task.progress} className="h-1.5" />
            </div>
            {/* ... (End of task info) ... */}
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

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {/* --- ALL CLICK HANDLERS ARE UPDATED --- */}
                <DropdownMenuItem onClick={handleStartFocus}>
                  <Timer className="h-4 w-4 mr-2" />
                  Start Focus Session
                </DropdownMenuItem>

                {canEdit && (
                  <DropdownMenuItem onClick={handleEditClick}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Task
                  </DropdownMenuItem>
                )}

                {canShare && (
                  <DropdownMenuItem onClick={handleShareClick}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Share & Manage
                  </DropdownMenuItem>
                )}

                {canDelete && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={handleDeleteClick}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Task
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

          </div>
        </div>
      </CardContent>
    </Card>
  );
}