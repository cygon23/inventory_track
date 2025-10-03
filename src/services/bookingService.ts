import { supabase } from "@/lib/supabaseClient";

export interface BookingFormData {
    customerCustomId?: string; // LT-XXXX format
    customerId?: string; // UUID if already exists
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    safariPackage: string;
    packageId: string;
    startDate: Date;
    endDate: Date;
    adults: number;
    children: number;
    totalAmount: number;
    paidAmount?: number;
    status?: string;
    paymentStatus?: string;
    assignedGuide?: string;
    assignedDriver?: string;
    assignedVehicle?: string;
    specialRequests?: string[];
    accommodation?: string;
    transportation?: string;
    notes?: string;
}

export interface Booking {
    id: string;
    booking_reference: string;
    customer_id: string | null;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    safari_package: string;
    package_id: string | null;
    start_date: string;
    end_date: string;
    adults: number;
    children: number;
    total_amount: number;
    paid_amount: number;
    status: string;
    payment_status: string;
    assigned_guide: string | null;
    assigned_driver: string | null;
    assigned_vehicle: string | null;
    special_requests: string[] | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
}

export interface Customer {
    id: string;
    custom_id: string;
    name: string;
    email: string;
    phone: string;
    country: string;
    status: string;
}

class BookingService {
    /**
     * Find or create customer by email or custom_id
     */
    async findOrCreateCustomer(data: {
        customerId?: string;
        customerCustomId?: string;
        name: string;
        email: string;
        phone: string;
        country?: string;
    }): Promise<{ data: Customer | null; error: any }> {
        try {
            let customer: Customer | null = null;

            // Try to find existing customer by custom_id (LT-XXXX)
            if (data.customerCustomId) {
                const { data: existingCustomer, error } = await supabase
                    .from("customers")
                    .select("*")
                    .eq("custom_id", data.customerCustomId)
                    .single();

                if (existingCustomer && !error) {
                    customer = existingCustomer;
                }
            }

            // Try to find by UUID if provided
            if (!customer && data.customerId) {
                const { data: existingCustomer, error } = await supabase
                    .from("customers")
                    .select("*")
                    .eq("id", data.customerId)
                    .single();

                if (existingCustomer && !error) {
                    customer = existingCustomer;
                }
            }

            // Try to find by email
            if (!customer) {
                const { data: existingCustomer, error } = await supabase
                    .from("customers")
                    .select("*")
                    .eq("email", data.email)
                    .single();

                if (existingCustomer && !error) {
                    customer = existingCustomer;
                }
            }

            // Create new customer if not found
            if (!customer) {
                const { data: newCustomer, error: createError } = await supabase
                    .from("customers")
                    .insert({
                        name: data.name,
                        email: data.email,
                        phone: data.phone,
                        country: data.country || "Unknown",
                        status: "inquiry",
                    })
                    .select()
                    .single();

                if (createError) {
                    return { data: null, error: createError };
                }

                customer = newCustomer;
            } else {
                // Update existing customer info
                const { data: updatedCustomer, error: updateError } =
                    await supabase
                        .from("customers")
                        .update({
                            name: data.name,
                            phone: data.phone,
                            updated_at: new Date().toISOString(),
                        })
                        .eq("id", customer.id)
                        .select()
                        .single();

                if (!updateError && updatedCustomer) {
                    customer = updatedCustomer;
                }
            }

            return { data: customer, error: null };
        } catch (error) {
            console.error("Error in findOrCreateCustomer:", error);
            return { data: null, error };
        }
    }

    /**
     * Create a new booking
     */
    async createBooking(
        formData: BookingFormData,
    ): Promise<{ data: Booking | null; error: any }> {
        try {
            // Step 1: Find or create customer
            const { data: customer, error: customerError } = await this
                .findOrCreateCustomer({
                    customerId: formData.customerId,
                    customerCustomId: formData.customerCustomId,
                    name: formData.customerName,
                    email: formData.customerEmail,
                    phone: formData.customerPhone,
                });

            if (customerError || !customer) {
                return {
                    data: null,
                    error: customerError ||
                        new Error("Failed to create customer"),
                };
            }

            // Step 2: Create booking
            const bookingData = {
                customer_id: customer.id,
                customer_name: formData.customerName,
                customer_email: formData.customerEmail,
                customer_phone: formData.customerPhone,
                safari_package: formData.safariPackage,
                package_id: formData.packageId,
                start_date: formData.startDate.toISOString().split("T")[0],
                end_date: formData.endDate.toISOString().split("T")[0],
                adults: formData.adults,
                children: formData.children || 0,
                total_amount: formData.totalAmount,
                paid_amount: formData.paidAmount || 0,
                status: formData.status || "inquiry",
                payment_status: formData.paymentStatus || "pending",
                assigned_guide: formData.assignedGuide || null,
                assigned_driver: formData.assignedDriver || null,
                assigned_vehicle: formData.assignedVehicle || null,
                special_requests: formData.specialRequests || [],
                notes: formData.notes || null,
            };

            const { data: booking, error: bookingError } = await supabase
                .from("bookings")
                .insert(bookingData)
                .select()
                .single();

            if (bookingError) {
                return { data: null, error: bookingError };
            }

            return { data: booking, error: null };
        } catch (error) {
            console.error("Error creating booking:", error);
            return { data: null, error };
        }
    }

    /**
     * Get all bookings with customer details
     */
    async getAllBookings(): Promise<{ data: any[] | null; error: any }> {
        try {
            const { data, error } = await supabase
                .from("booking_details")
                .select("*")
                .order("created_at", { ascending: false });

            return { data, error };
        } catch (error) {
            console.error("Error fetching bookings:", error);
            return { data: null, error };
        }
    }

    /**
     * Get booking by ID
     */
    async getBookingById(
        id: string,
    ): Promise<{ data: Booking | null; error: any }> {
        try {
            const { data, error } = await supabase
                .from("bookings")
                .select("*")
                .eq("id", id)
                .single();

            return { data, error };
        } catch (error) {
            console.error("Error fetching booking:", error);
            return { data: null, error };
        }
    }

    /**
     * Update booking
     */
    async updateBooking(
        id: string,
        updates: Partial<BookingFormData>,
    ): Promise<{ data: Booking | null; error: any }> {
        try {
            const updateData: any = {};

            if (updates.customerName) {
                updateData.customer_name = updates.customerName;
            }
            if (updates.customerEmail) {
                updateData.customer_email = updates.customerEmail;
            }
            if (updates.customerPhone) {
                updateData.customer_phone = updates.customerPhone;
            }
            if (updates.safariPackage) {
                updateData.safari_package = updates.safariPackage;
            }
            if (updates.packageId) updateData.package_id = updates.packageId;
            if (updates.startDate) {
                updateData.start_date =
                    updates.startDate.toISOString().split("T")[0];
            }
            if (updates.endDate) {
                updateData.end_date =
                    updates.endDate.toISOString().split("T")[0];
            }
            if (updates.adults !== undefined) {
                updateData.adults = updates.adults;
            }
            if (updates.children !== undefined) {
                updateData.children = updates.children;
            }
            if (updates.totalAmount !== undefined) {
                updateData.total_amount = updates.totalAmount;
            }
            if (updates.paidAmount !== undefined) {
                updateData.paid_amount = updates.paidAmount;
            }
            if (updates.status) updateData.status = updates.status;
            if (updates.paymentStatus) {
                updateData.payment_status = updates.paymentStatus;
            }
            if (updates.assignedGuide !== undefined) {
                updateData.assigned_guide = updates.assignedGuide;
            }
            if (updates.assignedDriver !== undefined) {
                updateData.assigned_driver = updates.assignedDriver;
            }
            if (updates.assignedVehicle !== undefined) {
                updateData.assigned_vehicle = updates.assignedVehicle;
            }
            if (updates.specialRequests) {
                updateData.special_requests = updates.specialRequests;
            }
            if (updates.notes !== undefined) updateData.notes = updates.notes;

            const { data, error } = await supabase
                .from("bookings")
                .update(updateData)
                .eq("id", id)
                .select()
                .single();

            return { data, error };
        } catch (error) {
            console.error("Error updating booking:", error);
            return { data: null, error };
        }
    }

    /**
     * Delete booking
     */
    async deleteBooking(id: string): Promise<{ error: any }> {
        try {
            const { error } = await supabase
                .from("bookings")
                .delete()
                .eq("id", id);

            return { error };
        } catch (error) {
            console.error("Error deleting booking:", error);
            return { error };
        }
    }

   /**
 * Search customers for autocomplete
 */
async searchCustomers(
  query: string,
): Promise<{ data: Customer[] | null; error: any }> {
  if (!query || query.trim().length < 1) {
    return { data: [], error: null };
  }

  try {
    const search = `%${query}%`;

    const { data, error } = await supabase
      .from("customers")
      .select("id, custom_id, name, email, phone, country, status")
      .or(
        `name.ilike.${search},email.ilike.${search},phone.ilike.${search},custom_id.ilike.${search}`
      )
      .limit(10);
    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
}



    /**
     * Get customer by custom_id (LT-XXXX)
     */
    async getCustomerByCustomId(
        customId: string,
    ): Promise<{ data: Customer | null; error: any }> {
        try {
            const { data, error } = await supabase
                .from("customers")
                .select("*")
                .eq("custom_id", customId)
                .single();

            return { data, error };
        } catch (error) {
            console.error("Error fetching customer:", error);
            return { data: null, error };
        }
    }

    /**
     * Get bookings by customer
     */
    async getBookingsByCustomer(
        customerId: string,
    ): Promise<{ data: Booking[] | null; error: any }> {
        try {
            const { data, error } = await supabase
                .from("bookings")
                .select("*")
                .eq("customer_id", customerId)
                .order("start_date", { ascending: false });

            return { data, error };
        } catch (error) {
            console.error("Error fetching customer bookings:", error);
            return { data: null, error };
        }
    }

    /**
     * Get booking statistics
     */
    async getBookingStats(): Promise<{ data: any | null; error: any }> {
        try {
            const { data: bookings, error } = await supabase
                .from("bookings")
                .select("status, payment_status, total_amount, paid_amount");

            if (error || !bookings) {
                return { data: null, error };
            }

            const stats = {
                total: bookings.length,
                inquiry: bookings.filter((b) => b.status === "inquiry").length,
                quoted: bookings.filter((b) => b.status === "quoted").length,
                confirmed: bookings.filter((b) =>
                    b.status === "confirmed"
                ).length,
                paid: bookings.filter((b) => b.status === "paid").length,
                inProgress: bookings.filter((b) =>
                    b.status === "in_progress"
                ).length,
                completed:
                    bookings.filter((b) => b.status === "completed").length,
                cancelled:
                    bookings.filter((b) => b.status === "cancelled").length,
                totalRevenue: bookings.reduce(
                    (sum, b) => sum + Number(b.total_amount),
                    0,
                ),
                paidRevenue: bookings.reduce(
                    (sum, b) => sum + Number(b.paid_amount),
                    0,
                ),
            };

            return { data: stats, error: null };
        } catch (error) {
            console.error("Error fetching booking stats:", error);
            return { data: null, error };
        }
    }
}

export const bookingService = new BookingService();
