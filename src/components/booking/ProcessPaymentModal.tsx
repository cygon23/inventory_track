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
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  CreditCard,
  DollarSign,
  Calendar,
  Receipt,
  AlertCircle,
  Loader2,
  Smartphone,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { usePaymentProcessing } from "@/hooks/usePaymentProcessing";
import { supabase, User } from "@/lib/supabase";

interface ProcessPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: any;
  onSuccess?: () => void;
}

const ProcessPaymentDialog: React.FC<ProcessPaymentDialogProps> = ({
  open,
  onOpenChange,
  booking,
  onSuccess,
}) => {
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<string>("bank_transfer");
  const [transactionReference, setTransactionReference] = useState<string>("");
  const [paymentNotes, setPaymentNotes] = useState<string>("");
  const [mobileProvider, setMobileProvider] = useState<string>("m_pesa");
  const [paymentEvidence, setPaymentEvidence] = useState<File | null>(null);
  const [paymentDate, setPaymentDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  const { processPayment, isSubmitting, error, resetError } =
    usePaymentProcessing(supabase);

  useEffect(() => {
    if (booking && open) {
      const remaining =
        (booking.total_amount || 0) - (booking.paid_amount || 0);
      setPaymentAmount(remaining > 0 ? remaining : 0);
      setPaymentMethod(booking.payment_method || "bank_transfer");
      setTransactionReference("");
      setPaymentNotes("");
      setMobileProvider("m_pesa");
      setPaymentEvidence(null);
      setPaymentDate(new Date().toISOString().split("T")[0]);
      resetError();
    }
  }, [booking, open, resetError]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount || 0);
  };

  const getRemainingBalance = () => {
    return (booking?.total_amount || 0) - (booking?.paid_amount || 0);
  };

  const getNewPaidAmount = () => {
    return (booking?.paid_amount || 0) + paymentAmount;
  };

  const getNewRemainingBalance = () => {
    return (booking?.total_amount || 0) - getNewPaidAmount();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await processPayment({
      bookingId: booking.id,
      customerName: booking.customer_name,
      amount: paymentAmount,
      method: paymentMethod,
      mobileProvider:
        paymentMethod === "mobile_money" ? mobileProvider : undefined,
      transactionReference: transactionReference || undefined,
      notes: paymentNotes || undefined,
      paymentDate,
      evidenceFile: paymentEvidence,
      totalAmount: booking.total_amount,
      paidAmount: booking.paid_amount,
      bookingReference: booking.booking_reference,
      checkIn: booking.check_in,
    });

    if (result.success) {
      onOpenChange(false);
      if (onSuccess) {
        onSuccess();
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPaymentEvidence(e.target.files[0]);
    }
  };

  if (!booking) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl max-h-[90vh]'>
        <DialogHeader>
          <DialogTitle className='text-2xl flex items-center gap-2'>
            <DollarSign className='h-6 w-6 text-primary' />
            Process Payment
          </DialogTitle>
          <DialogDescription>
            Record payment for booking {booking.booking_reference}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <ScrollArea className='max-h-[60vh] pr-4'>
            <div className='space-y-6'>
              {/* Error Alert */}
              {error && (
                <Alert variant='destructive'>
                  <AlertCircle className='h-4 w-4' />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Payment Summary Card */}
              <Card className='border-primary/20'>
                <CardContent className='pt-6'>
                  <div className='space-y-4'>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm text-muted-foreground'>
                        Customer
                      </span>
                      <span className='font-semibold'>
                        {booking.customer_name}
                      </span>
                    </div>
                    <Separator />
                    <div className='flex items-center justify-between'>
                      <span className='text-sm text-muted-foreground'>
                        Total Amount
                      </span>
                      <span className='text-lg font-bold'>
                        {formatCurrency(booking.total_amount)}
                      </span>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm text-muted-foreground'>
                        Already Paid
                      </span>
                      <span className='text-lg font-semibold text-green-600'>
                        {formatCurrency(booking.paid_amount)}
                      </span>
                    </div>
                    <Separator />
                    <div className='flex items-center justify-between'>
                      <span className='text-sm font-semibold'>
                        Remaining Balance
                      </span>
                      <span className='text-xl font-bold text-orange-600'>
                        {formatCurrency(getRemainingBalance())}
                      </span>
                    </div>
                    <div className='pt-2'>
                      <Badge
                        variant={
                          booking.payment_status === "paid"
                            ? "default"
                            : "secondary"
                        }
                        className='w-full justify-center py-2'>
                        {booking.payment_status?.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Amount */}
              <div className='space-y-2'>
                <Label
                  htmlFor='payment_amount'
                  className='text-base font-semibold'>
                  Payment Amount <span className='text-destructive'>*</span>
                </Label>
                <div className='relative'>
                  <DollarSign className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                  <Input
                    id='payment_amount'
                    type='number'
                    min='0'
                    step='0.01'
                    max={getRemainingBalance()}
                    value={paymentAmount}
                    onChange={(e) =>
                      setPaymentAmount(parseFloat(e.target.value) || 0)
                    }
                    className='pl-10 text-lg font-semibold'
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className='flex justify-between text-sm'>
                  <Button
                    type='button'
                    variant='link'
                    size='sm'
                    className='h-auto p-0 text-primary'
                    onClick={() => setPaymentAmount(getRemainingBalance() / 2)}
                    disabled={isSubmitting}>
                    50% ({formatCurrency(getRemainingBalance() / 2)})
                  </Button>
                  <Button
                    type='button'
                    variant='link'
                    size='sm'
                    className='h-auto p-0 text-primary'
                    onClick={() => setPaymentAmount(getRemainingBalance())}
                    disabled={isSubmitting}>
                    Pay Full Balance
                  </Button>
                </div>
              </div>

              {/* Payment Method */}
              <div className='space-y-2'>
                <Label
                  htmlFor='payment_method'
                  className='text-base font-semibold'>
                  Payment Method <span className='text-destructive'>*</span>
                </Label>
                <Select
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                  disabled={isSubmitting}>
                  <SelectTrigger className='h-12'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className='bg-popover z-50'>
                    <SelectItem value='bank_transfer'>
                      <div className='flex items-center gap-2'>
                        <CreditCard className='h-4 w-4' />
                        Bank Transfer
                      </div>
                    </SelectItem>
                    <SelectItem value='credit_card'>
                      <div className='flex items-center gap-2'>
                        <CreditCard className='h-4 w-4' />
                        Credit Card
                      </div>
                    </SelectItem>
                    <SelectItem value='debit_card'>
                      <div className='flex items-center gap-2'>
                        <CreditCard className='h-4 w-4' />
                        Debit Card
                      </div>
                    </SelectItem>
                    <SelectItem value='paypal'>
                      <div className='flex items-center gap-2'>
                        <DollarSign className='h-4 w-4' />
                        PayPal
                      </div>
                    </SelectItem>
                    <SelectItem value='cash'>
                      <div className='flex items-center gap-2'>
                        <DollarSign className='h-4 w-4' />
                        Cash
                      </div>
                    </SelectItem>
                    <SelectItem value='mobile_money'>
                      <div className='flex items-center gap-2'>
                        <Smartphone className='h-4 w-4' />
                        Mobile Money (Tanzania)
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Mobile Money Provider */}
              {paymentMethod === "mobile_money" && (
                <div className='space-y-2'>
                  <Label
                    htmlFor='mobile_provider'
                    className='text-base font-semibold'>
                    Mobile Money Provider{" "}
                    <span className='text-destructive'>*</span>
                  </Label>
                  <Select
                    value={mobileProvider}
                    onValueChange={setMobileProvider}
                    disabled={isSubmitting}>
                    <SelectTrigger className='h-12'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className='bg-popover z-50'>
                      <SelectItem value='m_pesa'>M-Pesa (Vodacom)</SelectItem>
                      <SelectItem value='airtel_money'>Airtel Money</SelectItem>
                      <SelectItem value='tigopesa'>Tigopesa (Tigo)</SelectItem>
                      <SelectItem value='halopesa'>
                        Halopesa (Halotel)
                      </SelectItem>
                      <SelectItem value='t_pesa'>T-Pesa (TTCL)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className='text-xs text-muted-foreground'>
                    Most popular: M-Pesa and Airtel Money for tourism payments
                  </p>
                </div>
              )}

              {/* Transaction Reference */}
              <div className='space-y-2'>
                <Label
                  htmlFor='transaction_reference'
                  className='text-base font-semibold'>
                  Transaction Reference
                </Label>
                <div className='relative'>
                  <Receipt className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                  <Input
                    id='transaction_reference'
                    value={transactionReference}
                    onChange={(e) => setTransactionReference(e.target.value)}
                    placeholder='e.g., TXN123456789'
                    className='pl-10'
                    disabled={isSubmitting}
                  />
                </div>
                <p className='text-xs text-muted-foreground'>
                  Bank reference, mobile money confirmation code, or transaction
                  ID
                </p>
              </div>

              {/* Payment Date */}
              <div className='space-y-2'>
                <Label
                  htmlFor='payment_date'
                  className='text-base font-semibold'>
                  Payment Date <span className='text-destructive'>*</span>
                </Label>
                <div className='relative'>
                  <Calendar className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                  <Input
                    id='payment_date'
                    type='date'
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    className='pl-10'
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Payment Evidence Upload */}
              <div className='space-y-2'>
                <Label
                  htmlFor='payment_evidence'
                  className='text-base font-semibold'>
                  Payment Evidence{" "}
                  {paymentMethod === "bank_transfer" && (
                    <span className='text-destructive'>*</span>
                  )}
                </Label>
                <div className='border-2 border-dashed rounded-lg p-4 hover:border-primary/50 transition-colors'>
                  <Input
                    id='payment_evidence'
                    type='file'
                    accept='image/*,.pdf'
                    onChange={handleFileChange}
                    className='cursor-pointer'
                    disabled={isSubmitting}
                  />
                  {paymentEvidence && (
                    <p className='text-sm text-green-600 mt-2 flex items-center gap-2'>
                      <Receipt className='h-4 w-4' />
                      {paymentEvidence.name}
                    </p>
                  )}
                </div>
                <p className='text-xs text-muted-foreground'>
                  {paymentMethod === "bank_transfer" &&
                    "Upload bank statement or transfer receipt (required)"}
                  {paymentMethod === "mobile_money" &&
                    "Upload mobile money confirmation SMS or screenshot"}
                  {paymentMethod === "credit_card" &&
                    "Upload payment receipt or confirmation"}
                  {paymentMethod === "debit_card" &&
                    "Upload payment receipt or confirmation"}
                  {paymentMethod === "paypal" &&
                    "Upload PayPal transaction confirmation"}
                  {paymentMethod === "cash" &&
                    "Upload signed receipt (optional)"}
                </p>
              </div>

              {/* Payment Notes */}
              <div className='space-y-2'>
                <Label
                  htmlFor='payment_notes'
                  className='text-base font-semibold'>
                  Payment Notes
                </Label>
                <Textarea
                  id='payment_notes'
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  placeholder='Add any additional notes about this payment...'
                  rows={3}
                  disabled={isSubmitting}
                />
              </div>

              {/* Payment Preview */}
              <Card className='border-green-200 bg-green-50/50'>
                <CardContent className='pt-6'>
                  <h4 className='font-semibold mb-3 flex items-center gap-2'>
                    <Receipt className='h-5 w-5 text-green-600' />
                    Payment Preview
                  </h4>
                  <div className='space-y-2 text-sm'>
                    <div className='flex justify-between'>
                      <span className='text-muted-foreground'>
                        Current Paid Amount
                      </span>
                      <span className='font-medium'>
                        {formatCurrency(booking.paid_amount)}
                      </span>
                    </div>
                    <div className='flex justify-between text-green-700 font-semibold'>
                      <span>+ Payment Amount</span>
                      <span>+ {formatCurrency(paymentAmount)}</span>
                    </div>
                    <Separator />
                    <div className='flex justify-between text-base font-bold'>
                      <span>New Paid Amount</span>
                      <span>{formatCurrency(getNewPaidAmount())}</span>
                    </div>
                    <div className='flex justify-between text-orange-600'>
                      <span>New Remaining Balance</span>
                      <span className='font-semibold'>
                        {formatCurrency(getNewRemainingBalance())}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>

          <DialogFooter className='mt-6'>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              type='submit'
              className='gap-2'
              disabled={
                isSubmitting ||
                paymentAmount <= 0 ||
                paymentAmount > getRemainingBalance() ||
                (paymentMethod === "bank_transfer" && !paymentEvidence)
              }>
              {isSubmitting ? (
                <>
                  <Loader2 className='h-4 w-4 animate-spin' />
                  Processing...
                </>
              ) : (
                <>
                  <DollarSign className='h-4 w-4' />
                  Record Payment
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProcessPaymentDialog;
