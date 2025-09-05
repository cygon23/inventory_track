import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  FileText, 
  Calendar, 
  Users, 
  MapPin, 
  Star,
  Clock,
  Fuel,
  Car,
  AlertTriangle,
  CheckCircle,
  Eye,
  Plus,
  Download
} from 'lucide-react';
import { User } from '@/data/mockUsers';

interface TripReportsProps {
  currentUser: User;
}

const TripReports: React.FC<TripReportsProps> = ({ currentUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [isNewReportOpen, setIsNewReportOpen] = useState(false);

  const tripReports = [
    {
      id: 'RPT-001',
      tripId: 'T001',
      bookingRef: 'SAF-2024-001',
      customer: 'John & Sarah Smith',
      package: 'Serengeti Adventure',
      completionDate: '2024-01-18',
      duration: '4 days',
      totalDistance: '245 km',
      fuelUsed: '45 liters',
      rating: 5,
      status: 'completed',
      vehicleCondition: 'good',
      issues: [],
      highlights: [
        'Excellent wildlife sightings at Ngorongoro',
        'Perfect weather conditions',
        'Guests were very satisfied'
      ],
      expenses: {
        fuel: 85.50,
        meals: 120.00,
        accommodation: 450.00,
        miscellaneous: 25.00
      },
      notes: 'Smooth trip with no issues. Guests were photography enthusiasts and appreciated the extra stops for wildlife viewing. Vehicle performed well throughout the journey.'
    },
    {
      id: 'RPT-002',
      tripId: 'T003',
      bookingRef: 'SAF-2024-003',
      customer: 'The Rodriguez Family',
      package: 'Cultural Heritage Tour',
      completionDate: '2024-01-13',
      duration: '4 days',
      totalDistance: '320 km',
      fuelUsed: '52 liters',
      rating: 4,
      status: 'completed',
      vehicleCondition: 'good',
      issues: ['Minor tire wear noticed'],
      highlights: [
        'Great cultural exchange at Maasai village',
        'Children enjoyed the educational aspects',
        'Good family bonding experience'
      ],
      expenses: {
        fuel: 98.75,
        meals: 180.00,
        accommodation: 380.00,
        miscellaneous: 40.00
      },
      notes: 'Family trip went well. Children were very engaged with cultural activities. Slight tire wear noticed - recommended for inspection.'
    },
    {
      id: 'RPT-003',
      tripId: 'T005',
      bookingRef: 'SAF-2024-008',
      customer: 'Emma Wilson',
      package: 'Solo Safari Experience',
      completionDate: '2024-01-12',
      duration: '3 days',
      totalDistance: '180 km',
      fuelUsed: '28 liters',
      rating: 5,
      status: 'completed',
      vehicleCondition: 'excellent',
      issues: [],
      highlights: [
        'Exceptional Big Five sightings',
        'Guest was very knowledgeable about wildlife',
        'Perfect solo travel experience'
      ],
      expenses: {
        fuel: 53.20,
        meals: 90.00,
        accommodation: 280.00,
        miscellaneous: 15.00
      },
      notes: 'Excellent solo safari. Guest was very independent and knowledgeable. No issues encountered during the trip.'
    }
  ];

  const monthlyStats = {
    totalTrips: 12,
    totalDistance: '2,450 km',
    totalFuel: '485 liters',
    averageRating: 4.6,
    totalRevenue: '$15,840',
    onTimePerformance: '98%'
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'excellent':
        return 'text-green-600';
      case 'good':
        return 'text-blue-600';
      case 'fair':
        return 'text-yellow-600';
      case 'poor':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const filteredReports = tripReports.filter(report => {
    const matchesSearch = report.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.bookingRef.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.package.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Trip Reports</h1>
          <p className="text-muted-foreground">View and manage your completed trip reports</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isNewReportOpen} onOpenChange={setIsNewReportOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Report
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Trip Report</DialogTitle>
                <DialogDescription>
                  Fill out the details for your completed trip
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="booking-ref">Booking Reference</Label>
                    <Input id="booking-ref" placeholder="SAF-2024-XXX" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="completion-date">Completion Date</Label>
                    <Input id="completion-date" type="date" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="distance">Total Distance (km)</Label>
                    <Input id="distance" placeholder="245" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fuel">Fuel Used (liters)</Label>
                    <Input id="fuel" placeholder="45" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rating">Customer Rating</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Rating" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 Stars</SelectItem>
                        <SelectItem value="4">4 Stars</SelectItem>
                        <SelectItem value="3">3 Stars</SelectItem>
                        <SelectItem value="2">2 Stars</SelectItem>
                        <SelectItem value="1">1 Star</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="highlights">Trip Highlights</Label>
                  <Textarea id="highlights" placeholder="List the key highlights of the trip..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="issues">Issues Encountered</Label>
                  <Textarea id="issues" placeholder="Any issues or problems during the trip..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea id="notes" placeholder="Any additional comments or observations..." />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsNewReportOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsNewReportOpen(false)}>
                    Save Report
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Monthly Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Trips</p>
                <p className="text-2xl font-bold">{monthlyStats.totalTrips}</p>
              </div>
              <FileText className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Distance</p>
                <p className="text-2xl font-bold">{monthlyStats.totalDistance}</p>
              </div>
              <MapPin className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Fuel Used</p>
                <p className="text-2xl font-bold">{monthlyStats.totalFuel}</p>
              </div>
              <Fuel className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Rating</p>
                <p className="text-2xl font-bold">{monthlyStats.averageRating}</p>
              </div>
              <Star className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Revenue</p>
                <p className="text-2xl font-bold">{monthlyStats.totalRevenue}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">On Time</p>
                <p className="text-2xl font-bold">{monthlyStats.onTimePerformance}</p>
              </div>
              <Clock className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="reports" className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <TabsList>
            <TabsTrigger value="reports">All Reports</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <Input
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64"
            />
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="this-month">This Month</SelectItem>
                <SelectItem value="last-month">Last Month</SelectItem>
                <SelectItem value="this-year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Package</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Distance</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">{report.id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{report.customer}</p>
                        <p className="text-sm text-muted-foreground">{report.bookingRef}</p>
                      </div>
                    </TableCell>
                    <TableCell>{report.package}</TableCell>
                    <TableCell>{report.completionDate}</TableCell>
                    <TableCell>{report.totalDistance}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {renderStars(report.rating)}
                        <span className="ml-1 text-sm">({report.rating})</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(report.status)}>
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {report.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl">
                            <DialogHeader>
                              <DialogTitle>Trip Report - {report.id}</DialogTitle>
                              <DialogDescription>
                                Detailed report for {report.bookingRef}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-6">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-4">
                                  <div>
                                    <h3 className="font-medium mb-2">Trip Details</h3>
                                    <div className="space-y-2 text-sm">
                                      <p><strong>Customer:</strong> {report.customer}</p>
                                      <p><strong>Package:</strong> {report.package}</p>
                                      <p><strong>Duration:</strong> {report.duration}</p>
                                      <p><strong>Completion Date:</strong> {report.completionDate}</p>
                                    </div>
                                  </div>
                                  <div>
                                    <h3 className="font-medium mb-2">Performance Metrics</h3>
                                    <div className="space-y-2 text-sm">
                                      <p><strong>Distance:</strong> {report.totalDistance}</p>
                                      <p><strong>Fuel Used:</strong> {report.fuelUsed}</p>
                                      <p><strong>Customer Rating:</strong> {report.rating}/5</p>
                                      <p><strong>Vehicle Condition:</strong> 
                                        <span className={getConditionColor(report.vehicleCondition)}>
                                          {' ' + report.vehicleCondition}
                                        </span>
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div className="space-y-4">
                                  <div>
                                    <h3 className="font-medium mb-2">Trip Highlights</h3>
                                    <ul className="text-sm space-y-1">
                                      {report.highlights.map((highlight, idx) => (
                                        <li key={idx} className="flex items-start">
                                          <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                                          {highlight}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                  {report.issues.length > 0 && (
                                    <div>
                                      <h3 className="font-medium mb-2">Issues</h3>
                                      <ul className="text-sm space-y-1">
                                        {report.issues.map((issue, idx) => (
                                          <li key={idx} className="flex items-start">
                                            <AlertTriangle className="h-3 w-3 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
                                            {issue}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div>
                                <h3 className="font-medium mb-2">Additional Notes</h3>
                                <p className="text-sm text-muted-foreground">{report.notes}</p>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button variant="outline" size="sm">
                          <Download className="h-3 w-3 mr-1" />
                          PDF
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
                <CardDescription>Your monthly performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Customer Satisfaction</span>
                      <span>4.6/5</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>On-Time Performance</span>
                      <span>98%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '98%' }}></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Fuel Efficiency</span>
                      <span>85%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Achievements</CardTitle>
                <CardDescription>Your accomplishments this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Star className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Perfect Month</p>
                      <p className="text-xs text-muted-foreground">All trips rated 4+ stars</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Clock className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Punctuality Award</p>
                      <p className="text-xs text-muted-foreground">98% on-time performance</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Fuel className="h-4 w-4 text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Eco Driver</p>
                      <p className="text-xs text-muted-foreground">Excellent fuel efficiency</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TripReports;