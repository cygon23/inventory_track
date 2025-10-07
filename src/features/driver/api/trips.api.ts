import { supabase } from "@/lib/supabase";
import type {
    ApiResponse,
    Trip,
    TripFilters,
    TripWithDetails,
} from "../types/trip.types";

// =====================================================
// FETCH DRIVER'S TRIPS
// =====================================================

export async function fetchDriverTrips(
    driverId: string,
    filters?: TripFilters,
): Promise<ApiResponse<TripWithDetails[]>> {
    try {
        let query = supabase
            .from("trips")
            .select(`
        *,
        drivers!inner(user_id),
        booking:bookings!trips_booking_id_fkey (
          id,
          booking_reference,
          customer_name,
          customer_email,
          customer_phone,
          safari_package,
          start_date,
          end_date,
          adults,
          children,
          special_requests,
          notes
        ),
        vehicle:vehicles!trips_vehicle_id_fkey (
          id,
          model,
          year,
          plate,
          status,
          fuel_level,
          capacity
        ),
        waypoints:trip_waypoints (
          id,
          name,
          sequence_order,
          status,
          scheduled_time,
          actual_arrival_time,
          distance_from_previous,
          created_at,
          updated_at
        ),
        status_updates:trip_status_updates (
          id,
          status,
          location,
          fuel_level,
          notes,
          created_at
        ),
        checklist:trip_checklists (
          id,
          checklist_type,
          vehicle_inspected,
          fuel_checked,
          safety_equipment,
          guests_arrived,
          luggage_loaded,
          route_planned,
          completed_at,
          notes
        )
      `)
            .eq("drivers.user_id", driverId) // ✅ FIXED: Query via drivers.user_id instead of driver_id
            .order("start_date", { ascending: false });

        // Apply filters
        if (filters?.status && filters.status !== "all") {
            query = query.eq("status", filters.status);
        }

        if (filters?.search) {
            query = query.or(
                `customer_name.ilike.%${filters.search}%,package_name.ilike.%${filters.search}%`,
            );
        }

        const { data, error } = await query;

        if (error) throw error;

        // Sort waypoints by sequence
        const tripsWithSortedWaypoints = data?.map((trip) => ({
            ...trip,
            waypoints: trip.waypoints?.sort(
                (a, b) => a.sequence_order - b.sequence_order,
            ) || [],
            status_updates: trip.status_updates?.sort(
                (a, b) =>
                    new Date(b.created_at).getTime() -
                    new Date(a.created_at).getTime(),
            ) || [],
            latest_status: trip.status_updates?.[0] || null,
        })) as TripWithDetails[];

        return { data: tripsWithSortedWaypoints, error: null };
    } catch (error) {
        console.error("Error fetching driver trips:", error);
        return { data: null, error: error as Error };
    }
}

// =====================================================
// FETCH SINGLE TRIP BY ID
// =====================================================

export async function fetchTripById(
    tripId: string,
): Promise<ApiResponse<TripWithDetails>> {
    try {
        const { data, error } = await supabase
            .from("trips")
            .select(`
        *,
        booking:bookings!trips_booking_id_fkey (
          id,
          booking_reference,
          customer_name,
          customer_email,
          customer_phone,
          safari_package,
          start_date,
          end_date,
          adults,
          children,
          special_requests,
          notes
        ),
        vehicle:vehicles!trips_vehicle_id_fkey (
          id,
          model,
          year,
          plate,
          status,
          fuel_level,
          capacity
        ),
        waypoints:trip_waypoints (
          id,
          name,
          sequence_order,
          status,
          scheduled_time,
          actual_arrival_time,
          distance_from_previous,
          created_at,
          updated_at
        ),
        status_updates:trip_status_updates (
          id,
          status,
          location,
          fuel_level,
          notes,
          created_at
        ),
        checklist:trip_checklists (
          id,
          checklist_type,
          vehicle_inspected,
          fuel_checked,
          safety_equipment,
          guests_arrived,
          luggage_loaded,
          route_planned,
          completed_at,
          notes
        )
      `)
            .eq("id", tripId)
            .single();

        if (error) throw error;

        const tripWithDetails: TripWithDetails = {
            ...data,
            waypoints: data.waypoints?.sort(
                (a, b) => a.sequence_order - b.sequence_order,
            ) || [],
            status_updates: data.status_updates?.sort(
                (a, b) =>
                    new Date(b.created_at).getTime() -
                    new Date(a.created_at).getTime(),
            ) || [],
            latest_status: data.status_updates?.[0] || null,
        };

        return { data: tripWithDetails, error: null };
    } catch (error) {
        console.error("Error fetching trip:", error);
        return { data: null, error: error as Error };
    }
}

// =====================================================
// UPDATE TRIP STATUS
// =====================================================

export async function updateTripStatus(
    tripId: string,
    status: Trip["status"],
): Promise<ApiResponse<Trip>> {
    try {
        const { data, error } = await supabase
            .from("trips")
            .update({ status })
            .eq("id", tripId)
            .select()
            .single();

        if (error) throw error;

        return { data, error: null };
    } catch (error) {
        console.error("Error updating trip status:", error);
        return { data: null, error: error as Error };
    }
}

// =====================================================
// UPDATE TRIP LOCATION
// =====================================================

export async function updateTripLocation(
    tripId: string,
    location: string,
    nextStop?: string,
): Promise<ApiResponse<Trip>> {
    try {
        const updateData: Partial<Trip> = {
            current_location: location,
        };

        if (nextStop) {
            updateData.next_stop = nextStop;
        }

        const { data, error } = await supabase
            .from("trips")
            .update(updateData)
            .eq("id", tripId)
            .select()
            .single();

        if (error) throw error;

        return { data, error: null };
    } catch (error) {
        console.error("Error updating trip location:", error);
        return { data: null, error: error as Error };
    }
}

// =====================================================
// UPDATE TRIP PROGRESS
// =====================================================

export async function updateTripProgress(
    tripId: string,
    progress: number,
): Promise<ApiResponse<Trip>> {
    try {
        const { data, error } = await supabase
            .from("trips")
            .update({ progress })
            .eq("id", tripId)
            .select()
            .single();

        if (error) throw error;

        return { data, error: null };
    } catch (error) {
        console.error("Error updating trip progress:", error);
        return { data: null, error: error as Error };
    }
}
