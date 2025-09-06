import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Search, 
  Calendar as CalendarIcon, 
  Download, 
  Filter, 
  Eye, 
  AlertTriangle, 
  Shield, 
  Activity, 
  Database, 
  Globe,
  User,
  FileText,
  Clock,
  MapPin,
  Smartphone,
  Monitor
} from 'lucide-react';
import { format } from 'date-fns';
import { User as UserType } from '@/data/mockUsers';

interface ForensicMonitoringProps {
  currentUser: UserType;
}

const ForensicMonitoring: React.FC<ForensicMonitoringProps> = ({ currentUser }) => {
  const [dateRange, setDateRange] = useState<Date | undefined>(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSeverity, setSelectedSeverity] = useState('all');

  const systemEvents = [
    {
      id: '1',
      timestamp: '2024-01-08 10:30:45',
      category: 'authentication',
      event: 'Successful login',
      user: 'john.smith@safari.com',
      ipAddress: '192.168.1.100',
      userAgent: 'Chrome 120.0.0.0 / Windows 10',
      severity: 'info',
      details: 'User logged in successfully',
      location: 'Nairobi, Kenya',
      sessionId: 'sess_abc123'
    },
    {
      id: '2',
      timestamp: '2024-01-08 10:15:22',
      category: 'data_access',
      event: 'Customer data viewed',
      user: 'sarah.johnson@safari.com',
      ipAddress: '192.168.1.101',
      userAgent: 'Firefox 121.0.0.0 / macOS',
      severity: 'medium',
      details: 'Viewed customer profile: ID 1234',
      location: 'Mombasa, Kenya',
      sessionId: 'sess_def456'
    },
    {
      id: '3',
      timestamp: '2024-01-08 09:45:18',
      category: 'security',
      event: 'Failed login attempt',
      user: 'attacker@suspicious.com',
      ipAddress: '185.220.101.45',
      userAgent: 'curl/7.68.0',
      severity: 'high',
      details: 'Multiple failed login attempts detected',
      location: 'Unknown',
      sessionId: null
    },
    {
      id: '4',
      timestamp: '2024-01-08 09:30:12',
      category: 'data_modification',
      event: 'Booking status updated',
      user: 'michael.brown@safari.com',
      ipAddress: '192.168.1.102',
      userAgent: 'Chrome 120.0.0.0 / Ubuntu',
      severity: 'medium',
      details: 'Changed booking B001 status from pending to confirmed',
      location: 'Kisumu, Kenya',
      sessionId: 'sess_ghi789'
    },
    {
      id: '5',
      timestamp: '2024-01-08 08:15:33',
      category: 'system',
      event: 'Database backup completed',
      user: 'system',
      ipAddress: 'localhost',
      userAgent: 'Automated Process',
      severity: 'info',
      details: 'Daily backup completed successfully - 2.3GB',
      location: 'Server',
      sessionId: null
    }
  ];

  const securityAlerts = [
    {
      id: '1',
      type: 'Suspicious Login',
      severity: 'high',
      timestamp: '2024-01-08 09:45:18',
      description: 'Multiple failed login attempts from suspicious IP',
      ipAddress: '185.220.101.45',
      status: 'active',
      actionTaken: 'IP blocked automatically'
    },
    {
      id: '2',
      type: 'Unusual Data Access',
      severity: 'medium',
      timestamp: '2024-01-08 08:30:22',
      description: 'Bulk customer data access outside normal hours',
      ipAddress: '192.168.1.105',
      status: 'investigating',
      actionTaken: 'User notified, session monitored'
    },
    {
      id: '3',
      type: 'Permission Escalation',
      severity: 'high',
      timestamp: '2024-01-07 22:15:44',
      description: 'Attempt to access admin functions with lower privileges',
      ipAddress: '192.168.1.108',
      status: 'resolved',
      actionTaken: 'Access denied, user account reviewed'
    }
  ];

  const dataAccessLog = [
    {
      id: '1',
      timestamp: '2024-01-08 10:15:22',
      user: 'sarah.johnson@safari.com',
      resource: 'Customer Profile',
      resourceId: 'CUST_1234',
      action: 'VIEW',
      ipAddress: '192.168.1.101',
      success: true
    },
    {
      id: '2',
      timestamp: '2024-01-08 09:30:12',
      user: 'michael.brown@safari.com',
      resource: 'Booking',
      resourceId: 'BOOK_5678',
      action: 'UPDATE',
      ipAddress: '192.168.1.102',
      success: true
    },
    {
      id: '3',
      timestamp: '2024-01-08 08:45:55',
      user: 'emily.davis@safari.com',
      resource: 'Support Ticket',
      resourceId: 'TICK_9999',
      action: 'CREATE',
      ipAddress: '192.168.1.103',
      success: true
    }
  ];

  const categories = ['All', 'Authentication', 'Data Access', 'Data Modification', 'Security', 'System'];
  const severities = ['All', 'Info', 'Medium', 'High', 'Critical'];

  const filteredEvents = systemEvents.filter(event => 
    event.event.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === 'all' || event.category === selectedCategory.toLowerCase().replace(' ', '_')) &&
    (selectedSeverity === 'all' || event.severity === selectedSeverity.toLowerCase())
  );

  const stats = [
    { title: 'Total Events Today', value: '1,247', icon: Activity, color: 'text-blue-600', trend: '+12%' },
    { title: 'Security Alerts', value: '3', icon: Shield, color: 'text-red-600', trend: '-2' },
    { title: 'Active Sessions', value: '24', icon: User, color: 'text-green-600', trend: '+5' },
    { title: 'System Health', value: '98.5%', icon: Database, color: 'text-purple-600', trend: '+0.2%' }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-600 text-white';
      case 'high': return 'bg-red-500 text-white';
      case 'medium': return 'bg-orange-500 text-white';
      case 'info': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Forensic Monitoring</h1>
          <p className="text-muted-foreground">Comprehensive system activity monitoring and security analysis</p>
        </div>
        <div className="flex space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <CalendarIcon className="w-4 h-4 mr-2" />
                {dateRange ? format(dateRange, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dateRange}
                onSelect={setDateRange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-green-600">{stat.trend}</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Security Alerts */}
      {securityAlerts.filter(alert => alert.status === 'active').length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {securityAlerts.filter(alert => alert.status === 'active').length} active security alert(s) require attention.
            <Button variant="link" className="p-0 ml-2 h-auto text-red-600">View Details</Button>
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="events" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="events">System Events</TabsTrigger>
          <TabsTrigger value="security">Security Alerts</TabsTrigger>
          <TabsTrigger value="data-access">Data Access</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Activity Log</CardTitle>
              <div className="flex space-x-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category.toLowerCase()}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Severity" />
                  </SelectTrigger>
                  <SelectContent>
                    {severities.map(severity => (
                      <SelectItem key={severity} value={severity.toLowerCase()}>{severity}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="font-mono text-sm">{event.timestamp}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{event.event}</p>
                          <p className="text-sm text-muted-foreground">{event.details}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{event.user}</p>
                          <p className="text-sm text-muted-foreground">{event.location}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{event.ipAddress}</TableCell>
                      <TableCell>
                        <Badge className={getSeverityColor(event.severity)}>
                          {event.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Alerts & Incidents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {securityAlerts.map((alert) => (
                  <Card key={alert.id} className={`border-l-4 ${
                    alert.severity === 'high' ? 'border-l-red-500' : 
                    alert.severity === 'medium' ? 'border-l-orange-500' : 'border-l-yellow-500'
                  }`}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold">{alert.type}</h3>
                            <Badge className={getSeverityColor(alert.severity)}>
                              {alert.severity}
                            </Badge>
                            <Badge variant={alert.status === 'active' ? 'destructive' : 'outline'}>
                              {alert.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{alert.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {alert.timestamp}
                            </span>
                            <span className="flex items-center">
                              <Globe className="w-4 h-4 mr-1" />
                              {alert.ipAddress}
                            </span>
                          </div>
                          <p className="text-sm font-medium text-green-600">{alert.actionTaken}</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Investigate
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data-access" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Data Access Audit Trail</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Resource</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dataAccessLog.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-sm">{log.timestamp}</TableCell>
                      <TableCell>{log.user}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{log.resource}</p>
                          <p className="text-sm text-muted-foreground">{log.resourceId}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{log.action}</Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{log.ipAddress}</TableCell>
                      <TableCell>
                        <Badge variant={log.success ? 'default' : 'destructive'}>
                          {log.success ? 'Success' : 'Failed'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Risk Indicators</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { risk: 'Failed Login Attempts', count: 45, percentage: 85 },
                    { risk: 'Unusual Access Patterns', count: 12, percentage: 35 },
                    { risk: 'Privilege Escalation Attempts', count: 3, percentage: 15 },
                    { risk: 'Suspicious IP Addresses', count: 8, percentage: 25 }
                  ].map((risk, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">{risk.risk}</span>
                        <span className="text-sm text-muted-foreground">{risk.count}</span>
                      </div>
                      <Progress value={risk.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Geographic Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { location: 'Nairobi, Kenya', sessions: 18, percentage: 75 },
                    { location: 'Mombasa, Kenya', sessions: 4, percentage: 17 },
                    { location: 'Kisumu, Kenya', sessions: 2, percentage: 8 },
                    { location: 'Unknown/VPN', sessions: 1, percentage: 4 }
                  ].map((location, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{location.location}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{location.sessions}</p>
                        <p className="text-xs text-muted-foreground">{location.percentage}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Device & Browser Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Device Types</h3>
                  <div className="space-y-2">
                    {[
                      { device: 'Desktop', count: 18, icon: Monitor },
                      { device: 'Mobile', count: 6, icon: Smartphone },
                      { device: 'Tablet', count: 2, icon: Smartphone }
                    ].map((device, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <device.icon className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{device.device}</span>
                        </div>
                        <span className="text-sm font-medium">{device.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Browsers</h3>
                  <div className="space-y-2">
                    {[
                      { browser: 'Chrome', count: 15 },
                      { browser: 'Firefox', count: 8 },
                      { browser: 'Safari', count: 3 },
                      { browser: 'Edge', count: 2 }
                    ].map((browser, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm">{browser.browser}</span>
                        <span className="text-sm font-medium">{browser.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Forensic Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: 'Daily Security Summary', description: 'Comprehensive daily security report', icon: FileText },
                  { name: 'User Activity Report', description: 'Detailed user activity analysis', icon: User },
                  { name: 'Incident Response Log', description: 'Security incident documentation', icon: AlertTriangle },
                  { name: 'Compliance Audit Trail', description: 'Regulatory compliance report', icon: Shield },
                  { name: 'Data Access Report', description: 'Data access and modification log', icon: Database },
                  { name: 'Geographic Analysis', description: 'Location-based activity report', icon: MapPin }
                ].map((report, index) => (
                  <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4 text-center">
                      <report.icon className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <h3 className="font-semibold mb-1">{report.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{report.description}</p>
                      <Button variant="outline" size="sm" className="w-full">
                        <Download className="w-4 h-4 mr-2" />
                        Generate
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ForensicMonitoring;