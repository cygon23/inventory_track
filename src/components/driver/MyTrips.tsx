import React, { useState, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext"; 
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MapPin,
  Clock,
  Users,
  Phone,
  Navigation,
  Car,
  CheckCircle,
  AlertCircle,
  Calendar,
  Loader2,
} from "lucide-react";

// Import modals
import ViewRouteDialog from "../modals/driver/ViewRouteDialog";
import EmergencyContactDialog from "../modals/driver/EmergencyContactDialog";
import StartNavigationDialog from "../modals/driver/StartNavigationDialog";
import CallCustomerDialog from "../modals/driver/CallCustomerDialog";
import UpdateTripStatusDialog from "../modals/driver/UpdateTripStatusDialog";
import StartTripDialog from "../modals/driver/StartTripDialog";

// Import hooks
import { useDriverTrips } from "../../features/driver/hooks/useDriverTrips";
import { useTripHelpers } from "../../features/driver/hooks/useTripHelpers";

// Import types
import type {
  TripWithDetails,
  TripStatus,
} from "../../features/driver/types/trip.types";

const MyTrips: React.FC = () => {
  const { user: currentUser, loading: authLoading } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<TripStatus | "all">("all");

  // Modal states
  const [isViewRouteOpen, setIsViewRouteOpen] = useState(false);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);
  const [isCallCustomerOpen, setIsCallCustomerOpen] = useState(false);
  const [isUpdateStatusOpen, setIsUpdateStatusOpen] = useState(false);
  const [isStartTripOpen, setIsStartTripOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<TripWithDetails | null>(
    null
  );


  if (authLoading) {
    return (
      <div className='flex items-center justify-center h-96'>
        <Loader2 className='h-8 w-8 animate-spin text-primary' />
      </div>
    );
  }

 
  if (!currentUser) {
    return (
      <div className='flex items-center justify-center h-96'>
        <p className='text-muted-foreground'>User not authenticated</p>
      </div>
    );
  }

  // Fetch trips data
  const {
    data: tripsData,
    isLoading,
    error,
  } = useDriverTrips(currentUser.id, {
    status: statusFilter,
    search: searchTerm,
  });

  const { transformTripForUI } = useTripHelpers();

  // Transform trips for UI
  const trips = useMemo(() => {
    return tripsData?.map(transformTripForUI) || [];
  }, [tripsData, transformTripForUI]);

  // Filter trips locally for instant feedback
  const filteredTrips = useMemo(() => {
    return trips.filter((trip) => {
      const matchesSearch =
        trip.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip.bookingRef.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip.package.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || trip.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [trips, searchTerm, statusFilter]);

  // Get current trip (in_progress)
  const currentTrip = useMemo(() => {
    const inProgressTrip = tripsData?.find((t) => t.status === "in_progress");
    return inProgressTrip ? transformTripForUI(inProgressTrip) : null;
  }, [tripsData, transformTripForUI]);

  const currentTripData = useMemo(() => {
    return tripsData?.find((t) => t.status === "in_progress") || null;
  }, [tripsData]);

  // Status badge helpers
  const getStatusColor = (status: string) => {
    switch (status) {
      case "in_progress":
        return "bg-primary/10 text-primary border-primary/20";
      case "scheduled":
        return "bg-warning/10 text-warning border-warning/20";
      case "completed":
        return "bg-success/10 text-success border-success/20";
      case "delayed":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "in_progress":
        return <Navigation className='h-4 w-4' />;
      case "scheduled":
        return <Clock className='h-4 w-4' />;
      case "completed":
        return <CheckCircle className='h-4 w-4' />;
      default:
        return <AlertCircle className='h-4 w-4' />;
    }
  };

  // Modal handlers
  const handleViewRoute = (trip: TripWithDetails) => {
    setSelectedTrip(trip);
    setIsViewRouteOpen(true);
  };

  const handleStartNavigation = (trip: TripWithDetails) => {
    setSelectedTrip(trip);
    setIsNavigationOpen(true);
  };

  const handleCallCustomer = (trip: TripWithDetails) => {
    setSelectedTrip(trip);
    setIsCallCustomerOpen(true);
  };

  const handleUpdateStatus = (trip: TripWithDetails) => {
    setSelectedTrip(trip);
    setIsUpdateStatusOpen(true);
  };

  const handleStartTrip = (trip: TripWithDetails) => {
    setSelectedTrip(trip);
    setIsStartTripOpen(true);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-96'>
        <Loader2 className='h-8 w-8 animate-spin text-primary' />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className='border-destructive'>
        <CardContent className='pt-6'>
          <div className='text-center space-y-2'>
            <AlertCircle className='h-12 w-12 text-destructive mx-auto' />
            <p className='text-destructive font-medium'>Failed to load trips</p>
            <p className='text-sm text-muted-foreground'>
              {error.message || "Please try again later"}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <div>
          <h1 className='text-2xl font-bold text-foreground'>My Trips</h1>
          <p className='text-muted-foreground'>
            Manage your assigned safari trips and routes
          </p>
        </div>
        <div className='flex gap-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => currentTripData && handleViewRoute(currentTripData)}
            disabled={!currentTripData}>
            <MapPin className='h-4 w-4 mr-2' />
            View Route
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setIsEmergencyOpen(true)}>
            <Phone className='h-4 w-4 mr-2' />
            Emergency Contact
          </Button>
        </div>
      </div>

      {/* Current Trip Status */}
      {currentTrip && currentTripData && (
        <Card className='border-primary'>
          <CardHeader className='pb-3'>
            <div className='flex items-center justify-between'>
              <CardTitle className='text-lg'>
                Current Trip in Progress
              </CardTitle>
              <Badge className={getStatusColor(currentTrip.status)}>
                {getStatusIcon(currentTrip.status)}
                <span className='ml-1 capitalize'>
                  {currentTrip.status.replace("_", " ")}
                </span>
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
              <div className='space-y-2'>
                <p className='text-sm text-muted-foreground'>Customer</p>
                <p className='font-medium'>{currentTrip.customer.name}</p>
                <p className='text-sm text-muted-foreground'>
                  {currentTrip.customer.phone}
                </p>
              </div>
              <div className='space-y-2'>
                <p className='text-sm text-muted-foreground'>
                  Current Location
                </p>
                <p className='font-medium flex items-center'>
                  <MapPin className='h-4 w-4 mr-1' />
                  {currentTrip.currentLocation}
                </p>
              </div>
              <div className='space-y-2'>
                <p className='text-sm text-muted-foreground'>
                  Next Destination
                </p>
                <p className='font-medium'>{currentTrip.nextDestination}</p>
                <p className='text-sm text-muted-foreground'>
                  ETA: {currentTrip.estimatedArrival}
                </p>
              </div>
              <div className='space-y-2'>
                <p className='text-sm text-muted-foreground'>Progress</p>
                <p className='font-medium'>
                  Day {currentTrip.currentDay} of {currentTrip.totalDays}
                </p>
                <p className='text-sm text-muted-foreground'>
                  {currentTrip.completedDistance} / {currentTrip.totalDistance}
                </p>
              </div>
            </div>
            <div className='mt-4 flex gap-2'>
              <Button
                size='sm'
                onClick={() => handleStartNavigation(currentTripData)}>
                <Navigation className='h-4 w-4 mr-2' />
                Start Navigation
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => handleCallCustomer(currentTripData)}>
                <Phone className='h-4 w-4 mr-2' />
                Call Customer
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => handleUpdateStatus(currentTripData)}>
                Update Status
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Trips List */}
      <Tabs defaultValue='list' className='space-y-4'>
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
          <TabsList>
            <TabsTrigger value='list'>Trip List</TabsTrigger>
            <TabsTrigger value='calendar'>Calendar View</TabsTrigger>
          </TabsList>

          <div className='flex gap-2 w-full sm:w-auto'>
            <Input
              placeholder='Search trips...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full sm:w-64'
            />
            <Select
              value={statusFilter}
              onValueChange={(value) =>
                setStatusFilter(value as TripStatus | "all")
              }>
              <SelectTrigger className='w-full sm:w-40'>
                <SelectValue placeholder='Status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Status</SelectItem>
                <SelectItem value='scheduled'>Scheduled</SelectItem>
                <SelectItem value='in_progress'>In Progress</SelectItem>
                <SelectItem value='completed'>Completed</SelectItem>
                <SelectItem value='delayed'>Delayed</SelectItem>
                <SelectItem value='cancelled'>Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value='list' className='space-y-4'>
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Booking Ref</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Package</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTrips.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className='text-center py-8'>
                      <p className='text-muted-foreground'>No trips found</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTrips.map((trip) => {
                    const tripData = tripsData?.find((t) => t.id === trip.id);
                    return (
                      <TableRow key={trip.id}>
                        <TableCell className='font-medium'>
                          {trip.bookingRef}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className='font-medium'>{trip.customer.name}</p>
                            <p className='text-sm text-muted-foreground'>
                              {trip.guests} guests
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{trip.package}</TableCell>
                        <TableCell>
                          <div className='text-sm'>
                            <p>{trip.startDate}</p>
                            <p className='text-muted-foreground'>
                              to {trip.endDate}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(trip.status)}>
                            {getStatusIcon(trip.status)}
                            <span className='ml-1 capitalize'>
                              {trip.status.replace("_", " ")}
                            </span>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className='text-sm'>
                            <p className='flex items-center'>
                              <Car className='h-3 w-3 mr-1' />
                              {trip.vehicle.split(" - ")[0]}
                            </p>
                            <p className='text-muted-foreground'>
                              {trip.vehicle.split(" - ")[1]}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className='flex gap-1'>
                            <Button
                              variant='outline'
                              size='sm'
                              onClick={() =>
                                tripData && handleViewRoute(tripData)
                              }>
                              View
                            </Button>
                            {trip.status === "scheduled" && (
                              <Button
                                variant='outline'
                                size='sm'
                                onClick={() =>
                                  tripData && handleStartTrip(tripData)
                                }>
                                Start
                              </Button>
                            )}
                            {trip.status === "in_progress" && (
                              <Button
                                variant='outline'
                                size='sm'
                                onClick={() =>
                                  tripData && handleUpdateStatus(tripData)
                                }>
                                Update
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value='calendar' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>Trip Calendar</CardTitle>
              <CardDescription>
                View your trips in calendar format
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                {filteredTrips.length === 0 ? (
                  <div className='col-span-full text-center py-8'>
                    <p className='text-muted-foreground'>No trips found</p>
                  </div>
                ) : (
                  filteredTrips.map((trip) => (
                    <Card key={trip.id} className='border'>
                      <CardHeader className='pb-2'>
                        <div className='flex items-center justify-between'>
                          <CardTitle className='text-sm'>
                            {trip.bookingRef}
                          </CardTitle>
                          <Badge className={getStatusColor(trip.status)}>
                            {getStatusIcon(trip.status)}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className='pt-0'>
                        <div className='space-y-2'>
                          <p className='font-medium'>{trip.customer.name}</p>
                          <p className='text-sm text-muted-foreground'>
                            {trip.package}
                          </p>
                          <div className='flex items-center text-sm'>
                            <Calendar className='h-3 w-3 mr-1' />
                            {trip.startDate} - {trip.endDate}
                          </div>
                          <div className='flex items-center text-sm'>
                            <Users className='h-3 w-3 mr-1' />
                            {trip.guests} guests
                          </div>
                          <div className='flex items-center text-sm'>
                            <Car className='h-3 w-3 mr-1' />
                            {trip.vehicle.split(" - ")[1]}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <ViewRouteDialog
        open={isViewRouteOpen}
        onOpenChange={setIsViewRouteOpen}
        trip={selectedTrip}
      />
      <EmergencyContactDialog
        open={isEmergencyOpen}
        onOpenChange={setIsEmergencyOpen}
      />
      <StartNavigationDialog
        open={isNavigationOpen}
        onOpenChange={setIsNavigationOpen}
        trip={selectedTrip}
        driverId={currentUser.id}
      />
      <CallCustomerDialog
        open={isCallCustomerOpen}
        onOpenChange={setIsCallCustomerOpen}
        trip={selectedTrip}
        driverId={currentUser.id}
      />
      <UpdateTripStatusDialog
        open={isUpdateStatusOpen}
        onOpenChange={setIsUpdateStatusOpen}
        trip={selectedTrip}
        driverId={currentUser.id}
      />
      <StartTripDialog
        open={isStartTripOpen}
        onOpenChange={setIsStartTripOpen}
        trip={selectedTrip}
        driverId={currentUser.id}
      />
    </div>
  );
};

export default MyTrips;
