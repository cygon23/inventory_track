import React from "react";
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
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Navigation,
  Clock,
  Route,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import type {
  TripWithDetails,
  WaypointStatus,
} from "../../../features/driver/types/trip.types";

interface ViewRouteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trip: TripWithDetails | null;
}

const ViewRouteDialog: React.FC<ViewRouteDialogProps> = ({
  open,
  onOpenChange,
  trip,
}) => {
  if (!trip) return null;

  const getStatusColor = (status: WaypointStatus) => {
    switch (status) {
      case "completed":
        return "bg-success/10 text-success border-success/20";
      case "current":
        return "bg-primary/10 text-primary border-primary/20";
      case "upcoming":
        return "bg-muted/10 text-muted-foreground border-muted/20";
      case "skipped":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  const calculateTotalDistance = () => {
    return trip.waypoints.reduce((total, waypoint) => {
      const distance = parseInt(waypoint.distance_from_previous || "0");
      return total + distance;
    }, 0);
  };

  const calculateCompletedDistance = () => {
    return trip.waypoints
      .filter((w) => w.status === "completed")
      .reduce((total, waypoint) => {
        const distance = parseInt(waypoint.distance_from_previous || "0");
        return total + distance;
      }, 0);
  };

  const totalDistance = calculateTotalDistance();
  const completedDistance = calculateCompletedDistance();
  const currentWaypoint = trip.waypoints.find((w) => w.status === "current");
  const nextWaypoint = trip.waypoints.find((w) => w.status === "upcoming");

  const formatTime = (timeString: string | null) => {
    if (!timeString) return "N/A";

    // Handle time format (HH:MM:SS or ISO timestamp)
    if (timeString.includes("T")) {
      return new Date(timeString).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    // If it's just time (HH:MM:SS), format it
    return timeString.substring(0, 5); // Returns HH:MM
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-3xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center'>
            <Route className='h-5 w-5 mr-2 text-primary' />
            Trip Route - {trip.booking?.booking_reference || trip.id}
          </DialogTitle>
          <DialogDescription>
            Complete route information for {trip.customer_name}
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Map Placeholder */}
          <Card className='p-4 bg-muted/50 min-h-[300px] flex items-center justify-center'>
            <div className='text-center space-y-2'>
              <MapPin className='h-12 w-12 mx-auto text-primary' />
              <p className='text-muted-foreground'>
                Interactive map will be displayed here
              </p>
              <p className='text-sm text-muted-foreground'>
                {currentWaypoint
                  ? `Currently at: ${currentWaypoint.name}`
                  : trip.current_location
                  ? `Current location: ${trip.current_location}`
                  : "Route not started"}
              </p>
              {nextWaypoint && (
                <p className='text-sm text-muted-foreground'>
                  Next: {nextWaypoint.name}
                </p>
              )}
            </div>
          </Card>

          {/* Route Details */}
          <Card className='p-4 space-y-3'>
            <h3 className='font-semibold flex items-center'>
              <Navigation className='h-4 w-4 mr-2 text-primary' />
              Route Waypoints
            </h3>
            <Separator />
            {trip.waypoints.length === 0 ? (
              <p className='text-center py-8 text-muted-foreground'>
                No waypoints configured for this trip
              </p>
            ) : (
              <div className='space-y-3'>
                {trip.waypoints.map((waypoint, index) => (
                  <div key={waypoint.id} className='flex items-start space-x-3'>
                    <div className='flex flex-col items-center'>
                      <div
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                          waypoint.status === "completed"
                            ? "bg-success border-success"
                            : waypoint.status === "current"
                            ? "bg-primary border-primary"
                            : waypoint.status === "skipped"
                            ? "bg-destructive border-destructive"
                            : "bg-background border-muted-foreground"
                        }`}>
                        {waypoint.status === "completed" ? (
                          <span className='text-success-foreground text-xs'>
                            ✓
                          </span>
                        ) : waypoint.status === "current" ? (
                          <span className='text-primary-foreground text-xs'>
                            ●
                          </span>
                        ) : waypoint.status === "skipped" ? (
                          <span className='text-destructive-foreground text-xs'>
                            ✕
                          </span>
                        ) : (
                          <span className='text-muted-foreground text-xs'>
                            {waypoint.sequence_order}
                          </span>
                        )}
                      </div>
                      {index < trip.waypoints.length - 1 && (
                        <div
                          className={`w-0.5 h-12 ${
                            waypoint.status === "completed"
                              ? "bg-success"
                              : "bg-border"
                          }`}
                        />
                      )}
                    </div>
                    <div className='flex-1'>
                      <div className='flex items-center justify-between'>
                        <div>
                          <p className='font-medium'>{waypoint.name}</p>
                          <div className='flex items-center gap-3 text-sm text-muted-foreground mt-1'>
                            <span className='flex items-center'>
                              <Clock className='h-3 w-3 mr-1' />
                              {waypoint.actual_arrival_time
                                ? formatTime(waypoint.actual_arrival_time)
                                : formatTime(waypoint.scheduled_time)}
                            </span>
                            {waypoint.distance_from_previous && (
                              <span>{waypoint.distance_from_previous}</span>
                            )}
                          </div>
                          {waypoint.notes && (
                            <p className='text-xs text-muted-foreground mt-1'>
                              {waypoint.notes}
                            </p>
                          )}
                        </div>
                        <Badge
                          className={getStatusColor(waypoint.status)}
                          variant='outline'>
                          {waypoint.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Route Stats */}
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
            <Card className='p-4'>
              <div className='flex items-center space-x-3'>
                <div className='p-2 bg-primary/10 rounded-lg'>
                  <Route className='h-5 w-5 text-primary' />
                </div>
                <div>
                  <p className='text-xs text-muted-foreground'>
                    Total Distance
                  </p>
                  <p className='font-semibold'>
                    {totalDistance > 0 ? `${totalDistance} km` : "N/A"}
                  </p>
                </div>
              </div>
            </Card>
            <Card className='p-4'>
              <div className='flex items-center space-x-3'>
                <div className='p-2 bg-success/10 rounded-lg'>
                  <Navigation className='h-5 w-5 text-success' />
                </div>
                <div>
                  <p className='text-xs text-muted-foreground'>Completed</p>
                  <p className='font-semibold'>
                    {completedDistance > 0 ? `${completedDistance} km` : "0 km"}
                  </p>
                </div>
              </div>
            </Card>
            <Card className='p-4'>
              <div className='flex items-center space-x-3'>
                <div className='p-2 bg-warning/10 rounded-lg'>
                  <Clock className='h-5 w-5 text-warning' />
                </div>
                <div>
                  <p className='text-xs text-muted-foreground'>Progress</p>
                  <p className='font-semibold'>{trip.progress}%</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Trip Summary */}
          <Card className='p-4 space-y-3'>
            <h3 className='font-semibold text-sm'>Trip Summary</h3>
            <Separator />
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm'>
              <div>
                <p className='text-muted-foreground'>Package</p>
                <p className='font-medium'>{trip.package_name}</p>
              </div>
              <div>
                <p className='text-muted-foreground'>Duration</p>
                <p className='font-medium'>
                  {new Date(trip.start_date).toLocaleDateString()} -{" "}
                  {new Date(trip.end_date).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className='text-muted-foreground'>Guests</p>
                <p className='font-medium'>{trip.guests} people</p>
              </div>
              <div>
                <p className='text-muted-foreground'>Vehicle</p>
                <p className='font-medium'>
                  {trip.vehicle
                    ? `${trip.vehicle.model} - ${trip.vehicle.plate}`
                    : "Not assigned"}
                </p>
              </div>
              <div>
                <p className='text-muted-foreground'>Waypoints</p>
                <p className='font-medium'>
                  {
                    trip.waypoints.filter((w) => w.status === "completed")
                      .length
                  }{" "}
                  of {trip.waypoints.length} completed
                </p>
              </div>
              <div>
                <p className='text-muted-foreground'>Status</p>
                <p className='font-medium capitalize'>
                  {trip.status.replace("_", " ")}
                </p>
              </div>
            </div>
          </Card>

          {/* Travel Tips */}
          <Card className='p-4 space-y-3 bg-primary/5 border-primary/20'>
            <h3 className='font-semibold flex items-center text-sm'>
              <AlertTriangle className='h-4 w-4 mr-2 text-primary' />
              Route Notes & Tips
            </h3>
            <ul className='text-sm text-muted-foreground space-y-1'>
              {trip.notes ? (
                <li>• {trip.notes}</li>
              ) : (
                <>
                  <li>• Check fuel levels before long stretches</li>
                  <li>• Watch for wildlife crossing zones</li>
                  <li>• Take breaks at designated rest areas</li>
                  <li>• Update status at each waypoint</li>
                </>
              )}
            </ul>
          </Card>

          {/* Special Requests */}
          {trip.booking?.special_requests &&
            trip.booking.special_requests.length > 0 && (
              <Card className='p-4 space-y-3 bg-warning/5 border-warning/20'>
                <h3 className='font-semibold flex items-center text-sm'>
                  <AlertTriangle className='h-4 w-4 mr-2 text-warning' />
                  Customer Special Requests
                </h3>
                <ul className='text-sm text-muted-foreground space-y-1'>
                  {trip.booking.special_requests.map((request, index) => (
                    <li key={index}>• {request}</li>
                  ))}
                </ul>
              </Card>
            )}
        </div>

        <DialogFooter className='gap-2 flex-col sm:flex-row'>
          <Button
            type='button'
            variant='outline'
            onClick={() => onOpenChange(false)}
            className='w-full sm:w-auto'>
            Close
          </Button>
          {trip.status === "in_progress" && nextWaypoint && (
            <Button
              className='w-full sm:w-auto'
              onClick={() => {
                // Open navigation to next waypoint
                if (nextWaypoint.latitude && nextWaypoint.longitude) {
                  const url = `https://www.google.com/maps/dir/?api=1&destination=${nextWaypoint.latitude},${nextWaypoint.longitude}`;
                  window.open(url, "_blank");
                } else {
                  alert("GPS coordinates not available for this waypoint");
                }
              }}>
              <Navigation className='h-4 w-4 mr-2' />
              Navigate to {nextWaypoint.name}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewRouteDialog;
