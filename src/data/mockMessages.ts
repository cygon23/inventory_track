// Mock data for centralized messaging system
export interface Message {
  id: string;
  customerId: string;
  customerName: string;
  customerAvatar: string;
  channel: 'whatsapp' | 'email' | 'live_chat' | 'sms' | 'internal';
  type: 'booking_inquiry' | 'payment_issue' | 'trip_question' | 'complaint' | 'support' | 'internal';
  subject: string;
  content: string;
  timestamp: string;
  status: 'unread' | 'read' | 'replied' | 'resolved';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: string;
  assignedToName?: string;
  tags: string[];
  attachments?: string[];
}

export interface Conversation {
  id: string;
  customerId: string;
  messages: Message[];
  lastActivity: string;
  status: 'active' | 'resolved' | 'pending';
  assignedStaff?: string;
}

export const mockMessages: Message[] = [
  {
    id: '1',
    customerId: 'c1',
    customerName: 'John Smith',
    customerAvatar: '/placeholder.svg',
    channel: 'whatsapp',
    type: 'booking_inquiry',
    subject: 'Serengeti Safari Inquiry',
    content: 'Hi! I\'m interested in a 5-day Serengeti safari for 4 people in March. Could you send me a quote?',
    timestamp: '2024-01-10T10:30:00Z',
    status: 'unread',
    priority: 'medium',
    tags: ['new_inquiry', 'serengeti', 'group_booking'],
    assignedTo: '3',
    assignedToName: 'Michael Chen'
  },
  {
    id: '2',
    customerId: 'c2',
    customerName: 'Emma Thompson',
    customerAvatar: '/placeholder.svg',
    channel: 'email',
    type: 'payment_issue',
    subject: 'Payment Failed for Booking #SF001',
    content: 'My credit card payment failed for booking SF001. Please help me complete the payment.',
    timestamp: '2024-01-10T09:15:00Z',
    status: 'read',
    priority: 'high',
    tags: ['payment_failed', 'urgent'],
    assignedTo: '6',
    assignedToName: 'Lisa Johnson'
  },
  {
    id: '3',
    customerId: 'c3',
    customerName: 'Carlos Rodriguez',
    customerAvatar: '/placeholder.svg',
    channel: 'live_chat',
    type: 'trip_question',
    subject: 'Questions about upcoming Ngorongoro trip',
    content: 'What should I pack for the Ngorongoro crater tour next week? Also, what time is pickup?',
    timestamp: '2024-01-10T08:45:00Z',
    status: 'replied',
    priority: 'low',
    tags: ['ngorongoro', 'trip_preparation'],
    assignedTo: '4',
    assignedToName: 'Amara Kimani'
  },
  {
    id: '4',
    customerId: 'c4',
    customerName: 'Anna Johansson',
    customerAvatar: '/placeholder.svg',
    channel: 'sms',
    type: 'complaint',
    subject: 'Disappointed with service',
    content: 'The guide was late and the vehicle was not clean. Very disappointing experience.',
    timestamp: '2024-01-09T16:20:00Z',
    status: 'read',
    priority: 'urgent',
    tags: ['complaint', 'service_quality'],
    assignedTo: '7',
    assignedToName: 'Grace Mwangi'
  },
  {
    id: '5',
    customerId: 'c5',
    customerName: 'Robert Kim',
    customerAvatar: '/placeholder.svg',
    channel: 'email',
    type: 'booking_inquiry',
    subject: 'Last minute availability?',
    content: 'Do you have any availability for this weekend? Looking for 2 people for a day trip to Tarangire.',
    timestamp: '2024-01-10T07:30:00Z',
    status: 'unread',
    priority: 'medium',
    tags: ['last_minute', 'tarangire', 'day_trip'],
    assignedTo: '3',
    assignedToName: 'Michael Chen'
  }
];

export const mockConversations: Conversation[] = [
  {
    id: 'conv1',
    customerId: 'c1',
    messages: [mockMessages[0]],
    lastActivity: '2024-01-10T10:30:00Z',
    status: 'active',
    assignedStaff: '3'
  },
  {
    id: 'conv2',
    customerId: 'c2',
    messages: [mockMessages[1]],
    lastActivity: '2024-01-10T09:15:00Z',
    status: 'pending',
    assignedStaff: '6'
  }
];

export const channelColors = {
  whatsapp: 'bg-green-500',
  email: 'bg-blue-500',
  live_chat: 'bg-purple-500',
  sms: 'bg-orange-500',
  internal: 'bg-gray-500'
};

export const priorityColors = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800'
};