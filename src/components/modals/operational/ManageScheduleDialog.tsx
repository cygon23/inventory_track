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
  id: string;
  name: string;
  status: string;
  current_trip_id?: string;
  next_available: string | null;
  average_rating: number;
  vehicle_plate?: string;
  total_trips: number;
  days_until_available?: number;
  current_trip?: {
    start_date: string;
    end_date: string;
  };
}

interface ManageScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  drivers: Driver[];
  onUpdateSchedule: (
    driverId: string,
    dayOfWeek: number,
    available: boolean,
    tripId?: string
  ) => Promise<{ success: boolean }>;
}

const ManageScheduleDialog: React.FC<ManageScheduleDialogProps> = ({
  open,
  onOpenChange,
  drivers,
  onUpdateSchedule,
}) => {
  const [selectedDay, setSelectedDay] = useState("Today");
  const [updatingDriverId, setUpdatingDriverId] = useState<string | null>(null);
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
              <Card key={driver.id} className='p-4 space-y-3'>
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
                        {driver.vehicle_plate || "No vehicle"} • ⭐{" "}
                        {driver.average_rating.toFixed(1)}
                      </p>
                    </div>
                  </div>
                  <Button
                    size='sm'
                    variant='outline'
                    disabled={updatingDriverId === driver.id}>
                    {updatingDriverId === driver.id
                      ? "Updating..."
                      : "Edit Schedule"}
                  </Button>
                </div>

                {/* Weekly Schedule or Trip Duration */}
                {driver.status === "on_trip" &&
                driver.current_trip?.start_date &&
                driver.current_trip?.end_date ? (
                  // Show trip timeline for drivers on trip
                  <div className='bg-primary/5 p-3 rounded-lg border border-primary/20'>
                    <div className='flex items-center justify-between text-sm mb-2'>
                      <span className='text-muted-foreground'>
                        Current Trip Duration
                      </span>
                      <span className='font-medium text-primary'>
                        {(() => {
                          const start = new Date(
                            driver.current_trip.start_date
                          );
                          const end = new Date(driver.current_trip.end_date);
                          const days = Math.ceil(
                            (end.getTime() - start.getTime()) /
                              (1000 * 60 * 60 * 24)
                          );
                          return `${days} days`;
                        })()}
                      </span>
                    </div>
                    <div className='space-y-1 text-xs'>
                      <div className='flex justify-between'>
                        <span className='text-muted-foreground'>Started:</span>
                        <span>
                          {new Date(
                            driver.current_trip.start_date
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='text-muted-foreground'>Returns:</span>
                        <span>
                          {new Date(
                            driver.current_trip.end_date
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Show weekly schedule for available drivers
                  <div className='grid grid-cols-7 gap-2'>
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                      (day, index) => (
                        <div
                          key={day}
                          className='p-2 rounded text-center text-xs bg-success/10 text-success border border-success/20'>
                          Free
                        </div>
                      )
                    )}
                  </div>
                )}

                {/* Current Status */}
                <div className='flex flex-wrap gap-4 text-sm'>
                  <div className='flex items-center space-x-2'>
                    <MapPin className='h-4 w-4 text-muted-foreground' />
                    <span className='text-muted-foreground'>Location:</span>
                    <span className='font-medium'>
                      {driver.status === "on_trip"
                        ? "On Safari"
                        : "Arusha Base"}
                    </span>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <Clock className='h-4 w-4 text-muted-foreground' />
                    <span className='text-muted-foreground'>Available:</span>
                    <span className='font-medium'>
                      {driver.status === "on_trip" &&
                      driver.days_until_available
                        ? `In ${driver.days_until_available} day${
                            driver.days_until_available > 1 ? "s" : ""
                          }`
                        : driver.status === "available"
                        ? "Now"
                        : driver.next_available
                        ? new Date(driver.next_available).toLocaleDateString()
                        : "TBD"}
                    </span>
                  </div>
                  {driver.current_trip_id && (
                    <div className='flex items-center space-x-2'>
                      <span className='text-muted-foreground'>Trip:</span>
                      <span className='font-medium'>
                        #{driver.current_trip_id.slice(0, 8)}
                      </span>
                    </div>
                  )}
                  <div className='flex items-center space-x-2'>
                    <span className='text-muted-foreground'>Total Trips:</span>
                    <span className='font-medium'>{driver.total_trips}</span>
                  </div>
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
