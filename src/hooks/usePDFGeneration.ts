import { useState } from "react";
import jsPDF from "jspdf";
import {
    calculateBalanceDueDate,
    downloadPDF,
    generateBookingConfirmationPDF,
    generatePDFBlob,
    generatePDFDataUrl,
} from "@/lib/pdfGenerator";

interface BookingData {
    id: string;
    customer_name: string;
    customer_email: string;
    start_date: string;
    end_date: string;
    safari_description?: string;
    number_of_guests: number;
    special_requests?: string;
    total_amount: number;
    paid_amount: number;
    booking_reference: string;
}

interface PDFData {
    pdfDoc: jsPDF;
    pdfDataUrl: string;
    filename: string;
    bookingDetails: any;
}

export const usePDFGeneration = () => {
    const [pdfData, setPdfData] = useState<PDFData | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const generateConfirmationPDF = async (
        booking: BookingData,
        newPaidAmount: number,
    ): Promise<PDFData | null> => {
        setIsGenerating(true);
        setError(null);

        try {
            const remainingBalance = booking.total_amount - newPaidAmount;
            const balanceDueDate = calculateBalanceDueDate(booking.start_date);

            const bookingDetails = {
                customerName: booking.customer_name,
                customerEmail: booking.customer_email,
                startDate: booking.start_date,
                endDate: booking.end_date,
                itinerary: booking.safari_description ||
                    "Tarangire, Serengeti & Ngorongoro Safari",
                numberOfGuests: booking.number_of_guests || 1,
                specialRequests: booking.special_requests,
                totalAmount: booking.total_amount,
                paidAmount: newPaidAmount,
                remainingBalance: remainingBalance,
                bookingReference: booking.booking_reference,
                balanceDueDate: balanceDueDate,
            };

            // Generate the PDF document
            const pdfDoc = await generateBookingConfirmationPDF(bookingDetails);

            console.log("PDF Doc generated:", pdfDoc);
            console.log("PDF Doc type:", typeof pdfDoc);

            // Generate data URL for preview
            const pdfDataUrl = generatePDFDataUrl(pdfDoc);

            // Generate filename
            const filename =
                `Booking_Confirmation_${booking.booking_reference}_${
                    booking.customer_name.replace(/\s+/g, "_")
                }.pdf`;

            console.log("PDF Filename:", filename);

            const pdfContent: PDFData = {
                pdfDoc,
                pdfDataUrl,
                filename,
                bookingDetails,
            };

            setPdfData(pdfContent);
            setIsGenerating(false);
            return pdfContent;
        } catch (err) {
            console.error("Error generating PDF:", err);
            setError("Failed to generate PDF. Please try again.");
            setIsGenerating(false);
            return null;
        }
    };

    const downloadConfirmationPDF = () => {
        if (!pdfData) {
            console.error("No PDF data available");
            setError("No PDF available to download");
            return;
        }

        try {
            console.log("Downloading PDF:", pdfData.filename);
            // Use jsPDF's save method directly
            pdfData.pdfDoc.save(pdfData.filename);
            console.log("PDF download triggered successfully");
        } catch (err) {
            console.error("Error downloading PDF:", err);
            setError("Failed to download PDF. Please try again.");
        }
    };

    const getPDFBlob = (): Blob | null => {
        if (!pdfData) return null;
        return generatePDFBlob(pdfData.pdfDoc);
    };

    const resetPDFData = () => {
        setPdfData(null);
        setError(null);
    };

    return {
        pdfData,
        isGenerating,
        error,
        generateConfirmationPDF,
        downloadConfirmationPDF,
        getPDFBlob,
        resetPDFData,
    };
};
