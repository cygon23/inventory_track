import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Car,
  Calendar,
  Users,
  Fuel,
  MapPin,
  CheckCircle,
  AlertTriangle,
  Wrench,
  Clock,
} from "lucide-react";

interface Vehicle {
  id: string;
  model: string;
  year: string;
  plate: string;
  status: string;
  condition: string;
  driver: string | null;
  currentTrip: {
    id: string;
    customer: string;
    location: string;
    endDate: string;
  } | null;
  mileage: number;
  fuelLevel: number;
  lastService: string;
  nextService: string;
  serviceDue: number;
  capacity: number;
  features?: string[]; // <-- optional
  maintenance?: Array<{ type: string; date: string; cost: string }>; // optional
  issues?: Array<{ type: string; description: string; reported: string }>; // optional
}

interface VehicleDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicle: Vehicle | null;
}

const VehicleDetailsDialog: React.FC<VehicleDetailsDialogProps> = ({
  open,
  onOpenChange,
  vehicle,
}) => {
  if (!vehicle) return null;

  const getStatusColor = (status: string) => {
    const colors = {
      available: "bg-success/10 text-success border-success/20",
      on_trip: "bg-primary/10 text-primary border-primary/20",
      scheduled: "bg-warning/10 text-warning border-warning/20",
      maintenance: "bg-destructive/10 text-destructive border-destructive/20",
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

  const features = vehicle.features || [];
  const maintenance = vehicle.maintenance || [];
  const issues = vehicle.issues || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center space-x-2'>
            <Car className='h-5 w-5' />
            <span>
              {vehicle.model} ({vehicle.year})
            </span>
          </DialogTitle>
          <DialogDescription>
            Complete vehicle information and status
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Basic Info */}
          <div>
            <h3 className='font-semibold mb-3'>Basic Information</h3>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <p className='text-sm text-muted-foreground'>Vehicle ID</p>
                <p className='font-medium'>{vehicle.id}</p>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>License Plate</p>
                <p className='font-medium'>{vehicle.plate}</p>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Model</p>
                <p className='font-medium'>{vehicle.model}</p>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Year</p>
                <p className='font-medium'>{vehicle.year}</p>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Status</p>
                <Badge className={getStatusColor(vehicle.status)}>
                  {vehicle.status.replace("_", " ").toUpperCase()}
                </Badge>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Condition</p>
                <p
                  className={`font-medium ${getConditionColor(
                    vehicle.condition
                  )}`}>
                  {vehicle.condition.charAt(0).toUpperCase() +
                    vehicle.condition.slice(1)}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Current Trip */}
          {vehicle.currentTrip && (
            <>
              <div className='bg-primary/10 p-4 rounded-lg'>
                <h3 className='font-semibold mb-3 flex items-center'>
                  <MapPin className='h-4 w-4 mr-2' />
                  Current Trip
                </h3>
                <div className='grid grid-cols-2 gap-3 text-sm'>
                  <div>
                    <p className='text-muted-foreground'>Trip ID</p>
                    <p className='font-medium'>#{vehicle.currentTrip.id}</p>
                  </div>
                  <div>
                    <p className='text-muted-foreground'>Customer</p>
                    <p className='font-medium'>
                      {vehicle.currentTrip.customer}
                    </p>
                  </div>
                  <div>
                    <p className='text-muted-foreground'>Location</p>
                    <p className='font-medium'>
                      {vehicle.currentTrip.location}
                    </p>
                  </div>
                  <div>
                    <p className='text-muted-foreground'>End Date</p>
                    <p className='font-medium'>{vehicle.currentTrip.endDate}</p>
                  </div>
                  {vehicle.driver && (
                    <div className='col-span-2'>
                      <p className='text-muted-foreground'>Driver</p>
                      <p className='font-medium'>{vehicle.driver}</p>
                    </div>
                  )}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Vehicle Metrics */}
          <div>
            <h3 className='font-semibold mb-3'>Vehicle Metrics</h3>
            <div className='space-y-4'>
              <div>
                <div className='flex items-center justify-between mb-2'>
                  <div className='flex items-center space-x-2'>
                    <Fuel className='h-4 w-4 text-muted-foreground' />
                    <span className='text-sm'>Fuel Level</span>
                  </div>
                  <span className='text-sm font-medium'>
                    {vehicle.fuelLevel}%
                  </span>
                </div>
                <Progress value={vehicle.fuelLevel} className='h-2' />
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div className='p-3 bg-muted/50 rounded-lg'>
                  <p className='text-sm text-muted-foreground'>Mileage</p>
                  <p className='text-lg font-bold'>
                    {vehicle.mileage.toLocaleString()} km
                  </p>
                </div>
                <div className='p-3 bg-muted/50 rounded-lg'>
                  <div className='flex items-center space-x-2'>
                    <Users className='h-4 w-4 text-muted-foreground' />
                    <div>
                      <p className='text-sm text-muted-foreground'>Capacity</p>
                      <p className='text-lg font-bold'>
                        {vehicle.capacity} passengers
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Features */}
          <div>
            <h3 className='font-semibold mb-3 flex items-center'>
              <CheckCircle className='h-4 w-4 mr-2' />
              Features & Equipment
            </h3>
            <div className='flex flex-wrap gap-2'>
              {features.map((feature, index) => (
                <Badge key={index} variant='secondary'>
                  {feature}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Maintenance */}
          <div>
            <h3 className='font-semibold mb-3 flex items-center'>
              <Wrench className='h-4 w-4 mr-2' />
              Maintenance History
            </h3>
            <div className='space-y-3'>
              <div className='grid grid-cols-2 gap-3 text-sm'>
                <div className='p-3 bg-muted/50 rounded-lg'>
                  <p className='text-muted-foreground'>Last Service</p>
                  <p className='font-medium'>{vehicle.lastService}</p>
                </div>
                <div className='p-3 bg-muted/50 rounded-lg'>
                  <p className='text-muted-foreground'>Next Service</p>
                  <p className='font-medium'>{vehicle.nextService}</p>
                </div>
              </div>

              <div className='space-y-2'>
                {maintenance.slice(0, 3).map((record, index) => (
                  <div
                    key={index}
                    className='flex items-center justify-between p-3 border border-border rounded-lg'>
                    <div>
                      <p className='font-medium text-sm'>{record.type}</p>
                      <p className='text-xs text-muted-foreground'>
                        {record.date}
                      </p>
                    </div>
                    <Badge variant='outline'>{record.cost}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Issues */}
          {issues.length > 0 && (
            <>
              <Separator />
              <div className='bg-destructive/10 p-4 rounded-lg'>
                <h3 className='font-semibold mb-3 flex items-center text-destructive'>
                  <AlertTriangle className='h-4 w-4 mr-2' />
                  Active Issues ({issues.length})
                </h3>
                <div className='space-y-3'>
                  {issues.map((issue, index) => (
                    <div key={index} className='space-y-1'>
                      <div className='flex items-center space-x-2'>
                        <Badge variant='destructive' className='text-xs'>
                          {issue.type}
                        </Badge>
                        <span className='text-xs text-muted-foreground'>
                          Reported: {issue.reported}
                        </span>
                      </div>
                      <p className='text-sm text-destructive'>
                        {issue.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VehicleDetailsDialog;
