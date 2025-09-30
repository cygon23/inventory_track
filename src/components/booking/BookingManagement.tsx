import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import AddBookingModal from "@/components/forms/AddBookingModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Calendar,
  Search,
  Plus,
  MoreVertical,
  Eye,
  Edit,
  DollarSign,
  MapPin,
  Users,
  Clock,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { bookingService, Booking } from "@/services/bookingService";
import { useToast } from "@/hooks/use-toast";

const bookingStatusColors = {
  inquiry: "bg-gray-100 text-gray-800",
  quoted: "bg-blue-100 text-blue-800",
  confirmed: "bg-yellow-100 text-yellow-800",
  paid: "bg-green-100 text-green-800",
  in_progress: "bg-purple-100 text-purple-800",
  completed: "bg-primary text-primary-foreground",
  cancelled: "bg-red-100 text-red-800",
};

const paymentStatusColors = {
  pending: "bg-gray-100 text-gray-800",
  partial: "bg-orange-100 text-orange-800",
  paid: "bg-green-100 text-green-800",
  refunded: "bg-red-100 text-red-800",
};

const BookingManagement: React.FC = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    confirmed: 0,
    paid: 0,
    inProgress: 0,
    totalRevenue: 0,
    paidRevenue: 0,
  });

  // Fetch bookings on mount
  useEffect(() => {
    fetchBookings();
    fetchStats();
  }, []);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await bookingService.getAllBookings();

      if (error) {
        throw error;
      }

      if (data) {
        setBookings(data);
      }
    } catch (error: any) {
      console.error("Error fetching bookings:", error);
      toast({
        title: "Error Loading Bookings",
        description:
          error.message || "Failed to load bookings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data, error } = await bookingService.getBookingStats();

      if (!error && data) {
        setStats({
          total: data.total,
          confirmed: data.confirmed,
          paid: data.paid,
          inProgress: data.inProgress,
          totalRevenue: data.totalRevenue,
          paidRevenue: data.paidRevenue,
        });
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleBookingSuccess = () => {
    fetchBookings();
    fetchStats();
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      searchQuery === "" ||
      booking.customer_name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      booking.booking_reference
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      booking.safari_package
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      booking.customer_custom_id
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount || 0);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getPaymentProgress = (booking: any) => {
    if (!booking.total_amount) return 0;
    return Math.round((booking.paid_amount / booking.total_amount) * 100);
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0'>
        <div>
          <h1 className='text-2xl md:text-3xl font-bold text-foreground'>
            Booking Management
          </h1>
          <p className='text-muted-foreground'>
            Manage safari bookings and customer reservations
          </p>
        </div>
        <div className='flex gap-2'>
          <Button
            variant='outline'
            size='icon'
            onClick={() => {
              fetchBookings();
              fetchStats();
            }}
            disabled={isLoading}>
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
          </Button>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className='h-12 px-6 min-w-0 whitespace-nowrap'>
            <Plus className='h-4 w-4 mr-2' />
            <span className='hidden xs:inline'>New Booking</span>
            <span className='xs:hidden'>New</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <Card className='safari-card'>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  Total Bookings
                </p>
                <p className='text-2xl font-bold'>{stats.total}</p>
              </div>
              <Calendar className='h-8 w-8 text-blue-600' />
            </div>
          </CardContent>
        </Card>

        <Card className='safari-card'>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  Active Bookings
                </p>
                <p className='text-2xl font-bold'>
                  {stats.confirmed + stats.inProgress}
                </p>
              </div>
              <Clock className='h-8 w-8 text-orange-600' />
            </div>
          </CardContent>
        </Card>

        <Card className='safari-card'>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  Total Revenue
                </p>
                <p className='text-2xl font-bold'>
                  {formatCurrency(stats.totalRevenue)}
                </p>
              </div>
              <DollarSign className='h-8 w-8 text-green-600' />
            </div>
          </CardContent>
        </Card>

        <Card className='safari-card'>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  Collected
                </p>
                <p className='text-2xl font-bold'>
                  {formatCurrency(stats.paidRevenue)}
                </p>
                <p className='text-xs text-muted-foreground'>
                  {stats.totalRevenue > 0
                    ? Math.round((stats.paidRevenue / stats.totalRevenue) * 100)
                    : 0}
                  % of total
                </p>
              </div>
              <DollarSign className='h-8 w-8 text-primary' />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className='safari-card'>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle>All Bookings</CardTitle>
              <CardDescription>
                Manage and track all safari bookings
              </CardDescription>
            </div>
            <div className='flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4'>
              <div className='relative w-full sm:flex-1 max-w-md'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                <Input
                  placeholder='Search bookings...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='pl-10 h-12'
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className='w-full sm:w-48 h-12'>
                  <SelectValue placeholder='Filter by status' />
                </SelectTrigger>
                <SelectContent className='bg-popover z-50'>
                  <SelectItem value='all'>All Status</SelectItem>
                  <SelectItem value='inquiry'>Inquiry</SelectItem>
                  <SelectItem value='quoted'>Quoted</SelectItem>
                  <SelectItem value='confirmed'>Confirmed</SelectItem>
                  <SelectItem value='paid'>Paid</SelectItem>
                  <SelectItem value='in_progress'>In Progress</SelectItem>
                  <SelectItem value='completed'>Completed</SelectItem>
                  <SelectItem value='cancelled'>Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className='flex items-center justify-center py-12'>
              <Loader2 className='h-8 w-8 animate-spin text-primary' />
              <span className='ml-3 text-muted-foreground'>
                Loading bookings...
              </span>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className='text-center py-12'>
              <p className='text-muted-foreground'>No bookings found</p>
              <Button
                variant='outline'
                onClick={() => setIsAddModalOpen(true)}
                className='mt-4'>
                <Plus className='h-4 w-4 mr-2' />
                Create First Booking
              </Button>
            </div>
          ) : (
            <div className='rounded-md border'>
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
                    <TableHead className='w-[50px]'></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.map((booking) => (
                    <TableRow key={booking.id} className='hover:bg-accent/50'>
                      <TableCell>
                        <div className='flex items-center space-x-3'>
                          <Avatar className='h-8 w-8'>
                            <AvatarFallback>
                              {booking.customer_name
                                ?.split(" ")
                                .map((n: string) => n[0])
                                .join("") || "NA"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className='font-medium'>
                              {booking.customer_name}
                            </p>
                            <p className='text-sm text-muted-foreground'>
                              {booking.customer_custom_id ||
                                booking.customer_email}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <span className='font-mono text-sm'>
                          {booking.booking_reference}
                        </span>
                      </TableCell>

                      <TableCell>
                        <div className='flex items-center space-x-2'>
                          <MapPin className='h-4 w-4 text-muted-foreground' />
                          <span className='text-sm'>
                            {booking.safari_package}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className='text-sm'>
                          <p>{formatDate(booking.start_date)}</p>
                          <p className='text-muted-foreground'>
                            to {formatDate(booking.end_date)}
                          </p>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className='flex items-center space-x-1'>
                          <Users className='h-4 w-4 text-muted-foreground' />
                          <span className='text-sm'>
                            {(booking.adults || 0) + (booking.children || 0)}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className='text-sm'>
                          <p className='font-medium'>
                            {formatCurrency(booking.total_amount)}
                          </p>
                          <p className='text-muted-foreground'>
                            {formatCurrency(booking.paid_amount)} paid
                          </p>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className='space-y-1'>
                          <Badge
                            className={
                              paymentStatusColors[
                                booking.payment_status as keyof typeof paymentStatusColors
                              ]
                            }>
                            {booking.payment_status}
                          </Badge>
                          <div className='w-full bg-gray-200 rounded-full h-1'>
                            <div
                              className='bg-green-600 h-1 rounded-full'
                              style={{
                                width: `${getPaymentProgress(booking)}%`,
                              }}
                            />
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge
                          className={
                            bookingStatusColors[
                              booking.status as keyof typeof bookingStatusColors
                            ]
                          }>
                          {booking.status?.replace("_", " ")}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant='ghost'
                              size='sm'
                              className='h-10 w-10 p-0'>
                              <MoreVertical className='h-4 w-4' />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align='end'
                            className='bg-popover z-50'>
                            <DropdownMenuItem>
                              <Eye className='mr-2 h-4 w-4' />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className='mr-2 h-4 w-4' />
                              Edit Booking
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <DollarSign className='mr-2 h-4 w-4' />
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
          )}
        </CardContent>
      </Card>

      {/* Add Booking Modal */}
      <AddBookingModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSuccess={handleBookingSuccess}
      />
    </div>
  );
};

export default BookingManagement;
