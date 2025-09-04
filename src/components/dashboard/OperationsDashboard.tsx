import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Car, 
  Users, 
  Calendar,
  Navigation,
  AlertTriangle,
  CheckCircle,
  Clock,
  Fuel,
  UserCheck
} from 'lucide-react';
import { User } from '@/data/mockUsers';

interface OperationsDashboardProps {
  currentUser: User;
}

const OperationsDashboard: React.FC<OperationsDashboardProps> = ({ currentUser }) => {
  const stats = [
    {
      title: 'Active Trips',
      value: '12',
      change: '3 starting today',
      icon: MapPin,
      color: 'text-primary'
    },
    {
      title: 'Available Drivers',
      value: '8',
      change: '2 on leave',
      icon: UserCheck,
      color: 'text-success'
    },
    {
      title: 'Fleet Status',
      value: '15/18',
      change: '3 in maintenance',
      icon: Car,
      color: 'text-warning'
    },
    {
      title: 'Pending Assignments',
      value: '5',
      change: '2 urgent',
      icon: Clock,
      color: 'text-destructive'
    }
  ];

  const activeTrips = [
    {
      id: 'SF001',
      driver: 'James Mollel',
      customers: 'Johnson Family',
      route: 'Serengeti Central',
      status: 'in_transit',
      progress: 65,
      nextStop: 'Seronera Lodge',
      estimatedArrival: '2:30 PM',
      vehicle: 'LC-001'
    },
    {
      id: 'SF002',
      driver: 'Mary Kileo',
      customers: 'Brown Couple',
      route: 'Ngorongoro Crater',
      status: 'game_drive',
      progress: 40,
      nextStop: 'Crater Lodge',
      estimatedArrival: '4:00 PM',
      vehicle: 'LC-002'
    },
    {
      id: 'SF003',
      driver: 'Peter Sanga',
      customers: 'Chen Group',
      route: 'Tarangire NP',
      status: 'lunch_break',
      progress: 50,
      nextStop: 'Tarangire Lodge',
      estimatedArrival: '5:30 PM',
      vehicle: 'LC-003'
    }
  ];

  const pendingAssignments = [
    {
      id: 'SF007',
      customer: 'Wilson Family',
      package: '4-Day Northern Circuit',
      startDate: 'Tomorrow - 7:00 AM',
      pickup: 'Kilimanjaro Airport',
      guests: 5,
      preferredDriver: 'James Mollel',
      priority: 'urgent',
      requirements: 'Child seats needed'
    },
    {
      id: 'SF008',
      customer: 'Anderson Group',
      package: '3-Day Serengeti',
      startDate: 'Jan 17 - 6:30 AM',
      pickup: 'Arusha Hotel',
      guests: 8,
      preferredDriver: 'Any available',
      priority: 'high',
      requirements: 'Photography equipment transport'
    }
  ];

  const driverStatus = [
    {
      name: 'James Mollel',
      status: 'on_trip',
      currentTrip: 'SF001',
      location: 'Serengeti Central',
      nextAvailable: '5:00 PM',
      rating: 4.9,
      vehicle: 'LC-001'
    },
    {
      name: 'Mary Kileo',
      status: 'on_trip',
      currentTrip: 'SF002',
      location: 'Ngorongoro',
      nextAvailable: '6:00 PM',
      rating: 4.8,
      vehicle: 'LC-002'
    },
    {
      name: 'Peter Sanga',
      status: 'on_trip',
      currentTrip: 'SF003',
      location: 'Tarangire',
      nextAvailable: '7:00 PM',
      rating: 4.7,
      vehicle: 'LC-003'
    },
    {
      name: 'Grace Mwamba',
      status: 'available',
      currentTrip: null,
      location: 'Arusha Base',
      nextAvailable: 'Now',
      rating: 4.9,
      vehicle: 'LC-004'
    },
    {
      name: 'John Kimaro',
      status: 'available',
      currentTrip: null,
      location: 'Arusha Base',
      nextAvailable: 'Now',
      rating: 4.6,
      vehicle: 'LC-005'
    }
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      in_transit: 'bg-primary/10 text-primary border-primary/20',
      game_drive: 'bg-success/10 text-success border-success/20',
      lunch_break: 'bg-warning/10 text-warning border-warning/20',
      on_trip: 'bg-primary/10 text-primary border-primary/20',
      available: 'bg-success/10 text-success border-success/20',
      maintenance: 'bg-destructive/10 text-destructive border-destructive/20'
    };
    return colors[status as keyof typeof colors] || 'bg-muted/10 text-muted-foreground border-muted/20';
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

  const formatStatus = (status: string) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Operations Center, {currentUser.name}
        </h1>
        <p className="text-muted-foreground">
          Monitor active trips, manage driver assignments, and coordinate field operations
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
        {/* Active Trips */}
        <Card className="safari-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-lg">
              <span className="flex items-center">
                <Navigation className="h-5 w-5 mr-2 text-primary" />
                Active Trips
              </span>
              <Button variant="outline" size="sm">Real-time Map</Button>
            </CardTitle>
            <CardDescription>Live tracking of ongoing safari trips</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeTrips.map((trip) => (
                <div key={trip.id} className="p-4 border border-border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold text-sm sm:text-base">{trip.customers}</h4>
                        <Badge className={getStatusColor(trip.status)}>
                          {formatStatus(trip.status)}
                        </Badge>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Driver: {trip.driver} • {trip.vehicle}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">#{trip.id}</p>
                      <p className="text-xs text-muted-foreground">{trip.route}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress</span>
                      <span>{trip.progress}%</span>
                    </div>
                    <div className="w-full bg-muted/50 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${trip.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span>Next: {trip.nextStop}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">ETA: {trip.estimatedArrival}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Driver Status */}
        <Card className="safari-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-lg">
              <span className="flex items-center">
                <UserCheck className="h-5 w-5 mr-2 text-primary" />
                Driver Status
              </span>
              <Button variant="outline" size="sm">Manage Schedule</Button>
            </CardTitle>
            <CardDescription>Current driver availability and assignments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {driverStatus.map((driver) => (
                <div key={driver.name} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <UserCheck className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-sm">{driver.name}</p>
                        <Badge className={getStatusColor(driver.status)}>
                          {formatStatus(driver.status)}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {driver.currentTrip ? `Trip: ${driver.currentTrip}` : driver.location} • {driver.vehicle}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        ⭐ {driver.rating} • Available: {driver.nextAvailable}
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Assign
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Assignments */}
      <Card className="safari-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-lg">
            <span className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-warning" />
              Pending Assignments
            </span>
            <Button variant="outline" size="sm">Auto-Assign</Button>
          </CardTitle>
          <CardDescription>Trips that need driver and vehicle assignment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingAssignments.map((assignment) => (
              <div key={assignment.id} className="p-4 border border-border rounded-lg space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold text-sm sm:text-base">{assignment.customer}</h4>
                      <Badge className={getPriorityColor(assignment.priority)}>
                        {assignment.priority}
                      </Badge>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground">{assignment.package}</p>
                    <p className="text-xs text-muted-foreground">#{assignment.id} • {assignment.guests} guests</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-sm font-medium">{assignment.startDate}</p>
                    <p className="text-xs text-muted-foreground">Pickup: {assignment.pickup}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Preferred Driver</p>
                    <p className="text-muted-foreground">{assignment.preferredDriver}</p>
                  </div>
                  <div>
                    <p className="font-medium">Special Requirements</p>
                    <p className="text-muted-foreground">{assignment.requirements}</p>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button size="sm" className="flex-1">
                    Assign Driver
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
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

export default OperationsDashboard;