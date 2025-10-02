import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Driver {
    id: string;
    user_id: string | null;
    rating: number | null;
    experience: string | null;
    languages: string[] | null;
    specialties: string[] | null;
    total_trips: number | null;
    average_rating: number | null;
    on_time_percentage: number | null;
    next_available: string | null;
    created_at: string | null;
    updated_at: string | null;
}

export interface DriverSchedule {
    id: string;
    driver_id: string | null;
    day_of_week: number | null;
    available: boolean | null;
    trip_id: string | null;
    notes: string | null;
    created_at: string | null;
}

export interface User {
    id: string;
    email: string;
    full_name: string;
    phone: string;
    role: string;
    status: string;
}

export interface Vehicle {
    id: string;
    driver_id: string;
    model: string;
    plate_number: string;
    year: number;
}

// For form submissions
export interface CreateDriverInput {
    user_id?: string;
    email: string;
    full_name: string;
    phone: string;
    experience: string;
    languages: string[];
    specialties: string[];
    vehicle_model: string;
    vehicle_plate: string;
    vehicle_year: number;
    notes?: string;
}

export interface CreateScheduleInput {
    driver_id: string;
    date: string;
    time: string;
    trip_name: string;
    location: string;
    guests: number;
    status: "upcoming" | "in-progress" | "completed";
}
