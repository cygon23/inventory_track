import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Star,
  DollarSign,
  User,
  Heart,
  Clock,
} from "lucide-react";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  totalBookings: number;
  totalSpent: string;
  lastBooking: string | null;
  status: string;
  rating: number | null;
  joinDate: string;
  preferences: string[];
  upcomingTrip: string | null;
}

interface CustomerDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: Customer | null;
}

const CustomerDetailModal: React.FC<CustomerDetailModalProps> = ({
  open,
  onOpenChange,
  customer,
}) => {
  if (!customer) return null;

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

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const formatStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Customer Profile</DialogTitle>
          <DialogDescription>
            Complete customer information and booking history
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Customer Header */}
          <div className='flex items-center space-x-4 p-6 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg'>
            <Avatar className='h-16 w-16'>
              <AvatarFallback className='text-lg font-semibold'>
                {getInitials(customer.name)}
              </AvatarFallback>
            </Avatar>
            <div className='flex-1'>
              <div className='flex items-center space-x-3 mb-2'>
                <h2 className='text-2xl font-bold'>{customer.name}</h2>
                <Badge className={getStatusColor(customer.status)}>
                  {formatStatus(customer.status)}
                </Badge>
              </div>
              <p className='text-muted-foreground'>
                Customer ID: {customer.id}
              </p>
              <div className='flex items-center space-x-4 mt-2'>
                <div className='flex items-center space-x-1'>
                  <Calendar className='h-4 w-4 text-muted-foreground' />
                  <span className='text-sm'>Joined {customer.joinDate}</span>
                </div>
                {customer.rating && (
                  <div className='flex items-center space-x-1'>
                    <Star className='h-4 w-4 text-warning fill-current' />
                    <span className='text-sm font-medium'>
                      {customer.rating}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <Card>
              <CardContent className='p-4'>
                <div className='flex items-center space-x-3'>
                  <Calendar className='h-8 w-8 text-primary' />
                  <div>
                    <p className='text-sm text-muted-foreground'>
                      Total Bookings
                    </p>
                    <p className='text-2xl font-bold'>
                      {customer.totalBookings}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className='p-4'>
                <div className='flex items-center space-x-3'>
                  <DollarSign className='h-8 w-8 text-success' />
                  <div>
                    <p className='text-sm text-muted-foreground'>Total Spent</p>
                    <p className='text-2xl font-bold'>{customer.totalSpent}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className='p-4'>
                <div className='flex items-center space-x-3'>
                  <Clock className='h-8 w-8 text-warning' />
                  <div>
                    <p className='text-sm text-muted-foreground'>
                      Last Booking
                    </p>
                    <p className='text-lg font-semibold'>
                      {customer.lastBooking || "No bookings yet"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center space-x-2'>
                <User className='h-5 w-5' />
                <span>Contact Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='flex items-center space-x-3'>
                  <Mail className='h-5 w-5 text-muted-foreground' />
                  <div>
                    <p className='text-sm text-muted-foreground'>Email</p>
                    <p className='font-medium'>{customer.email}</p>
                  </div>
                </div>
                <div className='flex items-center space-x-3'>
                  <Phone className='h-5 w-5 text-muted-foreground' />
                  <div>
                    <p className='text-sm text-muted-foreground'>Phone</p>
                    <p className='font-medium'>{customer.phone}</p>
                  </div>
                </div>
                <div className='flex items-center space-x-3'>
                  <MapPin className='h-5 w-5 text-muted-foreground' />
                  <div>
                    <p className='text-sm text-muted-foreground'>Country</p>
                    <p className='font-medium'>{customer.country}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Safari Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center space-x-2'>
                <Heart className='h-5 w-5' />
                <span>Safari Preferences</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex flex-wrap gap-2'>
                {customer.preferences.map((preference, index) => (
                  <Badge key={index} variant='outline' className='px-3 py-1'>
                    {preference}
                  </Badge>
                ))}
                {customer.preferences.length === 0 && (
                  <p className='text-muted-foreground'>
                    No preferences recorded
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Trip */}
          {customer.upcomingTrip && (
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center space-x-2'>
                  <Calendar className='h-5 w-5' />
                  <span>Upcoming Trip</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='p-4 bg-primary/5 rounded-lg'>
                  <p className='font-semibold text-primary'>
                    {customer.upcomingTrip}
                  </p>
                  <p className='text-sm text-muted-foreground mt-1'>
                    Trip details and itinerary
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerDetailModal;
