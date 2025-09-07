import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus, Minus } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface AddBookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddBookingModal: React.FC<AddBookingModalProps> = ({ open, onOpenChange }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    safariPackage: '',
    startDate: null as Date | null,
    endDate: null as Date | null,
    adults: 1,
    children: 0,
    specialRequests: '',
    accommodation: '',
    transportation: ''
  });

  const safariPackages = [
    { value: '3-day-serengeti', label: '3-Day Serengeti Explorer', price: 3500 },
    { value: '5-day-northern', label: '5-Day Northern Circuit', price: 6250 },
    { value: '7-day-premium', label: '7-Day Premium Safari', price: 8900 },
    { value: '4-day-tarangire', label: '4-Day Tarangire & Manyara', price: 4200 },
    { value: '6-day-crater', label: '6-Day Crater Highlands', price: 7800 },
    { value: '10-day-ultimate', label: '10-Day Ultimate Safari', price: 12500 }
  ];

  const accommodationOptions = [
    'Budget Camping',
    'Mid-range Lodge',
    'Luxury Lodge',
    'Mobile Camping',
    'Permanent Tented Camp'
  ];

  const transportationOptions = [
    'Shared Safari Vehicle',
    'Private Safari Vehicle',
    'Luxury 4WD',
    'Open Roof Vehicle'
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const adjustGuestCount = (type: 'adults' | 'children', increment: boolean) => {
    setFormData(prev => ({
      ...prev,
      [type]: Math.max(0, prev[type] + (increment ? 1 : -1))
    }));
  };

  const calculateTotal = () => {
    const selectedPackage = safariPackages.find(pkg => pkg.value === formData.safariPackage);
    if (!selectedPackage) return 0;
    
    const basePrice = selectedPackage.price * formData.adults;
    const childPrice = selectedPackage.price * 0.5 * formData.children;
    return basePrice + childPrice;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.customerName || !formData.customerEmail || !formData.safariPackage || !formData.startDate || !formData.endDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (formData.startDate >= formData.endDate) {
      toast({
        title: "Invalid Dates",
        description: "End date must be after start date.",
        variant: "destructive"
      });
      return;
    }

    // Generate booking reference
    const bookingRef = `SAF-${Date.now().toString().slice(-6)}`;

    // Simulate API call
    toast({
      title: "Booking Created",
      description: `Booking ${bookingRef} for ${formData.customerName} has been created successfully.`,
    });

    // Reset form and close modal
    setFormData({
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      safariPackage: '',
      startDate: null,
      endDate: null,
      adults: 1,
      children: 0,
      specialRequests: '',
      accommodation: '',
      transportation: ''
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Booking</DialogTitle>
          <DialogDescription>
            Create a new safari booking with customer details and trip information.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Customer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customerName">Customer Name *</Label>
                <Input
                  id="customerName"
                  value={formData.customerName}
                  onChange={(e) => handleInputChange('customerName', e.target.value)}
                  placeholder="Enter customer name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerEmail">Email Address *</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                  placeholder="customer@email.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerPhone">Phone Number</Label>
                <Input
                  id="customerPhone"
                  value={formData.customerPhone}
                  onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                  placeholder="+1-555-0123"
                />
              </div>
            </div>
          </div>

          {/* Safari Package */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Safari Package</h3>
            <div className="space-y-2">
              <Label>Select Package *</Label>
              <Select value={formData.safariPackage} onValueChange={(value) => handleInputChange('safariPackage', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose safari package" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  {safariPackages.map((pkg) => (
                    <SelectItem key={pkg.value} value={pkg.value}>
                      <div className="flex justify-between w-full">
                        <span>{pkg.label}</span>
                        <span className="ml-4 font-semibold">${pkg.price}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Trip Dates */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Trip Dates</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.startDate ? format(formData.startDate, "PPP") : "Pick start date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-popover" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.startDate || undefined}
                      onSelect={(date) => handleInputChange('startDate', date)}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>End Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.endDate ? format(formData.endDate, "PPP") : "Pick end date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-popover" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.endDate || undefined}
                      onSelect={(date) => handleInputChange('endDate', date)}
                      disabled={(date) => date < new Date() || (formData.startDate && date <= formData.startDate)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          {/* Guest Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Guest Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Adults</Label>
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => adjustGuestCount('adults', false)}
                    disabled={formData.adults <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-semibold">{formData.adults}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => adjustGuestCount('adults', true)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Children</Label>
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => adjustGuestCount('children', false)}
                    disabled={formData.children <= 0}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-semibold">{formData.children}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => adjustGuestCount('children', true)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Accommodation & Transportation */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Preferences</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Accommodation</Label>
                <Select value={formData.accommodation} onValueChange={(value) => handleInputChange('accommodation', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select accommodation type" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    {accommodationOptions.map((option) => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Transportation</Label>
                <Select value={formData.transportation} onValueChange={(value) => handleInputChange('transportation', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select transportation type" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    {transportationOptions.map((option) => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Special Requests */}
          <div className="space-y-2">
            <Label htmlFor="specialRequests">Special Requests</Label>
            <Textarea
              id="specialRequests"
              value={formData.specialRequests}
              onChange={(e) => handleInputChange('specialRequests', e.target.value)}
              placeholder="Any special dietary requirements, mobility needs, or other requests..."
              rows={3}
            />
          </div>

          {/* Price Summary */}
          {formData.safariPackage && (
            <div className="bg-accent/10 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Price Summary</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Adults ({formData.adults}x)</span>
                  <span>${(safariPackages.find(p => p.value === formData.safariPackage)?.price || 0) * formData.adults}</span>
                </div>
                {formData.children > 0 && (
                  <div className="flex justify-between">
                    <span>Children ({formData.children}x 50%)</span>
                    <span>${(safariPackages.find(p => p.value === formData.safariPackage)?.price || 0) * 0.5 * formData.children}</span>
                  </div>
                )}
                <div className="border-t pt-1 font-semibold flex justify-between">
                  <span>Total</span>
                  <span>${calculateTotal()}</span>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button type="submit" className="flex-1">
              Create Booking
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddBookingModal;