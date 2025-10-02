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
import { Progress } from "@/components/ui/progress";
import {
  Car,
  Calendar,
  Fuel,
  Wrench,
  CheckCircle,
  AlertTriangle,
  Search,
  Eye,
  Settings,
  MapPin,
  Users,
} from "lucide-react";
import { callVehicleFunction } from "../../services/vehicleService";
import AddVehicleDialog from "../modals/AddVehicleDialog";
import VehicleDetailsDialog from "../modals/VehicleDetailsDialog";
import MaintenanceDialog from "../modals/MaintenanceDialog";
import AssignVehicleDialog from "../modals/AssignVehicleDialog";
import { toast } from "@/components/ui/use-toast";

interface User {
  id: string;
  name: string;
  role: string;
}

interface Vehicle {
  id: string;
  model: string;
  plate: string;
  year: number;
  status: string;
  condition: string;
  driver?: string | null;
  currentTrip?: any;
  mileage: number;
  fuelLevel: number;
  capacity: number;
  serviceDue: number;
  lastService: string;
  nextService?: string;
  features: string[];
  issues: { type: string; reported: string; description: string }[];
  maintenance: { type: string; cost: number; type: string }[];
}

interface VehicleManagementProps {
  currentUser: User;
}

const VehicleManagement: React.FC<VehicleManagementProps> = ({
  currentUser,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isMaintenanceOpen, setIsMaintenanceOpen] = useState(false);
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const response = await callVehicleFunction("fetchVehicles");
      if (response.vehicles) {
        setVehicles(response.vehicles);
      } else {
        console.error("Error fetching vehicles:", response.error);
        toast({
          title: "Error fetching vehicles",
          description:
            response.error instanceof Error
              ? response.error.message
              : String(response.error),
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to fetch vehicles",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const totalFleet = vehicles.length;
  const operational = vehicles.filter((v) => v.status === "available").length;
  const inMaintenance = vehicles.filter(
    (v) => v.status === "maintenance"
  ).length;
  const serviceDue = vehicles.filter((v) => v.serviceDue <= 7).length;

  const stats = [
    {
      title: "Total Fleet",
      value: totalFleet,
      icon: Car,
      color: "text-primary",
    },
    {
      title: "Operational",
      value: operational,
      icon: CheckCircle,
      color: "text-success",
    },
    {
      title: "In Maintenance",
      value: inMaintenance,
      icon: Wrench,
      color: "text-warning",
    },
    {
      title: "Service Due",
      value: serviceDue,
      icon: AlertTriangle,
      color: "text-destructive",
    },
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      available: "bg-success/10 text-success border-success/20",
      on_trip: "bg-primary/10 text-primary border-primary/20",
      scheduled: "bg-warning/10 text-warning border-warning/20",
      maintenance: "bg-warning/10 text-warning border-warning/20",
      out_of_service: "bg-muted/10 text-muted-foreground border-muted/20",
    };
    return (
      colors[status as keyof typeof colors] ||
      "bg-muted/10 text-muted-foreground border-muted/20"
    );
  };

  const getConditionColor = (condition: string) => {
    const colors = {
      excellent: "text-success",
      good: "text-primary",
      fair: "text-warning",
      poor: "text-destructive",
    };
    return colors[condition as keyof typeof colors] || "text-muted-foreground";
  };

  const formatStatus = (status: string) =>
    status
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  const getFuelLevelColor = (level: number) => {
    if (level >= 50) return "text-success";
    if (level >= 25) return "text-warning";
    return "text-destructive";
  };

  const getServiceDueColor = (days: number) => {
    if (days >= 30) return "text-success";
    if (days >= 7) return "text-warning";
    return "text-destructive";
  };

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch =
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (vehicle.driver &&
        vehicle.driver.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter =
      filterStatus === "all" || vehicle.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className='space-y-6'>
      <div className='flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0'>
        <div>
          <h1 className='text-2xl md:text-3xl font-bold text-foreground'>
            Vehicle Management
          </h1>
          <p className='text-muted-foreground'>
            Monitor fleet status, maintenance, and availability
          </p>
        </div>
        <Button onClick={() => setIsAddVehicleOpen(true)}>Add Vehicle</Button>
      </div>

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
                  </div>
                  <Icon className={`h-6 w-6 md:h-8 md:w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className='safari-card'>
        <CardContent className='p-4 md:p-6'>
          <div className='flex flex-col sm:flex-row gap-4'>
            <div className='relative flex-1'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='Search vehicles by model, plate, or driver...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='pl-10'
              />
            </div>
            <div className='flex space-x-2'>
              {["all", "available", "on_trip", "maintenance"].map((status) => (
                <Button
                  key={status}
                  variant={filterStatus === status ? "default" : "outline"}
                  onClick={() => setFilterStatus(status)}
                  size='sm'>
                  {status === "all"
                    ? "All"
                    : status === "available"
                    ? "Available"
                    : status === "on_trip"
                    ? "On Trip"
                    : "Maintenance"}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {filteredVehicles.map((vehicle) => (
          <Card key={vehicle.id} className='safari-card'>
            <CardHeader>
              <div className='flex items-start justify-between'>
                <div>
                  <CardTitle className='text-lg flex items-center space-x-2'>
                    <Car className='h-5 w-5' />
                    <span>
                      {vehicle.model} ({vehicle.year})
                    </span>
                  </CardTitle>
                  <CardDescription className='flex items-center space-x-4'>
                    <span>Plate: {vehicle.plate}</span>
                    <span>ID: {vehicle.id}</span>
                  </CardDescription>
                  <div className='flex items-center space-x-2 mt-2'>
                    <Badge className={getStatusColor(vehicle.status)}>
                      {formatStatus(vehicle.status)}
                    </Badge>
                    <span
                      className={`text-sm font-medium ${getConditionColor(
                        vehicle.condition
                      )}`}>
                      {vehicle.condition.charAt(0).toUpperCase() +
                        vehicle.condition.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className='space-y-4'>
              {vehicle.currentTrip ? (
                <div className='bg-primary/10 p-3 rounded-lg'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='font-medium text-sm'>Current Assignment</p>
                      <p className='text-sm text-muted-foreground'>
                        Trip #{vehicle.currentTrip.id}
                      </p>
                      <p className='text-sm'>{vehicle.currentTrip.customer}</p>
                    </div>
                    <div className='text-right text-sm'>
                      <p className='font-medium'>Driver: {vehicle.driver}</p>
                      <div className='flex items-center space-x-1'>
                        <MapPin className='h-3 w-3 text-muted-foreground' />
                        <span className='text-muted-foreground'>
                          {vehicle.currentTrip.location}
                        </span>
                      </div>
                      <p className='text-xs text-muted-foreground'>
                        Until {vehicle.currentTrip.endDate}
                      </p>
                    </div>
                  </div>
                </div>
              ) : vehicle.status === "available" ? (
                <div className='bg-success/10 p-3 rounded-lg'>
                  <p className='font-medium text-success'>
                    Available for Assignment
                  </p>
                  <p className='text-xs text-muted-foreground'>
                    Ready for immediate deployment
                  </p>
                </div>
              ) : vehicle.status === "maintenance" ? (
                <div className='bg-warning/10 p-3 rounded-lg'>
                  <p className='font-medium text-warning'>Under Maintenance</p>
                  <p className='text-xs text-muted-foreground'>
                    Service completion: {vehicle.nextService}
                  </p>
                </div>
              ) : null}

              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-3'>
                  <div>
                    <div className='flex items-center justify-between text-sm'>
                      <span>Fuel Level</span>
                      <span className={getFuelLevelColor(vehicle.fuelLevel)}>
                        {vehicle.fuelLevel}%
                      </span>
                    </div>
                    <Progress value={vehicle.fuelLevel} className='h-2 mt-1' />
                  </div>
                  <div className='text-sm'>
                    <p className='font-medium'>Mileage</p>
                    <p className='text-muted-foreground'>
                      {vehicle.mileage.toLocaleString()} km
                    </p>
                  </div>
                </div>
                <div className='space-y-3'>
                  <div className='text-sm'>
                    <p className='font-medium'>Capacity</p>
                    <div className='flex items-center space-x-1'>
                      <Users className='h-3 w-3 text-muted-foreground' />
                      <span>{vehicle.capacity} passengers</span>
                    </div>
                  </div>
                  <div className='text-sm'>
                    <p className='font-medium'>Service Due</p>
                    <p className={`${getServiceDueColor(vehicle.serviceDue)}`}>
                      {vehicle.serviceDue > 0
                        ? `${vehicle.serviceDue} days`
                        : "Overdue"}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <p className='font-medium text-sm mb-2'>Features</p>
                <div className='flex flex-wrap gap-1'>
                  {vehicle.features?.map((feature, index) => (
                    <Badge key={index} variant='outline' className='text-xs'>
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>

              {vehicle.issues?.length > 0 && (
                <div className='bg-destructive/10 p-3 rounded-lg'>
                  <p className='font-medium text-destructive text-sm mb-2'>
                    Active Issues
                  </p>
                  <div className='space-y-1'>
                    {vehicle.issues.map((issue, index) => (
                      <div key={index} className='text-sm'>
                        <div className='flex items-center space-x-2'>
                          <Badge variant='destructive' className='text-xs'>
                            {issue.type}
                          </Badge>
                          <span className='text-muted-foreground text-xs'>
                            Reported: {issue.reported}
                          </span>
                        </div>
                        <p className='text-destructive'>{issue.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className='text-sm'>
                <p className='font-medium'>Last Service</p>
                <p className='text-muted-foreground'>{vehicle.lastService}</p>
                {vehicle.maintenance?.length > 0 && (
                  <p className='text-xs text-muted-foreground'>
                    {vehicle.maintenance[0].type} -{" "}
                    {vehicle.maintenance[0].cost}
                  </p>
                )}
              </div>

              <div className='flex space-x-2'>
                <Button
                  size='sm'
                  variant='outline'
                  className='flex-1'
                  onClick={() => {
                    setSelectedVehicle(vehicle);
                    setIsDetailsOpen(true);
                  }}>
                  <Eye className='h-4 w-4 mr-1' /> Details
                </Button>
                <Button
                  size='sm'
                  variant='outline'
                  className='flex-1'
                  onClick={() => {
                    setSelectedVehicle(vehicle);
                    setIsMaintenanceOpen(true);
                  }}>
                  <Settings className='h-4 w-4 mr-1' /> Maintenance
                </Button>
                {vehicle.status === "available" && (
                  <Button
                    size='sm'
                    className='flex-1'
                    onClick={() => {
                      setSelectedVehicle(vehicle);
                      setIsAssignOpen(true);
                    }}>
                    Assign
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AddVehicleDialog
        open={isAddVehicleOpen}
        onOpenChange={setIsAddVehicleOpen}
        onSubmit={async (formData) => {
          const response = await callVehicleFunction("addVehicle", formData);
          if (response.vehicle) {
            toast({
              title: "Vehicle Added",
              description: "Vehicle added successfully",
            });
            fetchVehicles();
            setIsAddVehicleOpen(false);
          } else {
            toast({
              title: "Add Vehicle Failed",
              description:
                response.error instanceof Error
                  ? response.error.message
                  : String(response.error),
              variant: "destructive",
            });
          }
        }}
      />

      <VehicleDetailsDialog
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        vehicle={selectedVehicle}
      />

      <MaintenanceDialog
        open={isMaintenanceOpen}
        onOpenChange={setIsMaintenanceOpen}
        vehicle={selectedVehicle}
        onSubmit={async (formData) => {
          if (!selectedVehicle) return;
          const payload = {
            vehicle_id: selectedVehicle.id,
            type: formData.maintenanceType,
            date: formData.scheduledDate,
            cost: Number(formData.estimatedCost || 0),
            notes: formData.notes || "",
          };
          const response = await callVehicleFunction("addMaintenance", payload);
          if (response.maintenance) {
            toast({
              title: "Maintenance Scheduled",
              description: "Maintenance scheduled successfully",
            });
            fetchVehicles();
            setIsMaintenanceOpen(false);
          } else {
            toast({
              title: "Schedule Failed",
              description:
                response.error instanceof Error
                  ? response.error.message
                  : String(response.error),
              variant: "destructive",
            });
          }
        }}
      />

      <AssignVehicleDialog
        open={isAssignOpen}
        onOpenChange={setIsAssignOpen}
        vehicle={selectedVehicle}
        onSubmit={async (formData) => {
          if (!selectedVehicle) return;
          const payload = {
            vehicle_id: selectedVehicle.id,
            driver_id: formData.driverId,
            current_trip_id: formData.tripId || null,
          };
          const response = await callVehicleFunction("assignDriver", payload);
          if (response.vehicle) {
            toast({
              title: "Driver Assigned",
              description: "Driver assigned successfully",
            });
            fetchVehicles();
            setIsAssignOpen(false);
          } else {
            toast({
              title: "Assignment Failed",
              description:
                response.error instanceof Error
                  ? response.error.message
                  : String(response.error),
              variant: "destructive",
            });
          }
        }}
      />
    </div>
  );
};

export default VehicleManagement;
