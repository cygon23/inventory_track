import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Clock, 
  Users, 
  Fuel,
  Navigation,
  CheckCircle,
  AlertTriangle,
  Car,
  Calendar,
  MessageSquare
} from 'lucide-react';
import { User } from '@/data/mockUsers';

interface DriverDashboardProps {
  currentUser: User;
}

const DriverDashboard: React.FC<DriverDashboardProps> = ({ currentUser }) => {
  const stats = [
    {
      title: 'Today\'s Trips',
      value: '2',
      change: 'Next pickup: 7:00 AM',
      icon: Calendar,
      color: 'text-primary'
    },
    {
      title: 'This Week',
      value: '8',
      change: '3 completed',
      icon: MapPin,
      color: 'text-success'
    },
    {
      title: 'Current Guests',
      value: '4',
      change: 'Johnson Family',
      icon: Users,
      color: 'text-warning'
    },
    {
      title: 'Vehicle Status',
      value: 'Good',
      change: 'Last service: 2 weeks',
      icon: Car,
      color: 'text-success'
    }
  ];

  const currentTrip = {
    id: 'SF001',
    customers: 'Johnson Family (4 people)',
    package: '3-Day Serengeti Explorer',
    status: 'in_progress',
    day: 'Day 2 of 3',
    nextStop: 'Serengeti Visitor Center',
    estimatedTime: '45 minutes',
    notes: 'Family interested in big cats photography'
  };

  const upcomingTrips = [
    {
      id: 'SF005',
      customer: 'Michael & Sarah Brown',
      package: 'Ngorongoro Day Trip',
      date: 'Today',
      time: '2:00 PM',
      pickup: 'Arusha Hotel',
      guests: 2,
      priority: 'high'
    },
    {
      id: 'SF006',
      customer: 'David Chen',
      package: '5-Day Photography Safari',
      date: 'Tomorrow',
      time: '6:00 AM',
      pickup: 'Kilimanjaro Airport',
      guests: 1,
      priority: 'medium'
    },
    {
      id: 'SF007',
      customer: 'Wilson Family',
      package: '4-Day Tarangire & Manyara',
      date: 'Jan 17',
      time: '7:30 AM',
      pickup: 'Arusha Hotel',
      guests: 5,
      priority: 'medium'
    }
  ];

  const vehicleInfo = {
    model: 'Toyota Land Cruiser',
    plate: 'T123ABC',
    fuelLevel: 85,
    mileage: '45,230 km',
    lastService: '2 weeks ago',
    nextService: 'In 2 weeks',
    issues: []
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      urgent: 'bg-destructive/10 text-destructive border-destructive/20',
      high: 'bg-warning/10 text-warning border-warning/20',
      medium: 'bg-primary/10 text-primary border-primary/20',
      low: 'bg-muted/10 text-muted-foreground border-muted/20'
    };
    return colors[priority as keyof typeof colors] || 'bg-muted/10 text-muted-foreground border-muted/20';
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Good morning, {currentUser.name}
        </h1>
        <p className="text-muted-foreground">
          Ready for another great safari day! Check your schedule and vehicle status.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="safari-card">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-xl md:text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">
                      {stat.change}
                    </p>
                  </div>
                  <Icon className={`h-6 w-6 md:h-8 md:w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Current Trip */}
        <Card className="safari-card">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Navigation className="h-5 w-5 mr-2 text-primary" />
              Current Trip
            </CardTitle>
            <CardDescription>Active safari in progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{currentTrip.customers}</h3>
                  <p className="text-sm text-muted-foreground">{currentTrip.package}</p>
                  <Badge className="mt-2 bg-success/10 text-success border-success/20">
                    {currentTrip.day}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">#{currentTrip.id}</p>
                  <Badge className="bg-primary/10 text-primary border-primary/20">
                    In Progress
                  </Badge>
                </div>
              </div>
              
              <div className="border-t pt-4 space-y-3">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Next Stop</p>
                    <p className="text-sm text-muted-foreground">{currentTrip.nextStop}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Clock className="h-4 w-4 text-warning" />
                  <div>
                    <p className="text-sm font-medium">Estimated Time</p>
                    <p className="text-sm text-muted-foreground">{currentTrip.estimatedTime}</p>
                  </div>
                </div>
                
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-sm font-medium mb-1">Guest Notes:</p>
                  <p className="text-sm text-muted-foreground">{currentTrip.notes}</p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button size="sm" className="flex-1">
                  <Navigation className="h-4 w-4 mr-1" />
                  Navigate
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Contact
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vehicle Status */}
        <Card className="safari-card">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Car className="h-5 w-5 mr-2 text-primary" />
              Vehicle Status
            </CardTitle>
            <CardDescription>Your assigned vehicle information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{vehicleInfo.model}</h3>
                  <p className="text-sm text-muted-foreground">Plate: {vehicleInfo.plate}</p>
                </div>
                <Badge className="bg-success/10 text-success border-success/20">
                  Operational
                </Badge>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Fuel className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Fuel Level</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{vehicleInfo.fuelLevel}%</span>
                </div>
                <div className="w-full bg-muted/50 rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${vehicleInfo.fuelLevel}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium">Mileage</p>
                  <p className="text-muted-foreground">{vehicleInfo.mileage}</p>
                </div>
                <div>
                  <p className="font-medium">Last Service</p>
                  <p className="text-muted-foreground">{vehicleInfo.lastService}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 text-sm">
                <CheckCircle className="h-4 w-4 text-success" />
                <span className="text-muted-foreground">Next service: {vehicleInfo.nextService}</span>
              </div>
              
              <Button size="sm" variant="outline" className="w-full">
                Report Issue
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Trips */}
      <Card className="safari-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-lg">
            Upcoming Trips
            <Button variant="outline" size="sm">View Schedule</Button>
          </CardTitle>
          <CardDescription>Your scheduled pickups and trips</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingTrips.map((trip) => (
              <div key={trip.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-border rounded-lg space-y-2 sm:space-y-0">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-sm sm:text-base">{trip.customer}</p>
                      <Badge className={getPriorityColor(trip.priority)}>
                        {trip.priority}
                      </Badge>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground">{trip.package}</p>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                      <span>#{trip.id}</span>
                      <span>{trip.guests} guests</span>
                      <span>Pickup: {trip.pickup}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:text-right space-y-1">
                  <p className="text-sm font-medium">{trip.date}</p>
                  <p className="text-sm text-muted-foreground">{trip.time}</p>
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DriverDashboard;