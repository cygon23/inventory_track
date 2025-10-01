import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  MessageSquare,
  Send,
  Clock,
} from "lucide-react";

interface ViewQuoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quote: any;
  onSendQuote?: (quote: any) => void;
}

const ViewQuoteDialog: React.FC<ViewQuoteDialogProps> = ({
  open,
  onOpenChange,
  quote,
  onSendQuote,
}) => {
  if (!quote) return null;

  const formatCurrency = (amount: string) => {
    const numAmount = parseFloat(amount.replace(/[^0-9.-]+/g, ""));
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(numAmount);
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      urgent: "bg-destructive/10 text-destructive border-destructive/20",
      high: "bg-warning/10 text-warning border-warning/20",
      medium: "bg-primary/10 text-primary border-primary/20",
      low: "bg-muted/10 text-muted-foreground border-muted/20",
    };
    return (
      colors[priority as keyof typeof colors] ||
      "bg-muted/10 text-muted-foreground border-muted/20"
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='text-2xl flex items-center gap-2'>
            <MessageSquare className='h-6 w-6 text-primary' />
            Quote Details
          </DialogTitle>
          <DialogDescription>
            Review customer inquiry and prepare quote
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Quote Header */}
          <Card className='border-primary/20'>
            <CardContent className='pt-6'>
              <div className='flex items-start justify-between mb-4'>
                <div>
                  <h3 className='text-lg font-semibold'>{quote.inquiry}</h3>
                  <p className='text-sm text-muted-foreground'>
                    Quote ID: {quote.id}
                  </p>
                </div>
                <Badge className={getPriorityColor(quote.priority)}>
                  {quote.priority}
                </Badge>
              </div>

              <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                <Clock className='h-4 w-4' />
                Requested {quote.requested}
              </div>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <div className='space-y-4'>
            <h4 className='font-semibold flex items-center gap-2'>
              <User className='h-5 w-5 text-primary' />
              Customer Information
            </h4>

            <Card>
              <CardContent className='pt-6'>
                <div className='space-y-4'>
                  <div className='flex items-center gap-3'>
                    <User className='h-4 w-4 text-muted-foreground' />
                    <div>
                      <p className='text-sm text-muted-foreground'>Name</p>
                      <p className='font-medium'>{quote.customer}</p>
                    </div>
                  </div>

                  <Separator />

                  <div className='flex items-center gap-3'>
                    <Mail className='h-4 w-4 text-muted-foreground' />
                    <div>
                      <p className='text-sm text-muted-foreground'>Email</p>
                      <p className='font-medium'>
                        {quote.customer.toLowerCase().replace(" ", ".")}
                        @email.com
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className='flex items-center gap-3'>
                    <Phone className='h-4 w-4 text-muted-foreground' />
                    <div>
                      <p className='text-sm text-muted-foreground'>Phone</p>
                      <p className='font-medium'>+1 (555) 123-4567</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Inquiry Details */}
          <div className='space-y-4'>
            <h4 className='font-semibold flex items-center gap-2'>
              <MessageSquare className='h-5 w-5 text-primary' />
              Inquiry Details
            </h4>

            <Card>
              <CardContent className='pt-6'>
                <div className='space-y-4'>
                  <div>
                    <p className='text-sm text-muted-foreground mb-1'>
                      Package Interest
                    </p>
                    <p className='font-medium'>{quote.inquiry}</p>
                  </div>

                  <Separator />

                  <div className='flex items-center gap-3'>
                    <DollarSign className='h-4 w-4 text-muted-foreground' />
                    <div>
                      <p className='text-sm text-muted-foreground'>
                        Budget Range
                      </p>
                      <p className='font-medium text-lg'>{quote.budget}</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <p className='text-sm text-muted-foreground mb-2'>
                      Customer Message
                    </p>
                    <p className='text-sm bg-muted/50 p-3 rounded-md'>
                      "We're planning a {quote.inquiry.toLowerCase()} and would
                      love to get a detailed quote. We're flexible with dates
                      but prefer traveling in the dry season. Looking for a
                      mid-range to luxury experience with good wildlife viewing
                      opportunities."
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className='flex gap-3'>
            <Button
              variant='outline'
              className='flex-1'
              onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button
              className='flex-1 gap-2'
              onClick={() => {
                onSendQuote?.(quote);
                onOpenChange(false);
              }}>
              <Send className='h-4 w-4' />
              Send Quote
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewQuoteDialog;
