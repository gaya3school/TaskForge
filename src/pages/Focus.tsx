import { useState } from 'react';
import { FocusMode } from '@/components/focus/FocusMode';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Clock, Target } from 'lucide-react';

export default function Focus() {
  const [isFocusModeActive, setIsFocusModeActive] = useState(false);

  const handleSessionComplete = (duration: number) => {
    // In a real app, this would save the session to state/backend
    console.log(`Session completed: ${duration} seconds`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Focus Mode</h1>
        <p className="text-muted-foreground">
          Eliminate distractions and boost your productivity
        </p>
      </div>

      {!isFocusModeActive && (
        <>
          {/* Focus Session Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <Card className="cursor-pointer hover:shadow-elegant transition-shadow">
              <CardHeader className="text-center pb-4">
                <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">Pomodoro</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-2xl font-bold text-foreground mb-2">25 min</div>
                <p className="text-sm text-muted-foreground">
                  Classic focused work session
                </p>
                <Button
                  className="w-full mt-4 bg-gradient-primary text-white hover:opacity-90"
                  onClick={() => setIsFocusModeActive(true)}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Session
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-elegant transition-shadow opacity-50">
              <CardHeader className="text-center pb-4">
                <Target className="h-8 w-8 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">Short Break</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-2xl font-bold text-foreground mb-2">5 min</div>
                <p className="text-sm text-muted-foreground">
                  Quick recharge session
                </p>
                <Button variant="outline" className="w-full mt-4" disabled>
                  Coming Soon
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-elegant transition-shadow opacity-50">
              <CardHeader className="text-center pb-4">
                <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">Deep Work</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-2xl font-bold text-foreground mb-2">90 min</div>
                <p className="text-sm text-muted-foreground">
                  Extended focus period
                </p>
                <Button variant="outline" className="w-full mt-4" disabled>
                  Coming Soon
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Sessions */}
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">Yesterday, 2:30 PM</p>
                      <p className="text-sm text-muted-foreground">25 min focus session</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">Completed</p>
                      <p className="text-xs text-muted-foreground">100% focus</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">Yesterday, 10:15 AM</p>
                      <p className="text-sm text-muted-foreground">25 min focus session</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">Completed</p>
                      <p className="text-xs text-muted-foreground">100% focus</p>
                    </div>
                  </div>

                  <div className="text-center py-4 text-muted-foreground">
                    <p className="text-sm">Start a session to see your focus history</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      <FocusMode
        isActive={isFocusModeActive}
        onClose={() => setIsFocusModeActive(false)}
        onSessionComplete={handleSessionComplete}
      />
    </div>
  );
}