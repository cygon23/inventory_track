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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  UserCheck,
  Car,
  MapPin,
  Calendar,
  Users,
  AlertCircle,
} from "lucide-react";

interface AssignDriverDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tripData?: {
    id: string;
    customer: string;
    package?: string;
    startDate?: string;
    pickup?: string;
    guests?: number;
    requirements?: string;
  };
  availableDrivers: Array<{
    name: string;
    rating: number;
    vehicle: string;
    status: string;
    nextAvailable: string;
  }>;
  onSubmit: (data: any) => void;
}

const AssignDriverDialog: React.FC<AssignDriverDialogProps> = ({
  open,
  onOpenChange,
  tripData,
  availableDrivers,
  onSubmit,
}) => {
  const [selectedDriver, setSelectedDriver] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      tripId: tripData?.id,
      driver: selectedDriver,
      vehicle: selectedVehicle,
      notes,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center'>
            <UserCheck className='h-5 w-5 mr-2 text-primary' />
            Assign Driver to Trip
          </DialogTitle>
          <DialogDescription>
            Select a driver and vehicle for this safari trip
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-6'>
          {/* Trip Information */}
          {tripData && (
            <Card className='p-4 bg-muted/50 space-y-2'>
              <h3 className='font-semibold text-sm'>Trip Details</h3>
              <div className='grid grid-cols-2 gap-4 text-sm'>
                <div>
                  <span className='text-muted-foreground'>Trip ID:</span>
                  <p className='font-medium'>#{tripData.id}</p>
                </div>
                <div>
                  <span className='text-muted-foreground'>Customer:</span>
                  <p className='font-medium'>{tripData.customer}</p>
                </div>
                {tripData.package && (
                  <div>
                    <span className='text-muted-foreground'>Package:</span>
                    <p className='font-medium'>{tripData.package}</p>
                  </div>
                )}
                {tripData.startDate && (
                  <div>
                    <span className='text-muted-foreground'>Start Date:</span>
                    <p className='font-medium'>{tripData.startDate}</p>
                  </div>
                )}
                {tripData.pickup && (
                  <div>
                    <span className='text-muted-foreground'>Pickup:</span>
                    <p className='font-medium'>{tripData.pickup}</p>
                  </div>
                )}
                {tripData.guests && (
                  <div>
                    <span className='text-muted-foreground'>Guests:</span>
                    <p className='font-medium'>{tripData.guests} people</p>
                  </div>
                )}
              </div>
              {tripData.requirements && (
                <div className='pt-2 border-t'>
                  <span className='text-muted-foreground text-sm'>
                    Requirements:
                  </span>
                  <p className='text-sm'>{tripData.requirements}</p>
                </div>
              )}
            </Card>
          )}

          {/* Driver Selection */}
          <div className='space-y-3'>
            <Label htmlFor='driver'>Select Driver *</Label>
            <Select
              value={selectedDriver}
              onValueChange={setSelectedDriver}
              required>
              <SelectTrigger>
                <SelectValue placeholder='Choose a driver' />
              </SelectTrigger>
              <SelectContent>
                {availableDrivers.map((driver) => (
                  <SelectItem key={driver.name} value={driver.name}>
                    <div className='flex items-center justify-between w-full'>
                      <span>{driver.name}</span>
                      <span className='text-xs text-muted-foreground ml-2'>
                        ⭐ {driver.rating} • {driver.vehicle}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Selected Driver Info */}
          {selectedDriver && (
            <Card className='p-4 bg-success/10 border-success/20'>
              <div className='flex items-start space-x-3'>
                <div className='w-10 h-10 bg-success/20 rounded-full flex items-center justify-center'>
                  <UserCheck className='h-5 w-5 text-success' />
                </div>
                <div className='flex-1'>
                  <h4 className='font-semibold text-sm'>{selectedDriver}</h4>
                  {availableDrivers.find((d) => d.name === selectedDriver) && (
                    <>
                      <p className='text-xs text-muted-foreground'>
                        Rating: ⭐{" "}
                        {
                          availableDrivers.find(
                            (d) => d.name === selectedDriver
                          )?.rating
                        }
                      </p>
                      <p className='text-xs text-muted-foreground'>
                        Vehicle:{" "}
                        {
                          availableDrivers.find(
                            (d) => d.name === selectedDriver
                          )?.vehicle
                        }
                      </p>
                      <Badge variant='outline' className='mt-2 text-xs'>
                        {availableDrivers.find((d) => d.name === selectedDriver)
                          ?.status === "available"
                          ? "Available Now"
                          : `Available: ${
                              availableDrivers.find(
                                (d) => d.name === selectedDriver
                              )?.nextAvailable
                            }`}
                      </Badge>
                    </>
                  )}
                </div>
              </div>
            </Card>
          )}

          {/* Vehicle Selection */}
          <div className='space-y-3'>
            <Label htmlFor='vehicle'>Vehicle Assignment *</Label>
            <Select
              value={selectedVehicle}
              onValueChange={setSelectedVehicle}
              required>
              <SelectTrigger>
                <SelectValue placeholder='Choose a vehicle' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='LC-001'>
                  LC-001 - Toyota Land Cruiser 2023
                </SelectItem>
                <SelectItem value='LC-002'>
                  LC-002 - Toyota Land Cruiser 2023
                </SelectItem>
                <SelectItem value='LC-003'>
                  LC-003 - Toyota Land Cruiser 2021
                </SelectItem>
                <SelectItem value='LC-004'>
                  LC-004 - Toyota Land Cruiser 2023
                </SelectItem>
                <SelectItem value='LC-005'>
                  LC-005 - Toyota Land Cruiser 2022
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className='space-y-3'>
            <Label htmlFor='notes'>Assignment Notes</Label>
            <Textarea
              id='notes'
              placeholder='Any special instructions or notes for the driver...'
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          {/* Pre-Assignment Checklist */}
          <Card className='p-4 bg-primary/5 border-primary/20'>
            <div className='flex items-start space-x-3'>
              <AlertCircle className='h-5 w-5 text-primary mt-0.5' />
              <div className='space-y-2 text-sm'>
                <p className='font-semibold'>Pre-Assignment Checklist</p>
                <ul className='space-y-1 text-muted-foreground'>
                  <li>✓ Driver license and certification valid</li>
                  <li>✓ Vehicle maintenance up to date</li>
                  <li>✓ Fuel level adequate for journey</li>
                  <li>✓ Safety equipment checked</li>
                  <li>✓ Communication devices functional</li>
                </ul>
              </div>
            </div>
          </Card>

          <DialogFooter className='gap-2'>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type='submit'
              disabled={!selectedDriver || !selectedVehicle}>
              Confirm Assignment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AssignDriverDialog;
