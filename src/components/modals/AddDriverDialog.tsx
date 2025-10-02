import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface AddDriverDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => Promise<void>;
}

const AddDriverDialog: React.FC<AddDriverDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    experience: "",
    languages: "",
    specialties: "",
    vehicle_model: "",
    vehicle_plate: "",
    vehicle_year: "",
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const defaultPassword = "LionTrack@123";

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!formData.experience.trim())
      newErrors.experience = "Experience is required";
    if (!formData.languages.trim())
      newErrors.languages = "Languages are required";
    if (!formData.specialties.trim())
      newErrors.specialties = "Specialties are required";
    if (!formData.vehicle_model.trim())
      newErrors.vehicle_model = "Vehicle model is required";
    if (!formData.vehicle_plate.trim())
      newErrors.vehicle_plate = "Plate number is required";
    if (!formData.vehicle_year.trim())
      newErrors.vehicle_year = "Year is required";
    else if (!/^\d{4}$/.test(formData.vehicle_year))
      newErrors.vehicle_year = "Enter a valid 4-digit year";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const submitData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        experience: formData.experience,
        languages: formData.languages.split(",").map((l) => l.trim()),
        specialties: formData.specialties.split(",").map((s) => s.trim()),
        vehicle_model: formData.vehicle_model,
        vehicle_plate: formData.vehicle_plate,
        vehicle_year: parseInt(formData.vehicle_year),
        notes: formData.notes,
        password: defaultPassword,
      };

      await onSubmit(submitData);

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        experience: "",
        languages: "",
        specialties: "",
        vehicle_model: "",
        vehicle_plate: "",
        vehicle_year: "",
        notes: "",
      });
      setErrors({});
      onOpenChange(false);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Add New Driver</DialogTitle>
          <DialogDescription>
            Enter driver information to add them to the system
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6 py-4'>
          {/* Personal Information */}
          <div className='space-y-4'>
            <h3 className='text-sm font-semibold text-foreground'>
              Personal Information
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='name'>Full Name *</Label>
                <Input
                  id='name'
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder='e.g., James Mollel'
                />
                {errors.name && (
                  <p className='text-xs text-destructive'>{errors.name}</p>
                )}
              </div>
              <div className='space-y-2'>
                <Label htmlFor='email'>Email *</Label>
                <Input
                  id='email'
                  type='email'
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder='driver@liontrack.com'
                />
                <p className='text-xs text-muted-foreground'>
                  Default password: <strong>{defaultPassword}</strong>
                </p>

                {errors.email && (
                  <p className='text-xs text-destructive'>{errors.email}</p>
                )}
              </div>
              <div className='space-y-2'>
                <Label htmlFor='phone'>Phone Number *</Label>
                <Input
                  id='phone'
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder='+255-754-123-456'
                />
                {errors.phone && (
                  <p className='text-xs text-destructive'>{errors.phone}</p>
                )}
              </div>
              <div className='space-y-2'>
                <Label htmlFor='experience'>Experience *</Label>
                <Input
                  id='experience'
                  value={formData.experience}
                  onChange={(e) =>
                    setFormData({ ...formData, experience: e.target.value })
                  }
                  placeholder='e.g., 5 years'
                />
                {errors.experience && (
                  <p className='text-xs text-destructive'>
                    {errors.experience}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Languages & Specialties */}
          <div className='space-y-4'>
            <h3 className='text-sm font-semibold text-foreground'>
              Skills & Expertise
            </h3>
            <div className='space-y-2'>
              <Label htmlFor='languages'>Languages *</Label>
              <Input
                id='languages'
                value={formData.languages}
                onChange={(e) =>
                  setFormData({ ...formData, languages: e.target.value })
                }
                placeholder='e.g., English, Swahili, German (comma-separated)'
              />
              {errors.languages && (
                <p className='text-xs text-destructive'>{errors.languages}</p>
              )}
              <p className='text-xs text-muted-foreground'>
                Separate multiple languages with commas
              </p>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='specialties'>Specialties *</Label>
              <Textarea
                id='specialties'
                value={formData.specialties}
                onChange={(e) =>
                  setFormData({ ...formData, specialties: e.target.value })
                }
                placeholder='e.g., Wildlife Photography, Big 5 Safari'
                rows={3}
              />
              {errors.specialties && (
                <p className='text-xs text-destructive'>{errors.specialties}</p>
              )}
              <p className='text-xs text-muted-foreground'>
                Separate multiple specialties with commas
              </p>
            </div>
          </div>

          {/* Vehicle Information */}
          <div className='space-y-4'>
            <h3 className='text-sm font-semibold text-foreground'>
              Vehicle Information
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='vehicle_model'>Vehicle Model *</Label>
                <Input
                  id='vehicle_model'
                  value={formData.vehicle_model}
                  onChange={(e) =>
                    setFormData({ ...formData, vehicle_model: e.target.value })
                  }
                  placeholder='e.g., Toyota Land Cruiser'
                />
                {errors.vehicle_model && (
                  <p className='text-xs text-destructive'>
                    {errors.vehicle_model}
                  </p>
                )}
              </div>
              <div className='space-y-2'>
                <Label htmlFor='vehicle_plate'>Plate Number *</Label>
                <Input
                  id='vehicle_plate'
                  value={formData.vehicle_plate}
                  onChange={(e) =>
                    setFormData({ ...formData, vehicle_plate: e.target.value })
                  }
                  placeholder='e.g., T123ABC'
                />
                {errors.vehicle_plate && (
                  <p className='text-xs text-destructive'>
                    {errors.vehicle_plate}
                  </p>
                )}
              </div>
              <div className='space-y-2'>
                <Label htmlFor='vehicle_year'>Year *</Label>
                <Input
                  id='vehicle_year'
                  type='number'
                  value={formData.vehicle_year}
                  onChange={(e) =>
                    setFormData({ ...formData, vehicle_year: e.target.value })
                  }
                  placeholder='e.g., 2023'
                />
                {errors.vehicle_year && (
                  <p className='text-xs text-destructive'>
                    {errors.vehicle_year}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className='space-y-4'>
            <h3 className='text-sm font-semibold text-foreground'>
              Additional Information
            </h3>
            <div className='space-y-2'>
              <Label htmlFor='notes'>Notes (Optional)</Label>
              <Textarea
                id='notes'
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder='Any additional information about the driver...'
                rows={3}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant='outline'
            onClick={() => onOpenChange(false)}
            disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Adding...
              </>
            ) : (
              "Add Driver"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddDriverDialog;
