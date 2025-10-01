import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Types matching your database
export interface TripItinerary {
    id: string;
    day_number: number;
    location: string;
    status: "pending" | "in_progress" | "completed";
}

export interface Trip {
    id: string;
    booking_id: string;
    customer_name: string;
    package_name: string;
    driver_id: string | null;
    vehicle_id: string | null;
    start_date: string;
    end_date: string;
    status: "scheduled" | "in_progress" | "completed" | "cancelled" | "delayed";
    progress: number;
    current_location: string | null;
    next_stop: string | null;
    estimated_arrival: string | null;
    guests: number;
    notes: string | null;
    // Joined fields
    booking_reference?: string;
    driver_name?: string;
    vehicle_model?: string;
    vehicle_plate?: string;
    itinerary: TripItinerary[];
}

export interface TripStats {
    active_trips: number;
    scheduled_trips: number;
    completed_today: number;
    issues_reported: number;
}

export const useTrips = () => {
    const [trips, setTrips] = useState<Trip[]>([]);
    const [stats, setStats] = useState<TripStats>({
        active_trips: 0,
        scheduled_trips: 0,
        completed_today: 0,
        issues_reported: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch all trips with related data
    const fetchTrips = async () => {
        try {
            setLoading(true);
            setError(null);

            const { data, error: fetchError } = await supabase
                .from("trips")
                .select(`
          *,
          bookings!inner(booking_reference),
          drivers(name),
          vehicles(model, plate_number),
          trip_itinerary(
            id,
            day_number,
            location,
            status
          )
        `)
                .order("start_date", { ascending: false });

            if (fetchError) throw fetchError;

            // Transform data to match component structure
            const transformedTrips: Trip[] = (data || []).map((trip: any) => ({
                id: trip.id,
                booking_id: trip.booking_id,
                customer_name: trip.customer_name,
                package_name: trip.package_name,
                driver_id: trip.driver_id,
                vehicle_id: trip.vehicle_id,
                start_date: trip.start_date,
                end_date: trip.end_date,
                status: trip.status,
                progress: trip.progress || 0,
                current_location: trip.current_location,
                next_stop: trip.next_stop,
                estimated_arrival: trip.estimated_arrival,
                guests: trip.guests,
                notes: trip.notes,
                booking_reference: trip.bookings?.booking_reference,
                driver_name: trip.drivers?.name,
                vehicle_model: trip.vehicles?.model,
                vehicle_plate: trip.vehicles?.plate_number,
                itinerary: (trip.trip_itinerary || []).sort(
                    (a: any, b: any) => a.day_number - b.day_number,
                ),
            }));

            setTrips(transformedTrips);
            calculateStats(transformedTrips);
        } catch (err: any) {
            console.error("Error fetching trips:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Calculate statistics from trips data
    const calculateStats = (tripsData: Trip[]) => {
        const today = new Date().toISOString().split("T")[0];

        const newStats = {
            active_trips:
                tripsData.filter((t) => t.status === "in_progress").length,
            scheduled_trips:
                tripsData.filter((t) => t.status === "scheduled").length,
            completed_today: tripsData.filter((t) => {
                if (t.status !== "completed") return false;
                const endDate =
                    new Date(t.end_date).toISOString().split("T")[0];
                return endDate === today;
            }).length,
            issues_reported:
                tripsData.filter((t) => t.status === "delayed").length,
        };

        setStats(newStats);
    };

    // Update trip progress
    const updateTripProgress = async (
        tripId: string,
        updates: {
            status?: string;
            progress?: number;
            current_location?: string;
            next_stop?: string;
            estimated_arrival?: string;
        },
    ) => {
        try {
            const { data, error } = await supabase
                .from("trips")
                .update({
                    ...updates,
                    updated_at: new Date().toISOString(),
                })
                .eq("id", tripId)
                .select()
                .single();

            if (error) throw error;

            // Refresh trips
            await fetchTrips();

            return data;
        } catch (err: any) {
            console.error("Error updating trip:", err);
            setError(err.message);
            throw err;
        }
    };

    // Assign driver and vehicle
    const assignDriverAndVehicle = async (
        tripId: string,
        driverId: string | null,
        vehicleId: string | null,
    ) => {
        try {
            const { data, error } = await supabase
                .from("trips")
                .update({
                    driver_id: driverId,
                    vehicle_id: vehicleId,
                    updated_at: new Date().toISOString(),
                })
                .eq("id", tripId)
                .select()
                .single();

            if (error) throw error;

            // Also update the booking
            const trip = trips.find((t) => t.id === tripId);
            if (trip?.booking_id) {
                await supabase
                    .from("bookings")
                    .update({
                        assigned_driver: driverId,
                        assigned_vehicle: vehicleId,
                    })
                    .eq("id", trip.booking_id);
            }

            // Refresh trips
            await fetchTrips();

            return data;
        } catch (err: any) {
            console.error("Error assigning resources:", err);
            setError(err.message);
            throw err;
        }
    };

    // Update itinerary item status
    const updateItineraryStatus = async (
        itineraryId: string,
        status: "pending" | "in_progress" | "completed",
    ) => {
        try {
            const { data, error } = await supabase
                .from("trip_itinerary")
                .update({ status })
                .eq("id", itineraryId)
                .select()
                .single();

            if (error) throw error;

            // Refresh trips
            await fetchTrips();

            return data;
        } catch (err: any) {
            console.error("Error updating itinerary:", err);
            setError(err.message);
            throw err;
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchTrips();
    }, []);

    return {
        trips,
        stats,
        loading,
        error,
        fetchTrips,
        updateTripProgress,
        assignDriverAndVehicle,
        updateItineraryStatus,
    };
};
