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

interface AddCustomerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddCustomer: (customer: CustomerInput) => void;
}

const AddCustomerModal: React.FC<AddCustomerModalProps> = ({
  open,
  onOpenChange,
  onAddCustomer,
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
    preferences: [] as string[],
    status: "new",
    total_spent: "$0",
    upcoming_trip: "",
  });

  const [currentPreference, setCurrentPreference] = useState("");
  const [countryOptions, setCountryOptions] = useState<any[]>([]);

  useEffect(() => {
    const countryObj = countries.getNames("en", { select: "official" });
    const list = Object.entries(countryObj).map(([code, name]) => ({
      value: name as string,
      label: name as string,
      flag: getFlagEmoji(code),
    }));
    list.sort((a, b) => a.label.localeCompare(b.label));
    setCountryOptions(list);
  }, []);

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
    "new",
    "active",
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

    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Create CustomerInput object for Supabase
    const newCustomer: CustomerInput = {
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      phone: formData.phone,
      country: formData.country,
      status: formData.status,
      total_spent: formData.total_spent,
      upcoming_trip: formData.upcoming_trip || null,
      preferences: formData.preferences,
    };

    // Call the parent handler (which will call the Supabase service)
    onAddCustomer(newCustomer);

    // Reset form
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      country: "",
      preferences: [],
      status: "new",
      total_spent: "$0",
      upcoming_trip: "",
    });
  };

  // Utility to get flag emoji from ISO code
  const getFlagEmoji = (countryCode: string) =>
    countryCode
      .toUpperCase()
      .replace(/./g, (char) =>
        String.fromCodePoint(127397 + char.charCodeAt(0))
      );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Add New Customer</DialogTitle>
          <DialogDescription>
            Create a new customer profile. A unique LT-XXXX ID will be generated
            automatically.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-6'>
          {/* Personal Info */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Personal Information</h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='firstName'>First Name *</Label>
                <Input
                  id='firstName'
                  value={formData.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                  placeholder='Enter first name'
                  required
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='lastName'>Last Name *</Label>
                <Input
                  id='lastName'
                  value={formData.lastName}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                  placeholder='Enter last name'
                  required
                />
              </div>
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
                <Label htmlFor='status'>Customer Status</Label>
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

          {/* Business Info */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Business Information</h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='total_spent'>Total Spent</Label>
                <Input
                  id='total_spent'
                  value={formData.total_spent}
                  onChange={(e) =>
                    handleInputChange("total_spent", e.target.value)
                  }
                  placeholder='$0'
                />
              </div>
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

          {/* Actions */}
          <div className='flex flex-col sm:flex-row gap-3 pt-4'>
            <Button type='submit' className='flex-1'>
              Add Customer
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

export default AddCustomerModal;
