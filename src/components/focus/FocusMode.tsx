import React, { useState, useEffect } from 'react';
import { Play, Pause, Square, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface FocusModeProps {
  isActive: boolean;
  onClose: () => void;
  onSessionComplete?: (duration: number) => void;
}

export function FocusMode({ isActive, onClose, onSessionComplete }: FocusModeProps) {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [totalTime] = useState(25 * 60);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            onSessionComplete?.(totalTime);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, totalTime, onSessionComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleStop = () => {
    setIsRunning(false);
    setTimeLeft(totalTime);
  };

  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  if (!isActive) return null;

  return (
    <div className="focus-overlay flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-elegant">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">Focus Session</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-muted-foreground">
            Stay focused and productive
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-6xl font-mono font-bold text-primary mb-4">
              {formatTime(timeLeft)}
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="flex items-center justify-center gap-4">
            {!isRunning ? (
              <Button
                onClick={handleStart}
                size="lg"
                className="bg-gradient-primary text-white hover:opacity-90"
                disabled={timeLeft === 0}
              >
                <Play className="h-5 w-5 mr-2" />
                Start
              </Button>
            ) : (
              <Button
                onClick={handlePause}
                variant="outline"
                size="lg"
              >
                <Pause className="h-5 w-5 mr-2" />
                Pause
              </Button>
            )}
            
            <Button
              onClick={handleStop}
              variant="outline"
              size="lg"
            >
              <Square className="h-5 w-5 mr-2" />
              Stop
            </Button>
          </div>

          {timeLeft === 0 && (
            <div className="text-center">
              <div className="text-2xl mb-2">🎉</div>
              <p className="text-lg font-medium text-foreground">
                Great work!
              </p>
              <p className="text-muted-foreground">
                You completed a {totalTime / 60}-minute focus session.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}