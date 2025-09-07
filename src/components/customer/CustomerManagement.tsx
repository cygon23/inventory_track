import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import AddCustomerModal from '@/components/forms/AddCustomerModal';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  User, 
  Calendar, 
  MessageSquare, 
  Phone,
  Mail,
  MapPin,
  Star,
  Eye,
  Edit,
  Plus
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { User as UserType } from '@/data/mockUsers';

interface CustomerManagementProps {
  currentUser: UserType;
}

const CustomerManagement: React.FC<CustomerManagementProps> = ({ currentUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const customers = [
    {
      id: 'C001',
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+1-555-0123',
      country: 'United States',
      totalBookings: 3,
      totalSpent: '$12,800',
      lastBooking: '2024-01-15',
      status: 'active',
      rating: 4.9,
      joinDate: '2023-08-15',
      preferences: ['Wildlife Photography', 'Luxury Lodges'],
      upcomingTrip: '3-Day Serengeti Explorer'
    },
    {
      id: 'C002',
      name: 'Emma Thompson',
      email: 'emma.thompson@email.com',
      phone: '+44-20-7946-0958',
      country: 'United Kingdom',
      totalBookings: 1,
      totalSpent: '$6,250',
      lastBooking: '2024-01-18',
      status: 'new',
      rating: 5.0,
      joinDate: '2024-01-10',
      preferences: ['Honeymoon Packages', 'Romantic Settings'],
      upcomingTrip: '5-Day Northern Circuit'
    },
    {
      id: 'C003',
      name: 'Carlos Rodriguez',
      email: 'carlos.rodriguez@email.com',
      phone: '+34-91-123-4567',
      country: 'Spain',
      totalBookings: 2,
      totalSpent: '$4,200',
      lastBooking: '2023-12-20',
      status: 'returning',
      rating: 4.7,
      joinDate: '2023-06-20',
      preferences: ['Cultural Experiences', 'Local Cuisine'],
      upcomingTrip: null
    },
    {
      id: 'C004',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+1-555-0198',
      country: 'United States',
      totalBookings: 4,
      totalSpent: '$18,900',
      lastBooking: '2024-01-20',
      status: 'vip',
      rating: 4.8,
      joinDate: '2022-11-05',
      preferences: ['Family Safari', 'Educational Tours', 'Conservation'],
      upcomingTrip: '4-Day Tarangire & Manyara'
    },
    {
      id: 'C005',
      name: 'Michael Brown',
      email: 'michael.brown@email.com',
      phone: '+1-555-0167',
      country: 'Canada',
      totalBookings: 0,
      totalSpent: '$0',
      lastBooking: null,
      status: 'inquiry',
      rating: null,
      joinDate: '2024-01-22',
      preferences: ['Adventure Safari', 'Photography'],
      upcomingTrip: null
    },
    {
      id: 'C006',
      name: 'Lisa Wilson',
      email: 'lisa.wilson@email.com',
      phone: '+61-2-9876-5432',
      country: 'Australia',
      totalBookings: 1,
      totalSpent: '$8,500',
      lastBooking: '2023-11-30',
      status: 'active',
      rating: 4.9,
      joinDate: '2023-09-15',
      preferences: ['Solo Travel', 'Wildlife Conservation'],
      upcomingTrip: null
    }
  ];

  const stats = [
    {
      title: 'Total Customers',
      value: '156',
      change: '+12 this month',
      icon: User,
      color: 'text-primary'
    },
    {
      title: 'Active Customers',
      value: '89',
      change: '57% of total',
      icon: Star,
      color: 'text-success'
    },
    {
      title: 'New This Month',
      value: '23',
      change: '+18% vs last month',
      icon: Plus,
      color: 'text-warning'
    },
    {
      title: 'Avg. Customer Value',
      value: '$8,450',
      change: '+5% this quarter',
      icon: Calendar,
      color: 'text-success'
    }
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-success/10 text-success border-success/20',
      new: 'bg-primary/10 text-primary border-primary/20',
      returning: 'bg-warning/10 text-warning border-warning/20',
      vip: 'bg-accent-gold/10 text-accent-gold border-accent-gold/20',
      inquiry: 'bg-muted/10 text-muted-foreground border-muted/20',
      inactive: 'bg-destructive/10 text-destructive border-destructive/20'
    };
    return colors[status as keyof typeof colors] || 'bg-muted/10 text-muted-foreground border-muted/20';
  };

  const formatStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.country.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || customer.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Customer Management</h1>
          <p className="text-muted-foreground">Manage customer relationships and booking history</p>
        </div>
        <Button 
          onClick={() => setIsAddModalOpen(true)}
          className="h-12 px-6 min-w-0 whitespace-nowrap"
        >
          <Plus className="h-4 w-4 mr-2" />
          <span className="hidden xs:inline">Add Customer</span>
          <span className="xs:hidden">Add</span>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="safari-card">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-xl md:text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.change}</p>
                  </div>
                  <Icon className={`h-6 w-6 md:h-8 md:w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters and Search */}
      <Card className="safari-card">
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customers by name, email, or country..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant={filterStatus === 'all' ? 'default' : 'outline'} 
                onClick={() => setFilterStatus('all')}
                size="sm"
                className="h-10 px-4"
              >
                All
              </Button>
              <Button 
                variant={filterStatus === 'active' ? 'default' : 'outline'} 
                onClick={() => setFilterStatus('active')}
                size="sm"
                className="h-10 px-4"
              >
                Active
              </Button>
              <Button 
                variant={filterStatus === 'vip' ? 'default' : 'outline'} 
                onClick={() => setFilterStatus('vip')}
                size="sm"
                className="h-10 px-4"
              >
                VIP
              </Button>
              <Button 
                variant={filterStatus === 'new' ? 'default' : 'outline'} 
                onClick={() => setFilterStatus('new')}
                size="sm"
                className="h-10 px-4"
              >
                New
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer Table */}
      <Card className="safari-card">
        <CardHeader>
          <CardTitle>Customer Database</CardTitle>
          <CardDescription>Complete customer information and booking history</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead className="hidden md:table-cell">Contact</TableHead>
                  <TableHead className="hidden lg:table-cell">Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden sm:table-cell">Bookings</TableHead>
                  <TableHead className="hidden lg:table-cell">Total Spent</TableHead>
                  <TableHead className="hidden xl:table-cell">Rating</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>{getInitials(customer.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{customer.name}</p>
                          <p className="text-sm text-muted-foreground">ID: {customer.id}</p>
                          {customer.upcomingTrip && (
                            <p className="text-xs text-primary font-medium">
                              Upcoming: {customer.upcomingTrip}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{customer.email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{customer.phone}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{customer.country}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(customer.status)}>
                        {formatStatus(customer.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <div className="text-center">
                        <p className="font-medium">{customer.totalBookings}</p>
                        <p className="text-xs text-muted-foreground">
                          {customer.lastBooking ? `Last: ${customer.lastBooking}` : 'No bookings'}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <p className="font-medium">{customer.totalSpent}</p>
                    </TableCell>
                    <TableCell className="hidden xl:table-cell">
                      {customer.rating ? (
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-warning fill-current" />
                          <span>{customer.rating}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">N/A</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-10 w-10 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-popover z-50">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Customer
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Calendar className="mr-2 h-4 w-4" />
                            Booking History
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Send Message
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Customer Modal */}
      <AddCustomerModal 
        open={isAddModalOpen} 
        onOpenChange={setIsAddModalOpen} 
      />
    </div>
  );
};

export default CustomerManagement;