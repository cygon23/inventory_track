// src/features/driver/services/dashboard.service.ts

import { supabase } from "@/lib/supabase";
import type { ApiResponse } from "../types/dashboard.types";
import type { TripWithDetails } from "../types/trip.types";

// =====================================================
// GET DRIVER ID FROM USER ID
// =====================================================
export async function getDriverIdFromUserId(
    userId: string,
): Promise<string | null> {
    const { data, error } = await supabase
        .from("drivers")
        .select("id")
        .eq("user_id", userId)
        .single();

    if (error) {
        console.error("Error fetching driver ID:", error);
        return null;
    }

    return data?.id || null;
}

// =====================================================
// FETCH DASHBOARD STATS
// =====================================================

export async function fetchDashboardStats(driverId: string) {
    try {
        const today = new Date().toISOString().split("T")[0];
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - 7);
        const weekStartStr = weekStart.toISOString().split("T")[0];

        // 1️ Fetch today's trips
        const { data: todayTrips, error: todayError } = await supabase
            .from("trips")
            .select(`
        *,
        drivers!inner(user_id),
        booking:bookings!trips_booking_id_fkey(*)
      `)
            .eq("drivers.user_id", driverId)
            .gte("start_date", today)
            .lte("start_date", today);

        if (todayError) throw todayError;

        // 2️ Fetch this week's trips
        const { data: weekTrips, error: weekError } = await supabase
            .from("trips")
            .select(`
        *,
        drivers!inner(user_id),
        booking:bookings!trips_booking_id_fkey(*)
      `)
            .eq("drivers.user_id", driverId)
            .gte("start_date", weekStartStr)
            .lte("start_date", today);

        if (weekError) throw weekError;

        // 3️Fetch current (in-progress) trip
        const { data: currentTrip, error: currentError } = await supabase
            .from("trips")
            .select(`
        id,
        status,
        current_location,
        vehicle_id,
        drivers!inner(id, user_id),
        booking:bookings!trips_booking_id_fkey(
          id,
          customer_name,
          guest_count,
          duration_days,
          booking_reference,
          safari_package,
          special_requests,
          start_date,
          end_date
        )
      `)
            .eq("drivers.user_id", driverId)
            .eq("status", "in_progress")
            .maybeSingle();

        if (currentError) throw currentError;

        let vehicleWithStats = null;

        //  vehicle assigned to driver
        const { data: driverRecord } = await supabase
            .from("drivers")
            .select("id")
            .eq("user_id", driverId)
            .single();

        if (driverRecord?.id) {
            const { data: assignedVehicle, error: assignedError } =
                await supabase
                    .from("vehicle_dashboard")
                    .select("*")
                    .eq("driver_id", driverRecord.id)
                    .maybeSingle();

            if (assignedError && assignedError.code !== "PGRST116") {
                console.error(
                    "Error fetching assigned vehicle:",
                    assignedError,
                );
            }

            vehicleWithStats = assignedVehicle;
        }

        //  If no assigned vehicle, get vehicle from current trip
        if (!vehicleWithStats && currentTrip?.vehicle_id) {
            const { data: tripVehicle, error: tripVehicleError } =
                await supabase
                    .from("vehicle_dashboard")
                    .select("*")
                    .eq("id", currentTrip.vehicle_id)
                    .maybeSingle();

            if (tripVehicleError && tripVehicleError.code !== "PGRST116") {
                console.error("Error fetching trip vehicle:", tripVehicleError);
            }

            vehicleWithStats = tripVehicle;
        }

        //  get vehicle assigned to current trip
        if (!vehicleWithStats && currentTrip?.id) {
            const { data: tripAssignedVehicle, error: tripAssignedError } =
                await supabase
                    .from("vehicle_dashboard")
                    .select("*")
                    .eq("current_trip_id", currentTrip.id)
                    .maybeSingle();

            if (tripAssignedError && tripAssignedError.code !== "PGRST116") {
                console.error(
                    "Error fetching trip-assigned vehicle:",
                    tripAssignedError,
                );
            }

            vehicleWithStats = tripAssignedVehicle;
        }

        return {
            data: {
                todayTrips: todayTrips || [],
                weekTrips: weekTrips || [],
                currentTrip: currentTrip || null,
                vehicle: vehicleWithStats || null,
            },
            error: null,
        };
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        return { data: null, error: error as Error };
    }
}

// =====================================================
// FETCH UPCOMING TRIPS
// =====================================================
export async function fetchUpcomingTrips(
    driverId: string,
): Promise<ApiResponse<TripWithDetails[]>> {
    try {
        const today = new Date().toISOString().split("T")[0];

        const { data, error } = await supabase
            .from("trips")
            .select(`
        *,
        drivers!inner(user_id),
        booking:bookings!trips_booking_id_fkey(*),
        vehicle:vehicles!trips_vehicle_id_fkey(*)
      `)
            .eq("drivers.user_id", driverId)
            .gte("start_date", today)
            .in("status", ["scheduled"])
            .order("start_date", { ascending: true })
            .limit(5);

        if (error) throw error;

        return { data: data as TripWithDetails[], error: null };
    } catch (error) {
        console.error("Error fetching upcoming trips:", error);
        return { data: null, error: error as Error };
    }
}

// =====================================================
// FETCH VEHICLE INFO
// =====================================================
export async function fetchDriverVehicle(userId: string) {
    try {
        const { data, error } = await supabase
            .from("vehicles")
            .select(`
        *,
        drivers!inner(user_id)
      `)
            .eq("drivers.user_id", userId)
            .maybeSingle();

        if (error) throw error;

        return { data, error: null };
    } catch (error) {
        console.error("Error fetching vehicle:", error);
        return { data: null, error: error as Error };
    }
}
