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

export const generateEmailSubject = (bookingReference: string): string => {
    return `Booking Confirmation - ${bookingReference} - Liontrack Safari Company`;
};

export const generatePlainTextEmail = (details: BookingDetails): string => {
    return `
Subject: ${generateEmailSubject(details.bookingReference)}

Dear ${details.customerName},

Warm greetings from Liontrack Safari Company!

We are delighted to confirm your booking for your upcoming safari adventure with us. Thank you for choosing Liontrack Safari Company to craft this unforgettable journey through Tanzania's breathtaking wilderness.

We are pleased to confirm that we have received your initial payment of 50% of the total safari cost. To secure all arrangements, please ensure that the remaining balance is paid at least 45 days before your arrival date.

BOOKING DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Guest Name: ${details.customerName}
• Travel Dates: ${formatDate(details.startDate)} to ${
        formatDate(details.endDate)
    }
• Itinerary: ${details.itinerary}
• Number of Guests: ${details.numberOfGuests}
${
        details.specialRequests
            ? `• Special Requests: ${details.specialRequests}`
            : ""
    }

PAYMENT SUMMARY:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Total Cost: ${formatCurrency(details.totalAmount)}
• Amount Paid: ${formatCurrency(details.paidAmount)}
• Remaining Balance: ${formatCurrency(details.remainingBalance)}
• Balance Due Date: ${formatDate(details.balanceDueDate)}

WHAT'S NEXT?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Kindly complete the remaining payment no later than 45 days prior to arrival.
• Please share your arrival details (flight number and arrival time) if you haven't done so yet.
• Let us know if you have any dietary requirements or special needs to make your safari more comfortable.

We are dedicated to providing you with exceptional service and an authentic Tanzanian safari experience. Should you have any questions or need any assistance before your arrival, please do not hesitate to contact us.

CONTACT INFORMATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WhatsApp (Personal): +255 782 247 376
Office: +255 682 801 818
Email: info@liontracksafari.com
Website: https://liontracksafari.com/

Liontrack Safari Company
Follow the Track, Discover the Wilderness

We look forward to welcoming you soon and sharing the magic of Tanzania with you!

Warm regards,
Pastory Katwe
Managing Director
Liontrack Safari Company
`.trim();
};

export const generateHTMLEmail = (details: BookingDetails): string => {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Confirmation - ${details.bookingReference}</title>
</head>
<body style="margin:0;padding:0;background-color:#FAF7F0;font-family:'Segoe UI',Arial,sans-serif;color:#333;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:30px 0;background-color:#FAF7F0;">
    <tr>
      <td align="center">
        <table width="650" cellpadding="0" cellspacing="0" style="background-color:#FFFFFF;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.05);">

          <!-- Header -->
          <tr>
            <td style="background-color:#0D2043;padding:35px 20px;text-align:center;">
              <img src="https://liontracksafari.com/assets/images/logo.png" alt="Liontrack Safari Logo" width="180" style="margin-bottom:10px;">
              <h1 style="color:#C6973F;margin:0;font-size:26px;font-weight:bold;">Liontrack Safari Company</h1>
              <p style="color:#F8F8F8;margin:6px 0 0 0;font-size:14px;">Follow the Track, Discover the Wilderness</p>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding:30px;">
              <h2 style="color:#0D2043;margin-top:0;">Booking Confirmation</h2>
              <p>Dear <strong>${details.customerName}</strong>,</p>
              <p>Warm greetings from Liontrack Safari Company!</p>
              <p>We are delighted to confirm your booking for your upcoming safari adventure with us. Thank you for choosing Liontrack Safari Company to craft this unforgettable journey through Tanzania's breathtaking wilderness.</p>
            </td>
          </tr>

          <!-- Payment Summary Banner -->
          <tr>
            <td style="padding:0 30px 30px 30px;">
              <div style="background-color:#F2F7F2;border-left:4px solid #2E7D32;padding:15px 20px;border-radius:4px;">
                <p style="margin:0;color:#1B5E20;font-weight:600;">✓ Payment Received: ${
        formatCurrency(details.paidAmount)
    }</p>
                <p style="margin:5px 0 0 0;color:#388E3C;font-size:14px;">We have received your initial payment of 50% of the total safari cost.</p>
              </div>
            </td>
          </tr>

          <!-- Booking Details -->
          <tr>
            <td style="padding:0 30px 30px 30px;">
              <table width="100%" cellpadding="8" cellspacing="0" style="border:2px solid #E2E8F0;border-radius:8px;">
                <tr>
                  <td colspan="2" style="background-color:#0D2043;color:#C6973F;font-size:18px;padding:12px 20px;font-weight:600;">📋 Booking Details</td>
                </tr>
                <tr><td style="width:45%;color:#555;">Booking Reference:</td><td><strong>${details.bookingReference}</strong></td></tr>
                <tr><td style="color:#555;">Guest Name:</td><td>${details.customerName}</td></tr>
                <tr><td style="color:#555;">Email:</td><td>${details.customerEmail}</td></tr>
                <tr><td style="color:#555;">Travel Dates:</td><td>${
        formatDate(details.startDate)
    } to ${formatDate(details.endDate)}</td></tr>
                <tr><td style="color:#555;">Itinerary:</td><td>${details.itinerary}</td></tr>
                <tr><td style="color:#555;">Guests:</td><td>${details.numberOfGuests}</td></tr>
                ${
        details.specialRequests
            ? `<tr><td style="color:#555;">Special Requests:</td><td>${details.specialRequests}</td></tr>`
            : ""
    }
              </table>
            </td>
          </tr>

          <!-- Payment Summary -->
          <tr>
            <td style="padding:0 30px 30px 30px;">
              <table width="100%" cellpadding="8" cellspacing="0" style="border:2px solid #FCD34D;border-radius:8px;">
                <tr>
                  <td colspan="2" style="background-color:#C6973F;color:#0D2043;font-weight:600;font-size:18px;padding:12px 20px;">💰 Payment Summary</td>
                </tr>
                <tr><td>Total Cost:</td><td align="right">${
        formatCurrency(details.totalAmount)
    }</td></tr>
                <tr><td>Amount Paid:</td><td align="right">${
        formatCurrency(details.paidAmount)
    }</td></tr>
                <tr><td><strong>Remaining Balance:</strong></td><td align="right"><strong>${
        formatCurrency(details.remainingBalance)
    }</strong></td></tr>
                <tr><td>Balance Due Date:</td><td align="right">${
        formatDate(details.balanceDueDate)
    }</td></tr>
              </table>
            </td>
          </tr>

          <!-- What's Next -->
          <tr>
            <td style="padding:0 30px 30px 30px;">
              <div style="background-color:#FAF3E0;border-left:4px solid #C6973F;padding:20px;border-radius:8px;">
                <h3 style="margin-top:0;color:#0D2043;">🎯 What's Next?</h3>
                <ul style="margin:0;padding-left:20px;color:#333;">
                  <li>Kindly complete the remaining payment no later than <strong>45 days prior to arrival</strong>.</li>
                  <li>Please share your <strong>arrival details</strong> (flight number and arrival time) if you haven't done so yet.</li>
                  <li>Let us know if you have any <strong>dietary requirements or special needs</strong> to make your safari more comfortable.</li>
                </ul>
              </div>
            </td>
          </tr>

          <!-- Contact Info -->
          <tr>
            <td style="padding:0 30px 30px 30px;">
              <h3 style="color:#0D2043;">📞 Contact Information</h3>
              <p style="margin:5px 0;">WhatsApp (Personal): <strong>+255 782 247 376</strong></p>
              <p style="margin:5px 0;">Office: <strong>+255 682 801 818</strong></p>
              <p style="margin:5px 0;">Email: <a href="mailto:info@liontracksafari.com" style="color:#C6973F;text-decoration:none;">info@liontracksafari.com</a></p>
              <p style="margin:5px 0;">Website: <a href="https://liontracksafari.com/" style="color:#C6973F;text-decoration:none;">liontracksafari.com</a></p>
            </td>
          </tr>

          <!-- Closing -->
          <tr>
            <td style="padding:0 30px 40px 30px;">
              <p>We look forward to welcoming you soon and sharing the magic of Tanzania with you!</p>
              <p style="color:#0D2043;font-weight:600;margin-top:20px;">Warm regards,</p>
              <p style="color:#0D2043;font-weight:bold;margin:0;">Pastory Katwe</p>
              <p style="color:#555;margin:0;">Managing Director</p>
              <p style="color:#555;margin:0;">Liontrack Safari Company</p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#0D2043;padding:20px;text-align:center;">
              <p style="color:#F8F8F8;font-size:12px;margin:0;">© ${
        new Date().getFullYear()
    } Liontrack Safari Company. All rights reserved.</p>
              <p style="color:#C6973F;font-size:12px;margin:5px 0 0 0;">Follow the Track, Discover the Wilderness</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`.trim();
};
