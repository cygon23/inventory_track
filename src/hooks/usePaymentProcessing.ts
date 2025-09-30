import { useState } from "react";

interface PaymentData {
    bookingId: string;
    customerName: string;
    amount: number;
    method: string;
    mobileProvider?: string;
    transactionReference?: string;
    notes?: string;
    paymentDate: string;
    evidenceFile?: File | null;
    totalAmount: number;
    paidAmount: number;
    bookingReference: string;
    checkIn?: string;
}

export const usePaymentProcessing = (supabase: any) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string>("");

    const determinePaymentType = (
        amount: number,
        paidAmount: number,
        totalAmount: number,
    ) => {
        const remaining = totalAmount - paidAmount;

        if (amount >= remaining) {
            return "full_payment";
        } else if (paidAmount === 0) {
            return "deposit";
        } else {
            return "balance";
        }
    };

    const uploadPaymentEvidence = async (file: File, bookingId: string) => {
        try {
            const fileExt = file.name.split(".").pop();
            const fileName = `${bookingId}_${Date.now()}.${fileExt}`;
            const filePath = `payment-evidence/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from("bookings")
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            return filePath;
        } catch (error) {
            console.error("Error uploading file:", error);
            throw new Error("Failed to upload payment evidence");
        }
    };

    const processPayment = async (paymentData: PaymentData) => {
        setIsSubmitting(true);
        setError("");

        try {
            // Upload payment evidence if provided
            let evidencePath = null;
            if (paymentData.evidenceFile) {
                evidencePath = await uploadPaymentEvidence(
                    paymentData.evidenceFile,
                    paymentData.bookingId,
                );
            }

            // Determine payment method with mobile provider
            let finalPaymentMethod = paymentData.method;
            if (
                paymentData.method === "mobile_money" &&
                paymentData.mobileProvider
            ) {
                finalPaymentMethod =
                    `mobile_money_${paymentData.mobileProvider}`;
            }

            // Prepare payment record data
            const paymentRecord = {
                booking_id: paymentData.bookingId,
                customer_name: paymentData.customerName,
                amount: paymentData.amount,
                currency: "USD",
                status: "completed",
                due_date: paymentData.checkIn ||
                    new Date().toISOString().split("T")[0],
                paid_date: paymentData.paymentDate,
                method: finalPaymentMethod,
                type: determinePaymentType(
                    paymentData.amount,
                    paymentData.paidAmount,
                    paymentData.totalAmount,
                ),
                description: paymentData.notes ||
                    `Payment for booking ${paymentData.bookingReference}`,
            };

            // Insert payment record
            const { data: insertedPayment, error: paymentError } =
                await supabase
                    .from("payments")
                    .insert([paymentRecord])
                    .select()
                    .single();

            if (paymentError) throw paymentError;

            // Calculate new paid amount and payment status
            const newPaidAmount = paymentData.paidAmount + paymentData.amount;
            const newPaymentStatus = newPaidAmount >= paymentData.totalAmount
                ? "paid"
                : "partially_paid";

            // Prepare booking update data
            const bookingUpdate: any = {
                paid_amount: newPaidAmount,
                payment_status: newPaymentStatus,
            };

            // Add optional fields
            if (evidencePath) {
                bookingUpdate.payment_evidence = evidencePath;
            }

            if (paymentData.transactionReference) {
                bookingUpdate.transaction_reference =
                    paymentData.transactionReference;
            }

            // Update booking record
            const { error: updateError } = await supabase
                .from("bookings")
                .update(bookingUpdate)
                .eq("id", paymentData.bookingId);

            if (updateError) throw updateError;

            setIsSubmitting(false);
            return { success: true, payment: insertedPayment };
        } catch (err: any) {
            console.error("Error processing payment:", err);
            const errorMessage = err.message ||
                "Failed to process payment. Please try again.";
            setError(errorMessage);
            setIsSubmitting(false);
            return { success: false, error: errorMessage };
        }
    };

    const resetError = () => setError("");

    return {
        processPayment,
        isSubmitting,
        error,
        resetError,
    };
};
