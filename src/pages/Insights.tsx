// src/pages/Insights.tsx

import { InsightsPanel } from '@/components/insights/InsightsPanel';
import { useTasks } from '@/hooks/useTasks';
import { ProductivityMetrics, Task, Priority } from '@/types/task';

// --- NEW ADVANCED METRICS CALCULATION ---

const calculateMetrics = (tasks: Task[], totalFocusTime: number): ProductivityMetrics => {
  // --- Component 1: Priority-Weighted Completion (60 points) ---
  const priorityWeights: Record<Priority, number> = { high: 3, medium: 2, low: 1 };
  
  let maxPossibleScore = 0;
  let achievedScore = 0;

  tasks.forEach(task => {
    const weight = priorityWeights[task.priority];
    maxPossibleScore += weight;
    if (task.completed) {
      achievedScore += weight;
    }
  });

  const priorityRatio = maxPossibleScore > 0 ? achievedScore / maxPossibleScore : 0;
  const priorityCompletionScore = priorityRatio * 60;

  // --- Component 2: Focus Time (25 points) ---
  const weeklyFocusGoal = 10 * 60; // 10 hours in minutes
  const focusRatio = Math.min(totalFocusTime / weeklyFocusGoal, 1); // Capped at 100% of goal
  const focusScore = focusRatio * 25;
  
  // --- Component 3: Productivity Momentum (15 points) - REPLACES Task Volume ---
  const totalTasks = tasks.length;
  const tasksCompleted = tasks.filter(t => t.completed).length;
  const upcomingTasks = totalTasks - tasksCompleted;

  // Define thresholds for what counts as "high"
  const highTotalThreshold = 20;
  const highCompletedThreshold = 15;
  const highUpcomingThreshold = 10;

  let momentumScore = 0;
  
  if (totalTasks >= highTotalThreshold && tasksCompleted >= highCompletedThreshold && upcomingTasks >= highUpcomingThreshold) {
    momentumScore = 15; // High-High-High: Highest productivity
  } else if (totalTasks < highTotalThreshold && tasksCompleted < highCompletedThreshold && upcomingTasks >= highUpcomingThreshold) {
    momentumScore = 12; // Low-Low-High: High future planning
  } else if (totalTasks < highTotalThreshold && tasksCompleted < highCompletedThreshold && upcomingTasks < highUpcomingThreshold) {
    momentumScore = 9;  // Low-Low-Low: A quiet, controlled week
  } else if (totalTasks >= highTotalThreshold && tasksCompleted < highCompletedThreshold && upcomingTasks < highUpcomingThreshold) {
    momentumScore = 6;  // High-Low-Low: Struggled with a large backlog
  } else if (totalTasks >= highTotalThreshold && tasksCompleted >= highCompletedThreshold && upcomingTasks < highUpcomingThreshold) {
    momentumScore = 4;  // High-High-Low: Cleared the backlog
  } else {
    momentumScore = 5;  // A baseline for other combinations
  }

  // --- Final Score Calculation ---
  const weeklyScore = Math.round(priorityCompletionScore + focusScore + momentumScore);

  const completionRatio = totalTasks > 0 ? tasksCompleted / totalTasks : 0;

  return {
    weeklyScore,
    completionRatio,
    tasksCompleted,
    tasksAdded: totalTasks,
    totalFocusTime,
    // Using placeholder values for these until they are tracked
    focusSessions: 8,
    averageSessionLength: totalFocusTime > 0 ? totalFocusTime / 8 : 0,
    streak: 7,
  };
};

export default function Insights() {
  const { tasks } = useTasks();
  
  // NOTE: This value is mocked. For a real app, you'd load this from localStorage
  // after updating your FocusMode component to save session durations.
  const mockTotalFocusTime = 420; // 7 hours in minutes

  const metrics = calculateMetrics(tasks, mockTotalFocusTime);

  return (
    <div className="animate-fade-in">
      <InsightsPanel metrics={metrics} />
    </div>
  );
}