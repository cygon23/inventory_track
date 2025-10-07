import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    createCommunication,
    fetchTripCommunications,
} from "../api/communications.api";
import type { CreateCommunicationData } from "../types/trip.types";
import { toast } from "sonner";

// =====================================================
// FETCH TRIP COMMUNICATIONS HOOK
// =====================================================

export function useTripCommunications(tripId: string) {
    return useQuery({
        queryKey: ["trip-communications", tripId],
        queryFn: async () => {
            const { data, error } = await fetchTripCommunications(tripId);
            if (error) throw error;
            return data;
        },
        enabled: !!tripId,
    });
}

// =====================================================
// CREATE COMMUNICATION HOOK
// =====================================================

export function useCreateCommunication(driverId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CreateCommunicationData) => {
            const { data: communication, error } = await createCommunication(
                driverId,
                data,
            );
            if (error) throw error;
            return communication;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["trip-communications", variables.trip_id],
            });

            const typeMessages = {
                call: "Call logged successfully",
                sms: "SMS sent successfully",
                email: "Email sent successfully",
                whatsapp: "WhatsApp message sent",
            };

            toast.success(
                typeMessages[variables.communication_type] ||
                    "Communication logged",
            );
        },
        onError: (error: Error) => {
            console.error("Error creating communication:", error);
            toast.error("Failed to log communication");
        },
    });
}
