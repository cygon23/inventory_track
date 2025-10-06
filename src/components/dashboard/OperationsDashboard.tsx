import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Car,
  Users,
  Calendar,
  Navigation,
  AlertTriangle,
  CheckCircle,
  Clock,
  UserCheck,
  Loader2,
} from "lucide-react";
import { useOperations } from "@/hooks/useOperations";
import RealTimeMapDialog from "../modals/operational/RealTimeMapDialog";
import ManageScheduleDialog from "../modals/operational/ManageScheduleDialog";
import AssignDriverDialog from "../modals/operational/AssignDriverDialog";
import AutoAssignDialog from "../modals/operational/AutoAssignDialog";
import ViewTripDetailsDialog from "../modals/operational/ViewTripDetailsDialog";

const OperationsDashboard: React.FC = () => {
  const currentUser = { name: "Operations Manager" };

  // Fetch real data
  const {
    activeTrips,
    drivers,
    pendingTrips,
    vehicles,
    stats,
    loading,
    error,
    assignTripResources,
    updateDriverSchedule,
    updateTripStatus,
  } = useOperations();

  // Modal states
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [isAutoAssignOpen, setIsAutoAssignOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<any>(null);
  const [selectedDriver, setSelectedDriver] = useState<any>(null);

  // Stats display configuration
  const statsDisplay = [
    {
      title: "Active Trips",
      value: stats.active_trips.toString(),
      change: `${stats.active_trips} in progress`,
      icon: MapPin,
      color: "text-primary",
    },
    {
      title: "Available Drivers",
      value: stats.available_drivers.toString(),
      change: `${drivers.length - stats.available_drivers} on trip`,
      icon: UserCheck,
      color: "text-success",
    },
    {
      title: "Fleet Status",
      value: `${stats.operational_vehicles}/${stats.total_vehicles}`,
      change: `${stats.total_vehicles - stats.operational_vehicles} in use`,
      icon: Car,
      color: "text-warning",
    },
    {
      title: "Pending Assignments",
      value: stats.pending_assignments.toString(),
      change:
        pendingTrips.filter((t) => t.priority === "urgent").length > 0
          ? `${
              pendingTrips.filter((t) => t.priority === "urgent").length
            } urgent`
          : "All scheduled",
      icon: Clock,
      color:
        stats.pending_assignments > 0 ? "text-destructive" : "text-success",
    },
  ];

  // Get status badge colors
  const getStatusColor = (status: string) => {
    const colors = {
      in_progress: "bg-primary/10 text-primary border-primary/20",
      in_transit: "bg-primary/10 text-primary border-primary/20",
      game_drive: "bg-success/10 text-success border-success/20",
      lunch_break: "bg-warning/10 text-warning border-warning/20",
      on_trip: "bg-primary/10 text-primary border-primary/20",
      available: "bg-success/10 text-success border-success/20",
      maintenance: "bg-destructive/10 text-destructive border-destructive/20",
      on_leave: "bg-muted/10 text-muted-foreground border-muted/20",
    };
    return (
      colors[status as keyof typeof colors] ||
      "bg-muted/10 text-muted-foreground border-muted/20"
    );
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      urgent: "bg-destructive/10 text-destructive border-destructive/20",
      high: "bg-warning/10 text-warning border-warning/20",
      medium: "bg-primary/10 text-primary border-primary/20",
      low: "bg-muted/10 text-muted-foreground border-muted/20",
    };
    return (
      colors[priority as keyof typeof colors] ||
      "bg-muted/10 text-muted-foreground border-muted/20"
    );
  };

  const formatStatus = (status: string) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  // Handle driver assignment
const handleAssignDriver = async (
  tripId: string,
  driverId: string,
  vehicleId: string
) => {
  if (!tripId || !driverId || !vehicleId) {
    alert("Missing required information");
    return;
  }

  try {
    await assignTripResources(tripId, driverId, vehicleId);
    setIsAssignOpen(false);
    setSelectedTrip(null);
  } catch (err) {
    console.error("Assignment failed:", err);
    alert(err instanceof Error ? err.message : "Failed to assign driver");
  }
};

  // Loading state
  if (loading) {
    return (
      <div className='flex items-center justify-center h-96'>
        <div className='text-center'>
          <Loader2 className='h-12 w-12 animate-spin text-primary mx-auto mb-4' />
          <p className='text-muted-foreground'>Loading operations data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className='flex items-center justify-center h-96'>
        <Card className='safari-card max-w-md'>
          <CardContent className='p-6 text-center'>
            <AlertTriangle className='h-12 w-12 text-destructive mx-auto mb-4' />
            <h3 className='text-lg font-semibold mb-2'>Error Loading Data</h3>
            <p className='text-muted-foreground mb-4'>{error}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Welcome Header */}
      <div>
        <h1 className='text-2xl md:text-3xl font-bold text-foreground'>
          Operations Center, {currentUser.name}
        </h1>
        <p className='text-muted-foreground'>
          Monitor active trips, manage driver assignments, and coordinate field
          operations
        </p>
      </div>

      {/* Stats Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6'>
        {statsDisplay.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className='safari-card'>
              <CardContent className='p-4 md:p-6'>
                <div className='flex items-center justify-between'>
                  <div className='space-y-1'>
                    <p className='text-sm font-medium text-muted-foreground'>
                      {stat.title}
                    </p>
                    <p className='text-xl md:text-2xl font-bold'>
                      {stat.value}
                    </p>
                    <p className='text-xs text-muted-foreground'>
                      {stat.change}
                    </p>
                  </div>
                  <Icon className={`h-6 w-6 md:h-8 md:w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className='grid grid-cols-1 xl:grid-cols-2 gap-6'>
        {/* Active Trips */}
        <Card className='safari-card'>
          <CardHeader>
            <CardTitle className='flex items-center justify-between text-lg'>
              <span className='flex items-center'>
                <Navigation className='h-5 w-5 mr-2 text-primary' />
                Active Trips
              </span>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setIsMapOpen(true)}>
                Real-time Map
              </Button>
            </CardTitle>
            <CardDescription>
              Live tracking of ongoing safari trips
            </CardDescription>
          </CardHeader>
          <CardContent>
            {activeTrips.length === 0 ? (
              <div className='text-center py-8 text-muted-foreground'>
                <CheckCircle className='h-12 w-12 mx-auto mb-2 opacity-50' />
                <p>No active trips at the moment</p>
              </div>
            ) : (
              <div className='space-y-4'>
                {activeTrips.map((trip) => (
                  <div
                    key={trip.id}
                    className='p-4 border border-border rounded-lg space-y-3'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <div className='flex items-center space-x-2'>
                          <h4 className='font-semibold text-sm sm:text-base'>
                            {trip.customer_name}
                          </h4>
                          <Badge className={getStatusColor(trip.status)}>
                            {formatStatus(trip.status)}
                          </Badge>
                        </div>
                        <p className='text-xs sm:text-sm text-muted-foreground'>
                          Driver: {trip.driver_name || "Unassigned"} •{" "}
                          {trip.vehicle_plate || "No vehicle"}
                        </p>
                      </div>
                      <div className='text-right'>
                        <p className='text-sm font-medium'>
                          #{trip.id.slice(0, 8)}
                        </p>
                        <p className='text-xs text-muted-foreground'>
                          {trip.current_location}
                        </p>
                      </div>
                    </div>

                    <div className='space-y-2'>
                      <div className='flex items-center justify-between text-sm'>
                        <span>Progress</span>
                        <span>{trip.progress}%</span>
                      </div>
                      <div className='w-full bg-muted/50 rounded-full h-2'>
                        <div
                          className='bg-primary h-2 rounded-full transition-all duration-300'
                          style={{ width: `${trip.progress}%` }}></div>
                      </div>
                    </div>

                    {trip.next_stop && (
                      <div className='flex items-center justify-between text-sm'>
                        <div className='flex items-center space-x-2'>
                          <MapPin className='h-4 w-4 text-primary' />
                          <span>Next: {trip.next_stop}</span>
                        </div>
                        {trip.estimated_arrival && (
                          <div className='flex items-center space-x-2'>
                            <Clock className='h-4 w-4 text-muted-foreground' />
                            <span className='text-muted-foreground'>
                              ETA: {trip.estimated_arrival}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Driver Status */}
        <Card className='safari-card'>
          <CardHeader>
            <CardTitle className='flex items-center justify-between text-lg'>
              <span className='flex items-center'>
                <UserCheck className='h-5 w-5 mr-2 text-primary' />
                Driver Status
              </span>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setIsScheduleOpen(true)}>
                Manage Schedule
              </Button>
            </CardTitle>
            <CardDescription>
              Current driver availability and assignments
            </CardDescription>
          </CardHeader>
          <CardContent>
            {drivers.length === 0 ? (
              <div className='text-center py-8 text-muted-foreground'>
                <UserCheck className='h-12 w-12 mx-auto mb-2 opacity-50' />
                <p>No drivers found</p>
              </div>
            ) : (
              <div className='space-y-4'>
                {drivers.map((driver) => (
                  <div
                    key={driver.id}
                    className='flex items-center justify-between p-3 border border-border rounded-lg'>
                    <div className='flex items-center space-x-3'>
                      <div className='w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center'>
                        <UserCheck className='h-5 w-5 text-primary' />
                      </div>
                      <div className='min-w-0 flex-1'>
                        <div className='flex items-center space-x-2'>
                          <p className='font-medium text-sm'>{driver.name}</p>
                          <Badge className={getStatusColor(driver.status)}>
                            {formatStatus(driver.status)}
                          </Badge>
                        </div>
                        <p className='text-xs text-muted-foreground'>
                          {driver.status === "on_trip"
                            ? `Trip: ${driver.current_trip_id?.slice(0, 8)}`
                            : "Arusha Base"}{" "}
                          {driver.vehicle_plate && `• ${driver.vehicle_plate}`}
                        </p>
                        <p className='text-xs text-muted-foreground'>
                          ⭐ {driver.average_rating.toFixed(1)} •{" "}
                          {driver.total_trips} trips
                        </p>
                      </div>
                    </div>
                    <Button
                      size='sm'
                      variant='outline'
                      disabled={driver.status === "on_trip"}
                      onClick={() => {
                        setSelectedDriver(driver);
                        setIsAssignOpen(true);
                      }}>
                      {driver.status === "available" ? "Assign" : "Busy"}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Pending Assignments */}
      <Card className='safari-card'>
        <CardHeader>
          <CardTitle className='flex items-center justify-between text-lg'>
            <span className='flex items-center'>
              <AlertTriangle className='h-5 w-5 mr-2 text-warning' />
              Pending Assignments
            </span>
            <Button
              variant='outline'
              size='sm'
              disabled={pendingTrips.length === 0}
              onClick={() => setIsAutoAssignOpen(true)}>
              Auto-Assign
            </Button>
          </CardTitle>
          <CardDescription>
            Trips that need driver and vehicle assignment
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingTrips.length === 0 ? (
            <div className='text-center py-8 text-muted-foreground'>
              <CheckCircle className='h-12 w-12 mx-auto mb-2 text-success opacity-50' />
              <p>All trips are assigned!</p>
            </div>
          ) : (
            <div className='space-y-4'>
              {pendingTrips.map((trip) => (
                <div
                  key={trip.id}
                  className='p-4 border border-border rounded-lg space-y-3'>
                  <div className='flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0'>
                    <div>
                      <div className='flex items-center space-x-2'>
                        <h4 className='font-semibold text-sm sm:text-base'>
                          {trip.customer_name}
                        </h4>
                        <Badge className={getPriorityColor(trip.priority)}>
                          {trip.priority}
                        </Badge>
                      </div>
                      <p className='text-xs sm:text-sm text-muted-foreground'>
                        {trip.package_name}
                      </p>
                      <p className='text-xs text-muted-foreground'>
                        #{trip.booking_reference} • {trip.guests} guests
                      </p>
                    </div>
                    <div className='text-left sm:text-right'>
                      <p className='text-sm font-medium'>
                        {formatDate(trip.start_date)}
                      </p>
                      <p className='text-xs text-muted-foreground'>
                        Starts: {new Date(trip.start_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {trip.notes && (
                    <div className='bg-muted/50 p-2 rounded text-xs'>
                      <span className='font-medium'>Notes: </span>
                      {trip.notes}
                    </div>
                  )}

                  <div className='flex space-x-2'>
                    <Button
                      size='sm'
                      className='flex-1'
                      onClick={() => {
                        setSelectedTrip(trip);
                        setIsAssignOpen(true);
                      }}>
                      Assign Driver
                    </Button>
                    <Button
                      size='sm'
                      variant='outline'
                      className='flex-1'
                      onClick={() => {
                        setSelectedTrip(trip);
                        setIsDetailsOpen(true);
                      }}>
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <RealTimeMapDialog
        open={isMapOpen}
        onOpenChange={setIsMapOpen}
        trips={activeTrips.map((trip) => ({
          id: trip.id,
          driver: trip.driver_name || "Unassigned",
          customers: trip.customer_name,
          route: trip.current_location || "In transit",
          status: trip.status,
          progress: trip.progress,
          nextStop: trip.next_stop || "Unknown",
          estimatedArrival: trip.estimated_arrival || "N/A",
          vehicle: trip.vehicle_plate || "No vehicle",
        }))}
      />

      <ManageScheduleDialog
        open={isScheduleOpen}
        onOpenChange={setIsScheduleOpen}
        drivers={drivers}
        onUpdateSchedule={updateDriverSchedule}
      />

      <AssignDriverDialog
        open={isAssignOpen}
        onOpenChange={setIsAssignOpen}
        tripData={selectedTrip}
        selectedDriver={selectedDriver}
        availableDrivers={drivers.filter((d) => d.status === "available")}
        availableVehicles={vehicles}
        onSubmit={(data) => {
          handleAssignDriver(data.tripId, data.driverId, data.vehicleId);
        }}
      />

      <AutoAssignDialog
        open={isAutoAssignOpen}
        onOpenChange={setIsAutoAssignOpen}
        pendingAssignments={pendingTrips.map((trip) => ({
          id: trip.id,
          customer: trip.customer_name,
          package: trip.package_name,
          startDate: new Date(trip.start_date).toLocaleDateString(),
          pickup: "Arusha", // Default pickup location
          guests: trip.guests,
          preferredDriver: "Any available",
          priority: trip.priority,
          requirements: trip.notes || "",
        }))}
        onSubmit={(selectedTripIds) => {
          console.log("Selected trips for auto-assignment:", selectedTripIds);
          setIsAutoAssignOpen(false);
          alert("Auto-assignment feature coming soon!");
        }}
      />

      <ViewTripDetailsDialog
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        tripDetails={selectedTrip}
        onAssign={() => {
          setIsDetailsOpen(false);
          setIsAssignOpen(true);
        }}
      />
    </div>
  );
};

export default OperationsDashboard;
