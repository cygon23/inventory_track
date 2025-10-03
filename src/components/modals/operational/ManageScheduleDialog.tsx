import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, UserCheck, Clock, MapPin } from "lucide-react";

interface Driver {
  name: string;
  status: string;
  currentTrip: string | null;
  location: string;
  nextAvailable: string;
  rating: number;
  vehicle: string;
}

interface ManageScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  drivers: Driver[];
}

const ManageScheduleDialog: React.FC<ManageScheduleDialogProps> = ({
  open,
  onOpenChange,
  drivers,
}) => {
  const [selectedDay, setSelectedDay] = useState("Today");
  const days = ["Today", "Tomorrow", "This Week", "Next Week"];

  const getStatusColor = (status: string) => {
    const colors = {
      on_trip: "bg-primary/10 text-primary border-primary/20",
      available: "bg-success/10 text-success border-success/20",
      on_leave: "bg-warning/10 text-warning border-warning/20",
    };
    return (
      colors[status as keyof typeof colors] ||
      "bg-muted/10 text-muted-foreground border-muted/20"
    );
  };

  const formatStatus = (status: string) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center'>
            <Calendar className='h-5 w-5 mr-2 text-primary' />
            Driver Schedule Management
          </DialogTitle>
          <DialogDescription>
            View and manage driver availability and assignments
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Time Period Selector */}
          <div className='flex flex-wrap gap-2'>
            {days.map((day) => (
              <Button
                key={day}
                variant={selectedDay === day ? "default" : "outline"}
                size='sm'
                onClick={() => setSelectedDay(day)}>
                {day}
              </Button>
            ))}
          </div>

          {/* Schedule Overview */}
          <div className='grid grid-cols-7 gap-2 text-center text-xs font-medium text-muted-foreground'>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
            <div>Sun</div>
          </div>

          {/* Driver Schedule Cards */}
          <div className='space-y-4'>
            {drivers.map((driver) => (
              <Card key={driver.name} className='p-4 space-y-3'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center space-x-3'>
                    <div className='w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center'>
                      <UserCheck className='h-5 w-5 text-primary' />
                    </div>
                    <div>
                      <div className='flex items-center space-x-2'>
                        <h4 className='font-semibold text-sm'>{driver.name}</h4>
                        <Badge className={getStatusColor(driver.status)}>
                          {formatStatus(driver.status)}
                        </Badge>
                      </div>
                      <p className='text-xs text-muted-foreground'>
                        {driver.vehicle} • ⭐ {driver.rating}
                      </p>
                    </div>
                  </div>
                  <Button size='sm' variant='outline'>
                    Edit Schedule
                  </Button>
                </div>

                {/* Weekly Schedule */}
                <div className='grid grid-cols-7 gap-2'>
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                    (day, index) => {
                      const isAssigned =
                        driver.status === "on_trip" && index < 3;
                      return (
                        <div
                          key={day}
                          className={`p-2 rounded text-center text-xs ${
                            isAssigned
                              ? "bg-primary/10 text-primary border border-primary/20"
                              : "bg-success/10 text-success border border-success/20"
                          }`}>
                          {isAssigned ? "Busy" : "Free"}
                        </div>
                      );
                    }
                  )}
                </div>

                {/* Current Status */}
                <div className='flex flex-wrap gap-4 text-sm'>
                  <div className='flex items-center space-x-2'>
                    <MapPin className='h-4 w-4 text-muted-foreground' />
                    <span className='text-muted-foreground'>Location:</span>
                    <span className='font-medium'>{driver.location}</span>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <Clock className='h-4 w-4 text-muted-foreground' />
                    <span className='text-muted-foreground'>Available:</span>
                    <span className='font-medium'>{driver.nextAvailable}</span>
                  </div>
                  {driver.currentTrip && (
                    <div className='flex items-center space-x-2'>
                      <span className='text-muted-foreground'>Trip:</span>
                      <span className='font-medium'>{driver.currentTrip}</span>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ManageScheduleDialog;
