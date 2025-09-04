import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  DollarSign, 
  MessageSquare, 
  Users, 
  Clock,
  CheckCircle,
  AlertCircle,
  Send,
  Eye
} from 'lucide-react';
import { User } from '@/data/mockUsers';

interface BookingManagerDashboardProps {
  currentUser: User;
}

const BookingManagerDashboard: React.FC<BookingManagerDashboardProps> = ({ currentUser }) => {
  const stats = [
    {
      title: 'My Active Bookings',
      value: '23',
      change: '+3 this week',
      icon: Calendar,
      color: 'text-primary'
    },
    {
      title: 'Pending Quotes',
      value: '8',
      change: '2 urgent',
      icon: DollarSign,
      color: 'text-warning'
    },
    {
      title: 'Customer Messages',
      value: '15',
      change: '5 unread',
      icon: MessageSquare,
      color: 'text-destructive'
    },
    {
      title: 'This Month Revenue',
      value: '$45,200',
      change: '+12% vs last month',
      icon: DollarSign,
      color: 'text-success'
    }
  ];

  const recentBookings = [
    { 
      id: 'SF001', 
      customer: 'John Smith', 
      package: '3-Day Serengeti Explorer', 
      status: 'confirmed',
      date: '2024-01-15',
      amount: '$4,800',
      priority: 'medium'
    },
    { 
      id: 'SF002', 
      customer: 'Emma Thompson', 
      package: '5-Day Northern Circuit', 
      status: 'quote_sent',
      date: '2024-01-18',
      amount: '$6,250',
      priority: 'high'
    },
    { 
      id: 'SF003', 
      customer: 'Carlos Rodriguez', 
      package: 'Ngorongoro Day Trip', 
      status: 'payment_pending',
      date: '2024-01-12',
      amount: '$700',
      priority: 'urgent'
    },
    { 
      id: 'SF004', 
      customer: 'Sarah Johnson', 
      package: '4-Day Tarangire & Manyara', 
      status: 'in_progress',
      date: '2024-01-20',
      amount: '$3,200',
      priority: 'low'
    }
  ];

  const pendingQuotes = [
    { 
      id: 'Q001', 
      customer: 'Michael Brown', 
      inquiry: 'Honeymoon Safari Package', 
      requested: '2 days ago',
      budget: '$8,000',
      priority: 'high'
    },
    { 
      id: 'Q002', 
      customer: 'Lisa Wilson', 
      inquiry: 'Family Safari (4 people)', 
      requested: '1 day ago',
      budget: '$12,000',
      priority: 'urgent'
    },
    { 
      id: 'Q003', 
      customer: 'David Chen', 
      inquiry: 'Photography Safari', 
      requested: '3 days ago',
      budget: '$5,500',
      priority: 'medium'
    }
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      confirmed: 'bg-success/10 text-success border-success/20',
      quote_sent: 'bg-warning/10 text-warning border-warning/20',
      payment_pending: 'bg-destructive/10 text-destructive border-destructive/20',
      in_progress: 'bg-primary/10 text-primary border-primary/20',
      completed: 'bg-success/10 text-success border-success/20'
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
          Welcome back, {currentUser.name}
        </h1>
        <p className="text-muted-foreground">
          Manage your safari bookings and customer relationships
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
        {/* My Bookings */}
        <Card className="safari-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-lg">
              My Recent Bookings
              <Button variant="outline" size="sm">View All</Button>
            </CardTitle>
            <CardDescription>Your assigned bookings and their status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-border rounded-lg space-y-2 sm:space-y-0">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm sm:text-base truncate">{booking.customer}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground truncate">{booking.package}</p>
                      <p className="text-xs text-muted-foreground">#{booking.id} • {booking.date}</p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:text-right space-y-1">
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(booking.status)}>
                        {formatStatus(booking.status)}
                      </Badge>
                      <Badge className={getPriorityColor(booking.priority)}>
                        {booking.priority}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium">{booking.amount}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Quotes */}
        <Card className="safari-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-lg">
              <span className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-warning" />
                Pending Quotes
              </span>
              <Button variant="outline" size="sm">View All</Button>
            </CardTitle>
            <CardDescription>Customer inquiries waiting for quotes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingQuotes.map((quote) => (
                <div key={quote.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-border rounded-lg space-y-2 sm:space-y-0">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-warning/10 rounded-full flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-warning" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm sm:text-base">{quote.customer}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">{quote.inquiry}</p>
                      <p className="text-xs text-muted-foreground">Budget: {quote.budget} • {quote.requested}</p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:items-end space-y-2">
                    <Badge className={getPriorityColor(quote.priority)}>
                      {quote.priority}
                    </Badge>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button size="sm">
                        <Send className="h-4 w-4 mr-1" />
                        Quote
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card className="safari-card">
        <CardHeader>
          <CardTitle>My Performance This Month</CardTitle>
          <CardDescription>Your booking and customer service metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Booking Conversion Rate</span>
                <span className="text-sm text-muted-foreground">78%</span>
              </div>
              <Progress value={78} className="h-2" />
              <p className="text-xs text-muted-foreground">18 bookings from 23 quotes</p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Average Response Time</span>
                <span className="text-sm text-muted-foreground">1.2h</span>
              </div>
              <Progress value={85} className="h-2" />
              <p className="text-xs text-muted-foreground">Target: &lt; 2 hours</p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Customer Satisfaction</span>
                <span className="text-sm text-muted-foreground">4.8/5</span>
              </div>
              <Progress value={96} className="h-2" />
              <p className="text-xs text-muted-foreground">Based on 15 reviews</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingManagerDashboard;