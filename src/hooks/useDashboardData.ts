import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface DashboardStats {
    totalBookings: number;
    totalBookingsChange: number;
    activeCustomers: number;
    activeCustomersChange: number;
    monthlyRevenue: number;
    monthlyRevenueChange: number;
    unreadMessages: number;  
    unreadMessagesChange: number;  
}

interface Booking {
    id: string;
    booking_reference: string;
    customer_name: string;
    customer_email: string;
    safari_package: string;
    status: string;
    total_amount: number;
    created_at: string;
}

export const useDashboardData = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<DashboardStats>({
        totalBookings: 0,
        totalBookingsChange: 0,
        activeCustomers: 0,
        activeCustomersChange: 0,
        monthlyRevenue: 0,
        monthlyRevenueChange: 0,
        unreadMessages: 0, 
        unreadMessagesChange: 0, 
    });
    const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
    const [error, setError] = useState<string | null>(null);

    const getDateRanges = () => {
        const now = new Date();
        return {
            firstDayOfMonth: new Date(now.getFullYear(), now.getMonth(), 1)
                .toISOString(),
            lastDayOfMonth: new Date(now.getFullYear(), now.getMonth() + 1, 0)
                .toISOString(),
            firstDayOfLastMonth: new Date(
                now.getFullYear(),
                now.getMonth() - 1,
                1,
            ).toISOString(),
            lastDayOfLastMonth: new Date(now.getFullYear(), now.getMonth(), 0)
                .toISOString(),
        };
    };

    const calculatePercentageChange = (
        current: number,
        previous: number,
    ): number => {
        if (previous === 0) return 0;
        return Math.round(((current - previous) / previous) * 100);
    };

    const fetchBookingsCount = async (startDate: string, endDate: string) => {
        const { count } = await supabase
            .from("bookings")
            .select("*", { count: "exact", head: true })
            .gte("created_at", startDate)
            .lte("created_at", endDate);
        return count || 0;
    };

    const fetchUniqueCustomers = async (startDate: string, endDate: string) => {
        const { data } = await supabase
            .from("bookings")
            .select("customer_id")
            .gte("created_at", startDate)
            .lte("created_at", endDate)
            .not("customer_id", "is", null);
        return new Set(data?.map((b) => b.customer_id)).size;
    };

    const fetchRevenue = async (startDate: string, endDate: string) => {
        const { data } = await supabase
            .from("bookings")
            .select("total_amount")
            .gte("created_at", startDate)
            .lte("created_at", endDate);
        return data?.reduce((sum, b) => sum + Number(b.total_amount), 0) || 0;
    };

    const fetchRecentBookings = async () => {
        const { data } = await supabase
            .from("bookings")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(5);
        return data || [];
    };

    const fetchUnreadMessages = async () => {
    const { data } = await supabase
        .from('conversation_details')
        .select('unread_count');
    return data?.reduce((sum, conv) => sum + conv.unread_count, 0) || 0;
};

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);

            const {
                firstDayOfMonth,
                lastDayOfMonth,
                firstDayOfLastMonth,
                lastDayOfLastMonth,
            } = getDateRanges();

            const [
                thisMonthBookings,
                lastMonthBookings,
                thisMonthCustomers,
                lastMonthCustomers,
                thisMonthRevenue,
                lastMonthRevenue,
                bookingsData,
                unreadMessages, 
            ] = await Promise.all([
                fetchBookingsCount(firstDayOfMonth, lastDayOfMonth),
                fetchBookingsCount(firstDayOfLastMonth, lastDayOfLastMonth),
                fetchUniqueCustomers(firstDayOfMonth, lastDayOfMonth),
                fetchUniqueCustomers(firstDayOfLastMonth, lastDayOfLastMonth),
                fetchRevenue(firstDayOfMonth, lastDayOfMonth),
                fetchRevenue(firstDayOfLastMonth, lastDayOfLastMonth),
                fetchRecentBookings(),
                fetchUnreadMessages(),
            ]);

            setStats({
                totalBookings: thisMonthBookings,
                totalBookingsChange: calculatePercentageChange(
                    thisMonthBookings,
                    lastMonthBookings,
                ),
                activeCustomers: thisMonthCustomers,
                activeCustomersChange: calculatePercentageChange(
                    thisMonthCustomers,
                    lastMonthCustomers,
                ),
                monthlyRevenue: thisMonthRevenue,
                monthlyRevenueChange: calculatePercentageChange(
                    thisMonthRevenue,
                    lastMonthRevenue,
                ),
                 unreadMessages,
                 unreadMessagesChange: 0,  
            });

            setRecentBookings(bookingsData);
        } catch (err) {
            console.error("Error fetching dashboard data:", err);
            setError("Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    return {
        loading,
        error,
        stats,
        recentBookings,
        refetch: fetchDashboardData,
    };
};
