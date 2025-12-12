import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom'; // <--- 1. NEW IMPORT
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { X, Trophy, Flame, Timer, Minimize2, Maximize2, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import confetti from 'canvas-confetti';

interface FocusModeProps {
  isActive: boolean;
  onClose: () => void;
  onSessionComplete: (duration: number) => void;
  initialDurationInMinutes?: number;
}

export function FocusMode({ isActive, onClose, onSessionComplete, initialDurationInMinutes = 25 }: FocusModeProps) {
  const [timeLeft, setTimeLeft] = useState(initialDurationInMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const { toast } = useToast();

  // Reset timer when active state or initial duration changes
  useEffect(() => {
    if (isActive) {
      setTimeLeft(initialDurationInMinutes * 60);
      setIsRunning(true);
      setIsPaused(false);
      setIsMinimized(false);
    } else {
      setIsRunning(false);
      setIsPaused(false);
    }
  }, [isActive, initialDurationInMinutes]);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && !isPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      handleComplete();
    }

    return () => clearInterval(interval);
  }, [isRunning, isPaused, timeLeft]);

  const handleComplete = () => {
    setIsRunning(false);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Play sound
    const audio = new Audio('/notification.mp3');
    audio.play().catch(e => console.log('Audio play failed', e));

    onSessionComplete(initialDurationInMinutes * 60);

    toast({
      title: "Session Completed!",
      description: "Great job staying focused. Take a break!",
    });
  };

  const toggleTimer = () => {
    setIsPaused(!isPaused);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((initialDurationInMinutes * 60 - timeLeft) / (initialDurationInMinutes * 60)) * 100;

  if (!isActive) return null;

  // Minimized View
  if (isMinimized) {
    return createPortal( // <--- 2. WRAP MINIMIZED VIEW IN PORTAL
      <div className="fixed bottom-4 right-4 z-[100] animate-in slide-in-from-bottom-5">
        <Card className="p-4 flex items-center gap-4 shadow-2xl border-primary/20 bg-background/95 backdrop-blur">
          <div className="flex flex-col">
            <span className="font-mono text-xl font-bold text-primary">
              {formatTime(timeLeft)}
            </span>
            <span className="text-xs text-muted-foreground">Focusing...</span>
          </div>
          <div className="flex gap-2">
            <Button size="icon" variant="ghost" onClick={() => setIsMinimized(false)}>
              <Maximize2 className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="destructive"
              onClick={() => {
                setIsRunning(false);
                onClose();
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      </div>,
      document.body
    );
  }

  // Full Screen View
  return createPortal( // <--- 3. WRAP FULL SCREEN VIEW IN PORTAL
    <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-sm flex flex-col items-center justify-center p-4 animate-in fade-in zoom-in duration-300">
      <div className="absolute top-4 right-4 flex gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMinimized(true)}
          className="hover:bg-primary/10"
        >
          <Minimize2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            if (window.confirm('Are you sure you want to exit focus mode? Progress will be lost.')) {
              setIsRunning(false);
              onClose();
            }
          }}
          className="hover:bg-destructive/10 hover:text-destructive"
        >
          <X className="h-6 w-6" />
        </Button>
      </div>

      <div className="text-center space-y-8 max-w-md w-full">
        <div className="space-y-2">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 mb-4 animate-pulse-slow">
            <Flame className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight">Focus Session</h2>
          <p className="text-muted-foreground">
            Stay in the zone. You're doing great!
          </p>
        </div>

        <div className="relative">
          <div className="text-8xl font-mono font-bold tracking-tighter tabular-nums text-foreground select-none">
            {formatTime(timeLeft)}
          </div>
          <Progress value={progress} className="h-2 mt-8 w-full" />
        </div>

        <div className="flex justify-center gap-4">
          <Button
            size="lg"
            className={cn(
              "w-32 transition-all",
              isPaused ? "bg-green-500 hover:bg-green-600" : "bg-yellow-500 hover:bg-yellow-600"
            )}
            onClick={toggleTimer}
          >
            {isPaused ? (
              <>
                <Play className="mr-2 h-4 w-4" /> Resume
              </>
            ) : (
              <>
                <Timer className="mr-2 h-4 w-4" /> Pause
              </>
            )}
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-8">
          <Card className="p-4 text-center bg-card/50">
            <Trophy className="h-5 w-5 mx-auto mb-2 text-yellow-500" />
            <div className="text-2xl font-bold">{Math.floor(progress)}%</div>
            <div className="text-xs text-muted-foreground">Completed</div>
          </Card>
          <Card className="p-4 text-center bg-card/50">
            <Timer className="h-5 w-5 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">{Math.ceil(timeLeft / 60)}</div>
            <div className="text-xs text-muted-foreground">Min Remaining</div>
          </Card>
        </div>
      </div>
    </div>,
    document.body // <--- This argument attaches the div to the body
  );
}