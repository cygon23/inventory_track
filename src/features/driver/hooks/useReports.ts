import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    createTripReport,
    deleteTripReport,
    fetchMonthlyStats,
    fetchTripReports,
    updateTripReport,
} from "../../driver/api/reports.service";
import type {
    CreateTripReportData,
    TripReportFilters,
} from "../types/dashboard.types";
import { fetchDriverTrips } from "../../driver/api/trips.api"; 
import { supabase } from "@/lib/supabase";

// =====================================================
// FETCH TRIP REPORTS HOOK
// =====================================================
export function useTripReports(driverId: string, filters?: TripReportFilters) {
    return useQuery({
        queryKey: ["tripReports", driverId, filters],
        queryFn: async () => {
            const result = await fetchTripReports(driverId, filters);
            if (result.error) throw result.error;
            return result.data;
        },
        staleTime: 60000, // 1 minute
    });
}

// =====================================================
// FETCH MONTHLY STATS HOOK
// =====================================================
export function useMonthlyStats(driverId: string) {
    return useQuery({
        queryKey: ["monthlyStats", driverId],
        queryFn: async () => {
            const result = await fetchMonthlyStats(driverId);
            if (result.error) throw result.error;
            return result.data;
        },
        staleTime: 300000, // 5 minutes
    });
}

// =====================================================
// CREATE TRIP REPORT HOOK
// =====================================================
export function useDriverTripsForReports(driverId: string) {
  return useQuery({
    queryKey: ["driverTripsForReports", driverId],
    queryFn: async () => {
      const result = await fetchDriverTrips(driverId); 
      if (result.error) throw result.error;
      return result.data;
    },
    staleTime: 60000,
  });
}



export function useCreateTripReport() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            driverId,
            reportData,
        }: {
            driverId: string; // This is user_id from auth
            reportData: CreateTripReportData;
        }) => {
            // STEP 1: Get driver's record ID from drivers table
            const { data: driver, error: driverError } = await supabase
                .from("drivers")
                .select("id")
                .eq("user_id", driverId)
                .single();

            if (driverError || !driver) {
                throw new Error("Driver record not found in database");
            }

            // STEP 2: Create report with the driver's table ID
            const result = await createTripReport(driver.id, reportData);
            if (result.error) throw result.error;
            return result.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["tripReports", variables.driverId],
            });
            queryClient.invalidateQueries({
                queryKey: ["monthlyStats", variables.driverId],
            });
        },
    });
}

// =====================================================
// UPDATE TRIP REPORT HOOK
// =====================================================
export function useUpdateTripReport() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            reportId,
            updates,
        }: {
            reportId: string;
            updates: Partial<CreateTripReportData>;
        }) => {
            const result = await updateTripReport(reportId, updates);
            if (result.error) throw result.error;
            return result.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tripReports"] });
            queryClient.invalidateQueries({ queryKey: ["monthlyStats"] });
        },
    });
}

// =====================================================
// DELETE TRIP REPORT HOOK
// =====================================================
export function useDeleteTripReport() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (reportId: string) => {
            const result = await deleteTripReport(reportId);
            if (result.error) throw result.error;
            return result.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tripReports"] });
            queryClient.invalidateQueries({ queryKey: ["monthlyStats"] });
        },
    });
}
