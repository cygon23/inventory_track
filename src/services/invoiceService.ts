import { supabase } from "@/lib/supabase";

export interface Invoice {
    id: string;
    number: string;
    payment_id: string | null;
    customer_name: string;
    booking_id: string;
    issue_date: string;
    due_date: string;
    amount: number;
    currency: string;
    status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
    type: "deposit" | "balance" | "full_payment";
    description: string;
    created_at: string;
    updated_at: string;
    bookings?: {
        booking_reference: string;
        customer_email: string;
        customer_phone: string;
    };
    payments?: {
        method: string;
        paid_date: string | null;
    };
}

// Fetch all invoices with payment and booking details
export const fetchInvoices = async () => {
    const { data, error } = await supabase
        .from("invoices")
        .select(`
      *,
      bookings (
        booking_reference,
        customer_email,
        customer_phone
      ),
      payments (
        method,
        paid_date
      )
    `)
        .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
};

// Create invoice from payment (saves to database)
export const createInvoiceFromPayment = async (
    paymentId: string,
    invoiceData: {
        notes?: string;
        invoice_number?: string;
    },
) => {
    // Get payment details
    const { data: payment, error: paymentError } = await supabase
        .from("payments")
        .select(`
      *,
      bookings (
        booking_reference,
        customer_email,
        customer_phone
      )
    `)
        .eq("id", paymentId)
        .single();

    if (paymentError) throw paymentError;

    if (!payment.booking_id) {
        throw new Error("Payment must have a booking_id to generate invoice");
    }

    // Generate invoice number if not provided
    const invoiceNumber = invoiceData.invoice_number || `INV-${Date.now()}`;

    const invoice = {
        number: invoiceNumber,
        payment_id: paymentId, // Link to payment
        booking_id: payment.booking_id,
        customer_name: payment.customer_name,
        issue_date: new Date().toISOString().split("T")[0],
        due_date: payment.due_date,
        amount: payment.amount,
        currency: payment.currency,
        status: "draft" as const,
        type: payment.type,
        description: payment.description ||
            `Payment ${payment.type.replace("_", " ")}`,
    };

    const { data, error } = await supabase
        .from("invoices")
        .insert([invoice])
        .select(`
      *,
      bookings (
        booking_reference,
        customer_email,
        customer_phone
      ),
      payments (
        method,
        paid_date
      )
    `)
        .single();

    if (error) throw error;
    return data;
};

// Update invoice status
export const updateInvoiceStatus = async (
    invoiceId: string,
    status: string,
) => {
    const { data, error } = await supabase
        .from("invoices")
        .update({ status })
        .eq("id", invoiceId)
        .select()
        .single();

    if (error) throw error;
    return data;
};

// Get invoice stats
export const getInvoiceStats = async () => {
    const { data, error } = await supabase
        .from("invoices")
        .select("amount, status");

    if (error) throw error;

    const stats = {
        draft: 0,
        sent: 0,
        paid: 0,
        overdue: 0,
        draftCount: 0,
        sentCount: 0,
        paidCount: 0,
        overdueCount: 0,
    };

    data.forEach((invoice) => {
        const amount = Number(invoice.amount);
        switch (invoice.status) {
            case "draft":
                stats.draft += amount;
                stats.draftCount++;
                break;
            case "sent":
                stats.sent += amount;
                stats.sentCount++;
                break;
            case "paid":
                stats.paid += amount;
                stats.paidCount++;
                break;
            case "overdue":
                stats.overdue += amount;
                stats.overdueCount++;
                break;
        }
    });

    return stats;
};

// Delete invoice
export const deleteInvoice = async (invoiceId: string) => {
    const { error } = await supabase
        .from("invoices")
        .delete()
        .eq("id", invoiceId);

    if (error) throw error;
};
