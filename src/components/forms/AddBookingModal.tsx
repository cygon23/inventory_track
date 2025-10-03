import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Plus, Minus, Search, Loader2, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { bookingService, Customer } from "@/services/bookingService";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  getActiveSafariPackages,
  SafariPackage,
} from "@/services/safariPackageService";

interface AddBookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const AddBookingModal: React.FC<AddBookingModalProps> = ({
  open,
  onOpenChange,
  onSuccess,
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customerSearchOpen, setCustomerSearchOpen] = useState(false);
  const [customerSearchQuery, setCustomerSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Customer[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );

  const [formData, setFormData] = useState({
    customerCustomId: "",
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    safariPackage: "",
    packageId: "",
    startDate: null as Date | null,
    endDate: null as Date | null,
    adults: 1,
    children: 0,
    specialRequests: "",
    accommodation: "",
    transportation: "",
    notes: "",
  });

  const accommodationOptions = [
    "Budget Camping",
    "Mid-range Lodge",
    "Luxury Lodge",
    "Mobile Camping",
    "Permanent Tented Camp",
  ];

  const transportationOptions = [
    "Shared Safari Vehicle",
    "Private Safari Vehicle",
    "Luxury 4WD",
    "Open Roof Vehicle",
  ];

  // Packages fetched from Supabase
  const [packages, setPackages] = useState<SafariPackage[]>([]);

  useEffect(() => {
    async function fetchPackages() {
      const { data, error } = await getActiveSafariPackages();
      if (data) setPackages(data);
      if (error) console.error(error);
    }
    fetchPackages();
  }, []);

  // Customer search with debounce
  useEffect(() => {
    const searchCustomers = async () => {
      if (customerSearchQuery.length < 2) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      const { data, error } = await bookingService.searchCustomers(
        customerSearchQuery
      );

      if (!error && data) setSearchResults(data);
      setIsSearching(false);
    };

    const timeoutId = setTimeout(searchCustomers, 300);
    return () => clearTimeout(timeoutId);
  }, [customerSearchQuery]);

  const handleCustomerSelect = (customer: Customer) => {
    setSelectedCustomer(customer);
    setFormData((prev) => ({
      ...prev,
      customerCustomId: customer.custom_id,
      customerName: customer.name,
      customerEmail: customer.email,
      customerPhone: customer.phone || "",
    }));
    setCustomerSearchOpen(false);
    setCustomerSearchQuery("");
  };

  const clearSelectedCustomer = () => {
    setSelectedCustomer(null);
    setFormData((prev) => ({
      ...prev,
      customerCustomId: "",
      customerName: "",
      customerEmail: "",
      customerPhone: "",
    }));
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (["customerName", "customerEmail", "customerPhone"].includes(field)) {
      setSelectedCustomer(null);
    }
  };

  const adjustGuestCount = (
    type: "adults" | "children",
    increment: boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [type]: Math.max(
        type === "adults" ? 1 : 0,
        prev[type] + (increment ? 1 : -1)
      ),
    }));
  };

  const calculateTotal = () => {
    const selectedPackage = packages.find(
      (pkg) => pkg.id === formData.packageId
    );
    if (!selectedPackage) return 0;

    const basePrice = selectedPackage.price * formData.adults;
    const childPrice = selectedPackage.price * 0.5 * formData.children;
    return basePrice + childPrice;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.customerName ||
      !formData.customerEmail ||
      !formData.packageId ||
      !formData.startDate ||
      !formData.endDate
    ) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (formData.startDate >= formData.endDate) {
      toast({
        title: "Invalid Dates",
        description: "End date must be after start date.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedPackage = packages.find(
        (pkg) => pkg.id === formData.packageId
      );
      const totalAmount = calculateTotal();

      const specialRequests = [];
      if (formData.specialRequests)
        specialRequests.push(formData.specialRequests);
      if (formData.accommodation)
        specialRequests.push(`Accommodation: ${formData.accommodation}`);
      if (formData.transportation)
        specialRequests.push(`Transportation: ${formData.transportation}`);

      const bookingData = {
        customerCustomId: formData.customerCustomId || undefined,
        customerId: selectedCustomer?.id,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        safariPackage: selectedPackage?.name || "",
        packageId: formData.packageId,
        startDate: formData.startDate,
        endDate: formData.endDate,
        adults: formData.adults,
        children: formData.children,
        totalAmount: totalAmount,
        paidAmount: 0,
        status: "inquiry",
        paymentStatus: "pending",
        specialRequests:
          specialRequests.length > 0 ? specialRequests : undefined,
        notes: formData.notes || undefined,
      };

      const { data, error } = await bookingService.createBooking(bookingData);

      if (error) throw error;

      toast({
        title: "Booking Created Successfully",
        description: `Booking ${data?.booking_reference} for ${formData.customerName} has been created.`,
      });

      setFormData({
        customerCustomId: "",
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        safariPackage: "",
        packageId: "",
        startDate: null,
        endDate: null,
        adults: 1,
        children: 0,
        specialRequests: "",
        accommodation: "",
        transportation: "",
        notes: "",
      });
      setSelectedCustomer(null);
      if (onSuccess) onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error creating booking:", error);
      toast({
        title: "Error Creating Booking",
        description:
          error.message || "An error occurred while creating the booking.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Create New Booking</DialogTitle>
          <DialogDescription>
            Create a new safari booking. Search for existing customer or enter
            new customer details.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-6'>
          {/* Customer Information */}
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <h3 className='text-lg font-semibold'>Customer Information</h3>
              {selectedCustomer && (
                <Button
                  type='button'
                  variant='ghost'
                  size='sm'
                  onClick={clearSelectedCustomer}>
                  <X className='h-4 w-4 mr-1' />
                  Clear Selection
                </Button>
              )}
            </div>

            {/* Customer Search */}
            <div className='space-y-2'>
              <Label>Search Existing Customer</Label>
              <Popover
                open={customerSearchOpen}
                onOpenChange={setCustomerSearchOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type='button'
                    variant='outline'
                    role='combobox'
                    className={cn(
                      "w-full justify-between",
                      selectedCustomer && "border-primary"
                    )}>
                    {selectedCustomer ? (
                      <span className='flex items-center'>
                        <span className='font-medium'>
                          {selectedCustomer.name}
                        </span>
                        <span className='ml-2 text-muted-foreground'>
                          ({selectedCustomer.custom_id})
                        </span>
                      </span>
                    ) : (
                      <span className='text-muted-foreground'>
                        Search by name, email, or ID...
                      </span>
                    )}
                    <Search className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-full p-0 bg-popover' align='start'>
                  <Command shouldFilter={false}>
                    <CommandInput
                      placeholder='Search customers...'
                      value={customerSearchQuery}
                      onValueChange={(val) => {
                        setCustomerSearchQuery(val);
                      }}
                    />

                    <CommandList>
                      {isSearching && (
                        <div className='flex items-center justify-center p-4'>
                          <Loader2 className='h-4 w-4 animate-spin' />
                          <span className='ml-2'>Searching...</span>
                        </div>
                      )}

                      {!isSearching && searchResults.length > 0 && (
                        <CommandGroup>
                          {searchResults.map((customer) => (
                            <CommandItem
                              key={customer.id}
                              onSelect={() => handleCustomerSelect(customer)}>
                              <div className='flex flex-col'>
                                <span className='font-medium'>
                                  {customer.name}
                                </span>
                                <span className='text-sm text-muted-foreground'>
                                  {customer.custom_id} • {customer.email}
                                </span>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      )}

                      {!isSearching &&
                        searchResults.length === 0 &&
                        customerSearchQuery.length >= 2 && (
                          <div className='p-4 text-sm text-muted-foreground'>
                            No customers found.
                          </div>
                        )}

                      {!isSearching &&
                        searchResults.length === 0 &&
                        customerSearchQuery.length < 2 && (
                          <div className='p-4 text-sm text-muted-foreground'>
                            Type at least 2 characters to search
                          </div>
                        )}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Customer Form */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='customerName'>Customer Name *</Label>
                <Input
                  id='customerName'
                  value={formData.customerName}
                  onChange={(e) =>
                    handleInputChange("customerName", e.target.value)
                  }
                  placeholder='Enter customer name'
                  required
                  disabled={!!selectedCustomer}
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='customerEmail'>Email Address *</Label>
                <Input
                  id='customerEmail'
                  type='email'
                  value={formData.customerEmail}
                  onChange={(e) =>
                    handleInputChange("customerEmail", e.target.value)
                  }
                  placeholder='customer@email.com'
                  required
                  disabled={!!selectedCustomer}
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='customerPhone'>Phone Number</Label>
                <Input
                  id='customerPhone'
                  value={formData.customerPhone}
                  onChange={(e) =>
                    handleInputChange("customerPhone", e.target.value)
                  }
                  placeholder='+1-555-0123'
                />
              </div>
              {selectedCustomer && (
                <div className='space-y-2'>
                  <Label>Customer ID</Label>
                  <Input
                    value={selectedCustomer.custom_id}
                    disabled
                    className='bg-muted'
                  />
                </div>
              )}
            </div>
          </div>

          {/* Safari Package */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Safari Package</h3>
            <div className='space-y-2'>
              <Label>Select Package *</Label>
              <Select
                value={formData.packageId}
                onValueChange={(value) => {
                  const pkg = packages.find((p) => p.id === value);
                  handleInputChange("packageId", value);
                  handleInputChange("safariPackage", pkg?.name || "");
                }}>
                <SelectTrigger>
                  <SelectValue placeholder='Choose safari package' />
                </SelectTrigger>
                <SelectContent className='bg-popover'>
                  {packages.map((pkg) => (
                    <SelectItem key={pkg.id} value={pkg.id}>
                      <div className='flex justify-between w-full'>
                        <span>{pkg.name}</span>
                        <span className='ml-4 font-semibold'>${pkg.price}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Trip Dates */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Trip Dates</h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label>Start Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type='button'
                      variant='outline'
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.startDate && "text-muted-foreground"
                      )}>
                      <CalendarIcon className='mr-2 h-4 w-4' />
                      {formData.startDate
                        ? format(formData.startDate, "PPP")
                        : "Pick start date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className='w-auto p-0 bg-popover'
                    align='start'>
                    <Calendar
                      mode='single'
                      selected={formData.startDate || undefined}
                      onSelect={(date) => handleInputChange("startDate", date)}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className='space-y-2'>
                <Label>End Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type='button'
                      variant='outline'
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.endDate && "text-muted-foreground"
                      )}>
                      <CalendarIcon className='mr-2 h-4 w-4' />
                      {formData.endDate
                        ? format(formData.endDate, "PPP")
                        : "Pick end date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className='w-auto p-0 bg-popover'
                    align='start'>
                    <Calendar
                      mode='single'
                      selected={formData.endDate || undefined}
                      onSelect={(date) => handleInputChange("endDate", date)}
                      disabled={(date) =>
                        date < new Date() ||
                        (formData.startDate && date <= formData.startDate)
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          {/* Guest Information */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Guest Information</h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label>Adults (Age 12+)</Label>
                <div className='flex items-center space-x-2'>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={() => adjustGuestCount("adults", false)}
                    disabled={formData.adults <= 1}>
                    <Minus className='h-4 w-4' />
                  </Button>
                  <span className='w-12 text-center font-semibold'>
                    {formData.adults}
                  </span>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={() => adjustGuestCount("adults", true)}>
                    <Plus className='h-4 w-4' />
                  </Button>
                </div>
              </div>
              <div className='space-y-2'>
                <Label>Children (Under 12)</Label>
                <div className='flex items-center space-x-2'>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={() => adjustGuestCount("children", false)}
                    disabled={formData.children <= 0}>
                    <Minus className='h-4 w-4' />
                  </Button>
                  <span className='w-12 text-center font-semibold'>
                    {formData.children}
                  </span>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={() => adjustGuestCount("children", true)}>
                    <Plus className='h-4 w-4' />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Preferences</h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label>Accommodation</Label>
                <Select
                  value={formData.accommodation}
                  onValueChange={(value) =>
                    handleInputChange("accommodation", value)
                  }>
                  <SelectTrigger>
                    <SelectValue placeholder='Select accommodation' />
                  </SelectTrigger>
                  <SelectContent>
                    {accommodationOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <Label>Transportation</Label>
                <Select
                  value={formData.transportation}
                  onValueChange={(value) =>
                    handleInputChange("transportation", value)
                  }>
                  <SelectTrigger>
                    <SelectValue placeholder='Select transportation' />
                  </SelectTrigger>
                  <SelectContent>
                    {transportationOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Special Requests / Notes */}
          <div className='space-y-4'>
            <Label>Special Requests / Notes</Label>
            <Textarea
              value={formData.specialRequests}
              onChange={(e) =>
                handleInputChange("specialRequests", e.target.value)
              }
              placeholder='Any dietary requirements, medical needs, or special requests'
            />
          </div>

          {/* Price Summary */}
          <div className='space-y-2'>
            <h3 className='text-lg font-semibold'>Price Summary</h3>
            <div className='flex justify-between'>
              <span>Total Price:</span>
              <span className='font-semibold'>${calculateTotal()}</span>
            </div>
          </div>

          {/* Actions */}
          <div className='flex justify-end space-x-2'>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Booking"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddBookingModal;
