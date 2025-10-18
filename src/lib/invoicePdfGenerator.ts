import jsPDF from "jspdf";
import "jspdf-autotable";

interface InvoiceDetails {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  customerName: string;
  customerEmail: string;
  customerAddress?: string;
  items: Array<{
    description: string;
    quantity: number;
    priceUSD: number;
  }>;
  notes?: string;
  bookingReference?: string;
}

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

export const generateInvoicePDF = (details: InvoiceDetails): jsPDF => {
  const doc = new jsPDF();

  // Colors - Brand colors
  const primaryBrown = [115, 87, 65]; // #735741
  const black = [0, 0, 0]; // #000000
  const lightGray = [245, 245, 245];
  const textDark = [51, 51, 51];

  let yPos = 20;

  // ============ HEADER - INVOICE TITLE ============
  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...black);
  doc.text("INVOICE", 105, yPos, { align: "center" });
  yPos += 15;

  // ============ COMPANY INFO & INVOICE DETAILS (Two Columns) ============
  // Left Column - Company Info
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...primaryBrown);
  doc.text("Lion Track Safari", 20, yPos);
  
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...textDark);
  doc.text("Arusha - Tanzania", 20, yPos + 5);
  doc.text("Tel: +255 782 247 376", 20, yPos + 10);
  doc.text("E-mail: info@liontracksafari.com", 20, yPos + 15);

  // Right Column - Invoice Details
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...textDark);
  doc.text("Invoice Number", 140, yPos);
  doc.text("Invoice Date", 140, yPos + 7);
  doc.text("Due Date", 140, yPos + 14);

  doc.setFont("helvetica", "normal");
  doc.text(details.invoiceNumber, 175, yPos);
  doc.text(formatDate(details.invoiceDate), 175, yPos + 7);
  doc.text(formatDate(details.dueDate), 175, yPos + 14);

  yPos += 30;

  // ============ BILL TO SECTION ============
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...primaryBrown);
  doc.text("Bill To", 20, yPos);
  yPos += 7;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...textDark);
  doc.text(`Name: ${details.customerName}`, 20, yPos);
  yPos += 5;
  doc.text(`Email: ${details.customerEmail}`, 20, yPos);
  yPos += 5;
  
  if (details.customerAddress) {
    doc.text(`Address: ${details.customerAddress}`, 20, yPos);
    yPos += 5;
  }

  if (details.bookingReference) {
    doc.text(`Booking Reference: ${details.bookingReference}`, 20, yPos);
    yPos += 5;
  }

  yPos += 10;

  // ============ ITEMS TABLE ============
  const tableStartY = yPos;
  
  // Table Header
  doc.setFillColor(...primaryBrown);
  doc.rect(20, yPos, 170, 10, "F");
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("#", 25, yPos + 6.5);
  doc.text("Description", 40, yPos + 6.5);
  doc.text("Quantity", 130, yPos + 6.5);
  doc.text("Price (USD)", 165, yPos + 6.5);
  
  yPos += 10;

  // Table Rows
  doc.setTextColor(...textDark);
  doc.setFont("helvetica", "normal");
  
  details.items.forEach((item, index) => {
    // Alternate row background
    if (index % 2 === 0) {
      doc.setFillColor(...lightGray);
      doc.rect(20, yPos, 170, 8, "F");
    }
    
    doc.text((index + 1).toString(), 25, yPos + 5.5);
    
    // Handle long descriptions
    const descLines = doc.splitTextToSize(item.description, 80);
    doc.text(descLines, 40, yPos + 5.5);
    
    doc.text(item.quantity.toString(), 135, yPos + 5.5);
    doc.text(formatCurrency(item.priceUSD), 165, yPos + 5.5);
    
    const lineHeight = descLines.length > 1 ? descLines.length * 5 : 8;
    yPos += lineHeight;
  });

  yPos += 5;

  // ============ TOTALS SECTION ============
  const subtotal = details.items.reduce((sum, item) => sum + (item.priceUSD * item.quantity), 0);
  
  doc.setDrawColor(...primaryBrown);
  doc.line(20, yPos, 190, yPos);
  yPos += 8;

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...textDark);
  doc.text("Sub-Total (USD):", 130, yPos);
  doc.text(formatCurrency(subtotal), 175, yPos, { align: "right" });
  
  yPos += 10;

  // ============ PAYMENT INFORMATION SECTION ============
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...primaryBrown);
  doc.text("Payment Information:", 20, yPos);
  yPos += 7;

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...textDark);
  
  const paymentInfo = [
    "BANK NAME: NMB BANK PLC",
    "SWIFT CODE: NMIBTZTZ",
    "BRANCH CODE: 428",
    "ACCOUNT NUMBER (EURO): 42810015688",
    "ACCOUNT NUMBER (USD): 42810013862",
    "ACCOUNT NAME: LION TRACK SAFARI",
  ];

  paymentInfo.forEach((info) => {
    doc.text(info, 20, yPos);
    yPos += 5;
  });

  yPos += 3;
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...primaryBrown);
  doc.text("Secure Online Payment: ", 20, yPos);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 255);
  doc.textWithLink("https://store.pesapal.com/liontracksafaricompany", 65, yPos, {
    url: "https://store.pesapal.com/liontracksafaricompany",
  });

  yPos += 15;

  // ============ NOTES SECTION (if provided) ============
  if (details.notes) {
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...primaryBrown);
    doc.text("Notes:", 20, yPos);
    yPos += 6;

    doc.setFont("helvetica", "normal");
    doc.setTextColor(...textDark);
    const noteLines = doc.splitTextToSize(details.notes, 170);
    doc.text(noteLines, 20, yPos);
    yPos += noteLines.length * 5 + 5;
  }

  // ============ SIGNATURE SECTION ============
  yPos += 10;
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...textDark);
  doc.text("Director's Signature:", 20, yPos);
  
  // Signature line
  doc.setDrawColor(...black);
  doc.line(20, yPos + 10, 80, yPos + 10);

  // ============ FOOTER ============
  const pageHeight = doc.internal.pageSize.height;
  doc.setFillColor(...primaryBrown);
  doc.rect(0, pageHeight - 15, 210, 15, "F");

  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text(
    "Lion Track Safari | info@liontracksafari.com | +255 782 247 376 | Arusha-Tanzania",
    105,
    pageHeight - 8,
    { align: "center" }
  );

  return doc;
};

export const downloadInvoicePDF = (doc: jsPDF, filename: string) => {
  doc.save(filename);
};

export const printInvoicePDF = (doc: jsPDF) => {
  doc.autoPrint();
  window.open(doc.output("bloburl"), "_blank");
};