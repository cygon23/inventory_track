import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types
export interface Customer {
    id: string;
    custom_id: string;
    name: string;
    email: string;
    phone: string;
    country: string;
    status: "new" | "active" | "returning" | "vip" | "inquiry" | "inactive";
    total_bookings: number;
    total_spent: number;
    last_booking: string | null;
    rating: number | null;
    join_date: string;
    upcoming_trip: string | null;
    preferences: string[];
    created_at: string;
    updated_at: string;
}

export interface CustomerInput {
    name: string;
    email: string;
    phone?: string;
    country?: string;
    status?: string;
    total_spent?: string;
    upcoming_trip?: string;
    preferences?: string[];
}

export interface ImportResult {
    success: boolean;
    imported: number;
    failed: number;
    errors: string[];
}

// Customer Service Class
export class CustomerService {
    /**
     * Get all customers with their preferences
     */
    static async getAllCustomers(): Promise<Customer[]> {
        try {
            const { data, error } = await supabase
                .from("customer_details")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;

            return data.map(this.formatCustomer);
        } catch (error) {
            console.error("Error fetching customers:", error);
            throw error;
        }
    }

    /**
     * Get a single customer by ID
     */
    static async getCustomerById(id: string): Promise<Customer | null> {
        try {
            const { data, error } = await supabase
                .from("customer_details")
                .select("*")
                .eq("id", id)
                .single();

            if (error) throw error;

            return this.formatCustomer(data);
        } catch (error) {
            console.error("Error fetching customer:", error);
            return null;
        }
    }

    /**
     * Get customer by custom ID (LT-XXXX)
     */
    static async getCustomerByCustomId(
        customId: string,
    ): Promise<Customer | null> {
        try {
            const { data, error } = await supabase
                .from("customer_details")
                .select("*")
                .eq("custom_id", customId)
                .single();

            if (error) throw error;

            return this.formatCustomer(data);
        } catch (error) {
            console.error("Error fetching customer by custom ID:", error);
            return null;
        }
    }

    /**
     * Create a new customer
     */
    static async createCustomer(
        customerData: CustomerInput,
    ): Promise<Customer> {
        try {
            // Parse total_spent from string to number
            const totalSpent = customerData.total_spent
                ? parseFloat(customerData.total_spent.replace(/[$,]/g, ""))
                : 0;

            // Insert customer
            const { data: customer, error: customerError } = await supabase
                .from("customers")
                .insert({
                    name: customerData.name,
                    email: customerData.email,
                    phone: customerData.phone || "",
                    country: customerData.country || "",
                    status: customerData.status || "new",
                    total_spent: totalSpent,
                    upcoming_trip: customerData.upcoming_trip || null,
                    join_date: new Date().toISOString().split("T")[0],
                })
                .select()
                .single();

            if (customerError) throw customerError;

            // Insert preferences
            if (
                customerData.preferences && customerData.preferences.length > 0
            ) {
                const preferencesData = customerData.preferences.map(
                    (pref) => ({
                        customer_id: customer.id,
                        preference: pref,
                    }),
                );

                const { error: preferencesError } = await supabase
                    .from("customer_preferences")
                    .insert(preferencesData);

                if (preferencesError) {
                    console.error(
                        "Error inserting preferences:",
                        preferencesError,
                    );
                }
            }

            // Fetch the complete customer with preferences
            const newCustomer = await this.getCustomerById(customer.id);

            if (!newCustomer) {
                throw new Error("Failed to retrieve created customer");
            }

            return newCustomer;
        } catch (error) {
            console.error("Error creating customer:", error);
            throw error;
        }
    }

    /**
     * Update an existing customer
     */
    static async updateCustomer(
        id: string,
        customerData: Partial<CustomerInput>,
    ): Promise<Customer> {
        try {
            // Parse total_spent if provided
            const updateData: any = { ...customerData };
            if (updateData.total_spent) {
                updateData.total_spent = parseFloat(
                    updateData.total_spent.replace(/[$,]/g, ""),
                );
            }

            // Remove preferences from update data
            const { preferences, ...customerUpdateData } = updateData;

            // Update customer
            const { error: updateError } = await supabase
                .from("customers")
                .update(customerUpdateData)
                .eq("id", id);

            if (updateError) throw updateError;

            // Update preferences if provided
            if (preferences !== undefined) {
                // Delete existing preferences
                await supabase
                    .from("customer_preferences")
                    .delete()
                    .eq("customer_id", id);

                // Insert new preferences
                if (preferences.length > 0) {
                    const preferencesData = preferences.map((pref: string) => ({
                        customer_id: id,
                        preference: pref,
                    }));

                    const { error: preferencesError } = await supabase
                        .from("customer_preferences")
                        .insert(preferencesData);

                    if (preferencesError) {
                        console.error(
                            "Error updating preferences:",
                            preferencesError,
                        );
                    }
                }
            }

            // Fetch updated customer
            const updatedCustomer = await this.getCustomerById(id);

            if (!updatedCustomer) {
                throw new Error("Failed to retrieve updated customer");
            }

            return updatedCustomer;
        } catch (error) {
            console.error("Error updating customer:", error);
            throw error;
        }
    }

    /**
     * Delete a customer
     */
    static async deleteCustomer(id: string): Promise<boolean> {
        try {
            const { error } = await supabase
                .from("customers")
                .delete()
                .eq("id", id);

            if (error) throw error;

            return true;
        } catch (error) {
            console.error("Error deleting customer:", error);
            return false;
        }
    }

    /**
     * Import multiple customers
     */
    static async importCustomers(
        customers: CustomerInput[],
        fileName: string,
    ): Promise<ImportResult> {
        const result: ImportResult = {
            success: false,
            imported: 0,
            failed: 0,
            errors: [],
        };

        try {
            for (const customerData of customers) {
                try {
                    await this.createCustomer(customerData);
                    result.imported++;
                } catch (error: any) {
                    result.failed++;
                    result.errors.push(
                        `Failed to import ${customerData.email}: ${error.message}`,
                    );
                }
            }

            // Log the import
            await supabase.from("customer_import_logs").insert({
                file_name: fileName,
                total_records: customers.length,
                successful_imports: result.imported,
                failed_imports: result.failed,
                errors: result.errors,
            });

            result.success = result.imported > 0;
            return result;
        } catch (error) {
            console.error("Error importing customers:", error);
            throw error;
        }
    }

    /**
     * Search customers
     */
    static async searchCustomers(searchTerm: string): Promise<Customer[]> {
        try {
            const { data, error } = await supabase
                .from("customer_details")
                .select("*")
                .or(
                    `name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,country.ilike.%${searchTerm}%,custom_id.ilike.%${searchTerm}%`,
                )
                .order("created_at", { ascending: false });

            if (error) throw error;

            return data.map(this.formatCustomer);
        } catch (error) {
            console.error("Error searching customers:", error);
            throw error;
        }
    }

    /**
     * Filter customers by status
     */
    static async filterCustomersByStatus(status: string): Promise<Customer[]> {
        try {
            const { data, error } = await supabase
                .from("customer_details")
                .select("*")
                .eq("status", status)
                .order("created_at", { ascending: false });

            if (error) throw error;

            return data.map(this.formatCustomer);
        } catch (error) {
            console.error("Error filtering customers:", error);
            throw error;
        }
    }

    /**
     * Get customer statistics
     */
    static async getCustomerStats() {
        try {
            const { data: customers, error } = await supabase
                .from("customers")
                .select("status, total_spent, total_bookings");

            if (error) throw error;

            const stats = {
                total: customers.length,
                active: customers.filter((c) => c.status === "active").length,
                new: customers.filter((c) => c.status === "new").length,
                vip: customers.filter((c) => c.status === "vip").length,
                totalRevenue: customers.reduce(
                    (sum, c) => sum + (c.total_spent || 0),
                    0,
                ),
                totalBookings: customers.reduce(
                    (sum, c) => sum + (c.total_bookings || 0),
                    0,
                ),
                averageValue: customers.length > 0
                    ? customers.reduce(
                        (sum, c) => sum + (c.total_spent || 0),
                        0,
                    ) / customers.length
                    : 0,
            };

            return stats;
        } catch (error) {
            console.error("Error fetching customer stats:", error);
            throw error;
        }
    }

    /**
     * Format customer data for frontend
     */
    private static formatCustomer(data: any): Customer {
        return {
            id: data.id,
            custom_id: data.custom_id,
            name: data.name,
            email: data.email,
            phone: data.phone || "",
            country: data.country || "",
            status: data.status,
            total_bookings: data.total_bookings || 0,
            total_spent: data.total_spent || 0,
            last_booking: data.last_booking,
            rating: data.rating,
            join_date: data.join_date,
            upcoming_trip: data.upcoming_trip,
            preferences: Array.isArray(data.preferences)
                ? data.preferences
                : [],
            created_at: data.created_at,
            updated_at: data.updated_at,
        };
    }

    /**
     * Format total spent for display
     */
    static formatTotalSpent(amount: number): string {
        return `$${
            amount.toLocaleString("en-US", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            })
        }`;
    }
}
