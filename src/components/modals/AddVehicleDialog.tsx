import React from "react";
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
  return (
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
                <Input id='model' placeholder='e.g., Toyota Land Cruiser' />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='year'>Year *</Label>
                <Input id='year' type='number' placeholder='2023' />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='plate'>Plate Number *</Label>
                <Input id='plate' placeholder='T123ABC' />
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
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='condition'>Condition *</Label>
              <Input
                id='condition'
                placeholder='excellent / good / fair / poor'
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
                <Input id='driver' placeholder='e.g., James Mollel' />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='currentTrip'>Current Trip (ID)</Label>
                <Input id='currentTrip' placeholder='e.g., SF001' />
              </div>
            </div>
            <Textarea
              id='tripDetails'
              placeholder='Trip details: customer, location, endDate'
              rows={2}
            />
          </div>

          {/* Stats */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='mileage'>Mileage *</Label>
              <Input id='mileage' type='number' placeholder='45230' />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='fuelLevel'>Fuel Level (%) *</Label>
              <Input id='fuelLevel' type='number' placeholder='85' />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='capacity'>Capacity *</Label>
              <Input id='capacity' type='number' placeholder='7' />
            </div>
          </div>

          {/* Service Info */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='lastService'>Last Service *</Label>
              <Input id='lastService' type='date' />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='nextService'>Next Service *</Label>
              <Input id='nextService' type='date' />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='serviceDue'>Service Due (days)</Label>
              <Input id='serviceDue' type='number' placeholder='90' />
            </div>
          </div>

          {/* Features */}
          <div className='space-y-2'>
            <Label htmlFor='features'>Features *</Label>
            <Input
              id='features'
              placeholder='Comma-separated, e.g., 4WD, AC, GPS'
            />
          </div>

          {/* Issues */}
          <div className='space-y-2'>
            <Label htmlFor='issues'>Issues</Label>
            <Textarea
              id='issues'
              placeholder='List issues, e.g., Minor - AC not cooling'
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onSubmit?.({});
              onOpenChange(false);
            }}>
            Add Vehicle
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddVehicleDialog;
