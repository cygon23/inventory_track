import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  CalendarIcon,
  Search, 
  Download, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Users,
  Calendar as CalendarClock,
  TrendingUp,
  Filter
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { User } from '@/data/mockUsers';

interface AttendanceManagementProps {
  currentUser: User;
}

const AttendanceManagement: React.FC<AttendanceManagementProps> = ({ currentUser }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock attendance data
  const attendanceData = [
    {
      id: 'E001',
      name: 'John Smith',
      role: 'Senior Guide',
      department: 'Operations',
      checkIn: '08:00',
      checkOut: '17:30',
      status: 'present',
      hoursWorked: 9.5,
      overtime: 1.5,
      location: 'Serengeti Camp',
      notes: ''
    },
    {
      id: 'E002',
      name: 'Sarah Johnson',
      role: 'Booking Manager',
      department: 'Booking',
      checkIn: '09:15',
      checkOut: '18:00',
      status: 'late',
      hoursWorked: 8.75,
      overtime: 0.75,
      location: 'Head Office',
      notes: 'Traffic delay'
    },
    {
      id: 'E003',
      name: 'Michael Brown',
      role: 'Driver',
      department: 'Operations',
      checkIn: '07:45',
      checkOut: '16:15',
      status: 'present',
      hoursWorked: 8.5,
      overtime: 0,
      location: 'Ngorongoro',
      notes: ''
    },
    {
      id: 'E004',
      name: 'Emma Wilson',
      role: 'Finance Officer',
      department: 'Finance',
      checkIn: null,
      checkOut: null,
      status: 'absent',
      hoursWorked: 0,
      overtime: 0,
      location: 'N/A',
      notes: 'Sick leave approved'
    },
    {
      id: 'E005',
      name: 'Carlos Rodriguez',
      role: 'Customer Service',
      department: 'Support',
      checkIn: '08:30',
      checkOut: '17:00',
      status: 'present',
      hoursWorked: 8.5,
      overtime: 0,
      location: 'Head Office',
      notes: ''
    },
    {
      id: 'E006',
      name: 'Lisa Thompson',
      role: 'Operations Coordinator',
      department: 'Operations',
      checkIn: '08:00',
      checkOut: null,
      status: 'working',
      hoursWorked: 0,
      overtime: 0,
      location: 'Tarangire',
      notes: 'On field duty'
    }
  ];

  const stats = [
    {
      title: 'Total Employees',
      value: '45',
      change: 'Active today',
      icon: Users,
      color: 'text-primary'
    },
    {
      title: 'Present',
      value: '38',
      change: '84% attendance',
      icon: CheckCircle,
      color: 'text-success'
    },
    {
      title: 'Late Arrivals',
      value: '3',
      change: '7% of present',
      icon: Clock,
      color: 'text-warning'
    },
    {
      title: 'Absent',
      value: '4',
      change: '9% absence rate',
      icon: XCircle,
      color: 'text-destructive'
    }
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      present: 'bg-success/10 text-success border-success/20',
      late: 'bg-warning/10 text-warning border-warning/20',
      absent: 'bg-destructive/10 text-destructive border-destructive/20',
      working: 'bg-primary/10 text-primary border-primary/20',
      halfday: 'bg-secondary/10 text-secondary border-secondary/20'
    };
    return colors[status as keyof typeof colors] || 'bg-muted/10 text-muted-foreground border-muted/20';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="h-4 w-4" />;
      case 'late':
        return <Clock className="h-4 w-4" />;
      case 'absent':
        return <XCircle className="h-4 w-4" />;
      case 'working':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const formatStatus = (status: string) => {
    const statusMap = {
      present: 'Present',
      late: 'Late',
      absent: 'Absent',
      working: 'Working',
      halfday: 'Half Day'
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const filteredAttendance = attendanceData.filter(record => {
    const matchesSearch = record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = departmentFilter === 'all' || record.department.toLowerCase() === departmentFilter.toLowerCase();
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Attendance Management</h1>
          <p className="text-muted-foreground">Track employee attendance and working hours</p>
        </div>
        <div className="flex space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className={cn(
                "justify-start text-left font-normal",
                !selectedDate && "text-muted-foreground"
              )}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-popover" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="safari-card">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-xl md:text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.change}</p>
                  </div>
                  <Icon className={`h-6 w-6 md:h-8 md:w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <Card className="safari-card">
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search employees by name, role, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex space-x-2">
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="operations">Operations</SelectItem>
                  <SelectItem value="booking">Booking</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="support">Support</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="present">Present</SelectItem>
                  <SelectItem value="late">Late</SelectItem>
                  <SelectItem value="absent">Absent</SelectItem>
                  <SelectItem value="working">Working</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Table */}
      <Card className="safari-card">
        <CardHeader>
          <CardTitle>Daily Attendance - {format(selectedDate, 'MMMM d, yyyy')}</CardTitle>
          <CardDescription>Real-time attendance tracking and employee status</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead className="hidden md:table-cell">Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden sm:table-cell">Check In</TableHead>
                  <TableHead className="hidden sm:table-cell">Check Out</TableHead>
                  <TableHead className="hidden lg:table-cell">Hours Worked</TableHead>
                  <TableHead className="hidden lg:table-cell">Location</TableHead>
                  <TableHead className="hidden xl:table-cell">Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAttendance.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>{getInitials(record.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{record.name}</p>
                          <p className="text-sm text-muted-foreground">{record.role}</p>
                          <p className="text-xs text-muted-foreground">ID: {record.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="outline">{record.department}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(record.status)}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(record.status)}
                          <span>{formatStatus(record.status)}</span>
                        </div>
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <span className={record.checkIn ? 'font-mono' : 'text-muted-foreground'}>
                        {record.checkIn || '--:--'}
                      </span>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <span className={record.checkOut ? 'font-mono' : 'text-muted-foreground'}>
                        {record.checkOut || '--:--'}
                      </span>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="text-sm">
                        <p className="font-medium">{record.hoursWorked}h</p>
                        {record.overtime > 0 && (
                          <p className="text-xs text-warning">+{record.overtime}h OT</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <span className="text-sm">{record.location}</span>
                    </TableCell>
                    <TableCell className="hidden xl:table-cell">
                      <span className="text-sm text-muted-foreground">
                        {record.notes || 'No notes'}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="safari-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <CalendarClock className="h-5 w-5 mr-2 text-primary" />
              Schedule Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Manage employee schedules and shifts
            </p>
            <Button variant="outline" size="sm" className="w-full">
              View Schedules
            </Button>
          </CardContent>
        </Card>

        <Card className="safari-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-success" />
              Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Generate attendance and productivity reports
            </p>
            <Button variant="outline" size="sm" className="w-full">
              Generate Report
            </Button>
          </CardContent>
        </Card>

        <Card className="safari-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-warning" />
              Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Configure attendance alerts and notifications
            </p>
            <Button variant="outline" size="sm" className="w-full">
              Manage Alerts
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AttendanceManagement;