import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTripChecklist } from "../api/checklists.api";
import { updateTripStatus } from "../api/trips.api";
import { updateWaypointStatus } from "../api/waypoints.api";
import type { StartTripFormData } from "../types/trip.types";
import { toast } from "sonner";

// =====================================================
// START TRIP HOOK
// =====================================================

export function useStartTrip(driverId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            tripId,
            firstWaypointId,
            formData,
        }: {
            tripId: string;
            firstWaypointId?: string;
            formData: StartTripFormData;
        }) => {
            // 1. Create pre-departure checklist
            const { data: checklist, error: checklistError } =
                await createTripChecklist(
                    tripId,
                    driverId,
                    "pre-departure",
                    formData,
                );

            if (checklistError) throw checklistError;

            // 2. Update trip status to in_progress
            const { error: statusError } = await updateTripStatus(
                tripId,
                "in_progress",
            );

            if (statusError) throw statusError;

            // 3. Mark first waypoint as current if provided
            if (firstWaypointId) {
                const { error: waypointError } = await updateWaypointStatus(
                    firstWaypointId,
                    "current",
                );
                if (waypointError) throw waypointError;
            }

            return checklist;
        },
        onSuccess: () => {
            // Invalidate trips to refresh the list
            queryClient.invalidateQueries({
                queryKey: ["driver-trips", driverId],
            });
            toast.success("Trip started successfully! Safe travels.");
        },
        onError: (error: Error) => {
            console.error("Error starting trip:", error);
            toast.error("Failed to start trip. Please try again.");
        },
    });
}
