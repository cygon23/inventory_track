import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  Calendar,
  DollarSign,
  MessageSquare,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useNavigate } from "react-router-dom";
import { useUrgentMessages } from "@/hooks/useUrgentMessages";

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { loading, stats, recentBookings } = useDashboardData();

  const { urgentMessages, loading: messagesLoading } = useUrgentMessages();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const statsData = [
    {
      title: "Total Bookings",
      value: stats.totalBookings.toString(),
      change: `${stats.totalBookingsChange >= 0 ? "+" : ""}${
        stats.totalBookingsChange
      }%`,
      icon: Calendar,
      color: "text-blue-600",
    },
    {
      title: "Active Customers",
      value: stats.activeCustomers.toString(),
      change: `${stats.activeCustomersChange >= 0 ? "+" : ""}${
        stats.activeCustomersChange
      }%`,
      icon: Users,
      color: "text-green-600",
    },
    {
      title: "Revenue (This Month)",
      value: formatCurrency(stats.monthlyRevenue),
      change: `${stats.monthlyRevenueChange >= 0 ? "+" : ""}${
        stats.monthlyRevenueChange
      }%`,
      icon: DollarSign,
      color: "text-yellow-600",
    },
    {
      title: "Unread Messages",
      value: stats.unreadMessages.toString(),
      change: `+${stats.unreadMessagesChange}`,
      icon: MessageSquare,
      color: "text-red-600",
    },
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      inquiry: "bg-gray-100 text-gray-800",
      quoted: "bg-purple-100 text-purple-800",
      confirmed: "bg-yellow-100 text-yellow-800",
      paid: "bg-green-100 text-green-800",
      in_progress: "bg-blue-100 text-blue-800",
      completed: "bg-primary text-primary-foreground",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      urgent: "bg-red-100 text-red-800",
      high: "bg-orange-100 text-orange-800",
      medium: "bg-yellow-100 text-yellow-800",
      low: "bg-green-100 text-green-800",
    };
    return (
      colors[priority as keyof typeof colors] || "bg-gray-100 text-gray-800"
    );
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center h-96'>
        <Loader2 className='h-8 w-8 animate-spin text-primary' />
      </div>
    );
  }

  const formatTime = (timestamp: string) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold text-foreground'>
          Welcome back, {currentUser.name}
        </h1>
        <p className='text-muted-foreground'>
          Here's an overview of your safari business operations..
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {statsData.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className='safari-card'>
              <CardContent className='p-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-muted-foreground'>
                      {stat.title}
                    </p>
                    <p className='text-2xl font-bold'>{stat.value}</p>
                    <p className='text-xs text-muted-foreground flex items-center'>
                      <TrendingUp className='h-3 w-3 mr-1' />
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

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <Card className='safari-card'>
          <CardHeader>
            <CardTitle className='flex items-center justify-between'>
              Recent Bookings
              <Button
                variant='outline'
                size='sm'
                onClick={() => navigate("/finance/bookings")}>
                View All
              </Button>
            </CardTitle>
            <CardDescription>Latest booking activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {recentBookings.length === 0 ? (
                <p className='text-center text-muted-foreground py-4'>
                  No bookings yet
                </p>
              ) : (
                recentBookings.slice(0, 5).map((booking) => (
                  <div
                    key={booking.id}
                    className='flex items-center justify-between p-3 border border-border rounded-lg'>
                    <div className='flex items-center space-x-3'>
                      <div className='w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center'>
                        <Calendar className='h-5 w-5 text-primary' />
                      </div>
                      <div>
                        <p className='font-medium'>{booking.customer_name}</p>
                        <p className='text-sm text-muted-foreground'>
                          {booking.safari_package}
                        </p>
                      </div>
                    </div>
                    <div className='text-right'>
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
                      <p className='text-sm font-medium mt-1'>
                        {formatCurrency(Number(booking.total_amount))}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className='safari-card'>
          <CardHeader>
            <CardTitle className='flex items-center justify-between'>
              <span className='flex items-center'>
                <AlertTriangle className='h-5 w-5 mr-2 text-orange-500' />
                Urgent Messages
              </span>
              <Button
                variant='outline'
                size='sm'
                onClick={() => navigate("/finance/messages")}>
                View All
              </Button>
            </CardTitle>
            <CardDescription>
              Messages requiring immediate attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {messagesLoading ? (
                <div className='flex justify-center py-4'>
                  <Loader2 className='h-6 w-6 animate-spin' />
                </div>
              ) : urgentMessages.length === 0 ? (
                <p className='text-center text-muted-foreground py-4'>
                  No urgent messages
                </p>
              ) : (
                urgentMessages.map((message) => (
                  <div
                    key={message.conversation_id}
                    className='flex items-center justify-between p-3 border border-border rounded-lg cursor-pointer hover:bg-accent transition-colors'
                    onClick={() => navigate("/finance/messages")}>
                    <div className='flex items-center space-x-3'>
                      <div className='w-10 h-10 bg-red-50 rounded-full flex items-center justify-center'>
                        <MessageSquare className='h-5 w-5 text-red-600' />
                      </div>
                      <div>
                        <p className='font-medium'>{message.customer_name}</p>
                        <p className='text-sm text-muted-foreground'>
                          {message.subject}
                        </p>
                      </div>
                    </div>
                    <div className='text-right'>
                      <Badge className={getPriorityColor(message.priority)}>
                        {message.priority}
                      </Badge>
                      <p className='text-xs text-muted-foreground mt-1'>
                        {formatTime(message.last_message_at)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className='safari-card'>
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
          <CardDescription>Key metrics for this month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div className='flex items-center space-x-3'>
              <div className='w-12 h-12 bg-green-100 rounded-full flex items-center justify-center'>
                <CheckCircle className='h-6 w-6 text-green-600' />
              </div>
              <div>
                <p className='text-2xl font-bold'>94%</p>
                <p className='text-sm text-muted-foreground'>
                  Customer Satisfaction
                </p>
              </div>
            </div>

            <div className='flex items-center space-x-3'>
              <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center'>
                <Clock className='h-6 w-6 text-blue-600' />
              </div>
              <div>
                <p className='text-2xl font-bold'>2.3h</p>
                <p className='text-sm text-muted-foreground'>
                  Avg Response Time
                </p>
              </div>
            </div>

            <div className='flex items-center space-x-3'>
              <div className='w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center'>
                <TrendingUp className='h-6 w-6 text-yellow-600' />
              </div>
              <div>
                <p className='text-2xl font-bold'>87%</p>
                <p className='text-sm text-muted-foreground'>
                  Booking Conversion
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
