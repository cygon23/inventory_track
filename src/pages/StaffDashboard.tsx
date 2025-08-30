import React, { useEffect, useRef } from 'react';
import { Users, TrendingUp, Calendar, AlertTriangle, DollarSign, Star } from 'lucide-react';
import { gsap } from 'gsap';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Layout } from '@/components/Layout';
import { SafariCard } from '@/components/SafariCard';
import { mockClients, analyticsData } from '@/data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

const StaffDashboard: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const tl = gsap.timeline();
    
    // Animate container
    tl.from(containerRef.current, {
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: "power2.out"
    });

    // Stagger stats animations
    statsRef.current.forEach((stat, index) => {
      if (stat) {
        tl.from(stat, {
          opacity: 0,
          y: 30,
          scale: 0.95,
          duration: 0.6,
          ease: "back.out(1.7)"
        }, index * 0.1);
      }
    });
  }, []);

  const urgentActions = mockClients.filter(client => 
    client.journeyStatus === 'submitted' || 
    (client.paidAmount < client.totalCost && new Date(client.safariDates.start) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000))
  );

  const recentBookings = mockClients
    .sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime())
    .slice(0, 3);

  const chartConfig = {
    bookings: {
      label: "Bookings",
      color: "hsl(var(--primary))",
    },
    revenue: {
      label: "Revenue",
      color: "hsl(var(--accent-gold))",
    },
  };

  const statusColors = {
    'Submitted': '#f59e0b',
    'Confirmed': '#3b82f6', 
    'Arrived': '#10b981',
    'Completed': '#8b5cf6'
  };

  return (
    <Layout userType="staff">
      <div ref={containerRef} className="space-y-6">
        {/* Header */}
        <div className="safari-card p-6">
          <h1 className="text-3xl font-bold text-foreground">Staff Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Manage your safari clients and track business performance
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card ref={el => statsRef.current[0] = el} className="safari-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Bookings</p>
                  <p className="text-3xl font-bold text-foreground">{analyticsData.totalBookings}</p>
                  <p className="text-xs text-success">+12% from last month</p>
                </div>
                <Users className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card ref={el => statsRef.current[1] = el} className="safari-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Clients</p>
                  <p className="text-3xl font-bold text-foreground">{analyticsData.activeClients}</p>
                  <p className="text-xs text-success">+5 new this week</p>
                </div>
                <Calendar className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card ref={el => statsRef.current[2] = el} className="safari-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Revenue</p>
                  <p className="text-3xl font-bold text-foreground">
                    ${(analyticsData.revenue / 1000).toFixed(0)}k
                  </p>
                  <p className="text-xs text-success">+18% from last month</p>
                </div>
                <DollarSign className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card ref={el => statsRef.current[3] = el} className="safari-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Satisfaction</p>
                  <p className="text-3xl font-bold text-foreground">{analyticsData.satisfactionScore}</p>
                  <p className="text-xs text-success">Excellent rating</p>
                </div>
                <Star className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Bookings Chart */}
          <Card className="safari-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <span>Monthly Bookings</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData.monthlyBookings}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="bookings" fill="var(--color-bookings)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Status Distribution */}
          <Card className="safari-card">
            <CardHeader>
              <CardTitle>Journey Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analyticsData.statusDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="count"
                      nameKey="status"
                    >
                      {analyticsData.statusDistribution.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={statusColors[entry.status as keyof typeof statusColors]} 
                        />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {analyticsData.statusDistribution.map((item) => (
                  <div key={item.status} className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: statusColors[item.status as keyof typeof statusColors] }}
                    />
                    <span className="text-sm text-foreground">{item.status}</span>
                    <span className="text-sm text-muted-foreground">({item.count})</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Urgent Actions */}
        {urgentActions.length > 0 && (
          <Card className="safari-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-warning" />
                <span>Urgent Actions Required</span>
                <Badge className="bg-warning text-warning-foreground">
                  {urgentActions.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {urgentActions.map((client) => (
                  <div key={client.id} className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-foreground">{client.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {client.journeyStatus === 'submitted' 
                            ? 'New booking requires confirmation'
                            : 'Payment pending for upcoming safari'
                          }
                        </p>
                      </div>
                      <Badge className={
                        client.journeyStatus === 'submitted' 
                          ? 'bg-warning text-warning-foreground'
                          : 'bg-destructive text-destructive-foreground'
                      }>
                        {client.journeyStatus === 'submitted' ? 'New' : 'Payment Due'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Bookings */}
        <Card className="safari-card">
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentBookings.map((client) => (
                <SafariCard 
                  key={client.id} 
                  client={client}
                  onClick={() => {/* Navigate to client details */}}
                  className="h-full"
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default StaffDashboard;