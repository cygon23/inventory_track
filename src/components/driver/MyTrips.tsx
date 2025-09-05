import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MapPin, 
  Clock, 
  Users, 
  Phone, 
  Navigation,
  Car,
  Fuel,
  CheckCircle,
  AlertCircle,
  Calendar
} from 'lucide-react';
import { User } from '@/data/mockUsers';

interface MyTripsProps {
  currentUser: User;
}

const MyTrips: React.FC<MyTripsProps> = ({ currentUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const myTrips = [
    {
      id: 'T001',
      bookingRef: 'SAF-2024-001',
      customer: {
        name: 'John & Sarah Smith',
        phone: '+1-555-0123',
        email: 'john.smith@email.com'
      },
      package: 'Serengeti Adventure',
      status: 'in-progress',
      startDate: '2024-01-15',
      endDate: '2024-01-18',
      currentDay: 2,
      totalDays: 4,
      guests: 2,
      vehicle: 'Toyota Land Cruiser - TZ-123-ABC',
      currentLocation: 'Ngorongoro Crater',
      nextDestination: 'Serengeti Central',
      estimatedArrival: '14:30',
      totalDistance: '245 km',
      completedDistance: '120 km',
      notes: 'Guests are photography enthusiasts. Extra stops for wildlife viewing.'
    },
    {
      id: 'T002',
      bookingRef: 'SAF-2024-005',
      customer: {
        name: 'Michael Johnson',
        phone: '+1-555-0456',
        email: 'mjohnson@email.com'
      },
      package: 'Kilimanjaro Base Trek',
      status: 'scheduled',
      startDate: '2024-01-20',
      endDate: '2024-01-22',
      currentDay: 0,
      totalDays: 3,
      guests: 1,
      vehicle: 'Toyota Hilux - TZ-456-DEF',
      currentLocation: 'Arusha Office',
      nextDestination: 'Machame Gate',
      estimatedArrival: '08:00',
      totalDistance: '180 km',
      completedDistance: '0 km',
      notes: 'Solo traveler. Experienced hiker. Early morning departure.'
    },
    {
      id: 'T003',
      bookingRef: 'SAF-2024-003',
      customer: {
        name: 'The Rodriguez Family',
        phone: '+1-555-0789',
        email: 'rodriguez.family@email.com'
      },
      package: 'Cultural Heritage Tour',
      status: 'completed',
      startDate: '2024-01-10',
      endDate: '2024-01-13',
      currentDay: 4,
      totalDays: 4,
      guests: 4,
      vehicle: 'Toyota Land Cruiser - TZ-789-GHI',
      currentLocation: 'Arusha Office',
      nextDestination: 'Trip Completed',
      estimatedArrival: 'N/A',
      totalDistance: '320 km',
      completedDistance: '320 km',
      notes: 'Family with children. Great trip, excellent feedback received.'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'in-progress':
        return <Navigation className="h-4 w-4" />;
      case 'scheduled':
        return <Clock className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const filteredTrips = myTrips.filter(trip => {
    const matchesSearch = trip.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trip.bookingRef.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trip.package.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || trip.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const currentTrip = myTrips.find(trip => trip.status === 'in-progress');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Trips</h1>
          <p className="text-muted-foreground">Manage your assigned safari trips and routes</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <MapPin className="h-4 w-4 mr-2" />
            View Route
          </Button>
          <Button variant="outline" size="sm">
            <Phone className="h-4 w-4 mr-2" />
            Emergency Contact
          </Button>
        </div>
      </div>

      {/* Current Trip Status */}
      {currentTrip && (
        <Card className="border-primary">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Current Trip in Progress</CardTitle>
              <Badge className={getStatusColor(currentTrip.status)}>
                {getStatusIcon(currentTrip.status)}
                <span className="ml-1 capitalize">{currentTrip.status.replace('-', ' ')}</span>
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Customer</p>
                <p className="font-medium">{currentTrip.customer.name}</p>
                <p className="text-sm text-muted-foreground">{currentTrip.customer.phone}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Current Location</p>
                <p className="font-medium flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {currentTrip.currentLocation}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Next Destination</p>
                <p className="font-medium">{currentTrip.nextDestination}</p>
                <p className="text-sm text-muted-foreground">ETA: {currentTrip.estimatedArrival}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Progress</p>
                <p className="font-medium">Day {currentTrip.currentDay} of {currentTrip.totalDays}</p>
                <p className="text-sm text-muted-foreground">{currentTrip.completedDistance} / {currentTrip.totalDistance}</p>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button size="sm">
                <Navigation className="h-4 w-4 mr-2" />
                Start Navigation
              </Button>
              <Button variant="outline" size="sm">
                <Phone className="h-4 w-4 mr-2" />
                Call Customer
              </Button>
              <Button variant="outline" size="sm">
                Update Status
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="list" className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <TabsList>
            <TabsTrigger value="list">Trip List</TabsTrigger>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <Input
              placeholder="Search trips..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Booking Ref</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Package</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTrips.map((trip) => (
                  <TableRow key={trip.id}>
                    <TableCell className="font-medium">{trip.bookingRef}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{trip.customer.name}</p>
                        <p className="text-sm text-muted-foreground">{trip.guests} guests</p>
                      </div>
                    </TableCell>
                    <TableCell>{trip.package}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{trip.startDate}</p>
                        <p className="text-muted-foreground">to {trip.endDate}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(trip.status)}>
                        {getStatusIcon(trip.status)}
                        <span className="ml-1 capitalize">{trip.status.replace('-', ' ')}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p className="flex items-center">
                          <Car className="h-3 w-3 mr-1" />
                          {trip.vehicle.split(' - ')[0]}
                        </p>
                        <p className="text-muted-foreground">{trip.vehicle.split(' - ')[1]}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="outline" size="sm">View</Button>
                        {trip.status === 'scheduled' && (
                          <Button variant="outline" size="sm">Start</Button>
                        )}
                        {trip.status === 'in-progress' && (
                          <Button variant="outline" size="sm">Update</Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Trip Calendar</CardTitle>
              <CardDescription>View your trips in calendar format</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTrips.map((trip) => (
                  <Card key={trip.id} className="border">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm">{trip.bookingRef}</CardTitle>
                        <Badge className={getStatusColor(trip.status)}>
                          {getStatusIcon(trip.status)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        <p className="font-medium">{trip.customer.name}</p>
                        <p className="text-sm text-muted-foreground">{trip.package}</p>
                        <div className="flex items-center text-sm">
                          <Calendar className="h-3 w-3 mr-1" />
                          {trip.startDate} - {trip.endDate}
                        </div>
                        <div className="flex items-center text-sm">
                          <Users className="h-3 w-3 mr-1" />
                          {trip.guests} guests
                        </div>
                        <div className="flex items-center text-sm">
                          <Car className="h-3 w-3 mr-1" />
                          {trip.vehicle.split(' - ')[1]}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyTrips;