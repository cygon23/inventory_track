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
import {
  Calendar,
  CreditCard,
  FileText,
  User,
  DollarSign,
  CheckCircle,
} from "lucide-react";

interface Payment {
  id: string;
  bookingId: string;
  customerName: string;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed" | "overdue";
  dueDate: string;
  paidDate?: string;
  method: string;
  type: "deposit" | "balance" | "full_payment";
  description: string;
}

interface ViewPaymentDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment: Payment | null;
}

const ViewPaymentDetailsDialog: React.FC<ViewPaymentDetailsDialogProps> = ({
  open,
  onOpenChange,
  payment,
}) => {
  if (!payment) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-success/10 text-success border-success/20";
      case "pending":
        return "bg-warning/10 text-warning border-warning/20";
      case "failed":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "overdue":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Payment Details</DialogTitle>
          <DialogDescription>
            Complete information about this payment transaction
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Payment Status */}
          <div className='flex items-center justify-between p-4 border border-border rounded-lg bg-muted/50'>
            <div>
              <p className='text-sm text-muted-foreground mb-1'>
                Payment Status
              </p>
              <Badge className={getStatusColor(payment.status)}>
                {payment.status.toUpperCase()}
              </Badge>
            </div>
            <div className='text-right'>
              <p className='text-sm text-muted-foreground mb-1'>Amount</p>
              <p className='text-2xl font-bold'>
                {formatCurrency(payment.amount, payment.currency)}
              </p>
            </div>
          </div>

          {/* Customer Information */}
          <div className='space-y-3'>
            <h3 className='font-semibold flex items-center'>
              <User className='h-4 w-4 mr-2' />
              Customer Information
            </h3>
            <div className='grid grid-cols-2 gap-4 p-4 border border-border rounded-lg'>
              <div>
                <p className='text-sm text-muted-foreground'>Customer Name</p>
                <p className='font-medium'>{payment.customerName}</p>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Booking ID</p>
                <p className='font-medium'>{payment.bookingId}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Payment Information */}
          <div className='space-y-3'>
            <h3 className='font-semibold flex items-center'>
              <DollarSign className='h-4 w-4 mr-2' />
              Payment Information
            </h3>
            <div className='grid grid-cols-2 gap-4 p-4 border border-border rounded-lg'>
              <div>
                <p className='text-sm text-muted-foreground'>Payment ID</p>
                <p className='font-medium'>{payment.id}</p>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Payment Type</p>
                <Badge variant='outline' className='capitalize'>
                  {payment.type.replace("_", " ")}
                </Badge>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Payment Method</p>
                <p className='font-medium flex items-center'>
                  <CreditCard className='h-3 w-3 mr-1' />
                  {payment.method}
                </p>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Currency</p>
                <p className='font-medium'>{payment.currency}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Date Information */}
          <div className='space-y-3'>
            <h3 className='font-semibold flex items-center'>
              <Calendar className='h-4 w-4 mr-2' />
              Date Information
            </h3>
            <div className='grid grid-cols-2 gap-4 p-4 border border-border rounded-lg'>
              <div>
                <p className='text-sm text-muted-foreground'>Due Date</p>
                <p className='font-medium'>{formatDate(payment.dueDate)}</p>
              </div>
              {payment.paidDate && (
                <div>
                  <p className='text-sm text-muted-foreground'>Paid Date</p>
                  <p className='font-medium flex items-center text-success'>
                    <CheckCircle className='h-3 w-3 mr-1' />
                    {formatDate(payment.paidDate)}
                  </p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Description */}
          <div className='space-y-3'>
            <h3 className='font-semibold flex items-center'>
              <FileText className='h-4 w-4 mr-2' />
              Description
            </h3>
            <div className='p-4 border border-border rounded-lg bg-muted/50'>
              <p className='text-sm'>{payment.description}</p>
            </div>
          </div>

          {/* Transaction Timeline */}
          {payment.status === "completed" && (
            <div className='space-y-3'>
              <h3 className='font-semibold'>Transaction Timeline</h3>
              <div className='space-y-2'>
                <div className='flex items-start space-x-3 p-3 border border-border rounded-lg'>
                  <div className='w-2 h-2 rounded-full bg-success mt-2' />
                  <div className='flex-1'>
                    <p className='font-medium text-sm'>Payment Completed</p>
                    <p className='text-xs text-muted-foreground'>
                      {payment.paidDate && formatDate(payment.paidDate)}
                    </p>
                  </div>
                </div>
                <div className='flex items-start space-x-3 p-3 border border-border rounded-lg'>
                  <div className='w-2 h-2 rounded-full bg-primary mt-2' />
                  <div className='flex-1'>
                    <p className='font-medium text-sm'>Payment Initiated</p>
                    <p className='text-xs text-muted-foreground'>
                      Payment request sent to customer
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewPaymentDetailsDialog;
