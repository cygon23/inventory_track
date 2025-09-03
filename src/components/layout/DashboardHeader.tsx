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
import { Bell, MessageSquare, Settings, LogOut, MapPin, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { User, roleColors } from '@/data/mockUsers';

interface DashboardHeaderProps {
  currentUser: User;
  onLogout: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ currentUser, onLogout }) => {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatRole = (role: string) => {
    return role.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 shadow-warm">
      {/* Left side - Logo and Search */}
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-safari rounded-lg flex items-center justify-center">
            <MapPin className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">Lion Track Safari</h1>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customers, bookings..."
            className="pl-10 w-80"
          />
        </div>
      </div>

      {/* Right side - Notifications and User Menu */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          <Badge className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs px-1 min-w-[1.25rem] h-5">
            3
          </Badge>
        </Button>

        {/* Messages */}
        <Button variant="ghost" size="sm" className="relative">
          <MessageSquare className="h-5 w-5" />
          <Badge className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs px-1 min-w-[1.25rem] h-5">
            12
          </Badge>
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-3 p-2">
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-sm font-medium">{currentUser.name}</div>
                  <div className="flex items-center space-x-2">
                    <Badge className={`text-xs ${roleColors[currentUser.role]}`}>
                      {formatRole(currentUser.role)}
                    </Badge>
                  </div>
                </div>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={currentUser.avatar} />
                  <AvatarFallback>{getInitials(currentUser.name)}</AvatarFallback>
                </Avatar>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-popover">
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Bell className="mr-2 h-4 w-4" />
              Notifications
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout} className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default DashboardHeader;