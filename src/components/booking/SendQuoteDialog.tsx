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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Send,
  DollarSign,
  Calendar,
  Users,
  FileText,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SendQuoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quote: any;
  onSuccess?: () => void;
}

const SendQuoteDialog: React.FC<SendQuoteDialogProps> = ({
  open,
  onOpenChange,
  quote,
  onSuccess,
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quoteAmount, setQuoteAmount] = useState("");
  const [validityDays, setValidityDays] = useState("14");
  const [packageDetails, setPackageDetails] = useState("");
  const [inclusions, setInclusions] = useState("");
  const [exclusions, setExclusions] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast({
      title: "Quote Sent Successfully",
      description: `Quote for ${quote?.customer} has been sent via email.`,
    });

    setIsSubmitting(false);
    onOpenChange(false);
    onSuccess?.();
  };

  if (!quote) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-3xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='text-2xl flex items-center gap-2'>
            <Send className='h-6 w-6 text-primary' />
            Send Quote
          </DialogTitle>
          <DialogDescription>
            Create and send quote for {quote.customer}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <ScrollArea className='h-[60vh] pr-4 sm:h-[65vh]'>
            <div className='space-y-6'>
              {/* Customer & Inquiry Info */}
              <Card className='border-primary/20'>
                <CardContent className='pt-6'>
                  <div className='space-y-3'>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm text-muted-foreground'>
                        Customer
                      </span>
                      <span className='font-semibold'>{quote.customer}</span>
                    </div>
                    <Separator />
                    <div className='flex items-center justify-between'>
                      <span className='text-sm text-muted-foreground'>
                        Inquiry
                      </span>
                      <span className='font-medium'>{quote.inquiry}</span>
                    </div>
                    <Separator />
                    <div className='flex items-center justify-between'>
                      <span className='text-sm text-muted-foreground'>
                        Budget Range
                      </span>
                      <Badge variant='secondary'>{quote.budget}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quote Amount */}
              <div className='space-y-2'>
                <Label
                  htmlFor='quote_amount'
                  className='text-base font-semibold'>
                  Quote Amount <span className='text-destructive'>*</span>
                </Label>
                <div className='relative'>
                  <DollarSign className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                  <Input
                    id='quote_amount'
                    type='number'
                    min='0'
                    step='0.01'
                    value={quoteAmount}
                    onChange={(e) => setQuoteAmount(e.target.value)}
                    placeholder='5000.00'
                    className='pl-10 text-lg font-semibold'
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <p className='text-xs text-muted-foreground'>
                  Customer's budget: {quote.budget}
                </p>
              </div>

              {/* Validity Period */}
              <div className='space-y-2'>
                <Label htmlFor='validity' className='text-base font-semibold'>
                  Quote Validity (Days){" "}
                  <span className='text-destructive'>*</span>
                </Label>
                <div className='relative'>
                  <Calendar className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                  <Input
                    id='validity'
                    type='number'
                    min='1'
                    value={validityDays}
                    onChange={(e) => setValidityDays(e.target.value)}
                    className='pl-10'
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Package Details */}
              <div className='space-y-2'>
                <Label
                  htmlFor='package_details'
                  className='text-base font-semibold'>
                  Package Details <span className='text-destructive'>*</span>
                </Label>
                <Textarea
                  id='package_details'
                  value={packageDetails}
                  onChange={(e) => setPackageDetails(e.target.value)}
                  placeholder='Day 1: Arrival and transfer to hotel&#10;Day 2: Full day Serengeti game drive&#10;Day 3: Ngorongoro Crater tour...'
                  rows={5}
                  required
                  disabled={isSubmitting}
                />
              </div>

              {/* Inclusions */}
              <div className='space-y-2'>
                <Label htmlFor='inclusions' className='text-base font-semibold'>
                  What's Included <span className='text-destructive'>*</span>
                </Label>
                <Textarea
                  id='inclusions'
                  value={inclusions}
                  onChange={(e) => setInclusions(e.target.value)}
                  placeholder='• All park fees and permits&#10;• Professional safari guide&#10;• 4x4 safari vehicle&#10;• Accommodation (lodges/camps)&#10;• All meals during safari...'
                  rows={6}
                  required
                  disabled={isSubmitting}
                />
              </div>

              {/* Exclusions */}
              <div className='space-y-2'>
                <Label htmlFor='exclusions' className='text-base font-semibold'>
                  What's Not Included
                </Label>
                <Textarea
                  id='exclusions'
                  value={exclusions}
                  onChange={(e) => setExclusions(e.target.value)}
                  placeholder='• International flights&#10;• Visa fees&#10;• Travel insurance&#10;• Personal expenses&#10;• Tips and gratuities...'
                  rows={5}
                  disabled={isSubmitting}
                />
              </div>

              {/* Additional Notes */}
              <div className='space-y-2'>
                <Label htmlFor='notes' className='text-base font-semibold'>
                  Additional Notes
                </Label>
                <Textarea
                  id='notes'
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder='Any special terms, conditions, or personalized message...'
                  rows={4}
                  disabled={isSubmitting}
                />
              </div>

              {/* Quote Summary */}
              <Card className='border-green-200 bg-green-50/50'>
                <CardContent className='pt-6'>
                  <h4 className='font-semibold mb-3 flex items-center gap-2'>
                    <FileText className='h-5 w-5 text-green-600' />
                    Quote Summary
                  </h4>
                  <div className='space-y-2 text-sm'>
                    <div className='flex justify-between'>
                      <span className='text-muted-foreground'>
                        Quote Amount
                      </span>
                      <span className='font-bold text-lg'>
                        ${quoteAmount || "0.00"}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-muted-foreground'>Valid Until</span>
                      <span className='font-medium'>
                        {new Date(
                          Date.now() +
                            parseInt(validityDays || "14") * 24 * 60 * 60 * 1000
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <Separator />
                    <p className='text-xs text-muted-foreground pt-2'>
                      Quote will be sent to{" "}
                      {quote.customer.toLowerCase().replace(" ", ".")}@email.com
                    </p>
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
                isSubmitting || !quoteAmount || !packageDetails || !inclusions
              }>
              {isSubmitting ? (
                <>
                  <Loader2 className='h-4 w-4 animate-spin' />
                  Sending...
                </>
              ) : (
                <>
                  <Send className='h-4 w-4' />
                  Send Quote
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SendQuoteDialog;
