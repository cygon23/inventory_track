import { useMemo } from "react";
import type { TripListItem, TripWithDetails } from "../types/trip.types";

// =====================================================
// TRANSFORM TRIP DATA FOR UI
// =====================================================

export function useTripHelpers() {
    const transformTripForUI = useMemo(
        () => (trip: TripWithDetails): TripListItem => {
            const startDate = new Date(trip.start_date);
            const endDate = new Date(trip.end_date);
            const today = new Date();

            // Calculate days
            const totalDays = Math.ceil(
                (endDate.getTime() - startDate.getTime()) /
                    (1000 * 60 * 60 * 24),
            ) + 1;
            const currentDay = Math.max(
                1,
                Math.min(
                    totalDays,
                    Math.ceil(
                        (today.getTime() - startDate.getTime()) /
                            (1000 * 60 * 60 * 24),
                    ) + 1,
                ),
            );

            // Get current and next waypoints
            const currentWaypoint = trip.waypoints.find(
                (w) => w.status === "current",
            );
            const nextWaypoint = trip.waypoints.find((w) =>
                w.status === "upcoming"
            );

            // Calculate distances
            const completedWaypoints = trip.waypoints.filter(
                (w) => w.status === "completed",
            );
            const completedDistance = completedWaypoints.reduce((sum, w) => {
                const dist = parseInt(w.distance_from_previous || "0");
                return sum + dist;
            }, 0);

            const totalDistance = trip.waypoints.reduce((sum, w) => {
                const dist = parseInt(w.distance_from_previous || "0");
                return sum + dist;
            }, 0);

            return {
                id: trip.id,
                bookingRef: trip.booking?.booking_reference || "N/A",
                customer: {
                    name: trip.customer_name,
                    phone: trip.booking?.customer_phone || "",
                    email: trip.booking?.customer_email || "",
                },
                package: trip.package_name,
                status: trip.status,
                startDate: trip.start_date,
                endDate: trip.end_date,
                currentDay,
                totalDays,
                guests: trip.guests,
                vehicle: trip.vehicle
                    ? `${trip.vehicle.model} - ${trip.vehicle.plate}`
                    : "Not assigned",
                currentLocation: currentWaypoint?.name ||
                    trip.current_location || "Unknown",
                nextDestination: nextWaypoint?.name || trip.next_stop ||
                    "Not set",
                estimatedArrival: nextWaypoint?.scheduled_time ||
                    trip.estimated_arrival || "N/A",
                totalDistance: `${totalDistance} km`,
                completedDistance: `${completedDistance} km`,
                notes: trip.notes || "",
            };
        },
        [],
    );

    const calculateProgress = useMemo(
        () => (trip: TripWithDetails): number => {
            const completed = trip.waypoints.filter(
                (w) => w.status === "completed",
            ).length;
            const total = trip.waypoints.length;

            if (total === 0) return 0;

            return Math.round((completed / total) * 100);
        },
        [],
    );

    return {
        transformTripForUI,
        calculateProgress,
    };
}
