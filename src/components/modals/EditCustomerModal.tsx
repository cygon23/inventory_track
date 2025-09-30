import { useState, useEffect } from "react";
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
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CustomerInput } from "@/lib/customerService";

// Country libs
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
import ReactSelect from "react-select";

// Shadcn Select for preferences
import {
  Select as ShadcnSelect,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

countries.registerLocale(enLocale);

// UI Customer interface (from parent component)
interface UICustomer {
  id: string; // This is the custom_id (LT-XXXX)
  name: string;
  email: string;
  phone: string;
  country: string;
  totalBookings: number;
  totalSpent: string;
  lastBooking: string | null;
  status: string;
  rating: number | null;
  joinDate: string;
  preferences: string[];
  upcomingTrip: string | null;
}

interface EditCustomerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: UICustomer | null;
  onSave: (customerData: Partial<CustomerInput>) => void;
}

const EditCustomerModal: React.FC<EditCustomerModalProps> = ({
  open,
  onOpenChange,
  customer,
  onSave,
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    preferences: [] as string[],
    status: "",
    upcoming_trip: "",
  });

  const [currentPreference, setCurrentPreference] = useState("");
  const [countryOptions, setCountryOptions] = useState<any[]>([]);

  useEffect(() => {
    const countryObj = countries.getNames("en", { select: "official" });
    const list = Object.entries(countryObj).map(([code, name]) => ({
      value: name,
      label: name,
      flag: getFlagEmoji(code),
    }));
    list.sort((a, b) => a.label.localeCompare(b.label));
    setCountryOptions(list);
  }, []);

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        country: customer.country,
        preferences: [...customer.preferences],
        status: customer.status,
        upcoming_trip: customer.upcomingTrip || "",
      });
    }
  }, [customer]);

  const commonPreferences = [
    "Wildlife Photography",
    "Luxury Lodges",
    "Budget Safari",
    "Family Safari",
    "Honeymoon Package",
    "Adventure Safari",
    "Cultural Experiences",
    "Conservation Tours",
    "Solo Travel",
    "Group Tours",
  ];

  const statusOptions = [
    "active",
    "new",
    "returning",
    "vip",
    "inquiry",
    "inactive",
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addPreference = (preference: string) => {
    if (preference && !formData.preferences.includes(preference)) {
      setFormData((prev) => ({
        ...prev,
        preferences: [...prev.preferences, preference],
      }));
      setCurrentPreference("");
    }
  };

  const removePreference = (preference: string) => {
    setFormData((prev) => ({
      ...prev,
      preferences: prev.preferences.filter((p) => p !== preference),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (!customer) return;

    // Create CustomerInput object for Supabase update
    const updatedData: Partial<CustomerInput> = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      country: formData.country,
      preferences: formData.preferences,
      status: formData.status,
      upcoming_trip: formData.upcoming_trip || null,
    };

    // Call the parent handler (which will call the Supabase service)
    onSave(updatedData);
  };

  // Utility to get flag emoji from ISO code
  const getFlagEmoji = (countryCode: string) =>
    countryCode
      .toUpperCase()
      .replace(/./g, (char) =>
        String.fromCodePoint(127397 + char.charCodeAt(0))
      );

  if (!customer) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Edit Customer</DialogTitle>
          <DialogDescription>
            Update customer profile information and preferences for{" "}
            {customer.id}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-6'>
          {/* Personal Info */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Personal Information</h3>
            <div className='space-y-2'>
              <Label htmlFor='name'>Full Name *</Label>
              <Input
                id='name'
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder='Enter full name'
                required
              />
            </div>
          </div>

          {/* Contact Info */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Contact Information</h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='email'>Email Address *</Label>
                <Input
                  id='email'
                  type='email'
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder='customer@email.com'
                  required
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='phone'>Phone Number</Label>
                <Input
                  id='phone'
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder='+1-555-0123'
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='country'>Country</Label>
                <ReactSelect
                  options={countryOptions}
                  value={countryOptions.find(
                    (c) => c.value === formData.country
                  )}
                  onChange={(option) =>
                    handleInputChange("country", option?.value || "")
                  }
                  placeholder='Select country...'
                  isSearchable
                  formatOptionLabel={(option: any) => (
                    <div className='flex items-center gap-2'>
                      <span>{option.flag}</span>
                      <span>{option.label}</span>
                    </div>
                  )}
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='status'>Status</Label>
                <ShadcnSelect
                  value={formData.status}
                  onValueChange={(value) => handleInputChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder='Select status' />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </ShadcnSelect>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Safari Preferences</h3>
            <div className='space-y-2'>
              <Label>Select Preferences</Label>
              <ShadcnSelect
                value={currentPreference}
                onValueChange={setCurrentPreference}>
                <SelectTrigger>
                  <SelectValue placeholder='Choose safari preference' />
                </SelectTrigger>
                <SelectContent>
                  {commonPreferences.map((pref) => (
                    <SelectItem key={pref} value={pref}>
                      {pref}
                    </SelectItem>
                  ))}
                </SelectContent>
              </ShadcnSelect>
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={() => addPreference(currentPreference)}
                disabled={
                  !currentPreference ||
                  formData.preferences.includes(currentPreference)
                }>
                Add Preference
              </Button>
            </div>

            {formData.preferences.length > 0 && (
              <div className='space-y-2'>
                <Label>Selected Preferences</Label>
                <div className='flex flex-wrap gap-2'>
                  {formData.preferences.map((pref) => (
                    <Badge
                      key={pref}
                      variant='secondary'
                      className='flex items-center gap-1'>
                      {pref}
                      <button
                        type='button'
                        onClick={() => removePreference(pref)}
                        className='ml-1 hover:text-destructive'>
                        <X className='h-3 w-3' />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Upcoming Trip */}
          <div className='space-y-2'>
            <Label htmlFor='upcoming_trip'>Upcoming Trip</Label>
            <Input
              id='upcoming_trip'
              value={formData.upcoming_trip}
              onChange={(e) =>
                handleInputChange("upcoming_trip", e.target.value)
              }
              placeholder='e.g., 3-Day Serengeti Explorer'
            />
          </div>

          {/* Actions */}
          <div className='flex flex-col sm:flex-row gap-3 pt-4'>
            <Button type='submit' className='flex-1'>
              Save Changes
            </Button>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
              className='flex-1'>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCustomerModal;
