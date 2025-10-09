import React, { useState } from "react";
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
import { Calendar as CalendarIcon, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

interface RecordPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (paymentData: any) => void;
}

const RecordPaymentDialog: React.FC<RecordPaymentDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
}) => {
  const [bookingId, setBookingId] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [paymentType, setPaymentType] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [status, setStatus] = useState("completed");
  const [dueDate, setDueDate] = useState<Date>();
  const [paidDate, setPaidDate] = useState<Date>();
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const paymentData = {
      id: `PAY-${Date.now()}`,
      bookingId,
      customerName,
      amount: parseFloat(amount),
      currency,
      type: paymentType,
      method: paymentMethod,
      status,
      dueDate: dueDate?.toISOString(),
      paidDate: paidDate?.toISOString(),
      description,
    };

    if (onSubmit) {
      onSubmit(paymentData);
    }

    // Reset form
    setBookingId("");
    setCustomerName("");
    setAmount("");
    setPaymentType("");
    setPaymentMethod("");
    setDueDate(undefined);
    setPaidDate(undefined);
    setDescription("");

    onOpenChange(false);
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
          {/* Customer Information */}
          <div className='space-y-4'>
            <h3 className='font-semibold'>Customer Information</h3>

            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='bookingId'>Booking ID *</Label>
                <Input
                  id='bookingId'
                  value={bookingId}
                  onChange={(e) => setBookingId(e.target.value)}
                  placeholder='BK-2024-001'
                  required
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='customerName'>Customer Name *</Label>
                <Input
                  id='customerName'
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder='John Smith'
                  required
                />
              </div>
            </div>
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
                        onSelect={setPaidDate}
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
              placeholder='Deposit for Serengeti Safari...'
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type='submit'>Record Payment</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RecordPaymentDialog;
