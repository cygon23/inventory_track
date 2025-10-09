import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CalendarIcon,
  Search,
  Download,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Users,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import AttendanceForm from "../AttendanceForm";
import {
  useAttendanceByDate,
  useAttendanceStats,
  useMyAttendance,
} from "../../features/driver/hooks/useAttendance";
import { getDepartmentFromRole } from "../../features/driver/api/attendance.service";

const AttendanceManagement: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  if (!currentUser) {
    return (
      <div className='flex items-center justify-center h-64'>
        <Loader2 className='h-8 w-8 animate-spin text-primary' />
      </div>
    );
  }

  const dateString = format(selectedDate, "yyyy-MM-dd");
  const isAdmin =
    currentUser?.role === "admin";
  const today = format(new Date(), "yyyy-MM-dd");
  const isToday = dateString === today;

  // Fetch real data
  const { data: myAttendance, isLoading: myAttendanceLoading } =
    useMyAttendance(currentUser.id, dateString);
  const {
    data: attendanceRecords,
    isLoading: recordsLoading,
    error: recordsError,
  } = useAttendanceByDate(
    dateString,
    isAdmin
      ? {
          search: searchTerm || undefined,
          department: departmentFilter !== "all" ? departmentFilter : undefined,
          status: statusFilter !== "all" ? statusFilter : undefined,
        }
      : undefined
  );
  const { data: stats, isLoading: statsLoading } =
    useAttendanceStats(dateString);

  // Transform data
  const attendanceData = isAdmin
    ? attendanceRecords?.map((record) => ({
        id: record.id,
        name: record.user?.name || "Unknown",
        role: record.user?.role || "N/A",
        department: getDepartmentFromRole(record.user?.role),
        checkIn: record.check_in,
        checkOut: record.check_out,
        status: record.status,
        hoursWorked: record.hours_worked,
        overtime: record.overtime,
        location: record.location || "N/A",
        notes: record.notes || "",
      })) || []
    : myAttendance
    ? [
        {
          id: myAttendance.id,
          name: currentUser?.name || "You",
          role: currentUser?.role || "N/A",
          department: getDepartmentFromRole(currentUser?.role),
          checkIn: myAttendance.check_in,
          checkOut: myAttendance.check_out,
          status: myAttendance.status,
          hoursWorked: myAttendance.hours_worked,
          overtime: myAttendance.overtime,
          location: myAttendance.location || "N/A",
          notes: myAttendance.notes || "",
        },
      ]
    : [];

  const statsDisplay = [
    {
      title: isAdmin ? "Total Employees" : "Status",
      value: isAdmin
        ? stats?.totalEmployees.toString() || "0"
        : myAttendance?.status
        ? myAttendance.status.toUpperCase()
        : "NOT SUBMITTED",
      change: isAdmin ? "Active today" : "Today",
      icon: Users,
      color: "text-primary",
    },
    {
      title: isAdmin ? "Present" : "Check In",
      value: isAdmin
        ? stats?.present.toString() || "0"
        : myAttendance?.check_in || "--:--",
      change: isAdmin ? `${stats?.attendanceRate || 0}% attendance` : "Time",
      icon: CheckCircle,
      color: "text-success",
    },
    {
      title: isAdmin ? "Late Arrivals" : "Check Out",
      value: isAdmin
        ? stats?.late.toString() || "0"
        : myAttendance?.check_out || "--:--",
      change: isAdmin ? `${stats?.late || 0} employees` : "Time",
      icon: Clock,
      color: "text-warning",
    },
    {
      title: isAdmin ? "Absent" : "Hours Worked",
      value: isAdmin
        ? stats?.absent.toString() || "0"
        : myAttendance?.hours_worked?.toString() || "0",
      change: isAdmin
        ? `${100 - (stats?.attendanceRate || 0)}% absence`
        : "Total",
      icon: XCircle,
      color: "text-destructive",
    },
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      present: "bg-success/10 text-success border-success/20",
      late: "bg-warning/10 text-warning border-warning/20",
      absent: "bg-destructive/10 text-destructive border-destructive/20",
      working: "bg-primary/10 text-primary border-primary/20",
      halfday: "bg-secondary/10 text-secondary border-secondary/20",
    };
    return (
      colors[status as keyof typeof colors] ||
      "bg-muted/10 text-muted-foreground border-muted/20"
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "present":
        return <CheckCircle className='h-4 w-4' />;
      case "late":
        return <Clock className='h-4 w-4' />;
      case "absent":
        return <XCircle className='h-4 w-4' />;
      case "working":
        return <AlertCircle className='h-4 w-4' />;
      default:
        return <Clock className='h-4 w-4' />;
    }
  };

  const formatStatus = (status: string) => {
    const statusMap = {
      present: "Present",
      late: "Late",
      absent: "Absent",
      working: "Working",
      halfday: "Half Day",
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const getInitials = (name: string) => {
    return (
      name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase() || "??"
    );
  };

  const filteredAttendance = attendanceData.filter((record) => {
    const matchesSearch =
      record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.role.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment =
      departmentFilter === "all" ||
      record.department.toLowerCase() === departmentFilter.toLowerCase();
    const matchesStatus =
      statusFilter === "all" || record.status === statusFilter;

    return matchesSearch && matchesDepartment && matchesStatus;
  });

  if (recordsLoading || statsLoading || myAttendanceLoading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <Loader2 className='h-8 w-8 animate-spin text-primary' />
      </div>
    );
  }

  if (recordsError) {
    return (
      <Alert variant='destructive'>
        <AlertCircle className='h-4 w-4' />
        <AlertDescription>
          Failed to load attendance data. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0'>
        <div>
          <h1 className='text-2xl md:text-3xl font-bold text-foreground'>
            {isAdmin ? "Attendance Management" : "My Attendance"}
          </h1>
          <p className='text-muted-foreground'>
            {isAdmin
              ? "Track employee attendance and working hours"
              : "Submit and view your attendance"}
          </p>
        </div>
        <div className='flex space-x-2'>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                className={cn(
                  "justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground"
                )}>
                <CalendarIcon className='mr-2 h-4 w-4' />
                {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0 bg-popover' align='start'>
              <Calendar
                mode='single'
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {isAdmin && (
            <Button>
              <Download className='h-4 w-4 mr-2' />
              Export
            </Button>
          )}
        </div>
      </div>

      {/* Attendance Form - Only for non-admins on today's date */}
      {!isAdmin && isToday && (
        <AttendanceForm
          userId={currentUser.id}
          userName={currentUser.name}
          userRole={currentUser.role}
        />
      )}

      {/* Stats */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6'>
        {statsDisplay.map((stat, index) => {
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

      {/* Filters - Only for admins */}
      {isAdmin && (
        <Card className='safari-card'>
          <CardContent className='p-4 md:p-6'>
            <div className='flex flex-col sm:flex-row gap-4'>
              <div className='relative flex-1'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                <Input
                  placeholder='Search employees by name, role, or ID...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='pl-10'
                />
              </div>
              <div className='flex space-x-2'>
                <Select
                  value={departmentFilter}
                  onValueChange={setDepartmentFilter}>
                  <SelectTrigger className='w-40'>
                    <SelectValue placeholder='Department' />
                  </SelectTrigger>
                  <SelectContent className='bg-popover'>
                    <SelectItem value='all'>All Departments</SelectItem>
                    <SelectItem value='management'>Management</SelectItem>
                    <SelectItem value='operations'>Operations</SelectItem>
                    <SelectItem value='booking'>Booking</SelectItem>
                    <SelectItem value='finance'>Finance</SelectItem>
                    <SelectItem value='support'>Support</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className='w-32'>
                    <SelectValue placeholder='Status' />
                  </SelectTrigger>
                  <SelectContent className='bg-popover'>
                    <SelectItem value='all'>All Status</SelectItem>
                    <SelectItem value='present'>Present</SelectItem>
                    <SelectItem value='late'>Late</SelectItem>
                    <SelectItem value='absent'>Absent</SelectItem>
                    <SelectItem value='working'>Working</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Attendance Table */}
      <Card className='safari-card'>
        <CardHeader>
          <CardTitle>
            {isAdmin
              ? `Daily Attendance - ${format(selectedDate, "MMMM d, yyyy")}`
              : "My Attendance Record"}
          </CardTitle>
          <CardDescription>
            {isAdmin
              ? "Real-time attendance tracking and employee status"
              : "Your attendance details"}
          </CardDescription>
        </CardHeader>
        <CardContent className='p-0'>
          <div className='overflow-x-auto'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  {isAdmin && (
                    <TableHead className='hidden md:table-cell'>
                      Department
                    </TableHead>
                  )}
                  <TableHead>Status</TableHead>
                  <TableHead className='hidden sm:table-cell'>
                    Check In
                  </TableHead>
                  <TableHead className='hidden sm:table-cell'>
                    Check Out
                  </TableHead>
                  <TableHead className='hidden lg:table-cell'>
                    Hours Worked
                  </TableHead>
                  <TableHead className='hidden lg:table-cell'>
                    Location
                  </TableHead>
                  <TableHead className='hidden xl:table-cell'>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAttendance.length > 0 ? (
                  filteredAttendance.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        <div className='flex items-center space-x-3'>
                          <Avatar className='h-10 w-10'>
                            <AvatarFallback>
                              {getInitials(record.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className='font-medium'>{record.name}</p>
                            <p className='text-sm text-muted-foreground'>
                              {record.role}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      {isAdmin && (
                        <TableCell className='hidden md:table-cell'>
                          <Badge variant='outline'>{record.department}</Badge>
                        </TableCell>
                      )}
                      <TableCell>
                        <Badge className={getStatusColor(record.status)}>
                          <div className='flex items-center space-x-1'>
                            {getStatusIcon(record.status)}
                            <span>{formatStatus(record.status)}</span>
                          </div>
                        </Badge>
                      </TableCell>
                      <TableCell className='hidden sm:table-cell'>
                        <span
                          className={
                            record.checkIn
                              ? "font-mono"
                              : "text-muted-foreground"
                          }>
                          {record.checkIn || "--:--"}
                        </span>
                      </TableCell>
                      <TableCell className='hidden sm:table-cell'>
                        <span
                          className={
                            record.checkOut
                              ? "font-mono"
                              : "text-muted-foreground"
                          }>
                          {record.checkOut || "--:--"}
                        </span>
                      </TableCell>
                      <TableCell className='hidden lg:table-cell'>
                        <div className='text-sm'>
                          <p className='font-medium'>{record.hoursWorked}h</p>
                          {record.overtime > 0 && (
                            <p className='text-xs text-warning'>
                              +{record.overtime}h OT
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className='hidden lg:table-cell'>
                        <span className='text-sm'>{record.location}</span>
                      </TableCell>
                      <TableCell className='hidden xl:table-cell'>
                        <span className='text-sm text-muted-foreground'>
                          {record.notes || "No notes"}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className='text-center text-muted-foreground py-8'>
                      {!isAdmin && !myAttendance
                        ? "No attendance submitted for this date. Please submit your attendance using the form above."
                        : "No attendance records found for this date"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceManagement;
