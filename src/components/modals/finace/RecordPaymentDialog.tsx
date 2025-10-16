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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, DollarSign, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  fetchBookingsForPayment,
  createPayment,
} from "@/services/paymentService";
import { useToast } from "@/components/ui/use-toast";

interface Booking {
  id: string;
  booking_reference: string;
  customer_name: string;
  total_amount: number;
  paid_amount: number;
}

interface RecordPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: () => void;
}

const RecordPaymentDialog: React.FC<RecordPaymentDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
}) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const [bookingId, setBookingId] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [paymentType, setPaymentType] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [status, setStatus] = useState("completed");
  const [dueDate, setDueDate] = useState<Date>();
  const [paidDate, setPaidDate] = useState<Date>(new Date());
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (open) {
      loadBookings();
    }
  }, [open]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const data = await fetchBookingsForPayment();
      setBookings(data);
    } catch (error) {
      console.error("Error loading bookings:", error);
      toast({
        title: "Error",
        description: "Failed to load bookings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBookingSelect = (value: string) => {
    setBookingId(value);
    const booking = bookings.find((b) => b.id === value);
    setSelectedBooking(booking || null);

    if (booking) {
      const remainingAmount = booking.total_amount - (booking.paid_amount || 0);
      setAmount(remainingAmount.toString());
      setDescription(`Payment for ${booking.booking_reference}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!bookingId || !amount || !paymentType || !paymentMethod || !dueDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);

      const paymentData = {
        booking_id: bookingId,
        customer_name: selectedBooking?.customer_name || "",
        amount: parseFloat(amount),
        currency,
        type: paymentType,
        method: paymentMethod,
        status,
        due_date: format(dueDate, "yyyy-MM-dd"),
        paid_date:
          status === "completed" && paidDate
            ? format(paidDate, "yyyy-MM-dd")
            : undefined,
        description,
      };

      await createPayment(paymentData);

      toast({
        title: "Success",
        description: "Payment recorded successfully",
      });

      // Reset form
      resetForm();
      onOpenChange(false);
      if (onSubmit) onSubmit();
    } catch (error) {
      console.error("Error recording payment:", error);
      toast({
        title: "Error",
        description: "Failed to record payment",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setBookingId("");
    setSelectedBooking(null);
    setAmount("");
    setPaymentType("");
    setPaymentMethod("");
    setDueDate(undefined);
    setPaidDate(new Date());
    setDescription("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center'>
            <DollarSign className='h-5 w-5 mr-2' />
            Record New Payment
          </DialogTitle>
          <DialogDescription>
            Enter payment details for a customer transaction
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-6'>
          {/* Booking Selection */}
          <div className='space-y-4'>
            <h3 className='font-semibold'>Booking Information</h3>

            <div className='space-y-2'>
              <Label htmlFor='booking'>Select Booking *</Label>
              {loading ? (
                <div className='flex items-center justify-center p-4'>
                  <Loader2 className='h-6 w-6 animate-spin' />
                </div>
              ) : (
                <Select value={bookingId} onValueChange={handleBookingSelect}>
                  <SelectTrigger id='booking'>
                    <SelectValue placeholder='Select a booking' />
                  </SelectTrigger>
                  <SelectContent>
                    {bookings.map((booking) => (
                      <SelectItem key={booking.id} value={booking.id}>
                        {booking.booking_reference} - {booking.customer_name}
                        (Remaining: $
                        {(
                          booking.total_amount - (booking.paid_amount || 0)
                        ).toFixed(2)}
                        )
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {selectedBooking && (
              <div className='p-4 border rounded-lg bg-muted/50'>
                <div className='grid grid-cols-2 gap-4 text-sm'>
                  <div>
                    <p className='text-muted-foreground'>Customer</p>
                    <p className='font-medium'>
                      {selectedBooking.customer_name}
                    </p>
                  </div>
                  <div>
                    <p className='text-muted-foreground'>Total Amount</p>
                    <p className='font-medium'>
                      ${selectedBooking.total_amount.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className='text-muted-foreground'>Paid Amount</p>
                    <p className='font-medium'>
                      ${(selectedBooking.paid_amount || 0).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className='text-muted-foreground'>Remaining</p>
                    <p className='font-medium text-orange-600'>
                      $
                      {(
                        selectedBooking.total_amount -
                        (selectedBooking.paid_amount || 0)
                      ).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Payment Details */}
          <div className='space-y-4'>
            <h3 className='font-semibold'>Payment Details</h3>

            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='amount'>Amount *</Label>
                <Input
                  id='amount'
                  type='number'
                  step='0.01'
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder='2500.00'
                  required
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='currency'>Currency *</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger id='currency'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='USD'>USD - US Dollar</SelectItem>
                    <SelectItem value='EUR'>EUR - Euro</SelectItem>
                    <SelectItem value='GBP'>GBP - British Pound</SelectItem>
                    <SelectItem value='TZS'>
                      TZS - Tanzanian Shilling
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='paymentType'>Payment Type *</Label>
                <Select value={paymentType} onValueChange={setPaymentType}>
                  <SelectTrigger id='paymentType'>
                    <SelectValue placeholder='Select type' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='deposit'>Deposit</SelectItem>
                    <SelectItem value='balance'>Balance Payment</SelectItem>
                    <SelectItem value='full_payment'>Full Payment</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='paymentMethod'>Payment Method *</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger id='paymentMethod'>
                    <SelectValue placeholder='Select method' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='Credit Card'>Credit Card</SelectItem>
                    <SelectItem value='Bank Transfer'>Bank Transfer</SelectItem>
                    <SelectItem value='Cash'>Cash</SelectItem>
                    <SelectItem value='PayPal'>PayPal</SelectItem>
                    <SelectItem value='Wire Transfer'>Wire Transfer</SelectItem>
                    <SelectItem value='Mobile Money'>Mobile Money</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='status'>Payment Status *</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger id='status'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='completed'>Completed</SelectItem>
                  <SelectItem value='pending'>Pending</SelectItem>
                  <SelectItem value='failed'>Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Dates */}
          <div className='space-y-4'>
            <h3 className='font-semibold'>Date Information</h3>

            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label>Due Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant='outline'
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dueDate && "text-muted-foreground"
                      )}>
                      <CalendarIcon className='mr-2 h-4 w-4' />
                      {dueDate ? format(dueDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto p-0' align='start'>
                    <Calendar
                      mode='single'
                      selected={dueDate}
                      onSelect={setDueDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {status === "completed" && (
                <div className='space-y-2'>
                  <Label>Paid Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant='outline'
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !paidDate && "text-muted-foreground"
                        )}>
                        <CalendarIcon className='mr-2 h-4 w-4' />
                        {paidDate ? format(paidDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0' align='start'>
                      <Calendar
                        mode='single'
                        selected={paidDate}
                        onSelect={(date) => setPaidDate(date || new Date())}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className='space-y-2'>
            <Label htmlFor='description'>Description</Label>
            <Textarea
              id='description'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder='Payment description...'
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
              disabled={submitting}>
              Cancel
            </Button>
            <Button type='submit' disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Recording...
                </>
              ) : (
                "Record Payment"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RecordPaymentDialog;
