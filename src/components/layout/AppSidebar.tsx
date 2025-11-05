import { Home, BarChart3, Focus, Moon, Sun } from "lucide-react"; // Removed LogOut
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
// We no longer need useAuth here

const navigation = [
  { title: "Home", url: "/", icon: Home },
  { title: "Insights", url: "/insights", icon: BarChart3 },
  { title: "Focus Mode", url: "/focus", icon: Focus },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  // We no longer need user or logout here
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-sidebar-accent text-sidebar-primary font-medium" : "hover:bg-sidebar-accent/50";

  return (
    <Sidebar
      collapsible="icon"
    >
      <SidebarHeader className="p-4">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Focus className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-xl font-bold text-sidebar-foreground">TaskForge</h1>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer is now just the theme toggle */}
      <SidebarFooter className="p-4 space-y-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className="w-full justify-center"
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
          {!collapsed && (
            <span className="ml-2">
              {theme === 'dark' ? 'Light' : 'Dark'} Mode
            </span>
          )}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}