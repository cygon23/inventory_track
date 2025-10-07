import React from "react";
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
  Clock,
  Users,
  Fuel,
  Navigation,
  CheckCircle,
  AlertTriangle,
  Car,
  Calendar,
  MessageSquare,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  useDashboardStats,
  useUpcomingTrips,
} from "@/features/driver/hooks/useDashboard";

const DriverDashboard: React.FC = () => {
  const { user: currentUser } = useAuth();

  // Fetch dashboard data
  const {
    data: dashboardData,
    isLoading: statsLoading,
    error: statsError,
  } = useDashboardStats(currentUser?.id || "");
  const { data: upcomingTrips, isLoading: tripsLoading } = useUpcomingTrips(
    currentUser?.id || ""
  );

  // Get vehicle from dashboardData instead of separate hook
  const vehicle = dashboardData?.vehicle;
  const currentTrip = dashboardData?.currentTrip;

  const currentDay =
    currentTrip && currentTrip.booking?.start_date
      ? Math.ceil(
          (new Date().setHours(0, 0, 0, 0) -
            new Date(currentTrip.booking.start_date).setHours(0, 0, 0, 0)) /
            (1000 * 60 * 60 * 24) +
            1
        )
      : 0;

  const tripDuration =
    currentTrip &&
    currentTrip.booking?.start_date &&
    currentTrip.booking?.end_date
      ? Math.ceil(
          (new Date(currentTrip.booking.end_date).getTime() -
            new Date(currentTrip.booking.start_date).getTime()) /
            (1000 * 60 * 60 * 24) +
            1
        )
      : "?";

  // Helper functions
  const formatTime = (timeStr: string) => {
    if (!timeStr) return "Time TBD";
    const [hours, minutes] = timeStr.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${
      months[date.getMonth()]
    } ${date.getDate()}, ${date.getFullYear()}`;
  };

  const formatTripDate = (dateStr: string) => {
    if (!dateStr) return "Date TBD";
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    today.setHours(0, 0, 0, 0);
    tomorrow.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    if (date.getTime() === today.getTime()) {
      return "Today";
    } else if (date.getTime() === tomorrow.getTime()) {
      return "Tomorrow";
    } else {
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      return `${months[date.getMonth()]} ${date.getDate()}`;
    }
  };

  const getTimeSince = (dateStr: string) => {
    if (!dateStr) return "Unknown";
    const date = new Date(dateStr);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const formatVehicleStatus = (status: string | undefined) => {
    if (!status) return "Unknown";

    const statusMap: Record<string, string> = {
      operational: "Operational",
      on_trip: "On Trip",
      maintenance: "In Maintenance",
      out_of_service: "Out of Service",
      available: "Available",
      assigned: "Assigned",
    };

    return (
      statusMap[status] || status.charAt(0).toUpperCase() + status.slice(1)
    );
  };

  if (statsLoading || tripsLoading) {
    return (
      <div className='flex items-center justify-center h-96'>
        <Loader2 className='h-8 w-8 animate-spin text-primary' />
      </div>
    );
  }

  // Error state
  if (statsError) {
    return (
      <div className='flex items-center justify-center h-96'>
        <div className='text-center'>
          <AlertTriangle className='h-12 w-12 text-destructive mx-auto mb-4' />
          <h3 className='text-lg font-semibold mb-2'>
            Error Loading Dashboard
          </h3>
          <p className='text-muted-foreground'>
            Please try refreshing the page
          </p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: "Today's Trips",
      value: dashboardData?.todayTrips?.length || 0,
      change: dashboardData?.todayTrips?.[0]?.start_time
        ? `Next: ${formatTime(dashboardData.todayTrips[0].start_time)}`
        : "No trips scheduled",
      icon: Calendar,
      color: "text-primary",
    },
    {
      title: "This Week",
      value: dashboardData?.weekTrips?.length || 0,
      change: `${
        dashboardData?.weekTrips?.filter((t) => t.status === "completed")
          .length || 0
      } completed`,
      icon: MapPin,
      color: "text-success",
    },
    {
      title: "Total People",
      value: dashboardData?.currentTrip?.booking?.guest_count || 0,
      change: dashboardData?.currentTrip?.booking?.guest_count
        ? `${dashboardData.currentTrip.booking.guest_count} people`
        : "No active trip",
      icon: Users,
      color: "text-warning",
    },
    {
      title: "Vehicle Status",
      value: formatVehicleStatus(vehicle?.status),
      change: vehicle?.last_service
        ? `Last service: ${getTimeSince(vehicle.last_service)}`
        : "Service date unknown",
      icon: Car,
      color:
        vehicle?.status === "operational" ? "text-success" : "text-warning",
    },
  ];

  const hasCurrentTrip = currentTrip && currentTrip.status === "in_progress";

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

  console.log("🚀 Dashboard Data:", dashboardData);
  console.log("🚗 Vehicle Data:", vehicle);

  return (
    <div className='space-y-6'>
      {/* Welcome Header */}
      <div>
        <h1 className='text-2xl md:text-3xl font-bold text-foreground'>
          Welcome back, {currentUser?.name}
        </h1>
        <p className='text-muted-foreground'>
          Ready for another great safari day! Check your schedule and vehicle
          status.
        </p>
      </div>

      {/* Stats Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6'>
        {stats.map((stat, index) => {
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
        {/* Current Trip */}
        <Card className='safari-card'>
          <CardHeader>
            <CardTitle className='flex items-center text-lg'>
              <Navigation className='h-5 w-5 mr-2 text-primary' />
              Current Trip
            </CardTitle>
            <CardDescription>
              {hasCurrentTrip ? "Active safari in progress" : "No active trip"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {hasCurrentTrip ? (
              <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <div>
                    <h3 className='font-semibold text-lg'>
                      {currentTrip.booking?.customer_name} (
                      {currentTrip.booking?.guest_count} people)
                    </h3>
                    <p className='text-sm text-muted-foreground'>
                      {currentTrip.booking?.safari_package}
                    </p>
                    <Badge className='mt-2 bg-success/10 text-success border-success/20'>
                      Day {currentDay} of {tripDuration}
                    </Badge>
                  </div>
                  <div className='text-right'>
                    <p className='text-sm font-medium'>
                      #{currentTrip.booking?.booking_reference}
                    </p>
                    <Badge className='bg-primary/10 text-primary border-primary/20'>
                      In Progress
                    </Badge>
                  </div>
                </div>

                <div className='border-t pt-4 space-y-3'>
                  <div className='flex items-center space-x-3'>
                    <MapPin className='h-4 w-4 text-primary' />
                    <div>
                      <p className='text-sm font-medium'>Current Location</p>
                      <p className='text-sm text-muted-foreground'>
                        {currentTrip.current_location || "Location updating..."}
                      </p>
                    </div>
                  </div>

                  {currentTrip.booking?.special_requests && (
                    <div className='bg-muted/50 p-3 rounded-lg'>
                      <p className='text-sm font-medium mb-1'>Guest Notes:</p>
                      <p className='text-sm text-muted-foreground'>
                        {currentTrip.booking.special_requests}
                      </p>
                    </div>
                  )}
                </div>

                <div className='flex space-x-2'>
                  <Button size='sm' className='flex-1'>
                    <Navigation className='h-4 w-4 mr-1' />
                    Navigate
                  </Button>
                  <Button size='sm' variant='outline' className='flex-1'>
                    <MessageSquare className='h-4 w-4 mr-1' />
                    Contact
                  </Button>
                </div>
              </div>
            ) : (
              <div className='text-center py-8'>
                <Car className='h-12 w-12 text-muted-foreground mx-auto mb-3' />
                <p className='text-muted-foreground'>
                  No active trip at the moment
                </p>
                <p className='text-sm text-muted-foreground mt-1'>
                  Check your upcoming trips below
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Vehicle Status */}
        <Card className='safari-card'>
          <CardHeader>
            <CardTitle className='flex items-center text-lg'>
              <Car className='h-5 w-5 mr-2 text-primary' />
              Vehicle Status
            </CardTitle>
            <CardDescription>Your assigned vehicle information</CardDescription>
          </CardHeader>
          <CardContent>
            {vehicle ? (
              <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <div>
                    <h3 className='font-semibold text-lg'>
                      {vehicle.model} ({vehicle.year})
                    </h3>
                    <p className='text-sm text-muted-foreground'>
                      Plate: {vehicle.plate}
                    </p>
                  </div>
                  <Badge
                    className={
                      vehicle.status === "operational"
                        ? "bg-success/10 text-success border-success/20"
                        : vehicle.status === "on_trip"
                        ? "bg-primary/10 text-primary border-primary/20"
                        : "bg-warning/10 text-warning border-warning/20"
                    }>
                    {formatVehicleStatus(vehicle.status)}
                  </Badge>
                </div>

                <div className='space-y-3'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center space-x-2'>
                      <Fuel className='h-4 w-4 text-primary' />
                      <span className='text-sm font-medium'>Fuel Level</span>
                    </div>
                    <span className='text-sm text-muted-foreground'>
                      {vehicle?.fuel_level || "N/A"}%
                    </span>
                  </div>
                  {vehicle.fuel_level && (
                    <div className='w-full bg-muted/50 rounded-full h-2'>
                      <div
                        className='bg-primary h-2 rounded-full transition-all duration-300'
                        style={{ width: `${vehicle.fuel_level}%` }}></div>
                    </div>
                  )}
                </div>

                <div className='grid grid-cols-2 gap-4 text-sm'>
                  <div>
                    <p className='font-medium'>Mileage</p>
                    <p className='text-muted-foreground'>
                      {vehicle.mileage
                        ? `${vehicle.mileage.toLocaleString()} km`
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className='font-medium'>Last Service</p>
                    <p className='text-muted-foreground'>
                      {vehicle?.last_maintenance_type || "N/A"}
                    </p>
                  </div>
                </div>

                <div className='flex items-center space-x-2 text-sm'>
                  <CheckCircle className='h-4 w-4 text-success' />
                  <span className='text-muted-foreground'>
                    Next service:{" "}
                    {vehicle.next_service
                      ? formatDate(vehicle.next_service)
                      : "Not scheduled"}
                  </span>
                </div>

                <Button size='sm' variant='outline' className='w-full'>
                  Report Issue
                </Button>
              </div>
            ) : (
              <div className='text-center py-8'>
                <Car className='h-12 w-12 text-muted-foreground mx-auto mb-3' />
                <p className='text-muted-foreground'>No vehicle assigned</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Trips */}
      <Card className='safari-card'>
        <CardHeader>
          <CardTitle className='flex items-center justify-between text-lg'>
            Upcoming Trips
            <Button variant='outline' size='sm'>
              View Schedule
            </Button>
          </CardTitle>
          <CardDescription>Your scheduled pickups and trips</CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingTrips && upcomingTrips.length > 0 ? (
            <div className='space-y-4'>
              {upcomingTrips.map((trip) => (
                <div
                  key={trip.id}
                  className='flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-border rounded-lg space-y-2 sm:space-y-0'>
                  <div className='flex items-center space-x-3'>
                    <div className='w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center'>
                      <Calendar className='h-5 w-5 text-primary' />
                    </div>
                    <div className='min-w-0 flex-1'>
                      <div className='flex items-center space-x-2'>
                        <p className='font-medium text-sm sm:text-base'>
                          {trip.booking?.customer_name}
                        </p>
                        <Badge
                          className={getPriorityColor(
                            trip.priority || "medium"
                          )}>
                          {trip.priority || "medium"}
                        </Badge>
                      </div>
                      <p className='text-xs sm:text-sm text-muted-foreground'>
                        {trip.booking?.safari_package}
                      </p>
                      <div className='flex items-center space-x-4 text-xs text-muted-foreground mt-1'>
                        <span>#{trip.booking?.booking_reference}</span>
                        <span>{trip.booking?.guest_count} guests</span>
                        <span>Pickup: {trip.pickup_location || "TBD"}</span>
                      </div>
                    </div>
                  </div>
                  <div className='flex flex-col sm:text-right space-y-1'>
                    <p className='text-sm font-medium'>
                      {formatTripDate(trip.start_date)}
                    </p>
                    <p className='text-sm text-muted-foreground'>
                      {formatTime(trip.start_time)}
                    </p>
                    <Button size='sm' variant='outline'>
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='text-center py-8'>
              <Calendar className='h-12 w-12 text-muted-foreground mx-auto mb-3' />
              <p className='text-muted-foreground'>
                No upcoming trips scheduled
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DriverDashboard;
