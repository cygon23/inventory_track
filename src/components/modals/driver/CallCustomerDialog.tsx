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
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Phone,
  Mail,
  MessageSquare,
  User,
  Clock,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { useCreateCommunication } from "../../../features/driver/hooks/useCommunication";
import { useTripCommunications } from "../../../features/driver/hooks/useCommunication";
import type {
  TripWithDetails,
  CommunicationType,
} from "../../../features/driver/types/trip.types";
import { toast } from "sonner";

interface CallCustomerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trip: TripWithDetails | null;
  driverId: string;
}

const CallCustomerDialog: React.FC<CallCustomerDialogProps> = ({
  open,
  onOpenChange,
  trip,
  driverId,
}) => {
  const [customMessage, setCustomMessage] = useState("");

  const { mutate: createCommunication, isPending } =
    useCreateCommunication(driverId);
  const { data: communications, isLoading: loadingHistory } =
    useTripCommunications(trip?.id || "");

  if (!trip) return null;

  const handleCommunication = (type: CommunicationType, message?: string) => {
    createCommunication(
      {
        trip_id: trip.id,
        communication_type: type,
        message: message || undefined,
      },
      {
        onSuccess: () => {
          if (type === "call") {
            // Initiate phone call
            window.location.href = `tel:${trip.booking?.customer_phone}`;
          } else if (type === "sms") {
            // Open SMS app
            window.location.href = `sms:${trip.booking?.customer_phone}${
              message ? `?body=${encodeURIComponent(message)}` : ""
            }`;
          } else if (type === "email") {
            // Open email client
            window.location.href = `mailto:${trip.booking?.customer_email}${
              message ? `?body=${encodeURIComponent(message)}` : ""
            }`;
          }
          setCustomMessage("");
        },
      }
    );
  };

  const quickMessages = [
    "On my way to pickup location",
    "Running 15 minutes late",
    "Arrived at pickup location",
    "Trip completed successfully",
  ];

  const getCommTypeIcon = (type: string) => {
    switch (type) {
      case "call":
        return <Phone className='h-3 w-3 text-primary' />;
      case "sms":
        return <MessageSquare className='h-3 w-3 text-success' />;
      case "email":
        return <Mail className='h-3 w-3 text-warning' />;
      default:
        return <MessageSquare className='h-3 w-3 text-muted-foreground' />;
    }
  };

  const getCommTypeBg = (type: string) => {
    switch (type) {
      case "call":
        return "bg-primary/10";
      case "sms":
        return "bg-success/10";
      case "email":
        return "bg-warning/10";
      default:
        return "bg-muted/10";
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor(
      (now.getTime() - time.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
    }
    const days = Math.floor(diffInMinutes / 1440);
    return `${days} ${days === 1 ? "day" : "days"} ago`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center'>
            <Phone className='h-5 w-5 mr-2 text-primary' />
            Contact Customer - {trip.booking?.booking_reference || trip.id}
          </DialogTitle>
          <DialogDescription>
            Communicate with {trip.customer_name}
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Customer Info */}
          <Card className='p-4 space-y-3 bg-primary/5 border-primary/20'>
            <h3 className='font-semibold text-sm flex items-center'>
              <User className='h-4 w-4 mr-2' />
              Customer Information
            </h3>
            <Separator />
            <div className='space-y-2 text-sm'>
              <div className='flex items-center justify-between'>
                <span className='text-muted-foreground'>Name:</span>
                <span className='font-medium'>{trip.customer_name}</span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-muted-foreground'>Phone:</span>
                <span className='font-medium font-mono'>
                  {trip.booking?.customer_phone || "Not available"}
                </span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-muted-foreground'>Email:</span>
                <span className='font-medium'>
                  {trip.booking?.customer_email || "Not available"}
                </span>
              </div>
            </div>
          </Card>

          {/* Contact Methods */}
          <Card className='p-4 space-y-4'>
            <h3 className='font-semibold'>Contact Methods</h3>
            <Separator />
            <div className='grid grid-cols-1 gap-3'>
              <Button
                variant='outline'
                className='h-auto py-4 justify-start'
                onClick={() => handleCommunication("call")}
                disabled={isPending || !trip.booking?.customer_phone}>
                <div className='flex items-center space-x-3 w-full'>
                  <div className='p-2 bg-primary/10 rounded-lg'>
                    <Phone className='h-5 w-5 text-primary' />
                  </div>
                  <div className='text-left flex-1'>
                    <p className='font-medium'>Call Customer</p>
                    <p className='text-sm text-muted-foreground'>
                      {trip.booking?.customer_phone || "Phone not available"}
                    </p>
                  </div>
                </div>
              </Button>

              <Button
                variant='outline'
                className='h-auto py-4 justify-start'
                onClick={() => handleCommunication("sms")}
                disabled={isPending || !trip.booking?.customer_phone}>
                <div className='flex items-center space-x-3 w-full'>
                  <div className='p-2 bg-success/10 rounded-lg'>
                    <MessageSquare className='h-5 w-5 text-success' />
                  </div>
                  <div className='text-left flex-1'>
                    <p className='font-medium'>Send SMS</p>
                    <p className='text-sm text-muted-foreground'>
                      Quick text message
                    </p>
                  </div>
                </div>
              </Button>

              <Button
                variant='outline'
                className='h-auto py-4 justify-start'
                onClick={() => handleCommunication("email")}
                disabled={isPending || !trip.booking?.customer_email}>
                <div className='flex items-center space-x-3 w-full'>
                  <div className='p-2 bg-warning/10 rounded-lg'>
                    <Mail className='h-5 w-5 text-warning' />
                  </div>
                  <div className='text-left flex-1'>
                    <p className='font-medium'>Send Email</p>
                    <p className='text-sm text-muted-foreground'>
                      {trip.booking?.customer_email || "Email not available"}
                    </p>
                  </div>
                </div>
              </Button>
            </div>
          </Card>

          {/* Quick Messages */}
          <Card className='p-4 space-y-3'>
            <h3 className='font-semibold text-sm'>Quick Messages</h3>
            <Separator />
            <div className='space-y-2'>
              {quickMessages.map((message, index) => (
                <Button
                  key={index}
                  variant='outline'
                  size='sm'
                  className='w-full justify-start text-sm'
                  onClick={() => handleCommunication("sms", message)}
                  disabled={isPending}>
                  "{message}"
                </Button>
              ))}
            </div>
          </Card>

          {/* Custom Message */}
          <Card className='p-4 space-y-3'>
            <h3 className='font-semibold text-sm'>Custom Message</h3>
            <Separator />
            <Textarea
              placeholder='Type your custom message here...'
              rows={4}
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              disabled={isPending}
            />
            <div className='flex space-x-2'>
              <Button
                size='sm'
                variant='outline'
                className='flex-1'
                onClick={() => handleCommunication("sms", customMessage)}
                disabled={isPending || !customMessage.trim()}>
                {isPending ? (
                  <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                ) : (
                  <MessageSquare className='h-4 w-4 mr-2' />
                )}
                Send SMS
              </Button>
              <Button
                size='sm'
                variant='outline'
                className='flex-1'
                onClick={() => handleCommunication("email", customMessage)}
                disabled={isPending || !customMessage.trim()}>
                {isPending ? (
                  <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                ) : (
                  <Mail className='h-4 w-4 mr-2' />
                )}
                Send Email
              </Button>
            </div>
          </Card>

          {/* Communication History */}
          <Card className='p-4 space-y-3'>
            <h3 className='font-semibold text-sm flex items-center'>
              <Clock className='h-4 w-4 mr-2' />
              Recent Communications
            </h3>
            <Separator />
            {loadingHistory ? (
              <div className='text-center py-4'>
                <Loader2 className='h-6 w-6 animate-spin mx-auto text-muted-foreground' />
              </div>
            ) : communications && communications.length > 0 ? (
              <div className='space-y-3'>
                {communications.slice(0, 5).map((comm) => (
                  <div
                    key={comm.id}
                    className='flex items-start space-x-3 text-sm'>
                    <div
                      className={`p-1.5 rounded-lg ${getCommTypeBg(
                        comm.communication_type
                      )}`}>
                      {getCommTypeIcon(comm.communication_type)}
                    </div>
                    <div className='flex-1'>
                      <div className='flex items-center justify-between'>
                        <span className='font-medium capitalize'>
                          {comm.communication_type}
                        </span>
                        <span className='text-xs text-muted-foreground'>
                          {formatTimeAgo(comm.created_at)}
                        </span>
                      </div>
                      {comm.message && (
                        <p className='text-muted-foreground mt-1'>
                          {comm.message}
                        </p>
                      )}
                    </div>
                    <CheckCircle className='h-4 w-4 text-success' />
                  </div>
                ))}
              </div>
            ) : (
              <p className='text-sm text-muted-foreground text-center py-4'>
                No communication history yet
              </p>
            )}
          </Card>
        </div>

        <DialogFooter>
          <Button
            type='button'
            onClick={() => onOpenChange(false)}
            disabled={isPending}
            className='w-full sm:w-auto'>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CallCustomerDialog;
