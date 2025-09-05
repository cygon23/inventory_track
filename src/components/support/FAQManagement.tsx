import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Search, Plus, Edit, Trash2, Eye, TrendingUp, HelpCircle, Users, Clock, MoreHorizontal } from "lucide-react";
import { User } from "@/data/mockUsers";

interface FAQManagementProps {
  currentUser: User;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: "booking" | "payment" | "safari" | "travel" | "general";
  status: "published" | "draft" | "archived";
  views: number;
  helpful: number;
  notHelpful: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

const mockFAQs: FAQ[] = [
  {
    id: "FAQ-001",
    question: "What is included in the safari package?",
    answer: "Our safari packages typically include accommodation, meals, transportation, park fees, professional guide services, and game drives. Specific inclusions may vary by package - please check the detailed itinerary for your chosen safari.",
    category: "safari",
    status: "published",
    views: 1240,
    helpful: 156,
    notHelpful: 12,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-20T14:30:00Z",
    createdBy: "Admin"
  },
  {
    id: "FAQ-002",
    question: "How do I cancel or modify my booking?",
    answer: "You can cancel or modify your booking up to 30 days before your travel date without penalty. For cancellations within 30 days, cancellation fees may apply. Please contact our booking team or use your online dashboard to make changes.",
    category: "booking",
    status: "published",
    views: 892,
    helpful: 124,
    notHelpful: 8,
    createdAt: "2024-01-10T09:15:00Z",
    updatedAt: "2024-01-18T11:20:00Z",
    createdBy: "Admin"
  },
  {
    id: "FAQ-003",
    question: "What payment methods do you accept?",
    answer: "We accept major credit cards (Visa, MasterCard, American Express), bank transfers, and PayPal. A deposit is required to secure your booking, with the balance due 30 days before departure.",
    category: "payment",
    status: "published",
    views: 756,
    helpful: 98,
    notHelpful: 5,
    createdAt: "2024-01-08T16:45:00Z",
    updatedAt: "2024-01-19T09:10:00Z",
    createdBy: "Finance Team"
  },
  {
    id: "FAQ-004",
    question: "What should I pack for a safari?",
    answer: "Essential items include comfortable clothing in neutral colors, sunscreen, insect repellent, binoculars, camera, hat, and comfortable walking shoes. We'll provide a detailed packing list upon booking confirmation.",
    category: "travel",
    status: "published",
    views: 623,
    helpful: 87,
    notHelpful: 3,
    createdAt: "2024-01-12T13:20:00Z",
    updatedAt: "2024-01-20T10:15:00Z",
    createdBy: "Operations"
  },
  {
    id: "FAQ-005",
    question: "Is travel insurance recommended?",
    answer: "Yes, we highly recommend comprehensive travel insurance that covers trip cancellation, medical emergencies, and evacuation. We can recommend insurance providers upon request.",
    category: "travel",
    status: "draft",
    views: 0,
    helpful: 0,
    notHelpful: 0,
    createdAt: "2024-01-21T08:30:00Z",
    updatedAt: "2024-01-21T08:30:00Z",
    createdBy: "Admin"
  }
];

const FAQManagement: React.FC<FAQManagementProps> = ({ currentUser }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredFAQs = mockFAQs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || faq.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || faq.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published": return "bg-green-100 text-green-800 hover:bg-green-200";
      case "draft": return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "archived": return "bg-gray-100 text-gray-800 hover:bg-gray-200";
      default: return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "booking": return "bg-blue-100 text-blue-800";
      case "payment": return "bg-purple-100 text-purple-800";
      case "safari": return "bg-green-100 text-green-800";
      case "travel": return "bg-orange-100 text-orange-800";
      case "general": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const totalViews = mockFAQs.reduce((sum, faq) => sum + faq.views, 0);
  const totalHelpful = mockFAQs.reduce((sum, faq) => sum + faq.helpful, 0);
  const publishedFAQs = mockFAQs.filter(faq => faq.status === 'published').length;
  const helpfulnessRate = totalHelpful > 0 ? ((totalHelpful / (totalHelpful + mockFAQs.reduce((sum, faq) => sum + faq.notHelpful, 0))) * 100).toFixed(1) : "0";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">FAQ Management</h1>
        <p className="text-muted-foreground">Manage frequently asked questions and help content</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published FAQs</CardTitle>
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{publishedFAQs}</div>
            <p className="text-xs text-muted-foreground">
              {mockFAQs.filter(faq => faq.status === 'draft').length} drafts pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
            <p className="text-xs text-green-600">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Helpfulness Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{helpfulnessRate}%</div>
            <p className="text-xs text-muted-foreground">
              {totalHelpful} helpful votes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.3h</div>
            <p className="text-xs text-green-600">
              -30m from last week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* FAQ Management Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>FAQ List</CardTitle>
              <CardDescription>Manage frequently asked questions and answers</CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add FAQ
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New FAQ</DialogTitle>
                  <DialogDescription>
                    Create a new frequently asked question and answer.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="question">Question</Label>
                    <Input id="question" placeholder="Enter the question..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="answer">Answer</Label>
                    <Textarea 
                      id="answer" 
                      placeholder="Enter the detailed answer..." 
                      rows={4}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="booking">Booking</SelectItem>
                          <SelectItem value="payment">Payment</SelectItem>
                          <SelectItem value="safari">Safari</SelectItem>
                          <SelectItem value="travel">Travel</SelectItem>
                          <SelectItem value="general">General</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setIsAddDialogOpen(false)}>
                      Create FAQ
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="booking">Booking</SelectItem>
                <SelectItem value="payment">Payment</SelectItem>
                <SelectItem value="safari">Safari</SelectItem>
                <SelectItem value="travel">Travel</SelectItem>
                <SelectItem value="general">General</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {filteredFAQs.map((faq) => (
              <Card key={faq.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge className={getCategoryColor(faq.category)}>
                          {faq.category}
                        </Badge>
                        <Badge className={getStatusColor(faq.status)}>
                          {faq.status}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{faq.question}</CardTitle>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-muted-foreground mb-4">{faq.answer}</p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <Eye className="mr-1 h-3 w-3" />
                        {faq.views} views
                      </span>
                      <span className="flex items-center">
                        <TrendingUp className="mr-1 h-3 w-3" />
                        {faq.helpful} helpful
                      </span>
                    </div>
                    <div>
                      Updated {formatDate(faq.updatedAt)} by {faq.createdBy}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* FAQ Preview Section */}
      <Card>
        <CardHeader>
          <CardTitle>Customer FAQ Preview</CardTitle>
          <CardDescription>How customers see the FAQ section</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {filteredFAQs.filter(faq => faq.status === 'published').slice(0, 3).map((faq) => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

export default FAQManagement;