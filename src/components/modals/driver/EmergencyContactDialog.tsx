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
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Phone,
  AlertTriangle,
  MapPin,
  Hospital,
  Shield,
  Ambulance,
} from "lucide-react";

interface EmergencyContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EmergencyContactDialog: React.FC<EmergencyContactDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const emergencyContacts = [
    {
      category: "Operations Center",
      icon: Shield,
      color: "text-primary",
      bgColor: "bg-primary/10",
      contacts: [
        {
          name: "Operations Manager",
          number: "+255-123-456-789",
          available: "24/7",
        },
        {
          name: "Dispatch Center",
          number: "+255-123-456-790",
          available: "24/7",
        },
      ],
    },
    {
      category: "Medical Emergency",
      icon: Ambulance,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
      contacts: [
        { name: "Emergency Ambulance", number: "112", available: "24/7" },
        {
          name: "Arusha Lutheran Medical",
          number: "+255-27-254-4000",
          available: "24/7",
        },
        {
          name: "ALMC Emergency",
          number: "+255-27-254-4444",
          available: "24/7",
        },
      ],
    },
    {
      category: "Police & Security",
      icon: Shield,
      color: "text-warning",
      bgColor: "bg-warning/10",
      contacts: [
        { name: "Police Emergency", number: "112", available: "24/7" },
        {
          name: "Tourist Police",
          number: "+255-22-211-8877",
          available: "24/7",
        },
        {
          name: "Park Rangers (Serengeti)",
          number: "+255-28-262-1515",
          available: "24/7",
        },
      ],
    },
    {
      category: "Vehicle Breakdown",
      icon: Phone,
      color: "text-success",
      bgColor: "bg-success/10",
      contacts: [
        {
          name: "Fleet Manager",
          number: "+255-123-456-791",
          available: "24/7",
        },
        {
          name: "Roadside Assistance",
          number: "+255-123-456-792",
          available: "24/7",
        },
      ],
    },
  ];

  const quickActions = [
    {
      icon: Phone,
      label: "Call Operations",
      number: "+255-123-456-789",
      color: "primary",
    },
    {
      icon: Ambulance,
      label: "Medical Emergency",
      number: "112",
      color: "destructive",
    },
    { icon: Shield, label: "Police", number: "112", color: "warning" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-3xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center'>
            <AlertTriangle className='h-5 w-5 mr-2 text-destructive' />
            Emergency Contacts
          </DialogTitle>
          <DialogDescription>
            Quick access to important emergency numbers and support contacts
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Quick Actions */}
          <Card className='p-4 bg-destructive/5 border-destructive/20'>
            <h3 className='font-semibold mb-3 flex items-center text-destructive'>
              <AlertTriangle className='h-4 w-4 mr-2' />
              Quick Emergency Actions
            </h3>
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={index}
                    variant='outline'
                    className='h-auto py-4 flex flex-col items-center space-y-2'>
                    <Icon className={`h-6 w-6 text-${action.color}`} />
                    <div className='text-center'>
                      <p className='font-medium text-sm'>{action.label}</p>
                      <p className='text-xs text-muted-foreground'>
                        {action.number}
                      </p>
                    </div>
                  </Button>
                );
              })}
            </div>
          </Card>

          {/* Emergency Contact Categories */}
          {emergencyContacts.map((category, index) => {
            const Icon = category.icon;
            return (
              <Card key={index} className='p-4 space-y-3'>
                <h3 className='font-semibold flex items-center'>
                  <div className={`p-2 ${category.bgColor} rounded-lg mr-2`}>
                    <Icon className={`h-4 w-4 ${category.color}`} />
                  </div>
                  {category.category}
                </h3>
                <Separator />
                <div className='space-y-3'>
                  {category.contacts.map((contact, contactIndex) => (
                    <div
                      key={contactIndex}
                      className='flex items-center justify-between p-3 bg-muted/50 rounded-lg'>
                      <div>
                        <p className='font-medium'>{contact.name}</p>
                        <p className='text-sm text-muted-foreground'>
                          Available: {contact.available}
                        </p>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <p className='font-mono font-semibold'>
                          {contact.number}
                        </p>
                        <Button size='sm' variant='outline'>
                          <Phone className='h-4 w-4' />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}

          {/* Important Notes */}
          <Card className='p-4 space-y-3 bg-warning/5 border-warning/20'>
            <h3 className='font-semibold flex items-center text-warning text-sm'>
              <AlertTriangle className='h-4 w-4 mr-2' />
              Important Emergency Guidelines
            </h3>
            <Separator />
            <ul className='text-sm text-muted-foreground space-y-2'>
              <li>
                • <strong>Always call Operations Center first</strong> - they
                will coordinate emergency response
              </li>
              <li>• For medical emergencies, call 112 immediately</li>
              <li>• Note your exact GPS coordinates before calling</li>
              <li>• Keep this list easily accessible at all times</li>
              <li>
                • In remote areas, use satellite phone if cellular signal is
                unavailable
              </li>
              <li>• All calls to emergency services are recorded for safety</li>
            </ul>
          </Card>

          {/* Current Location Info */}
          <Card className='p-4 space-y-3'>
            <h3 className='font-semibold flex items-center text-sm'>
              <MapPin className='h-4 w-4 mr-2 text-primary' />
              Nearest Emergency Services
            </h3>
            <Separator />
            <div className='space-y-2 text-sm'>
              <div className='flex items-center justify-between'>
                <span className='text-muted-foreground'>Nearest Hospital:</span>
                <span className='font-medium'>
                  Arusha Lutheran Medical (45 km)
                </span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-muted-foreground'>Nearest Police:</span>
                <span className='font-medium'>Ngorongoro Station (12 km)</span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-muted-foreground'>Park Rangers:</span>
                <span className='font-medium'>Serengeti HQ (8 km)</span>
              </div>
            </div>
          </Card>
        </div>

        <DialogFooter>
          <Button
            type='button'
            onClick={() => onOpenChange(false)}
            className='w-full sm:w-auto'>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EmergencyContactDialog;
