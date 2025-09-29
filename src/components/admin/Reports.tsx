import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Download, Calendar as CalendarIcon, TrendingUp, Users, DollarSign, MapPin, Star } from 'lucide-react';
import { format } from 'date-fns';
import { User } from '@/lib/supabase';

interface ReportsProps {
  currentUser: User;
}

const Reports: React.FC<ReportsProps> = ({ currentUser }) => {
  const [dateRange, setDateRange] = useState<Date | undefined>(new Date());
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  const bookingData = [
    { month: 'Jan', bookings: 45, revenue: 180000 },
    { month: 'Feb', bookings: 52, revenue: 208000 },
    { month: 'Mar', bookings: 48, revenue: 192000 },
    { month: 'Apr', bookings: 61, revenue: 244000 },
    { month: 'May', bookings: 55, revenue: 220000 },
    { month: 'Jun', bookings: 67, revenue: 268000 },
  ];

  const safariTypeData = [
    { name: 'Wildlife Safari', value: 35, color: '#8884d8' },
    { name: 'Cultural Tours', value: 25, color: '#82ca9d' },
    { name: 'Adventure Safari', value: 20, color: '#ffc658' },
    { name: 'Luxury Safari', value: 15, color: '#ff7c7c' },
    { name: 'Budget Safari', value: 5, color: '#8dd1e1' },
  ];

  const customerSatisfaction = [
    { period: 'Week 1', rating: 4.2 },
    { period: 'Week 2', rating: 4.5 },
    { period: 'Week 3', rating: 4.3 },
    { period: 'Week 4', rating: 4.7 },
  ];

  const topDestinations = [
    { name: 'Maasai Mara', bookings: 45, percentage: 30 },
    { name: 'Serengeti', bookings: 38, percentage: 25 },
    { name: 'Amboseli', bookings: 30, percentage: 20 },
    { name: 'Tsavo', bookings: 23, percentage: 15 },
    { name: 'Lake Nakuru', bookings: 15, percentage: 10 },
  ];

  const operationalMetrics = [
    { title: 'Fleet Utilization', value: '85%', trend: '+5%', icon: MapPin, color: 'text-blue-600' },
    { title: 'Driver Performance', value: '4.6/5', trend: '+0.2', icon: Star, color: 'text-green-600' },
    { title: 'Booking Conversion', value: '68%', trend: '+12%', icon: TrendingUp, color: 'text-purple-600' },
    { title: 'Customer Retention', value: '72%', trend: '+8%', icon: Users, color: 'text-orange-600' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground">Comprehensive business insights and performance metrics</p>
        </div>
        <div className="flex space-x-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <CalendarIcon className="w-4 h-4 mr-2" />
                {dateRange ? format(dateRange, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dateRange}
                onSelect={setDateRange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {operationalMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                  <p className="text-sm text-green-600">{metric.trend} from last period</p>
                </div>
                <metric.icon className={`w-8 h-8 ${metric.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="bookings" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="operational">Operational</TabsTrigger>
          <TabsTrigger value="customer">Customer</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="bookings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Booking Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={bookingData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="bookings" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Safari Types Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={safariTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {safariTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top Destinations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topDestinations.map((destination, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Badge variant="outline">{index + 1}</Badge>
                      <div>
                        <p className="font-medium">{destination.name}</p>
                        <p className="text-sm text-muted-foreground">{destination.bookings} bookings</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Progress value={destination.percentage} className="w-24" />
                      <span className="text-sm font-medium">{destination.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={bookingData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`KSh ${value.toLocaleString()}`, 'Revenue']} />
                  <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                    <p className="text-3xl font-bold">KSh 1.31M</p>
                    <p className="text-sm text-green-600">+15% from last month</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Average Booking Value</p>
                    <p className="text-3xl font-bold">KSh 4,000</p>
                    <p className="text-sm text-green-600">+8% from last month</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Outstanding Payments</p>
                    <p className="text-3xl font-bold">KSh 125K</p>
                    <p className="text-sm text-red-600">-5% from last month</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="operational" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Fleet Utilization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Vehicles In Use</span>
                    <span className="font-medium">17/20</span>
                  </div>
                  <Progress value={85} />
                  <div className="text-sm text-muted-foreground">
                    85% utilization rate this month
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Trip Completion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Completed Trips</span>
                    <span className="font-medium">284/290</span>
                  </div>
                  <Progress value={98} />
                  <div className="text-sm text-muted-foreground">
                    98% completion rate this month
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="customer" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Satisfaction Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={customerSatisfaction}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis domain={[0, 5]} />
                  <Tooltip formatter={(value) => [`${value}/5`, 'Rating']} />
                  <Line type="monotone" dataKey="rating" stroke="#82ca9d" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Overall Performance Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Key Performance Indicators</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Booking Conversion Rate</span>
                      <span className="font-medium text-green-600">68%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Customer Retention Rate</span>
                      <span className="font-medium text-blue-600">72%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Response Time</span>
                      <span className="font-medium text-orange-600">2.5 hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Driver Satisfaction</span>
                      <span className="font-medium text-purple-600">4.6/5</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold">Performance Trends</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Revenue Growth</span>
                      <Badge variant="default" className="text-green-600">+15%</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Customer Satisfaction</span>
                      <Badge variant="default" className="text-blue-600">+8%</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Operational Efficiency</span>
                      <Badge variant="default" className="text-purple-600">+12%</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Fleet Utilization</span>
                      <Badge variant="default" className="text-orange-600">+5%</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;