import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Pencil,
  Trash2,
  Plus,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ScheduleItem {
  id: string;
  date: string;
  time: string;
  tripName: string;
  location: string;
  guests: number;
  status: "upcoming" | "in-progress" | "completed";
}

interface ViewScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  driverName: string;
  schedule: ScheduleItem[];
  onAddTrip?: (trip: Omit<ScheduleItem, "id">) => void;
  onEditTrip?: (trip: ScheduleItem) => void;
  onDeleteTrip?: (tripId: string) => void;
}

const statusConfig = {
  upcoming: {
    label: "Upcoming",
    color: "bg-accent text-accent-foreground",
  },
  "in-progress": {
    label: "In Progress",
    color: "bg-warning text-warning-foreground",
  },
  completed: {
    label: "Completed",
    color: "bg-success text-success-foreground",
  },
};

const ViewScheduleDialog: React.FC<ViewScheduleDialogProps> = ({
  open,
  onOpenChange,
  driverName,
  schedule,
  onAddTrip,
  onEditTrip,
  onDeleteTrip,
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<ScheduleItem | null>(null);
  const [formData, setFormData] = useState({
    tripName: "",
    date: "",
    time: "",
    location: "",
    guests: "",
    status: "upcoming" as "upcoming" | "in-progress" | "completed",
  });

  const handleAdd = () => {
    if (onAddTrip) {
      onAddTrip({
        ...formData,
        guests: parseInt(formData.guests),
      });
    }
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEdit = () => {
    if (onEditTrip && selectedTrip) {
      onEditTrip({
        ...selectedTrip,
        ...formData,
        guests: parseInt(formData.guests),
      });
    }
    setIsEditDialogOpen(false);
    resetForm();
  };

  const handleDelete = () => {
    if (onDeleteTrip && selectedTrip) {
      onDeleteTrip(selectedTrip.id);
    }
    setIsDeleteDialogOpen(false);
    setSelectedTrip(null);
  };

  const resetForm = () => {
    setFormData({
      tripName: "",
      date: "",
      time: "",
      location: "",
      guests: "",
      status: "upcoming",
    });
    setSelectedTrip(null);
  };

  const openEditDialog = (trip: ScheduleItem) => {
    setSelectedTrip(trip);
    setFormData({
      tripName: trip.tripName,
      date: trip.date,
      time: trip.time,
      location: trip.location,
      guests: trip.guests.toString(),
      status: trip.status,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (trip: ScheduleItem) => {
    setSelectedTrip(trip);
    setIsDeleteDialogOpen(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <div className='flex items-center justify-between'>
              <div>
                <DialogTitle>Schedule for {driverName}</DialogTitle>
                <DialogDescription>
                  View and manage all trips for this driver
                </DialogDescription>
              </div>
              <Button size='sm' onClick={() => setIsAddDialogOpen(true)}>
                <Plus className='h-4 w-4 mr-2' />
                Add Trip
              </Button>
            </div>
          </DialogHeader>

          <ScrollArea className='h-[500px] pr-4'>
            <div className='space-y-4'>
              {schedule.length === 0 ? (
                <div className='text-center py-12'>
                  <Calendar className='w-12 h-12 mx-auto text-muted-foreground mb-4' />
                  <p className='text-muted-foreground'>No scheduled trips</p>
                </div>
              ) : (
                schedule.map((item) => (
                  <div
                    key={item.id}
                    className='border rounded-lg p-4 hover:bg-muted/50 transition-colors'>
                    <div className='flex items-start justify-between mb-3'>
                      <div className='flex-1'>
                        <h4 className='font-semibold text-foreground'>
                          {item.tripName}
                        </h4>
                        <div className='flex items-center gap-2 mt-1'>
                          <Calendar className='w-4 h-4 text-muted-foreground' />
                          <span className='text-sm text-muted-foreground'>
                            {item.date}
                          </span>
                          <Clock className='w-4 h-4 text-muted-foreground ml-2' />
                          <span className='text-sm text-muted-foreground'>
                            {item.time}
                          </span>
                        </div>
                      </div>
                      <div className='flex items-center gap-2'>
                        <Badge className={statusConfig[item.status].color}>
                          {statusConfig[item.status].label}
                        </Badge>
                        <Button
                          size='icon'
                          variant='ghost'
                          onClick={() => openEditDialog(item)}>
                          <Pencil className='h-4 w-4' />
                        </Button>
                        <Button
                          size='icon'
                          variant='ghost'
                          onClick={() => openDeleteDialog(item)}>
                          <Trash2 className='h-4 w-4 text-destructive' />
                        </Button>
                      </div>
                    </div>

                    <div className='flex items-center gap-4 text-sm'>
                      <div className='flex items-center gap-1'>
                        <MapPin className='w-4 h-4 text-muted-foreground' />
                        <span className='text-muted-foreground'>
                          {item.location}
                        </span>
                      </div>
                      <div className='flex items-center gap-1'>
                        <Users className='w-4 h-4 text-muted-foreground' />
                        <span className='text-muted-foreground'>
                          {item.guests} guests
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Add Trip Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Trip</DialogTitle>
            <DialogDescription>
              Schedule a new trip for {driverName}
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='add-tripName'>Trip Name</Label>
              <Input
                id='add-tripName'
                value={formData.tripName}
                onChange={(e) =>
                  setFormData({ ...formData, tripName: e.target.value })
                }
                placeholder='e.g., Northern Circuit Safari'
              />
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='add-date'>Date</Label>
                <Input
                  id='add-date'
                  type='date'
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='add-time'>Time</Label>
                <Input
                  id='add-time'
                  type='time'
                  value={formData.time}
                  onChange={(e) =>
                    setFormData({ ...formData, time: e.target.value })
                  }
                />
              </div>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='add-location'>Location</Label>
              <Input
                id='add-location'
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder='e.g., Serengeti National Park'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='add-guests'>Number of Guests</Label>
              <Input
                id='add-guests'
                type='number'
                value={formData.guests}
                onChange={(e) =>
                  setFormData({ ...formData, guests: e.target.value })
                }
                placeholder='e.g., 4'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='add-status'>Status</Label>
              <select
                id='add-status'
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as any })
                }
                className='w-full rounded-md border border-input bg-background px-3 py-2'>
                <option value='upcoming'>Upcoming</option>
                <option value='in-progress'>In Progress</option>
                <option value='completed'>Completed</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAdd}>Add Trip</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Trip Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Trip</DialogTitle>
            <DialogDescription>
              Update trip details for {driverName}
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='edit-tripName'>Trip Name</Label>
              <Input
                id='edit-tripName'
                value={formData.tripName}
                onChange={(e) =>
                  setFormData({ ...formData, tripName: e.target.value })
                }
              />
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='edit-date'>Date</Label>
                <Input
                  id='edit-date'
                  type='date'
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='edit-time'>Time</Label>
                <Input
                  id='edit-time'
                  type='time'
                  value={formData.time}
                  onChange={(e) =>
                    setFormData({ ...formData, time: e.target.value })
                  }
                />
              </div>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='edit-location'>Location</Label>
              <Input
                id='edit-location'
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='edit-guests'>Number of Guests</Label>
              <Input
                id='edit-guests'
                type='number'
                value={formData.guests}
                onChange={(e) =>
                  setFormData({ ...formData, guests: e.target.value })
                }
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='edit-status'>Status</Label>
              <select
                id='edit-status'
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as any })
                }
                className='w-full rounded-md border border-input bg-background px-3 py-2'>
                <option value='upcoming'>Upcoming</option>
                <option value='in-progress'>In Progress</option>
                <option value='completed'>Completed</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Trip</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedTrip?.tripName}"? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ViewScheduleDialog;
