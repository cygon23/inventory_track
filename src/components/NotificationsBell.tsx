import React from "react";
import { Bell, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useNotifications } from "@/hooks/useNotifications";
import {
  markNotificationRead,
  dismissNotification,
  type AppNotification,
} from "@/services/notificationService";

function renderTypeBadge(type: string) {
  const map: Record<string, string> = {
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    error: "bg-red-100 text-red-800",
    info: "bg-blue-100 text-blue-800",
  };
  return <span className={`px-1.5 py-0.5 rounded text-xs ${map[type] || map.info}`}>{type}</span>;
}

export const NotificationsBell: React.FC = () => {
  const { notifications } = useNotifications();
  const unread = notifications.filter((n) => !n.read_at && !n.dismissed_at);

  const onMarkAsRead = async (n: AppNotification) => {
    await markNotificationRead(n.id);
  };
  const onDismiss = async (n: AppNotification) => {
    await dismissNotification(n.id);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative hidden sm:flex">
          <Bell className="h-5 w-5" />
          {unread.length > 0 && (
            <Badge className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs px-1 min-w-[1.25rem] h-5">
              {unread.length}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96 max-h-[70vh] overflow-auto bg-popover p-0">
        <DropdownMenuLabel className="flex items-center justify-between p-3">
          <span className="font-semibold">Notifications</span>
          <span className="text-xs text-muted-foreground">{unread.length} unread</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <div className="p-4 text-sm text-muted-foreground">No notifications</div>
        ) : (
          notifications.map((n) => (
            <div key={n.id} className="px-3 py-2 border-b border-border/60">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    {renderTypeBadge(n.type)}
                    <div className="font-medium truncate">{n.title}</div>
                  </div>
                  <div className="text-sm text-muted-foreground break-words mt-0.5">
                    {n.message}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {new Date(n.created_at).toLocaleString()}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {!n.read_at && (
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onMarkAsRead(n)}>
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onDismiss(n)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationsBell;
