import React, { useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  Navigation,
  Fuel,
  Camera,
  Loader2,
} from "lucide-react";
import { useUpdateTripStatus } from "../../../features/driver/hooks/useUpdateTripStatus";
import type {
  TripWithDetails,
  StatusUpdateType,
} from "../../../features/driver/types/trip.types";

interface UpdateTripStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trip: TripWithDetails | null;
  driverId: string;
}

const UpdateTripStatusDialog: React.FC<UpdateTripStatusDialogProps> = ({
  open,
  onOpenChange,
  trip,
  driverId,
}) => {
  const [status, setStatus] = useState<StatusUpdateType>("in-transit");
  const [notes, setNotes] = useState("");
  const [location, setLocation] = useState("");
  const [fuelLevel, setFuelLevel] = useState("75");

  const { mutate: updateStatus, isPending } = useUpdateTripStatus(driverId);

  // Reset form when trip changes
  useEffect(() => {
    if (trip) {
      setLocation(trip.current_location || "");
      setFuelLevel(trip.vehicle?.fuel_level?.toString() || "75");
      setNotes("");
      setStatus("in-transit");
    }
  }, [trip]);

  if (!trip) return null;

  const handleSubmit = () => {
    updateStatus(
      {
        tripId: trip.id,
        formData: {
          status,
          location,
          fuel_level: parseInt(fuelLevel),
          notes,
        },
      },
      {
        onSuccess: () => {
          setNotes("");
          onOpenChange(false);
        },
      }
    );
  };

  const statusOptions = [
    {
      value: "in-transit" as const,
      label: "In Transit",
      icon: Navigation,
      color: "text-primary",
    },
    {
      value: "arrived" as const,
      label: "Arrived at Destination",
      icon: MapPin,
      color: "text-success",
    },
    {
      value: "game-drive" as const,
      label: "Game Drive",
      icon: Camera,
      color: "text-success",
    },
    {
      value: "rest-stop" as const,
      label: "Rest Stop",
      icon: Clock,
      color: "text-warning",
    },
    {
      value: "fuel-stop" as const,
      label: "Fuel Stop",
      icon: Fuel,
      color: "text-warning",
    },
    {
      value: "issue" as const,
      label: "Issue/Delay",
      icon: AlertTriangle,
      color: "text-destructive",
    },
    {
      value: "completed" as const,
      label: "Trip Completed",
      icon: CheckCircle,
      color: "text-success",
    },
  ];

  const quickNotes = [
    "Trip proceeding as planned. Guests are enjoying the experience.",
    "Wildlife sighting - extended stop for photography.",
    "Scheduled lunch break. Guests comfortable.",
    "Minor delay due to road conditions. ETA updated.",
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center'>
            <Navigation className='h-5 w-5 mr-2 text-primary' />
            Update Trip Status - {trip.booking?.booking_reference || trip.id}
          </DialogTitle>
          <DialogDescription>
            Update current status for {trip.customer_name}'s trip
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Current Trip Info */}
          <Card className='p-4 space-y-3 bg-primary/5 border-primary/20'>
            <h3 className='font-semibold text-sm'>Current Trip Information</h3>
            <Separator />
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm'>
              <div>
                <p className='text-muted-foreground'>Customer</p>
                <p className='font-medium'>{trip.customer_name}</p>
              </div>
              <div>
                <p className='text-muted-foreground'>Booking Reference</p>
                <p className='font-medium'>
                  {trip.booking?.booking_reference || "N/A"}
                </p>
              </div>
              <div>
                <p className='text-muted-foreground'>Last Location</p>
                <p className='font-medium'>
                  {trip.current_location || "Not updated"}
                </p>
              </div>
              <div>
                <p className='text-muted-foreground'>Next Destination</p>
                <p className='font-medium'>{trip.next_stop || "Not set"}</p>
              </div>
            </div>
          </Card>

          {/* Status Selection */}
          <Card className='p-4 space-y-4'>
            <div className='flex items-center justify-between'>
              <h3 className='font-semibold'>Select Current Status</h3>
              <span className='text-xs text-muted-foreground'>Required</span>
            </div>
            <Separator />
            <RadioGroup
              value={status}
              onValueChange={(value) => setStatus(value as StatusUpdateType)}
              disabled={isPending}>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                {statusOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <Label
                      key={option.value}
                      htmlFor={option.value}
                      className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                        status === option.value
                          ? "border-primary bg-primary/5"
                          : "border-border hover:bg-muted/50"
                      } ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}>
                      <RadioGroupItem
                        value={option.value}
                        id={option.value}
                        disabled={isPending}
                      />
                      <Icon className={`h-4 w-4 ${option.color}`} />
                      <span className='text-sm font-medium'>
                        {option.label}
                      </span>
                    </Label>
                  );
                })}
              </div>
            </RadioGroup>
          </Card>

          {/* Location Update */}
          <Card className='p-4 space-y-3'>
            <Label htmlFor='location' className='font-semibold'>
              Current Location
            </Label>
            <Separator />
            <div className='space-y-2'>
              <Input
                id='location'
                placeholder='Enter current location or landmark'
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                disabled={isPending}
              />
              <Button
                variant='outline'
                size='sm'
                className='w-full'
                disabled={isPending}
                onClick={() => {
                  // TODO: Implement GPS location fetch
                  alert("GPS location feature coming soon!");
                }}>
                <MapPin className='h-4 w-4 mr-2' />
                Use GPS Location
              </Button>
            </div>
          </Card>

          {/* Vehicle Info */}
          <Card className='p-4 space-y-3'>
            <Label htmlFor='fuel' className='font-semibold'>
              Vehicle Status
            </Label>
            <Separator />
            <div className='space-y-3'>
              <div>
                <Label htmlFor='fuel' className='text-sm text-muted-foreground'>
                  Fuel Level (%)
                </Label>
                <div className='flex items-center space-x-3 mt-1'>
                  <Input
                    id='fuel'
                    type='number'
                    min='0'
                    max='100'
                    value={fuelLevel}
                    onChange={(e) => setFuelLevel(e.target.value)}
                    className='w-24'
                    disabled={isPending}
                  />
                  <Fuel className='h-4 w-4 text-muted-foreground' />
                  <span className='text-sm text-muted-foreground'>
                    {fuelLevel}%
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Notes */}
          <Card className='p-4 space-y-3'>
            <Label htmlFor='notes' className='font-semibold'>
              Status Notes
            </Label>
            <Separator />
            <Textarea
              id='notes'
              placeholder='Add any relevant notes, observations, or customer feedback...'
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              disabled={isPending}
            />
            <p className='text-xs text-muted-foreground'>
              Include any important details about the trip, customer requests,
              or incidents
            </p>
          </Card>

          {/* Quick Notes */}
          <Card className='p-4 space-y-3'>
            <h3 className='font-semibold text-sm'>Quick Note Templates</h3>
            <Separator />
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
              {quickNotes.map((note, index) => (
                <Button
                  key={index}
                  variant='outline'
                  size='sm'
                  onClick={() => setNotes(note)}
                  disabled={isPending}>
                  {note.split(".")[0]}...
                </Button>
              ))}
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
            onClick={handleSubmit}
            disabled={isPending}
            className='w-full sm:w-auto'>
            {isPending ? (
              <>
                <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                Updating...
              </>
            ) : (
              <>
                <CheckCircle className='h-4 w-4 mr-2' />
                Update Status
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateTripStatusDialog;
