import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  MessageSquare, 
  Mail, 
  Phone, 
  Search,
  Clock,
  User
} from 'lucide-react';

// Initialize Supabase client (replace with your actual URL and key)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
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
  channel: 'email' | 'sms' | 'whatsapp' | 'live_chat' | 'internal';
  type: string;
  status: 'open' | 'pending' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
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

const ConversationsInbox: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterChannel, setFilterChannel] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch conversations
  useEffect(() => {
    fetchConversations();
    
    // Subscribe to real-time updates
    const channel = supabase
      .channel('conversations-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations'
        },
        () => {
          fetchConversations();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        () => {
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('conversation_details')
        .select('*')
        .order('last_message_at', { ascending: false, nullsFirst: false });

      if (error) throw error;
      setConversations(data || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter conversations
  const filteredConversations = conversations.filter(conv => {
    const matchesStatus = filterStatus === 'all' || conv.status === filterStatus;
    const matchesChannel = filterChannel === 'all' || conv.channel === filterChannel;
    const matchesSearch = searchQuery === '' || 
      conv.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.conversation_reference.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesChannel && matchesSearch;
  });

  const getChannelIcon = (channel: string) => {
    const icons = {
      email: Mail,
      sms: Phone,
      whatsapp: MessageSquare,
      live_chat: MessageSquare,
      internal: MessageSquare
    };
    const Icon = icons[channel as keyof typeof icons] || MessageSquare;
    return <Icon className="h-4 w-4" />;
  };

  const channelColors: Record<string, string> = {
    email: 'bg-blue-500',
    sms: 'bg-orange-500',
    whatsapp: 'bg-green-500',
    live_chat: 'bg-purple-500',
    internal: 'bg-gray-500'
  };

  const priorityColors: Record<string, string> = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-orange-100 text-orange-800',
    urgent: 'bg-red-100 text-red-800'
  };

  const statusColors: Record<string, string> = {
    open: 'bg-blue-100 text-blue-800',
    pending: 'bg-yellow-100 text-yellow-800',
    resolved: 'bg-green-100 text-green-800',
    closed: 'bg-gray-100 text-gray-800'
  };

  const formatTime = (timestamp: string) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background p-6">
      <div className="h-full flex gap-6">
        {/* Left Panel - Conversations List */}
        <div className="w-96">
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between">
                <span>Conversations</span>
                <Badge variant="secondary">{filteredConversations.length}</Badge>
              </CardTitle>
              
              {/* Search */}
              <div className="relative mt-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {/* Filters */}
              <div className="flex gap-2 mt-3">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={filterChannel} onValueChange={setFilterChannel}>
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="all">All Channels</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 p-0 overflow-hidden">
              <div className="h-full overflow-y-auto">
                {filteredConversations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No conversations found</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {filteredConversations.map((conv) => (
                      <div
                        key={conv.conversation_id}
                        className={`p-4 cursor-pointer hover:bg-accent transition-colors ${
                          selectedConversation?.conversation_id === conv.conversation_id ? 'bg-accent' : ''
                        } ${conv.unread_count > 0 ? 'border-l-4 border-l-primary' : ''}`}
                        onClick={() => setSelectedConversation(conv)}
                      >
                        <div className="flex items-start gap-3">
                          <Avatar className="h-10 w-10 flex-shrink-0">
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {getInitials(conv.customer_name)}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <h4 className="font-medium truncate">{conv.customer_name}</h4>
                              <div className="flex items-center gap-1 flex-shrink-0">
                                <div className={`w-2 h-2 rounded-full ${channelColors[conv.channel]}`} />
                                <span className="text-xs text-muted-foreground">
                                  {formatTime(conv.last_message_at)}
                                </span>
                              </div>
                            </div>
                            
                            <p className="text-sm font-medium text-muted-foreground truncate mb-1">
                              {conv.subject}
                            </p>
                            
                            <p className="text-sm truncate text-muted-foreground">
                              {conv.last_message_preview || 'No messages yet'}
                            </p>
                            
                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                              <Badge className={statusColors[conv.status]} variant="secondary">
                                {conv.status}
                              </Badge>
                              <Badge className={priorityColors[conv.priority]} variant="secondary">
                                {conv.priority}
                              </Badge>
                              {conv.unread_count > 0 && (
                                <Badge className="bg-primary text-primary-foreground">
                                  {conv.unread_count} new
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Conversation Preview */}
        <div className="flex-1">
          {selectedConversation ? (
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary/10 text-primary text-lg">
                        {getInitials(selectedConversation.customer_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-semibold">{selectedConversation.customer_name}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {getChannelIcon(selectedConversation.channel)}
                        <span className="capitalize">{selectedConversation.channel}</span>
                        <span>•</span>
                        <span>{selectedConversation.conversation_reference}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge className={statusColors[selectedConversation.status]}>
                      {selectedConversation.status}
                    </Badge>
                    <Badge className={priorityColors[selectedConversation.priority]}>
                      {selectedConversation.priority}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Customer Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="text-sm font-medium">{selectedConversation.customer_email || 'N/A'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="text-sm font-medium">{selectedConversation.customer_phone || 'N/A'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Booking</p>
                    <p className="text-sm font-medium">{selectedConversation.booking_reference || 'N/A'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Assigned To</p>
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <p className="text-sm font-medium">{selectedConversation.assigned_to_name || 'Unassigned'}</p>
                    </div>
                  </div>
                </div>

                {/* Conversation Subject */}
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Subject</h4>
                  <p className="text-sm">{selectedConversation.subject}</p>
                </div>

                {/* Stats */}
                <div className="border-t pt-4">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{selectedConversation.message_count} messages</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Created {formatTime(selectedConversation.created_at)}</span>
                    </div>
                  </div>
                </div>

                {/* Participants */}
                {selectedConversation.participants && selectedConversation.participants.length > 0 && (
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-3">Participants</h4>
                    <div className="space-y-2">
                      {selectedConversation.participants.map((participant, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-secondary text-xs">
                                {getInitials(participant.user_name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{participant.user_name}</p>
                              <p className="text-xs text-muted-foreground capitalize">
                                {participant.user_role.replace('_', ' ')}
                              </p>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-xs capitalize">
                            {participant.participant_role}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <div className="border-t pt-4">
                  <Button className="w-full">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    View Full Conversation
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No conversation selected</h3>
                <p className="text-muted-foreground">Select a conversation from the list to view details</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversationsInbox;