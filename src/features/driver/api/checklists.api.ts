import { supabase } from "@/lib/supabase";
import { getDriverIdFromUserId } from "./drivers.api";
import type {
    ApiResponse,
    ChecklistType,
    StartTripFormData,
    TripChecklist,
} from "../types/trip.types";

// =====================================================
// CREATE TRIP CHECKLIST
// =====================================================

export async function createTripChecklist(
    tripId: string,
    userId: string, // This is users.id
    checklistType: ChecklistType,
    checklistData: Partial<TripChecklist>,
): Promise<ApiResponse<TripChecklist>> {
    try {
        // Convert users.id to drivers.id
        const driverId = await getDriverIdFromUserId(userId);

        if (!driverId) {
            throw new Error("Driver profile not found for user");
        }

        const { data, error } = await supabase
            .from("trip_checklists")
            .insert({
                trip_id: tripId,
                driver_id: driverId, //using drivers.id
                checklist_type: checklistType,
                ...checklistData,
            })
            .select()
            .single();

        if (error) throw error;

        return { data, error: null };
    } catch (error) {
        console.error("Error creating checklist:", error);
        return { data: null, error: error as Error };
    }
}

// =====================================================
// FETCH TRIP CHECKLIST
// =====================================================

export async function fetchTripChecklist(
    tripId: string,
    checklistType?: ChecklistType,
): Promise<ApiResponse<TripChecklist>> {
    try {
        let query = supabase
            .from("trip_checklists")
            .select("*")
            .eq("trip_id", tripId);

        if (checklistType) {
            query = query.eq("checklist_type", checklistType);
        }

        const { data, error } = await query.single();

        if (error && error.code !== "PGRST116") throw error;

        return { data, error: null };
    } catch (error) {
        console.error("Error fetching checklist:", error);
        return { data: null, error: error as Error };
    }
}

// =====================================================
// UPDATE TRIP CHECKLIST
// =====================================================

export async function updateTripChecklist(
    checklistId: string,
    formData: Partial<StartTripFormData>,
): Promise<ApiResponse<TripChecklist>> {
    try {
        const { data, error } = await supabase
            .from("trip_checklists")
            .update(formData)
            .eq("id", checklistId)
            .select()
            .single();

        if (error) throw error;

        return { data, error: null };
    } catch (error) {
        console.error("Error updating checklist:", error);
        return { data: null, error: error as Error };
    }
}
