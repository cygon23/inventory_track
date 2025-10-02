import React, { useState, useEffect } from "react";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  UserCheck,
  Star,
  MapPin,
  Phone,
  Mail,
  Car,
  AlertCircle,
  CheckCircle,
  Search,
  Plus,
  Route,
  Loader2,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { driverService } from "../../services/driverService";
import AddDriverDialog from "../modals/AddDriverDialog";
import ViewScheduleDialog from "../modals/ViewScheduleDialog";

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
  const [viewScheduleOpen, setViewScheduleOpen] = useState(false);
  const [selectedDriverId, setSelectedDriverId] = useState<string>("");
  const [selectedDriverData, setSelectedDriverData] = useState<any | null>(
    null
  );

  // Data states
  const [drivers, setDrivers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch drivers on mount
  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    setIsLoading(true);
    setError(null);

    const { data, error: fetchError } = await driverService.getAllDrivers();

    if (fetchError) {
      setError(fetchError);
    } else if (data) {
      setDrivers(data);
    }

    setIsLoading(false);
  };

  const handleAddDriver = async (driverData: any) => {
    const { data, error } = await driverService.createDriver(driverData);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Error adding driver: ${error}`,
      });
    } else {
      toast({
        title: "Success",
        description: "Driver added successfully!",
      });
      fetchDrivers(); // Refresh the list
    }
  };

  const handleViewSchedule = async (driverId: string) => {
    const { data, error } = await driverService.getDriverById(driverId);

    if (error) {
      alert(`Error loading driver: ${error}`);
    } else if (data) {
      setSelectedDriverId(driverId);
      setSelectedDriverData(data);
      setViewScheduleOpen(true);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: "bg-success/10 text-success border-success/20",
      on_trip: "bg-primary/10 text-primary border-primary/20",
      on_leave: "bg-warning/10 text-warning border-warning/20",
      inactive: "bg-destructive/10 text-destructive border-destructive/20",
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

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const filteredDrivers = drivers.filter((driver) => {
    const userName = driver.user?.name || "";
    const userEmail = driver.user?.email || "";
    const vehiclePlate = driver.vehicle?.plate_number || "";
    const specialties = driver.specialties || [];

    const matchesSearch =
      userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      specialties.some((s: string) =>
        s.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === "all" || driver.user?.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  // Calculate stats
  const stats = [
    {
      title: "Total Drivers",
      value: drivers.length.toString(),
      change: `${
        drivers.filter((d) => d.user?.status === "active").length
      } available now`,
      icon: UserCheck,
      color: "text-primary",
    },
    {
      title: "On Active Trips",
      value: drivers
        .filter((d) => d.user?.status === "on_trip")
        .length.toString(),
      change: `${Math.round(
        (drivers.filter((d) => d.user?.status === "on_trip").length /
          drivers.length) *
          100
      )}% utilization`,
      icon: Route,
      color: "text-success",
    },
    {
      title: "Available",
      value: drivers
        .filter((d) => d.user?.status === "active")
        .length.toString(),
      change: "Ready for assignment",
      icon: CheckCircle,
      color: "text-success",
    },
    {
      title: "Pending Assignments",
      value: "0",
      change: "0 urgent",
      icon: AlertCircle,
      color: "text-destructive",
    },
  ];

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-96'>
        <Loader2 className='h-8 w-8 animate-spin text-primary' />
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex items-center justify-center h-96'>
        <div className='text-center'>
          <AlertCircle className='h-12 w-12 text-destructive mx-auto mb-4' />
          <p className='text-lg font-semibold'>Error loading drivers</p>
          <p className='text-muted-foreground'>{error}</p>
          <Button onClick={fetchDrivers} className='mt-4'>
            Retry
          </Button>
        </div>
      </div>
    );
  }

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

      {/* Dialogs */}
      <AddDriverDialog
        open={isAddDriverOpen}
        onOpenChange={setIsAddDriverOpen}
        onSubmit={handleAddDriver}
      />

      <ViewScheduleDialog
        open={viewScheduleOpen}
        onOpenChange={setViewScheduleOpen}
        driverName={selectedDriverData?.user?.name || "Unknown Driver"}
        driverId={selectedDriverId}
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

      <div className='grid grid-cols-1 gap-6'>
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
                  variant={filterStatus === "active" ? "default" : "outline"}
                  onClick={() => setFilterStatus("active")}
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
          {filteredDrivers.length === 0 ? (
            <Card className='safari-card'>
              <CardContent className='p-12 text-center'>
                <UserCheck className='h-12 w-12 mx-auto text-muted-foreground mb-4' />
                <p className='text-lg font-semibold'>No drivers found</p>
                <p className='text-muted-foreground'>
                  {searchTerm
                    ? "Try adjusting your search criteria"
                    : "Add your first driver to get started"}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredDrivers.map((driver) => (
              <Card key={driver.id} className='safari-card'>
                <CardContent className='p-4 md:p-6'>
                  <div className='flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0'>
                    <div className='flex items-start space-x-4'>
                      <Avatar className='h-12 w-12'>
                        <AvatarFallback>
                          {getInitials(driver.user?.name || "N/A")}
                        </AvatarFallback>
                      </Avatar>
                      <div className='space-y-2'>
                        <div>
                          <div className='flex items-center space-x-2'>
                            <h3 className='font-semibold text-lg'>
                              {driver.user?.name || "Unknown"}
                            </h3>
                            <Badge
                              className={getStatusColor(
                                driver.user?.status || "inactive"
                              )}>
                              {formatStatus(driver.user?.status || "inactive")}
                            </Badge>
                          </div>
                          <div className='flex items-center space-x-4 text-sm text-muted-foreground'>
                            <div className='flex items-center space-x-1'>
                              <Star className='h-4 w-4 text-warning fill-current' />
                              <span>
                                {driver.average_rating?.toFixed(1) || "0.0"}
                              </span>
                            </div>
                            <span>{driver.experience || "N/A"}</span>
                            <span>{driver.total_trips || 0} trips</span>
                          </div>
                        </div>

                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm'>
                          <div>
                            <p className='font-medium'>Contact</p>
                            <div className='space-y-1'>
                              <div className='flex items-center space-x-2'>
                                <Mail className='h-3 w-3 text-muted-foreground' />
                                <span>{driver.user?.email || "N/A"}</span>
                              </div>
                              <div className='flex items-center space-x-2'>
                                <Phone className='h-3 w-3 text-muted-foreground' />
                                <span>{driver.user?.phone || "N/A"}</span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <p className='font-medium'>Vehicle</p>
                            <div className='flex items-center space-x-2'>
                              <Car className='h-3 w-3 text-muted-foreground' />
                              <span>
                                {driver.vehicle?.model || "N/A"} (
                                {driver.vehicle?.plate_number || "N/A"})
                              </span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <p className='font-medium text-sm'>Specialties</p>
                          <div className='flex flex-wrap gap-1 mt-1'>
                            {driver.specialties &&
                            driver.specialties.length > 0 ? (
                              driver.specialties.map(
                                (specialty: string, index: number) => (
                                  <Badge
                                    key={index}
                                    variant='secondary'
                                    className='text-xs'>
                                    {specialty}
                                  </Badge>
                                )
                              )
                            ) : (
                              <span className='text-xs text-muted-foreground'>
                                No specialties listed
                              </span>
                            )}
                          </div>
                        </div>

                        <div>
                          <p className='font-medium text-sm'>Languages</p>
                          <p className='text-sm text-muted-foreground'>
                            {driver.languages && driver.languages.length > 0
                              ? driver.languages.join(", ")
                              : "No languages listed"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className='flex flex-col space-y-3 text-sm'>
                      {driver.user?.status === "active" ? (
                        <div className='bg-success/10 p-3 rounded-lg'>
                          <p className='font-medium text-success'>
                            Available Now
                          </p>
                          <p className='text-xs text-muted-foreground'>
                            Ready for assignment
                          </p>
                        </div>
                      ) : (
                        <div className='bg-primary/10 p-3 rounded-lg'>
                          <p className='font-medium'>Status</p>
                          <p className='text-muted-foreground'>
                            {formatStatus(driver.user?.status || "inactive")}
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

                        {driver.user?.status === "active" && (
                          <Button size='sm' className='flex-1'>
                            Assign Trip
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DriverAssignment;
