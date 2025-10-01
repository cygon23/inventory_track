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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AssignTripDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  driverName: string;
  onSubmit?: (data: any) => void;
}

const AssignTripDialog: React.FC<AssignTripDialogProps> = ({
  open,
  onOpenChange,
  driverName,
  onSubmit,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Assign Trip to {driverName}</DialogTitle>
          <DialogDescription>
            Fill in the trip details to assign this driver
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6 py-4'>
          {/* Trip Information */}
          <div className='space-y-4'>
            <h3 className='text-sm font-semibold text-foreground'>
              Trip Information
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='tripName'>Trip Name *</Label>
                <Input
                  id='tripName'
                  placeholder='e.g., Serengeti 3-Day Safari'
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='tripType'>Trip Type *</Label>
                <Select>
                  <SelectTrigger id='tripType'>
                    <SelectValue placeholder='Select type' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='day-trip'>Day Trip</SelectItem>
                    <SelectItem value='multi-day'>Multi-Day Safari</SelectItem>
                    <SelectItem value='airport-transfer'>
                      Airport Transfer
                    </SelectItem>
                    <SelectItem value='custom'>Custom Trip</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Date & Time */}
          <div className='space-y-4'>
            <h3 className='text-sm font-semibold text-foreground'>Schedule</h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='startDate'>Start Date *</Label>
                <Input id='startDate' type='date' />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='startTime'>Start Time *</Label>
                <Input id='startTime' type='time' />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='endDate'>End Date</Label>
                <Input id='endDate' type='date' />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='endTime'>End Time</Label>
                <Input id='endTime' type='time' />
              </div>
            </div>
          </div>

          {/* Location & Guests */}
          <div className='space-y-4'>
            <h3 className='text-sm font-semibold text-foreground'>Details</h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='pickupLocation'>Pickup Location *</Label>
                <Input
                  id='pickupLocation'
                  placeholder='e.g., Kilimanjaro Airport'
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='destination'>Destination *</Label>
                <Input
                  id='destination'
                  placeholder='e.g., Serengeti National Park'
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='guests'>Number of Guests *</Label>
                <Input
                  id='guests'
                  type='number'
                  min='1'
                  placeholder='e.g., 4'
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='clientName'>Client Name *</Label>
                <Input id='clientName' placeholder='e.g., John Doe' />
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          <div className='space-y-4'>
            <h3 className='text-sm font-semibold text-foreground'>
              Additional Information
            </h3>
            <div className='space-y-2'>
              <Label htmlFor='notes'>Special Requirements (Optional)</Label>
              <Textarea
                id='notes'
                placeholder='Any special instructions or requirements...'
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
              onSubmit?.({});
              onOpenChange(false);
            }}>
            Assign Trip
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssignTripDialog;
