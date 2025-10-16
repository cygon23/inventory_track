import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Loader2 } from "lucide-react";
import { useDashboardData } from "@/hooks/useDashboardData";

const AllBookings: React.FC = () => {
  const { loading, recentBookings } = useDashboardData();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

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

  if (loading) {
    return (
      <div className='flex items-center justify-center h-96'>
        <Loader2 className='h-8 w-8 animate-spin text-primary' />
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold text-foreground'>All Bookings</h1>
        <p className='text-muted-foreground'>
          Complete list of all booking activities
        </p>
      </div>

      <Card className='safari-card'>
        <CardHeader>
          <CardTitle>Bookings ({recentBookings.length})</CardTitle>
          <CardDescription>All booking records</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {recentBookings.length === 0 ? (
              <p className='text-center text-muted-foreground py-4'>
                No bookings yet
              </p>
            ) : (
              recentBookings.map((booking) => (
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
    </div>
  );
};

export default AllBookings;
