import React from "react";
import { useLocation, Link } from "react-router-dom";
import {
  Home,
  Users,
  Calendar,
  MessageSquare,
  BarChart3,
  Settings,
  User,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface LayoutProps {
  children: React.ReactNode;
  userType?: "client" | "staff" | "field";
}

const navigationItems = {
  client: [
    { path: "/", icon: Home, label: "Dashboard" },
    { path: "/documents", icon: Calendar, label: "Documents" },
    { path: "/messages", icon: MessageSquare, label: "Messages" },
    { path: "/profile", icon: User, label: "Profile" },
    { path: "#", icon: Settings, label: "Settings" },
    { path: "", icon: Settings, label: "logout" },
  ],
  staff: [
    { path: "/staff", icon: Home, label: "Dashboard" },
    { path: "/staff/clients", icon: Users, label: "Clients" },
    { path: "/staff/analytics", icon: BarChart3, label: "Analytics" },
    { path: "/staff/messages", icon: MessageSquare, label: "Messages" },
    { path: "/staff/settings", icon: Settings, label: "Settings" },
    { path: "", icon: Settings, label: "logout" },
  ],
  field: [
    { path: "/field", icon: Home, label: "Today" },
    { path: "/field/schedule", icon: Calendar, label: "Schedule" },
    { path: "/field/clients", icon: Users, label: "Clients" },
    { path: "/field/location", icon: MapPin, label: "Location" },
    { path: "#", icon: Settings, label: "Settings" },
    { path: "", icon: Settings, label: "logout" },
  ],
};

export const Layout: React.FC<LayoutProps> = ({
  children,
  userType = "client",
}) => {
  // Safe location check - fallback if not in Router context
  let location;
  let hasRouterContext = true;
  try {
    location = useLocation();
  } catch (error) {
    // Fallback when not in Router context
    location = { pathname: "/" };
    hasRouterContext = false;
  }
  const navItems = navigationItems[userType];

  // Safe navigation function for when not in router context
  const handleNavigation = (path: string) => {
    if (hasRouterContext) {
      // This won't be called if hasRouterContext is false
      return;
    }
    window.location.href = path;
  };

  return (
    <div className='min-h-screen bg-gradient-earth'>
      {/* Top Navigation */}
      <header className='bg-card border-b border-border shadow-warm'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between h-16'>
            <div className='flex items-center space-x-4'>
              <div className='flex items-center space-x-2'>
                <div className='w-8 h-8 safari-gradient rounded-lg flex items-center justify-center'>
                  <span className='text-primary-foreground font-bold text-sm'>
                    LT
                  </span>
                </div>
                <h1 className='text-xl font-bold text-foreground'>
                  Lion Track Safari
                </h1>
              </div>
              <div className='hidden md:block'>
                <span className='text-sm text-muted-foreground capitalize'>
                  {userType} Portal
                </span>
              </div>
            </div>

            <div className='flex items-center space-x-4'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => window.open("/nav", "_blank")}>
                Switch Portal
              </Button>
              <div className='hidden md:flex items-center space-x-2'>
                <div className='w-8 h-8 bg-secondary rounded-full'></div>
                <span className='text-sm font-medium'>Welcome back!</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className='flex'>
        {/* Sidebar Navigation */}
        <aside className='w-64 bg-card border-r border-border shadow-warm hidden md:block'>
          <nav className='mt-8 px-4'>
            <div className='space-y-2'>
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;

                if (hasRouterContext) {
                  return (
                    <Link key={item.path} to={item.path}>
                      <Button
                        variant={isActive ? "default" : "ghost"}
                        className={`w-full justify-start ${
                          isActive
                            ? "safari-gradient text-primary-foreground"
                            : "hover:bg-secondary"
                        }`}>
                        <item.icon className='mr-3 h-4 w-4' />
                        {item.label}
                      </Button>
                    </Link>
                  );
                } else {
                  return (
                    <Button
                      key={item.path}
                      variant={isActive ? "default" : "ghost"}
                      className={`w-full justify-start ${
                        isActive
                          ? "safari-gradient text-primary-foreground"
                          : "hover:bg-secondary"
                      }`}
                      onClick={() => handleNavigation(item.path)}>
                      <item.icon className='mr-3 h-4 w-4' />
                      {item.label}
                    </Button>
                  );
                }
              })}
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className='flex-1 overflow-hidden'>
          <div className='p-6 md:p-8'>{children}</div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className='md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border'>
        <div className='flex items-center justify-around py-2'>
          {navItems.slice(0, 4).map((item) => {
            const isActive = location.pathname === item.path;

            if (hasRouterContext) {
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex flex-col items-center p-2 ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}>
                  <item.icon className='h-5 w-5' />
                  <span className='text-xs mt-1'>{item.label}</span>
                </Link>
              );
            } else {
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`flex flex-col items-center p-2 ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}>
                  <item.icon className='h-5 w-5' />
                  <span className='text-xs mt-1'>{item.label}</span>
                </button>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
};
