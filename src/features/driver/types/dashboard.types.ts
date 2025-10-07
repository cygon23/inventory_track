export interface DashboardStats {
    todaysTrips: {
        count: number;
        nextPickup: string | null;
    };
    weeklyTrips: {
        total: number;
        completed: number;
    };
    currentGuests: {
        count: number;
        familyName: string | null;
    };
    vehicleStatus: {
        condition: string;
        lastService: string;
    };
}

export interface CurrentTrip {
    id: string;
    bookingRef: string;
    customers: string;
    package: string;
    status: string;
    day: string;
    nextStop: string;
    estimatedTime: string;
    notes: string;
}

export interface UpcomingTrip {
    id: string;
    customer: string;
    package: string;
    date: string;
    time: string;
    pickup: string;
    guests: number;
    priority: "urgent" | "high" | "medium" | "low";
}

export interface VehicleInfo {
    model: string;
    plate: string;
    fuelLevel: number;
    mileage: string;
    lastService: string;
    nextService: string;
    condition: string;
    issues: string[];
}

// =====================================================
// TRIP REPORTS TYPES
// =====================================================

export interface TripReport {
    id: string;
    trip_id: string;
    driver_id: string;
    booking_ref: string;
    customer_name: string;
    package_name: string;
    completion_date: string;
    duration_days: number;
    total_distance: number;
    fuel_used: number;
    customer_rating: number | null;
    vehicle_condition: "excellent" | "good" | "fair" | "poor";
    issues: string[];
    highlights: string[];
    notes: string | null;
    expenses: TripExpenses;
    created_at: string;
    updated_at: string;
}

export interface TripExpenses {
    fuel: number;
    meals: number;
    accommodation: number;
    miscellaneous: number;
}

export interface MonthlyStats {
    totalTrips: number;
    totalDistance: string;
    totalFuel: string;
    averageRating: number;
    totalRevenue: string;
    onTimePerformance: string;
}

export interface CreateTripReportData {
    trip_id: string;
    booking_ref: string;
    completion_date: string;
    duration_days: number;
    total_distance: number;
    fuel_used: number;
    customer_rating?: number;
    vehicle_condition: "excellent" | "good" | "fair" | "poor";
    issues?: string[];
    highlights?: string[];
    notes?: string;
    expenses: TripExpenses;
}

export interface TripReportFilters {
    search?: string;
    dateFilter?: "all" | "this-month" | "last-month" | "this-year";
    startDate?: string;
    endDate?: string;
}

export interface DriverStatistics {
    id: string;
    driver_id: string;
    period: "daily" | "weekly" | "monthly" | "yearly";
    period_start: string;
    period_end: string;
    total_trips: number;
    completed_trips: number;
    total_distance: number;
    total_fuel: number;
    average_rating: number;
    on_time_percentage: number;
    created_at: string;
    updated_at: string;
}

export interface ApiResponse<T> {
    data: T | null;
    error: Error | null;
}
