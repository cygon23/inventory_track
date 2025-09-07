// Mock user data for role-based authentication simulation
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'admin_helper' | 'booking_manager' | 'operations_coordinator' | 'driver' | 'finance_officer' | 'customer_service';
  avatar: string;
  isActive: boolean;
  lastLogin: string;
  permissions: string[];
  assignedRegion?: string;
  phone?: string;
}

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'James Wilson',
    email: 'james@safariltd.com',
    role: 'super_admin',
    avatar: '/placeholder.svg',
    isActive: true,
    lastLogin: '2024-01-10T09:30:00Z',
    permissions: ['all'],
    phone: '+255 123 456 789'
  },
  {
    id: '2',
    name: 'Sarah Mitchell',
    email: 'sarah@safariltd.com',
    role: 'admin',
    avatar: '/placeholder.svg',
    isActive: true,
    lastLogin: '2024-01-10T08:15:00Z',
    permissions: ['dashboard', 'messages', 'customers', 'bookings', 'staff', 'reports'],
    phone: '+255 123 456 790'
  },
  {
    id: '3',
    name: 'Michael Chen',
    email: 'michael@safariltd.com',
    role: 'booking_manager',
    avatar: '/placeholder.svg',
    isActive: true,
    lastLogin: '2024-01-10T10:00:00Z',
    permissions: ['dashboard', 'messages', 'customers', 'bookings'],
    assignedRegion: 'Northern Circuit',
    phone: '+255 123 456 791'
  },
  {
    id: '4',
    name: 'Amara Kimani',
    email: 'amara@safariltd.com',
    role: 'operations_coordinator',
    avatar: '/placeholder.svg',
    isActive: true,
    lastLogin: '2024-01-10T07:45:00Z',
    permissions: ['dashboard', 'messages', 'trips', 'drivers', 'vehicles'],
    assignedRegion: 'Serengeti',
    phone: '+255 123 456 792'
  },
  {
    id: '5',
    name: 'David Moshi',
    email: 'david@safariltd.com',
    role: 'driver',
    avatar: '/placeholder.svg',
    isActive: true,
    lastLogin: '2024-01-10T06:30:00Z',
    permissions: ['dashboard', 'my_trips', 'reports'],
    assignedRegion: 'Arusha',
    phone: '+255 123 456 793'
  },
  {
    id: '6',
    name: 'Lisa Johnson',
    email: 'lisa@safariltd.com',
    role: 'finance_officer',
    avatar: '/placeholder.svg',
    isActive: true,
    lastLogin: '2024-01-10T08:00:00Z',
    permissions: ['dashboard', 'payments', 'invoices', 'reports'],
    phone: '+255 123 456 794'
  },
  {
    id: '7',
    name: 'Grace Mwangi',
    email: 'grace@safariltd.com',
    role: 'customer_service',
    avatar: '/placeholder.svg',
    isActive: true,
    lastLogin: '2024-01-10T09:00:00Z',
    permissions: ['dashboard', 'messages', 'support', 'faq'],
    phone: '+255 123 456 795'
  }
];

export const rolePermissions = {
  super_admin: ['dashboard', 'messages', 'customers', 'bookings', 'staff', 'reports', 'settings', 'users', 'forensic', 'attendance'],
  admin: ['dashboard', 'messages', 'customers', 'bookings', 'staff', 'reports', 'forensic', 'attendance'],
  booking_manager: ['dashboard', 'messages', 'customers', 'bookings', 'attendance'],
  operations_coordinator: ['dashboard', 'messages', 'trips', 'drivers', 'vehicles', 'attendance'],
  driver: ['dashboard', 'my_trips', 'reports', 'attendance'],
  finance_officer: ['dashboard', 'payments', 'invoices', 'reports', 'messages', 'attendance'],
  customer_service: ['dashboard', 'messages', 'support', 'faq', 'attendance']
};

export const roleColors = {
  super_admin: 'bg-gradient-safari text-white',
  admin: 'bg-primary text-primary-foreground',
  admin_helper: 'bg-primary-glow text-white',
  booking_manager: 'bg-accent-gold text-foreground',
  operations_coordinator: 'bg-accent-rust text-white',
  driver: 'bg-success text-success-foreground',
  finance_officer: 'bg-warning text-warning-foreground',
  customer_service: 'bg-secondary text-secondary-foreground'
};

export const mockCurrentUser: User = mockUsers[0]; // Default to super admin for demo