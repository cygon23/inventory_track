import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Bell, MessageSquare, Settings, LogOut, MapPin, Search, Menu } from 'lucide-react';
import NotificationsBell from '@/components/NotificationsBell';
import MessagesButton from "@/components/MessagesButton";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { roleColors } from "@/lib/constants";
import { useNavigate } from "react-router-dom";

interface DashboardHeaderProps {
  onLogout: () => void;
  onMenuClick: () => void;
  isMobile: boolean;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onLogout,
  onMenuClick,
  isMobile,
}) => {
  const { user: currentUser } = useAuth();
  if (!currentUser) {
    return (
      <header className='h-16 bg-card border-b border-border flex items-center justify-between px-4 md:px-6 shadow-warm relative z-30' />
    );
  }
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const formatRole = (role: string) => {
    return role
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const navigate = useNavigate();

  return (
    <header className='h-16 bg-card border-b border-border flex items-center justify-between px-4 md:px-6 shadow-warm relative z-30'>
      {/* Left side - Menu Button (Mobile) + Logo and Search */}
      <div className='flex items-center space-x-4 md:space-x-6 flex-1'>
        {/* Mobile menu button */}
        {isMobile && (
          <Button variant='ghost' size='sm' onClick={onMenuClick}>
            <Menu className='h-5 w-5' />
          </Button>
        )}

        <div className='flex items-center space-x-3'>
          <div className='w-8 h-8 bg-gradient-safari rounded-lg flex items-center justify-center'>
            <MapPin className='h-4 w-4 text-white' />
          </div>
          <div>
            <h1 className='text-lg font-semibold text-foreground hidden sm:block'>
              Lion Track Safari
            </h1>
            <h1 className='text-sm font-semibold text-foreground sm:hidden'>
              LTS
            </h1>
          </div>
        </div>

        {/* Search - hidden on mobile */}
        <div className='relative hidden md:block'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='Search customers, bookings...'
            className='pl-10 w-60 lg:w-80'
          />
        </div>
      </div>

      {/* Right side - Notifications and User Menu */}
      <div className='flex items-center space-x-2 md:space-x-4'>
        {/* Notifications */}
        <NotificationsBell />

        {/* Messages */}
        <MessagesButton />

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='ghost'
              className='flex items-center space-x-2 md:space-x-3 p-2'>
              <div className='flex items-center space-x-2 md:space-x-3'>
                <div className='text-right hidden md:block'>
                  <div className='text-sm font-medium'>
                    {currentUser?.name || ""}
                  </div>
                  <div className='flex items-center space-x-2'>
                    <Badge
                      className={`text-xs ${
                        currentUser ? roleColors[currentUser.role] : ""
                      }`}>
                      {currentUser ? formatRole(currentUser.role) : ""}
                    </Badge>
                  </div>
                </div>
                <Avatar className='h-8 w-8'>
                  <AvatarImage src={currentUser?.avatar || ""} />
                  <AvatarFallback>
                    {currentUser ? getInitials(currentUser.name) : ""}
                  </AvatarFallback>
                </Avatar>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-56 bg-popover'>
            <DropdownMenuItem onClick={() => navigate("/profile")}>
              <Settings className='mr-2 h-4 w-4' />
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Bell className='mr-2 h-4 w-4' />
              Notifications
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout} className='text-destructive'>
              <LogOut className='mr-2 h-4 w-4' />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default DashboardHeader;