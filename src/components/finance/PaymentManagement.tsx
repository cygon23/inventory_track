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
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  MoreHorizontal,
  Send,
  Eye,
  FileText,
  Loader2,
} from "lucide-react";
import ViewPaymentDetailsDialog from "../modals/finace/ViewPaymentDetailsDialog";
import GenerateInvoiceDialog from "../modals/finace/GenerateInvoiceDialog";
import SendPaymentReminderDialog from "../modals/finace/SendPaymentReminderDialog";
import RecordPaymentDialog from "../modals/finace/RecordPaymentDialog";
import {
  fetchPayments,
  getPaymentStats,
  Payment,
} from "@/services/paymentService";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/components/ui/use-toast";

const PaymentManagement = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const { toast } = useToast();

  // Dialog states
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [isReminderOpen, setIsReminderOpen] = useState(false);
  const [isRecordOpen, setIsRecordOpen] = useState(false);

  // Stats
  const [stats, setStats] = useState({
    pending: 0,
    overdue: 0,
    completed: 0,
    pendingCount: 0,
    overdueCount: 0,
    completedCount: 0,
  });

  // Load payments
  const loadPayments = async () => {
    try {
      setLoading(true);
      const data = await fetchPayments();
      setPayments(data);

      const statsData = await getPaymentStats();
      setStats(statsData);
    } catch (error) {
      console.error("Error loading payments:", error);
      toast({
        title: "Error",
        description: "Failed to load payments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();

    // Subscribe to real-time changes
    const subscription = supabase
      .channel("payments_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "payments" },
        () => {
          loadPayments();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Filter payments
  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.bookings?.booking_reference
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "failed":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      case "overdue":
        return "bg-orange-100 text-orange-800 hover:bg-orange-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const collectionRate =
    payments.length > 0
      ? ((stats.completedCount / payments.length) * 100).toFixed(1)
      : 0;

  if (loading) {
    return (
      <div className='flex items-center justify-center h-96'>
        <Loader2 className='h-8 w-8 animate-spin' />
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>
          Payment Management
        </h1>
        <p className='text-muted-foreground'>
          Track and manage customer payments and transactions
        </p>
      </div>

      {/* Stats Cards */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Pending Payments
            </CardTitle>
            <Clock className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              ${stats.pending.toLocaleString()}
            </div>
            <p className='text-xs text-muted-foreground'>
              {stats.pendingCount} transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Overdue Payments
            </CardTitle>
            <AlertCircle className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-red-600'>
              ${stats.overdue.toLocaleString()}
            </div>
            <p className='text-xs text-muted-foreground'>
              {stats.overdueCount} transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Completed This Month
            </CardTitle>
            <CheckCircle className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-green-600'>
              ${stats.completed.toLocaleString()}
            </div>
            <p className='text-xs text-muted-foreground'>
              {stats.completedCount} transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Collection Rate
            </CardTitle>
            <TrendingUp className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{collectionRate}%</div>
            <p className='text-xs text-muted-foreground'>
              Based on completed payments
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle>Payment Transactions</CardTitle>
              <CardDescription>
                Manage all customer payments and transactions
              </CardDescription>
            </div>
            <Button onClick={() => setIsRecordOpen(true)}>
              <DollarSign className='mr-2 h-4 w-4' />
              Record Payment
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className='flex items-center space-x-2 mb-4'>
            <div className='relative flex-1'>
              <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='Search customers or booking IDs...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='pl-8'
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className='w-[180px]'>
                <Filter className='mr-2 h-4 w-4' />
                <SelectValue placeholder='Filter by status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Status</SelectItem>
                <SelectItem value='pending'>Pending</SelectItem>
                <SelectItem value='completed'>Completed</SelectItem>
                <SelectItem value='overdue'>Overdue</SelectItem>
                <SelectItem value='failed'>Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='rounded-md border'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Payment ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Booking</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className='text-center py-8'>
                      No payments found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className='font-medium'>
                        PAY-{payment.id.slice(0, 8).toUpperCase()}
                      </TableCell>
                      <TableCell>{payment.customer_name}</TableCell>
                      <TableCell>
                        {payment.bookings?.booking_reference || "N/A"}
                      </TableCell>
                      <TableCell className='font-medium'>
                        {formatCurrency(payment.amount, payment.currency)}
                      </TableCell>
                      <TableCell>
                        <Badge variant='outline' className='capitalize'>
                          {payment.type?.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(payment.due_date)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(payment.status)}>
                          {payment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{payment.method || "N/A"}</TableCell>
                      <TableCell className='text-right'>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant='ghost' className='h-8 w-8 p-0'>
                              <MoreHorizontal className='h-4 w-4' />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='end'>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedPayment(payment);
                                setIsDetailsOpen(true);
                              }}>
                              <Eye className='mr-2 h-4 w-4' />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedPayment(payment);
                                setIsInvoiceOpen(true);
                              }}>
                              <FileText className='mr-2 h-4 w-4' />
                              Generate Invoice
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedPayment(payment);
                                setIsReminderOpen(true);
                              }}>
                              <Send className='mr-2 h-4 w-4' />
                              Send Reminder
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <ViewPaymentDetailsDialog
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        payment={selectedPayment}
      />

      <GenerateInvoiceDialog
        open={isInvoiceOpen}
        onOpenChange={setIsInvoiceOpen}
        payment={selectedPayment}
        onGenerate={(data) => {
          console.log("Invoice generated:", data);
          toast({
            title: "Success",
            description: "Invoice generated successfully",
          });
        }}
      />

      <SendPaymentReminderDialog
        open={isReminderOpen}
        onOpenChange={setIsReminderOpen}
        payment={selectedPayment}
        onSend={(data) => {
          console.log("Reminder sent:", data);
          toast({
            title: "Success",
            description: "Payment reminder sent successfully",
          });
        }}
      />

      <RecordPaymentDialog
        open={isRecordOpen}
        onOpenChange={setIsRecordOpen}
        onSubmit={async (data) => {
          await loadPayments();
          toast({
            title: "Success",
            description: "Payment recorded successfully",
          });
        }}
      />
    </div>
  );
};

export default PaymentManagement;
