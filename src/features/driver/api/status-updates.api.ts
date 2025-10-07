import { supabase } from "@/lib/supabase";
import { getDriverIdFromUserId } from "./drivers.api";
import type {
    ApiResponse,
    TripStatusUpdate,
    UpdateStatusFormData,
} from "../types/trip.types";

// =====================================================
// CREATE STATUS UPDATE
// =====================================================

export async function createStatusUpdate(
    tripId: string,
    userId: string, // This is users.id
    formData: UpdateStatusFormData,
): Promise<ApiResponse<TripStatusUpdate>> {
    try {
        // Convert users.id to drivers.id
        const driverId = await getDriverIdFromUserId(userId);

        if (!driverId) {
            throw new Error("Driver profile not found for user");
        }

        const { data, error } = await supabase
            .from("trip_status_updates")
            .insert({
                trip_id: tripId,
                driver_id: driverId,
                status: formData.status,
                location: formData.location || null,
                fuel_level: formData.fuel_level || null,
                notes: formData.notes || null,
                latitude: formData.latitude || null,
                longitude: formData.longitude || null,
            })
            .select()
            .single();

        if (error) throw error;

        return { data, error: null };
    } catch (error) {
        console.error("Error creating status update:", error);
        return { data: null, error: error as Error };
    }
}

// =====================================================
// FETCH STATUS UPDATES FOR TRIP
// =====================================================

export async function fetchTripStatusUpdates(
    tripId: string,
): Promise<ApiResponse<TripStatusUpdate[]>> {
    try {
        const { data, error } = await supabase
            .from("trip_status_updates")
            .select("*")
            .eq("trip_id", tripId)
            .order("created_at", { ascending: false });

        if (error) throw error;

        return { data, error: null };
    } catch (error) {
        console.error("Error fetching status updates:", error);
        return { data: null, error: error as Error };
    }
}

// =====================================================
// GET LATEST STATUS UPDATE
// =====================================================

export async function fetchLatestStatusUpdate(
    tripId: string,
): Promise<ApiResponse<TripStatusUpdate>> {
    try {
        const { data, error } = await supabase
            .from("trip_status_updates")
            .select("*")
            .eq("trip_id", tripId)
            .order("created_at", { ascending: false })
            .limit(1)
            .single();

        if (error) throw error;

        return { data, error: null };
    } catch (error) {
        console.error("Error fetching latest status update:", error);
        return { data: null, error: error as Error };
    }
}
