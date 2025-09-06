import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Search, Plus, Edit, Trash2, Users, UserCheck, Clock, Shield, Key, Mail } from 'lucide-react';
import { User } from '@/data/mockUsers';

interface UserManagementProps {
  currentUser: User;
}

const UserManagement: React.FC<UserManagementProps> = ({ currentUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const users = [
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@safari.com',
      role: 'operations_coordinator',
      status: 'active',
      lastLogin: '2024-01-08 09:30',
      createdAt: '2023-01-15',
      avatar: '',
      phone: '+254 701 234 567',
      permissions: ['trip_management', 'driver_assignment', 'vehicle_management'],
      twoFactorEnabled: true
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@safari.com',
      role: 'booking_manager',
      status: 'active',
      lastLogin: '2024-01-08 10:15',
      createdAt: '2022-11-20',
      avatar: '',
      phone: '+254 701 234 568',
      permissions: ['booking_management', 'customer_management', 'pricing'],
      twoFactorEnabled: false
    },
    {
      id: '3',
      name: 'Michael Brown',
      email: 'michael.brown@safari.com',
      role: 'finance_officer',
      status: 'inactive',
      lastLogin: '2024-01-05 16:45',
      createdAt: '2023-03-10',
      avatar: '',
      phone: '+254 701 234 569',
      permissions: ['payment_management', 'invoice_management', 'financial_reports'],
      twoFactorEnabled: true
    },
    {
      id: '4',
      name: 'Emily Davis',
      email: 'emily.davis@safari.com',
      role: 'customer_service',
      status: 'active',
      lastLogin: '2024-01-08 11:20',
      createdAt: '2023-07-12',
      avatar: '',
      phone: '+254 701 234 571',
      permissions: ['support_tickets', 'faq_management', 'customer_communication'],
      twoFactorEnabled: false
    },
    {
      id: '5',
      name: 'David Wilson',
      email: 'david.wilson@safari.com',
      role: 'driver',
      status: 'active',
      lastLogin: '2024-01-08 07:00',
      createdAt: '2023-06-05',
      avatar: '',
      phone: '+254 701 234 570',
      permissions: ['trip_reports', 'vehicle_status'],
      twoFactorEnabled: false
    }
  ];

  const rolePermissions = {
    super_admin: ['all_permissions'],
    admin: ['user_management', 'system_settings', 'reports', 'staff_management'],
    operations_coordinator: ['trip_management', 'driver_assignment', 'vehicle_management'],
    booking_manager: ['booking_management', 'customer_management', 'pricing'],
    finance_officer: ['payment_management', 'invoice_management', 'financial_reports'],
    customer_service: ['support_tickets', 'faq_management', 'customer_communication'],
    driver: ['trip_reports', 'vehicle_status']
  };

  const allPermissions = [
    'user_management', 'system_settings', 'reports', 'staff_management',
    'trip_management', 'driver_assignment', 'vehicle_management',
    'booking_management', 'customer_management', 'pricing',
    'payment_management', 'invoice_management', 'financial_reports',
    'support_tickets', 'faq_management', 'customer_communication',
    'trip_reports', 'vehicle_status'
  ];

  const roles = ['All', 'Super Admin', 'Admin', 'Operations Coordinator', 'Booking Manager', 'Finance Officer', 'Customer Service', 'Driver'];

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedRole === 'all' || user.role.replace('_', ' ').toLowerCase() === selectedRole.toLowerCase())
  );

  const stats = [
    { title: 'Total Users', value: '28', icon: Users, color: 'text-blue-600' },
    { title: 'Active Users', value: '25', icon: UserCheck, color: 'text-green-600' },
    { title: 'Pending Approval', value: '3', icon: Clock, color: 'text-orange-600' },
    { title: '2FA Enabled', value: '15', icon: Shield, color: 'text-purple-600' }
  ];

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleBulkAction = (action: string) => {
    console.log(`Performing ${action} on users:`, selectedUsers);
    setSelectedUsers([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage user accounts, roles, and permissions</p>
        </div>
        <div className="flex space-x-2">
          {selectedUsers.length > 0 && (
            <Select onValueChange={handleBulkAction}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Bulk Actions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="activate">Activate Users</SelectItem>
                <SelectItem value="deactivate">Deactivate Users</SelectItem>
                <SelectItem value="delete">Delete Users</SelectItem>
                <SelectItem value="reset-password">Reset Passwords</SelectItem>
              </SelectContent>
            </Select>
          )}
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="Enter full name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Enter email address" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" placeholder="Enter phone number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.slice(1).map(role => (
                        <SelectItem key={role} value={role.toLowerCase().replace(' ', '_')}>{role}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>Permissions</Label>
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded p-3">
                    {allPermissions.map(permission => (
                      <div key={permission} className="flex items-center space-x-2">
                        <Checkbox id={permission} />
                        <Label htmlFor={permission} className="text-sm">
                          {permission.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="col-span-2 flex items-center space-x-2">
                  <Checkbox id="send-welcome" />
                  <Label htmlFor="send-welcome">Send welcome email with login credentials</Label>
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <Button variant="outline">Cancel</Button>
                <Button>Create User</Button>
              </div>
            </DialogContent>
          </Dialog>
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
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList>
          <TabsTrigger value="users">All Users</TabsTrigger>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
          <TabsTrigger value="activity">User Activity</TabsTrigger>
          <TabsTrigger value="security">Security Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Accounts</CardTitle>
              <div className="flex space-x-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    {roles.slice(1).map(role => (
                      <SelectItem key={role} value={role.toLowerCase()}>{role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox 
                        checked={selectedUsers.length === filteredUsers.length}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedUsers(filteredUsers.map(user => user.id));
                          } else {
                            setSelectedUsers([]);
                          }
                        }}
                      />
                    </TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>2FA</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <Checkbox 
                          checked={selectedUsers.includes(user.id)}
                          onCheckedChange={() => handleSelectUser(user.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {user.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.twoFactorEnabled ? (
                          <Shield className="w-4 h-4 text-green-600" />
                        ) : (
                          <Shield className="w-4 h-4 text-gray-400" />
                        )}
                      </TableCell>
                      <TableCell>{user.lastLogin}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Key className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Mail className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Role Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(rolePermissions).map(([role, permissions]) => (
                  <Card key={role}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">
                            {role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Manage permissions for {role.replace('_', ' ')} role
                          </p>
                        </div>
                        <Button variant="outline" size="sm">Edit Permissions</Button>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                        {permissions.map(permission => (
                          <Badge key={permission} variant="secondary" className="justify-center">
                            {permission === 'all_permissions' ? 'All Permissions' : 
                             permission.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Activity Log</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { user: 'John Smith', action: 'Logged in', timestamp: '2024-01-08 10:30', ip: '192.168.1.100' },
                  { user: 'Sarah Johnson', action: 'Created booking', timestamp: '2024-01-08 10:15', ip: '192.168.1.101' },
                  { user: 'Michael Brown', action: 'Updated payment status', timestamp: '2024-01-08 09:45', ip: '192.168.1.102' },
                  { user: 'Emily Davis', action: 'Responded to ticket', timestamp: '2024-01-08 09:30', ip: '192.168.1.103' },
                  { user: 'David Wilson', action: 'Submitted trip report', timestamp: '2024-01-08 08:00', ip: '192.168.1.104' },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="text-xs">{activity.user.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{activity.user}</p>
                        <p className="text-sm text-muted-foreground">{activity.action}</p>
                      </div>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <p>{activity.timestamp}</p>
                      <p>{activity.ip}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Policies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enforce 2FA for Admins</Label>
                    <p className="text-sm text-muted-foreground">Require two-factor authentication</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Password Complexity</Label>
                    <p className="text-sm text-muted-foreground">Enforce strong passwords</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Session Timeout</Label>
                    <p className="text-sm text-muted-foreground">Auto-logout inactive users</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="space-y-2">
                  <Label>Password Expiry (days)</Label>
                  <Input type="number" defaultValue="90" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Login Attempts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { email: 'john.smith@safari.com', attempts: 1, status: 'success', time: '10:30' },
                    { email: 'attacker@suspicious.com', attempts: 5, status: 'blocked', time: '10:15' },
                    { email: 'sarah.johnson@safari.com', attempts: 1, status: 'success', time: '09:45' },
                    { email: 'unknown@hacker.com', attempts: 3, status: 'failed', time: '08:30' },
                  ].map((attempt, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <p className="text-sm font-medium">{attempt.email}</p>
                        <p className="text-xs text-muted-foreground">{attempt.attempts} attempts</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={
                          attempt.status === 'success' ? 'default' :
                          attempt.status === 'blocked' ? 'destructive' : 'secondary'
                        }>
                          {attempt.status}
                        </Badge>
                        <p className="text-xs text-muted-foreground">{attempt.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserManagement;