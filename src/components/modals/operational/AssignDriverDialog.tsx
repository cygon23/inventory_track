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
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  UserCheck,
  Car,
  Star,
  Calendar,
  Users,
  AlertCircle,
} from "lucide-react";

interface AssignDriverDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tripData: any;
  selectedDriver?: any;
  availableDrivers: any[];
  availableVehicles: any[];
  onSubmit: (data: {
    tripId: string;
    driverId: string;
    vehicleId: string;
    notes?: string;
  }) => void;
}

const AssignDriverDialog: React.FC<AssignDriverDialogProps> = ({
  open,
  onOpenChange,
  tripData,
  selectedDriver,
  availableDrivers,
  availableVehicles,
  onSubmit,
}) => {
  const [selectedDriverId, setSelectedDriverId] = useState<string>("");
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>("");

  useEffect(() => {
    if (selectedDriver) {
      setSelectedDriverId(selectedDriver.id);
    } else {
      setSelectedDriverId("");
    }
  }, [selectedDriver]);

  const handleSubmit = () => {
    if (!selectedDriverId || !selectedVehicleId) {
      alert("Please select both a driver and a vehicle");
      return;
    }

    if (!tripData?.id) {
      alert("No trip selected");
      return;
    }

    onSubmit({
      tripId: tripData.id,
      driverId: selectedDriverId,
      vehicleId: selectedVehicleId,
    });
  };

  const getDriverInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-3xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Assign Driver & Vehicle</DialogTitle>
          <DialogDescription>
            Select a driver and vehicle for this trip
          </DialogDescription>
        </DialogHeader>

        {/* Trip Details */}
        {tripData && (
          <div className='bg-muted/50 p-4 rounded-lg space-y-2'>
            <h3 className='font-semibold'>Trip Details</h3>
            <div className='grid grid-cols-2 gap-4 text-sm'>
              <div>
                <p className='text-muted-foreground'>Customer</p>
                <p className='font-medium'>
                  {tripData.customer_name}
                </p>
              </div>
              <div>
                <p className='text-muted-foreground'>Package</p>
                <p className='font-medium'>
                  {tripData.package_name}
                </p>
              </div>
              <div>
                <p className='text-muted-foreground'>Start Date</p>
                <p className='font-medium'>
                  {tripData.start_date
                    ? new Date(tripData.start_date).toLocaleDateString()
                    : tripData.startDate}
                </p>
              </div>
              <div>
                <p className='text-muted-foreground'>Guests</p>
                <p className='font-medium'>
                  <Users className='inline h-4 w-4 mr-1' />
                  {tripData.guests}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Select Driver */}
        <div className='space-y-3'>
          <Label className='text-base font-semibold'>Select Driver</Label>
          {availableDrivers.length === 0 ? (
            <div className='text-center py-8 text-muted-foreground border border-dashed rounded-lg'>
              <UserCheck className='h-12 w-12 mx-auto mb-2 opacity-50' />
              <p>No available drivers at the moment</p>
            </div>
          ) : (
            <div className='grid grid-cols-1 gap-3'>
              {availableDrivers.map((driver) => (
                <div
                  key={driver.id}
                  onClick={() => setSelectedDriverId(driver.id)}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedDriverId === driver.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center space-x-3'>
                      <div className='w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center'>
                        <span className='font-semibold text-primary'>
                          {getDriverInitials(driver.name)}
                        </span>
                      </div>
                      <div>
                        <p className='font-semibold'>{driver.name}</p>
                        <div className='flex items-center space-x-2 text-sm text-muted-foreground'>
                          <Star className='h-3 w-3 fill-current text-warning' />
                          <span>
                            {driver.average_rating?.toFixed(1) || "0.0"}
                          </span>
                          <span>•</span>
                          <span>{driver.total_trips || 0} trips</span>
                          {driver.experience && (
                            <>
                              <span>•</span>
                              <span>{driver.experience}</span>
                            </>
                          )}
                        </div>
                        {driver.specialties &&
                          driver.specialties.length > 0 && (
                            <div className='flex flex-wrap gap-1 mt-1'>
                              {driver.specialties
                                .slice(0, 3)
                                .map((specialty: string, idx: number) => (
                                  <Badge
                                    key={idx}
                                    variant='secondary'
                                    className='text-xs'>
                                    {specialty}
                                  </Badge>
                                ))}
                            </div>
                          )}
                      </div>
                    </div>
                    <div className='text-right'>
                      <Badge className='bg-success/10 text-success border-success/20'>
                        Available
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Select Vehicle */}
        <div className='space-y-3'>
          <Label className='text-base font-semibold'>Select Vehicle</Label>
          {availableVehicles.length === 0 ? (
            <div className='text-center py-8 text-muted-foreground border border-dashed rounded-lg'>
              <Car className='h-12 w-12 mx-auto mb-2 opacity-50' />
              <p>No available vehicles at the moment</p>
            </div>
          ) : (
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
              {availableVehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  onClick={() => setSelectedVehicleId(vehicle.id)}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedVehicleId === vehicle.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}>
                  <div className='flex items-center space-x-3'>
                    <div className='w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center'>
                      <Car className='h-5 w-5 text-primary' />
                    </div>
                    <div className='flex-1'>
                      <p className='font-semibold'>{vehicle.model}</p>
                      <p className='text-sm text-muted-foreground'>
                        {vehicle.plate_number}
                      </p>
                      {vehicle.year && (
                        <p className='text-xs text-muted-foreground'>
                          Year: {vehicle.year}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className='flex space-x-2 pt-4 border-t'>
          <Button
            variant='outline'
            className='flex-1'
            onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            className='flex-1'
            onClick={handleSubmit}
            disabled={!selectedDriverId || !selectedVehicleId}>
            Assign Resources
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AssignDriverDialog;
