import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  Navigation,
  AlertTriangle,
  CheckCircle,
  Car,
  UserCheck,
  Search,
  Filter,
  Eye,
  Edit,
  Route
} from 'lucide-react';
import { User } from '@/data/mockUsers';

interface TripManagementProps {
  currentUser: User;
}

const TripManagement: React.FC<TripManagementProps> = ({ currentUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const trips = [
    {
      id: 'SF001',
      customer: 'Johnson Family',
      package: '3-Day Serengeti Explorer',
      driver: 'James Mollel',
      vehicle: 'Toyota LC - T123ABC',
      startDate: '2024-01-15',
      endDate: '2024-01-17',
      status: 'in_progress',
      progress: 65,
      currentLocation: 'Serengeti Central',
      nextStop: 'Seronera Lodge',
      estimatedArrival: '2:30 PM',
      guests: 4,
      itinerary: [
        { day: 1, location: 'Arusha → Serengeti', status: 'completed' },
        { day: 2, location: 'Serengeti Game Drives', status: 'in_progress' },
        { day: 3, location: 'Serengeti → Arusha', status: 'pending' }
      ],
      notes: 'Family interested in big cats photography'
    },
    {
      id: 'SF002',
      customer: 'Brown Couple',
      package: 'Ngorongoro Day Trip',
      driver: 'Mary Kileo',
      vehicle: 'Toyota LC - T456DEF',
      startDate: '2024-01-16',
      endDate: '2024-01-16',
      status: 'completed',
      progress: 100,
      currentLocation: 'Returned to Arusha',
      nextStop: null,
      estimatedArrival: null,
      guests: 2,
      itinerary: [
        { day: 1, location: 'Arusha → Ngorongoro → Arusha', status: 'completed' }
      ],
      notes: 'Honeymoon couple, requested romantic lunch setup'
    },
    {
      id: 'SF003',
      customer: 'Chen Group',
      package: '5-Day Photography Safari',
      driver: 'Peter Sanga',
      vehicle: 'Toyota LC - T789GHI',
      startDate: '2024-01-14',
      endDate: '2024-01-18',
      status: 'in_progress',
      progress: 60,
      currentLocation: 'Tarangire NP',
      nextStop: 'Tarangire Lodge',
      estimatedArrival: '5:30 PM',
      guests: 1,
      itinerary: [
        { day: 1, location: 'Arusha → Tarangire', status: 'completed' },
        { day: 2, location: 'Tarangire Photography', status: 'completed' },
        { day: 3, location: 'Tarangire → Serengeti', status: 'in_progress' },
        { day: 4, location: 'Serengeti Photography', status: 'pending' },
        { day: 5, location: 'Serengeti → Arusha', status: 'pending' }
      ],
      notes: 'Professional photographer, early morning starts required'
    },
    {
      id: 'SF004',
      customer: 'Wilson Family',
      package: '4-Day Northern Circuit',
      driver: 'Grace Mwamba',
      vehicle: 'Toyota LC - T101JKL',
      startDate: '2024-01-17',
      endDate: '2024-01-20',
      status: 'scheduled',
      progress: 0,
      currentLocation: 'Preparing departure',
      nextStop: 'Kilimanjaro Airport Pickup',
      estimatedArrival: '7:00 AM',
      guests: 5,
      itinerary: [
        { day: 1, location: 'Airport → Tarangire', status: 'pending' },
        { day: 2, location: 'Tarangire → Serengeti', status: 'pending' },
        { day: 3, location: 'Serengeti → Ngorongoro', status: 'pending' },
        { day: 4, location: 'Ngorongoro → Arusha', status: 'pending' }
      ],
      notes: 'Family with children (ages 8, 12, 15), child seats required'
    },
    {
      id: 'SF005',
      customer: 'Anderson Group',
      package: '6-Day Cultural Safari',
      driver: 'John Kimaro',
      vehicle: 'Toyota LC - T202MNO',
      startDate: '2024-01-20',
      endDate: '2024-01-25',
      status: 'scheduled',
      progress: 0,
      currentLocation: 'Preparation phase',
      nextStop: 'Arusha Hotel Pickup',
      estimatedArrival: '6:30 AM',
      guests: 8,
      itinerary: [
        { day: 1, location: 'Arusha → Mto wa Mbu', status: 'pending' },
        { day: 2, location: 'Cultural Village Tours', status: 'pending' },
        { day: 3, location: 'Ngorongoro Highlands', status: 'pending' },
        { day: 4, location: 'Serengeti Cultural Sites', status: 'pending' },
        { day: 5, location: 'Maasai Village Experience', status: 'pending' },
        { day: 6, location: 'Return to Arusha', status: 'pending' }
      ],
      notes: 'Group interested in cultural experiences and local traditions'
    }
  ];

  const stats = [
    {
      title: 'Active Trips',
      value: '12',
      change: '3 starting today',
      icon: Route,
      color: 'text-primary'
    },
    {
      title: 'Scheduled Trips',
      value: '8',
      change: 'Next 7 days',
      icon: Calendar,
      color: 'text-warning'
    },
    {
      title: 'Completed Today',
      value: '3',
      change: '100% success rate',
      icon: CheckCircle,
      color: 'text-success'
    },
    {
      title: 'Issues Reported',
      value: '0',
      change: 'All clear',
      icon: AlertTriangle,
      color: 'text-success'
    }
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      scheduled: 'bg-warning/10 text-warning border-warning/20',
      in_progress: 'bg-primary/10 text-primary border-primary/20',
      completed: 'bg-success/10 text-success border-success/20',
      cancelled: 'bg-destructive/10 text-destructive border-destructive/20',
      delayed: 'bg-destructive/10 text-destructive border-destructive/20'
    };
    return colors[status as keyof typeof colors] || 'bg-muted/10 text-muted-foreground border-muted/20';
  };

  const getItineraryStatusColor = (status: string) => {
    const colors = {
      completed: 'text-success',
      in_progress: 'text-primary',
      pending: 'text-muted-foreground'
    };
    return colors[status as keyof typeof colors] || 'text-muted-foreground';
  };

  const formatStatus = (status: string) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const filteredTrips = trips.filter(trip => {
    const matchesSearch = trip.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trip.package.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trip.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trip.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || trip.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Trip Management</h1>
        <p className="text-muted-foreground">Monitor and coordinate all safari trips in real-time</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="safari-card">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-xl md:text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.change}</p>
                  </div>
                  <Icon className={`h-6 w-6 md:h-8 md:w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters and Search */}
      <Card className="safari-card">
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search trips by customer, package, driver, or trip ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex space-x-2">
              <Button 
                variant={filterStatus === 'all' ? 'default' : 'outline'} 
                onClick={() => setFilterStatus('all')}
                size="sm"
              >
                All
              </Button>
              <Button 
                variant={filterStatus === 'in_progress' ? 'default' : 'outline'} 
                onClick={() => setFilterStatus('in_progress')}
                size="sm"
              >
                Active
              </Button>
              <Button 
                variant={filterStatus === 'scheduled' ? 'default' : 'outline'} 
                onClick={() => setFilterStatus('scheduled')}
                size="sm"
              >
                Scheduled
              </Button>
              <Button 
                variant={filterStatus === 'completed' ? 'default' : 'outline'} 
                onClick={() => setFilterStatus('completed')}
                size="sm"
              >
                Completed
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trip Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTrips.map((trip) => (
          <Card key={trip.id} className="safari-card">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{trip.customer}</CardTitle>
                  <CardDescription>{trip.package}</CardDescription>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge className={getStatusColor(trip.status)}>
                      {formatStatus(trip.status)}
                    </Badge>
                    <span className="text-sm text-muted-foreground">#{trip.id}</span>
                  </div>
                </div>
                <div className="text-right text-sm">
                  <p className="font-medium">{trip.startDate}</p>
                  <p className="text-muted-foreground">to {trip.endDate}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Trip Details */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <UserCheck className="h-4 w-4 text-muted-foreground" />
                    <span>Driver: {trip.driver}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Car className="h-4 w-4 text-muted-foreground" />
                    <span>{trip.vehicle}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{trip.guests} guests</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{trip.currentLocation}</span>
                  </div>
                </div>
              </div>

              {/* Progress */}
              {trip.status === 'in_progress' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Trip Progress</span>
                    <span>{trip.progress}%</span>
                  </div>
                  <Progress value={trip.progress} className="h-2" />
                  {trip.nextStop && (
                    <div className="flex items-center justify-between text-sm">
                      <span>Next: {trip.nextStop}</span>
                      <span className="text-muted-foreground">ETA: {trip.estimatedArrival}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Itinerary */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Itinerary</h4>
                <div className="space-y-1">
                  {trip.itinerary.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          item.status === 'completed' ? 'bg-success' :
                          item.status === 'in_progress' ? 'bg-primary' : 'bg-muted'
                        }`} />
                        <span>Day {item.day}: {item.location}</span>
                      </div>
                      <CheckCircle className={`h-4 w-4 ${getItineraryStatusColor(item.status)}`} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              {trip.notes && (
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-sm font-medium mb-1">Notes:</p>
                  <p className="text-sm text-muted-foreground">{trip.notes}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <Eye className="h-4 w-4 mr-1" />
                  View Details
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  <Navigation className="h-4 w-4 mr-1" />
                  Track Live
                </Button>
                {trip.status === 'scheduled' && (
                  <Button size="sm" className="flex-1">
                    <Edit className="h-4 w-4 mr-1" />
                    Modify
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TripManagement;