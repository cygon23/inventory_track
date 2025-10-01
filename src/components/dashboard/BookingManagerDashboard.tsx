import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Calendar,
  DollarSign,
  MessageSquare,
  Clock,
  Send,
  Eye,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import ViewQuoteDialog from "@/components/booking/ViewQuoteDialog";
import SendQuoteDialog from "@/components/booking/SendQuoteDialog";

const BookingManagerDashboard: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [viewQuoteOpen, setViewQuoteOpen] = useState(false);
  const [sendQuoteOpen, setSendQuoteOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<any>(null);

  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [activeBookingsCount, setActiveBookingsCount] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      // Recent Bookings
      const { data: bookings, error: bookingsError } = await supabase
        .from("bookings")
        .select(
          "id, booking_reference, customer_name, safari_package, status, created_at, total_amount"
        )
        .order("created_at", { ascending: false })
        .limit(5);

      if (!bookingsError && bookings) {
        setRecentBookings(bookings);
      }

      // Active Bookings count
      const { count: activeCount } = await supabase
        .from("bookings")
        .select("*", { count: "exact", head: true })
        .not("status", "in", "(completed,cancelled)");

      setActiveBookingsCount(activeCount || 0);

      // This Month Revenue
      const startOfMonth = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        1
      ).toISOString();
      const { data: revenueData, error: revenueError } = await supabase
        .from("bookings")
        .select("paid_amount")
        .gte("created_at", startOfMonth)
        .eq("payment_status", "paid");

      if (!revenueError && revenueData) {
        const total = revenueData.reduce(
          (sum, b) => sum + parseFloat(b.paid_amount || 0),
          0
        );
        setMonthlyRevenue(total);
      }
    };

    fetchData();
  }, []);

  const stats = [
    {
      title: "My Active Bookings",
      value: activeBookingsCount.toString(),
      change: "+3 this week",
      icon: Calendar,
      color: "text-primary",
    },
    {
      title: "Pending Quotes",
      value: "8",
      change: "2 urgent",
      icon: DollarSign,
      color: "text-warning",
    },
    {
      title: "Customer Messages",
      value: "15",
      change: "5 unread",
      icon: MessageSquare,
      color: "text-destructive",
    },
    {
      title: "This Month Revenue",
      value: `$${monthlyRevenue.toLocaleString()}`,
      change: "+12% vs last month",
      icon: DollarSign,
      color: "text-success",
    },
  ];

  const pendingQuotes = [
    {
      id: "Q001",
      customer: "Michael Brown",
      inquiry: "Honeymoon Safari Package",
      requested: "2 days ago",
      budget: "$8,000",
      priority: "high",
    },
    {
      id: "Q002",
      customer: "Lisa Wilson",
      inquiry: "Family Safari (4 people)",
      requested: "1 day ago",
      budget: "$12,000",
      priority: "urgent",
    },
    {
      id: "Q003",
      customer: "David Chen",
      inquiry: "Photography Safari",
      requested: "3 days ago",
      budget: "$5,500",
      priority: "medium",
    },
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      confirmed: "bg-success/10 text-success border-success/20",
      quote_sent: "bg-warning/10 text-warning border-warning/20",
      payment_pending:
        "bg-destructive/10 text-destructive border-destructive/20",
      in_progress: "bg-primary/10 text-primary border-primary/20",
      completed: "bg-success/10 text-success border-success/20",
    };
    return (
      colors[status as keyof typeof colors] ||
      "bg-muted/10 text-muted-foreground border-muted/20"
    );
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      urgent: "bg-destructive/10 text-destructive border-destructive/20",
      high: "bg-warning/10 text-warning border-warning/20",
      medium: "bg-primary/10 text-primary border-primary/20",
      low: "bg-muted/10 text-muted-foreground border-muted/20",
    };
    return (
      colors[priority as keyof typeof colors] ||
      "bg-muted/10 text-muted-foreground border-muted/20"
    );
  };

  const formatStatus = (status: string) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const handleViewQuote = (quote: any) => {
    setSelectedQuote(quote);
    setViewQuoteOpen(true);
  };

  const handleSendQuote = (quote: any) => {
    setSelectedQuote(quote);
    setViewQuoteOpen(false);
    setSendQuoteOpen(true);
  };

  const handleQuoteSuccess = () => {
    console.log("Quote sent successfully");
  };

  return (
    <div className='space-y-6'>
      {/* Welcome Header */}
      <div>
        <h1 className='text-2xl md:text-3xl font-bold text-foreground'>
          Welcome back, {currentUser.name}
        </h1>
        <p className='text-muted-foreground'>
          Manage your safari bookings and customer relationships
        </p>
      </div>

      {/* Stats Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6'>
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className='safari-card'>
              <CardContent className='p-4 md:p-6'>
                <div className='flex items-center justify-between'>
                  <div className='space-y-1'>
                    <p className='text-sm font-medium text-muted-foreground'>
                      {stat.title}
                    </p>
                    <p className='text-xl md:text-2xl font-bold'>
                      {stat.value}
                    </p>
                    <p className='text-xs text-muted-foreground'>
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

      <div className='grid grid-cols-1 xl:grid-cols-2 gap-6'>
        {/* My Bookings */}
        <Card className='safari-card'>
          <CardHeader>
            <CardTitle className='flex items-center justify-between text-lg'>
              My Recent Bookings
              <Button variant='outline' size='sm'>
                View All
              </Button>
            </CardTitle>
            <CardDescription>
              Your assigned bookings and their status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {recentBookings.map((booking) => (
                <div
                  key={booking.id}
                  className='flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-border rounded-lg space-y-2 sm:space-y-0'>
                  <div className='flex items-center space-x-3'>
                    <div className='w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center'>
                      <Calendar className='h-5 w-5 text-primary' />
                    </div>
                    <div className='min-w-0 flex-1'>
                      <p className='font-medium text-sm sm:text-base truncate'>
                        {booking.customer_name}
                      </p>
                      <p className='text-xs sm:text-sm text-muted-foreground truncate'>
                        {booking.safari_package}
                      </p>
                      <p className='text-xs text-muted-foreground'>
                        #{booking.booking_reference} •{" "}
                        {new Date(booking.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className='flex flex-col sm:text-right space-y-1'>
                    <Badge className={getStatusColor(booking.status)}>
                      {formatStatus(booking.status)}
                    </Badge>
                    <p className='text-sm font-medium'>
                      ${parseFloat(booking.total_amount).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Quotes (static) */}
        <Card className='safari-card'>
          <CardHeader>
            <CardTitle className='flex items-center justify-between text-lg'>
              <span className='flex items-center'>
                <Clock className='h-5 w-5 mr-2 text-warning' />
                Pending Quotes
              </span>
              <Button variant='outline' size='sm'>
                View All
              </Button>
            </CardTitle>
            <CardDescription>
              Customer inquiries waiting for quotes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {pendingQuotes.map((quote) => (
                <div
                  key={quote.id}
                  className='flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-border rounded-lg space-y-2 sm:space-y-0'>
                  <div className='flex items-center space-x-3'>
                    <div className='w-10 h-10 bg-warning/10 rounded-full flex items-center justify-center'>
                      <DollarSign className='h-5 w-5 text-warning' />
                    </div>
                    <div className='min-w-0 flex-1'>
                      <p className='font-medium text-sm sm:text-base'>
                        {quote.customer}
                      </p>
                      <p className='text-xs sm:text-sm text-muted-foreground'>
                        {quote.inquiry}
                      </p>
                      <p className='text-xs text-muted-foreground'>
                        Budget: {quote.budget} • {quote.requested}
                      </p>
                    </div>
                  </div>
                  <div className='flex flex-col sm:items-end space-y-2'>
                    <Badge className={getPriorityColor(quote.priority)}>
                      {quote.priority}
                    </Badge>
                    <div className='flex space-x-2'>
                      <Button
                        size='sm'
                        variant='outline'
                        onClick={() => handleViewQuote(quote)}>
                        <Eye className='h-4 w-4 mr-1' />
                        View
                      </Button>
                      <Button size='sm' onClick={() => handleSendQuote(quote)}>
                        <Send className='h-4 w-4 mr-1' />
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

      {/* Performance Metrics (unchanged) */}
      <Card className='safari-card'>
        <CardHeader>
          <CardTitle>My Performance This Month</CardTitle>
          <CardDescription>
            Your booking and customer service metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div className='space-y-3'>
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium'>
                  Booking Conversion Rate
                </span>
                <span className='text-sm text-muted-foreground'>78%</span>
              </div>
              <Progress value={78} className='h-2' />
              <p className='text-xs text-muted-foreground'>
                18 bookings from 23 quotes
              </p>
            </div>

            <div className='space-y-3'>
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium'>
                  Average Response Time
                </span>
                <span className='text-sm text-muted-foreground'>1.2h</span>
              </div>
              <Progress value={85} className='h-2' />
              <p className='text-xs text-muted-foreground'>
                Target: &lt; 2 hours
              </p>
            </div>

            <div className='space-y-3'>
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium'>
                  Customer Satisfaction
                </span>
                <span className='text-sm text-muted-foreground'>4.8/5</span>
              </div>
              <Progress value={96} className='h-2' />
              <p className='text-xs text-muted-foreground'>
                Based on 15 reviews
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* View Quote Dialog */}
      <ViewQuoteDialog
        open={viewQuoteOpen}
        onOpenChange={setViewQuoteOpen}
        quote={selectedQuote}
        onSendQuote={handleSendQuote}
      />

      {/* Send Quote Dialog */}
      <SendQuoteDialog
        open={sendQuoteOpen}
        onOpenChange={setSendQuoteOpen}
        quote={selectedQuote}
        onSuccess={handleQuoteSuccess}
      />
    </div>
  );
};

export default BookingManagerDashboard;
