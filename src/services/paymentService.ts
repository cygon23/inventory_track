import { supabase } from "@/lib/supabase";

export interface Payment {
    id: string;
    booking_id: string;
    customer_name: string;
    amount: number;
    currency: string;
    status: "pending" | "completed" | "failed" | "overdue";
    due_date: string;
    paid_date?: string;
    method: string;
    type: "deposit" | "balance" | "full_payment";
    description: string;
    created_at: string;
    bookings?: {
        booking_reference: string;
        customer_email: string;
        customer_phone: string;
        safari_package: string;
        total_amount: number;
        paid_amount: number;
    };
}

export interface PaymentFormData {
    booking_id: string;
    customer_name: string;
    amount: number;
    currency: string;
    type: string;
    method: string;
    status: string;
    due_date: string;
    paid_date?: string;
    description: string;
}

// Fetch all payments with booking details
export const fetchPayments = async () => {
    const { data, error } = await supabase
        .from("payments")
        .select(`
      *,
      bookings (
        booking_reference,
        customer_email,
        customer_phone,
        safari_package,
        total_amount,
        paid_amount
      )
    `)
        .order("created_at", { ascending: false });

    if (error) throw error;

    // Auto-update overdue payments
    const now = new Date();
    const updatedPayments = data.map((payment) => {
        const dueDate = new Date(payment.due_date);
        if (payment.status === "pending" && dueDate < now) {
            return { ...payment, status: "overdue" };
        }
        return payment;
    });

    return updatedPayments;
};

// Create new payment
export const createPayment = async (paymentData: PaymentFormData) => {
    const { data, error } = await supabase
        .from("payments")
        .insert([paymentData])
        .select()
        .single();

    if (error) throw error;

    // If payment is completed, update booking's paid_amount
    if (paymentData.status === "completed") {
        await updateBookingPaidAmount(paymentData.booking_id);
    }

    return data;
};

// Update booking paid amount
const updateBookingPaidAmount = async (bookingId: string) => {
    // Get all completed payments for this booking
    const { data: completedPayments, error: paymentsError } = await supabase
        .from("payments")
        .select("amount")
        .eq("booking_id", bookingId)
        .eq("status", "completed");

    if (paymentsError) throw paymentsError;

    const totalPaid = completedPayments.reduce(
        (sum, p) => sum + Number(p.amount),
        0,
    );

    // Update booking
    const { error: updateError } = await supabase
        .from("bookings")
        .update({ paid_amount: totalPaid })
        .eq("id", bookingId);

    if (updateError) throw updateError;

    // Update payment status based on amount
    const { data: booking } = await supabase
        .from("bookings")
        .select("total_amount, paid_amount")
        .eq("id", bookingId)
        .single();

    if (booking) {
        let paymentStatus = "pending";
        if (booking.paid_amount >= booking.total_amount) {
            paymentStatus = "paid";
        } else if (booking.paid_amount > 0) {
            paymentStatus = "partial";
        }

        await supabase
            .from("bookings")
            .update({ payment_status: paymentStatus })
            .eq("id", bookingId);
    }
};

// Update payment status
export const updatePaymentStatus = async (
    paymentId: string,
    status: string,
    paidDate?: string,
) => {
    const updateData: any = { status };
    if (paidDate) updateData.paid_date = paidDate;

    const { data, error } = await supabase
        .from("payments")
        .update(updateData)
        .eq("id", paymentId)
        .select()
        .single();

    if (error) throw error;

    // If marked as completed, update booking
    if (status === "completed") {
        const payment = await supabase
            .from("payments")
            .select("booking_id")
            .eq("id", paymentId)
            .single();

        if (payment.data) {
            await updateBookingPaidAmount(payment.data.booking_id);
        }
    }

    return data;
};

// Delete payment
export const deletePayment = async (paymentId: string) => {
    const { error } = await supabase
        .from("payments")
        .delete()
        .eq("id", paymentId);

    if (error) throw error;
};

// Get payment statistics
export const getPaymentStats = async () => {
    const { data, error } = await supabase
        .from("payments")
        .select("amount, status");

    if (error) throw error;

    const stats = {
        pending: 0,
        overdue: 0,
        completed: 0,
        failed: 0,
        pendingCount: 0,
        overdueCount: 0,
        completedCount: 0,
        failedCount: 0,
    };

    const now = new Date();

    data.forEach((payment) => {
        const amount = Number(payment.amount);
        let status = payment.status;

        // Check if pending payment is overdue
        if (status === "pending") {
            const dueDate = new Date(payment.due_date);
            if (dueDate < now) {
                status = "overdue";
            }
        }

        switch (status) {
            case "pending":
                stats.pending += amount;
                stats.pendingCount++;
                break;
            case "overdue":
                stats.overdue += amount;
                stats.overdueCount++;
                break;
            case "completed":
                stats.completed += amount;
                stats.completedCount++;
                break;
            case "failed":
                stats.failed += amount;
                stats.failedCount++;
                break;
        }
    });

    return stats;
};

// Fetch bookings for dropdown in record payment

export const fetchBookingsForPayment = async () => {
    const { data, error } = await supabase
        .from("bookings")
        .select(
            "id, booking_reference, customer_name, total_amount, paid_amount",
        )
        .in("status", ["confirmed", "paid", "in_progress"])
        .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
};
