export interface Trip {
    id: string;
    booking_id: string | null;
    customer_name: string;
    package_name: string;
    driver_id: string | null;
    vehicle_id: string | null;
    start_date: string;
    end_date: string;
    status: TripStatus;
    progress: number;
    current_location: string | null;
    next_stop: string | null;
    estimated_arrival: string | null;
    guests: number;
    notes: string | null;
    created_at: string;
    updated_at: string;
}

export interface Booking {
    id: string;
    booking_reference: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    safari_package: string;
    start_date: string;
    end_date: string;
    adults: number;
    children: number;
    special_requests: string[] | null;
    notes: string | null;
}

export interface Vehicle {
    id: string;
    model: string;
    year: number;
    plate: string;
    status: VehicleStatus;
    fuel_level: number;
    capacity: number;
}

export interface TripStatusUpdate {
    id: string;
    trip_id: string;
    driver_id: string;
    status: StatusUpdateType;
    location: string | null;
    fuel_level: number | null;
    notes: string | null;
    latitude: number | null;
    longitude: number | null;
    created_at: string;
}

export interface TripWaypoint {
    id: string;
    trip_id: string;
    name: string;
    sequence_order: number;
    status: WaypointStatus;
    scheduled_time: string | null;
    actual_arrival_time: string | null;
    distance_from_previous: string | null;
    latitude: number | null;
    longitude: number | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
}

export interface TripChecklist {
    id: string;
    trip_id: string;
    driver_id: string;
    checklist_type: ChecklistType;
    vehicle_inspected: boolean;
    fuel_checked: boolean;
    safety_equipment: boolean;
    guests_arrived: boolean;
    luggage_loaded: boolean;
    route_planned: boolean;
    completed_at: string | null;
    notes: string | null;
    created_at: string;
}

export interface TripCommunication {
    id: string;
    trip_id: string;
    driver_id: string;
    communication_type: CommunicationType;
    message: string | null;
    status: CommunicationStatus;
    created_at: string;
}

export type TripStatus =
    | "scheduled"
    | "in_progress"
    | "completed"
    | "cancelled"
    | "delayed";

export type VehicleStatus =
    | "available"
    | "on_trip"
    | "scheduled"
    | "maintenance"
    | "out_of_service";

export type StatusUpdateType =
    | "in-transit"
    | "arrived"
    | "game-drive"
    | "rest-stop"
    | "fuel-stop"
    | "issue"
    | "completed";

export type WaypointStatus =
    | "completed"
    | "current"
    | "upcoming"
    | "skipped";

export type ChecklistType =
    | "pre-departure"
    | "pre-navigation"
    | "daily-check";

export type CommunicationType =
    | "call"
    | "sms"
    | "email"
    | "whatsapp";

export type CommunicationStatus =
    | "sent"
    | "delivered"
    | "failed"
    | "read";

export interface TripWithDetails extends Trip {
    booking: Booking | null;
    vehicle: Vehicle | null;
    waypoints: TripWaypoint[];
    latest_status: TripStatusUpdate | null;
    status_updates: TripStatusUpdate[];
    checklist: TripChecklist | null;
}

export interface TripListItem {
    id: string;
    bookingRef: string;
    customer: {
        name: string;
        phone: string;
        email: string;
    };
    package: string;
    status: TripStatus;
    startDate: string;
    endDate: string;
    currentDay: number;
    totalDays: number;
    guests: number;
    vehicle: string;
    currentLocation: string;
    nextDestination: string;
    estimatedArrival: string;
    totalDistance: string;
    completedDistance: string;
    notes: string;
}

export interface UpdateStatusFormData {
    status: StatusUpdateType;
    location: string;
    fuel_level: number;
    notes: string;
    latitude?: number;
    longitude?: number;
}

export interface StartTripFormData {
    vehicle_inspected: boolean;
    fuel_checked: boolean;
    safety_equipment: boolean;
    guests_arrived: boolean;
    luggage_loaded: boolean;
    route_planned: boolean;
    notes?: string;
}

export interface StartNavigationFormData {
    vehicleChecked: boolean;
    fuelChecked: boolean;
    safetyChecked: boolean;
    routeChecked: boolean;
    customerContacted: boolean;
}

export interface CreateCommunicationData {
    trip_id: string;
    communication_type: CommunicationType;
    message?: string;
}

// =====================================================
// API RESPONSE TYPES
// =====================================================

export interface ApiResponse<T> {
    data: T | null;
    error: Error | null;
}

export interface PaginatedResponse<T> {
    data: T[];
    count: number;
    page: number;
    pageSize: number;
}

// =====================================================
// UTILITY TYPES
// =====================================================

export interface DateRange {
    start: string;
    end: string;
}

export interface LocationCoordinates {
    latitude: number;
    longitude: number;
}

export interface TripProgress {
    current_day: number;
    total_days: number;
    completed_distance: string;
    total_distance: string;
    percentage: number;
}

// =====================================================
// FILTER/QUERY TYPES
// =====================================================

export interface TripFilters {
    status?: TripStatus | "all";
    search?: string;
    dateRange?: DateRange;
    driver_id?: string;
}

export interface TripSortOptions {
    field: "start_date" | "status" | "customer_name";
    direction: "asc" | "desc";
}
