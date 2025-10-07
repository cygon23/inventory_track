import { useQuery } from "@tanstack/react-query";
import { fetchDriverTrips } from "../api/trips.api";
import type { TripFilters } from "../types/trip.types";

// =====================================================
// FETCH DRIVER TRIPS HOOK
// =====================================================

export function useDriverTrips(driverId: string, filters?: TripFilters) {
    return useQuery({
        queryKey: ["driver-trips", driverId, filters],
        queryFn: async () => {
            const { data, error } = await fetchDriverTrips(driverId, filters);
            if (error) throw error;
            return data;
        },
        enabled: !!driverId,
        staleTime: 30000, // 30 seconds
        refetchInterval: 60000, // Refetch every minute for real-time updates
    });
}

// =====================================================
// GET CURRENT TRIP (in_progress)
// =====================================================

export function useCurrentTrip(driverId: string) {
    const { data: trips, ...rest } = useDriverTrips(driverId, {
        status: "in_progress",
    });

    return {
        ...rest,
        data: trips?.[0] || null,
    };
}
