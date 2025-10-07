import { supabase } from "@/lib/supabase";
import type {
    ApiResponse,
    TripWaypoint,
    WaypointStatus,
} from "../types/trip.types";

// =====================================================
// FETCH TRIP WAYPOINTS
// =====================================================

export async function fetchTripWaypoints(
    tripId: string,
): Promise<ApiResponse<TripWaypoint[]>> {
    try {
        const { data, error } = await supabase
            .from("trip_waypoints")
            .select("*")
            .eq("trip_id", tripId)
            .order("sequence_order", { ascending: true });

        if (error) throw error;

        return { data, error: null };
    } catch (error) {
        console.error("Error fetching waypoints:", error);
        return { data: null, error: error as Error };
    }
}

// =====================================================
// UPDATE WAYPOINT STATUS
// =====================================================

export async function updateWaypointStatus(
    waypointId: string,
    status: WaypointStatus,
    actualArrivalTime?: string,
): Promise<ApiResponse<TripWaypoint>> {
    try {
        const updateData: Partial<TripWaypoint> = {
            status,
        };

        if (actualArrivalTime) {
            updateData.actual_arrival_time = actualArrivalTime;
        }

        const { data, error } = await supabase
            .from("trip_waypoints")
            .update(updateData)
            .eq("id", waypointId)
            .select()
            .single();

        if (error) throw error;

        return { data, error: null };
    } catch (error) {
        console.error("Error updating waypoint status:", error);
        return { data: null, error: error as Error };
    }
}

// =====================================================
// GET CURRENT WAYPOINT
// =====================================================

export async function fetchCurrentWaypoint(
    tripId: string,
): Promise<ApiResponse<TripWaypoint>> {
    try {
        const { data, error } = await supabase
            .from("trip_waypoints")
            .select("*")
            .eq("trip_id", tripId)
            .eq("status", "current")
            .single();

        if (error && error.code !== "PGRST116") throw error; // PGRST116 = no rows

        return { data, error: null };
    } catch (error) {
        console.error("Error fetching current waypoint:", error);
        return { data: null, error: error as Error };
    }
}

// =====================================================
// GET NEXT WAYPOINT
// =====================================================

export async function fetchNextWaypoint(
    tripId: string,
): Promise<ApiResponse<TripWaypoint>> {
    try {
        const { data, error } = await supabase
            .from("trip_waypoints")
            .select("*")
            .eq("trip_id", tripId)
            .eq("status", "upcoming")
            .order("sequence_order", { ascending: true })
            .limit(1)
            .single();

        if (error && error.code !== "PGRST116") throw error;

        return { data, error: null };
    } catch (error) {
        console.error("Error fetching next waypoint:", error);
        return { data: null, error: error as Error };
    }
}

// =====================================================
// MARK WAYPOINT AS COMPLETED
// =====================================================

export async function completeWaypoint(
    waypointId: string,
): Promise<ApiResponse<TripWaypoint>> {
    try {
        const { data, error } = await supabase
            .from("trip_waypoints")
            .update({
                status: "completed",
                actual_arrival_time: new Date().toISOString(),
            })
            .eq("id", waypointId)
            .select()
            .single();

        if (error) throw error;

        return { data, error: null };
    } catch (error) {
        console.error("Error completing waypoint:", error);
        return { data: null, error: error as Error };
    }
}

// =====================================================
// ADVANCE TO NEXT WAYPOINT
// Set current waypoint to completed and next to current
// =====================================================

export async function advanceToNextWaypoint(
    tripId: string,
): Promise<ApiResponse<{ completed: TripWaypoint; current: TripWaypoint }>> {
    try {
        // Get current waypoint
        const { data: currentWaypoint, error: currentError } = await supabase
            .from("trip_waypoints")
            .select("*")
            .eq("trip_id", tripId)
            .eq("status", "current")
            .single();

        if (currentError) throw currentError;

        // Get next waypoint
        const { data: nextWaypoint, error: nextError } = await supabase
            .from("trip_waypoints")
            .select("*")
            .eq("trip_id", tripId)
            .eq("status", "upcoming")
            .order("sequence_order", { ascending: true })
            .limit(1)
            .single();

        if (nextError) throw nextError;

        // Mark current as completed
        const { data: completedWaypoint, error: completeError } = await supabase
            .from("trip_waypoints")
            .update({
                status: "completed",
                actual_arrival_time: new Date().toISOString(),
            })
            .eq("id", currentWaypoint.id)
            .select()
            .single();

        if (completeError) throw completeError;

        // Mark next as current
        const { data: newCurrentWaypoint, error: updateError } = await supabase
            .from("trip_waypoints")
            .update({ status: "current" })
            .eq("id", nextWaypoint.id)
            .select()
            .single();

        if (updateError) throw updateError;

        return {
            data: {
                completed: completedWaypoint,
                current: newCurrentWaypoint,
            },
            error: null,
        };
    } catch (error) {
        console.error("Error advancing to next waypoint:", error);
        return { data: null, error: error as Error };
    }
}
