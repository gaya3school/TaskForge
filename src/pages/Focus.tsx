import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom'; 
import { FocusMode } from '@/components/focus/FocusMode';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Clock, Target, Settings, Brain} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/firebaseConfig';
import { collection, addDoc, serverTimestamp, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface FocusSession {
  duration: number; // in seconds
  timestamp: Date;
}

export default function Focus() {
  const [isFocusModeActive, setIsFocusModeActive] = useState(false);
  const [focusTime, setFocusTime] = useState(25); // 3. State for custom time
  const [searchParams] = useSearchParams();
  const [customTimeInput, setCustomTimeInput] = useState('60');
  const [isCustomDialogOpen, setIsCustomDialogOpen] = useState(false);
  const [recentSessions, setRecentSessions] = useState<FocusSession[]>([]);

  const { toast } = useToast();
  const { user } = useAuth();

  // Function to fetch recent sessions
  const fetchRecentSessions = async () => {
    if (!user?.uid) return;

    try {
      const q = query(
        collection(db, `users/${user.uid}/focusSessions`),
        orderBy('timestamp', 'desc'),
        limit(5) // Limit to 5 most recent sessions
      );

      const querySnapshot = await getDocs(q);
      const sessions = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          duration: data.duration,
          timestamp: data.timestamp.toDate(), // Convert Firebase Timestamp to JS Date
        } as FocusSession;
      });

      setRecentSessions(sessions);
    } catch (error) {
      console.error("Error fetching recent sessions: ", error);
      toast({
        title: "Error",
        description: "Could not load recent focus sessions.",
        variant: "destructive",
      });
    }
  };

  // Run once on load to fetch sessions
  useEffect(() => {
    // 1. Fetch sessions on load or user change (This function is defined earlier)
    fetchRecentSessions();

    // 2. URL Check Logic
    const timeParam = searchParams.get('time');
    if (timeParam) {
      const timeInMinutes = parseInt(timeParam, 10);
      if (!isNaN(timeInMinutes) && timeInMinutes > 0) {
        setFocusTime(timeInMinutes);
        setIsFocusModeActive(true);
      }
    }
  }, [searchParams, user?.uid]);

  const handleCustomTimeStart = () => {
    const timeInMinutes = parseInt(customTimeInput, 10);

    if (isNaN(timeInMinutes) || timeInMinutes <= 0) {
      toast({
        title: "Invalid Time",
        description: "Please enter a positive number of minutes.",
        variant: "destructive",
      });
      return;
    }

    setFocusTime(timeInMinutes);
    setIsFocusModeActive(true);
    setIsCustomDialogOpen(false);
  };

  const handleSessionComplete = async (duration: number) => {
    console.log(`Session completed: ${duration} seconds`);
    if (!user?.uid) return;

    try {
      await addDoc(collection(db, `users/${user.uid}/focusSessions`), {
        duration: duration,
        timestamp: serverTimestamp(),
      });
      // Refresh the list to show the new session
      await fetchRecentSessions();
    } catch (error) {
      console.error("Error saving session: ", error);
      toast({
        title: "Error",
        description: "Could not save focus session data.",
        variant: "destructive",
      });
    }
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <Card className="cursor-pointer hover:shadow-elegant transition-shadow">
              <CardHeader className="text-center pb-4">
                <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">Pomodoro</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-2xl font-bold text-foreground mb-2">25 min</div>
                <p className="text-sm text-muted-foreground">
                  Classic focused session
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
            <Card className="cursor-pointer hover:shadow-elegant transition-shadow">
              <CardHeader className="text-center pb-4">
                <Target className="h-8 w-8 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">Short Break</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-2xl font-bold text-foreground mb-2">5 min</div>
                <p className="text-sm text-muted-foreground">
                  Quick recharge session
                </p>
                <Button className="w-full mt-4 bg-gradient-primary text-white hover:opacity-90"
                  onClick={() => {
                    setFocusTime(5); // Set time to 5 minutes
                    setIsFocusModeActive(true);
                  }}>
                  <Play className="h-4 w-4 mr-2" />
                  Start Session
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-elegant transition-shadow">
              <CardHeader className="text-center pb-4">
                <Brain className="h-8 w-8 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">Deep Work</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-2xl font-bold text-foreground mb-2">90 min</div>
                <p className="text-sm text-muted-foreground">
                  Extended focus period
                </p>
                <Button className="w-full mt-4 bg-gradient-primary text-white hover:opacity-90"
                  onClick={() => {
                    setFocusTime(90); // Set time to 90 minutes
                    setIsFocusModeActive(true);
                  }}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Session
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-elegant transition-shadow">
              <CardHeader className="text-center pb-4">
                <Settings className="h-8 w-8 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">Custom Time</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-2xl font-bold text-foreground mb-2">{customTimeInput} min</div>
                <p className="text-sm text-muted-foreground">
                  Set your focus duration
                </p>

                <Dialog open={isCustomDialogOpen} onOpenChange={setIsCustomDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      className="w-full mt-4 bg-gradient-primary text-white hover:opacity-90"
                      onClick={() => setIsCustomDialogOpen(true)}
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Set Time
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Set Custom Focus Time</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="minutes" className="text-right">
                          Minutes
                        </Label>
                        <Input
                          id="minutes"
                          type="number"
                          min="1"
                          value={customTimeInput}
                          onChange={(e) => setCustomTimeInput(e.target.value)}
                          className="col-span-3"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        onClick={handleCustomTimeStart}
                        className="w-full bg-gradient-primary text-white hover:opacity-90"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Start Session
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>

          {/* ... (Recent Sessions card) ... */}
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                {recentSessions.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    No sessions completed yet. Start focusing!
                  </p>
                ) : (
                  <div className="space-y-3">
                    {recentSessions.map((session, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <span className="font-medium text-foreground">
                          {Math.round(session.duration / 60)} minutes
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {session.timestamp.toLocaleDateString()} at {session.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
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