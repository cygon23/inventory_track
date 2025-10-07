import { supabase } from "@/lib/supabase";
import type {
    ApiResponse,
    CreateTripReportData,
    MonthlyStats,
    TripReport,
    TripReportFilters,
} from "../types/dashboard.types";

// =====================================================
// FETCH TRIP REPORTS
// =====================================================
export async function fetchTripReports(
    driverId: string,
    filters?: TripReportFilters,
): Promise<ApiResponse<TripReport[]>> {
    try {
        let query = supabase
            .from("trip_reports")
            .select(`
        *,
        trip:trips!trip_reports_trip_id_fkey(
          customer_name,
          package_name
        )
      `)
            .eq("driver_id", driverId)
            .order("completion_date", { ascending: false });

        // Apply date filters
        if (filters?.dateFilter && filters.dateFilter !== "all") {
            const today = new Date();
            let startDate: Date;

            switch (filters.dateFilter) {
                case "this-month":
                    startDate = new Date(
                        today.getFullYear(),
                        today.getMonth(),
                        1,
                    );
                    break;
                case "last-month":
                    startDate = new Date(
                        today.getFullYear(),
                        today.getMonth() - 1,
                        1,
                    );
                    const endDate = new Date(
                        today.getFullYear(),
                        today.getMonth(),
                        0,
                    );
                    query = query
                        .gte(
                            "completion_date",
                            startDate.toISOString().split("T")[0],
                        )
                        .lte(
                            "completion_date",
                            endDate.toISOString().split("T")[0],
                        );
                    break;
                case "this-year":
                    startDate = new Date(today.getFullYear(), 0, 1);
                    query = query.gte(
                        "completion_date",
                        startDate.toISOString().split("T")[0],
                    );
                    break;
            }
        }

        // Apply search filter
        if (filters?.search) {
            query = query.or(
                `booking_ref.ilike.%${filters.search}%,trip.customer_name.ilike.%${filters.search}%,trip.package_name.ilike.%${filters.search}%`,
            );
        }

        const { data, error } = await query;

        if (error) throw error;

        // Transform data to include customer_name and package_name at root level
        const reports: TripReport[] = (data || []).map((report: any) => ({
            ...report,
            customer_name: report.trip?.customer_name || "Unknown",
            package_name: report.trip?.package_name || "Unknown",
        }));

        return { data: reports, error: null };
    } catch (error) {
        console.error("Error fetching trip reports:", error);
        return { data: null, error: error as Error };
    }
}

// =====================================================
// CREATE TRIP REPORT
// =====================================================
export async function createTripReport(
    driverId: string,
    reportData: CreateTripReportData,
): Promise<ApiResponse<TripReport>> {
    try {
        const { data, error } = await supabase
            .from("trip_reports")
            .insert({
                driver_id: driverId,
                ...reportData,
            })
            .select()
            .single();

        if (error) throw error;

        return { data: data as TripReport, error: null };
    } catch (error) {
        console.error("Error creating trip report:", error);
        return { data: null, error: error as Error };
    }
}

// =====================================================
// FETCH MONTHLY STATISTICS
// =====================================================
export async function fetchMonthlyStats(
    driverId: string,
): Promise<ApiResponse<MonthlyStats>> {
    try {
        const today = new Date();
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        // Get monthly reports
        const { data: reports, error: reportsError } = await supabase
            .from("trip_reports")
            .select("*")
            .eq("driver_id", driverId)
            .gte("completion_date", firstDay.toISOString().split("T")[0])
            .lte("completion_date", lastDay.toISOString().split("T")[0]);

        if (reportsError) throw reportsError;

        // Calculate statistics
        const totalTrips = reports?.length || 0;
        const totalDistance = reports?.reduce((sum, r) =>
            sum + Number(r.total_distance), 0) || 0;
        const totalFuel = reports?.reduce((sum, r) =>
            sum + Number(r.fuel_used), 0) || 0;
        const ratingsSum = reports?.reduce((sum, r) =>
            sum + (r.customer_rating || 0), 0) || 0;
        const ratingsCount = reports?.filter((r) =>
            r.customer_rating !== null
        ).length || 0;
        const averageRating = ratingsCount > 0 ? ratingsSum / ratingsCount : 0;

        // Get on-time performance from driver stats
        const { data: driver, error: driverError } = await supabase
            .from("drivers")
            .select("on_time_percentage")
            .eq("id", driverId)
            .maybeSingle();

        if (driverError) throw driverError;

        const stats: MonthlyStats = {
            totalTrips,
            totalDistance: `${totalDistance.toFixed(0)} km`,
            totalFuel: `${totalFuel.toFixed(0)} liters`,
            averageRating: Number(averageRating.toFixed(1)),
            totalRevenue: "$0", // Calculate based on your business logic
            onTimePerformance: `${driver?.on_time_percentage || 0}%`,
        };

        return { data: stats, error: null };
    } catch (error) {
        console.error("Error fetching monthly stats:", error);
        return { data: null, error: error as Error };
    }
}

// =====================================================
// UPDATE TRIP REPORT
// =====================================================
export async function updateTripReport(
    reportId: string,
    updates: Partial<CreateTripReportData>,
): Promise<ApiResponse<TripReport>> {
    try {
        const { data, error } = await supabase
            .from("trip_reports")
            .update(updates)
            .eq("id", reportId)
            .select()
            .maybeSingle();

        if (error) throw error;

        return { data: data as TripReport, error: null };
    } catch (error) {
        console.error("Error updating trip report:", error);
        return { data: null, error: error as Error };
    }
}

// =====================================================
// DELETE TRIP REPORT
// =====================================================
export async function deleteTripReport(
    reportId: string,
): Promise<ApiResponse<void>> {
    try {
        const { error } = await supabase
            .from("trip_reports")
            .delete()
            .eq("id", reportId);

        if (error) throw error;

        return { data: null, error: null };
    } catch (error) {
        console.error("Error deleting trip report:", error);
        return { data: null, error: error as Error };
    }
}
