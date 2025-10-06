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
  Calendar,
  MapPin,
  Users,
  Phone,
  Mail,
  Clock,
  AlertTriangle,
  User,
  Package,
  FileText,
} from "lucide-react";

interface TripDetails {
  id: string;
  customer_name?: string;
  customer?: string;
  package_name?: string;
  package?: string;
  start_date?: string;
  startDate?: string;
  pickup?: string;
  guests?: number;
  preferredDriver?: string;
  priority?: string;
  requirements?: string;
  notes?: string;
  booking_reference?: string;
  end_date?: string;
  current_location?: string;
}

interface ViewTripDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tripDetails: TripDetails | null;
  onAssign?: () => void;
}

const ViewTripDetailsDialog: React.FC<ViewTripDetailsDialogProps> = ({
  open,
  onOpenChange,
  tripDetails,
  onAssign,
}) => {
  if (!tripDetails) return null;

  const customerName = tripDetails.customer_name || tripDetails.customer;
  const packageName = tripDetails.package_name || tripDetails.package;
  const startDate = tripDetails.start_date || tripDetails.startDate;

  const getPriorityColor = (priority?: string) => {
    if (!priority) return "bg-muted/10 text-muted-foreground border-muted/20";

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

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center justify-between'>
            <span className='flex items-center'>
              <FileText className='h-5 w-5 mr-2 text-primary' />
              Trip Details
            </span>
            {tripDetails.priority && (
              <Badge className={getPriorityColor(tripDetails.priority)}>
                {tripDetails.priority.toUpperCase()}
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            Complete information for trip #
            {tripDetails.id?.slice(0, 8) || tripDetails.id}
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Customer Information */}
          <Card className='p-4 space-y-3'>
            <h3 className='font-semibold flex items-center'>
              <User className='h-4 w-4 mr-2 text-primary' />
              Customer Information
            </h3>
            <Separator />
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <div>
                <Label className='text-muted-foreground'>Customer Name</Label>
                <p className='font-medium'>{customerName || "N/A"}</p>
              </div>
              <div>
                <Label className='text-muted-foreground'>
                  Number of Guests
                </Label>
                <div className='flex items-center space-x-2'>
                  <Users className='h-4 w-4 text-muted-foreground' />
                  <p className='font-medium'>
                    {tripDetails.guests || 0} people
                  </p>
                </div>
              </div>
              {tripDetails.booking_reference && (
                <div className='sm:col-span-2'>
                  <Label className='text-muted-foreground'>
                    Booking Reference
                  </Label>
                  <p className='font-medium'>{tripDetails.booking_reference}</p>
                </div>
              )}
            </div>
          </Card>

          {/* Trip Details */}
          <Card className='p-4 space-y-3'>
            <h3 className='font-semibold flex items-center'>
              <Package className='h-4 w-4 mr-2 text-primary' />
              Trip Details
            </h3>
            <Separator />
            <div className='space-y-3'>
              <div>
                <Label className='text-muted-foreground'>Trip ID</Label>
                <p className='font-medium'>
                  #{tripDetails.id?.slice(0, 8) || tripDetails.id}
                </p>
              </div>
              <div>
                <Label className='text-muted-foreground'>Safari Package</Label>
                <p className='font-medium'>{packageName || "N/A"}</p>
              </div>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div>
                  <Label className='text-muted-foreground'>Start Date</Label>
                  <div className='flex items-center space-x-2'>
                    <Calendar className='h-4 w-4 text-primary' />
                    <p className='font-medium'>
                      {startDate ? formatDate(startDate) : "N/A"}
                    </p>
                  </div>
                </div>
                {tripDetails.end_date && (
                  <div>
                    <Label className='text-muted-foreground'>End Date</Label>
                    <div className='flex items-center space-x-2'>
                      <Calendar className='h-4 w-4 text-primary' />
                      <p className='font-medium'>
                        {formatDate(tripDetails.end_date)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              {(tripDetails.pickup || tripDetails.current_location) && (
                <div>
                  <Label className='text-muted-foreground'>
                    {tripDetails.pickup
                      ? "Pickup Location"
                      : "Current Location"}
                  </Label>
                  <div className='flex items-center space-x-2'>
                    <MapPin className='h-4 w-4 text-primary' />
                    <p className='font-medium'>
                      {tripDetails.pickup || tripDetails.current_location}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Assignment Information */}
          <Card className='p-4 space-y-3'>
            <h3 className='font-semibold flex items-center'>
              <Clock className='h-4 w-4 mr-2 text-primary' />
              Assignment Information
            </h3>
            <Separator />
            <div className='space-y-3'>
              <div>
                <Label className='text-muted-foreground'>Status</Label>
                <Badge variant='outline' className='mt-1'>
                  Pending Assignment
                </Badge>
              </div>
              {tripDetails.preferredDriver && (
                <div>
                  <Label className='text-muted-foreground'>
                    Preferred Driver
                  </Label>
                  <p className='font-medium'>{tripDetails.preferredDriver}</p>
                </div>
              )}
              {tripDetails.priority && (
                <div>
                  <Label className='text-muted-foreground'>
                    Priority Level
                  </Label>
                  <Badge
                    className={getPriorityColor(tripDetails.priority)}
                    variant='outline'>
                    {tripDetails.priority.toUpperCase()} PRIORITY
                  </Badge>
                </div>
              )}
            </div>
          </Card>

          {/* Special Requirements / Notes */}
          {(tripDetails.requirements || tripDetails.notes) && (
            <Card className='p-4 space-y-3 bg-warning/5 border-warning/20'>
              <h3 className='font-semibold flex items-center text-warning'>
                <AlertTriangle className='h-4 w-4 mr-2' />
                {tripDetails.requirements ? "Special Requirements" : "Notes"}
              </h3>
              <Separator />
              <p className='text-sm'>
                {tripDetails.requirements || tripDetails.notes}
              </p>
            </Card>
          )}

          {/* Additional Information */}
          <Card className='p-4 space-y-3'>
            <h3 className='font-semibold text-sm'>Pre-Departure Checklist</h3>
            <Separator />
            <ul className='text-sm text-muted-foreground space-y-2'>
              <li>• Ensure vehicle is fully fueled before departure</li>
              <li>• Check all safety equipment is in place</li>
              <li>• Confirm pickup time with customer 24 hours prior</li>
              <li>• Review route and accommodation details with driver</li>
              <li>• Verify driver has necessary permits and documentation</li>
            </ul>
          </Card>
        </div>

        <DialogFooter className='gap-2 flex-col sm:flex-row'>
          <Button
            type='button'
            variant='outline'
            onClick={() => onOpenChange(false)}
            className='w-full sm:w-auto'>
            Close
          </Button>
          {onAssign && (
            <Button onClick={onAssign} className='w-full sm:w-auto'>
              Assign Driver & Vehicle
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const Label: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => <p className={`text-xs font-medium ${className}`}>{children}</p>;

export default ViewTripDetailsDialog;
