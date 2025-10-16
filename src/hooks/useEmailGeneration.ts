import { useState } from "react";
import {
    calculateBalanceDueDate,
    generateEmailSubject,
    generateHTMLEmail,
    generatePlainTextEmail,
} from "@/lib/emailFormatter";

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

interface EmailData {
    subject: string;
    plainText: string;
    html: string;
    bookingDetails: any;
}

export const useEmailGeneration = () => {
    const [emailData, setEmailData] = useState<EmailData | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const generateConfirmationEmail = (
        booking: BookingData,
        newPaidAmount: number,
    ): EmailData => {
        setIsGenerating(true);

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
                numberOfGuests: booking.number_of_guests,
                specialRequests: booking.special_requests,
                totalAmount: booking.total_amount,
                paidAmount: newPaidAmount,
                remainingBalance: remainingBalance,
                bookingReference: booking.booking_reference,
                balanceDueDate: balanceDueDate,
            };

            const emailContent: EmailData = {
                subject: generateEmailSubject(booking.booking_reference),
                plainText: generatePlainTextEmail(bookingDetails),
                html: generateHTMLEmail(bookingDetails),
                bookingDetails: bookingDetails,
            };

            setEmailData(emailContent);
            setIsGenerating(false);

            return emailContent;
        } catch (error) {
            console.error("Error generating email:", error);
            setIsGenerating(false);
            throw error;
        }
    };

    const copyToClipboard = async (text: string): Promise<boolean> => {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (error) {
            console.error("Failed to copy to clipboard:", error);
            return false;
        }
    };

    const openEmailClient = (
        emailClient: "gmail" | "outlook",
        subject: string,
        body: string,
        to: string,
    ) => {
        const encodedSubject = encodeURIComponent(subject);
        const encodedBody = encodeURIComponent(body);
        const encodedTo = encodeURIComponent(to);

        let mailtoUrl = "";

        if (emailClient === "gmail") {
            // Gmail web interface
            mailtoUrl =
                `https://mail.google.com/mail/?view=cm&fs=1&to=${encodedTo}&su=${encodedSubject}&body=${encodedBody}`;
        } else if (emailClient === "outlook") {
            // Outlook web interface
            mailtoUrl =
                `https://outlook.office.com/mail/deeplink/compose?to=${encodedTo}&subject=${encodedSubject}&body=${encodedBody}`;
        }

        window.open(mailtoUrl, "_blank");
    };

    const resetEmailData = () => {
        setEmailData(null);
    };

    return {
        emailData,
        isGenerating,
        generateConfirmationEmail,
        copyToClipboard,
        openEmailClient,
        resetEmailData,
    };
};
