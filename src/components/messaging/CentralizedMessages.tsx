import React, { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Search,
  Clock,
  User,
  Paperclip,
  Lock,
  CheckCheck,
  MoreVertical,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

type Conversation = {
  conversation_id: string;
  conversation_reference: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  booking_id: string;
  booking_reference: string;
  subject: string;
  channel: "email" | "sms" | "whatsapp" | "live_chat" | "internal";
  type: string;
  status: "open" | "pending" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  assigned_to: string;
  assigned_to_name: string;
  message_count: number;
  unread_count: number;
  last_message_at: string;
  last_message_preview: string;
  created_at: string;
  participants: Array<{
    user_id: string;
    user_name: string;
    user_role: string;
    participant_role: string;
  }>;
};

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

const ConversationsSystem: React.FC = () => {
  const [view, setView] = useState<"list" | "detail">("list");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterChannel, setFilterChannel] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [replyText, setReplyText] = useState("");
  const [replyType, setReplyType] = useState<"reply" | "internal">("reply");
  const [sending, setSending] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initializeSystem();
  }, []);

  useEffect(() => {
    if (view === "detail" && selectedConversation) {
      fetchMessages(selectedConversation.conversation_id);
      markAsRead(selectedConversation.conversation_id);
    }
  }, [view, selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeSystem = async () => {
    // Get current user
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

    // Fetch conversations
    await fetchConversations();

    // Subscribe to real-time updates
    const conversationsChannel = supabase
      .channel("conversations-system")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "conversations" },
        () => fetchConversations()
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          fetchConversations();
          if (
            selectedConversation &&
            payload.new.conversation_id === selectedConversation.conversation_id
          ) {
            fetchMessages(selectedConversation.conversation_id);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(conversationsChannel);
    };
  };

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("conversation_details")
        .select("*")
        .order("last_message_at", { ascending: false, nullsFirst: false });

      if (error) throw error;
      setConversations(data || []);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      setMessagesLoading(true);
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
      setMessagesLoading(false);
    }
  };

  const markAsRead = async (conversationId: string) => {
    if (!currentUserId) return;

    try {
      await supabase.rpc("mark_conversation_read", {
        conv_id: conversationId,
        user_id: currentUserId,
      });
      // Refresh conversation list to update unread count
      fetchConversations();
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setView("detail");
    setReplyText("");
    setReplyType("reply");
  };

  const handleBackToList = () => {
    setView("list");
    setSelectedConversation(null);
    setMessages([]);
  };

  const handleSendMessage = async () => {
    if (!replyText.trim() || !currentUserId || !selectedConversation) return;

    try {
      setSending(true);

      if (replyType === "internal") {
        await supabase.rpc("add_internal_note", {
          p_conversation_id: selectedConversation.conversation_id,
          p_user_id: currentUserId,
          p_content: replyText,
        });
      } else {
        await supabase.rpc("send_conversation_reply", {
          p_conversation_id: selectedConversation.conversation_id,
          p_user_id: currentUserId,
          p_content: replyText,
          p_channel: selectedConversation.channel,
          p_is_internal: false,
        });
      }

      setReplyText("");
      await fetchMessages(selectedConversation.conversation_id);
      await fetchConversations();
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const filteredConversations = conversations.filter((conv) => {
    const matchesStatus =
      filterStatus === "all" || conv.status === filterStatus;
    const matchesChannel =
      filterChannel === "all" || conv.channel === filterChannel;
    const matchesSearch =
      searchQuery === "" ||
      conv.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.conversation_reference
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    return matchesStatus && matchesChannel && matchesSearch;
  });

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

  const channelColors: Record<string, string> = {
    email: "bg-blue-500",
    sms: "bg-orange-500",
    whatsapp: "bg-green-500",
    live_chat: "bg-purple-500",
    internal: "bg-gray-500",
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

  const formatTime = (timestamp: string) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
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

  // LIST VIEW
  if (view === "list") {
    return (
      <div className='h-screen bg-background p-6'>
        <div className='h-full max-w-7xl mx-auto'>
          <Card className='h-full flex flex-col'>
            <CardHeader className='pb-4'>
              <div className='flex items-center justify-between mb-4'>
                <CardTitle className='flex items-center gap-2'>
                  <MessageSquare className='h-6 w-6' />
                  Conversations
                  <Badge variant='secondary'>
                    {filteredConversations.length}
                  </Badge>
                </CardTitle>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={fetchConversations}>
                  <RefreshCw className='h-4 w-4 mr-2' />
                  Refresh
                </Button>
              </div>

              <div className='space-y-3'>
                <div className='relative'>
                  <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                  <Input
                    placeholder='Search by customer, subject, or reference...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='pl-10'
                  />
                </div>

                <div className='flex gap-2'>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className='flex-1'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className='bg-popover'>
                      <SelectItem value='all'>All Status</SelectItem>
                      <SelectItem value='open'>Open</SelectItem>
                      <SelectItem value='pending'>Pending</SelectItem>
                      <SelectItem value='resolved'>Resolved</SelectItem>
                      <SelectItem value='closed'>Closed</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={filterChannel}
                    onValueChange={setFilterChannel}>
                    <SelectTrigger className='flex-1'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className='bg-popover'>
                      <SelectItem value='all'>All Channels</SelectItem>
                      <SelectItem value='email'>Email</SelectItem>
                      <SelectItem value='sms'>SMS</SelectItem>
                      <SelectItem value='whatsapp'>WhatsApp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>

            <CardContent className='flex-1 p-0 overflow-hidden'>
              {loading ? (
                <div className='flex items-center justify-center h-full'>
                  <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className='flex flex-col items-center justify-center h-full p-8 text-center'>
                  <MessageSquare className='h-16 w-16 text-muted-foreground mb-4' />
                  <h3 className='text-lg font-medium mb-2'>
                    No conversations found
                  </h3>
                  <p className='text-muted-foreground'>
                    Try adjusting your filters or search query
                  </p>
                </div>
              ) : (
                <div className='h-full overflow-y-auto divide-y divide-border'>
                  {filteredConversations.map((conv) => (
                    <div
                      key={conv.conversation_id}
                      className={`p-4 cursor-pointer hover:bg-accent transition-colors ${
                        conv.unread_count > 0
                          ? "border-l-4 border-l-primary"
                          : ""
                      }`}
                      onClick={() => handleSelectConversation(conv)}>
                      <div className='flex items-start gap-3'>
                        <Avatar className='h-12 w-12 flex-shrink-0'>
                          <AvatarFallback className='bg-primary/10 text-primary'>
                            {getInitials(conv.customer_name)}
                          </AvatarFallback>
                        </Avatar>

                        <div className='flex-1 min-w-0'>
                          <div className='flex items-center justify-between gap-2 mb-1'>
                            <h4 className='font-semibold truncate'>
                              {conv.customer_name}
                            </h4>
                            <div className='flex items-center gap-1 flex-shrink-0'>
                              <div
                                className={`w-2 h-2 rounded-full ${
                                  channelColors[conv.channel]
                                }`}
                              />
                              <span className='text-xs text-muted-foreground'>
                                {formatTime(conv.last_message_at)}
                              </span>
                            </div>
                          </div>

                          <p className='text-sm font-medium text-foreground truncate mb-1'>
                            {conv.subject}
                          </p>

                          <p className='text-sm truncate text-muted-foreground mb-2'>
                            {conv.last_message_preview || "No messages yet"}
                          </p>

                          <div className='flex items-center gap-2 flex-wrap'>
                            <Badge
                              className={statusColors[conv.status]}
                              variant='secondary'>
                              {conv.status}
                            </Badge>
                            <Badge
                              className={priorityColors[conv.priority]}
                              variant='secondary'>
                              {conv.priority}
                            </Badge>
                            {conv.unread_count > 0 && (
                              <Badge className='bg-primary text-primary-foreground'>
                                {conv.unread_count} new
                              </Badge>
                            )}
                            <div className='flex items-center gap-1 text-xs text-muted-foreground'>
                              <MessageSquare className='h-3 w-3' />
                              {conv.message_count}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // DETAIL VIEW
  if (!selectedConversation) return null;

  return (
    <div className='h-screen bg-background flex flex-col'>
      {/* Header */}
      <div className='border-b bg-card'>
        <div className='p-4 max-w-7xl mx-auto'>
          <div className='flex items-center justify-between mb-4'>
            <Button variant='ghost' size='sm' onClick={handleBackToList}>
              <ArrowLeft className='h-4 w-4 mr-2' />
              Back to Conversations
            </Button>
            <Button variant='ghost' size='sm'>
              <MoreVertical className='h-4 w-4' />
            </Button>
          </div>

          <div className='flex items-start justify-between'>
            <div className='flex items-center gap-3'>
              <Avatar className='h-14 w-14'>
                <AvatarFallback className='bg-primary/10 text-primary text-lg'>
                  {getInitials(selectedConversation.customer_name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className='text-2xl font-bold'>
                  {selectedConversation.customer_name}
                </h2>
                <div className='flex items-center gap-2 text-sm text-muted-foreground mt-1'>
                  {getChannelIcon(selectedConversation.channel)}
                  <span className='capitalize'>
                    {selectedConversation.channel}
                  </span>
                  <span>•</span>
                  <span>{selectedConversation.conversation_reference}</span>
                </div>
              </div>
            </div>

            <div className='flex items-center gap-2'>
              <Badge className={statusColors[selectedConversation.status]}>
                {selectedConversation.status}
              </Badge>
              <Badge className={priorityColors[selectedConversation.priority]}>
                {selectedConversation.priority}
              </Badge>
            </div>
          </div>

          <div className='mt-4 grid grid-cols-4 gap-4 text-sm'>
            <div>
              <p className='text-muted-foreground'>Email</p>
              <p className='font-medium'>
                {selectedConversation.customer_email || "N/A"}
              </p>
            </div>
            <div>
              <p className='text-muted-foreground'>Phone</p>
              <p className='font-medium'>
                {selectedConversation.customer_phone || "N/A"}
              </p>
            </div>
            <div>
              <p className='text-muted-foreground'>Booking</p>
              <p className='font-medium'>
                {selectedConversation.booking_reference || "N/A"}
              </p>
            </div>
            <div>
              <p className='text-muted-foreground'>Assigned To</p>
              <div className='flex items-center gap-1 font-medium'>
                <User className='h-3 w-3' />
                {selectedConversation.assigned_to_name || "Unassigned"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className='flex-1 overflow-y-auto p-6 bg-muted/30'>
        {messagesLoading ? (
          <div className='flex items-center justify-center h-full'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
          </div>
        ) : (
          <div className='max-w-4xl mx-auto space-y-4'>
            <div className='bg-card border rounded-lg p-4 text-center'>
              <h3 className='font-semibold mb-1'>
                {selectedConversation.subject}
              </h3>
              <p className='text-sm text-muted-foreground'>
                Started {formatMessageTime(selectedConversation.created_at)}
              </p>
            </div>

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
                  className={`flex ${
                    isStaff ? "justify-end" : "justify-start"
                  }`}>
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
        )}
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
                <SelectTrigger className='w-48'>
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
              <div className='flex items-center gap-2'>
                <Button variant='ghost' size='sm'>
                  <Paperclip className='h-4 w-4 mr-2' />
                  Attach File
                </Button>
                <span className='text-xs text-muted-foreground'>
                  Ctrl+Enter to send
                </span>
              </div>

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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationsSystem;
