import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import AddCustomerModal from "@/components/forms/AddCustomerModal";
import CustomerDetailModal from "@/components/modals/CustomerDetailModal";
import EditCustomerModal from "@/components/modals/EditCustomerModal";
import ImportCustomersModal from "@/components/modals/ImportCustomersModal";
import {
  Search,
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
  Plus,
  Upload,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { User as UserType } from "@/data/mockUsers";
import { useCustomers, useCustomerStats } from "@/hooks/useCustomers";
import {
  Customer,
  CustomerInput,
  CustomerService,
} from "@/lib/customerService";

interface CustomerManagementProps {
  currentUser: UserType;
}

const CustomerManagement: React.FC<CustomerManagementProps> = ({
  currentUser,
}) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );

  // Use custom hooks
  const {
    customers,
    loading,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    importCustomers,
    fetchCustomers,
  } = useCustomers();

  const { stats, loading: statsLoading } = useCustomerStats();

  // Filter customers locally for immediate UI response
  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const matchesSearch =
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.custom_id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter =
        filterStatus === "all" || customer.status === filterStatus;

      return matchesSearch && matchesFilter;
    });
  }, [customers, searchTerm, filterStatus]);

  // Calculate stats from data
  const statsDisplay = useMemo(() => {
    if (!stats) return [];

    return [
      {
        title: "Total Customers",
        value: stats.total.toString(),
        change: "+12 this month",
        icon: User,
        color: "text-primary",
      },
      {
        title: "Active Customers",
        value: stats.active.toString(),
        change: `${
          stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0
        }% of total`,
        icon: Star,
        color: "text-success",
      },
      {
        title: "New This Month",
        value: stats.new.toString(),
        change: "+18% vs last month",
        icon: Plus,
        color: "text-warning",
      },
      {
        title: "Avg. Customer Value",
        value: CustomerService.formatTotalSpent(stats.averageValue),
        change: "+5% this quarter",
        icon: Calendar,
        color: "text-success",
      },
    ];
  }, [stats]);

  const getStatusColor = (status: string) => {
    const colors = {
      active: "bg-success/10 text-success border-success/20",
      new: "bg-primary/10 text-primary border-primary/20",
      returning: "bg-warning/10 text-warning border-warning/20",
      vip: "bg-accent-gold/10 text-accent-gold border-accent-gold/20",
      inquiry: "bg-muted/10 text-muted-foreground border-muted/20",
      inactive: "bg-destructive/10 text-destructive border-destructive/20",
    };
    return (
      colors[status as keyof typeof colors] ||
      "bg-muted/10 text-muted-foreground border-muted/20"
    );
  };

  const formatStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Action handlers
  const handleViewProfile = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDetailModalOpen(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsEditModalOpen(true);
  };

  const handleBookingHistory = (customerId: string) => {
    navigate("/booking/bookings", { state: { customerId } });
  };

  const handleSendMessage = (customerId: string) => {
    navigate("/booking/messages", { state: { customerId } });
  };

  const handleAddCustomer = async (customerData: CustomerInput) => {
    const newCustomer = await addCustomer(customerData);
    if (newCustomer) {
      setIsAddModalOpen(false);
    }
  };

  const handleUpdateCustomer = async (customerData: Partial<CustomerInput>) => {
    if (!selectedCustomer) return;

    const updated = await updateCustomer(selectedCustomer.id, customerData);
    if (updated) {
      setIsEditModalOpen(false);
      setSelectedCustomer(null);
    }
  };

  const handleImportCustomers = async (
    customersData: CustomerInput[],
    fileName: string
  ) => {
    await importCustomers(customersData, fileName);
    setIsImportModalOpen(false);
  };

  // Format customer for modals (convert to UI format)
  const formatCustomerForModal = (customer: Customer) => ({
    id: customer.custom_id, // Use custom_id for display
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    country: customer.country,
    totalBookings: customer.total_bookings,
    totalSpent: CustomerService.formatTotalSpent(customer.total_spent),
    lastBooking: customer.last_booking,
    status: customer.status,
    rating: customer.rating,
    joinDate: customer.join_date,
    preferences: customer.preferences,
    upcomingTrip: customer.upcoming_trip,
  });

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0'>
        <div>
          <h1 className='text-2xl md:text-3xl font-bold text-foreground'>
            Customer Management
          </h1>
          <p className='text-muted-foreground'>
            Manage customer relationships and booking history
          </p>
        </div>
        <div className='flex gap-3'>
          <Button
            variant='outline'
            onClick={() => setIsImportModalOpen(true)}
            className='h-12 px-6 min-w-0 whitespace-nowrap'>
            <Upload className='h-4 w-4 mr-2' />
            <span className='hidden xs:inline'>Import</span>
            <span className='xs:hidden'>Import</span>
          </Button>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className='h-12 px-6 min-w-0 whitespace-nowrap'>
            <Plus className='h-4 w-4 mr-2' />
            <span className='hidden xs:inline'>Add Customer</span>
            <span className='xs:hidden'>Add</span>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6'>
        {statsLoading ? (
          <div className='col-span-full flex justify-center p-8'>
            <Loader2 className='h-8 w-8 animate-spin text-primary' />
          </div>
        ) : (
          statsDisplay.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className='safari-card'>
                <CardContent className='p-4 md:p-6'>
                  <div className='flex items-center justify-between'>
                    <div className='space-y-1'>
                      <p className='text-sm font-medium text-muted-foreground'>
                        {stat.title}
                      </p>
                      <p className='text-xl md:text-2xl font-bold'>
                        {stat.value}
                      </p>
                      <p className='text-xs text-muted-foreground'>
                        {stat.change}
                      </p>
                    </div>
                    <Icon className={`h-6 w-6 md:h-8 md:w-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Filters and Search */}
      <Card className='safari-card'>
        <CardContent className='p-4 md:p-6'>
          <div className='flex flex-col space-y-4'>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='Search by name, email, country, or customer ID (LT-XXXX)...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='pl-10 h-12'
              />
            </div>
            <div className='flex flex-wrap gap-2'>
              <Button
                variant={filterStatus === "all" ? "default" : "outline"}
                onClick={() => setFilterStatus("all")}
                size='sm'
                className='h-10 px-4'>
                All
              </Button>
              <Button
                variant={filterStatus === "active" ? "default" : "outline"}
                onClick={() => setFilterStatus("active")}
                size='sm'
                className='h-10 px-4'>
                Active
              </Button>
              <Button
                variant={filterStatus === "vip" ? "default" : "outline"}
                onClick={() => setFilterStatus("vip")}
                size='sm'
                className='h-10 px-4'>
                VIP
              </Button>
              <Button
                variant={filterStatus === "new" ? "default" : "outline"}
                onClick={() => setFilterStatus("new")}
                size='sm'
                className='h-10 px-4'>
                New
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer Table */}
      <Card className='safari-card'>
        <CardHeader>
          <CardTitle>Customer Database</CardTitle>
          <CardDescription>
            Complete customer information and booking history
          </CardDescription>
        </CardHeader>
        <CardContent className='p-0'>
          {loading ? (
            <div className='flex justify-center items-center p-12'>
              <Loader2 className='h-8 w-8 animate-spin text-primary' />
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className='text-center p-12'>
              <p className='text-muted-foreground'>No customers found</p>
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead className='hidden md:table-cell'>
                      Contact
                    </TableHead>
                    <TableHead className='hidden lg:table-cell'>
                      Location
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className='hidden sm:table-cell'>
                      Bookings
                    </TableHead>
                    <TableHead className='hidden lg:table-cell'>
                      Total Spent
                    </TableHead>
                    <TableHead className='hidden xl:table-cell'>
                      Rating
                    </TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <div className='flex items-center space-x-3'>
                          <Avatar className='h-10 w-10'>
                            <AvatarFallback>
                              {getInitials(customer.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className='font-medium'>{customer.name}</p>
                            <p className='text-sm text-muted-foreground'>
                              ID: {customer.custom_id}
                            </p>
                            {customer.upcoming_trip && (
                              <p className='text-xs text-primary font-medium'>
                                Upcoming: {customer.upcoming_trip}
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className='hidden md:table-cell'>
                        <div className='space-y-1'>
                          <div className='flex items-center space-x-2'>
                            <Mail className='h-3 w-3 text-muted-foreground' />
                            <span className='text-sm'>{customer.email}</span>
                          </div>
                          <div className='flex items-center space-x-2'>
                            <Phone className='h-3 w-3 text-muted-foreground' />
                            <span className='text-sm'>{customer.phone}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className='hidden lg:table-cell'>
                        <div className='flex items-center space-x-2'>
                          <MapPin className='h-4 w-4 text-muted-foreground' />
                          <span className='text-sm'>{customer.country}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(customer.status)}>
                          {formatStatus(customer.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className='hidden sm:table-cell'>
                        <div className='text-center'>
                          <p className='font-medium'>
                            {customer.total_bookings}
                          </p>
                          <p className='text-xs text-muted-foreground'>
                            {customer.last_booking
                              ? `Last: ${customer.last_booking}`
                              : "No bookings"}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className='hidden lg:table-cell'>
                        <p className='font-medium'>
                          {CustomerService.formatTotalSpent(
                            customer.total_spent
                          )}
                        </p>
                      </TableCell>
                      <TableCell className='hidden xl:table-cell'>
                        {customer.rating ? (
                          <div className='flex items-center space-x-1'>
                            <Star className='h-4 w-4 text-warning fill-current' />
                            <span>{customer.rating}</span>
                          </div>
                        ) : (
                          <span className='text-muted-foreground'>N/A</span>
                        )}
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
                            <DropdownMenuItem
                              onClick={() => handleViewProfile(customer)}>
                              <Eye className='mr-2 h-4 w-4' />
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleEditCustomer(customer)}>
                              <Edit className='mr-2 h-4 w-4' />
                              Edit Customer
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleBookingHistory(customer.custom_id)
                              }>
                              <Calendar className='mr-2 h-4 w-4' />
                              Booking History
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleSendMessage(customer.custom_id)
                              }>
                              <MessageSquare className='mr-2 h-4 w-4' />
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
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <AddCustomerModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onAddCustomer={handleAddCustomer}
      />

      <ImportCustomersModal
        open={isImportModalOpen}
        onOpenChange={setIsImportModalOpen}
        onImport={handleImportCustomers}
      />

      <CustomerDetailModal
        open={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
        customer={
          selectedCustomer ? formatCustomerForModal(selectedCustomer) : null
        }
      />

      <EditCustomerModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        customer={
          selectedCustomer ? formatCustomerForModal(selectedCustomer) : null
        }
        onSave={handleUpdateCustomer}
      />
    </div>
  );
};

export default CustomerManagement;
