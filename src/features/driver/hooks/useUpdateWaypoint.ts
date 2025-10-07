import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    advanceToNextWaypoint,
    completeWaypoint,
    updateWaypointStatus,
} from "../api/waypoints.api";
import { updateTripLocation, updateTripProgress } from "../api/trips.api";
import type { WaypointStatus } from "../types/trip.types";
import { toast } from "sonner";

// =====================================================
// UPDATE WAYPOINT STATUS HOOK
// =====================================================

export function useUpdateWaypoint(driverId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            waypointId,
            status,
            actualArrivalTime,
        }: {
            waypointId: string;
            status: WaypointStatus;
            actualArrivalTime?: string;
        }) => {
            const { data, error } = await updateWaypointStatus(
                waypointId,
                status,
                actualArrivalTime,
            );

            if (error) throw error;

            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["driver-trips", driverId],
            });
            toast.success("Waypoint updated");
        },
        onError: (error: Error) => {
            console.error("Error updating waypoint:", error);
            toast.error("Failed to update waypoint");
        },
    });
}

// =====================================================
// COMPLETE CURRENT WAYPOINT HOOK
// =====================================================

export function useCompleteWaypoint(driverId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ waypointId }: { waypointId: string }) => {
            const { data, error } = await completeWaypoint(waypointId);
            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["driver-trips", driverId],
            });
            toast.success("Waypoint completed");
        },
        onError: (error: Error) => {
            console.error("Error completing waypoint:", error);
            toast.error("Failed to complete waypoint");
        },
    });
}

// =====================================================
// ADVANCE TO NEXT WAYPOINT HOOK
// =====================================================

export function useAdvanceToNextWaypoint(driverId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            tripId,
            nextWaypointName,
            progressPercentage,
        }: {
            tripId: string;
            nextWaypointName?: string;
            progressPercentage?: number;
        }) => {
            // 1. Advance waypoints
            const { data, error } = await advanceToNextWaypoint(tripId);
            if (error) throw error;

            // 2. Update trip location to new waypoint
            if (nextWaypointName) {
                await updateTripLocation(tripId, nextWaypointName);
            }

            // 3. Update progress if provided
            if (progressPercentage !== undefined) {
                await updateTripProgress(tripId, progressPercentage);
            }

            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["driver-trips", driverId],
            });
            toast.success("Moved to next destination");
        },
        onError: (error: Error) => {
            console.error("Error advancing waypoint:", error);
            toast.error("Failed to advance to next waypoint");
        },
    });
}
