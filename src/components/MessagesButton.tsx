import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const MessagesButton: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchUnreadCount();

    // Real-time subscription for message updates
    const channel = supabase
      .channel("messages-updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "conversations",
        },
        () => fetchUnreadCount()
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
        },
        () => fetchUnreadCount()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const { data, error } = await supabase
        .from("conversation_details")
        .select("unread_count");

      if (error) throw error;

      const total =
        data?.reduce((sum, conv) => sum + (conv.unread_count || 0), 0) || 0;
      setUnreadCount(total);
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  // Only show for specific roles
  const allowedRoles = [
    "admin",
    "super_admin",
    "booking_manager",
    "finance_officer",
  ];
  if (!user || !allowedRoles.includes(user.role)) {
    return null;
  }

  return (
    <Button
      variant='ghost'
      size='sm'
      className='relative hidden sm:flex'
      onClick={() => navigate("/finance/messages")}>
      <MessageSquare className='h-5 w-5' />
      {unreadCount > 0 && (
        <Badge className='absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs px-1 min-w-[1.25rem] h-5'>
          {unreadCount > 99 ? "99+" : unreadCount}
        </Badge>
      )}
    </Button>
  );
};

export default MessagesButton;
