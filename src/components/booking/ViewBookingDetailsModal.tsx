import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Calendar,
  Users,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  User,
  Clock,
  DollarSign,
  FileText,
} from "lucide-react";

interface ViewBookingDetailsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: any;
}

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

const ViewBookingDetails: React.FC<ViewBookingDetailsProps> = ({
  open,
  onOpenChange,
  booking,
}) => {
  if (!booking) return null;

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
      month: "long",
      day: "numeric",
    });
  };

  const getPaymentProgress = () => {
    if (!booking.total_amount) return 0;
    return Math.round((booking.paid_amount / booking.total_amount) * 100);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-3xl max-h-[90vh]'>
        <DialogHeader>
          <DialogTitle className='text-2xl'>Booking Details</DialogTitle>
          <DialogDescription>
            Reference: {booking.booking_reference}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className='max-h-[70vh] pr-4'>
          <div className='space-y-6'>
            {/* Status Section */}
            <div className='flex flex-wrap gap-3'>
              <Badge
                className={`${
                  bookingStatusColors[
                    booking.status as keyof typeof bookingStatusColors
                  ]
                } px-4 py-2 text-sm`}>
                {booking.status?.replace("_", " ").toUpperCase()}
              </Badge>
              <Badge
                className={`${
                  paymentStatusColors[
                    booking.payment_status as keyof typeof paymentStatusColors
                  ]
                } px-4 py-2 text-sm`}>
                Payment: {booking.payment_status?.toUpperCase()}
              </Badge>
            </div>

            <Separator />

            {/* Customer Information */}
            <div>
              <h3 className='text-lg font-semibold mb-4 flex items-center gap-2'>
                <User className='h-5 w-5 text-primary' />
                Customer Information
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='space-y-1'>
                  <p className='text-sm text-muted-foreground'>Full Name</p>
                  <p className='font-medium'>{booking.customer_name}</p>
                </div>
                <div className='space-y-1'>
                  <p className='text-sm text-muted-foreground'>Customer ID</p>
                  <p className='font-medium font-mono'>
                    {booking.customer_custom_id || "N/A"}
                  </p>
                </div>
                <div className='space-y-1 flex items-start gap-2'>
                  <Mail className='h-4 w-4 text-muted-foreground mt-1' />
                  <div>
                    <p className='text-sm text-muted-foreground'>Email</p>
                    <p className='font-medium'>{booking.customer_email}</p>
                  </div>
                </div>
                <div className='space-y-1 flex items-start gap-2'>
                  <Phone className='h-4 w-4 text-muted-foreground mt-1' />
                  <div>
                    <p className='text-sm text-muted-foreground'>Phone</p>
                    <p className='font-medium'>
                      {booking.customer_phone || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Safari Package Details */}
            <div>
              <h3 className='text-lg font-semibold mb-4 flex items-center gap-2'>
                <MapPin className='h-5 w-5 text-primary' />
                Safari Package
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='space-y-1'>
                  <p className='text-sm text-muted-foreground'>Package Name</p>
                  <p className='font-medium'>{booking.safari_package}</p>
                </div>
                <div className='space-y-1'>
                  <p className='text-sm text-muted-foreground'>Destination</p>
                  <p className='font-medium'>
                    {booking.destination || "Tanzania"}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Travel Dates & Guests */}
            <div>
              <h3 className='text-lg font-semibold mb-4 flex items-center gap-2'>
                <Calendar className='h-5 w-5 text-primary' />
                Travel Information
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='space-y-1'>
                  <p className='text-sm text-muted-foreground'>Start Date</p>
                  <p className='font-medium'>
                    {formatDate(booking.start_date)}
                  </p>
                </div>
                <div className='space-y-1'>
                  <p className='text-sm text-muted-foreground'>End Date</p>
                  <p className='font-medium'>{formatDate(booking.end_date)}</p>
                </div>
                <div className='space-y-1 flex items-start gap-2'>
                  <Users className='h-4 w-4 text-muted-foreground mt-1' />
                  <div>
                    <p className='text-sm text-muted-foreground'>Guests</p>
                    <p className='font-medium'>
                      {booking.adults || 0} Adults, {booking.children || 0}{" "}
                      Children
                    </p>
                  </div>
                </div>
                <div className='space-y-1 flex items-start gap-2'>
                  <Clock className='h-4 w-4 text-muted-foreground mt-1' />
                  <div>
                    <p className='text-sm text-muted-foreground'>Duration</p>
                    <p className='font-medium'>
                      {booking.start_date && booking.end_date
                        ? Math.ceil(
                            (new Date(booking.end_date).getTime() -
                              new Date(booking.start_date).getTime()) /
                              (1000 * 60 * 60 * 24)
                          )
                        : 0}{" "}
                      days
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Financial Information */}
            <div>
              <h3 className='text-lg font-semibold mb-4 flex items-center gap-2'>
                <DollarSign className='h-5 w-5 text-primary' />
                Financial Details
              </h3>
              <div className='space-y-4'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='space-y-1'>
                    <p className='text-sm text-muted-foreground'>
                      Total Amount
                    </p>
                    <p className='text-2xl font-bold text-primary'>
                      {formatCurrency(booking.total_amount)}
                    </p>
                  </div>
                  <div className='space-y-1'>
                    <p className='text-sm text-muted-foreground'>Paid Amount</p>
                    <p className='text-2xl font-bold text-green-600'>
                      {formatCurrency(booking.paid_amount)}
                    </p>
                  </div>
                  <div className='space-y-1'>
                    <p className='text-sm text-muted-foreground'>
                      Remaining Balance
                    </p>
                    <p className='text-xl font-semibold text-orange-600'>
                      {formatCurrency(
                        booking.total_amount - booking.paid_amount
                      )}
                    </p>
                  </div>
                  <div className='space-y-1 flex items-start gap-2'>
                    <CreditCard className='h-4 w-4 text-muted-foreground mt-1' />
                    <div>
                      <p className='text-sm text-muted-foreground'>
                        Payment Method
                      </p>
                      <p className='font-medium'>
                        {booking.payment_method || "Not specified"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Payment Progress Bar */}
                <div className='space-y-2'>
                  <div className='flex justify-between text-sm'>
                    <span className='text-muted-foreground'>
                      Payment Progress
                    </span>
                    <span className='font-semibold'>
                      {getPaymentProgress()}%
                    </span>
                  </div>
                  <div className='w-full bg-muted rounded-full h-3'>
                    <div
                      className='bg-green-600 h-3 rounded-full transition-all duration-300'
                      style={{ width: `${getPaymentProgress()}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Special Requirements & Notes */}
            {booking.special_requirements && (
              <>
                <Separator />
                <div>
                  <h3 className='text-lg font-semibold mb-4 flex items-center gap-2'>
                    <FileText className='h-5 w-5 text-primary' />
                    Special Requirements
                  </h3>
                  <p className='text-sm text-muted-foreground bg-muted p-4 rounded-lg'>
                    {booking.special_requirements}
                  </p>
                </div>
              </>
            )}

            {/* Timestamps */}
            <div className='pt-4 border-t'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-muted-foreground'>
                <p>Created: {formatDate(booking.created_at)}</p>
                {booking.updated_at && (
                  <p>Last Updated: {formatDate(booking.updated_at)}</p>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ViewBookingDetails;
