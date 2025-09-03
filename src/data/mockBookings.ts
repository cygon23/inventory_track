// Mock booking data
export interface Booking {
  id: string;
  bookingReference: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  safariPackage: string;
  packageId: string;
  startDate: string;
  endDate: string;
  adults: number;
  children: number;
  totalAmount: number;
  paidAmount: number;
  status: 'inquiry' | 'quoted' | 'confirmed' | 'paid' | 'in_progress' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'partial' | 'paid' | 'refunded';
  assignedGuide?: string;
  assignedDriver?: string;
  assignedVehicle?: string;
  specialRequests: string[];
  createdAt: string;
  updatedAt: string;
  notes: string;
}

export interface SafariPackage {
  id: string;
  name: string;
  duration: number;
  description: string;
  highlights: string[];
  included: string[];
  excluded: string[];
  price: number;
  maxGroupSize: number;
  difficulty: 'easy' | 'moderate' | 'challenging';
  category: 'day_trip' | 'short_safari' | 'extended_safari';
  image: string;
  isActive: boolean;
}

export const mockSafariPackages: SafariPackage[] = [
  {
    id: 'pkg1',
    name: '3-Day Serengeti Discovery',
    duration: 3,
    description: 'Experience the iconic Serengeti plains with game drives and stunning sunsets.',
    highlights: ['Big Five viewing', 'Great Migration (seasonal)', 'Sunset game drives', 'Luxury tented camp'],
    included: ['Accommodation', 'All meals', 'Game drives', 'Park fees', 'Professional guide'],
    excluded: ['International flights', 'Visa fees', 'Personal expenses', 'Gratuities'],
    price: 1200,
    maxGroupSize: 8,
    difficulty: 'easy',
    category: 'short_safari',
    image: '/src/assets/safari-hero.jpg',
    isActive: true
  },
  {
    id: 'pkg2',
    name: '5-Day Northern Circuit',
    duration: 5,
    description: 'Complete northern Tanzania circuit including Serengeti, Ngorongoro, and Tarangire.',
    highlights: ['Ngorongoro Crater', 'Serengeti Plains', 'Tarangire Elephants', 'Cultural visit'],
    included: ['Accommodation', 'All meals', 'Game drives', 'Park fees', 'Professional guide', 'Transport'],
    excluded: ['International flights', 'Visa fees', 'Personal expenses', 'Gratuities'],
    price: 2500,
    maxGroupSize: 6,
    difficulty: 'moderate',
    category: 'extended_safari',
    image: '/src/assets/safari-experience.jpg',
    isActive: true
  },
  {
    id: 'pkg3',
    name: 'Ngorongoro Day Trip',
    duration: 1,
    description: 'Single day adventure into the Ngorongoro Crater, the world\'s largest intact volcanic caldera.',
    highlights: ['Ngorongoro Crater', 'Big Five viewing', 'Picnic lunch', 'Maasai culture'],
    included: ['Transport', 'Lunch', 'Park fees', 'Professional guide'],
    excluded: ['Accommodation', 'Other meals', 'Personal expenses'],
    price: 350,
    maxGroupSize: 12,
    difficulty: 'easy',
    category: 'day_trip',
    image: '/placeholder.svg',
    isActive: true
  }
];

export const mockBookings: Booking[] = [
  {
    id: 'b1',
    bookingReference: 'SF001',
    customerId: 'c1',
    customerName: 'John Smith',
    customerEmail: 'john.smith@email.com',
    customerPhone: '+1 555 123 4567',
    safariPackage: '3-Day Serengeti Discovery',
    packageId: 'pkg1',
    startDate: '2024-03-15',
    endDate: '2024-03-17',
    adults: 4,
    children: 0,
    totalAmount: 4800,
    paidAmount: 1440, // 30% deposit
    status: 'confirmed',
    paymentStatus: 'partial',
    assignedGuide: 'g1',
    assignedDriver: '5',
    assignedVehicle: 'v1',
    specialRequests: ['Vegetarian meals', 'Early morning game drives'],
    createdAt: '2024-01-05T10:00:00Z',
    updatedAt: '2024-01-08T14:30:00Z',
    notes: 'VIP clients, ensure premium service'
  },
  {
    id: 'b2',
    bookingReference: 'SF002',
    customerId: 'c2',
    customerName: 'Emma Thompson',
    customerEmail: 'emma.thompson@email.com',
    customerPhone: '+44 20 7123 4567',
    safariPackage: '5-Day Northern Circuit',
    packageId: 'pkg2',
    startDate: '2024-02-20',
    endDate: '2024-02-24',
    adults: 2,
    children: 1,
    totalAmount: 6250,
    paidAmount: 6250,
    status: 'paid',
    paymentStatus: 'paid',
    assignedGuide: 'g2',
    assignedDriver: '5',
    assignedVehicle: 'v2',
    specialRequests: ['Child-friendly activities', 'Photography focus'],
    createdAt: '2024-01-02T09:15:00Z',
    updatedAt: '2024-01-09T11:20:00Z',
    notes: 'Photography enthusiasts, arrange special stops'
  },
  {
    id: 'b3',
    bookingReference: 'SF003',
    customerId: 'c3',
    customerName: 'Carlos Rodriguez',
    customerEmail: 'carlos.rodriguez@email.com',
    customerPhone: '+34 91 123 4567',
    safariPackage: 'Ngorongoro Day Trip',
    packageId: 'pkg3',
    startDate: '2024-01-15',
    endDate: '2024-01-15',
    adults: 2,
    children: 0,
    totalAmount: 700,
    paidAmount: 700,
    status: 'in_progress',
    paymentStatus: 'paid',
    assignedGuide: 'g3',
    assignedDriver: '5',
    assignedVehicle: 'v3',
    specialRequests: ['Lunch with crater view'],
    createdAt: '2024-01-10T08:45:00Z',
    updatedAt: '2024-01-14T16:00:00Z',
    notes: 'Currently on trip, check-in scheduled for 18:00'
  }
];

export const bookingStatusColors = {
  inquiry: 'bg-gray-100 text-gray-800',
  quoted: 'bg-blue-100 text-blue-800',
  confirmed: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-green-100 text-green-800',
  in_progress: 'bg-purple-100 text-purple-800',
  completed: 'bg-primary text-primary-foreground',
  cancelled: 'bg-red-100 text-red-800'
};

export const paymentStatusColors = {
  pending: 'bg-gray-100 text-gray-800',
  partial: 'bg-orange-100 text-orange-800',
  paid: 'bg-green-100 text-green-800',
  refunded: 'bg-red-100 text-red-800'
};