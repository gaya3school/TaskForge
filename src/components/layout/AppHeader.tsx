import { SidebarTrigger } from "@/components/ui/sidebar";
import { Flame, Calendar } from "lucide-react";

export function AppHeader() {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Mock streak data - in real app, this would come from context/state
  const streak = 7;

  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Good morning! 👋
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