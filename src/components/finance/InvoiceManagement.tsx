import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Search, Filter, FileText, Download, Send, Eye, Plus, MoreHorizontal } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User } from "@/data/mockUsers";

interface InvoiceManagementProps {
  currentUser: User;
}

interface Invoice {
  id: string;
  number: string;
  customerName: string;
  bookingId: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  currency: string;
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
  type: "deposit" | "balance" | "full_payment";
  description: string;
}

const mockInvoices: Invoice[] = [
  {
    id: "INV-001",
    number: "INV-2024-001",
    customerName: "John Smith",
    bookingId: "BK-2024-001",
    issueDate: "2024-01-10",
    dueDate: "2024-01-20",
    amount: 2500,
    currency: "USD",
    status: "paid",
    type: "deposit",
    description: "Deposit for Serengeti Safari Package"
  },
  {
    id: "INV-002",
    number: "INV-2024-002",
    customerName: "Emma Wilson",
    bookingId: "BK-2024-002",
    issueDate: "2024-01-15",
    dueDate: "2024-02-15",
    amount: 7500,
    currency: "USD",
    status: "sent",
    type: "balance",
    description: "Balance payment for Kilimanjaro Trek"
  },
  {
    id: "INV-003",
    number: "INV-2024-003",
    customerName: "Michael Brown",
    bookingId: "BK-2024-003",
    issueDate: "2024-01-05",
    dueDate: "2024-01-15",
    amount: 1800,
    currency: "USD",
    status: "overdue",
    type: "deposit",
    description: "Deposit for Ngorongoro Crater Tour"
  },
  {
    id: "INV-004",
    number: "INV-2024-004",
    customerName: "Sarah Davis",
    bookingId: "BK-2024-004",
    issueDate: "2024-01-20",
    dueDate: "2024-02-20",
    amount: 5200,
    currency: "USD",
    status: "draft",
    type: "full_payment",
    description: "Full payment for Masai Mara Safari"
  },
  {
    id: "INV-005",
    number: "INV-2024-005",
    customerName: "David Lee",
    bookingId: "BK-2024-005",
    issueDate: "2024-01-25",
    dueDate: "2024-02-25",
    amount: 3200,
    currency: "USD",
    status: "sent",
    type: "deposit",
    description: "Deposit for Zanzibar Beach Safari"
  }
];

const InvoiceManagement: React.FC<InvoiceManagementProps> = ({ currentUser }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredInvoices = mockInvoices.filter(invoice => {
    const matchesSearch = invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.bookingId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "bg-green-100 text-green-800 hover:bg-green-200";
      case "sent": return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "draft": return "bg-gray-100 text-gray-800 hover:bg-gray-200";
      case "overdue": return "bg-red-100 text-red-800 hover:bg-red-200";
      case "cancelled": return "bg-orange-100 text-orange-800 hover:bg-orange-200";
      default: return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const totalDraft = mockInvoices.filter(i => i.status === 'draft').reduce((sum, i) => sum + i.amount, 0);
  const totalSent = mockInvoices.filter(i => i.status === 'sent').reduce((sum, i) => sum + i.amount, 0);
  const totalPaid = mockInvoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0);
  const totalOverdue = mockInvoices.filter(i => i.status === 'overdue').reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Invoice Management</h1>
        <p className="text-muted-foreground">Create, track, and manage customer invoices</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Draft Invoices</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalDraft.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {mockInvoices.filter(i => i.status === 'draft').length} invoices
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sent Invoices</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSent.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {mockInvoices.filter(i => i.status === 'sent').length} invoices
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid Invoices</CardTitle>
            <Badge className="bg-green-100 text-green-800">✓</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${totalPaid.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {mockInvoices.filter(i => i.status === 'paid').length} invoices
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <Badge className="bg-red-100 text-red-800">!</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">${totalOverdue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {mockInvoices.filter(i => i.status === 'overdue').length} invoices
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Invoice List</CardTitle>
              <CardDescription>Manage all customer invoices and billing</CardDescription>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Invoice
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search invoices, customers, or booking IDs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Booking</TableHead>
                  <TableHead>Issue Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.number}</TableCell>
                    <TableCell>{invoice.customerName}</TableCell>
                    <TableCell>{invoice.bookingId}</TableCell>
                    <TableCell>{formatDate(invoice.issueDate)}</TableCell>
                    <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(invoice.amount, invoice.currency)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {invoice.type.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(invoice.status)}>
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Invoice
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            Download PDF
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Send className="mr-2 h-4 w-4" />
                            Send to Customer
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileText className="mr-2 h-4 w-4" />
                            Duplicate Invoice
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceManagement;