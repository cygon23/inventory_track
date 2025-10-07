import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTripChecklist } from "../api/checklists.api";
import type { StartNavigationFormData } from "../types/trip.types";
import { toast } from "sonner";

// =====================================================
// START NAVIGATION HOOK
// =====================================================

export function useStartNavigation(driverId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      tripId,
      formData,
    }: {
      tripId: string;
      formData: StartNavigationFormData;
    }) => {
      // Convert formData to checklist format
      const checklistData = {
        vehicle_inspected: formData.vehicleChecked,
        fuel_checked: formData.fuelChecked,
        safety_equipment: formData.safetyChecked,
        guests_arrived: true, // Navigation assumes guests are already present
        luggage_loaded: true,
        route_planned: formData.routeChecked,
      };

      // Create pre-navigation checklist
      const { data, error } = await createTripChecklist(
        tripId,
        driverId,
        "pre-navigation",
        checklistData,
      );

      if (error) throw error;

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["driver-trips", driverId] });
      toast.success("Navigation started. Drive safely!");
    },
    onError: (error: Error) => {
      console.error("Error starting navigation:", error);
      toast.error("Failed to start navigation");
    },
  });
}
