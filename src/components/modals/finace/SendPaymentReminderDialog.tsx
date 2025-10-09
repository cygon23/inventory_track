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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Send, Mail, MessageSquare, AlertCircle } from "lucide-react";

interface Payment {
  id: string;
  bookingId: string;
  customerName: string;
  amount: number;
  currency: string;
  status: string;
  dueDate: string;
  method: string;
  type: string;
  description: string;
}

interface SendPaymentReminderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment: Payment | null;
  onSend?: (reminderData: any) => void;
}

const SendPaymentReminderDialog: React.FC<SendPaymentReminderDialogProps> = ({
  open,
  onOpenChange,
  payment,
  onSend,
}) => {
  const [sendEmail, setSendEmail] = useState(true);
  const [sendSms, setSendSms] = useState(false);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  // Move all hooks BEFORE any early returns
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const isOverdue = payment ? new Date(payment.dueDate) < new Date() : false;

  const defaultMessage = payment
    ? `Dear ${payment.customerName},

This is a ${
        isOverdue
          ? "reminder that your payment is overdue"
          : "friendly reminder about your upcoming payment"
      }.

Payment Details:
- Amount: ${formatCurrency(payment.amount, payment.currency)}
- Due Date: ${formatDate(payment.dueDate)}
- Booking: ${payment.bookingId}
- Payment ID: ${payment.id}

Please complete your payment at your earliest convenience. If you have already made the payment, please disregard this message.

Thank you for choosing Safari Adventures Tanzania!

Best regards,
Safari Adventures Team`
    : "";

  // useEffect MUST come before any early returns
  useEffect(() => {
    if (open && !message && payment) {
      setMessage(defaultMessage);
    }
  }, [open, payment]);

  // NOW it's safe to return early
  if (!payment) return null;

  const handleSend = async () => {
    if (!sendEmail && !sendSms) {
      return;
    }

    setIsSending(true);

    const reminderData = {
      payment,
      channels: {
        email: sendEmail,
        sms: sendSms,
      },
      message,
      sentAt: new Date().toISOString(),
    };

    // Simulate sending delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (onSend) {
      onSend(reminderData);
    }

    setIsSending(false);
    onOpenChange(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "overdue":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "pending":
        return "bg-warning/10 text-warning border-warning/20";
      default:
        return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center'>
            <Send className='h-5 w-5 mr-2' />
            Send Payment Reminder
          </DialogTitle>
          <DialogDescription>
            Send a payment reminder to the customer
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Payment Summary */}
          <div className='p-4 border border-border rounded-lg bg-muted/50'>
            <div className='flex items-start justify-between mb-3'>
              <div>
                <p className='font-semibold'>{payment.customerName}</p>
                <p className='text-sm text-muted-foreground'>
                  Booking: {payment.bookingId}
                </p>
              </div>
              <Badge className={getStatusColor(payment.status)}>
                {payment.status.toUpperCase()}
              </Badge>
            </div>

            <div className='grid grid-cols-2 gap-4 text-sm'>
              <div>
                <p className='text-muted-foreground'>Amount Due</p>
                <p className='font-semibold text-lg'>
                  {formatCurrency(payment.amount, payment.currency)}
                </p>
              </div>
              <div>
                <p className='text-muted-foreground'>Due Date</p>
                <p
                  className={`font-semibold ${
                    isOverdue ? "text-destructive" : ""
                  }`}>
                  {formatDate(payment.dueDate)}
                </p>
              </div>
            </div>

            {isOverdue && (
              <div className='mt-3 flex items-center space-x-2 text-destructive text-sm'>
                <AlertCircle className='h-4 w-4' />
                <span>This payment is overdue</span>
              </div>
            )}
          </div>

          {/* Delivery Method */}
          <div className='space-y-3'>
            <Label>Send Via</Label>
            <div className='space-y-3'>
              <div className='flex items-center space-x-3 p-3 border border-border rounded-lg'>
                <Checkbox
                  id='email'
                  checked={sendEmail}
                  onCheckedChange={(checked) =>
                    setSendEmail(checked as boolean)
                  }
                />
                <div className='flex items-center flex-1'>
                  <Mail className='h-4 w-4 mr-2 text-muted-foreground' />
                  <div>
                    <Label htmlFor='email' className='cursor-pointer'>
                      Email
                    </Label>
                    <p className='text-xs text-muted-foreground'>
                      customer@email.com
                    </p>
                  </div>
                </div>
              </div>

              <div className='flex items-center space-x-3 p-3 border border-border rounded-lg'>
                <Checkbox
                  id='sms'
                  checked={sendSms}
                  onCheckedChange={(checked) => setSendSms(checked as boolean)}
                />
                <div className='flex items-center flex-1'>
                  <MessageSquare className='h-4 w-4 mr-2 text-muted-foreground' />
                  <div>
                    <Label htmlFor='sms' className='cursor-pointer'>
                      SMS
                    </Label>
                    <p className='text-xs text-muted-foreground'>+1-555-0123</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Message */}
          <div className='space-y-2'>
            <Label htmlFor='message'>Message</Label>
            <Textarea
              id='message'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={12}
              className='font-mono text-sm'
            />
            <p className='text-xs text-muted-foreground'>
              Customize the reminder message or use the default template
            </p>
          </div>

          {/* Quick Templates */}
          <div className='space-y-2'>
            <Label>Quick Templates</Label>
            <div className='flex flex-wrap gap-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setMessage(defaultMessage)}>
                Default Template
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() =>
                  setMessage(
                    `Hi ${
                      payment.customerName
                    }, friendly reminder about your payment of ${formatCurrency(
                      payment.amount,
                      payment.currency
                    )} due on ${formatDate(payment.dueDate)}. Thank you!`
                  )
                }>
                Short Reminder
              </Button>
              {isOverdue && (
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() =>
                    setMessage(
                      `Dear ${
                        payment.customerName
                      }, your payment of ${formatCurrency(
                        payment.amount,
                        payment.currency
                      )} is now overdue. Please contact us to arrange payment. Thank you.`
                    )
                  }>
                  Overdue Notice
                </Button>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSend}
            disabled={(!sendEmail && !sendSms) || !message || isSending}>
            <Send className='h-4 w-4 mr-2' />
            {isSending ? "Sending..." : "Send Reminder"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SendPaymentReminderDialog;
