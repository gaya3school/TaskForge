import { useState } from 'react';
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, getDay, startOfWeek, endOfWeek } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Task } from '@/types/task';
import { TaskCard } from '@/components/tasks/TaskCard';
import { cn } from '@/lib/utils';

interface TaskCalendarProps {
  tasks: Task[];
  onTaskComplete?: (taskId: string) => void;
  onTaskEdit?: (taskId: string) => void;
}

export function TaskCalendar({ tasks, onTaskComplete, onTaskEdit }: TaskCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Get tasks for a specific date
  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => 
      task.dueDate && isSameDay(task.dueDate, date) && !task.completed
    );
  };

  // Get task counts and priority info for a date
  const getDateInfo = (date: Date) => {
    const dateTasks = getTasksForDate(date);
    const highPriorityCount = dateTasks.filter(t => t.priority === 'high').length;
    const totalCount = dateTasks.length;
    
    return { totalCount, highPriorityCount };
  };

  // Navigation functions
  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Generate calendar days
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  
  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd
  });

  const selectedTasks = selectedDate ? getTasksForDate(selectedDate) : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calendar */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                {format(currentDate, 'MMMM yyyy')}
              </CardTitle>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="sm" onClick={previousMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={nextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day) => {
                const { totalCount, highPriorityCount } = getDateInfo(day);
                const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                const isSelected = selectedDate && isSameDay(day, selectedDate);
                const isToday = isSameDay(day, new Date());

                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => setSelectedDate(day)}
                    className={cn(
                      "relative p-2 h-12 text-sm rounded-md transition-colors hover:bg-muted/50",
                      !isCurrentMonth && "text-muted-foreground/50",
                      isSelected && "bg-primary text-primary-foreground hover:bg-primary",
                      isToday && !isSelected && "bg-accent font-medium",
                      totalCount > 0 && "font-medium"
                    )}
                  >
                    <span>{format(day, 'd')}</span>
                    
                    {/* Task indicators */}
                    {totalCount > 0 && (
                      <div className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 flex gap-0.5">
                        {/* High priority indicator */}
                        {highPriorityCount > 0 && (
                          <div className={cn(
                            "w-1.5 h-1.5 rounded-full bg-priority-high",
                            isSelected && "bg-white"
                          )} />
                        )}
                        
                        {/* Total tasks indicator */}
                        {totalCount > highPriorityCount && (
                          <div className={cn(
                            "w-1.5 h-1.5 rounded-full bg-muted-foreground",
                            isSelected && "bg-white/70"
                          )} />
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-priority-high" />
                <span>High Priority Tasks</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                <span>Other Tasks</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Selected Date Tasks */}
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {selectedDate ? format(selectedDate, 'MMM dd, yyyy') : 'Select a Date'}
            </CardTitle>
            {selectedDate && (
              <p className="text-sm text-muted-foreground">
                {selectedTasks.length} {selectedTasks.length === 1 ? 'task' : 'tasks'} scheduled
              </p>
            )}
          </CardHeader>
          <CardContent>
            {selectedDate ? (
              selectedTasks.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {selectedTasks.map(task => (
                    <div key={task.id} className="scale-95 origin-top">
                      <TaskCard
                        task={task}
                        onComplete={onTaskComplete}
                        onEdit={onTaskEdit}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <CalendarIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No tasks scheduled for this day</p>
                </div>
              )
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <CalendarIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Click on a date to view tasks</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}