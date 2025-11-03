import { SidebarTrigger } from "@/components/ui/sidebar";
import { Flame, Calendar } from "lucide-react";
import { useState, useEffect } from "react"; 

const getGreeting = () => {
  const currentHour = new Date().getHours();
  if (currentHour < 12) {
    return "Good morning! 👋";
  } else if (currentHour < 18) {
    return "Good afternoon! ☀️";
  } else {
    return "Good evening! 🌙";
  }
};

// Helper function to get the formatted date
const getFormattedDate = () => {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export function AppHeader() {
  const [greeting, setGreeting] = useState(getGreeting());
  const [currentDate, setCurrentDate] = useState(getFormattedDate());

  // Mock streak data - in real app, this would come from context/state
  const streak = 7;

  useEffect(() => {
    // Update the greeting and date every minute
    const intervalId = setInterval(() => {
      setGreeting(getGreeting());
      setCurrentDate(getFormattedDate());
    }, 60000); // 60000ms = 1 minute

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array so this runs only once on mount

  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            {greeting}
          </h2>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {currentDate}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-gradient-primary text-white px-3 py-1.5 rounded-lg">
        <Flame className="h-4 w-4" />
        <span className="text-sm font-medium">{streak} day streak</span>
      </div>
    </header>
  );
}