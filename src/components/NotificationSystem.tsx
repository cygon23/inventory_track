import React, { useEffect, useRef } from 'react';
import { Bell, CheckCircle, AlertTriangle, Info, X } from 'lucide-react';
import { gsap } from 'gsap';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface NotificationSystemProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onDismiss: (id: string) => void;
}

export const NotificationSystem: React.FC<NotificationSystemProps> = ({
  notifications,
  onMarkAsRead,
  onDismiss
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && notifications.length > 0) {
      gsap.from(containerRef.current.children, {
        opacity: 0,
        x: 50,
        duration: 0.4,
        stagger: 0.1,
        ease: "power2.out"
      });
    }
  }, [notifications]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4 text-success" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-warning" />;
      case 'error': return <AlertTriangle className="w-4 h-4 text-destructive" />;
      case 'info': return <Info className="w-4 h-4 text-primary" />;
      default: return <Bell className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-success/10 border-success/20';
      case 'warning': return 'bg-warning/10 border-warning/20';
      case 'error': return 'bg-destructive/10 border-destructive/20';
      case 'info': return 'bg-primary/10 border-primary/20';
      default: return 'bg-muted/10 border-border';
    }
  };

  if (notifications.length === 0) {
    return (
      <div className="text-center p-8">
        <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No notifications</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="space-y-3">
      {notifications.map((notification) => (
        <Card 
          key={notification.id}
          className={`safari-card ${getTypeColor(notification.type)} ${
            !notification.read ? 'ring-2 ring-primary/20' : ''
          }`}
        >
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className="mt-0.5">
                {getIcon(notification.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-foreground">
                      {notification.title}
                      {!notification.read && (
                        <Badge className="ml-2 bg-primary text-primary-foreground text-xs">
                          New
                        </Badge>
                      )}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(notification.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1 ml-2">
                    {!notification.read && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onMarkAsRead(notification.id)}
                        className="h-6 w-6 p-0"
                      >
                        <CheckCircle className="w-3 h-3" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onDismiss(notification.id)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// Mock notifications for demo
export const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'success',
    title: 'Payment Confirmed',
    message: 'Your final payment has been received and processed successfully.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read: false
  },
  {
    id: '2',
    type: 'info',
    title: 'Safari Guide Assigned',
    message: 'John Kimani has been assigned as your safari guide. Contact details sent via email.',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    read: false
  },
  {
    id: '3',
    type: 'warning',
    title: 'Weather Update',
    message: 'Light rain expected during your safari. Packing list updated with rain gear.',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    read: true
  },
  {
    id: '4',
    type: 'info',
    title: 'Pre-Safari Briefing',
    message: 'Join our virtual briefing session tomorrow at 3 PM to prepare for your adventure.',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    read: true
  }
];