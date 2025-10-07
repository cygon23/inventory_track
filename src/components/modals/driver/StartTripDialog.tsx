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
import { Textarea } from "@/components/ui/textarea";
import {
  Play,
  CheckCircle,
  AlertTriangle,
  Car,
  Fuel,
  MapPin,
  Users,
  Calendar,
  Loader2,
} from "lucide-react";
import { useStartTrip } from "../../../features/driver/hooks/useStartTrip";
import type { TripWithDetails } from "../../../features/driver/types/trip.types";

interface StartTripDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trip: TripWithDetails | null;
  driverId: string;
}

const StartTripDialog: React.FC<StartTripDialogProps> = ({
  open,
  onOpenChange,
  trip,
  driverId,
}) => {
  const [checklist, setChecklist] = useState({
    vehicle_inspected: false,
    fuel_checked: false,
    safety_equipment: false,
    guests_arrived: false,
    luggage_loaded: false,
    route_planned: false,
  });
  const [notes, setNotes] = useState("");

  const { mutate: startTrip, isPending } = useStartTrip(driverId);

  if (!trip) return null;

  const handleChecklistChange = (key: keyof typeof checklist) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const allChecked = Object.values(checklist).every(Boolean);

  const handleStartTrip = () => {
    const firstWaypoint = trip.waypoints.find((w) => w.sequence_order === 1);

    startTrip(
      {
        tripId: trip.id,
        firstWaypointId: firstWaypoint?.id,
        formData: {
          ...checklist,
          notes: notes || undefined,
        },
      },
      {
        onSuccess: () => {
          // Reset form
          setChecklist({
            vehicle_inspected: false,
            fuel_checked: false,
            safety_equipment: false,
            guests_arrived: false,
            luggage_loaded: false,
            route_planned: false,
          });
          setNotes("");
          onOpenChange(false);
        },
      }
    );
  };

  const checklistItems = [
    {
      key: "vehicle_inspected" as const,
      label: "Vehicle fully inspected and ready",
      icon: Car,
    },
    { key: "fuel_checked" as const, label: "Fuel tank full", icon: Fuel },
    {
      key: "safety_equipment" as const,
      label: "All safety equipment verified",
      icon: AlertTriangle,
    },
    {
      key: "guests_arrived" as const,
      label: "All guests present and checked in",
      icon: Users,
    },
    {
      key: "luggage_loaded" as const,
      label: "Luggage securely loaded",
      icon: CheckCircle,
    },
    {
      key: "route_planned" as const,
      label: "Route and GPS programmed",
      icon: MapPin,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center'>
            <Play className='h-5 w-5 mr-2 text-primary' />
            Start Trip - {trip.booking?.booking_reference || trip.id}
          </DialogTitle>
          <DialogDescription>
            Complete pre-departure checklist before starting the trip
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Trip Summary */}
          <Card className='p-4 space-y-3 bg-primary/5 border-primary/20'>
            <h3 className='font-semibold text-sm'>Trip Details</h3>
            <Separator />
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm'>
              <div>
                <p className='text-muted-foreground'>Customer</p>
                <p className='font-medium'>{trip.customer_name}</p>
                <p className='text-xs text-muted-foreground'>
                  {trip.booking?.customer_phone}
                </p>
              </div>
              <div>
                <p className='text-muted-foreground'>Package</p>
                <p className='font-medium'>{trip.package_name}</p>
              </div>
              <div>
                <p className='text-muted-foreground'>Start Date</p>
                <p className='font-medium flex items-center'>
                  <Calendar className='h-3 w-3 mr-1' />
                  {new Date(trip.start_date).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className='text-muted-foreground'>Guests</p>
                <p className='font-medium flex items-center'>
                  <Users className='h-3 w-3 mr-1' />
                  {trip.guests} people
                </p>
              </div>
              <div>
                <p className='text-muted-foreground'>Vehicle</p>
                <p className='font-medium flex items-center'>
                  <Car className='h-3 w-3 mr-1' />
                  {trip.vehicle
                    ? `${trip.vehicle.model} - ${trip.vehicle.plate}`
                    : "Not assigned"}
                </p>
              </div>
              <div>
                <p className='text-muted-foreground'>First Destination</p>
                <p className='font-medium flex items-center'>
                  <MapPin className='h-3 w-3 mr-1' />
                  {trip.waypoints[0]?.name || trip.next_stop || "Not set"}
                </p>
              </div>
            </div>
          </Card>

          {/* Pre-Departure Checklist */}
          <Card className='p-4 space-y-4'>
            <div className='flex items-center justify-between'>
              <h3 className='font-semibold'>Pre-Departure Checklist</h3>
              {allChecked ? (
                <div className='flex items-center space-x-2 text-success'>
                  <CheckCircle className='h-5 w-5' />
                  <span className='text-sm font-medium'>Ready to Start</span>
                </div>
              ) : (
                <div className='flex items-center space-x-2 text-warning'>
                  <AlertTriangle className='h-5 w-5' />
                  <span className='text-sm font-medium'>Incomplete</span>
                </div>
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

          {/* Additional Notes */}
          <Card className='p-4 space-y-3'>
            <Label htmlFor='notes' className='font-semibold text-sm'>
              Additional Notes (Optional)
            </Label>
            <Separator />
            <Textarea
              id='notes'
              placeholder='Any special notes or observations before starting...'
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              disabled={isPending}
            />
          </Card>

          {/* Important Notes */}
          <Card className='p-4 space-y-3 bg-warning/5 border-warning/20'>
            <h3 className='font-semibold flex items-center text-warning text-sm'>
              <AlertTriangle className='h-4 w-4 mr-2' />
              Important Reminders
            </h3>
            <ul className='text-sm text-muted-foreground space-y-1'>
              <li>• Confirm customer emergency contact information</li>
              <li>• Brief guests on safety procedures</li>
              <li>• Verify all park entry permits are valid</li>
              <li>• Check weather forecast for the route</li>
              <li>• Ensure communication devices are charged</li>
              <li>• Review customer special requests and preferences</li>
            </ul>
          </Card>

          {/* Customer Brief */}
          <Card className='p-4 space-y-3'>
            <h3 className='font-semibold text-sm'>Customer Safety Brief</h3>
            <Separator />
            <div className='text-sm text-muted-foreground space-y-2'>
              <p>Before starting, ensure you've briefed the customers on:</p>
              <ul className='space-y-1 ml-4'>
                <li>• Emergency procedures and contact information</li>
                <li>• Park rules and wildlife viewing guidelines</li>
                <li>• Daily itinerary and expected stops</li>
                <li>• Communication protocol during the trip</li>
                <li>• Location of first aid kit and safety equipment</li>
              </ul>
            </div>
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
            onClick={handleStartTrip}
            disabled={!allChecked || isPending}
            className='w-full sm:w-auto'>
            {isPending ? (
              <>
                <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                Starting...
              </>
            ) : (
              <>
                <Play className='h-4 w-4 mr-2' />
                Start Trip
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StartTripDialog;
