import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

interface AddVehicleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: any) => void;
}

const AddVehicleDialog: React.FC<AddVehicleDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
}) => {
  // Form state
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [plate, setPlate] = useState("");
  const [status, setStatus] = useState("");
  const [condition, setCondition] = useState("");
  const [driver, setDriver] = useState("");
  const [currentTrip, setCurrentTrip] = useState("");
  const [mileage, setMileage] = useState("");
  const [fuelLevel, setFuelLevel] = useState("");
  const [capacity, setCapacity] = useState("");
  const [lastService, setLastService] = useState("");
  const [nextService, setNextService] = useState("");
  const [serviceDue, setServiceDue] = useState("");
  const [features, setFeatures] = useState("");
  const [issues, setIssues] = useState("");

  // Confirmation dialog state
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleSubmit = async () => {
    // Parse numeric fields
    const parsedCapacity = parseInt(capacity) || 1;
    const parsedFuelLevel = parseInt(fuelLevel) || 0;
    const parsedMileage = parseInt(mileage) || 0;
    const parsedServiceDue = parseInt(serviceDue) || null;
    const parsedYear = parseInt(year) || new Date().getFullYear();

    // Validate required fields
    if (!model || !plate || !status || !condition) {
      toast({
        title: "Error",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return;
    }

    const payload = {
      model,
      year: parsedYear,
      plate,
      status,
      condition,
      driver_id: driver || null,
      current_trip_id: currentTrip || null,
      mileage: parsedMileage,
      fuel_level: parsedFuelLevel,
      capacity: parsedCapacity,
      last_service: lastService || null,
      next_service: nextService || null,
      service_due: parsedServiceDue,
      features: features
        .split(",")
        .map((f) => f.trim())
        .filter((f) => f.length > 0),
      issues: issues
        .split(",")
        .map((i) => i.trim())
        .filter((i) => i.length > 0),
    };

    try {
      await onSubmit?.(payload);
      toast({
        title: "Success",
        description: "Vehicle added successfully!",
        variant: "default",
      });
      // Reset form
      setModel("");
      setYear("");
      setPlate("");
      setStatus("");
      setCondition("");
      setDriver("");
      setCurrentTrip("");
      setMileage("");
      setFuelLevel("");
      setCapacity("");
      setLastService("");
      setNextService("");
      setServiceDue("");
      setFeatures("");
      setIssues("");
      onOpenChange(false);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to add vehicle.",
        variant: "destructive",
      });
    }
  };

  // Prevent negative numbers or zero
  const handleNumberInput =
    (setter: (val: string) => void) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (/^\d*$/.test(value)) {
        setter(value);
      }
    };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className='max-w-3xl max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>Add New Vehicle</DialogTitle>
            <DialogDescription>
              Fill in the details to register a new safari vehicle in the fleet
            </DialogDescription>
          </DialogHeader>

          <div className='space-y-6 py-4'>
            {/* Vehicle Info */}
            <div className='space-y-4'>
              <h3 className='text-sm font-semibold text-foreground'>
                Vehicle Information
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='model'>Model *</Label>
                  <Input
                    id='model'
                    placeholder='e.g., Toyota Land Cruiser'
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='year'>Year *</Label>
                  <Input
                    id='year'
                    type='number'
                    placeholder='2023'
                    value={year}
                    onChange={handleNumberInput(setYear)}
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='plate'>Plate Number *</Label>
                  <Input
                    id='plate'
                    placeholder='T123ABC'
                    value={plate}
                    onChange={(e) => setPlate(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Status & Condition */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='status'>Status *</Label>
                <Input
                  id='status'
                  placeholder='available / on_trip / maintenance'
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='condition'>Condition *</Label>
                <Input
                  id='condition'
                  placeholder='excellent / good / fair / poor'
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                />
              </div>
            </div>

            {/* Assignment Info */}
            <div className='space-y-4'>
              <h3 className='text-sm font-semibold text-foreground'>
                Driver & Assignment
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='driver'>Driver</Label>
                  <Input
                    id='driver'
                    placeholder='e.g., James Mollel'
                    value={driver}
                    onChange={(e) => setDriver(e.target.value)}
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='currentTrip'>Current Trip (ID)</Label>
                  <Input
                    id='currentTrip'
                    placeholder='e.g., SF001'
                    value={currentTrip}
                    onChange={(e) => setCurrentTrip(e.target.value)}
                  />
                </div>
              </div>
              <Textarea
                id='tripDetails'
                placeholder='Trip details: customer, location, endDate'
                rows={2}
                value={issues}
                onChange={(e) => setIssues(e.target.value)}
              />
            </div>

            {/* Stats */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='mileage'>Mileage *</Label>
                <Input
                  id='mileage'
                  type='number'
                  placeholder='45230'
                  value={mileage}
                  onChange={handleNumberInput(setMileage)}
                  min={0}
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='fuelLevel'>Fuel Level (%) *</Label>
                <Input
                  id='fuelLevel'
                  type='number'
                  placeholder='85'
                  value={fuelLevel}
                  onChange={handleNumberInput(setFuelLevel)}
                  min={0}
                  max={100}
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='capacity'>Capacity *</Label>
                <Input
                  id='capacity'
                  type='number'
                  placeholder='7'
                  value={capacity}
                  onChange={handleNumberInput(setCapacity)}
                  min={1}
                />
              </div>
            </div>

            {/* Services & Features */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='lastService'>Last Service *</Label>
                <Input
                  id='lastService'
                  type='date'
                  value={lastService}
                  onChange={(e) => setLastService(e.target.value)}
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='nextService'>Next Service *</Label>
                <Input
                  id='nextService'
                  type='date'
                  value={nextService}
                  onChange={(e) => setNextService(e.target.value)}
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='serviceDue'>Service Due (days)</Label>
                <Input
                  id='serviceDue'
                  type='number'
                  placeholder='90'
                  value={serviceDue}
                  onChange={handleNumberInput(setServiceDue)}
                  min={0}
                />
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='features'>Features *</Label>
              <Input
                id='features'
                placeholder='Comma-separated, e.g., 4WD, AC, GPS'
                value={features}
                onChange={(e) => setFeatures(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant='outline' onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={() => setConfirmOpen(true)}>Add Vehicle</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className='max-w-md'>
          <DialogHeader>
            <DialogTitle>Confirm Submission</DialogTitle>
            <DialogDescription>
              Are you sure you want to add this vehicle? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className='flex justify-end space-x-2'>
            <Button variant='outline' onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setConfirmOpen(false);
                handleSubmit();
              }}>
              Yes, Add Vehicle
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddVehicleDialog;
