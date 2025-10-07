import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Search, Plus, Edit, Trash2, Users, UserCheck, Clock, AlertTriangle, Loader2, Eye, EyeOff, Save, X } from 'lucide-react';
import { useAuth, useRole } from '@/contexts/AuthContext';
import { supabase, User, UserInsert, UserUpdate } from '@/lib/supabase';
import { toast } from 'sonner';

const StaffManagement: React.FC = () => {
  const { user: currentUser, refreshUser } = useAuth();
  const { isSuperAdmin, isAdmin } = useRole();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [staff, setStaff] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: '',
    assigned_region: '',
    permissions: [] as string[],
    is_active: true
  });

  // Role definitions with permissions
  const roleDefinitions = {
    super_admin: {
      label: 'Super Admin',
      permissions: ['all'],
      description: 'Full system access'
    },
    admin: {
      label: 'Admin',
      permissions: ['dashboard', 'messages', 'customers', 'bookings', 'staff', 'reports', 'forensic', 'attendance'],
      description: 'Business operations management'
    },
    admin_helper: {
      label: 'Admin Helper',
      permissions: ['dashboard', 'messages', 'customers', 'bookings', 'attendance'],
      description: 'Administrative support'
    },
    booking_manager: {
      label: 'Booking Manager',
      permissions: ['dashboard', 'messages', 'customers', 'bookings', 'attendance'],
      description: 'Booking operations management'
    },
    operations_coordinator: {
      label: 'Operations Coordinator',
      permissions: ['dashboard', 'messages', 'trips', 'drivers', 'vehicles', 'attendance'],
      description: 'Trip logistics coordination'
    },
    driver: {
      label: 'Driver/Guide',
      permissions: ['dashboard', 'my_trips', 'reports', 'attendance'],
      description: 'Field operations'
    },
    finance_officer: {
      label: 'Finance Officer',
      permissions: ['dashboard', 'payments', 'invoices', 'reports', 'messages', 'attendance'],
      description: 'Financial management'
    },
    customer_service: {
      label: 'Customer Service',
      permissions: ['dashboard', 'messages', 'support', 'faq', 'attendance'],
      description: 'Customer support'
    }
  };

  const regions = [
    'Arusha', 'Serengeti', 'Ngorongoro', 'Tarangire', 'Lake Manyara', 
    'Kilimanjaro', 'Northern Circuit', 'Southern Circuit'
  ];

  // Check if user has permission to access this component
  if (!isSuperAdmin() && !isAdmin()) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Access Denied</h3>
          <p className="text-muted-foreground">You don't have permission to access staff management.</p>
        </div>
      </div>
    );
  }

  // Fetch staff data
  const fetchStaff = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching staff:', error);
        toast.error('Failed to fetch staff data');
        return;
      }

      setStaff(data || []);
    } catch (error) {
      console.error('Error fetching staff:', error);
      toast.error('Failed to fetch staff data');
    } finally {
      setLoading(false);
    }
  };

  // Create new staff member
  const createStaffMember = async (userData: UserInsert) => {
    try {
      setIsSubmitting(true);
      
      // Preferred: call secured Edge Function (requires deployment)
      const { data: fnData, error: fnError } = await supabase.functions.invoke('create-user', {
        body: {
          name: userData.name,
          email: userData.email,
          phone: userData.phone ?? null,
          role: userData.role,
          assigned_region: userData.assigned_region ?? null,
          permissions: userData.permissions ?? [],
          is_active: userData.is_active ?? true,
          password: (formData as any).password || undefined
        }
      });

      if (!fnError && fnData && (fnData as any).success) {
        toast.success('Staff member created successfully');
        await fetchStaff();
        return { success: true };
      }
      // If function call fails, surface error and do not attempt insecure client admin calls
      const message = (fnError as any)?.message || 'Failed to create user via function';
      console.error('Error creating user via function:', message);
      toast.error('Failed to create staff member');
      return { success: false, error: message };
    } catch (error) {
      console.error('Error creating staff member:', error);
      toast.error('Failed to create staff member');
      return { success: false, error: 'An unexpected error occurred' };
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update staff member
  const updateStaffMember = async (userId: string, updates: UserUpdate) => {
    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId);

      if (error) {
        console.error('Error updating staff member:', error);
        toast.error('Failed to update staff member');
        return { success: false, error: error.message };
      }

      toast.success('Staff member updated successfully');
      await fetchStaff();
      return { success: true };
    } catch (error) {
      console.error('Error updating staff member:', error);
      toast.error('Failed to update staff member');
      return { success: false, error: 'An unexpected error occurred' };
    } finally {
      setIsSubmitting(false);
    }
  };

  // Deactivate staff member
  const deactivateStaffMember = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ is_active: false })
        .eq('id', userId);

      if (error) {
        console.error('Error deactivating staff member:', error);
        toast.error('Failed to deactivate staff member');
        return;
      }

      toast.success('Staff member deactivated successfully');
      await fetchStaff();
    } catch (error) {
      console.error('Error deactivating staff member:', error);
      toast.error('Failed to deactivate staff member');
    }
  };

  // Reactivate staff member
  const reactivateStaffMember = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ is_active: true })
        .eq('id', userId);

      if (error) {
        console.error('Error reactivating staff member:', error);
        toast.error('Failed to reactivate staff member');
        return;
      }

      toast.success('Staff member reactivated successfully');
      await fetchStaff();
    } catch (error) {
      console.error('Error reactivating staff member:', error);
      toast.error('Failed to reactivate staff member');
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.role) {
      toast.error('Please fill in all required fields');
      return;
    }

    const userData: UserInsert = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone || null,
      role: formData.role as any,
      assigned_region: formData.assigned_region || null,
      permissions: formData.permissions,
      is_active: formData.is_active
    };

    if (editingUser) {
      // Update existing user
      const result = await updateStaffMember(editingUser.id, userData);
      if (result.success) {
        setIsEditDialogOpen(false);
        setEditingUser(null);
        resetForm();
      }
    } else {
      // Create new user
      const result = await createStaffMember(userData);
      if (result.success) {
        setIsAddDialogOpen(false);
        resetForm();
      }
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      role: '',
      assigned_region: '',
      permissions: [],
      is_active: true
    });
  };

  // Handle edit user
  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
      assigned_region: user.assigned_region || '',
     permissions: user.permissions || [],
      is_active: user.is_active
    });
    setIsEditDialogOpen(true);
  };

  // Handle permission toggle
  const handlePermissionToggle = (permission: string) => {
    setFormData((prev) => ({
      ...prev,
      permissions: (prev.permissions || []).includes(permission)
        ? (prev.permissions || []).filter((p) => p !== permission)
        : [...(prev.permissions || []), permission],
    }));
  };

  // Filter staff based on search and department
  const filteredStaff = staff.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = selectedDepartment === 'all' || 
                             (member.assigned_region && member.assigned_region.toLowerCase() === selectedDepartment.toLowerCase());
    
    return matchesSearch && matchesDepartment;
  });

  // Load data on component mount
  useEffect(() => {
    fetchStaff();
  }, []);

  // Calculate stats from actual data
  const stats = [
    { 
      title: 'Total Staff', 
      value: staff.length.toString(), 
      icon: Users, 
      color: 'text-blue-600' 
    },
    { 
      title: 'Active Users', 
      value: staff.filter(s => s.is_active).length.toString(), 
      icon: UserCheck, 
      color: 'text-green-600' 
    },
    { 
      title: 'Inactive Users', 
      value: staff.filter(s => !s.is_active).length.toString(), 
      icon: Clock, 
      color: 'text-orange-600' 
    },
    { 
      title: 'Super Admins', 
      value: staff.filter(s => s.role === 'super_admin').length.toString(), 
      icon: AlertTriangle, 
      color: 'text-red-600' 
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading staff data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-3xl font-bold'>Staff Management</h1>
          <p className='text-muted-foreground'>
            Manage staff members, roles, and permissions
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className='w-4 h-4 mr-2' />
              Add Staff Member
            </Button>
          </DialogTrigger>
          <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
            <DialogHeader>
              <DialogTitle>Add New Staff Member</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className='grid grid-cols-2 gap-4 mt-4'>
                <div className='space-y-2'>
                  <Label htmlFor='name'>Full Name *</Label>
                  <Input
                    id='name'
                    placeholder='Enter full name'
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='email'>Email Address *</Label>
                  <Input
                    id='email'
                    type='email'
                    placeholder='Enter email address'
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='password'>Password *</Label>
                  <Input
                    id='password'
                    type='password'
                    placeholder='Enter initial password'
                    value={(formData as any).password}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='phone'>Phone Number</Label>
                  <Input
                    id='phone'
                    placeholder='Enter phone number'
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='role'>Role *</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => {
                      setFormData((prev) => ({
                        ...prev,
                        role: value,
                        permissions:
                          roleDefinitions[value as keyof typeof roleDefinitions]
                            ?.permissions || [],
                      }));
                    }}>
                    <SelectTrigger>
                      <SelectValue placeholder='Select role' />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(roleDefinitions)
                        .filter(
                          ([key]) => isSuperAdmin() || key !== "super_admin"
                        )
                        .map(([key, role]) => (
                          <SelectItem key={key} value={key}>
                            <div className='flex flex-col'>
                              <span className='font-medium'>{role.label}</span>
                              <span className='text-sm text-muted-foreground'>
                                {role.description}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='region'>Assigned Region</Label>
                  <Select
                    value={formData.assigned_region || "none"}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        assigned_region: value === "none" ? "" : value,
                      }))
                    }>
                    <SelectTrigger>
                      <SelectValue placeholder='Select region' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='none'>No specific region</SelectItem>
                      {regions.map((region) => (
                        <SelectItem key={region} value={region}>
                          {region}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className='space-y-2'>
                  <div className='flex items-center space-x-2'>
                    <Checkbox
                      id='is_active'
                      checked={formData.is_active}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({
                          ...prev,
                          is_active: checked as boolean,
                        }))
                      }
                    />
                    <Label htmlFor='is_active'>Active User</Label>
                  </div>
                </div>
              </div>

              <div className='mt-6'>
                <Label className='text-base font-medium'>Permissions</Label>
                <p className='text-sm text-muted-foreground mb-3'>
                  Permissions are automatically set based on the selected role.
                  You can customize them below.
                </p>
                <div className='grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded-md p-3'>
                  {[
                    "dashboard",
                    "messages",
                    "customers",
                    "bookings",
                    "staff",
                    "reports",
                    "forensic",
                    "attendance",
                    "trips",
                    "drivers",
                    "vehicles",
                    "payments",
                    "invoices",
                    "support",
                    "faq",
                    "my_trips",
                  ].map((permission) => (
                    <div
                      key={permission}
                      className='flex items-center space-x-2'>
                      <Checkbox
                        id={permission}
                        checked={(formData.permissions || []).includes(
                          permission
                        )}
                        onCheckedChange={() =>
                          handlePermissionToggle(permission)
                        }
                      />
                      <Label
                        htmlFor={permission}
                        className='text-sm capitalize'>
                        {permission.replace("_", " ")}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <DialogFooter className='mt-6'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => {
                    setIsAddDialogOpen(false);
                    resetForm();
                  }}>
                  Cancel
                </Button>
                <Button type='submit' disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      Creating...
                    </>
                  ) : (
                    "Create Staff Member"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>
                    {stat.title}
                  </p>
                  <p className='text-3xl font-bold'>{stat.value}</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue='all-staff' className='w-full'>
        <TabsList>
          <TabsTrigger value='all-staff'>All Staff</TabsTrigger>
          <TabsTrigger value='roles'>Roles & Permissions</TabsTrigger>
          <TabsTrigger value='attendance'>Attendance</TabsTrigger>
        </TabsList>

        <TabsContent value='all-staff' className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>Staff Members</CardTitle>
              <div className='flex space-x-4'>
                <div className='relative flex-1'>
                  <Search className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
                  <Input
                    placeholder='Search staff members...'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className='pl-10'
                  />
                </div>
                <Select
                  value={selectedDepartment}
                  onValueChange={setSelectedDepartment}>
                  <SelectTrigger className='w-48'>
                    <SelectValue placeholder='Filter by region' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>All Regions</SelectItem>
                    {regions.map((region) => (
                      <SelectItem key={region} value={region.toLowerCase()}>
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Staff Member</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStaff.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div className='flex items-center space-x-3'>
                          <Avatar>
                            <AvatarImage src={member.avatar || ""} />
                            <AvatarFallback>
                              {member.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className='font-medium'>{member.name}</p>
                            <p className='text-sm text-muted-foreground'>
                              {member.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant='outline'>
                          {roleDefinitions[
                            member.role as keyof typeof roleDefinitions
                          ]?.label || member.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {member.assigned_region || "No region"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={member.is_active ? "default" : "secondary"}>
                          {member.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {member.last_login
                          ? new Date(member.last_login).toLocaleDateString()
                          : "Never"}
                      </TableCell>
                      <TableCell>
                        <div className='flex space-x-2'>
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() => handleEditUser(member)}>
                            <Edit className='w-4 h-4' />
                          </Button>
                          {member.is_active ? (
                            <Button
                              variant='outline'
                              size='sm'
                              onClick={() => deactivateStaffMember(member.id)}>
                              <EyeOff className='w-4 h-4' />
                            </Button>
                          ) : (
                            <Button
                              variant='outline'
                              size='sm'
                              onClick={() => reactivateStaffMember(member.id)}>
                              <Eye className='w-4 h-4' />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='roles' className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>Role Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {Object.entries(roleDefinitions).map(([key, role]) => (
                  <Card key={key}>
                    <CardContent className='p-4'>
                      <h3 className='font-semibold mb-2'>{role.label}</h3>
                      <p className='text-sm text-muted-foreground mb-3'>
                        {role.description}
                      </p>
                      <div className='space-y-2'>
                        <p className='text-xs font-medium text-muted-foreground'>
                          Permissions:
                        </p>
                        <div className='flex flex-wrap gap-1'>
                          {role.permissions.map((permission) => (
                            <Badge
                              key={permission}
                              variant='secondary'
                              className='text-xs'>
                              {permission.replace("_", " ")}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='attendance' className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>Attendance Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-center py-8'>
                <Clock className='w-12 h-12 mx-auto text-muted-foreground mb-4' />
                <h3 className='text-lg font-semibold mb-2'>
                  Attendance Tracking
                </h3>
                <p className='text-muted-foreground'>
                  Attendance tracking features coming soon
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Staff Member Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>Edit Staff Member</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className='grid grid-cols-2 gap-4 mt-4'>
              <div className='space-y-2'>
                <Label htmlFor='edit-name'>Full Name *</Label>
                <Input
                  id='edit-name'
                  placeholder='Enter full name'
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='edit-email'>Email Address *</Label>
                <Input
                  id='edit-email'
                  type='email'
                  placeholder='Enter email address'
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  required
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='edit-phone'>Phone Number</Label>
                <Input
                  id='edit-phone'
                  placeholder='Enter phone number'
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, phone: e.target.value }))
                  }
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='edit-role'>Role *</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => {
                    setFormData((prev) => ({
                      ...prev,
                      role: value,
                      permissions:
                        roleDefinitions[value as keyof typeof roleDefinitions]
                          ?.permissions || [],
                    }));
                  }}>
                  <SelectTrigger>
                    <SelectValue placeholder='Select role' />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(roleDefinitions)
                      .filter(
                        ([key]) => isSuperAdmin() || key !== "super_admin"
                      )
                      .map(([key, role]) => (
                        <SelectItem key={key} value={key}>
                          <div className='flex flex-col'>
                            <span className='font-medium'>{role.label}</span>
                            <span className='text-sm text-muted-foreground'>
                              {role.description}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='edit-region'>Assigned Region</Label>
                <Select
                  value={formData.assigned_region || "none"}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      assigned_region: value === "none" ? "" : value,
                    }))
                  }>
                  <SelectTrigger>
                    <SelectValue placeholder='Select region' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='none'>No specific region</SelectItem>
                    {regions.map((region) => (
                      <SelectItem key={region} value={region}>
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <div className='flex items-center space-x-2'>
                  <Checkbox
                    id='edit-is_active'
                    checked={formData.is_active}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({
                        ...prev,
                        is_active: checked as boolean,
                      }))
                    }
                  />
                  <Label htmlFor='edit-is_active'>Active User</Label>
                </div>
              </div>
            </div>

            <div className='mt-6'>
              <Label className='text-base font-medium'>Permissions</Label>
              <p className='text-sm text-muted-foreground mb-3'>
                Permissions are automatically set based on the selected role.
                You can customize them below.
              </p>
              <div className='grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded-md p-3'>
                {[
                  "dashboard",
                  "messages",
                  "customers",
                  "bookings",
                  "staff",
                  "reports",
                  "forensic",
                  "attendance",
                  "trips",
                  "drivers",
                  "vehicles",
                  "payments",
                  "invoices",
                  "support",
                  "faq",
                  "my_trips",
                ].map((permission) => (
                  <div key={permission} className='flex items-center space-x-2'>
                    <Checkbox
                      id={`edit-${permission}`}
                      checked={(formData.permissions || []).includes(
                        permission
                      )}
                      onCheckedChange={() => handlePermissionToggle(permission)}
                    />
                    <Label
                      htmlFor={`edit-${permission}`}
                      className='text-sm capitalize'>
                      {permission.replace("_", " ")}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <DialogFooter className='mt-6'>
              <Button
                type='button'
                variant='outline'
                onClick={() => {
                  setIsEditDialogOpen(false);
                  setEditingUser(null);
                  resetForm();
                }}>
                Cancel
              </Button>
              <Button type='submit' disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Updating...
                  </>
                ) : (
                  "Update Staff Member"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StaffManagement;