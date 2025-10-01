import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface AddDriverDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: any) => void; // optional callback for handling submit
}

const AddDriverDialog: React.FC<AddDriverDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Add New Driver</DialogTitle>
          <DialogDescription>
            Enter driver information to add them to the system
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6 py-4'>
          {/* Personal Information */}
          <div className='space-y-4'>
            <h3 className='text-sm font-semibold text-foreground'>
              Personal Information
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='name'>Full Name *</Label>
                <Input id='name' placeholder='e.g., James Mollel' />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='email'>Email *</Label>
                <Input
                  id='email'
                  type='email'
                  placeholder='driver@liontrack.com'
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='phone'>Phone Number *</Label>
                <Input id='phone' placeholder='+255-754-123-456' />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='experience'>Experience *</Label>
                <Input id='experience' placeholder='e.g., 5 years' />
              </div>
            </div>
          </div>

          {/* Languages & Specialties */}
          <div className='space-y-4'>
            <h3 className='text-sm font-semibold text-foreground'>
              Skills & Expertise
            </h3>
            <div className='space-y-2'>
              <Label htmlFor='languages'>Languages *</Label>
              <Input
                id='languages'
                placeholder='e.g., English, Swahili, German (comma-separated)'
              />
              <p className='text-xs text-muted-foreground'>
                Separate multiple languages with commas
              </p>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='specialties'>Specialties *</Label>
              <Textarea
                id='specialties'
                placeholder='e.g., Wildlife Photography, Big 5 Safari'
                rows={3}
              />
              <p className='text-xs text-muted-foreground'>
                Separate multiple specialties with commas
              </p>
            </div>
          </div>

          {/* Vehicle Information */}
          <div className='space-y-4'>
            <h3 className='text-sm font-semibold text-foreground'>
              Vehicle Information
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='vehicleModel'>Vehicle Model *</Label>
                <Input
                  id='vehicleModel'
                  placeholder='e.g., Toyota Land Cruiser'
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='vehiclePlate'>Plate Number *</Label>
                <Input id='vehiclePlate' placeholder='e.g., T123ABC' />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='vehicleYear'>Year *</Label>
                <Input
                  id='vehicleYear'
                  type='number'
                  placeholder='e.g., 2023'
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className='space-y-4'>
            <h3 className='text-sm font-semibold text-foreground'>
              Additional Information
            </h3>
            <div className='space-y-2'>
              <Label htmlFor='notes'>Notes (Optional)</Label>
              <Textarea
                id='notes'
                placeholder='Any additional information about the driver...'
                rows={3}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              // Later: collect form data here
              onSubmit?.({});
              onOpenChange(false);
            }}>
            Add Driver
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddDriverDialog;
