import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import { bookingService } from "@/services/bookingService";
import { useToast } from "@/hooks/use-toast";

interface EditBookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: any;
  onSuccess: () => void;
}

const EditBookingDialog: React.FC<EditBookingDialogProps> = ({
  open,
  onOpenChange,
  booking,
  onSuccess,
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    customer_custom_id: "",
    safari_package: "",
    start_date: "",
    end_date: "",
    adults: 1,
    children: 0,
    total_amount: 0,
    paid_amount: 0,
    status: "inquiry",
    payment_status: "pending",
    payment_method: "",
    special_requirements: "",
  });

  useEffect(() => {
    if (booking && open) {
      setFormData({
        customer_name: booking.customer_name || "",
        customer_email: booking.customer_email || "",
        customer_phone: booking.customer_phone || "",
        customer_custom_id: booking.customer_custom_id || "",
        safari_package: booking.safari_package || "",
        start_date: booking.start_date || "",
        end_date: booking.end_date || "",
        adults: booking.adults || 1,
        children: booking.children || 0,
        total_amount: booking.total_amount || 0,
        paid_amount: booking.paid_amount || 0,
        status: booking.status || "inquiry",
        payment_status: booking.payment_status || "pending",
        payment_method: booking.payment_method || "",
        special_requirements: booking.special_requirements || "",
      });
    }
  }, [booking, open]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "number" ? (value === "" ? 0 : parseFloat(value)) : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await bookingService.updateBooking(
        booking.id,
        formData
      );

      if (error) {
        throw error;
      }

      toast({
        title: "Booking Updated",
        description: "The booking has been successfully updated.",
      });

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error updating booking:", error);
      toast({
        title: "Update Failed",
        description:
          error.message || "Failed to update booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-3xl max-h-[90vh]'>
        <DialogHeader>
          <DialogTitle className='text-2xl'>Edit Booking</DialogTitle>
          <DialogDescription>
            Update booking details for {booking?.booking_reference}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <ScrollArea className='max-h-[60vh] pr-4'>
            <div className='space-y-6'>
              {/* Customer Information */}
              <div className='space-y-4'>
                <h3 className='font-semibold text-lg'>Customer Information</h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='customer_name'>
                      Full Name <span className='text-destructive'>*</span>
                    </Label>
                    <Input
                      id='customer_name'
                      name='customer_name'
                      value={formData.customer_name}
                      onChange={handleInputChange}
                      required
                      placeholder='John Doe'
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='customer_custom_id'>Customer ID</Label>
                    <Input
                      id='customer_custom_id'
                      name='customer_custom_id'
                      value={formData.customer_custom_id}
                      onChange={handleInputChange}
                      placeholder='CUST-001'
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='customer_email'>
                      Email <span className='text-destructive'>*</span>
                    </Label>
                    <Input
                      id='customer_email'
                      name='customer_email'
                      type='email'
                      value={formData.customer_email}
                      onChange={handleInputChange}
                      required
                      placeholder='customer@example.com'
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='customer_phone'>Phone Number</Label>
                    <Input
                      id='customer_phone'
                      name='customer_phone'
                      value={formData.customer_phone}
                      onChange={handleInputChange}
                      placeholder='+1 234 567 8900'
                    />
                  </div>
                </div>
              </div>

              {/* Safari Package Details */}
              <div className='space-y-4'>
                <h3 className='font-semibold text-lg'>Safari Package</h3>
                <div className='space-y-2'>
                  <Label htmlFor='safari_package'>
                    Package Name <span className='text-destructive'>*</span>
                  </Label>
                  <Input
                    id='safari_package'
                    name='safari_package'
                    value={formData.safari_package}
                    onChange={handleInputChange}
                    required
                    placeholder='Serengeti Adventure'
                  />
                </div>
              </div>

              {/* Travel Dates & Guests */}
              <div className='space-y-4'>
                <h3 className='font-semibold text-lg'>Travel Information</h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='start_date'>
                      Start Date <span className='text-destructive'>*</span>
                    </Label>
                    <Input
                      id='start_date'
                      name='start_date'
                      type='date'
                      value={formData.start_date}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='end_date'>
                      End Date <span className='text-destructive'>*</span>
                    </Label>
                    <Input
                      id='end_date'
                      name='end_date'
                      type='date'
                      value={formData.end_date}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='adults'>
                      Adults <span className='text-destructive'>*</span>
                    </Label>
                    <Input
                      id='adults'
                      name='adults'
                      type='number'
                      min='1'
                      value={formData.adults}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='children'>Children</Label>
                    <Input
                      id='children'
                      name='children'
                      type='number'
                      min='0'
                      value={formData.children}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              {/* Financial Information */}
              <div className='space-y-4'>
                <h3 className='font-semibold text-lg'>Financial Details</h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='total_amount'>
                      Total Amount (USD){" "}
                      <span className='text-destructive'>*</span>
                    </Label>
                    <Input
                      id='total_amount'
                      name='total_amount'
                      type='number'
                      min='0'
                      step='0.01'
                      value={formData.total_amount}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='paid_amount'>Paid Amount (USD)</Label>
                    <Input
                      id='paid_amount'
                      name='paid_amount'
                      type='number'
                      min='0'
                      step='0.01'
                      value={formData.paid_amount}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='payment_method'>Payment Method</Label>
                    <Select
                      value={formData.payment_method}
                      onValueChange={(value) =>
                        handleSelectChange("payment_method", value)
                      }>
                      <SelectTrigger>
                        <SelectValue placeholder='Select payment method' />
                      </SelectTrigger>
                      <SelectContent className='bg-popover z-50'>
                        <SelectItem value='bank_transfer'>
                          Bank Transfer
                        </SelectItem>
                        <SelectItem value='credit_card'>Credit Card</SelectItem>
                        <SelectItem value='paypal'>PayPal</SelectItem>
                        <SelectItem value='cash'>Cash</SelectItem>
                        <SelectItem value='mobile_money'>
                          Mobile Money
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='payment_status'>Payment Status</Label>
                    <Select
                      value={formData.payment_status}
                      onValueChange={(value) =>
                        handleSelectChange("payment_status", value)
                      }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className='bg-popover z-50'>
                        <SelectItem value='pending'>Pending</SelectItem>
                        <SelectItem value='partial'>Partial</SelectItem>
                        <SelectItem value='paid'>Paid</SelectItem>
                        <SelectItem value='refunded'>Refunded</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Booking Status */}
              <div className='space-y-4'>
                <h3 className='font-semibold text-lg'>Booking Status</h3>
                <div className='space-y-2'>
                  <Label htmlFor='status'>Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      handleSelectChange("status", value)
                    }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className='bg-popover z-50'>
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

              {/* Special Requirements */}
              <div className='space-y-4'>
                <h3 className='font-semibold text-lg'>
                  Additional Information
                </h3>
                <div className='space-y-2'>
                  <Label htmlFor='special_requirements'>
                    Special Requirements
                  </Label>
                  <Textarea
                    id='special_requirements'
                    name='special_requirements'
                    value={formData.special_requirements}
                    onChange={handleInputChange}
                    placeholder='Any special requests, dietary requirements, accessibility needs, etc.'
                    rows={4}
                  />
                </div>
              </div>
            </div>
          </ScrollArea>

          <DialogFooter className='mt-6'>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
              disabled={isLoading}>
              Cancel
            </Button>
            <Button type='submit' disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Updating...
                </>
              ) : (
                "Update Booking"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditBookingDialog;
