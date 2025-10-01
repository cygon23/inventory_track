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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  UserCheck,
  Calendar,
  Clock,
  Star,
  MapPin,
  Phone,
  Mail,
  Car,
  AlertCircle,
  CheckCircle,
  Search,
  Filter,
  Plus,
  Users,
  Route,
} from "lucide-react";

import AddDriverDialog from "../modals/AddDriverDialog";
import ViewScheduleDialog from "../modals/ViewScheduleDialog";
import AssignTripDialog from "../modals/AssignTripDialog";

interface User {
  id: string;
  name: string;
  role: string;
}

interface DriverAssignmentProps {
  currentUser?: User;
}

const DriverAssignment: React.FC<DriverAssignmentProps> = ({ currentUser }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isAddDriverOpen, setIsAddDriverOpen] = useState(false);

   const [addDriverOpen, setAddDriverOpen] = useState(false);
   const [viewScheduleOpen, setViewScheduleOpen] = useState(false);
   const [assignTripOpen, setAssignTripOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<string>("");
  const [selectedDriverData, setSelectedDriverData] = useState<any | null>(
    null
  );


   const handleViewSchedule = (driverId: string) => {
     setSelectedDriver(driverId);
     setViewScheduleOpen(true);
   };

   const handleAssignTrip = (driverId: string) => {
     setSelectedDriver(driverId);
     setAssignTripOpen(true);
   };

   const handleAcceptSuggestion = (tripId: string, driverId: string) => {
     console.log("Accepting suggestion:", tripId, driverId);
     // Handle auto-assignment logic here
   };

   const handleAssignManually = (tripId: string) => {
     console.log("Manual assignment for trip:", tripId);
     // Open driver selection dialog
   };

   

  const drivers = [
    {
      id: "D001",
      name: "James Mollel",
      email: "james.mollel@liontrack.com",
      phone: "+255-754-123-456",
      status: "on_trip",
      rating: 4.9,
      experience: "8 years",
      languages: ["English", "Swahili", "German"],
      specialties: ["Wildlife Photography", "Big 5 Safari", "Family Tours"],
      currentTrip: {
        id: "SF001",
        customer: "Johnson Family",
        location: "Serengeti Central",
        endTime: "5:00 PM",
      },
      vehicle: {
        model: "Toyota Land Cruiser",
        plate: "T123ABC",
        year: "2022",
      },
      totalTrips: 234,
      averageRating: 4.9,
      onTimePercentage: 98,
      nextAvailable: "2024-01-16 17:00",
      weeklySchedule: [
        { day: "Mon", available: false, trip: "SF001" },
        { day: "Tue", available: true, trip: null },
        { day: "Wed", available: true, trip: null },
        { day: "Thu", available: false, trip: "SF007" },
        { day: "Fri", available: false, trip: "SF007" },
        { day: "Sat", available: true, trip: null },
        { day: "Sun", available: true, trip: null },
      ],
    },
    {
      id: "D002",
      name: "Mary Kileo",
      email: "mary.kileo@liontrack.com",
      phone: "+255-754-234-567",
      status: "available",
      rating: 4.8,
      experience: "6 years",
      languages: ["English", "Swahili", "French"],
      specialties: ["Cultural Tours", "Honeymoon Safaris", "Luxury Tours"],
      currentTrip: null,
      vehicle: {
        model: "Toyota Land Cruiser",
        plate: "T456DEF",
        year: "2023",
      },
      totalTrips: 189,
      averageRating: 4.8,
      onTimePercentage: 96,
      nextAvailable: "Available now",
      weeklySchedule: [
        { day: "Mon", available: true, trip: null },
        { day: "Tue", available: true, trip: null },
        { day: "Wed", available: false, trip: "SF008" },
        { day: "Thu", available: false, trip: "SF008" },
        { day: "Fri", available: true, trip: null },
        { day: "Sat", available: true, trip: null },
        { day: "Sun", available: false, trip: "Personal" },
      ],
    },
    {
      id: "D003",
      name: "Peter Sanga",
      email: "peter.sanga@liontrack.com",
      phone: "+255-754-345-678",
      status: "on_trip",
      rating: 4.7,
      experience: "10 years",
      languages: ["English", "Swahili", "Italian"],
      specialties: ["Photography Tours", "Adventure Safari", "Solo Travelers"],
      currentTrip: {
        id: "SF003",
        customer: "Chen Group",
        location: "Tarangire NP",
        endTime: "7:00 PM",
      },
      vehicle: {
        model: "Toyota Land Cruiser",
        plate: "T789GHI",
        year: "2021",
      },
      totalTrips: 312,
      averageRating: 4.7,
      onTimePercentage: 94,
      nextAvailable: "2024-01-18 19:00",
      weeklySchedule: [
        { day: "Mon", available: false, trip: "SF003" },
        { day: "Tue", available: false, trip: "SF003" },
        { day: "Wed", available: false, trip: "SF003" },
        { day: "Thu", available: false, trip: "SF003" },
        { day: "Fri", available: false, trip: "SF003" },
        { day: "Sat", available: true, trip: null },
        { day: "Sun", available: true, trip: null },
      ],
    },
    {
      id: "D004",
      name: "Grace Mwamba",
      email: "grace.mwamba@liontrack.com",
      phone: "+255-754-456-789",
      status: "available",
      rating: 4.9,
      experience: "5 years",
      languages: ["English", "Swahili", "Spanish"],
      specialties: ["Family Safari", "Educational Tours", "Conservation Tours"],
      currentTrip: null,
      vehicle: {
        model: "Toyota Land Cruiser",
        plate: "T101JKL",
        year: "2023",
      },
      totalTrips: 156,
      averageRating: 4.9,
      onTimePercentage: 99,
      nextAvailable: "Available now",
      weeklySchedule: [
        { day: "Mon", available: true, trip: null },
        { day: "Tue", available: false, trip: "SF004" },
        { day: "Wed", available: false, trip: "SF004" },
        { day: "Thu", available: false, trip: "SF004" },
        { day: "Fri", available: false, trip: "SF004" },
        { day: "Sat", available: true, trip: null },
        { day: "Sun", available: true, trip: null },
      ],
    },
    {
      id: "D005",
      name: "John Kimaro",
      email: "john.kimaro@liontrack.com",
      phone: "+255-754-567-890",
      status: "on_leave",
      rating: 4.6,
      experience: "7 years",
      languages: ["English", "Swahili"],
      specialties: ["Budget Safari", "Group Tours", "Student Tours"],
      currentTrip: null,
      vehicle: {
        model: "Toyota Land Cruiser",
        plate: "T202MNO",
        year: "2020",
      },
      totalTrips: 203,
      averageRating: 4.6,
      onTimePercentage: 92,
      nextAvailable: "2024-01-20 (Back from leave)",
      weeklySchedule: [
        { day: "Mon", available: false, trip: "Leave" },
        { day: "Tue", available: false, trip: "Leave" },
        { day: "Wed", available: false, trip: "Leave" },
        { day: "Thu", available: false, trip: "Leave" },
        { day: "Fri", available: false, trip: "Leave" },
        { day: "Sat", available: true, trip: null },
        { day: "Sun", available: true, trip: null },
      ],
    },
  ];

  const pendingAssignments = [
    {
      id: "SF007",
      customer: "Wilson Family",
      package: "4-Day Northern Circuit",
      startDate: "2024-01-17",
      startTime: "7:00 AM",
      guests: 5,
      requirements: ["Child seats", "English speaking", "Family experience"],
      priority: "urgent",
      preferredDriver: "Any available",
      estimatedDuration: "4 days",
    },
    {
      id: "SF008",
      customer: "Anderson Group",
      package: "3-Day Cultural Safari",
      startDate: "2024-01-19",
      startTime: "6:30 AM",
      guests: 8,
      requirements: ["Large vehicle", "Cultural knowledge", "Multi-language"],
      priority: "high",
      preferredDriver: "Mary Kileo",
      estimatedDuration: "3 days",
    },
    {
      id: "SF009",
      customer: "Martinez Couple",
      package: "Honeymoon Safari",
      startDate: "2024-01-20",
      startTime: "8:00 AM",
      guests: 2,
      requirements: [
        "Romantic setup",
        "Photography skills",
        "Spanish speaking",
      ],
      priority: "medium",
      preferredDriver: "Grace Mwamba",
      estimatedDuration: "5 days",
    },
  ];

  const stats = [
    {
      title: "Total Drivers",
      value: "12",
      change: "2 available now",
      icon: UserCheck,
      color: "text-primary",
    },
    {
      title: "On Active Trips",
      value: "7",
      change: "58% utilization",
      icon: Route,
      color: "text-success",
    },
    {
      title: "Available",
      value: "3",
      change: "Ready for assignment",
      icon: CheckCircle,
      color: "text-success",
    },
    {
      title: "Pending Assignments",
      value: "5",
      change: "2 urgent",
      icon: AlertCircle,
      color: "text-destructive",
    },
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      available: "bg-success/10 text-success border-success/20",
      on_trip: "bg-primary/10 text-primary border-primary/20",
      on_leave: "bg-warning/10 text-warning border-warning/20",
      unavailable: "bg-destructive/10 text-destructive border-destructive/20",
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

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const mockSchedule = [
    {
      id: "s1",
      date: "2024-10-15",
      time: "08:00 AM",
      tripName: "Serengeti Day Safari",
      location: "Serengeti National Park",
      guests: 4,
      status: "upcoming" as const,
    },
    {
      id: "s2",
      date: "2024-10-18",
      time: "06:00 AM",
      tripName: "Ngorongoro Crater Tour",
      location: "Ngorongoro",
      guests: 6,
      status: "upcoming" as const,
    },
  ];

  const filteredDrivers = drivers.filter((driver) => {
    const matchesSearch =
      driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.specialties.some((s) =>
        s.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      driver.vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === "all" || driver.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0'>
        <div>
          <h1 className='text-2xl md:text-3xl font-bold text-foreground'>
            Driver Assignment
          </h1>
          <p className='text-muted-foreground'>
            Manage driver schedules and trip assignments
          </p>
        </div>
        <Button onClick={() => setIsAddDriverOpen(true)}>
          <Plus className='h-4 w-4 mr-2' />
          Add Driver
        </Button>
      </div>

      {/* Add Driver Dialog */}
      <AddDriverDialog
        open={isAddDriverOpen}
        onOpenChange={setIsAddDriverOpen}
        onSubmit={(data) => {
          console.log("New driver:", data);
          // TODO: save driver logic here
        }}
      />

      <ViewScheduleDialog
        open={viewScheduleOpen}
        onOpenChange={setViewScheduleOpen}
        driverName={selectedDriverData?.name || "Unknown Driver"}
        schedule={mockSchedule}
      />

      <AssignTripDialog
        open={assignTripOpen}
        onOpenChange={setAssignTripOpen}
        driverName={selectedDriverData?.name || "Unknown Driver"}
        onSubmit={(data) => console.log("Assign trip:", data)}
      />

      {/* Stats */}
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

      <div className='grid grid-cols-1 xl:grid-cols-3 gap-6'>
        {/* Driver List */}
        <div className='xl:col-span-2 space-y-6'>
          {/* Filters and Search */}
          <Card className='safari-card'>
            <CardContent className='p-4 md:p-6'>
              <div className='flex flex-col sm:flex-row gap-4'>
                <div className='relative flex-1'>
                  <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                  <Input
                    placeholder='Search drivers by name, specialty, or vehicle...'
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
                    variant={
                      filterStatus === "available" ? "default" : "outline"
                    }
                    onClick={() => setFilterStatus("available")}
                    size='sm'>
                    Available
                  </Button>
                  <Button
                    variant={filterStatus === "on_trip" ? "default" : "outline"}
                    onClick={() => setFilterStatus("on_trip")}
                    size='sm'>
                    On Trip
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Driver Cards */}
          <div className='space-y-4'>
            {filteredDrivers.map((driver) => (
              <Card key={driver.id} className='safari-card'>
                <CardContent className='p-4 md:p-6'>
                  <div className='flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0'>
                    <div className='flex items-start space-x-4'>
                      <Avatar className='h-12 w-12'>
                        <AvatarFallback>
                          {getInitials(driver.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className='space-y-2'>
                        <div>
                          <div className='flex items-center space-x-2'>
                            <h3 className='font-semibold text-lg'>
                              {driver.name}
                            </h3>
                            <Badge className={getStatusColor(driver.status)}>
                              {formatStatus(driver.status)}
                            </Badge>
                          </div>
                          <div className='flex items-center space-x-4 text-sm text-muted-foreground'>
                            <div className='flex items-center space-x-1'>
                              <Star className='h-4 w-4 text-warning fill-current' />
                              <span>{driver.rating}</span>
                            </div>
                            <span>{driver.experience}</span>
                            <span>{driver.totalTrips} trips</span>
                          </div>
                        </div>

                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm'>
                          <div>
                            <p className='font-medium'>Contact</p>
                            <div className='space-y-1'>
                              <div className='flex items-center space-x-2'>
                                <Mail className='h-3 w-3 text-muted-foreground' />
                                <span>{driver.email}</span>
                              </div>
                              <div className='flex items-center space-x-2'>
                                <Phone className='h-3 w-3 text-muted-foreground' />
                                <span>{driver.phone}</span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <p className='font-medium'>Vehicle</p>
                            <div className='flex items-center space-x-2'>
                              <Car className='h-3 w-3 text-muted-foreground' />
                              <span>
                                {driver.vehicle.model} ({driver.vehicle.plate})
                              </span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <p className='font-medium text-sm'>Specialties</p>
                          <div className='flex flex-wrap gap-1 mt-1'>
                            {driver.specialties.map((specialty, index) => (
                              <Badge
                                key={index}
                                variant='secondary'
                                className='text-xs'>
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <p className='font-medium text-sm'>Languages</p>
                          <p className='text-sm text-muted-foreground'>
                            {driver.languages.join(", ")}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className='flex flex-col space-y-3 text-sm'>
                      {driver.currentTrip ? (
                        <div className='bg-primary/10 p-3 rounded-lg'>
                          <p className='font-medium'>Current Trip</p>
                          <p className='text-muted-foreground'>
                            #{driver.currentTrip.id}
                          </p>
                          <p className='text-muted-foreground'>
                            {driver.currentTrip.customer}
                          </p>
                          <div className='flex items-center space-x-2 mt-1'>
                            <MapPin className='h-3 w-3 text-muted-foreground' />
                            <span>{driver.currentTrip.location}</span>
                          </div>
                          <p className='text-xs text-muted-foreground'>
                            Until {driver.currentTrip.endTime}
                          </p>
                        </div>
                      ) : (
                        <div className='bg-success/10 p-3 rounded-lg'>
                          <p className='font-medium text-success'>
                            Available Now
                          </p>
                          <p className='text-xs text-muted-foreground'>
                            Ready for assignment
                          </p>
                        </div>
                      )}

                      <div className='flex space-x-2'>
                        <Button
                          size='sm'
                          variant='outline'
                          className='flex-1'
                          onClick={() => handleViewSchedule(driver.id)}>
                          View Schedule
                        </Button>

                        {driver.status === "available" && (
                          <Button
                            size='sm'
                            className='flex-1'
                            onClick={() => handleAssignTrip(driver.id)}>
                            Assign Trip
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Pending Assignments */}
        <div className='space-y-6'>
          <Card className='safari-card'>
            <CardHeader>
              <CardTitle className='flex items-center'>
                <AlertCircle className='h-5 w-5 mr-2 text-warning' />
                Pending Assignments
              </CardTitle>
              <CardDescription>
                Trips waiting for driver assignment
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              {pendingAssignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className='p-4 border border-border rounded-lg space-y-3'>
                  <div className='flex items-start justify-between'>
                    <div>
                      <div className='flex items-center space-x-2'>
                        <h4 className='font-semibold'>{assignment.customer}</h4>
                        <Badge
                          className={getPriorityColor(assignment.priority)}>
                          {assignment.priority}
                        </Badge>
                      </div>
                      <p className='text-sm text-muted-foreground'>
                        {assignment.package}
                      </p>
                      <p className='text-xs text-muted-foreground'>
                        #{assignment.id}
                      </p>
                    </div>
                  </div>

                  <div className='space-y-2 text-sm'>
                    <div className='flex items-center justify-between'>
                      <span>Start Date:</span>
                      <span className='font-medium'>
                        {assignment.startDate} at {assignment.startTime}
                      </span>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span>Guests:</span>
                      <span>{assignment.guests} people</span>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span>Duration:</span>
                      <span>{assignment.estimatedDuration}</span>
                    </div>
                  </div>

                  <div>
                    <p className='font-medium text-sm'>Requirements</p>
                    <div className='flex flex-wrap gap-1 mt-1'>
                      {assignment.requirements.map((req, index) => (
                        <Badge
                          key={index}
                          variant='outline'
                          className='text-xs'>
                          {req}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className='flex space-x-2'>
                    <Button size='sm' className='flex-1'>
                      Auto-Assign
                    </Button>
                    <Button size='sm' variant='outline' className='flex-1'>
                      Manual
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DriverAssignment;
