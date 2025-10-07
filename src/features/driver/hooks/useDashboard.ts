import { useQuery } from "@tanstack/react-query";
import {
    fetchDashboardStats,
    fetchDriverVehicle,
    fetchUpcomingTrips,
} from "../../driver/api/dashboard.service";

// =====================================================
// DASHBOARD STATS HOOK
// =====================================================
export function useDashboardStats(userId: string) {
    return useQuery({
        queryKey: ["dashboardStats", userId],
        queryFn: async () => {
            const result = await fetchDashboardStats(userId);
            if (result.error) throw result.error;
            return result.data;
        },
        refetchInterval: 60000, // Refetch every minute
        staleTime: 30000, // Data is fresh for 30 seconds
    });
}

// =====================================================
// UPCOMING TRIPS HOOK
// =====================================================
export function useUpcomingTrips(userId: string) {
    return useQuery({
        queryKey: ["upcomingTrips", userId],
        queryFn: async () => {
            const result = await fetchUpcomingTrips(userId);
            if (result.error) throw result.error;
            return result.data;
        },
        refetchInterval: 120000, // Refetch every 2 minutes
    });
}

// =====================================================
// DRIVER VEHICLE HOOK
// =====================================================
export function useDriverVehicle(userId: string) {
    return useQuery({
        queryKey: ["driverVehicle", userId],
        queryFn: async () => {
            const result = await fetchDriverVehicle(userId);
            if (result.error) throw result.error;
            return result.data;
        },
        refetchInterval: 300000, // Refetch every 5 minutes
    });
}
