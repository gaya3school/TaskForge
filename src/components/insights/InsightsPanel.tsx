import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Clock, Target, Zap, TrendingUp } from "lucide-react";
import { ProductivityMetrics } from "@/types/task";

interface InsightsPanelProps {
  metrics: ProductivityMetrics;
}

export function InsightsPanel({ metrics }: InsightsPanelProps) {
  const completionPercentage = (metrics.completionRatio * 100).toFixed(1);
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gradient-primary rounded-lg">
          <BarChart3 className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Weekly Insights</h1>
          <p className="text-muted-foreground">
            Your productivity overview for this week
          </p>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Weekly Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {metrics.weeklyScore}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Progress value={metrics.weeklyScore} className="h-2 flex-1" />
              <Badge variant="secondary" className="text-xs">
                {metrics.weeklyScore >= 80 ? 'Great' : metrics.weeklyScore >= 60 ? 'Good' : 'Needs Work'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <Target className="h-4 w-4" />
              Tasks Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {metrics.tasksCompleted}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {completionPercentage}% completion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <Zap className="h-4 w-4" />
              Focus Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {metrics.focusSessions}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round(metrics.averageSessionLength)} min avg
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <Clock className="h-4 w-4" />
              Focus Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {Math.round(metrics.totalFocusTime / 60)}h
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {metrics.totalFocusTime} minutes total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Completion Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Task Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Completion Rate</span>
                  <span>{completionPercentage}%</span>
                </div>
                <Progress value={parseFloat(completionPercentage)} className="h-2" />
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <p className="text-muted-foreground">Tasks Added</p>
                  <p className="text-xl font-semibold">{metrics.tasksAdded}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Tasks Completed</p>
                  <p className="text-xl font-semibold">{metrics.tasksCompleted}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Focus Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Focus Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <p className="text-muted-foreground">Sessions</p>
                <p className="text-xl font-semibold">{metrics.focusSessions}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">Avg. Length</p>
                <p className="text-xl font-semibold">{Math.round(metrics.averageSessionLength)}m</p>
              </div>
            </div>

            <div>
              <p className="text-muted-foreground text-sm mb-2">Daily Focus Goal</p>
              <div className="flex items-center gap-2">
                <Progress 
                  value={(metrics.totalFocusTime / (7 * 120)) * 100} // Assuming 2 hours daily goal
                  className="h-2 flex-1" 
                />
                <span className="text-sm">
                  {Math.round((metrics.totalFocusTime / (7 * 120)) * 100)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Smart Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Smart Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {metrics.tasksCompleted < metrics.tasksAdded * 0.7 && (
              <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  📝 Focus on completion
                </p>
                <p className="text-xs text-yellow-600 dark:text-yellow-300 mt-1">
                  You have many pending tasks. Try focusing on finishing existing ones before adding new ones.
                </p>
              </div>
            )}

            {metrics.focusSessions < 5 && (
              <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  ⏱️ More focus sessions
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                  Try using more focus sessions to improve concentration and productivity.
                </p>
              </div>
            )}

            {metrics.streak >= 5 && (
              <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                  🔥 Keep the streak!
                </p>
                <p className="text-xs text-green-600 dark:text-green-300 mt-1">
                  Great job maintaining your {metrics.streak}-day streak! Keep it up!
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}