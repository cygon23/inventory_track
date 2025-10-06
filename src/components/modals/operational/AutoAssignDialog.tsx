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
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Sparkles,
  UserCheck,
  Car,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

interface PendingAssignment {
  id: string;
  customer: string;
  package: string;
  startDate: string;
  pickup: string;
  guests: number;
  preferredDriver: string;
  priority: string;
  requirements: string;
}

interface AutoAssignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pendingAssignments: any[];
  onSubmit: (selectedTrips: string[]) => void;
}

const AutoAssignDialog: React.FC<AutoAssignDialogProps> = ({
  open,
  onOpenChange,
  pendingAssignments,
  onSubmit,
}) => {
  const [selectedTrips, setSelectedTrips] = useState<string[]>([]);
  const [autoAssigning, setAutoAssigning] = useState(false);

  const handleToggleTrip = (tripId: string) => {
    setSelectedTrips((prev) =>
      prev.includes(tripId)
        ? prev.filter((id) => id !== tripId)
        : [...prev, tripId]
    );
  };

  const handleSelectAll = () => {
    if (selectedTrips.length === pendingAssignments.length) {
      setSelectedTrips([]);
    } else {
      setSelectedTrips(pendingAssignments.map((a) => a.id));
    }
  };

  const handleAutoAssign = () => {
    setAutoAssigning(true);
    // Simulate auto-assignment process
    setTimeout(() => {
      onSubmit(selectedTrips);
      setAutoAssigning(false);
      onOpenChange(false);
    }, 2000);
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      urgent: "bg-destructive/10 text-destructive border-destructive/20",
      high: "bg-warning/10 text-warning border-warning/20",
      medium: "bg-primary/10 text-primary border-primary/20",
    };
    return (
      colors[priority as keyof typeof colors] ||
      "bg-muted/10 text-muted-foreground border-muted/20"
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-3xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center'>
            <Sparkles className='h-5 w-5 mr-2 text-primary' />
            Auto-Assign Drivers
          </DialogTitle>
          <DialogDescription>
            Automatically assign the best available drivers to pending trips
            based on availability, ratings, and requirements
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Assignment Criteria */}
          <Card className='p-4 bg-primary/5 border-primary/20'>
            <h3 className='font-semibold text-sm mb-3'>Assignment Criteria</h3>
            <div className='grid grid-cols-2 gap-3 text-sm'>
              <div className='flex items-center space-x-2'>
                <CheckCircle className='h-4 w-4 text-success' />
                <span>Driver availability</span>
              </div>
              <div className='flex items-center space-x-2'>
                <CheckCircle className='h-4 w-4 text-success' />
                <span>Vehicle compatibility</span>
              </div>
              <div className='flex items-center space-x-2'>
                <CheckCircle className='h-4 w-4 text-success' />
                <span>Driver ratings & experience</span>
              </div>
              <div className='flex items-center space-x-2'>
                <CheckCircle className='h-4 w-4 text-success' />
                <span>Special requirements</span>
              </div>
              <div className='flex items-center space-x-2'>
                <CheckCircle className='h-4 w-4 text-success' />
                <span>Customer preferences</span>
              </div>
              <div className='flex items-center space-x-2'>
                <CheckCircle className='h-4 w-4 text-success' />
                <span>Trip priority level</span>
              </div>
            </div>
          </Card>

          {/* Select All */}
          <div className='flex items-center space-x-2'>
            <Checkbox
              id='select-all'
              checked={selectedTrips.length === pendingAssignments.length}
              onCheckedChange={handleSelectAll}
            />
            <Label htmlFor='select-all' className='font-medium cursor-pointer'>
              Select all trips ({pendingAssignments.length})
            </Label>
          </div>

          {/* Pending Trips */}
          <div className='space-y-3'>
            <h3 className='font-semibold text-sm'>
              Select Trips for Auto-Assignment
            </h3>
            {pendingAssignments.map((assignment) => (
              <Card key={assignment.id} className='p-4'>
                <div className='flex items-start space-x-3'>
                  <Checkbox
                    id={assignment.id}
                    checked={selectedTrips.includes(assignment.id)}
                    onCheckedChange={() => handleToggleTrip(assignment.id)}
                    className='mt-1'
                  />
                  <div className='flex-1 space-y-2'>
                    <div className='flex items-start justify-between'>
                      <div>
                        <div className='flex items-center space-x-2'>
                          <Label
                            htmlFor={assignment.id}
                            className='font-semibold cursor-pointer'>
                            {assignment.customer}
                          </Label>
                          <Badge
                            className={getPriorityColor(assignment.priority)}>
                            {assignment.priority}
                          </Badge>
                        </div>
                        <p className='text-sm text-muted-foreground'>
                          {assignment.package}
                        </p>
                        <p className='text-xs text-muted-foreground'>
                          #{assignment.id} • {assignment.guests} guests
                        </p>
                      </div>
                    </div>

                    <div className='grid grid-cols-2 gap-2 text-sm'>
                      <div>
                        <span className='text-muted-foreground'>Start:</span>
                        <p className='font-medium text-xs'>
                          {assignment.startDate}
                        </p>
                      </div>
                      <div>
                        <span className='text-muted-foreground'>Pickup:</span>
                        <p className='font-medium text-xs'>
                          {assignment.pickup}
                        </p>
                      </div>
                    </div>

                    {assignment.preferredDriver !== "Any available" && (
                      <div className='flex items-center space-x-2 text-sm'>
                        <UserCheck className='h-4 w-4 text-primary' />
                        <span className='text-muted-foreground'>
                          Preferred:
                        </span>
                        <span className='font-medium'>
                          {assignment.preferredDriver}
                        </span>
                      </div>
                    )}

                    {assignment.requirements && (
                      <div className='flex items-start space-x-2 text-sm'>
                        <AlertTriangle className='h-4 w-4 text-warning mt-0.5' />
                        <span className='text-muted-foreground'>
                          {assignment.requirements}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Summary */}
          {selectedTrips.length > 0 && (
            <Card className='p-4 bg-success/10 border-success/20'>
              <div className='flex items-center space-x-3'>
                <Sparkles className='h-5 w-5 text-success' />
                <div>
                  <p className='font-semibold text-sm'>Ready to Auto-Assign</p>
                  <p className='text-xs text-muted-foreground'>
                    {selectedTrips.length} trip
                    {selectedTrips.length > 1 ? "s" : ""} selected for automatic
                    driver assignment
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>

        <DialogFooter className='gap-2'>
          <Button
            type='button'
            variant='outline'
            onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleAutoAssign}
            disabled={selectedTrips.length === 0 || autoAssigning}>
            {autoAssigning ? (
              <>
                <Sparkles className='h-4 w-4 mr-2 animate-spin' />
                Assigning...
              </>
            ) : (
              <>
                <Sparkles className='h-4 w-4 mr-2' />
                Auto-Assign{" "}
                {selectedTrips.length > 0 ? `(${selectedTrips.length})` : ""}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AutoAssignDialog;
