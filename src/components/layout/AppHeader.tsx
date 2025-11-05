import { SidebarTrigger } from "@/components/ui/sidebar";
import { Calendar, LogOut, User as UserIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Helper function to get the correct greeting
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
  const { user, logout } = useAuth(); // Get user info

  // Get user initials for the avatar
  const getInitials = (email: string | null | undefined) => {
    if (!email) return '??';
    return email.substring(0, 2).toUpperCase();
  };

  useEffect(() => {
    // Update the greeting and date every minute
    const intervalId = setInterval(() => {
      setGreeting(getGreeting());
      setCurrentDate(getFormattedDate());
    }, 60000); // 60000ms = 1 minute

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

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

      {/* --- NEW USER ACCOUNT DROPDOWN --- */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-9 w-9 rounded-full">
            <Avatar className="h-9 w-9">
              {/* Add AvatarImage if you store profile pics later */}
              {/* <AvatarImage src={user.avatarUrl} alt={user.email} /> */}
              <AvatarFallback className="bg-gradient-primary text-white font-medium">
                {getInitials(user?.email)}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">My Account</p>
              <p className="text-xs leading-none text-muted-foreground truncate">
                {user?.email || 'No user'}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}