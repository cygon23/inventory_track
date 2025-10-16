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
import jsPDF from "jspdf";
import { createInvoiceFromPayment } from "@/services/invoiceService";
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

  // Generate PDF from invoice data
  const generatePDF = (invoiceNum: string) => {
    const pdf = new jsPDF();

    // Company Header
    pdf.setFontSize(20);
    pdf.setFont("helvetica", "bold");
    pdf.text("INVOICE", 105, 20, { align: "center" });

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.text("Safari Adventures Tanzania", 105, 28, { align: "center" });
    pdf.text("Arusha, Tanzania", 105, 33, { align: "center" });
    pdf.text("info@liontracksafari.com", 105, 38, { align: "center" });

    // Invoice Details
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text(`Invoice #: ${invoiceNum}`, 20, 55);

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.text(`Issue Date: ${new Date().toLocaleDateString()}`, 20, 62);
    pdf.text(
      `Due Date: ${new Date(payment.due_date).toLocaleDateString()}`,
      20,
      68
    );

    // Bill To
    pdf.setFont("helvetica", "bold");
    pdf.text("Bill To:", 20, 82);
    pdf.setFont("helvetica", "normal");
    pdf.text(payment.customer_name, 20, 88);
    pdf.text(
      `Booking: ${payment.bookings?.booking_reference || "N/A"}`,
      20,
      94
    );
    pdf.text(`Email: ${payment.bookings?.customer_email || "N/A"}`, 20, 100);

    // Table Header
    pdf.setFillColor(240, 240, 240);
    pdf.rect(20, 115, 170, 8, "F");
    pdf.setFont("helvetica", "bold");
    pdf.text("Description", 22, 120);
    pdf.text("Type", 110, 120);
    pdf.text("Qty", 140, 120);
    pdf.text("Amount", 160, 120);

    // Table Row
    pdf.setFont("helvetica", "normal");
    pdf.text(payment.description, 22, 130);
    pdf.text(payment.type.replace("_", " "), 110, 130);
    pdf.text("1", 140, 130);
    pdf.text(formatCurrency(payment.amount, payment.currency), 160, 130);

    // Totals
    const taxAmount = payment.amount * 0.18;
    const totalAmount = payment.amount + taxAmount;

    pdf.line(20, 138, 190, 138);
    pdf.text("Subtotal:", 130, 145);
    pdf.text(formatCurrency(payment.amount, payment.currency), 165, 145);

    pdf.text("Tax (18%):", 130, 152);
    pdf.text(formatCurrency(taxAmount, payment.currency), 165, 152);

    pdf.setFont("helvetica", "bold");
    pdf.line(130, 156, 190, 156);
    pdf.text("Total:", 130, 163);
    pdf.text(formatCurrency(totalAmount, payment.currency), 165, 163);

    // Notes
    if (notes) {
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      pdf.text("Notes:", 20, 180);
      const splitNotes = pdf.splitTextToSize(notes, 170);
      pdf.text(splitNotes, 20, 186);
    }

    return pdf;
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  // MAIN FUNCTION: Save to DB first, then generate PDF
  const handleGenerate = async (action: "download" | "email" | "print") => {
    setIsGenerating(true);

    try {
      // STEP 1: Save invoice to database (if not already saved)
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

      // STEP 2: Generate PDF
      const pdf = generatePDF(invoiceNumber);

      // STEP 3: Perform action
      if (action === "download") {
        pdf.save(`invoice-${invoiceNumber}.pdf`);
        toast({
          title: "Success",
          description: "Invoice PDF downloaded successfully",
        });
      } else if (action === "print") {
        pdf.autoPrint();
        window.open(pdf.output("bloburl"), "_blank");
        toast({
          title: "Success",
          description: "Invoice sent to printer",
        });
      } else if (action === "email") {
        // TODO: Implement email sending
        // For now, just update status to "sent"
        // await updateInvoiceStatus(invoiceToUse.id, "sent");
        // toast({
        //   title: "Success",
        //   description: "Invoice marked as sent (email integration pending)",
        // });
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

  const taxAmount = payment.amount * 0.18;
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
                <p className='font-medium'>{payment.customer_name}</p>
                <p className='text-sm text-muted-foreground'>
                  Booking: {payment.bookings?.booking_reference || "N/A"}
                </p>
                <p className='text-sm text-muted-foreground'>
                  Email: {payment.bookings?.customer_email || "N/A"}
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
                      {new Date(payment.due_date).toLocaleDateString("en-US", {
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