import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface BookingDetails {
    customerName: string;
    customerEmail: string;
    startDate: string;
    endDate: string;
    itinerary: string;
    numberOfGuests: number;
    specialRequests?: string;
    totalAmount: number;
    paidAmount: number;
    remainingBalance: number;
    bookingReference: string;
    balanceDueDate: string;
}

export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(amount || 0);
};

export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

export const calculateBalanceDueDate = (startDate: string): string => {
    const start = new Date(startDate);
    const dueDate = new Date(start);
    dueDate.setDate(dueDate.getDate() - 45);
    return dueDate.toISOString().split("T")[0];
};

export const generateBookingConfirmationPDF = async (
    details: BookingDetails,
): Promise<jsPDF> => {
    const doc = new jsPDF();

    // Colors - Brand colors
    const primaryBrown = [115, 87, 65]; // #735741
    const accentGold = [0, 0, 0]; // #000000
    const textDark = [51, 51, 51];
    const textGray = [85, 85, 85];
    const lightBg = [250, 247, 240];

    let yPos = 15;

    // ============ HEADER SECTION WITH CONTACT INFO ============
    doc.setFillColor(...primaryBrown);
    doc.rect(0, 0, 210, 55, "F");

    // Company Name
    doc.setTextColor(...accentGold);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("Liontrack Safari Company", 105, 18, { align: "center" });

    // Tagline
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(248, 248, 248);
    doc.text("Follow the Track, Discover the Wilderness", 105, 26, {
        align: "center",
    });

    // Contact Information in Header
    doc.setFontSize(8);
    doc.setTextColor(248, 248, 248);
    doc.text(
        "WhatsApp: +255 782 247 376  |  Office: +255 682 801 818",
        105,
        35,
        { align: "center" },
    );
    doc.text(
        "Email: info@liontracksafari.com  |  Website: https://liontracksafari.com/",
        105,
        40,
        { align: "center" },
    );

    // Separator line
    doc.setDrawColor(...accentGold);
    doc.setLineWidth(0.5);
    doc.line(15, 47, 195, 47);

    yPos = 60;

    // ============ TITLE ============
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...primaryBrown);
    doc.text("Booking Confirmation", 15, yPos);
    yPos += 12;

    // ============ GREETING ============
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...textDark);
    doc.text(`Dear ${details.customerName},`, 15, yPos);
    yPos += 8;

    doc.text("Warm greetings from Liontrack Safari Company!", 15, yPos);
    yPos += 8;

    const greeting = doc.splitTextToSize(
        "We are delighted to confirm your booking for your upcoming safari adventure with us. Thank you for choosing Liontrack Safari Company to craft this unforgettable journey through Tanzania's breathtaking wilderness.",
        180,
    );
    doc.text(greeting, 15, yPos);
    yPos += greeting.length * 5.5 + 5;

    // Conditional payment message based on payment status
    let paymentMessage = "";
    if (details.remainingBalance > 0) {
        // 50% payment - show balance due message
        paymentMessage =
            "We are pleased to confirm that we have received your initial payment of 50% of the total safari cost. To secure all arrangements, please ensure that the remaining balance is paid at least 45 days before your arrival date.";
    } else {
        // 100% payment - show full payment confirmation
        paymentMessage =
            "We are delighted to confirm that we have received your full payment. Thank you for completing your booking! It's time to get ready for your incredible journey. We will send you detailed travel preparation guidance, including a packing list and important information about what to expect during your safari adventure.";
    }

    const paymentNote = doc.splitTextToSize(paymentMessage, 180);
    doc.text(paymentNote, 15, yPos);
    yPos += paymentNote.length * 5.5 + 10;

    // ============ BOOKING DETAILS SECTION ============
    doc.setFillColor(...primaryBrown);
    doc.rect(15, yPos, 180, 8, "F");
    doc.setTextColor(248, 248, 248);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Booking Details:", 18, yPos + 5.5);
    yPos += 11;

    // Booking Details Content
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...textGray);

    const lineHeight = 6;
    const labelX = 20;
    const valueX = 70;

    // Guest Name
    doc.text("- Guest Name:", labelX, yPos);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...textDark);
    doc.text(details.customerName, valueX, yPos);
    yPos += lineHeight;

    // Travel Dates
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...textGray);
    doc.text("- Travel Dates:", labelX, yPos);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...textDark);
    doc.text(
        `${formatDate(details.startDate)} to ${formatDate(details.endDate)}`,
        valueX,
        yPos,
    );
    yPos += lineHeight;

    // Itinerary
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...textGray);
    doc.text("- Itinerary:", labelX, yPos);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...textDark);
    const itineraryText = doc.splitTextToSize(details.itinerary, 120);
    doc.text(itineraryText, valueX, yPos);
    yPos += itineraryText.length * lineHeight;

    // Number of Guests
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...textGray);
    doc.text("- Number of Guests:", labelX, yPos);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...textDark);
    doc.text((details.numberOfGuests || 1).toString(), valueX, yPos);
    yPos += lineHeight;

    // Special Requests (if any)
    if (details.specialRequests) {
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...textGray);
        doc.text("- Special Requests:", labelX, yPos);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...textDark);
        const requestsText = doc.splitTextToSize(details.specialRequests, 120);
        doc.text(requestsText, valueX, yPos);
        yPos += requestsText.length * lineHeight;
    }

    yPos += 8;

    // ============ PAYMENT SUMMARY SECTION ============
    doc.setFillColor(...primaryBrown);
    doc.rect(15, yPos, 180, 8, "F");
    doc.setTextColor(248, 248, 248);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Payment Summary:", 18, yPos + 5.5);
    yPos += 11;

    // Payment Summary Content
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...textGray);

    // Total Cost
    doc.text("- Total Cost:", labelX, yPos);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...textDark);
    doc.text(`USD ${formatCurrency(details.totalAmount)}`, valueX, yPos);
    yPos += lineHeight;

    // Amount Paid
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...textGray);
    doc.text("- Amount Paid:", labelX, yPos);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...textDark);
    doc.text(`USD ${formatCurrency(details.paidAmount)}`, valueX, yPos);
    yPos += lineHeight;

    // Remaining Balance
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...textGray);
    doc.text("- Remaining Balance:", labelX, yPos);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...textDark);
    doc.text(`USD ${formatCurrency(details.remainingBalance)}`, valueX, yPos);
    yPos += lineHeight;

    // Balance Due Date (only show if there's remaining balance)
    if (details.remainingBalance > 0) {
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...textGray);
        doc.text("- Balance Due Date:", labelX, yPos);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...textDark);
        doc.text(formatDate(details.balanceDueDate), valueX, yPos);
        yPos += lineHeight;
    }

    yPos += 10;

    // ============ DEDICATION MESSAGE ============
    const dedicationText = doc.splitTextToSize(
        "We are dedicated to providing you with exceptional service and an authentic Tanzanian safari experience. Should you have any questions or need any assistance before your arrival, please do not hesitate to contact us.",
        180,
    );
    doc.text(dedicationText, 15, yPos);
    yPos += dedicationText.length * 5.5 + 8;

    // ============ CLOSING MESSAGE ============
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...textDark);
    doc.text(
        "We look forward to welcoming you soon and sharing the magic of Tanzania with you!",
        15,
        yPos,
    );
    yPos += 10;

    // ============ SIGNATURE ============
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...primaryBrown);
    doc.text("Warm regards,", 15, yPos);

    // ============ FOOTER ============
    const pageHeight = doc.internal.pageSize.height;
    doc.setFillColor(...primaryBrown);
    doc.rect(0, pageHeight - 20, 210, 20, "F");

    doc.setFontSize(8);
    doc.setTextColor(248, 248, 248);
    doc.text(
        `© ${
            new Date().getFullYear()
        } Liontrack Safari Company. All rights reserved.`,
        105,
        pageHeight - 12,
        { align: "center" },
    );
    doc.setTextColor(...accentGold);
    doc.text(
        "Follow the Track, Discover the Wilderness",
        105,
        pageHeight - 7,
        { align: "center" },
    );

    return doc;
};

export const downloadPDF = (doc: jsPDF, filename: string) => {
    doc.save(filename);
};

export const generatePDFBlob = (doc: jsPDF): Blob => {
    return doc.output("blob");
};

export const generatePDFDataUrl = (doc: jsPDF): string => {
    return doc.output("dataurlstring");
};
