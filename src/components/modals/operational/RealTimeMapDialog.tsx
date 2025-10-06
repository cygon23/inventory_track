import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { MapPin, Navigation, Clock, Fuel, Users } from "lucide-react";

interface Trip {
  id: string;
  driver: string;
  customers: string;
  route: string;
  status: string;
  progress: number;
  nextStop: string;
  estimatedArrival: string;
  vehicle: string;
}

interface RealTimeMapDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trips: Trip[];
}

const RealTimeMapDialog: React.FC<RealTimeMapDialogProps> = ({
  open,
  onOpenChange,
  trips,
}) => {
  const getStatusColor = (status: string) => {
    const colors = {
      in_transit: "bg-primary/10 text-primary border-primary/20",
      game_drive: "bg-success/10 text-success border-success/20",
      lunch_break: "bg-warning/10 text-warning border-warning/20",
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
            <Navigation className='h-5 w-5 mr-2 text-primary' />
            Real-Time Trip Tracking
          </DialogTitle>
          <DialogDescription>
            Live locations and status of all active safari trips
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Map Placeholder */}
          <Card className='w-full h-[300px] bg-muted/30 rounded-lg flex items-center justify-center border-2 border-dashed'>
            <div className='text-center space-y-2'>
              <MapPin className='h-12 w-12 mx-auto text-muted-foreground' />
              <p className='text-sm text-muted-foreground'>
                Interactive map view
              </p>
              <p className='text-xs text-muted-foreground'>
                Map integration: Google Maps or Mapbox
              </p>
            </div>
          </Card>

          {/* Trip Cards */}
          <div className='space-y-3'>
            <h3 className='font-semibold'>Active Trips ({trips.length})</h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
              {trips.map((trip) => (
                <Card key={trip.id} className='p-4 space-y-3'>
                  <div className='flex items-start justify-between'>
                    <div className='space-y-1'>
                      <div className='flex items-center space-x-2'>
                        <h4 className='font-semibold text-sm'>
                          {trip.customers}
                        </h4>
                        <Badge className={getStatusColor(trip.status)}>
                          {formatStatus(trip.status)}
                        </Badge>
                      </div>
                      <p className='text-xs text-muted-foreground'>
                        Trip #{trip.id.slice(0, 8)} • {trip.vehicle}
                      </p>
                    </div>
                  </div>

                  <div className='space-y-2 text-sm'>
                    <div className='flex items-center space-x-2'>
                      <Users className='h-4 w-4 text-muted-foreground' />
                      <span className='text-muted-foreground'>Driver:</span>
                      <span className='font-medium'>{trip.driver}</span>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <MapPin className='h-4 w-4 text-primary' />
                      <span className='text-muted-foreground'>Route:</span>
                      <span className='font-medium'>{trip.route}</span>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <Navigation className='h-4 w-4 text-muted-foreground' />
                      <span className='text-muted-foreground'>Next Stop:</span>
                      <span className='font-medium'>{trip.nextStop}</span>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <Clock className='h-4 w-4 text-muted-foreground' />
                      <span className='text-muted-foreground'>ETA:</span>
                      <span className='font-medium'>
                        {trip.estimatedArrival}
                      </span>
                    </div>
                  </div>

                  <div className='space-y-1'>
                    <div className='flex items-center justify-between text-xs'>
                      <span>Progress</span>
                      <span className='font-medium'>{trip.progress}%</span>
                    </div>
                    <div className='w-full bg-muted/50 rounded-full h-1.5'>
                      <div
                        className='bg-primary h-1.5 rounded-full transition-all'
                        style={{ width: `${trip.progress}%` }}
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RealTimeMapDialog;
