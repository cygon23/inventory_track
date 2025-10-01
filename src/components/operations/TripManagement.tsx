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
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  MapPin,
  Calendar,
  Clock,
  Users,
  Navigation,
  AlertTriangle,
  CheckCircle,
  Car,
  UserCheck,
  Search,
  Filter,
  Eye,
  Edit,
  Route,
  Loader2,
} from "lucide-react";
import { useTrips } from "@/hooks/useTrips";
import { User } from "@/data/mockUsers";

interface TripManagementProps {
  currentUser: User;
}

const TripManagement: React.FC<TripManagementProps> = ({ currentUser }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Use the real data hook
  const { trips, stats, loading, error } = useTrips();

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    const colors = {
      scheduled: "bg-warning/10 text-warning border-warning/20",
      in_progress: "bg-primary/10 text-primary border-primary/20",
      completed: "bg-success/10 text-success border-success/20",
      cancelled: "bg-destructive/10 text-destructive border-destructive/20",
      delayed: "bg-destructive/10 text-destructive border-destructive/20",
    };
    return (
      colors[status as keyof typeof colors] ||
      "bg-muted/10 text-muted-foreground border-muted/20"
    );
  };

  // Get itinerary status color
  const getItineraryStatusColor = (status: string) => {
    const colors = {
      completed: "text-success",
      in_progress: "text-primary",
      pending: "text-muted-foreground",
    };
    return colors[status as keyof typeof colors] || "text-muted-foreground";
  };

  // Format status text
  const formatStatus = (status: string) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Stats display configuration
  const statsDisplay = [
    {
      title: "Active Trips",
      value: stats.active_trips.toString(),
      change: `${stats.active_trips} in progress`,
      icon: Route,
      color: "text-primary",
    },
    {
      title: "Scheduled Trips",
      value: stats.scheduled_trips.toString(),
      change: "Upcoming trips",
      icon: Calendar,
      color: "text-warning",
    },
    {
      title: "Completed Today",
      value: stats.completed_today.toString(),
      change:
        stats.completed_today > 0 ? "100% success rate" : "No completions",
      icon: CheckCircle,
      color: "text-success",
    },
    {
      title: "Issues Reported",
      value: stats.issues_reported.toString(),
      change: stats.issues_reported === 0 ? "All clear" : "Needs attention",
      icon: AlertTriangle,
      color: stats.issues_reported === 0 ? "text-success" : "text-destructive",
    },
  ];

  // Filter trips based on search and status
  const filteredTrips = trips.filter((trip) => {
    const matchesSearch =
      trip.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.package_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.driver_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.booking_reference
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      trip.id?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === "all" || trip.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  // Loading state
  if (loading) {
    return (
      <div className='flex items-center justify-center h-96'>
        <div className='text-center'>
          <Loader2 className='h-12 w-12 animate-spin text-primary mx-auto mb-4' />
          <p className='text-muted-foreground'>Loading trips...</p>
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
            <h3 className='text-lg font-semibold mb-2'>Error Loading Trips</h3>
            <p className='text-muted-foreground mb-4'>{error}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div>
        <h1 className='text-2xl md:text-3xl font-bold text-foreground'>
          Trip Management
        </h1>
        <p className='text-muted-foreground'>
          Monitor and coordinate all safari trips in real-time
        </p>
      </div>

      {/* Stats */}
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

      {/* Filters and Search */}
      <Card className='safari-card'>
        <CardContent className='p-4 md:p-6'>
          <div className='flex flex-col sm:flex-row gap-4'>
            <div className='relative flex-1'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='Search trips by customer, package, driver, or trip ID...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='pl-10'
              />
            </div>
            <div className='flex space-x-2'>
              <Button
                variant={filterStatus === "all" ? "default" : "outline"}
                onClick={() => setFilterStatus("all")}
                size='sm'>
                All
              </Button>
              <Button
                variant={filterStatus === "in_progress" ? "default" : "outline"}
                onClick={() => setFilterStatus("in_progress")}
                size='sm'>
                Active
              </Button>
              <Button
                variant={filterStatus === "scheduled" ? "default" : "outline"}
                onClick={() => setFilterStatus("scheduled")}
                size='sm'>
                Scheduled
              </Button>
              <Button
                variant={filterStatus === "completed" ? "default" : "outline"}
                onClick={() => setFilterStatus("completed")}
                size='sm'>
                Completed
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Empty State */}
      {filteredTrips.length === 0 && (
        <Card className='safari-card'>
          <CardContent className='p-12 text-center'>
            <Route className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
            <h3 className='text-lg font-semibold mb-2'>No trips found</h3>
            <p className='text-muted-foreground'>
              {searchTerm || filterStatus !== "all"
                ? "Try adjusting your search or filters"
                : "Trips will appear here when bookings are marked as paid"}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Trip Cards */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {filteredTrips.map((trip) => (
          <Card key={trip.id} className='safari-card'>
            <CardHeader>
              <div className='flex items-start justify-between'>
                <div>
                  <CardTitle className='text-lg'>
                    {trip.customer_name}
                  </CardTitle>
                  <CardDescription>{trip.package_name}</CardDescription>
                  <div className='flex items-center space-x-2 mt-2'>
                    <Badge className={getStatusColor(trip.status)}>
                      {formatStatus(trip.status)}
                    </Badge>
                    {trip.booking_reference && (
                      <span className='text-sm text-muted-foreground'>
                        #{trip.booking_reference}
                      </span>
                    )}
                  </div>
                </div>
                <div className='text-right text-sm'>
                  <p className='font-medium'>{formatDate(trip.start_date)}</p>
                  <p className='text-muted-foreground'>
                    to {formatDate(trip.end_date)}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className='space-y-4'>
              {/* Trip Details */}
              <div className='grid grid-cols-2 gap-4 text-sm'>
                <div className='space-y-2'>
                  <div className='flex items-center space-x-2'>
                    <UserCheck className='h-4 w-4 text-muted-foreground' />
                    <span className='truncate'>
                      Driver: {trip.driver_name || "Not assigned"}
                    </span>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <Car className='h-4 w-4 text-muted-foreground' />
                    <span className='truncate'>
                      {trip.vehicle_model && trip.vehicle_plate
                        ? `${trip.vehicle_model} - ${trip.vehicle_plate}`
                        : "Not assigned"}
                    </span>
                  </div>
                </div>
                <div className='space-y-2'>
                  <div className='flex items-center space-x-2'>
                    <Users className='h-4 w-4 text-muted-foreground' />
                    <span>{trip.guests} guests</span>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <MapPin className='h-4 w-4 text-muted-foreground' />
                    <span className='truncate'>
                      {trip.current_location || "Starting soon"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress */}
              {trip.status === "in_progress" && (
                <div className='space-y-2'>
                  <div className='flex items-center justify-between text-sm'>
                    <span>Trip Progress</span>
                    <span>{trip.progress}%</span>
                  </div>
                  <Progress value={trip.progress} className='h-2' />
                  {trip.next_stop && (
                    <div className='flex items-center justify-between text-sm'>
                      <span>Next: {trip.next_stop}</span>
                      {trip.estimated_arrival && (
                        <span className='text-muted-foreground'>
                          ETA: {trip.estimated_arrival}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Itinerary */}
              {trip.itinerary && trip.itinerary.length > 0 && (
                <div className='space-y-2'>
                  <h4 className='font-medium text-sm'>Itinerary</h4>
                  <div className='space-y-1'>
                    {trip.itinerary.map((item) => (
                      <div
                        key={item.id}
                        className='flex items-center justify-between text-sm'>
                        <div className='flex items-center space-x-2'>
                          <div
                            className={`w-2 h-2 rounded-full ${
                              item.status === "completed"
                                ? "bg-success"
                                : item.status === "in_progress"
                                ? "bg-primary"
                                : "bg-muted"
                            }`}
                          />
                          <span>
                            Day {item.day_number}: {item.location}
                          </span>
                        </div>
                        <CheckCircle
                          className={`h-4 w-4 ${getItineraryStatusColor(
                            item.status
                          )}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {trip.notes && (
                <div className='bg-muted/50 p-3 rounded-lg'>
                  <p className='text-sm font-medium mb-1'>Notes:</p>
                  <p className='text-sm text-muted-foreground'>{trip.notes}</p>
                </div>
              )}

              {/* Actions */}
              <div className='flex space-x-2'>
                <Button size='sm' variant='outline' className='flex-1'>
                  <Eye className='h-4 w-4 mr-1' />
                  View Details
                </Button>
                <Button size='sm' variant='outline' className='flex-1'>
                  <Navigation className='h-4 w-4 mr-1' />
                  Track Live
                </Button>
                {trip.status === "scheduled" && (
                  <Button size='sm' className='flex-1'>
                    <Edit className='h-4 w-4 mr-1' />
                    Modify
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TripManagement;
