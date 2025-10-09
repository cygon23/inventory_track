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
import { Separator } from "@/components/ui/separator";
import { FileText, Download, Send, Printer } from "lucide-react";

interface Payment {
  id: string;
  bookingId: string;
  customerName: string;
  amount: number;
  currency: string;
  status: string;
  dueDate: string;
  paidDate?: string;
  method: string;
  type: string;
  description: string;
}

interface GenerateInvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment: Payment | null;
  onGenerate?: (invoiceData: any) => void;
}

const GenerateInvoiceDialog: React.FC<GenerateInvoiceDialogProps> = ({
  open,
  onOpenChange,
  payment,
  onGenerate,
}) => {
  const [invoiceNumber, setInvoiceNumber] = useState(`INV-${Date.now()}`);
  const [notes, setNotes] = useState("Thank you for your business!");
  const [isGenerating, setIsGenerating] = useState(false);

  if (!payment) return null;

  const handleGenerate = async (action: "download" | "email" | "print") => {
    setIsGenerating(true);

    const invoiceData = {
      invoiceNumber,
      payment,
      notes,
      generatedDate: new Date().toISOString(),
      action,
    };

    // Simulate generation delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (onGenerate) {
      onGenerate(invoiceData);
    }

    setIsGenerating(false);
    onOpenChange(false);
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const taxAmount = payment.amount * 0.18; // 18% tax
  const totalAmount = payment.amount + taxAmount;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-3xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center'>
            <FileText className='h-5 w-5 mr-2' />
            Generate Invoice
          </DialogTitle>
          <DialogDescription>
            Create and send an invoice for this payment
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Invoice Settings */}
          <div className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='invoiceNumber'>Invoice Number</Label>
              <Input
                id='invoiceNumber'
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                placeholder='INV-001'
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='notes'>Invoice Notes</Label>
              <Textarea
                id='notes'
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder='Add any notes or payment terms...'
                rows={3}
              />
            </div>
          </div>

          <Separator />

          {/* Invoice Preview */}
          <div className='border border-border rounded-lg p-6 bg-muted/50 space-y-6'>
            <div className='flex justify-between items-start'>
              <div>
                <h3 className='text-2xl font-bold'>INVOICE</h3>
                <p className='text-sm text-muted-foreground'>
                  #{invoiceNumber}
                </p>
              </div>
              <div className='text-right'>
                <p className='font-semibold'>Safari Adventures Tanzania</p>
                <p className='text-sm text-muted-foreground'>
                  Arusha, Tanzania
                </p>
                <p className='text-sm text-muted-foreground'>
                  info@safariadvtz.com
                </p>
              </div>
            </div>

            <Separator />

            <div className='grid grid-cols-2 gap-8'>
              <div>
                <p className='text-sm font-semibold mb-2'>Bill To:</p>
                <p className='font-medium'>{payment.customerName}</p>
                <p className='text-sm text-muted-foreground'>
                  Booking: {payment.bookingId}
                </p>
                <p className='text-sm text-muted-foreground'>
                  Payment ID: {payment.id}
                </p>
              </div>
              <div className='text-right'>
                <div className='space-y-1'>
                  <div className='flex justify-between'>
                    <span className='text-sm text-muted-foreground'>
                      Issue Date:
                    </span>
                    <span className='text-sm font-medium'>
                      {new Date().toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-sm text-muted-foreground'>
                      Due Date:
                    </span>
                    <span className='text-sm font-medium'>
                      {new Date(payment.dueDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-sm text-muted-foreground'>
                      Payment Method:
                    </span>
                    <span className='text-sm font-medium'>
                      {payment.method}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Line Items */}
            <div className='space-y-3'>
              <div className='grid grid-cols-12 gap-4 text-sm font-semibold'>
                <div className='col-span-6'>Description</div>
                <div className='col-span-2 text-right'>Type</div>
                <div className='col-span-2 text-right'>Qty</div>
                <div className='col-span-2 text-right'>Amount</div>
              </div>

              <Separator />

              <div className='grid grid-cols-12 gap-4 text-sm'>
                <div className='col-span-6'>
                  <p className='font-medium'>{payment.description}</p>
                  <p className='text-xs text-muted-foreground'>
                    Payment Type: {payment.type.replace("_", " ")}
                  </p>
                </div>
                <div className='col-span-2 text-right capitalize'>
                  {payment.type.replace("_", " ")}
                </div>
                <div className='col-span-2 text-right'>1</div>
                <div className='col-span-2 text-right font-medium'>
                  {formatCurrency(payment.amount, payment.currency)}
                </div>
              </div>

              <Separator />

              {/* Totals */}
              <div className='space-y-2'>
                <div className='flex justify-between text-sm'>
                  <span>Subtotal</span>
                  <span>
                    {formatCurrency(payment.amount, payment.currency)}
                  </span>
                </div>
                <div className='flex justify-between text-sm'>
                  <span>Tax (18%)</span>
                  <span>{formatCurrency(taxAmount, payment.currency)}</span>
                </div>
                <Separator />
                <div className='flex justify-between text-lg font-bold'>
                  <span>Total</span>
                  <span>{formatCurrency(totalAmount, payment.currency)}</span>
                </div>
              </div>
            </div>

            {notes && (
              <>
                <Separator />
                <div>
                  <p className='text-sm font-semibold mb-1'>Notes:</p>
                  <p className='text-sm text-muted-foreground'>{notes}</p>
                </div>
              </>
            )}
          </div>
        </div>

        <DialogFooter className='flex-col sm:flex-row gap-2'>
          <Button
            variant='outline'
            onClick={() => handleGenerate("print")}
            disabled={isGenerating}>
            <Printer className='h-4 w-4 mr-2' />
            Print
          </Button>
          <Button
            variant='outline'
            onClick={() => handleGenerate("download")}
            disabled={isGenerating}>
            <Download className='h-4 w-4 mr-2' />
            Download PDF
          </Button>
          <Button
            onClick={() => handleGenerate("email")}
            disabled={isGenerating}>
            <Send className='h-4 w-4 mr-2' />
            {isGenerating ? "Generating..." : "Email Invoice"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GenerateInvoiceDialog;
