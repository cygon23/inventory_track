import React, { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MessageSquare,
  Mail,
  Phone,
  Send,
  Paperclip,
  ArrowLeft,
  User,
  Clock,
  Lock,
  CheckCheck,
  MoreVertical,
} from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

type Message = {
  id: string;
  conversation_id: string;
  customer_id: string;
  customer_name: string;
  booking_id: string;
  sender_id: string;
  sender_type: "customer" | "staff" | "system";
  sender_name: string;
  channel: string;
  type: string;
  subject: string;
  content: string;
  timestamp: string;
  status: string;
  priority: string;
  is_internal: boolean;
  read_by: string[];
  read_at: string;
};

type Conversation = {
  conversation_id: string;
  conversation_reference: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  booking_id: string;
  booking_reference: string;
  subject: string;
  channel: string;
  type: string;
  status: string;
  priority: string;
  assigned_to: string;
  assigned_to_name: string;
  message_count: number;
  unread_count: number;
  last_message_at: string;
  created_at: string;
};

type ConversationDetailProps = {
  conversationId: string;
  onBack: () => void;
};

const ConversationDetail: React.FC<ConversationDetailProps> = ({
  conversationId,
  onBack,
}) => {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState("");
  const [replyType, setReplyType] = useState<"reply" | "internal">("reply");
  const [sending, setSending] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchConversationDetails();
    fetchMessages();

    // Get current user
    const getCurrentUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: userData } = await supabase
          .from("users")
          .select("id")
          .eq("auth_user_id", user.id)
          .single();
        if (userData) setCurrentUserId(userData.id);
      }
    };
    getCurrentUser();

    // Mark conversation as read
    markAsRead();

    // Real-time subscription for new messages
    const channel = supabase
      .channel(`conversation-${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        () => {
          fetchMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchConversationDetails = async () => {
    try {
      const { data, error } = await supabase
        .from("conversation_details")
        .select("*")
        .eq("conversation_id", conversationId)
        .single();

      if (error) throw error;
      setConversation(data);
    } catch (error) {
      console.error("Error fetching conversation:", error);
    }
  };

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("timestamp", { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async () => {
    if (!currentUserId) return;

    try {
      await supabase.rpc("mark_conversation_read", {
        conv_id: conversationId,
        user_id: currentUserId,
      });
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!replyText.trim() || !currentUserId || !conversation) return;

    try {
      setSending(true);

      if (replyType === "internal") {
        // Send internal note
        await supabase.rpc("add_internal_note", {
          p_conversation_id: conversationId,
          p_user_id: currentUserId,
          p_content: replyText,
        });
      } else {
        // Send reply to customer
        await supabase.rpc("send_conversation_reply", {
          p_conversation_id: conversationId,
          p_user_id: currentUserId,
          p_content: replyText,
          p_channel: conversation.channel,
          p_is_internal: false,
        });
      }

      setReplyText("");
      fetchMessages();
      fetchConversationDetails();
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  };

  const getChannelIcon = (channel: string) => {
    const icons = {
      email: Mail,
      sms: Phone,
      whatsapp: MessageSquare,
      live_chat: MessageSquare,
      internal: MessageSquare,
    };
    const Icon = icons[channel as keyof typeof icons] || MessageSquare;
    return <Icon className='h-4 w-4' />;
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return (
      date.toLocaleDateString("en-US", { month: "short", day: "numeric" }) +
      " " +
      date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const priorityColors: Record<string, string> = {
    low: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-orange-100 text-orange-800",
    urgent: "bg-red-100 text-red-800",
  };

  const statusColors: Record<string, string> = {
    open: "bg-blue-100 text-blue-800",
    pending: "bg-yellow-100 text-yellow-800",
    resolved: "bg-green-100 text-green-800",
    closed: "bg-gray-100 text-gray-800",
  };

  if (loading && !conversation) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <p className='text-muted-foreground'>Conversation not found</p>
      </div>
    );
  }

  return (
    <div className='h-screen bg-background flex flex-col'>
      {/* Header */}
      <div className='border-b bg-card'>
        <div className='p-4'>
          <div className='flex items-center justify-between mb-4'>
            <Button variant='ghost' size='sm' onClick={onBack}>
              <ArrowLeft className='h-4 w-4 mr-2' />
              Back to Conversations
            </Button>
            <Button variant='ghost' size='sm'>
              <MoreVertical className='h-4 w-4' />
            </Button>
          </div>

          <div className='flex items-start justify-between'>
            <div className='flex items-center gap-3'>
              <Avatar className='h-12 w-12'>
                <AvatarFallback className='bg-primary/10 text-primary text-lg'>
                  {getInitials(conversation.customer_name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className='text-xl font-semibold'>
                  {conversation.customer_name}
                </h2>
                <div className='flex items-center gap-2 text-sm text-muted-foreground mt-1'>
                  {getChannelIcon(conversation.channel)}
                  <span className='capitalize'>{conversation.channel}</span>
                  <span>•</span>
                  <span>{conversation.conversation_reference}</span>
                </div>
              </div>
            </div>

            <div className='flex items-center gap-2'>
              <Badge className={statusColors[conversation.status]}>
                {conversation.status}
              </Badge>
              <Badge className={priorityColors[conversation.priority]}>
                {conversation.priority}
              </Badge>
            </div>
          </div>

          {/* Customer Info Bar */}
          <div className='mt-4 grid grid-cols-4 gap-4 text-sm'>
            <div>
              <p className='text-muted-foreground'>Email</p>
              <p className='font-medium'>
                {conversation.customer_email || "N/A"}
              </p>
            </div>
            <div>
              <p className='text-muted-foreground'>Phone</p>
              <p className='font-medium'>
                {conversation.customer_phone || "N/A"}
              </p>
            </div>
            <div>
              <p className='text-muted-foreground'>Booking</p>
              <p className='font-medium'>
                {conversation.booking_reference || "N/A"}
              </p>
            </div>
            <div>
              <p className='text-muted-foreground'>Assigned To</p>
              <div className='flex items-center gap-1 font-medium'>
                <User className='h-3 w-3' />
                {conversation.assigned_to_name || "Unassigned"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className='flex-1 overflow-y-auto p-6 bg-muted/30'>
        <div className='max-w-4xl mx-auto space-y-4'>
          {/* Conversation Subject */}
          <div className='bg-card border rounded-lg p-4 text-center'>
            <h3 className='font-semibold mb-1'>{conversation.subject}</h3>
            <p className='text-sm text-muted-foreground'>
              Conversation started {formatMessageTime(conversation.created_at)}
            </p>
          </div>

          {/* Messages */}
          {messages.map((message) => {
            const isStaff = message.sender_type === "staff";
            const isSystem = message.sender_type === "system";
            const isInternal = message.is_internal;

            if (isSystem) {
              return (
                <div key={message.id} className='flex justify-center'>
                  <div className='bg-muted px-4 py-2 rounded-full text-xs text-muted-foreground'>
                    {message.content}
                  </div>
                </div>
              );
            }

            return (
              <div
                key={message.id}
                className={`flex ${isStaff ? "justify-end" : "justify-start"}`}>
                <div
                  className={`flex gap-3 max-w-2xl ${
                    isStaff ? "flex-row-reverse" : "flex-row"
                  }`}>
                  <Avatar className='h-8 w-8 flex-shrink-0'>
                    <AvatarFallback
                      className={
                        isStaff
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary"
                      }>
                      {getInitials(message.sender_name)}
                    </AvatarFallback>
                  </Avatar>

                  <div
                    className={`flex-1 ${
                      isStaff ? "items-end" : "items-start"
                    } flex flex-col`}>
                    <div className='flex items-center gap-2 mb-1'>
                      <span className='text-sm font-medium'>
                        {message.sender_name}
                      </span>
                      {isInternal && (
                        <Badge
                          variant='secondary'
                          className='bg-amber-100 text-amber-800'>
                          <Lock className='h-3 w-3 mr-1' />
                          Internal
                        </Badge>
                      )}
                    </div>

                    <div
                      className={`rounded-lg p-3 ${
                        isInternal
                          ? "bg-amber-50 border border-amber-200"
                          : isStaff
                          ? "bg-primary text-primary-foreground"
                          : "bg-card border"
                      }`}>
                      <p className='text-sm whitespace-pre-wrap'>
                        {message.content}
                      </p>
                    </div>

                    <div
                      className={`flex items-center gap-2 mt-1 text-xs text-muted-foreground ${
                        isStaff ? "flex-row-reverse" : ""
                      }`}>
                      <Clock className='h-3 w-3' />
                      <span>{formatMessageTime(message.timestamp)}</span>
                      {isStaff && message.status === "read" && (
                        <CheckCheck className='h-3 w-3' />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Reply Area */}
      <div className='border-t bg-card'>
        <div className='p-4 max-w-4xl mx-auto'>
          <div className='space-y-3'>
            <div className='flex items-center gap-2'>
              <Select
                value={replyType}
                onValueChange={(val) =>
                  setReplyType(val as "reply" | "internal")
                }>
                <SelectTrigger className='w-40'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className='bg-popover'>
                  <SelectItem value='reply'>
                    <div className='flex items-center gap-2'>
                      <Mail className='h-4 w-4' />
                      Reply to Customer
                    </div>
                  </SelectItem>
                  <SelectItem value='internal'>
                    <div className='flex items-center gap-2'>
                      <Lock className='h-4 w-4' />
                      Internal Note
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>

              {replyType === "internal" && (
                <Badge
                  variant='secondary'
                  className='bg-amber-100 text-amber-800'>
                  Only visible to staff
                </Badge>
              )}
            </div>

            <Textarea
              placeholder={
                replyType === "reply"
                  ? "Type your reply..."
                  : "Add internal note..."
              }
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className='min-h-[100px] resize-none'
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.ctrlKey) {
                  handleSendMessage();
                }
              }}
            />

            <div className='flex items-center justify-between'>
              <Button variant='ghost' size='sm'>
                <Paperclip className='h-4 w-4 mr-2' />
                Attach File
              </Button>

              <Button
                onClick={handleSendMessage}
                disabled={sending || !replyText.trim()}>
                {sending ? (
                  <>Sending...</>
                ) : (
                  <>
                    <Send className='h-4 w-4 mr-2' />
                    Send {replyType === "internal" ? "Note" : "Reply"}
                  </>
                )}
              </Button>
            </div>

            <p className='text-xs text-muted-foreground'>
              Press Ctrl+Enter to send quickly
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationDetail;
