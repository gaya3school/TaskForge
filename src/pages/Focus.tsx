import { useState, useEffect } from 'react'; // 1. Import useEffect
import { useSearchParams } from 'react-router-dom'; // 2. Import useSearchParams
import { FocusMode } from '@/components/focus/FocusMode';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Clock, Target } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function Focus() {
  const [isFocusModeActive, setIsFocusModeActive] = useState(false);
  const [focusTime, setFocusTime] = useState(25); // 3. State for custom time
  const [searchParams] = useSearchParams();

  // 4. This new effect checks the URL on page load
  useEffect(() => {
    const timeParam = searchParams.get('time');
    if (timeParam) {
      const timeInMinutes = parseInt(timeParam, 10);
      // Check if it's a valid number
      if (!isNaN(timeInMinutes) && timeInMinutes > 0) {
        setFocusTime(timeInMinutes); // Set the custom time
        setIsFocusModeActive(true);  // Activate focus mode immediately
      }
    }
  }, [searchParams]); // Runs when searchParams change

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
                  // 5. Update onClick to set time to 25
                  onClick={() => {
                    setFocusTime(25);
                    setIsFocusModeActive(true);
                  }}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Session
                </Button>
              </CardContent>
            </Card>

            {/* ... (Other cards are unchanged) ... */}
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

          {/* ... (Recent Sessions card is unchanged) ... */}
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                {/* ... (content unchanged) ... */}
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {/* 6. Pass the focusTime state as a prop */}
      <FocusMode
        isActive={isFocusModeActive}
        onClose={() => setIsFocusModeActive(false)}
        onSessionComplete={handleSessionComplete}
        initialDurationInMinutes={focusTime}
      />
    </div>
  );
}