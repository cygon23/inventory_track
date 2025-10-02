import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { driverService } from "../../services/driverService";

interface ViewScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  driverName: string;
  driverId: string;
}

const ViewScheduleDialog: React.FC<ViewScheduleDialogProps> = ({
  open,
  onOpenChange,
  driverName,
  driverId,
}) => {
  const [schedule, setSchedule] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  useEffect(() => {
    if (open && driverId) {
      fetchSchedule();
    }
  }, [open, driverId]);

  const fetchSchedule = async () => {
    setIsLoading(true);
    setError(null);

    const { data, error: fetchError } = await driverService.getDriverSchedule(
      driverId
    );

    if (fetchError) {
      setError(fetchError);
    } else if (data) {
      setSchedule(data);
    }

    setIsLoading(false);
  };

  const getStatusColor = (available: boolean, tripId: string | null) => {
    if (!available) {
      return "bg-destructive/10 text-destructive border-destructive/20";
    }
    if (tripId) {
      return "bg-warning/10 text-warning border-warning/20";
    }
    return "bg-success/10 text-success border-success/20";
  };

  const getStatusLabel = (
    available: boolean,
    tripId: string | null,
    notes: string | null
  ) => {
    if (!available) {
      return notes || "Not Available";
    }
    if (tripId) {
      return `Trip ${tripId}`;
    }
    return "Available";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle>Weekly Schedule for {driverName}</DialogTitle>
          <DialogDescription>
            View availability and assigned trips for each day of the week
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className='flex items-center justify-center py-12'>
            <Loader2 className='h-8 w-8 animate-spin text-primary' />
          </div>
        ) : error ? (
          <div className='text-center py-12'>
            <p className='text-destructive mb-4'>{error}</p>
            <Button onClick={fetchSchedule} size='sm'>
              Retry
            </Button>
          </div>
        ) : (
          <ScrollArea className='h-[500px] pr-4'>
            <div className='space-y-3'>
              {schedule.length === 0 ? (
                <div className='text-center py-12'>
                  <Calendar className='w-12 h-12 mx-auto text-muted-foreground mb-4' />
                  <p className='text-muted-foreground'>
                    No schedule data available
                  </p>
                </div>
              ) : (
                schedule.map((item) => (
                  <div
                    key={item.id}
                    className='border rounded-lg p-4 hover:bg-muted/50 transition-colors'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-3'>
                        <div className='flex items-center justify-center w-12 h-12 rounded-full bg-primary/10'>
                          <span className='text-sm font-semibold'>
                            {dayNames[item.day_of_week]?.substring(0, 3)}
                          </span>
                        </div>
                        <div>
                          <h4 className='font-semibold text-foreground'>
                            {dayNames[item.day_of_week]}
                          </h4>
                          {item.notes && (
                            <p className='text-sm text-muted-foreground'>
                              {item.notes}
                            </p>
                          )}
                        </div>
                      </div>
                      <Badge
                        className={getStatusColor(
                          item.available,
                          item.trip_id
                        )}>
                        {getStatusLabel(
                          item.available,
                          item.trip_id,
                          item.notes
                        )}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ViewScheduleDialog;
