import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  MessageSquare, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { User } from '@/data/mockUsers';

interface AdminDashboardProps {
  currentUser: User;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ currentUser }) => {
  const stats = [
    {
      title: 'Total Bookings',
      value: '156',
      change: '+12%',
      icon: Calendar,
      color: 'text-blue-600'
    },
    {
      title: 'Active Customers',
      value: '89',
      change: '+5%',
      icon: Users,
      color: 'text-green-600'
    },
    {
      title: 'Revenue (This Month)',
      value: '$145,750',
      change: '+18%',
      icon: DollarSign,
      color: 'text-yellow-600'
    },
    {
      title: 'Unread Messages',
      value: '23',
      change: '+3',
      icon: MessageSquare,
      color: 'text-red-600'
    }
  ];

  const recentBookings = [
    { id: 'SF001', customer: 'John Smith', package: '3-Day Serengeti', status: 'confirmed', amount: '$4,800' },
    { id: 'SF002', customer: 'Emma Thompson', package: '5-Day Northern Circuit', status: 'paid', amount: '$6,250' },
    { id: 'SF003', customer: 'Carlos Rodriguez', package: 'Ngorongoro Day Trip', status: 'in_progress', amount: '$700' }
  ];

  const urgentMessages = [
    { id: 1, customer: 'Anna Johansson', type: 'complaint', priority: 'urgent', time: '2h ago' },
    { id: 2, customer: 'Emma Thompson', type: 'payment_issue', priority: 'high', time: '4h ago' },
    { id: 3, customer: 'John Smith', type: 'booking_inquiry', priority: 'medium', time: '6h ago' }
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      confirmed: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      in_progress: 'bg-blue-100 text-blue-800',
      completed: 'bg-primary text-primary-foreground'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      urgent: 'bg-red-100 text-red-800',
      high: 'bg-orange-100 text-orange-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Welcome back, {currentUser.name}
        </h1>
        <p className="text-muted-foreground">
          Here's an overview of your safari business operations
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="safari-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {stat.change} from last month
                    </p>
                  </div>
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <Card className="safari-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Recent Bookings
              <Button variant="outline" size="sm">View All</Button>
            </CardTitle>
            <CardDescription>Latest booking activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{booking.customer}</p>
                      <p className="text-sm text-muted-foreground">{booking.package}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={getStatusColor(booking.status)}>
                      {booking.status}
                    </Badge>
                    <p className="text-sm font-medium mt-1">{booking.amount}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Urgent Messages */}
        <Card className="safari-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-orange-500" />
                Urgent Messages
              </span>
              <Button variant="outline" size="sm">View All</Button>
            </CardTitle>
            <CardDescription>Messages requiring immediate attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {urgentMessages.map((message) => (
                <div key={message.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
                      <MessageSquare className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium">{message.customer}</p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {message.type.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={getPriorityColor(message.priority)}>
                      {message.priority}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">{message.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Overview */}
      <Card className="safari-card">
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
          <CardDescription>Key metrics for this month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">94%</p>
                <p className="text-sm text-muted-foreground">Customer Satisfaction</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">2.3h</p>
                <p className="text-sm text-muted-foreground">Avg Response Time</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">87%</p>
                <p className="text-sm text-muted-foreground">Booking Conversion</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;