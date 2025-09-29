import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
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
  Send, 
  Filter, 
  Search,
  MoreVertical,
  Paperclip,
  Star,
  Archive,
  Forward
} from 'lucide-react';
import { mockMessages, channelColors, priorityColors, Message } from '@/data/mockMessages';
import { useAuth } from '@/contexts/AuthContext';

const CentralizedMessages: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [filterChannel, setFilterChannel] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [replyText, setReplyText] = useState('');

  const filteredMessages = mockMessages.filter(message => {
    const matchesChannel = filterChannel === 'all' || message.channel === filterChannel;
    const matchesStatus = filterStatus === 'all' || message.status === filterStatus;
    const matchesSearch = searchQuery === '' || 
      message.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesChannel && matchesStatus && matchesSearch;
  });

  const getChannelIcon = (channel: string) => {
    const icons = {
      whatsapp: MessageSquare,
      email: Mail,
      live_chat: MessageSquare,
      sms: Phone,
      internal: MessageSquare
    };
    const Icon = icons[channel as keyof typeof icons] || MessageSquare;
    return <Icon className="h-4 w-4" />;
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  const handleSendReply = () => {
    if (replyText.trim() && selectedMessage) {
      // In real app, this would send the message
      console.log('Sending reply:', replyText);
      setReplyText('');
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-6">
      {/* Left Panel - Message List */}
      <div className="w-1/3">
        <Card className="h-full">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-between">
              Messages
              <Badge variant="secondary">{filteredMessages.length}</Badge>
            </CardTitle>
            
            {/* Search and Filters */}
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2">
                <Select value={filterChannel} onValueChange={setFilterChannel}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Channel" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="all">All Channels</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="live_chat">Live Chat</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="internal">Internal</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="unread">Unread</SelectItem>
                    <SelectItem value="read">Read</SelectItem>
                    <SelectItem value="replied">Replied</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            <div className="divide-y divide-border max-h-[calc(100vh-20rem)] overflow-y-auto">
              {filteredMessages.map((message) => (
                <div
                  key={message.id}
                  className={`p-4 cursor-pointer hover:bg-accent transition-colors ${
                    selectedMessage?.id === message.id ? 'bg-accent' : ''
                  } ${message.status === 'unread' ? 'border-l-4 border-l-primary' : ''}`}
                  onClick={() => setSelectedMessage(message)}
                >
                  <div className="flex items-start space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={message.customerAvatar} />
                      <AvatarFallback>
                        {message.customerName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium truncate">{message.customerName}</h4>
                        <div className="flex items-center space-x-1">
                          <div className={`w-2 h-2 rounded-full ${channelColors[message.channel]}`} />
                          <span className="text-xs text-muted-foreground">
                            {formatTime(message.timestamp)}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground truncate mt-1">
                        {message.subject}
                      </p>
                      
                      <p className="text-sm truncate mt-1">{message.content}</p>
                      
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge className={priorityColors[message.priority]} variant="secondary">
                          {message.priority}
                        </Badge>
                        {message.assignedToName && (
                          <Badge variant="outline" className="text-xs">
                            {message.assignedToName}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Panel - Message Detail and Reply */}
      <div className="flex-1">
        {selectedMessage ? (
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={selectedMessage.customerAvatar} />
                    <AvatarFallback>
                      {selectedMessage.customerName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">{selectedMessage.customerName}</h3>
                    <div className="flex items-center space-x-2">
                      {getChannelIcon(selectedMessage.channel)}
                      <span className="text-sm text-muted-foreground capitalize">
                        {selectedMessage.channel.replace('_', ' ')}
                      </span>
                      <Badge className={priorityColors[selectedMessage.priority]} variant="secondary">
                        {selectedMessage.priority}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Star className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Archive className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Forward className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col">
              {/* Message Content */}
              <div className="flex-1 space-y-4 mb-4">
                <div className="bg-accent/50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{selectedMessage.subject}</h4>
                    <span className="text-sm text-muted-foreground">
                      {formatTime(selectedMessage.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm">{selectedMessage.content}</p>
                  
                  {selectedMessage.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {selectedMessage.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag.replace('_', ' ')}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Reply Section */}
              <div className="border-t pt-4">
                <div className="space-y-3">
                  <Textarea
                    placeholder="Type your reply..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="min-h-[100px]"
                  />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Paperclip className="h-4 w-4" />
                        Attach
                      </Button>
                      
                      <Select defaultValue="reply">
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-popover">
                          <SelectItem value="reply">Reply</SelectItem>
                          <SelectItem value="forward">Forward</SelectItem>
                          <SelectItem value="internal">Internal Note</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        Save Draft
                      </Button>
                      <Button onClick={handleSendReply} size="sm">
                        <Send className="h-4 w-4 mr-2" />
                        Send Reply
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="h-full flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">Select a message</h3>
              <p className="text-muted-foreground">Choose a message from the list to view details and reply</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CentralizedMessages;