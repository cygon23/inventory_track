import { supabase } from "@/lib/supabase";
import { getDriverIdFromUserId } from "./drivers.api";
import type {
    ApiResponse,
    CreateCommunicationData,
    TripCommunication,
} from "../types/trip.types";

// =====================================================
// CREATE COMMUNICATION LOG
// =====================================================

export async function createCommunication(
    driverId: string,
    data: CreateCommunicationData,
): Promise<ApiResponse<TripCommunication>> {
    try {
        const { data: communication, error } = await supabase
            .from("trip_communications")
            .insert({
                trip_id: data.trip_id,
                driver_id: driverId,
                communication_type: data.communication_type,
                message: data.message || null,
                status: "sent",
            })
            .select()
            .single();

        if (error) throw error;

        return { data: communication, error: null };
    } catch (error) {
        console.error("Error creating communication:", error);
        return { data: null, error: error as Error };
    }
}

// =====================================================
// FETCH TRIP COMMUNICATIONS
// =====================================================

export async function fetchTripCommunications(
    tripId: string,
): Promise<ApiResponse<TripCommunication[]>> {
    try {
        const { data, error } = await supabase
            .from("trip_communications")
            .select("*")
            .eq("trip_id", tripId)
            .order("created_at", { ascending: false });

        if (error) throw error;

        return { data, error: null };
    } catch (error) {
        console.error("Error fetching communications:", error);
        return { data: null, error: error as Error };
    }
}
