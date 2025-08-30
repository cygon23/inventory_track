// Mock data for Lion Track Safari system
export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  profileImage: string;
  journeyStatus: 'submitted' | 'confirmed' | 'arrived' | 'completed';
  safariPackage: string;
  bookingDate: string;
  safariDates: {
    start: string;
    end: string;
  };
  totalCost: number;
  paidAmount: number;
  specialRequirements: string[];
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  communications: Communication[];
}

export interface Communication {
  id: string;
  timestamp: string;
  type: 'message' | 'email' | 'whatsapp' | 'system';
  sender: string;
  content: string;
  status: 'sent' | 'delivered' | 'read';
}

export interface SafariPackage {
  id: string;
  name: string;
  duration: number;
  description: string;
  price: number;
  highlights: string[];
  image: string;
}

export interface StaffMember {
  id: string;
  name: string;
  role: 'admin' | 'coordinator' | 'guide' | 'driver';
  email: string;
  phone: string;
  profileImage: string;
  clientsAssigned: string[];
}

// Mock safari packages
export const safariPackages: SafariPackage[] = [
  {
    id: '1',
    name: '5-Day Serengeti Explorer',
    duration: 5,
    description: 'Experience the wonders of Serengeti with game drives and cultural visits',
    price: 2500,
    highlights: ['Big Five Game Drives', 'Maasai Village Visit', 'Hot Air Balloon Safari'],
    image: '/safari-serengeti.jpg'
  },
  {
    id: '2',
    name: '7-Day Northern Circuit',
    duration: 7,
    description: 'Complete northern Tanzania circuit including Serengeti and Ngorongoro',
    price: 3800,
    highlights: ['Ngorongoro Crater', 'Serengeti Migration', 'Lake Manyara Tree Climbing Lions'],
    image: '/safari-northern.jpg'
  },
  {
    id: '3',
    name: '10-Day Ultimate Safari',
    duration: 10,
    description: 'The ultimate Tanzania safari experience with all major parks',
    price: 5500,
    highlights: ['All Major Parks', 'Luxury Accommodations', 'Private Vehicle & Guide'],
    image: '/safari-ultimate.jpg'
  }
];

// Mock clients data
export const mockClients: Client[] = [
  {
    id: 'C001',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1-555-0123',
    profileImage: '/avatars/sarah.jpg',
    journeyStatus: 'arrived',
    safariPackage: '7-Day Northern Circuit',
    bookingDate: '2024-08-15',
    safariDates: {
      start: '2024-09-15',
      end: '2024-09-22'
    },
    totalCost: 3800,
    paidAmount: 3800,
    specialRequirements: ['Vegetarian meals', 'Photography guide'],
    emergencyContact: {
      name: 'Michael Johnson',
      phone: '+1-555-0124',
      relationship: 'Husband'
    },
    communications: [
      {
        id: 'comm1',
        timestamp: '2024-09-14T10:30:00Z',
        type: 'whatsapp',
        sender: 'Safari Team',
        content: 'Welcome to Tanzania! Your pickup is confirmed for 8 AM tomorrow.',
        status: 'read'
      },
      {
        id: 'comm2',
        timestamp: '2024-09-13T15:45:00Z',
        type: 'email',
        sender: 'Safari Team',
        content: 'Flight arrival confirmation received. Looking forward to your safari!',
        status: 'read'
      }
    ]
  },
  {
    id: 'C002',
    name: 'David Chen',
    email: 'david.chen@email.com',
    phone: '+44-20-7946-0958',
    profileImage: '/avatars/david.jpg',
    journeyStatus: 'confirmed',
    safariPackage: '5-Day Serengeti Explorer',
    bookingDate: '2024-08-20',
    safariDates: {
      start: '2024-10-05',
      end: '2024-10-10'
    },
    totalCost: 2500,
    paidAmount: 1250,
    specialRequirements: ['Medical dietary requirements'],
    emergencyContact: {
      name: 'Lisa Chen',
      phone: '+44-20-7946-0959',
      relationship: 'Wife'
    },
    communications: [
      {
        id: 'comm3',
        timestamp: '2024-08-21T09:15:00Z',
        type: 'email',
        sender: 'Safari Team',
        content: 'Booking confirmed! Please complete final payment by September 20th.',
        status: 'read'
      }
    ]
  },
  {
    id: 'C003',
    name: 'Emma & James Wilson',
    email: 'emma.wilson@email.com',
    phone: '+61-2-9876-5432',
    profileImage: '/avatars/emma-james.jpg',
    journeyStatus: 'completed',
    safariPackage: '10-Day Ultimate Safari',
    bookingDate: '2024-07-10',
    safariDates: {
      start: '2024-08-15',
      end: '2024-08-25'
    },
    totalCost: 5500,
    paidAmount: 5500,
    specialRequirements: ['Anniversary celebration', 'Luxury accommodations'],
    emergencyContact: {
      name: 'Robert Wilson',
      phone: '+61-2-9876-5433',
      relationship: 'Father'
    },
    communications: [
      {
        id: 'comm4',
        timestamp: '2024-08-26T16:20:00Z',
        type: 'message',
        sender: 'Emma Wilson',
        content: 'Thank you for an incredible experience! The photos are amazing.',
        status: 'read'
      }
    ]
  },
  {
    id: 'C004',
    name: 'Marcus Rodriguez',
    email: 'marcus.rodriguez@email.com',
    phone: '+34-91-123-4567',
    profileImage: '/avatars/marcus.jpg',
    journeyStatus: 'submitted',
    safariPackage: '7-Day Northern Circuit',
    bookingDate: '2024-08-28',
    safariDates: {
      start: '2024-11-10',
      end: '2024-11-17'
    },
    totalCost: 3800,
    paidAmount: 0,
    specialRequirements: ['Solo traveler', 'Photography focus'],
    emergencyContact: {
      name: 'Carmen Rodriguez',
      phone: '+34-91-123-4568',
      relationship: 'Sister'
    },
    communications: []
  }
];

// Mock staff data
export const mockStaff: StaffMember[] = [
  {
    id: 'S001',
    name: 'Amara Mwangi',
    role: 'admin',
    email: 'amara@liontrack.com',
    phone: '+255-784-123456',
    profileImage: '/staff/amara.jpg',
    clientsAssigned: ['C001', 'C002', 'C003', 'C004']
  },
  {
    id: 'S002',
    name: 'John Kimani',
    role: 'guide',
    email: 'john@liontrack.com',
    phone: '+255-784-123457',
    profileImage: '/staff/john.jpg',
    clientsAssigned: ['C001', 'C003']
  },
  {
    id: 'S003',
    name: 'Grace Mollel',
    role: 'coordinator',
    email: 'grace@liontrack.com',
    phone: '+255-784-123458',
    profileImage: '/staff/grace.jpg',
    clientsAssigned: ['C002', 'C004']
  }
];

// Analytics mock data
export const analyticsData = {
  totalBookings: 156,
  activeClients: 23,
  completedSafaris: 89,
  revenue: 425000,
  satisfactionScore: 4.8,
  conversionRate: 78,
  monthlyBookings: [
    { month: 'Jan', bookings: 12, revenue: 31200 },
    { month: 'Feb', bookings: 15, revenue: 39000 },
    { month: 'Mar', bookings: 18, revenue: 46800 },
    { month: 'Apr', bookings: 22, revenue: 57200 },
    { month: 'May', bookings: 19, revenue: 49400 },
    { month: 'Jun', bookings: 25, revenue: 65000 },
    { month: 'Jul', bookings: 28, revenue: 72800 },
    { month: 'Aug', bookings: 17, revenue: 44200 }
  ],
  statusDistribution: [
    { status: 'Submitted', count: 34, percentage: 22 },
    { status: 'Confirmed', count: 45, percentage: 29 },
    { status: 'Arrived', count: 23, percentage: 15 },
    { status: 'Completed', count: 54, percentage: 34 }
  ]
};

// Journey stages
export const journeyStages = [
  { id: 'submitted', name: 'Submitted', description: 'Booking request submitted' },
  { id: 'confirmed', name: 'Confirmed', description: 'Booking confirmed and paid' },
  { id: 'arrived', name: 'Arrived', description: 'Client arrived in Tanzania' },
  { id: 'completed', name: 'Completed', description: 'Safari completed successfully' }
];