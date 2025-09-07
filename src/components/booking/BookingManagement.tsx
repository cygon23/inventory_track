import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import AddBookingModal from '@/components/forms/AddBookingModal';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Calendar, 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  Eye, 
  Edit, 
  DollarSign,
  MapPin,
  Users,
  Clock
} from 'lucide-react';
import { mockBookings, bookingStatusColors, paymentStatusColors, Booking } from '@/data/mockBookings';
import { User } from '@/data/mockUsers';

interface BookingManagementProps {
  currentUser: User;
}

const BookingManagement: React.FC<BookingManagementProps> = ({ currentUser }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredBookings = mockBookings.filter(booking => {
    const matchesSearch = searchQuery === '' || 
      booking.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.bookingReference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.safariPackage.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getPaymentProgress = (booking: Booking) => {
    return Math.round((booking.paidAmount / booking.totalAmount) * 100);
  };

  const bookingStats = {
    total: mockBookings.length,
    confirmed: mockBookings.filter(b => b.status === 'confirmed').length,
    paid: mockBookings.filter(b => b.status === 'paid').length,
    inProgress: mockBookings.filter(b => b.status === 'in_progress').length,
    totalRevenue: mockBookings.reduce((sum, b) => sum + b.totalAmount, 0),
    paidRevenue: mockBookings.reduce((sum, b) => sum + b.paidAmount, 0)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Booking Management</h1>
          <p className="text-muted-foreground">Manage safari bookings and customer reservations</p>
        </div>
        <Button 
          onClick={() => setIsAddModalOpen(true)}
          className="h-12 px-6 min-w-0 whitespace-nowrap"
        >
          <Plus className="h-4 w-4 mr-2" />
          <span className="hidden xs:inline">New Booking</span>
          <span className="xs:hidden">New</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="safari-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Bookings</p>
                <p className="text-2xl font-bold">{bookingStats.total}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="safari-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Bookings</p>
                <p className="text-2xl font-bold">{bookingStats.confirmed + bookingStats.inProgress}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="safari-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(bookingStats.totalRevenue)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="safari-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Collected</p>
                <p className="text-2xl font-bold">{formatCurrency(bookingStats.paidRevenue)}</p>
                <p className="text-xs text-muted-foreground">
                  {Math.round((bookingStats.paidRevenue / bookingStats.totalRevenue) * 100)}% of total
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="safari-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Bookings</CardTitle>
              <CardDescription>Manage and track all safari bookings</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="relative w-full sm:flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search bookings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48 h-12">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="inquiry">Inquiry</SelectItem>
                  <SelectItem value="quoted">Quoted</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Booking Ref</TableHead>
                  <TableHead>Safari Package</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Guests</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.map((booking) => (
                  <TableRow key={booking.id} className="hover:bg-accent/50">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {booking.customerName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{booking.customerName}</p>
                          <p className="text-sm text-muted-foreground">{booking.customerEmail}</p>
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <span className="font-mono text-sm">{booking.bookingReference}</span>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{booking.safariPackage}</span>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="text-sm">
                        <p>{formatDate(booking.startDate)}</p>
                        <p className="text-muted-foreground">to {formatDate(booking.endDate)}</p>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{booking.adults + booking.children}</span>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="text-sm">
                        <p className="font-medium">{formatCurrency(booking.totalAmount)}</p>
                        <p className="text-muted-foreground">{formatCurrency(booking.paidAmount)} paid</p>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="space-y-1">
                        <Badge className={paymentStatusColors[booking.paymentStatus]}>
                          {booking.paymentStatus}
                        </Badge>
                        <div className="w-full bg-gray-200 rounded-full h-1">
                          <div 
                            className="bg-green-600 h-1 rounded-full" 
                            style={{ width: `${getPaymentProgress(booking)}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <Badge className={bookingStatusColors[booking.status]}>
                        {booking.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-10 w-10 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-popover z-50">
                          <DropdownMenuItem onClick={() => setSelectedBooking(booking)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Booking
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <DollarSign className="mr-2 h-4 w-4" />
                            Process Payment
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

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="safari-card">
          <CardHeader>
            <CardTitle className="text-lg">Pending Quotes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">5</p>
              <p className="text-sm text-muted-foreground">Awaiting response</p>
              <Button variant="outline" size="sm" className="mt-2 h-10 px-4">
                Review Quotes
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="safari-card">
          <CardHeader>
            <CardTitle className="text-lg">Payment Due</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">3</p>
              <p className="text-sm text-muted-foreground">Overdue payments</p>
              <Button variant="outline" size="sm" className="mt-2 h-10 px-4">
                Send Reminders
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="safari-card">
          <CardHeader>
            <CardTitle className="text-lg">Upcoming Trips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">8</p>
              <p className="text-sm text-muted-foreground">Next 7 days</p>
              <Button variant="outline" size="sm" className="mt-2 h-10 px-4">
                View Schedule
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Booking Modal */}
      <AddBookingModal 
        open={isAddModalOpen} 
        onOpenChange={setIsAddModalOpen} 
      />
    </div>
  );
};

export default BookingManagement;