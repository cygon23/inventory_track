import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
    },
});

// Database types for type safety
export interface Database {
    public: {
        Tables: {
            customers: {
                Row: {
                    id: string;
                    custom_id: string;
                    name: string;
                    email: string;
                    phone: string | null;
                    country: string | null;
                    status: string;
                    total_bookings: number;
                    total_spent: number;
                    last_booking: string | null;
                    rating: number | null;
                    join_date: string;
                    upcoming_trip: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    custom_id?: string;
                    name: string;
                    email: string;
                    phone?: string | null;
                    country?: string | null;
                    status?: string;
                    total_bookings?: number;
                    total_spent?: number;
                    last_booking?: string | null;
                    rating?: number | null;
                    join_date?: string;
                    upcoming_trip?: string | null;
                };
                Update: {
                    id?: string;
                    custom_id?: string;
                    name?: string;
                    email?: string;
                    phone?: string | null;
                    country?: string | null;
                    status?: string;
                    total_bookings?: number;
                    total_spent?: number;
                    last_booking?: string | null;
                    rating?: number | null;
                    join_date?: string;
                    upcoming_trip?: string | null;
                };
            };
            bookings: {
                Row: {
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
                };
                Insert: {
                    id?: string;
                    booking_reference?: string;
                    customer_id?: string | null;
                    customer_name: string;
                    customer_email: string;
                    customer_phone: string;
                    safari_package: string;
                    package_id?: string | null;
                    start_date: string;
                    end_date: string;
                    adults: number;
                    children?: number;
                    total_amount: number;
                    paid_amount?: number;
                    status?: string;
                    payment_status?: string;
                    assigned_guide?: string | null;
                    assigned_driver?: string | null;
                    assigned_vehicle?: string | null;
                    special_requests?: string[] | null;
                    notes?: string | null;
                };
                Update: {
                    id?: string;
                    booking_reference?: string;
                    customer_id?: string | null;
                    customer_name?: string;
                    customer_email?: string;
                    customer_phone?: string;
                    safari_package?: string;
                    package_id?: string | null;
                    start_date?: string;
                    end_date?: string;
                    adults?: number;
                    children?: number;
                    total_amount?: number;
                    paid_amount?: number;
                    status?: string;
                    payment_status?: string;
                    assigned_guide?: string | null;
                    assigned_driver?: string | null;
                    assigned_vehicle?: string | null;
                    special_requests?: string[] | null;
                    notes?: string | null;
                };
            };
        };
    };
}
