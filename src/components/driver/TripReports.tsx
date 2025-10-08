import React, { useState } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import {
  FileText,
  Calendar,
  Users,
  MapPin,
  Star,
  Clock,
  Fuel,
  Car,
  AlertTriangle,
  CheckCircle,
  Eye,
  Plus,
  Download,
  Loader2,
} from "lucide-react";
import {
  useTripReports,
  useMonthlyStats,
  useCreateTripReport,
  useDeleteTripReport,
  useDriverTripsForReports,
} from "@/features/driver/hooks/useReports";
import type {
  CreateTripReportData,
  TripReportFilters,
  TripExpenses,
} from "@/features/driver/types/dashboard.types";

const TripReports: React.FC = () => {
  const { user: currentUser } = useAuth();

  if (!currentUser) {
    return (
      <div className='flex items-center justify-center h-64'>
        <Loader2 className='h-8 w-8 animate-spin text-primary' />
      </div>
    );
  }

  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState<
    "all" | "this-month" | "last-month" | "this-year"
  >("all");
  const [isNewReportOpen, setIsNewReportOpen] = useState(false);
  const { data: completedTrips } = useDriverTripsForReports(currentUser.id);

  // Form state for new report
  const [formData, setFormData] = useState<Partial<CreateTripReportData>>({
    booking_ref: "",
    trip_id: "",
    completion_date: "",
    duration_days: 0,
    total_distance: 0,
    fuel_used: 0,
    customer_rating: undefined,
    vehicle_condition: "good",
    issues: [],
    highlights: [],
    notes: "",
    expenses: { fuel: 0, meals: 0, accommodation: 0, miscellaneous: 0 },
  });

  // Build filters object
  const filters: TripReportFilters = {
    search: searchTerm || undefined,
    dateFilter: dateFilter !== "all" ? dateFilter : undefined,
  };

  // Fetch data using hooks
  const {
    data: tripReports,
    isLoading: reportsLoading,
    error: reportsError,
  } = useTripReports(currentUser.id, filters);
  const {
    data: monthlyStats,
    isLoading: statsLoading,
    error: statsError,
  } = useMonthlyStats(currentUser.id);
  const createReportMutation = useCreateTripReport();
  const deleteReportMutation = useDeleteTripReport();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "excellent":
        return "text-green-600";
      case "good":
        return "text-blue-600";
      case "fair":
        return "text-yellow-600";
      case "poor":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  const handleCreateReport = async () => {
    if (
      !formData.booking_ref ||
      !formData.trip_id ||
      !formData.completion_date
    ) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      await createReportMutation.mutateAsync({
        driverId: currentUser.id,
        reportData: formData as CreateTripReportData,
      });

      // Reset form and close dialog
      setFormData({
        booking_ref: "",
        trip_id: "",
        completion_date: "",
        duration_days: 0,
        total_distance: 0,
        fuel_used: 0,
        customer_rating: undefined,
        vehicle_condition: "good",
        issues: [],
        highlights: [],
        notes: "",
        expenses: { fuel: 0, meals: 0, accommodation: 0, miscellaneous: 0 },
      });
      setIsNewReportOpen(false);
    } catch (error) {
      console.error("Error creating report:", error);
      alert("Failed to create report. Please try again.");
    }
  };

  const handleDeleteReport = async (reportId: string) => {
    if (!confirm("Are you sure you want to delete this report?")) return;

    try {
      await deleteReportMutation.mutateAsync(reportId);
    } catch (error) {
      console.error("Error deleting report:", error);
      alert("Failed to delete report. Please try again.");
    }
  };

  const updateFormField = (field: keyof CreateTripReportData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Loading state
  if (reportsLoading || statsLoading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <Loader2 className='h-8 w-8 animate-spin text-primary' />
      </div>
    );
  }

  // Error state
  if (reportsError || statsError) {
    return (
      <Alert variant='destructive'>
        <AlertTriangle className='h-4 w-4' />
        <AlertDescription>
          Failed to load trip reports. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <div>
          <h1 className='text-2xl font-bold text-foreground'>Trip Reports</h1>
          <p className='text-muted-foreground'>
            View and manage your completed trip reports
          </p>
        </div>
        <div className='flex gap-2'>
          <Dialog open={isNewReportOpen} onOpenChange={setIsNewReportOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className='h-4 w-4 mr-2' />
                New Report
              </Button>
            </DialogTrigger>
            <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
              <DialogHeader>
                <DialogTitle>Create Trip Report</DialogTitle>
                <DialogDescription>
                  Fill out the details for your completed trip
                </DialogDescription>
              </DialogHeader>
              <div className='grid gap-4 py-4'>
                <div className='space-y-2'>
                  <Label htmlFor='trip-select'>Select Completed Trip *</Label>
                  <Select
                    value={formData.trip_id}
                    onValueChange={(tripId) => {
                      const trip = completedTrips?.find((t) => t.id === tripId);
                      if (trip?.booking) {
                        updateFormField("trip_id", tripId);
                        updateFormField(
                          "booking_ref",
                          trip.booking.booking_reference
                        );
                      }
                    }}>
                    <SelectTrigger>
                      <SelectValue placeholder='Select a trip' />
                    </SelectTrigger>
                    <SelectContent>
                      {completedTrips?.map((trip) => (
                        <SelectItem key={trip.id} value={trip.id}>
                          {trip.booking?.booking_reference} -{" "}
                          {trip.booking?.customer_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className='grid grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='completion-date'>Completion Date *</Label>
                    <Input
                      id='completion-date'
                      type='date'
                      value={formData.completion_date}
                      onChange={(e) =>
                        updateFormField("completion_date", e.target.value)
                      }
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='duration'>Duration (days) *</Label>
                    <Input
                      id='duration'
                      type='number'
                      placeholder='4'
                      value={formData.duration_days || ""}
                      onChange={(e) =>
                        updateFormField(
                          "duration_days",
                          parseInt(e.target.value) || 0
                        )
                      }
                    />
                  </div>
                </div>
                <div className='grid grid-cols-3 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='distance'>Distance (km) *</Label>
                    <Input
                      id='distance'
                      type='number'
                      placeholder='245'
                      value={formData.total_distance || ""}
                      onChange={(e) =>
                        updateFormField(
                          "total_distance",
                          parseFloat(e.target.value) || 0
                        )
                      }
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='fuel'>Fuel (liters) *</Label>
                    <Input
                      id='fuel'
                      type='number'
                      placeholder='45'
                      value={formData.fuel_used || ""}
                      onChange={(e) =>
                        updateFormField(
                          "fuel_used",
                          parseFloat(e.target.value) || 0
                        )
                      }
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='rating'>Rating</Label>
                    <Select
                      value={formData.customer_rating?.toString()}
                      onValueChange={(v) =>
                        updateFormField("customer_rating", parseInt(v))
                      }>
                      <SelectTrigger>
                        <SelectValue placeholder='Rating' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='5'>5 Stars</SelectItem>
                        <SelectItem value='4'>4 Stars</SelectItem>
                        <SelectItem value='3'>3 Stars</SelectItem>
                        <SelectItem value='2'>2 Stars</SelectItem>
                        <SelectItem value='1'>1 Star</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='vehicle-condition'>Vehicle Condition</Label>
                  <Select
                    value={formData.vehicle_condition}
                    onValueChange={(v) =>
                      updateFormField("vehicle_condition", v)
                    }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='excellent'>Excellent</SelectItem>
                      <SelectItem value='good'>Good</SelectItem>
                      <SelectItem value='fair'>Fair</SelectItem>
                      <SelectItem value='poor'>Poor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='highlights'>
                    Trip Highlights (comma-separated)
                  </Label>
                  <Textarea
                    id='highlights'
                    placeholder='Excellent wildlife sightings, Perfect weather, Satisfied guests'
                    value={formData.highlights?.join(", ")}
                    onChange={(e) =>
                      updateFormField(
                        "highlights",
                        e.target.value
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean)
                      )
                    }
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='issues'>Issues (comma-separated)</Label>
                  <Textarea
                    id='issues'
                    placeholder='Minor tire wear, Delayed departure'
                    value={formData.issues?.join(", ")}
                    onChange={(e) =>
                      updateFormField(
                        "issues",
                        e.target.value
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean)
                      )
                    }
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='notes'>Additional Notes</Label>
                  <Textarea
                    id='notes'
                    placeholder='Any additional comments...'
                    value={formData.notes}
                    onChange={(e) => updateFormField("notes", e.target.value)}
                  />
                </div>
                <div className='flex justify-end gap-2'>
                  <Button
                    variant='outline'
                    onClick={() => setIsNewReportOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateReport}
                    disabled={createReportMutation.isPending}>
                    {createReportMutation.isPending && (
                      <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                    )}
                    Save Report
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant='outline'>
            <Download className='h-4 w-4 mr-2' />
            Export
          </Button>
        </div>
      </div>

      {/* Monthly Statistics */}
      {monthlyStats && (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4'>
          <Card>
            <CardContent className='p-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-muted-foreground'>Total Trips</p>
                  <p className='text-2xl font-bold'>
                    {monthlyStats.totalTrips}
                  </p>
                </div>
                <FileText className='h-8 w-8 text-primary' />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className='p-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-muted-foreground'>Distance</p>
                  <p className='text-2xl font-bold'>
                    {monthlyStats.totalDistance}
                  </p>
                </div>
                <MapPin className='h-8 w-8 text-primary' />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className='p-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-muted-foreground'>Fuel Used</p>
                  <p className='text-2xl font-bold'>{monthlyStats.totalFuel}</p>
                </div>
                <Fuel className='h-8 w-8 text-primary' />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className='p-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-muted-foreground'>Avg Rating</p>
                  <p className='text-2xl font-bold'>
                    {monthlyStats.averageRating}
                  </p>
                </div>
                <Star className='h-8 w-8 text-primary' />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className='p-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-muted-foreground'>Revenue</p>
                  <p className='text-2xl font-bold'>
                    {monthlyStats.totalRevenue}
                  </p>
                </div>
                <CheckCircle className='h-8 w-8 text-primary' />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className='p-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-muted-foreground'>On Time</p>
                  <p className='text-2xl font-bold'>
                    {monthlyStats.onTimePerformance}
                  </p>
                </div>
                <Clock className='h-8 w-8 text-primary' />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue='reports' className='space-y-4'>
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
          <TabsList>
            <TabsTrigger value='reports'>All Reports</TabsTrigger>
            <TabsTrigger value='analytics'>Analytics</TabsTrigger>
          </TabsList>

          <div className='flex gap-2 w-full sm:w-auto'>
            <Input
              placeholder='Search reports...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full sm:w-64'
            />
            <Select
              value={dateFilter}
              onValueChange={(v: any) => setDateFilter(v)}>
              <SelectTrigger className='w-full sm:w-40'>
                <SelectValue placeholder='Date Range' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Time</SelectItem>
                <SelectItem value='this-month'>This Month</SelectItem>
                <SelectItem value='last-month'>Last Month</SelectItem>
                <SelectItem value='this-year'>This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value='reports' className='space-y-4'>
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Package</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Distance</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tripReports && tripReports.length > 0 ? (
                  tripReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className='font-medium'>
                        {report.id.slice(0, 8)}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className='font-medium'>{report.customer_name}</p>
                          <p className='text-sm text-muted-foreground'>
                            {report.booking_ref}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{report.package_name}</TableCell>
                      <TableCell>
                        {new Date(report.completion_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{report.total_distance} km</TableCell>
                      <TableCell>
                        {report.customer_rating ? (
                          <div className='flex items-center gap-1'>
                            {renderStars(report.customer_rating)}
                            <span className='ml-1 text-sm'>
                              ({report.customer_rating})
                            </span>
                          </div>
                        ) : (
                          <span className='text-sm text-muted-foreground'>
                            N/A
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor("completed")}>
                          <CheckCircle className='h-3 w-3 mr-1' />
                          completed
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className='flex gap-1'>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant='outline' size='sm'>
                                <Eye className='h-3 w-3 mr-1' />
                                View
                              </Button>
                            </DialogTrigger>
                            <DialogContent className='max-w-4xl'>
                              <DialogHeader>
                                <DialogTitle>
                                  Trip Report - {report.id.slice(0, 8)}
                                </DialogTitle>
                                <DialogDescription>
                                  Detailed report for {report.booking_ref}
                                </DialogDescription>
                              </DialogHeader>
                              <div className='grid gap-6'>
                                <div className='grid grid-cols-2 gap-4'>
                                  <div className='space-y-4'>
                                    <div>
                                      <h3 className='font-medium mb-2'>
                                        Trip Details
                                      </h3>
                                      <div className='space-y-2 text-sm'>
                                        <p>
                                          <strong>Customer:</strong>{" "}
                                          {report.customer_name}
                                        </p>
                                        <p>
                                          <strong>Package:</strong>{" "}
                                          {report.package_name}
                                        </p>
                                        <p>
                                          <strong>Duration:</strong>{" "}
                                          {report.duration_days} days
                                        </p>
                                        <p>
                                          <strong>Completion:</strong>{" "}
                                          {new Date(
                                            report.completion_date
                                          ).toLocaleDateString()}
                                        </p>
                                      </div>
                                    </div>
                                    <div>
                                      <h3 className='font-medium mb-2'>
                                        Performance
                                      </h3>
                                      <div className='space-y-2 text-sm'>
                                        <p>
                                          <strong>Distance:</strong>{" "}
                                          {report.total_distance} km
                                        </p>
                                        <p>
                                          <strong>Fuel:</strong>{" "}
                                          {report.fuel_used} L
                                        </p>
                                        <p>
                                          <strong>Rating:</strong>{" "}
                                          {report.customer_rating || "N/A"}/5
                                        </p>
                                        <p>
                                          <strong>Condition:</strong>
                                          <span
                                            className={getConditionColor(
                                              report.vehicle_condition || "good"
                                            )}>
                                            {" " +
                                              (report.vehicle_condition ||
                                                "good")}
                                          </span>
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className='space-y-4'>
                                    {report.highlights &&
                                      report.highlights.length > 0 && (
                                        <div>
                                          <h3 className='font-medium mb-2'>
                                            Highlights
                                          </h3>
                                          <ul className='text-sm space-y-1'>
                                            {report.highlights.map(
                                              (highlight, idx) => (
                                                <li
                                                  key={idx}
                                                  className='flex items-start'>
                                                  <CheckCircle className='h-3 w-3 text-green-500 mt-0.5 mr-2 flex-shrink-0' />
                                                  {highlight}
                                                </li>
                                              )
                                            )}
                                          </ul>
                                        </div>
                                      )}
                                    {report.issues &&
                                      report.issues.length > 0 && (
                                        <div>
                                          <h3 className='font-medium mb-2'>
                                            Issues
                                          </h3>
                                          <ul className='text-sm space-y-1'>
                                            {report.issues.map((issue, idx) => (
                                              <li
                                                key={idx}
                                                className='flex items-start'>
                                                <AlertTriangle className='h-3 w-3 text-yellow-500 mt-0.5 mr-2 flex-shrink-0' />
                                                {issue}
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}
                                  </div>
                                </div>
                                {report.notes && (
                                  <div>
                                    <h3 className='font-medium mb-2'>Notes</h3>
                                    <p className='text-sm text-muted-foreground'>
                                      {report.notes}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button variant='outline' size='sm'>
                            <Download className='h-3 w-3 mr-1' />
                            PDF
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className='text-center text-muted-foreground py-8'>
                      No trip reports found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value='analytics' className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
                <CardDescription>
                  Your monthly performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <div className='space-y-2'>
                    <div className='flex justify-between text-sm'>
                      <span>Customer Satisfaction</span>
                      <span>{monthlyStats?.averageRating || 0}/5</span>
                    </div>
                    <div className='w-full bg-gray-200 rounded-full h-2'>
                      <div
                        className='bg-green-500 h-2 rounded-full'
                        style={{
                          width: `${
                            ((monthlyStats?.averageRating || 0) / 5) * 100
                          }%`,
                        }}></div>
                    </div>
                  </div>
                  <div className='space-y-2'>
                    <div className='flex justify-between text-sm'>
                      <span>On-Time Performance</span>
                      <span>{monthlyStats?.onTimePerformance || "0%"}</span>
                    </div>
                    <div className='w-full bg-gray-200 rounded-full h-2'>
                      <div
                        className='bg-blue-500 h-2 rounded-full'
                        style={{
                          width: monthlyStats?.onTimePerformance || "0%",
                        }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Achievements</CardTitle>
                <CardDescription>
                  Your accomplishments this month
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  {monthlyStats && monthlyStats.averageRating >= 4 && (
                    <div className='flex items-center space-x-3'>
                      <div className='w-8 h-8 bg-green-100 rounded-full flex items-center justify-center'>
                        <Star className='h-4 w-4 text-green-600' />
                      </div>
                      <div>
                        <p className='font-medium text-sm'>High Ratings</p>
                        <p className='text-xs text-muted-foreground'>
                          Average {monthlyStats.averageRating}+ stars
                        </p>
                      </div>
                    </div>
                  )}
                  {monthlyStats &&
                    parseFloat(monthlyStats.onTimePerformance) >= 95 && (
                      <div className='flex items-center space-x-3'>
                        <div className='w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center'>
                          <Clock className='h-4 w-4 text-blue-600' />
                        </div>
                        <div>
                          <p className='font-medium text-sm'>
                            Punctuality Award
                          </p>
                          <p className='text-xs text-muted-foreground'>
                            {monthlyStats.onTimePerformance} on-time
                          </p>
                        </div>
                      </div>
                    )}
                  {monthlyStats && monthlyStats.totalTrips >= 10 && (
                    <div className='flex items-center space-x-3'>
                      <div className='w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center'>
                        <Fuel className='h-4 w-4 text-yellow-600' />
                      </div>
                      <div>
                        <p className='font-medium text-sm'>Active Driver</p>
                        <p className='text-xs text-muted-foreground'>
                          {monthlyStats.totalTrips} trips completed
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TripReports;
