import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Types
export interface Driver {
    id: string;
    user_id: string;
    name: string;
    email: string;
    rating: number;
    experience: string;
    languages: string[];
    specialties: string[];
    total_trips: number;
    average_rating: number;
    on_time_percentage: number;
    next_available: string | null;
    status: "available" | "on_trip" | "on_leave";
    current_trip_id?: string;
    current_trip?: any;
    vehicle_id?: string;
    vehicle_plate?: string;
    days_until_available?: number;
}

export interface ActiveTrip {
    id: string;
    customer_name: string;
    driver_name: string | null;
    driver_id: string | null;
    vehicle_id: string | null;
    vehicle_plate: string | null;
    current_location: string;
    next_stop: string | null;
    estimated_arrival: string | null;
    progress: number;
    status: string;
    package_name: string;
}

export interface PendingTrip {
    id: string;
    booking_id: string;
    customer_name: string;
    package_name: string;
    start_date: string;
    guests: number;
    notes: string | null;
    booking_reference: string;
    priority: "urgent" | "high" | "medium" | "low";
}

export interface OperationsStats {
    active_trips: number;
    available_drivers: number;
    operational_vehicles: number;
    pending_assignments: number;
    total_vehicles: number;
}

export const useOperations = () => {
    const [activeTrips, setActiveTrips] = useState<ActiveTrip[]>([]);
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [pendingTrips, setPendingTrips] = useState<PendingTrip[]>([]);
    const [vehicles, setVehicles] = useState<any[]>([]);
    const [stats, setStats] = useState<OperationsStats>({
        active_trips: 0,
        available_drivers: 0,
        operational_vehicles: 0,
        pending_assignments: 0,
        total_vehicles: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch active trips (in_progress status)
    const fetchActiveTrips = async () => {
        const { data, error } = await supabase
            .from("trips")
            .select(`
        id,
        customer_name,
        package_name,
        driver_id,
        vehicle_id,
        current_location,
        next_stop,
        estimated_arrival,
        progress,
        status,
        drivers!trips_driver_id_fkey(
          id,
          user_id,
          users(name)
        ),
        vehicles(plate)
      `)
            .eq("status", "in_progress")
            .order("created_at", { ascending: false });

        if (error) throw error;

        return (data || []).map((trip: any) => ({
            id: trip.id,
            customer_name: trip.customer_name,
            package_name: trip.package_name,
            driver_name: trip.drivers?.users?.name || null,
            driver_id: trip.driver_id,
            vehicle_id: trip.vehicle_id,
            vehicle_plate: trip.vehicles?.plate || null,
            current_location: trip.current_location || "In transit",
            next_stop: trip.next_stop,
            estimated_arrival: trip.estimated_arrival,
            progress: trip.progress || 0,
            status: trip.status,
        }));
    };

    // Fetch drivers with their status
    const fetchDrivers = async () => {
        const { data, error } = await supabase
            .from("drivers")
            .select(`
        id,
        user_id,
        rating,
        experience,
        languages,
        specialties,
        total_trips,
        average_rating,
        on_time_percentage,
        next_available,
        users(name, email),
        trips!trips_driver_id_fkey(
          id,
          status,
          start_date,
          end_date,
          current_location,
          vehicles(plate)
        )
      `);

        if (error) throw error;

        return (data || []).map((driver: any) => {
            const currentTrip = driver.trips?.find((t: any) =>
                t.status === "in_progress"
            );
            const isOnTrip = !!currentTrip;

            let daysUntilAvailable = 0;
            if (currentTrip?.end_date) {
                const endDate = new Date(currentTrip.end_date);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                endDate.setHours(0, 0, 0, 0);
                daysUntilAvailable = Math.max(
                    0,
                    Math.ceil(
                        (endDate.getTime() - today.getTime()) /
                            (1000 * 60 * 60 * 24),
                    ),
                );
            }

            return {
                id: driver.id,
                user_id: driver.user_id,
                name: driver.users?.name || "Unknown Driver",
                email: driver.users?.email || "",
                rating: driver.rating || 0,
                experience: driver.experience || "N/A",
                languages: driver.languages || [],
                specialties: driver.specialties || [],
                total_trips: driver.total_trips || 0,
                average_rating: driver.average_rating || 0,
                on_time_percentage: driver.on_time_percentage || 0,
                next_available: driver.next_available,
                status: isOnTrip ? "on_trip" : "available",
                current_trip_id: currentTrip?.id,
                current_trip: currentTrip,
                vehicle_plate: currentTrip?.vehicles?.plate,
                days_until_available: daysUntilAvailable,
            } as Driver;
        });
    };

    // Fetch pending trips (scheduled but no driver/vehicle assigned)
    const fetchPendingTrips = async () => {
        const { data, error } = await supabase
            .from("trips")
            .select(`
        id,
        booking_id,
        customer_name,
        package_name,
        start_date,
        guests,
        notes,
        bookings!inner(booking_reference)
      `)
            .eq("status", "scheduled")
            .is("driver_id", null)
            .order("start_date", { ascending: true });

        if (error) throw error;

        // Calculate priority based on start date
        const now = new Date();
        return (data || []).map((trip: any) => {
            const startDate = new Date(trip.start_date);
            const daysUntilStart = Math.ceil(
                (startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
            );

            let priority: "urgent" | "high" | "medium" | "low";
            if (daysUntilStart <= 1) priority = "urgent";
            else if (daysUntilStart <= 3) priority = "high";
            else if (daysUntilStart <= 7) priority = "medium";
            else priority = "low";

            return {
                id: trip.id,
                booking_id: trip.booking_id,
                customer_name: trip.customer_name,
                package_name: trip.package_name,
                start_date: trip.start_date,
                guests: trip.guests,
                notes: trip.notes,
                booking_reference: trip.bookings?.booking_reference ||
                    `BK-${trip.id.slice(0, 8)}`,
                priority,
            };
        });
    };

    // Fetch available vehicles
    const fetchVehicles = async () => {
        const { data, error } = await supabase
            .from("vehicles")
            .select("*")
            .eq("status", "available")
            .order("model", { ascending: true });

        if (error) throw error;
        return data || [];
    };

    // Add this new function to get total vehicle count
    const fetchTotalVehicles = async () => {
        const { count, error } = await supabase
            .from("vehicles")
            .select("*", { count: "exact", head: true });

        if (error) throw error;
        return count || 0;
    };

    // Fetch all data
    const fetchAllData = async () => {
        try {
            setLoading(true);
            setError(null);

            const [
                activeTripsData,
                driversData,
                pendingTripsData,
                vehiclesData,
                totalVehicles,
            ] = await Promise.all([
                fetchActiveTrips(),
                fetchDrivers(),
                fetchPendingTrips(),
                fetchVehicles(),
                fetchTotalVehicles(),
            ]);

            setActiveTrips(activeTripsData);
            setDrivers(driversData);
            setPendingTrips(pendingTripsData);
            setVehicles(vehiclesData);

            // Calculate stats
            const availableDrivers = driversData.filter((d) =>
                d.status === "available"
            ).length;
            setStats({
                active_trips: activeTripsData.length,
                available_drivers: availableDrivers,
                operational_vehicles: vehiclesData.length,
                pending_assignments: pendingTripsData.length,
                total_vehicles: totalVehicles,
            });
        } catch (err: any) {
            console.error("Error fetching operations data:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Assign driver and vehicle to trip
    const assignTripResources = async (
        tripId: string,
        driverId: string,
        vehicleId: string,
    ) => {
        try {
            // Update trip
            const { error: tripError } = await supabase
                .from("trips")
                .update({
                    driver_id: driverId,
                    vehicle_id: vehicleId,
                    status: "in_progress",
                    updated_at: new Date().toISOString(),
                })
                .eq("id", tripId);

            if (tripError) throw tripError;

            // Update vehicle status
            const { error: vehicleError } = await supabase
                .from("vehicles")
                .update({ status: "on_trip" })
                .eq("id", vehicleId);

            if (vehicleError) throw vehicleError;

            // Update booking assignment - fetch trip's booking_id first
            const { data: tripData } = await supabase
                .from("trips")
                .select("booking_id")
                .eq("id", tripId)
                .single();

            if (tripData?.booking_id) {
                // Get the driver's user_id first
                const { data: driverData } = await supabase
                    .from("drivers")
                    .select("user_id")
                    .eq("id", driverId)
                    .single();

                if (driverData?.user_id) {
                    const { error: bookingError } = await supabase
                        .from("bookings")
                        .update({
                            assigned_driver: driverData.user_id,
                            assigned_vehicle: vehicleId,
                        })
                        .eq("id", tripData.booking_id);

                    if (bookingError) {
                        console.warn("Booking update failed:", bookingError);
                    }
                }
            }

            // Refresh data
            await fetchAllData();

            // Post-notifications (admin + driver)
            try {
                // notify admin/helper/coordinator roles via RPC insert into notifications
                // We cannot import app services here; use direct inserts
                const { data: driverUser } = await supabase
                  .from('drivers')
                  .select('user_id')
                  .eq('id', driverId)
                  .single();

                const targetsRes = await supabase
                  .from('users')
                  .select('id, role')
                  .in('role', ['admin', 'admin_helper', 'operations_coordinator']);

                const targetIds = (targetsRes.data || []).map(u => u.id);
                const payloads = [
                  ...targetIds.map(id => ({
                    target_user_id: id,
                    title: 'Trip assigned',
                    message: `Trip ${tripId} assigned to driver`,
                    type: 'info',
                    event: 'trip.assigned',
                    metadata: { trip_id: tripId, driver_id: driverId, vehicle_id: vehicleId },
                  })),
                  ...(driverUser?.user_id ? [{
                    target_user_id: driverUser.user_id,
                    title: 'New trip assigned',
                    message: 'You have been assigned a new trip',
                    type: 'success',
                    event: 'trip.assigned.to_driver',
                    metadata: { trip_id: tripId, vehicle_id: vehicleId },
                  }] : []),
                ];

                if (payloads.length > 0) {
                  await supabase.from('notifications').insert(payloads);
                }
            } catch (e) {
                console.warn('Failed to send assignment notifications', e);
            }

            return { success: true };
        } catch (err: any) {
            console.error("Error assigning resources:", err);
            throw err;
        }
    };

    // Update driver schedule
    const updateDriverSchedule = async (
        driverId: string,
        dayOfWeek: number,
        available: boolean,
        tripId?: string,
    ) => {
        try {
            // Check if schedule entry exists
            const { data: existing } = await supabase
                .from("driver_schedule")
                .select("id")
                .eq("driver_id", driverId)
                .eq("day_of_week", dayOfWeek)
                .single();

            if (existing) {
                // Update existing
                const { error } = await supabase
                    .from("driver_schedule")
                    .update({
                        available,
                        trip_id: tripId || null,
                    })
                    .eq("id", existing.id);

                if (error) throw error;
            } else {
                // Insert new
                const { error } = await supabase
                    .from("driver_schedule")
                    .insert({
                        driver_id: driverId,
                        day_of_week: dayOfWeek,
                        available,
                        trip_id: tripId || null,
                    });

                if (error) throw error;
            }

            await fetchAllData();
            return { success: true };
        } catch (err: any) {
            console.error("Error updating driver schedule:", err);
            throw err;
        }
    };

    // Update trip status
    const updateTripStatus = async (
        tripId: string,
        status: string,
        progress?: number,
        currentLocation?: string,
    ) => {
        try {
            const updates: any = {
                status,
                updated_at: new Date().toISOString(),
            };

            if (progress !== undefined) updates.progress = progress;
            if (currentLocation) updates.current_location = currentLocation;

            const { error } = await supabase
                .from("trips")
                .update(updates)
                .eq("id", tripId);

            if (error) throw error;

            await fetchAllData();
            return { success: true };
        } catch (err: any) {
            console.error("Error updating trip status:", err);
            throw err;
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchAllData();
    }, []);

    return {
        activeTrips,
        drivers,
        pendingTrips,
        vehicles,
        stats,
        loading,
        error,
        fetchAllData,
        assignTripResources,
        updateDriverSchedule,
        updateTripStatus,
    };
};
