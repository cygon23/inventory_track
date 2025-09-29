import React, { useEffect, useRef } from 'react';
import { MapPin, Phone, Clock, CheckCircle, AlertCircle, Car } from 'lucide-react';
import { gsap } from 'gsap';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/Layout';
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery';

const FieldDashboard: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    gsap.from(containerRef.current, {
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: "power2.out"
    });
  }, []);

  const { data: customers } = useSupabaseQuery<any>('customers', '*');
  const todaysClients = customers.filter((client: any) => 
    client.journey_status === 'arrived' || client.journey_status === 'confirmed'
  );

  const currentTime = new Date().toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  const schedule = [
    { time: '08:00', activity: 'Client Pickup - Sarah Johnson', location: 'Kilimanjaro Airport', status: 'completed' },
    { time: '10:30', activity: 'Game Drive Start - Sarah Johnson', location: 'Serengeti Gate', status: 'active' },
    { time: '14:00', activity: 'Lunch Break', location: 'Seronera Lodge', status: 'upcoming' },
    { time: '16:00', activity: 'Afternoon Game Drive', location: 'Central Serengeti', status: 'upcoming' },
    { time: '18:30', activity: 'Return to Lodge', location: 'Four Seasons Safari Lodge', status: 'upcoming' }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-success" />;
      case 'active': return <Clock className="w-4 h-4 text-accent-gold animate-pulse" />;
      case 'upcoming': return <AlertCircle className="w-4 h-4 text-muted-foreground" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-success text-success-foreground';
      case 'active': return 'bg-accent-gold text-foreground';
      case 'upcoming': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Layout userType="field">
      <div ref={containerRef} className="space-y-6">
        {/* Header */}
        <div className="safari-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Field Dashboard</h1>
              <p className="text-muted-foreground mt-2">Today's safari schedule and client updates</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">{currentTime}</div>
              <div className="text-sm text-muted-foreground">Current Time</div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="safari-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Today's Clients</p>
                  <p className="text-3xl font-bold text-foreground">{todaysClients.length}</p>
                </div>
                <Car className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="safari-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Safari</p>
                  <p className="text-3xl font-bold text-accent-gold">1</p>
                </div>
                <MapPin className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="safari-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-3xl font-bold text-success">2</p>
                </div>
                <CheckCircle className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Schedule */}
        <Card className="safari-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-primary" />
              <span>Today's Schedule</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {schedule.map((item, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-secondary rounded-lg">
                  <div className="text-center min-w-[60px]">
                    <div className="text-sm font-semibold text-foreground">{item.time}</div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      {getStatusIcon(item.status)}
                      <h4 className="font-medium text-foreground">{item.activity}</h4>
                      <Badge className={getStatusColor(item.status)} variant="outline">
                        {item.status}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      <span>{item.location}</span>
                    </div>
                  </div>
                  {item.status === 'active' && (
                    <Button size="sm" className="safari-gradient">
                      Update Status
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Active Clients */}
        <Card className="safari-card">
          <CardHeader>
            <CardTitle>Active Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todaysClients.map((client: any) => (
                <div key={client.id} className="p-4 border border-border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-foreground">{client.name}</h4>
                      <p className="text-sm text-muted-foreground">{client.safari_package ?? ''}</p>
                    </div>
                    <Badge className={client.journey_status === 'arrived' ? 'bg-accent-gold text-foreground' : 'bg-primary text-primary-foreground'}>
                      {client.journey_status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Contact Information</p>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 text-sm">
                          <Phone className="w-3 h-3" />
                          <span>{client.phone}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Special Requirements</p>
                      <div className="flex flex-wrap gap-1">
                        {client.specialRequirements.slice(0, 3).map((req, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {req}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 mt-4">
                    <Button size="sm" variant="outline">
                      <Phone className="w-3 h-3 mr-1" />
                      Call Client
                    </Button>
                    <Button size="sm" className="safari-gradient">
                      Update Journey
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contacts */}
        <Card className="safari-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-destructive" />
              <span>Emergency Contacts</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <h4 className="font-semibold text-foreground mb-2">Medical Emergency</h4>
                <p className="text-sm text-muted-foreground mb-1">Arusha Medical Center</p>
                <p className="font-mono text-foreground">+255-27-250-8888</p>
              </div>
              
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <h4 className="font-semibold text-foreground mb-2">Park Rangers</h4>
                <p className="text-sm text-muted-foreground mb-1">Serengeti Control Room</p>
                <p className="font-mono text-foreground">+255-28-262-1515</p>
              </div>
              
              <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
                <h4 className="font-semibold text-foreground mb-2">Office Coordinator</h4>
                <p className="text-sm text-muted-foreground mb-1">Grace Mollel</p>
                <p className="font-mono text-foreground">+255-784-123458</p>
              </div>
              
              <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
                <h4 className="font-semibold text-foreground mb-2">Vehicle Support</h4>
                <p className="text-sm text-muted-foreground mb-1">Mechanical Services</p>
                <p className="font-mono text-foreground">+255-784-999888</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default FieldDashboard;