import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Car, User, Calendar, MapPin, Users, Clock } from "lucide-react";

interface Vehicle {
  id: string;
  model: string;
  plate: string;
  capacity: number;
  features?: string[]; // made optional to prevent null error
}

interface AssignVehicleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicle: Vehicle | null;
  onSubmit: (data: any) => void;
}

const AssignVehicleDialog: React.FC<AssignVehicleDialogProps> = ({
  open,
  onOpenChange,
  vehicle,
  onSubmit,
}) => {
  const [tripId, setTripId] = useState("");
  const [customer, setCustomer] = useState("");
  const [driver, setDriver] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [destination, setDestination] = useState("");
  const [passengers, setPassengers] = useState("");
  const [notes, setNotes] = useState("");

  if (!vehicle) return null;

  // Safe fallback for features
  const features = vehicle.features || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      vehicleId: vehicle.id,
      tripId,
      customer,
      driver,
      startDate,
      endDate,
      startTime,
      destination,
      passengers: parseInt(passengers),
      notes,
    });
    // Reset form
    setTripId("");
    setCustomer("");
    setDriver("");
    setStartDate("");
    setEndDate("");
    setStartTime("");
    setDestination("");
    setPassengers("");
    setNotes("");
    onOpenChange(false);
  };

  // Mock available drivers
  const availableDrivers = [
    { id: "D002", name: "Mary Kileo", rating: 4.8 },
    { id: "D004", name: "Grace Mwamba", rating: 4.9 },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center space-x-2'>
            <Car className='h-5 w-5' />
            <span>
              Assign Vehicle - {vehicle.model} ({vehicle.plate})
            </span>
          </DialogTitle>
          <DialogDescription>
            Assign this vehicle to a trip with a driver
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-4'>
          {/* Vehicle Info */}
          <div className='bg-primary/10 p-4 rounded-lg'>
            <h3 className='font-semibold mb-2 flex items-center'>
              <Car className='h-4 w-4 mr-2' />
              Vehicle Details
            </h3>
            <div className='grid grid-cols-2 gap-3 text-sm'>
              <div>
                <p className='text-muted-foreground'>Model</p>
                <p className='font-medium'>{vehicle.model}</p>
              </div>
              <div>
                <p className='text-muted-foreground'>Plate</p>
                <p className='font-medium'>{vehicle.plate}</p>
              </div>
              <div>
                <p className='text-muted-foreground'>Capacity</p>
                <div className='flex items-center space-x-1'>
                  <Users className='h-3 w-3' />
                  <span className='font-medium'>
                    {vehicle.capacity} passengers
                  </span>
                </div>
              </div>
              <div>
                <p className='text-muted-foreground'>Features</p>
                <p className='font-medium'>{features.length} features</p>
              </div>
            </div>
          </div>

          {/* Trip Information */}
          <div className='space-y-4'>
            <h3 className='font-semibold'>Trip Information</h3>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='tripId'>Trip ID / Booking Reference *</Label>
                <Input
                  id='tripId'
                  placeholder='e.g., SF010'
                  value={tripId}
                  onChange={(e) => setTripId(e.target.value)}
                  required
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='customer'>Customer Name *</Label>
                <Input
                  id='customer'
                  placeholder='Enter customer name'
                  value={customer}
                  onChange={(e) => setCustomer(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='driver'>Assign Driver *</Label>
              <Select value={driver} onValueChange={setDriver}>
                <SelectTrigger>
                  <SelectValue placeholder='Select an available driver' />
                </SelectTrigger>
                <SelectContent>
                  {availableDrivers.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      <div className='flex items-center justify-between w-full'>
                        <span>{d.name}</span>
                        <Badge variant='secondary' className='ml-2 text-xs'>
                          ⭐ {d.rating}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='startDate'>Start Date *</Label>
                <Input
                  id='startDate'
                  type='date'
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='startTime'>Start Time *</Label>
                <Input
                  id='startTime'
                  type='time'
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='endDate'>End Date *</Label>
                <Input
                  id='endDate'
                  type='date'
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='destination'>Destination / Route *</Label>
              <Input
                id='destination'
                placeholder='e.g., Serengeti National Park - Northern Circuit'
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                required
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='passengers'>Number of Passengers *</Label>
              <Input
                id='passengers'
                type='number'
                min='1'
                max={vehicle.capacity}
                placeholder={`Max ${vehicle.capacity} passengers`}
                value={passengers}
                onChange={(e) => setPassengers(e.target.value)}
                required
              />
              {passengers && parseInt(passengers) > vehicle.capacity && (
                <p className='text-xs text-destructive'>
                  Exceeds vehicle capacity of {vehicle.capacity}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='notes'>Special Instructions / Notes</Label>
              <Textarea
                id='notes'
                placeholder='Add any special requirements, pickup details, or important notes...'
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          {/* Pre-trip Checklist */}
          <div className='bg-muted/50 p-4 rounded-lg'>
            <h4 className='font-semibold text-sm mb-2'>
              Pre-Assignment Checklist
            </h4>
            <ul className='text-sm text-muted-foreground space-y-1'>
              <li>✓ Vehicle fuel level checked</li>
              <li>✓ Vehicle condition verified</li>
              <li>✓ Driver license and documents valid</li>
              <li>✓ Safety equipment present</li>
              <li>✓ Customer requirements reviewed</li>
            </ul>
          </div>

          {/* Actions */}
          <div className='flex space-x-2 pt-4'>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
              className='flex-1'>
              Cancel
            </Button>
            <Button type='submit' className='flex-1'>
              <Calendar className='h-4 w-4 mr-2' />
              Confirm Assignment
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AssignVehicleDialog;
