import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileText, Download, Sparkles, Mail, User } from "lucide-react";

interface PDFConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pdfData: {
    pdfDoc: any;
    pdfDataUrl: string;
    filename: string;
    bookingDetails: any;
  } | null;
  onDownload: () => void;
}

const PDFConfirmationDialog: React.FC<PDFConfirmationDialogProps> = ({
  open,
  onOpenChange,
  pdfData,
  onDownload,
}) => {
  const handleDownloadClick = () => {
    onDownload();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-5xl max-h-[90vh] overflow-hidden flex flex-col'>
        <DialogHeader>
          <DialogTitle className='text-2xl flex items-center gap-2'>
            <FileText className='h-6 w-6 text-primary' />
            Booking Confirmation PDF Ready
          </DialogTitle>
          <DialogDescription>
            Review and download the booking confirmation PDF to send to your
            customer
          </DialogDescription>
        </DialogHeader>

        {/* Success Alert */}
        <Alert className='bg-green-50 border-green-200'>
          <Sparkles className='h-4 w-4 text-green-600' />
          <AlertDescription className='text-green-800'>
            Payment processed successfully! Your confirmation PDF is ready to
            download.
          </AlertDescription>
        </Alert>

        {/* Customer Info */}
        <div className='space-y-3'>
          <div className='flex items-center justify-between bg-slate-50 p-3 rounded-lg border'>
            <div className='flex items-center gap-3 flex-1'>
              <User className='h-5 w-5 text-slate-600' />
              <div>
                <p className='text-xs text-gray-500'>Customer:</p>
                <p className='font-semibold text-sm'>
                  {pdfData.bookingDetails.customerName}
                </p>
              </div>
            </div>
            <div className='flex items-center gap-3'>
              <Mail className='h-5 w-5 text-slate-600' />
              <div>
                <p className='text-xs text-gray-500'>Email:</p>
                <p className='font-semibold text-sm'>
                  {pdfData.bookingDetails.customerEmail}
                </p>
              </div>
            </div>
          </div>

          <div className='flex items-center justify-between bg-blue-50 p-3 rounded-lg border border-blue-200'>
            <div className='flex items-center gap-3'>
              <FileText className='h-5 w-5 text-blue-600' />
              <div>
                <p className='text-xs text-blue-600 mb-1'>PDF Filename:</p>
                <p className='font-semibold text-sm text-blue-900'>
                  {pdfData.filename}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* PDF Preview Info*/}
        <div className='flex-1 min-h-0 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-gray-50 p-8'>
          <div className='flex flex-col items-center justify-center h-full space-y-4'>
            <FileText className='h-24 w-24 text-blue-500' />
            <div className='text-center'>
              <h3 className='text-lg font-semibold text-gray-800 mb-2'>
                PDF Generated Successfully!
              </h3>
              <p className='text-sm text-gray-600 mb-4'>
                Your booking confirmation PDF is ready to download.
              </p>
              <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 text-left'>
                <p className='text-xs font-semibold text-blue-900 mb-2'>
                  File Details:
                </p>
                <p className='text-xs text-gray-700'>
                  • Booking Reference: {pdfData.bookingDetails.bookingReference}
                </p>
                <p className='text-xs text-gray-700'>
                  • Customer: {pdfData.bookingDetails.customerName}
                </p>
                <p className='text-xs text-gray-700'>
                  • Amount Paid: ${pdfData.bookingDetails.paidAmount.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Download Instructions */}
        <Alert>
          <Download className='h-4 w-4' />
          <AlertDescription className='text-sm'>
            <strong>Next Steps:</strong> Click the download button below to save
            the PDF.
          </AlertDescription>
        </Alert>

        {/* Download Button*/}
        <div className='flex gap-3'>
          <Button
            variant='outline'
            onClick={() => {
              onOpenChange(false);
            }}
            className='flex-1'>
            Close
          </Button>
          <Button
            onClick={handleDownloadClick}
            className='flex-1 bg-green-600 hover:bg-green-700 text-white gap-2'
            size='lg'>
            <Download className='h-5 w-5' />
            Download PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PDFConfirmationDialog;
