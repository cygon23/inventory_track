import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Wrench, Calendar, DollarSign, Plus, History } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface Vehicle {
  id: string;
  model: string;
  plate: string;
  mileage: number;
  vehicle_maintenance?: Array<{
    type: string;
    date: string;
    cost: string;
    description?: string;
  }>;
}

interface MaintenanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicle: Vehicle | null;
  onSubmit: (data: any) => Promise<void>;
}

const MaintenanceDialog: React.FC<MaintenanceDialogProps> = ({
  open,
  onOpenChange,
  vehicle,
  onSubmit,
}) => {
  const [maintenanceType, setMaintenanceType] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [estimatedCost, setEstimatedCost] = useState("");
  const [notes, setNotes] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!vehicle) return null;

  const maintenance = vehicle.vehicle_maintenance || [];

  // Main submit handler
  const handleSubmit = async () => {
    if (!vehicle) return;

    // Ensure type is never empty
    const typeToSend =
      maintenanceType === "other" && notes ? notes : maintenanceType;

    if (!typeToSend) {
      toast({
        title: "Error",
        description: "Maintenance type cannot be empty",
        variant: "destructive",
      });
      return;
    }

    if (!scheduledDate) {
      toast({
        title: "Error",
        description: "Please select a scheduled date",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        vehicle_id: vehicle.id,
        type: typeToSend,
        date: scheduledDate,
        cost: estimatedCost ? parseFloat(estimatedCost) : 0,
        description: notes || "",
      });

      toast({
        title: "Success",
        description: "Maintenance scheduled successfully",
      });

      // Reset form
      setMaintenanceType("");
      setScheduledDate("");
      setEstimatedCost("");
      setNotes("");
      onOpenChange(false);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to schedule maintenance",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setConfirmOpen(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle className='flex items-center space-x-2'>
              <Wrench className='h-5 w-5' />
              <span>
                Maintenance - {vehicle.model} ({vehicle.plate})
              </span>
            </DialogTitle>
            <DialogDescription>
              View maintenance history and schedule new service
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue='schedule' className='w-full'>
            <TabsList className='grid w-full grid-cols-2'>
              <TabsTrigger value='schedule'>Schedule Service</TabsTrigger>
              <TabsTrigger value='history'>History</TabsTrigger>
            </TabsList>

            <TabsContent value='schedule' className='space-y-4'>
              <form
                onSubmit={(e) => {
                  e.preventDefault();

                  // Validate before confirm
                  if (!maintenanceType) {
                    toast({
                      title: "Error",
                      description: "Please select a maintenance type",
                      variant: "destructive",
                    });
                    return;
                  }
                  if (!scheduledDate) {
                    toast({
                      title: "Error",
                      description: "Please select a scheduled date",
                      variant: "destructive",
                    });
                    return;
                  }

                  setConfirmOpen(true);
                }}
                className='space-y-4'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='vehicleInfo'>Vehicle</Label>
                    <Input
                      id='vehicleInfo'
                      value={`${vehicle.model} - ${vehicle.plate}`}
                      disabled
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='currentMileage'>Current Mileage</Label>
                    <Input
                      id='currentMileage'
                      value={`${vehicle.mileage.toLocaleString()} km`}
                      disabled
                    />
                  </div>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='maintenanceType'>Maintenance Type *</Label>
                  <Select
                    value={maintenanceType}
                    onValueChange={setMaintenanceType}>
                    <SelectTrigger>
                      <SelectValue placeholder='Select service type' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='oil_change'>Oil Change</SelectItem>
                      <SelectItem value='tire_rotation'>
                        Tire Rotation
                      </SelectItem>
                      <SelectItem value='brake_inspection'>
                        Brake Inspection
                      </SelectItem>
                      <SelectItem value='full_service'>Full Service</SelectItem>
                      <SelectItem value='engine_service'>
                        Engine Service
                      </SelectItem>
                      <SelectItem value='transmission_check'>
                        Transmission Check
                      </SelectItem>
                      <SelectItem value='ac_service'>AC Service</SelectItem>
                      <SelectItem value='brake_pads'>
                        Brake Pads Replacement
                      </SelectItem>
                      <SelectItem value='tire_change'>Tire Change</SelectItem>
                      <SelectItem value='battery'>
                        Battery Replacement
                      </SelectItem>
                      <SelectItem value='other'>Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='scheduledDate'>Scheduled Date *</Label>
                    <Input
                      id='scheduledDate'
                      type='date'
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='estimatedCost'>Estimated Cost</Label>
                    <div className='relative'>
                      <DollarSign className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                      <Input
                        id='estimatedCost'
                        type='number'
                        placeholder='0.00'
                        value={estimatedCost}
                        onChange={(e) => setEstimatedCost(e.target.value)}
                        className='pl-10'
                      />
                    </div>
                  </div>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='notes'>Notes / Details</Label>
                  <Textarea
                    id='notes'
                    placeholder='Add any specific instructions or issues to address...'
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                  />
                </div>

                <div className='bg-muted/50 p-4 rounded-lg'>
                  <h4 className='font-semibold text-sm mb-2'>
                    Service Recommendations
                  </h4>
                  <ul className='text-sm text-muted-foreground space-y-1'>
                    <li>• Oil changes recommended every 5,000 km</li>
                    <li>• Tire rotation every 10,000 km</li>
                    <li>• Full service every 15,000 km</li>
                    <li>• Brake inspection every 20,000 km</li>
                  </ul>
                </div>

                <div className='flex space-x-2 pt-4'>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => onOpenChange(false)}
                    className='flex-1'>
                    Cancel
                  </Button>
                  <Button type='submit' className='flex-1' disabled={loading}>
                    <Plus className='h-4 w-4 mr-2' />
                    Schedule Service
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value='history' className='space-y-4'>
              <div className='flex items-center justify-between'>
                <h3 className='font-semibold flex items-center'>
                  <History className='h-4 w-4 mr-2' />
                  Maintenance Records
                </h3>
                <Badge variant='secondary'>{maintenance.length} records</Badge>
              </div>

              <Separator />

              {maintenance.length > 0 ? (
                <div className='space-y-3'>
                  {maintenance.map((record, index) => (
                    <div
                      key={index}
                      className='p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors'>
                      <div className='flex items-start justify-between'>
                        <div className='space-y-1 flex-1'>
                          <div className='flex items-center space-x-2'>
                            <h4 className='font-semibold'>{record.type}</h4>
                            <Badge variant='outline'>{record.cost}</Badge>
                          </div>
                          <div className='flex items-center space-x-4 text-sm text-muted-foreground'>
                            <div className='flex items-center space-x-1'>
                              <Calendar className='h-3 w-3' />
                              <span>{record.date}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className='text-center py-8 text-muted-foreground'>
                  <Wrench className='h-12 w-12 mx-auto mb-2 opacity-50' />
                  <p>No maintenance records found</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Confirm Dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Maintenance</DialogTitle>
            <DialogDescription>
              Are you sure you want to schedule this maintenance?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className='flex space-x-2'>
            <Button variant='outline' onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              Yes, Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MaintenanceDialog;
