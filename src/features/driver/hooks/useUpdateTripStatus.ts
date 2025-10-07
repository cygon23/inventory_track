import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createStatusUpdate } from "../api/status-updates.api";
import { updateTripLocation, updateTripStatus } from "../api/trips.api";
import type { UpdateStatusFormData } from "../types/trip.types";
import { toast } from "sonner";

// =====================================================
// UPDATE TRIP STATUS HOOK
// =====================================================

export function useUpdateTripStatus(driverId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            tripId,
            formData,
        }: {
            tripId: string;
            formData: UpdateStatusFormData;
        }) => {
            // 1. Create status update record
            const { data: statusUpdate, error: statusError } =
                await createStatusUpdate(tripId, driverId, formData);

            if (statusError) throw statusError;

            // 2. Update trip location if provided
            if (formData.location) {
                const { error: locationError } = await updateTripLocation(
                    tripId,
                    formData.location,
                );
                if (locationError) throw locationError;
            }

            // 3. Update trip status if completed
            if (formData.status === "completed") {
                const { error: tripStatusError } = await updateTripStatus(
                    tripId,
                    "completed",
                );
                if (tripStatusError) throw tripStatusError;
            }

            return statusUpdate;
        },
        onSuccess: () => {
            // Invalidate and refetch trips
            queryClient.invalidateQueries({
                queryKey: ["driver-trips", driverId],
            });
            toast.success("Trip status updated successfully");
        },
        onError: (error: Error) => {
            console.error("Error updating trip status:", error);
            toast.error("Failed to update trip status");
        },
    });
}
