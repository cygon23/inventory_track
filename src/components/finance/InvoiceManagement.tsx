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
  FileText,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  MoreHorizontal,
  Send,
  Eye,
  Download,
  Loader2,
  XCircle,
} from "lucide-react";
import {
  fetchInvoices,
  getInvoiceStats,
  updateInvoiceStatus,
  Invoice,
} from "@/services/invoiceService";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

const InvoiceManagement = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();

  // Stats
  const [stats, setStats] = useState({
    draft: 0,
    sent: 0,
    paid: 0,
    overdue: 0,
    draftCount: 0,
    sentCount: 0,
    paidCount: 0,
    overdueCount: 0,
  });

  // Load invoices
  const loadInvoices = async () => {
    try {
      setLoading(true);
      const data = await fetchInvoices();
      setInvoices(data);

      const statsData = await getInvoiceStats();
      setStats(statsData);
    } catch (error) {
      console.error("Error loading invoices:", error);
      toast({
        title: "Error",
        description: "Failed to load invoices",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvoices();

    // Subscribe to real-time changes
    const subscription = supabase
      .channel("invoices_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "invoices" },
        () => {
          loadInvoices();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Filter invoices
  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.bookings?.booking_reference
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "sent":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "draft":
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
      case "overdue":
        return "bg-orange-100 text-orange-800 hover:bg-orange-200";
      case "cancelled":
        return "bg-red-100 text-red-800 hover:bg-red-200";
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

  const handleStatusChange = async (invoiceId: string, newStatus: string) => {
    try {
      await updateInvoiceStatus(invoiceId, newStatus);
      await loadInvoices();
      toast({
        title: "Success",
        description: `Invoice status updated to ${newStatus}`,
      });
    } catch (error) {
      console.error("Error updating invoice:", error);
      toast({
        title: "Error",
        description: "Failed to update invoice status",
        variant: "destructive",
      });
    }
  };

  const collectionRate =
    invoices.length > 0
      ? ((stats.paidCount / invoices.length) * 100).toFixed(1)
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
          Invoice Management
        </h1>
        <p className='text-muted-foreground'>
          Track and manage customer invoices
        </p>
      </div>

      {/* Stats Cards */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Draft Invoices
            </CardTitle>
            <Clock className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              ${stats.draft.toLocaleString()}
            </div>
            <p className='text-xs text-muted-foreground'>
              {stats.draftCount} invoices
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Sent Invoices</CardTitle>
            <Send className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-blue-600'>
              ${stats.sent.toLocaleString()}
            </div>
            <p className='text-xs text-muted-foreground'>
              {stats.sentCount} invoices
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Paid Invoices</CardTitle>
            <CheckCircle className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-green-600'>
              ${stats.paid.toLocaleString()}
            </div>
            <p className='text-xs text-muted-foreground'>
              {stats.paidCount} invoices
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
              Based on paid invoices
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle>Invoice List</CardTitle>
              <CardDescription>View and manage all invoices</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className='flex items-center space-x-2 mb-4'>
            <div className='relative flex-1'>
              <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='Search invoices...'
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
                <SelectItem value='draft'>Draft</SelectItem>
                <SelectItem value='sent'>Sent</SelectItem>
                <SelectItem value='paid'>Paid</SelectItem>
                <SelectItem value='overdue'>Overdue</SelectItem>
                <SelectItem value='cancelled'>Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='rounded-md border'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Booking</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Issue Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className='text-center py-8'>
                      No invoices found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className='font-medium'>
                        {invoice.number}
                      </TableCell>
                      <TableCell>{invoice.customer_name}</TableCell>
                      <TableCell>
                        {invoice.bookings?.booking_reference || "N/A"}
                      </TableCell>
                      <TableCell className='font-medium'>
                        {formatCurrency(invoice.amount, invoice.currency)}
                      </TableCell>
                      <TableCell>
                        <Badge variant='outline' className='capitalize'>
                          {invoice.type?.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(invoice.issue_date)}</TableCell>
                      <TableCell>{formatDate(invoice.due_date)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(invoice.status)}>
                          {invoice.status}
                        </Badge>
                      </TableCell>
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
                                // TODO: Implement view details
                                toast({
                                  title: "View Invoice",
                                  description: "Opening invoice details...",
                                });
                              }}>
                              <Eye className='mr-2 h-4 w-4' />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                // TODO: Implement download PDF
                                toast({
                                  title: "Download",
                                  description: "Downloading invoice PDF...",
                                });
                              }}>
                              <Download className='mr-2 h-4 w-4' />
                              Download PDF
                            </DropdownMenuItem>
                            {invoice.status === "draft" && (
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusChange(invoice.id, "sent")
                                }>
                                <Send className='mr-2 h-4 w-4' />
                                Mark as Sent
                              </DropdownMenuItem>
                            )}
                            {(invoice.status === "draft" ||
                              invoice.status === "sent") && (
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusChange(invoice.id, "paid")
                                }>
                                <CheckCircle className='mr-2 h-4 w-4' />
                                Mark as Paid
                              </DropdownMenuItem>
                            )}
                            {invoice.status !== "cancelled" && (
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusChange(invoice.id, "cancelled")
                                }
                                className='text-red-600'>
                                <XCircle className='mr-2 h-4 w-4' />
                                Cancel Invoice
                              </DropdownMenuItem>
                            )}
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
    </div>
  );
};

export default InvoiceManagement;
