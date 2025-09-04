import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { 
  Car, 
  Calendar, 
  Fuel, 
  Wrench,
  CheckCircle,
  AlertTriangle,
  Search,
  Filter,
  Plus,
  Eye,
  Settings,
  MapPin,
  Clock,
  Users
} from 'lucide-react';
import { User } from '@/data/mockUsers';

interface VehicleManagementProps {
  currentUser: User;
}

const VehicleManagement: React.FC<VehicleManagementProps> = ({ currentUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const vehicles = [
    {
      id: 'V001',
      model: 'Toyota Land Cruiser',
      year: '2023',
      plate: 'T123ABC',
      status: 'on_trip',
      condition: 'excellent',
      driver: 'James Mollel',
      currentTrip: {
        id: 'SF001',
        customer: 'Johnson Family',
        location: 'Serengeti Central',
        endDate: '2024-01-17'
      },
      mileage: 45230,
      fuelLevel: 85,
      lastService: '2024-01-01',
      nextService: '2024-04-01',
      serviceDue: 90,
      capacity: 7,
      features: ['4WD', 'AC', 'Radio', 'First Aid', 'Fire Extinguisher'],
      maintenance: [
        { type: 'Oil Change', date: '2024-01-01', cost: '$80' },
        { type: 'Tire Rotation', date: '2023-12-15', cost: '$40' },
        { type: 'Brake Inspection', date: '2023-12-01', cost: '$120' }
      ],
      issues: []
    },
    {
      id: 'V002',
      model: 'Toyota Land Cruiser',
      year: '2023',
      plate: 'T456DEF',
      status: 'available',
      condition: 'excellent',
      driver: null,
      currentTrip: null,
      mileage: 38150,
      fuelLevel: 92,
      lastService: '2023-12-20',
      nextService: '2024-03-20',
      serviceDue: 75,
      capacity: 7,
      features: ['4WD', 'AC', 'Radio', 'First Aid', 'Fire Extinguisher', 'GPS'],
      maintenance: [
        { type: 'Full Service', date: '2023-12-20', cost: '$350' },
        { type: 'Oil Change', date: '2023-11-15', cost: '$80' }
      ],
      issues: []
    },
    {
      id: 'V003',
      model: 'Toyota Land Cruiser',
      year: '2021',
      plate: 'T789GHI',
      status: 'on_trip',
      condition: 'good',
      driver: 'Peter Sanga',
      currentTrip: {
        id: 'SF003',
        customer: 'Chen Group',
        location: 'Tarangire NP',
        endDate: '2024-01-18'
      },
      mileage: 67890,
      fuelLevel: 70,
      lastService: '2023-11-30',
      nextService: '2024-02-28',
      serviceDue: 45,
      capacity: 7,
      features: ['4WD', 'AC', 'Radio', 'First Aid'],
      maintenance: [
        { type: 'Oil Change', date: '2023-11-30', cost: '$80' },
        { type: 'Brake Pads', date: '2023-10-15', cost: '$200' }
      ],
      issues: [
        { type: 'Minor', description: 'Air conditioning not cooling efficiently', reported: '2024-01-10' }
      ]
    },
    {
      id: 'V004',
      model: 'Toyota Land Cruiser',
      year: '2023',
      plate: 'T101JKL',
      status: 'scheduled',
      condition: 'excellent',
      driver: 'Grace Mwamba',
      currentTrip: {
        id: 'SF004',
        customer: 'Wilson Family',
        location: 'Preparing for departure',
        endDate: '2024-01-20'
      },
      mileage: 22100,
      fuelLevel: 95,
      lastService: '2024-01-05',
      nextService: '2024-04-05',
      serviceDue: 95,
      capacity: 7,
      features: ['4WD', 'AC', 'Radio', 'First Aid', 'Fire Extinguisher', 'GPS', 'Child Seats'],
      maintenance: [
        { type: 'Routine Check', date: '2024-01-05', cost: '$120' }
      ],
      issues: []
    },
    {
      id: 'V005',
      model: 'Toyota Land Cruiser',
      year: '2020',
      plate: 'T202MNO',
      status: 'maintenance',
      condition: 'fair',
      driver: null,
      currentTrip: null,
      mileage: 95430,
      fuelLevel: 40,
      lastService: '2024-01-08',
      nextService: '2024-01-15',
      serviceDue: 10,
      capacity: 7,
      features: ['4WD', 'AC', 'Radio', 'First Aid'],
      maintenance: [
        { type: 'Engine Service', date: '2024-01-08', cost: '$450' },
        { type: 'Transmission Check', date: '2023-12-20', cost: '$200' }
      ],
      issues: [
        { type: 'Major', description: 'Transmission needs repair', reported: '2024-01-08' },
        { type: 'Minor', description: 'Passenger window not working', reported: '2024-01-05' }
      ]
    },
    {
      id: 'V006',
      model: 'Toyota Land Cruiser',
      year: '2022',
      plate: 'T303PQR',
      status: 'available',
      condition: 'good',
      driver: null,
      currentTrip: null,
      mileage: 54320,
      fuelLevel: 78,
      lastService: '2023-12-10',
      nextService: '2024-03-10',
      serviceDue: 60,
      capacity: 7,
      features: ['4WD', 'AC', 'Radio', 'First Aid', 'Fire Extinguisher'],
      maintenance: [
        { type: 'Oil Change', date: '2023-12-10', cost: '$80' },
        { type: 'Tire Change', date: '2023-11-20', cost: '$600' }
      ],
      issues: []
    }
  ];

  const stats = [
    {
      title: 'Total Fleet',
      value: '18',
      change: '6 models',
      icon: Car,
      color: 'text-primary'
    },
    {
      title: 'Operational',
      value: '15',
      change: '83% availability',
      icon: CheckCircle,
      color: 'text-success'
    },
    {
      title: 'In Maintenance',
      value: '3',
      change: '2 major repairs',
      icon: Wrench,
      color: 'text-warning'
    },
    {
      title: 'Service Due',
      value: '5',
      change: '2 overdue',
      icon: AlertTriangle,
      color: 'text-destructive'
    }
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      available: 'bg-success/10 text-success border-success/20',
      on_trip: 'bg-primary/10 text-primary border-primary/20',
      scheduled: 'bg-warning/10 text-warning border-warning/20',
      maintenance: 'bg-destructive/10 text-destructive border-destructive/20',
      out_of_service: 'bg-muted/10 text-muted-foreground border-muted/20'
    };
    return colors[status as keyof typeof colors] || 'bg-muted/10 text-muted-foreground border-muted/20';
  };

  const getConditionColor = (condition: string) => {
    const colors = {
      excellent: 'text-success',
      good: 'text-primary',
      fair: 'text-warning',
      poor: 'text-destructive'
    };
    return colors[condition as keyof typeof colors] || 'text-muted-foreground';
  };

  const formatStatus = (status: string) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const getFuelLevelColor = (level: number) => {
    if (level >= 50) return 'text-success';
    if (level >= 25) return 'text-warning';
    return 'text-destructive';
  };

  const getServiceDueColor = (days: number) => {
    if (days >= 30) return 'text-success';
    if (days >= 7) return 'text-warning';
    return 'text-destructive';
  };

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (vehicle.driver && vehicle.driver.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterStatus === 'all' || vehicle.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Vehicle Management</h1>
          <p className="text-muted-foreground">Monitor fleet status, maintenance, and availability</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Vehicle
        </Button>
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
                placeholder="Search vehicles by model, plate, or driver..."
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
                variant={filterStatus === 'available' ? 'default' : 'outline'} 
                onClick={() => setFilterStatus('available')}
                size="sm"
              >
                Available
              </Button>
              <Button 
                variant={filterStatus === 'on_trip' ? 'default' : 'outline'} 
                onClick={() => setFilterStatus('on_trip')}
                size="sm"
              >
                On Trip
              </Button>
              <Button 
                variant={filterStatus === 'maintenance' ? 'default' : 'outline'} 
                onClick={() => setFilterStatus('maintenance')}
                size="sm"
              >
                Maintenance
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vehicle Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredVehicles.map((vehicle) => (
          <Card key={vehicle.id} className="safari-card">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Car className="h-5 w-5" />
                    <span>{vehicle.model} ({vehicle.year})</span>
                  </CardTitle>
                  <CardDescription className="flex items-center space-x-4">
                    <span>Plate: {vehicle.plate}</span>
                    <span>ID: {vehicle.id}</span>
                  </CardDescription>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge className={getStatusColor(vehicle.status)}>
                      {formatStatus(vehicle.status)}
                    </Badge>
                    <span className={`text-sm font-medium ${getConditionColor(vehicle.condition)}`}>
                      {vehicle.condition.charAt(0).toUpperCase() + vehicle.condition.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Current Assignment */}
              {vehicle.currentTrip ? (
                <div className="bg-primary/10 p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">Current Assignment</p>
                      <p className="text-sm text-muted-foreground">Trip #{vehicle.currentTrip.id}</p>
                      <p className="text-sm">{vehicle.currentTrip.customer}</p>
                    </div>
                    <div className="text-right text-sm">
                      <p className="font-medium">Driver: {vehicle.driver}</p>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="text-muted-foreground">{vehicle.currentTrip.location}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Until {vehicle.currentTrip.endDate}</p>
                    </div>
                  </div>
                </div>
              ) : vehicle.status === 'available' ? (
                <div className="bg-success/10 p-3 rounded-lg">
                  <p className="font-medium text-success">Available for Assignment</p>
                  <p className="text-xs text-muted-foreground">Ready for immediate deployment</p>
                </div>
              ) : vehicle.status === 'maintenance' ? (
                <div className="bg-warning/10 p-3 rounded-lg">
                  <p className="font-medium text-warning">Under Maintenance</p>
                  <p className="text-xs text-muted-foreground">Service completion: {vehicle.nextService}</p>
                </div>
              ) : null}

              {/* Vehicle Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Fuel Level</span>
                      <span className={getFuelLevelColor(vehicle.fuelLevel)}>{vehicle.fuelLevel}%</span>
                    </div>
                    <Progress value={vehicle.fuelLevel} className="h-2 mt-1" />
                  </div>
                  
                  <div className="text-sm">
                    <p className="font-medium">Mileage</p>
                    <p className="text-muted-foreground">{vehicle.mileage.toLocaleString()} km</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-sm">
                    <p className="font-medium">Capacity</p>
                    <div className="flex items-center space-x-1">
                      <Users className="h-3 w-3 text-muted-foreground" />
                      <span>{vehicle.capacity} passengers</span>
                    </div>
                  </div>
                  
                  <div className="text-sm">
                    <p className="font-medium">Service Due</p>
                    <p className={`${getServiceDueColor(vehicle.serviceDue)}`}>
                      {vehicle.serviceDue > 0 ? `${vehicle.serviceDue} days` : 'Overdue'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div>
                <p className="font-medium text-sm mb-2">Features</p>
                <div className="flex flex-wrap gap-1">
                  {vehicle.features.map((feature, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Issues */}
              {vehicle.issues.length > 0 && (
                <div className="bg-destructive/10 p-3 rounded-lg">
                  <p className="font-medium text-destructive text-sm mb-2">Active Issues</p>
                  <div className="space-y-1">
                    {vehicle.issues.map((issue, index) => (
                      <div key={index} className="text-sm">
                        <div className="flex items-center space-x-2">
                          <Badge variant="destructive" className="text-xs">{issue.type}</Badge>
                          <span className="text-muted-foreground text-xs">Reported: {issue.reported}</span>
                        </div>
                        <p className="text-destructive">{issue.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Last Maintenance */}
              <div className="text-sm">
                <p className="font-medium">Last Service</p>
                <p className="text-muted-foreground">{vehicle.lastService}</p>
                {vehicle.maintenance.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {vehicle.maintenance[0].type} - {vehicle.maintenance[0].cost}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <Eye className="h-4 w-4 mr-1" />
                  Details
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  <Settings className="h-4 w-4 mr-1" />
                  Maintenance
                </Button>
                {vehicle.status === 'available' && (
                  <Button size="sm" className="flex-1">
                    Assign
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

export default VehicleManagement;