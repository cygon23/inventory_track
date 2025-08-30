import React, { useEffect, useRef } from 'react';
import { X, Phone, Mail, Calendar, MapPin, CreditCard, FileText, MessageSquare } from 'lucide-react';
import { gsap } from 'gsap';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { JourneyTracker } from './JourneyTracker';
import { Client } from '@/data/mockData';

interface ClientDetailsModalProps {
  client: Client | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ClientDetailsModal: React.FC<ClientDetailsModalProps> = ({
  client,
  open,
  onOpenChange
}) => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && contentRef.current) {
      gsap.from(contentRef.current, {
        opacity: 0,
        scale: 0.95,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  }, [open]);

  if (!client) return null;

  const getPaymentProgress = () => {
    return (client.paidAmount / client.totalCost) * 100;
  };

  const getDaysUntilSafari = () => {
    const safariDate = new Date(client.safariDates.start);
    const today = new Date();
    const diffTime = safariDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const paymentProgress = getPaymentProgress();
  const daysUntil = getDaysUntilSafari();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div>
              <span className="text-xl font-bold">{client.name}</span>
              <Badge className="ml-2 bg-primary text-primary-foreground">
                {client.journeyStatus.charAt(0).toUpperCase() + client.journeyStatus.slice(1)}
              </Badge>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div ref={contentRef} className="space-y-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="journey">Journey</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="communications">Messages</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{client.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{client.phone}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Safari Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Safari Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm font-medium">{client.safariPackage}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">
                        {new Date(client.safariDates.start).toLocaleDateString()} - 
                        {new Date(client.safariDates.end).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Days until safari: </span>
                      <span className="font-semibold">
                        {daysUntil > 0 ? `${daysUntil} days` : daysUntil === 0 ? 'Today!' : 'In progress'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Emergency Contact */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Emergency Contact</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p className="font-medium">{client.emergencyContact.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Relationship</p>
                      <p className="font-medium">{client.emergencyContact.relationship}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{client.emergencyContact.phone}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Special Requirements */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Special Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {client.specialRequirements.map((req, index) => (
                      <Badge key={index} variant="outline">
                        {req}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="journey" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Safari Journey Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <JourneyTracker currentStatus={client.journeyStatus} />
                </CardContent>
              </Card>
              
              <div className="flex space-x-2">
                <Button className="safari-gradient">Update Status</Button>
                <Button variant="outline">Send Update to Client</Button>
              </div>
            </TabsContent>

            <TabsContent value="payments" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CreditCard className="w-5 h-5" />
                    <span>Payment Details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Payment Progress</span>
                      <span>{paymentProgress.toFixed(0)}%</span>
                    </div>
                    <Progress value={paymentProgress} className="h-2" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3 bg-secondary rounded-lg">
                      <p className="text-sm text-muted-foreground">Total Cost</p>
                      <p className="text-xl font-bold">${client.totalCost.toLocaleString()}</p>
                    </div>
                    <div className="p-3 bg-secondary rounded-lg">
                      <p className="text-sm text-muted-foreground">Paid Amount</p>
                      <p className="text-xl font-bold text-success">${client.paidAmount.toLocaleString()}</p>
                    </div>
                    <div className="p-3 bg-secondary rounded-lg">
                      <p className="text-sm text-muted-foreground">Outstanding</p>
                      <p className="text-xl font-bold text-destructive">
                        ${(client.totalCost - client.paidAmount).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {paymentProgress < 100 && (
                    <div className="flex space-x-2">
                      <Button className="safari-gradient">Send Payment Reminder</Button>
                      <Button variant="outline">Mark as Paid</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="communications" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Communication History</span>
                    <Button size="sm" className="safari-gradient">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      New Message
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {client.communications.map((comm) => (
                      <div key={comm.id} className="p-4 border border-border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">{comm.type}</Badge>
                            <span className="text-sm font-medium">{comm.sender}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(comm.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{comm.content}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge 
                            className={
                              comm.status === 'read' 
                                ? 'bg-success text-success-foreground' 
                                : 'bg-warning text-warning-foreground'
                            }
                          >
                            {comm.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};