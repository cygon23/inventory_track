import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Navigation,
  MapPin,
  Clock,
  Fuel,
  CheckCircle,
  AlertTriangle,
  Car,
  Loader2,
} from "lucide-react";
import { useStartNavigation } from "../../../features/driver/hooks/useStartNavigation";
import type { TripWithDetails } from "../../../features/driver/types/trip.types";

interface StartNavigationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trip: TripWithDetails | null;
  driverId: string;
}

const StartNavigationDialog: React.FC<StartNavigationDialogProps> = ({
  open,
  onOpenChange,
  trip,
  driverId,
}) => {
  const [checklist, setChecklist] = useState({
    vehicleChecked: false,
    fuelChecked: false,
    safetyChecked: false,
    routeChecked: false,
    customerContacted: false,
  });

  const { mutate: startNavigation, isPending } = useStartNavigation(driverId);

  if (!trip) return null;

  const handleChecklistChange = (key: keyof typeof checklist) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const allChecked = Object.values(checklist).every(Boolean);

  const handleStartNavigation = () => {
    startNavigation(
      {
        tripId: trip.id,
        formData: checklist,
      },
      {
        onSuccess: () => {
          // Reset form
          setChecklist({
            vehicleChecked: false,
            fuelChecked: false,
            safetyChecked: false,
            routeChecked: false,
            customerContacted: false,
          });
          onOpenChange(false);

          // TODO: Open external GPS app or internal navigation
          alert("Navigation would start here - integrate with GPS app");
        },
      }
    );
  };

  const checklistItems = [
    {
      key: "vehicleChecked" as const,
      label: "Vehicle condition checked (tires, brakes, fluids)",
      icon: Car,
    },
    {
      key: "fuelChecked" as const,
      label: "Fuel level sufficient for journey",
      icon: Fuel,
    },
    {
      key: "safetyChecked" as const,
      label: "Safety equipment verified (first aid, fire extinguisher)",
      icon: AlertTriangle,
    },
    {
      key: "routeChecked" as const,
      label: "Route reviewed and GPS coordinates loaded",
      icon: MapPin,
    },
    {
      key: "customerContacted" as const,
      label: "Customer contacted and pickup confirmed",
      icon: CheckCircle,
    },
  ];

  // Get current and next waypoints
  const currentWaypoint = trip.waypoints.find((w) => w.status === "current");
  const nextWaypoint = trip.waypoints.find((w) => w.status === "upcoming");
  const targetWaypoint = nextWaypoint || currentWaypoint;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center'>
            <Navigation className='h-5 w-5 mr-2 text-primary' />
            Start Navigation - {trip.booking?.booking_reference || trip.id}
          </DialogTitle>
          <DialogDescription>
            Complete pre-departure checklist before starting navigation
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Trip Summary */}
          <Card className='p-4 space-y-3 bg-primary/5 border-primary/20'>
            <h3 className='font-semibold text-sm'>Trip Summary</h3>
            <Separator />
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm'>
              <div>
                <p className='text-muted-foreground'>Customer</p>
                <p className='font-medium'>{trip.customer_name}</p>
              </div>
              <div>
                <p className='text-muted-foreground'>Vehicle</p>
                <p className='font-medium'>
                  {trip.vehicle
                    ? `${trip.vehicle.model} - ${trip.vehicle.plate}`
                    : "Not assigned"}
                </p>
              </div>
              <div>
                <p className='text-muted-foreground'>From</p>
                <p className='font-medium flex items-center'>
                  <MapPin className='h-3 w-3 mr-1' />
                  {trip.current_location ||
                    currentWaypoint?.name ||
                    "Current location"}
                </p>
              </div>
              <div>
                <p className='text-muted-foreground'>To</p>
                <p className='font-medium flex items-center'>
                  <MapPin className='h-3 w-3 mr-1' />
                  {targetWaypoint?.name || trip.next_stop || "Next destination"}
                </p>
              </div>
              <div>
                <p className='text-muted-foreground'>Distance</p>
                <p className='font-medium'>
                  {targetWaypoint?.distance_from_previous || "N/A"}
                </p>
              </div>
              <div>
                <p className='text-muted-foreground'>ETA</p>
                <p className='font-medium flex items-center'>
                  <Clock className='h-3 w-3 mr-1' />
                  {targetWaypoint?.scheduled_time ||
                    trip.estimated_arrival ||
                    "N/A"}
                </p>
              </div>
            </div>
          </Card>

          {/* Pre-Departure Checklist */}
          <Card className='p-4 space-y-4'>
            <div className='flex items-center justify-between'>
              <h3 className='font-semibold'>Pre-Departure Checklist</h3>
              {allChecked ? (
                <CheckCircle className='h-5 w-5 text-success' />
              ) : (
                <AlertTriangle className='h-5 w-5 text-warning' />
              )}
            </div>
            <Separator />
            <div className='space-y-4'>
              {checklistItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.key}
                    className='flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors'>
                    <Checkbox
                      id={item.key}
                      checked={checklist[item.key]}
                      onCheckedChange={() => handleChecklistChange(item.key)}
                      disabled={isPending}
                    />
                    <div className='flex-1 flex items-start space-x-2'>
                      <Icon className='h-4 w-4 mt-0.5 text-muted-foreground' />
                      <Label
                        htmlFor={item.key}
                        className='text-sm font-normal cursor-pointer'>
                        {item.label}
                      </Label>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Navigation Options */}
          <Card className='p-4 space-y-3'>
            <h3 className='font-semibold text-sm'>Navigation Method</h3>
            <Separator />
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
              <Button
                variant='outline'
                className='h-auto py-4 flex flex-col items-center space-y-2'
                disabled={isPending}>
                <MapPin className='h-6 w-6 text-primary' />
                <div className='text-center'>
                  <p className='font-medium text-sm'>Built-in GPS</p>
                  <p className='text-xs text-muted-foreground'>
                    Use app navigation
                  </p>
                </div>
              </Button>
              <Button
                variant='outline'
                className='h-auto py-4 flex flex-col items-center space-y-2'
                disabled={isPending}
                onClick={() => {
                  // TODO: Open Google Maps with coordinates
                  if (targetWaypoint?.latitude && targetWaypoint?.longitude) {
                    const url = `https://www.google.com/maps/dir/?api=1&destination=${targetWaypoint.latitude},${targetWaypoint.longitude}`;
                    window.open(url, "_blank");
                  } else {
                    alert("GPS coordinates not available for this waypoint");
                  }
                }}>
                <Navigation className='h-6 w-6 text-primary' />
                <div className='text-center'>
                  <p className='font-medium text-sm'>External App</p>
                  <p className='text-xs text-muted-foreground'>
                    Open in Google Maps
                  </p>
                </div>
              </Button>
            </div>
          </Card>

          {/* Waypoint Information */}
          {targetWaypoint && (
            <Card className='p-4 space-y-3'>
              <h3 className='font-semibold text-sm'>Destination Details</h3>
              <Separator />
              <div className='space-y-2 text-sm'>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Waypoint:</span>
                  <span className='font-medium'>{targetWaypoint.name}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Sequence:</span>
                  <span className='font-medium'>
                    Stop {targetWaypoint.sequence_order} of{" "}
                    {trip.waypoints.length}
                  </span>
                </div>
                {targetWaypoint.notes && (
                  <div className='pt-2'>
                    <p className='text-muted-foreground'>Notes:</p>
                    <p className='text-sm mt-1'>{targetWaypoint.notes}</p>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Safety Reminders */}
          <Card className='p-4 space-y-3 bg-warning/5 border-warning/20'>
            <h3 className='font-semibold flex items-center text-warning text-sm'>
              <AlertTriangle className='h-4 w-4 mr-2' />
              Safety Reminders
            </h3>
            <ul className='text-sm text-muted-foreground space-y-1'>
              <li>• Drive carefully and obey all traffic rules</li>
              <li>• Watch for wildlife on roads</li>
              <li>• Take breaks every 2 hours</li>
              <li>• Keep emergency contacts accessible</li>
              <li>• Update trip status regularly</li>
            </ul>
          </Card>
        </div>

        <DialogFooter className='gap-2 flex-col sm:flex-row'>
          <Button
            type='button'
            variant='outline'
            onClick={() => onOpenChange(false)}
            disabled={isPending}
            className='w-full sm:w-auto'>
            Cancel
          </Button>
          <Button
            onClick={handleStartNavigation}
            disabled={!allChecked || isPending}
            className='w-full sm:w-auto'>
            {isPending ? (
              <>
                <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                Starting...
              </>
            ) : (
              <>
                <Navigation className='h-4 w-4 mr-2' />
                Start Navigation
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StartNavigationDialog;
