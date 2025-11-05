import { useState, useEffect } from 'react';
import { InsightsPanel } from '@/components/insights/InsightsPanel';
import { useTasks } from '@/hooks/useTasks';
import { ProductivityMetrics, Task, Priority } from '@/types/task';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/firebaseConfig';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

function useFocusData() {
  const { user } = useAuth();
  const [focusData, setFocusData] = useState({
    totalFocusTime: 0, // in seconds
    focusSessions: 0,
    loading: true,
  });

  useEffect(() => {
    if (!user) {
      setFocusData({ totalFocusTime: 0, focusSessions: 0, loading: false });
      return;
    }

    const fetchData = async () => {
      setFocusData({ totalFocusTime: 0, focusSessions: 0, loading: true });

      // Get all sessions from the last 7 days
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const sevenDaysAgoTimestamp = Timestamp.fromDate(sevenDaysAgo);

      const sessionsRef = collection(db, 'users', user.uid, 'focusSessions');
      const q = query(sessionsRef, where("completedAt", ">=", sevenDaysAgoTimestamp));

      try {
        const querySnapshot = await getDocs(q);
        let totalTime = 0;
        let totalSessions = 0;

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          totalTime += data.durationInSeconds;
          totalSessions += 1;
        });

        setFocusData({
          totalFocusTime: totalTime,
          focusSessions: totalSessions,
          loading: false,
        });
      } catch (error) {
        console.error("Error fetching focus data: ", error);
        setFocusData({ totalFocusTime: 0, focusSessions: 0, loading: false });
      }
    };

    fetchData();
  }, [user]);

  return focusData;
}


// --- Your existing metrics calculation logic ---
const calculateMetrics = (
  tasks: Task[],
  totalFocusTimeInMinutes: number,
  focusSessions: number
): ProductivityMetrics => {
  // ... (Component 1: Priority-Weighted Completion is unchanged)
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

  // --- Component 2: Focus Time (now with real data) ---
  const weeklyFocusGoal = 10 * 60; // 10 hours in minutes
  const focusRatio = Math.min(totalFocusTimeInMinutes / weeklyFocusGoal, 1);
  const focusScore = focusRatio * 25;

  // --- Component 3: Productivity Momentum (unchanged) ---
  const totalTasks = tasks.length;
  const tasksCompleted = tasks.filter(t => t.completed).length;
  const upcomingTasks = totalTasks - tasksCompleted;
  const highTotalThreshold = 20;
  const highCompletedThreshold = 15;
  const highUpcomingThreshold = 10;
  let momentumScore = 0;
  if (totalTasks >= highTotalThreshold && tasksCompleted >= highCompletedThreshold && upcomingTasks >= highUpcomingThreshold) {
    momentumScore = 15;
  } else if (totalTasks < highTotalThreshold && tasksCompleted < highCompletedThreshold && upcomingTasks >= highUpcomingThreshold) {
    momentumScore = 12;
  } else if (totalTasks < highTotalThreshold && tasksCompleted < highCompletedThreshold && upcomingTasks < highUpcomingThreshold) {
    momentumScore = 9;
  } else if (totalTasks >= highTotalThreshold && tasksCompleted < highCompletedThreshold && upcomingTasks < highUpcomingThreshold) {
    momentumScore = 6;
  } else if (totalTasks >= highTotalThreshold && tasksCompleted >= highCompletedThreshold && upcomingTasks < highUpcomingThreshold) {
    momentumScore = 4;
  } else {
    momentumScore = 5;
  }

  // --- Final Score Calculation ---
  const weeklyScore = Math.round(priorityCompletionScore + focusScore + momentumScore);
  const completionRatio = totalTasks > 0 ? tasksCompleted / totalTasks : 0;

  return {
    weeklyScore,
    completionRatio,
    tasksCompleted,
    tasksAdded: totalTasks,
    totalFocusTime: totalFocusTimeInMinutes,
    focusSessions: focusSessions, // Pass in real data
    averageSessionLength: focusSessions > 0 ? totalFocusTimeInMinutes / focusSessions : 0,
    streak: 7, // Streak is still mocked for now
  };
};

export default function Insights() {
  const { tasks, loading: tasksLoading } = useTasks(); // Get loading state
  const { loading: focusLoading, totalFocusTime, focusSessions } = useFocusData();

  // Show loader while tasks or focus data is loading
  if (tasksLoading || focusLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Convert total focus time from seconds to minutes for calculation
  const totalFocusTimeInMinutes = Math.round(totalFocusTime / 60);

  // Now we pass the REAL data to our metrics function
  const metrics = calculateMetrics(tasks, totalFocusTimeInMinutes, focusSessions);

  return (
    <div className="animate-fade-in">
      <InsightsPanel metrics={metrics} />
    </div>
  );
}