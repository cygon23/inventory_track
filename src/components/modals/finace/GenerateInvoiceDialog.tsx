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
import {
  generateInvoicePDF,
  downloadInvoicePDF,
  printInvoicePDF,
} from "@/lib/invoicePdfGenerator";
import { createInvoiceFromPayment } from "@/services/invoiceService";
import { notifyRole } from "@/services/notificationService";
import { useToast } from "@/components/ui/use-toast";

interface Payment {
  id: string;
  booking_id: string;
  customer_name: string;
  amount: number;
  currency: string;
  status: string;
  due_date: string;
  paid_date?: string;
  method: string;
  type: string;
  description: string;
  bookings?: {
    booking_reference: string;
    customer_email: string;
    customer_phone: string;
  };
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
  const [savedInvoice, setSavedInvoice] = useState<any>(null);
  const { toast } = useToast();

  if (!payment) return null;

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  // MAIN FUNCTION: Save to DB first
  const handleGenerate = async (action: "download" | "email" | "print") => {
    setIsGenerating(true);
    try {
      //Save invoice to database (if not already saved)
      let invoiceToUse = savedInvoice;
      if (!invoiceToUse) {
        toast({
          title: "Saving Invoice",
          description: "Creating invoice record...",
        });

        invoiceToUse = await createInvoiceFromPayment(payment.id, {
          notes,
          invoice_number: invoiceNumber,
        });

        setSavedInvoice(invoiceToUse);
        toast({
          title: "Invoice Saved",
          description: `Invoice ${invoiceNumber} created successfully`,
        });
      }

      // Generate PDF 
      const invoiceDetails = {
        invoiceNumber: invoiceNumber,
        invoiceDate: new Date().toISOString(),
        dueDate: payment.due_date,
        customerName: payment.customer_name,
        customerEmail: payment.bookings?.customer_email || "N/A",
        customerAddress: undefined, // Optional - can be added if available
        bookingReference: payment.bookings?.booking_reference,
        items: [
          {
            description: payment.description,
            quantity: 1,
            priceUSD: payment.amount,
          },
        ],
        notes: notes,
      };

      const pdf = generateInvoicePDF(invoiceDetails);

      //Perform action
      if (action === "download") {
        downloadInvoicePDF(pdf, `invoice-${invoiceNumber}.pdf`);
        toast({
          title: "Success",
          description: "Invoice PDF downloaded successfully",
        });

        // Notify admin on invoice download
        try {
          await notifyRole({
            role: "admin",
            title: "Invoice downloaded",
            message: `Invoice ${invoiceNumber} downloaded`,
            type: "info",
            event: "invoice.downloaded",
            metadata: {
              invoice_id: invoiceToUse?.id,
              invoice_number: invoiceNumber,
            },
          });
        } catch (e) {
          console.warn("Failed to notify admin on invoice download", e);
        }
      } else if (action === "print") {
        printInvoicePDF(pdf);
        toast({
          title: "Success",
          description: "Invoice sent to printer",
        });

        // Notify admin on invoice print
        try {
          await notifyRole({
            role: "admin",
            title: "Invoice printed",
            message: `Invoice ${invoiceNumber} printed`,
            type: "info",
            event: "invoice.printed",
            metadata: {
              invoice_id: invoiceToUse?.id,
              invoice_number: invoiceNumber,
            },
          });
        } catch (e) {
          console.warn("Failed to notify admin on invoice print", e);
        }
      } else if (action === "email") {
        // TODO: Implement email sending
        toast({
          title: "Info",
          description: "Email functionality coming soon",
        });
      }

      // STEP 4: Callback to parent
      if (onGenerate) {
        onGenerate({
          invoice: invoiceToUse,
          invoiceNumber,
          payment,
          notes,
          action,
        });
      }

      // Close dialog after successful action
      setTimeout(() => {
        onOpenChange(false);
        // Reset for next use
        setSavedInvoice(null);
        setInvoiceNumber(`INV-${Date.now()}`);
      }, 1000);
    } catch (error: any) {
      console.error("Invoice generation failed:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate invoice",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-3xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center'>
            <FileText className='h-5 w-5 mr-2' />
            Generate Invoice
          </DialogTitle>
          <DialogDescription>
            Create a professional invoice for this payment
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
                disabled={!!savedInvoice}
              />
              {savedInvoice && (
                <p className='text-xs text-green-600'>
                  ✓ Invoice saved to database
                </p>
              )}
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
                <p className='font-semibold text-[#735741]'>
                  Lion Track Safari
                </p>
                <p className='text-sm text-muted-foreground'>
                  Arusha - Tanzania
                </p>
                <p className='text-sm text-muted-foreground'>
                  Tel: +255 782 247 376
                </p>
                <p className='text-sm text-muted-foreground'>
                  info@liontracksafari.com
                </p>
              </div>
            </div>

            <Separator />

            <div className='grid grid-cols-2 gap-8'>
              <div>
                <p className='text-sm font-semibold mb-2 text-[#735741]'>
                  Bill To:
                </p>
                <p className='font-medium'>{payment.customer_name}</p>
                <p className='text-sm text-muted-foreground'>
                  Email: {payment.bookings?.customer_email || "N/A"}
                </p>
                <p className='text-sm text-muted-foreground'>
                  Booking: {payment.bookings?.booking_reference || "N/A"}
                </p>
              </div>

              <div className='text-right'>
                <div className='space-y-1'>
                  <div className='flex justify-between'>
                    <span className='text-sm text-muted-foreground'>
                      Invoice Date:
                    </span>
                    <span className='text-sm font-medium'>
                      {new Date().toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-sm text-muted-foreground'>
                      Due Date:
                    </span>
                    <span className='text-sm font-medium'>
                      {new Date(payment.due_date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Line Items */}
            <div className='space-y-3'>
              <div className='grid grid-cols-12 gap-4 text-sm font-semibold bg-[#735741] text-white p-2 rounded'>
                <div className='col-span-1'>#</div>
                <div className='col-span-7'>Description</div>
                <div className='col-span-2 text-right'>Quantity</div>
                <div className='col-span-2 text-right'>Price (USD)</div>
              </div>

              <div className='grid grid-cols-12 gap-4 text-sm p-2'>
                <div className='col-span-1'>1</div>
                <div className='col-span-7'>
                  <p className='font-medium'>{payment.description}</p>
                </div>
                <div className='col-span-2 text-right'>1</div>
                <div className='col-span-2 text-right font-medium'>
                  {formatCurrency(payment.amount, payment.currency)}
                </div>
              </div>

              <Separator />

              {/* Totals */}
              <div className='space-y-2'>
                <div className='flex justify-between text-lg font-bold'>
                  <span>Sub-Total (USD):</span>
                  <span>
                    {formatCurrency(payment.amount, payment.currency)}
                  </span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Payment Information */}
            <div>
              <p className='text-sm font-semibold mb-2 text-[#735741]'>
                Payment Information:
              </p>
              <div className='text-xs space-y-1 text-muted-foreground'>
                <p>BANK NAME: NMB BANK PLC</p>
                <p>SWIFT CODE: NMIBTZTZ</p>
                <p>ACCOUNT NAME: LION TRACK SAFARI</p>
                <p className='mt-2'>
                  <span className='font-semibold text-[#735741]'>
                    Secure Online Payment:{" "}
                  </span>
                  <a
                    href='#'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-blue-600 hover:underline'>
                    https://store.pesapal.com/liontracksafaricompany
                  </a>
                </p>
              </div>
            </div>

            {notes && (
              <>
                <Separator />
                <div>
                  <p className='text-sm font-semibold mb-1 text-[#735741]'>
                    Notes:
                  </p>
                  <p className='text-sm text-muted-foreground'>{notes}</p>
                </div>
              </>
            )}

            <Separator />

            {/* Signature */}
            <div>
              <p className='text-sm font-semibold mb-2'>
                Director's Signature:
              </p>
              <div className='border-b-2 border-black w-60 mt-8'></div>
            </div>
          </div>
        </div>

        <DialogFooter className='flex-col sm:flex-row gap-2'>
          <Button
            variant='outline'
            onClick={() => handleGenerate("print")}
            disabled={isGenerating}>
            <Printer className='h-4 w-4 mr-2' />
            {isGenerating ? "Processing..." : "Print"}
          </Button>
          <Button
            variant='outline'
            onClick={() => handleGenerate("download")}
            disabled={isGenerating}>
            <Download className='h-4 w-4 mr-2' />
            {isGenerating ? "Processing..." : "Download PDF"}
          </Button>
          <Button
            onClick={() => handleGenerate("email")}
            disabled={isGenerating}>
            <Send className='h-4 w-4 mr-2' />
            {isGenerating ? "Processing..." : "Save & Email"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GenerateInvoiceDialog;
