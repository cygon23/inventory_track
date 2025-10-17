import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  Camera,
  Save,
  Lock,
  Activity,
  Calendar,
} from "lucide-react";
import { roleColors } from "@/lib/constants";
import { supabase } from "@/lib/supabase";

// Define which fields are editable per role
const ROLE_PERMISSIONS = {
  super_admin: {
    canEditName: true,
    canEditPhone: true,
    canEditRegion: true,
    showRolePermissions: true,
  },
  admin: {
    canEditName: true,
    canEditPhone: true,
    canEditRegion: true,
    showRolePermissions: true,
  },
  booking_manager: {
    canEditName: true,
    canEditPhone: true,
    canEditRegion: false,
    showRolePermissions: false,
  },
  operations_coordinator: {
    canEditName: true,
    canEditPhone: true,
    canEditRegion: false,
    showRolePermissions: false,
  },
  driver: {
    canEditName: true,
    canEditPhone: true,
    canEditRegion: false,
    showRolePermissions: false,
  },
  finance_officer: {
    canEditName: true,
    canEditPhone: true,
    canEditRegion: false,
    showRolePermissions: false,
  },
  customer_service: {
    canEditName: true,
    canEditPhone: true,
    canEditRegion: false,
    showRolePermissions: false,
  },
};

const ProfilePage: React.FC = () => {
  const { user, updateUserProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    assigned_region: user?.assigned_region || "",
  });

  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  if (!user) return null;

  const permissions =
    ROLE_PERMISSIONS[user.role as keyof typeof ROLE_PERMISSIONS] ||
    ROLE_PERMISSIONS.customer_service;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const formatRole = (role: string) => {
    return role
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleProfileUpdate = async () => {
    setLoading(true);
    try {
      const updateData: any = {};

      if (permissions.canEditName) updateData.name = formData.name;
      if (permissions.canEditPhone) updateData.phone = formData.phone;
      if (permissions.canEditRegion)
        updateData.assigned_region = formData.assigned_region;

      const result = await updateUserProfile(updateData);
      if (result.success) {
        toast.success("Profile updated successfully");
      } else {
        toast.error(result.error || "Failed to update profile");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async () => {
    // Validation
    if (!passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    // Password strength validation
    const hasUpperCase = /[A-Z]/.test(passwordData.newPassword);
    const hasLowerCase = /[a-z]/.test(passwordData.newPassword);
    const hasNumber = /[0-9]/.test(passwordData.newPassword);

    if (!hasUpperCase || !hasLowerCase || !hasNumber) {
      toast.error("Password must contain uppercase, lowercase, and numbers");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword,
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Password updated successfully! Please log in again.");
        setPasswordData({
          newPassword: "",
          confirmPassword: "",
        });

        // Optionally sign out after password change
        setTimeout(() => {
          supabase.auth.signOut();
        }, 2000);
      }
    } catch (error) {
      toast.error("Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size must be less than 2MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("File must be an image");
      return;
    }

    setLoading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("user-avatars")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("user-avatars")
        .getPublicUrl(filePath);

      const result = await updateUserProfile({ avatar: urlData.publicUrl });
      if (result.success) {
        toast.success("Profile picture updated");
      } else {
        toast.error("Failed to update profile picture");
      }
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setLoading(false);
    }
  };

  const showRegionField =
    user.role === "operations_coordinator" ||
    user.role === "driver" ||
    user.role === "booking_manager";

  return (
    <div className='container mx-auto p-6 max-w-5xl'>
      <Card className='mb-6'>
        <CardContent className='pt-6'>
          <div className='flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6'>
            <div className='relative'>
              <Avatar className='h-24 w-24'>
                <AvatarImage src={user.avatar || ""} />
                <AvatarFallback className='text-2xl'>
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <label
                htmlFor='avatar-upload'
                className='absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:bg-primary/90 transition-colors'>
                <Camera className='h-4 w-4' />
              </label>
              <input
                id='avatar-upload'
                type='file'
                accept='image/*'
                className='hidden'
                onChange={handleAvatarUpload}
                disabled={loading}
              />
            </div>
            <div className='flex-1 text-center md:text-left'>
              <h1 className='text-2xl font-bold'>{user.name}</h1>
              <p className='text-muted-foreground'>{user.email}</p>
              <div className='flex items-center justify-center md:justify-start space-x-2 mt-2'>
                <Badge className={roleColors[user.role]}>
                  {formatRole(user.role)}
                </Badge>
                {user.is_active ? (
                  <Badge
                    variant='outline'
                    className='text-green-600 border-green-600'>
                    Active
                  </Badge>
                ) : (
                  <Badge
                    variant='outline'
                    className='text-red-600 border-red-600'>
                    Inactive
                  </Badge>
                )}
              </div>
            </div>
            <div className='text-center md:text-right'>
              <p className='text-sm text-muted-foreground'>Member since</p>
              <p className='font-medium'>
                {new Date(user.created_at).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className='grid w-full grid-cols-3'>
          <TabsTrigger value='personal'>Personal Info</TabsTrigger>
          <TabsTrigger value='security'>Security</TabsTrigger>
          <TabsTrigger value='activity'>Activity</TabsTrigger>
        </TabsList>

        <TabsContent value='personal'>
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='name'>
                    <User className='h-4 w-4 inline mr-2' />
                    Full Name
                  </Label>
                  <Input
                    id='name'
                    name='name'
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder='Enter your full name'
                    disabled={!permissions.canEditName}
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='email'>
                    <Mail className='h-4 w-4 inline mr-2' />
                    Email Address
                  </Label>
                  <Input
                    id='email'
                    name='email'
                    type='email'
                    value={formData.email}
                    disabled
                    className='bg-muted'
                  />
                  <p className='text-xs text-muted-foreground'>
                    Email cannot be changed
                  </p>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='phone'>
                    <Phone className='h-4 w-4 inline mr-2' />
                    Phone Number
                  </Label>
                  <Input
                    id='phone'
                    name='phone'
                    value={formData.phone || ""}
                    onChange={handleInputChange}
                    placeholder='Enter your phone number'
                    disabled={!permissions.canEditPhone}
                  />
                </div>

                {showRegionField && (
                  <div className='space-y-2'>
                    <Label htmlFor='assigned_region'>
                      <MapPin className='h-4 w-4 inline mr-2' />
                      Assigned Region
                    </Label>
                    <Input
                      id='assigned_region'
                      name='assigned_region'
                      value={formData.assigned_region || ""}
                      onChange={handleInputChange}
                      placeholder='e.g., Serengeti, Ngorongoro'
                      disabled={!permissions.canEditRegion}
                      className={!permissions.canEditRegion ? "bg-muted" : ""}
                    />
                    {!permissions.canEditRegion && (
                      <p className='text-xs text-muted-foreground'>
                        Contact admin to update region
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className='flex justify-end space-x-2 pt-4'>
                <Button
                  variant='outline'
                  onClick={() =>
                    setFormData({
                      name: user.name,
                      email: user.email,
                      phone: user.phone || "",
                      assigned_region: user.assigned_region || "",
                    })
                  }>
                  Cancel
                </Button>
                <Button onClick={handleProfileUpdate} disabled={loading}>
                  <Save className='h-4 w-4 mr-2' />
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='security'>
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your password and security preferences
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='newPassword'>
                    <Lock className='h-4 w-4 inline mr-2' />
                    New Password
                  </Label>
                  <Input
                    id='newPassword'
                    name='newPassword'
                    type='password'
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    placeholder='Enter new password'
                  />
                  <p className='text-xs text-muted-foreground'>
                    Must be at least 6 characters with uppercase, lowercase, and
                    numbers
                  </p>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='confirmPassword'>
                    <Lock className='h-4 w-4 inline mr-2' />
                    Confirm New Password
                  </Label>
                  <Input
                    id='confirmPassword'
                    name='confirmPassword'
                    type='password'
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder='Confirm new password'
                  />
                </div>
              </div>

              <div className='flex justify-end pt-4'>
                <Button onClick={handlePasswordUpdate} disabled={loading}>
                  <Lock className='h-4 w-4 mr-2' />
                  {loading ? "Updating..." : "Update Password"}
                </Button>
              </div>

              {permissions.showRolePermissions && (
                <div className='border-t pt-6 mt-6'>
                  <h3 className='font-semibold mb-2'>Role & Permissions</h3>
                  <div className='space-y-2'>
                    <div className='flex items-center justify-between py-2'>
                      <span className='text-sm text-muted-foreground'>
                        Current Role
                      </span>
                      <Badge className={roleColors[user.role]}>
                        {formatRole(user.role)}
                      </Badge>
                    </div>
                    <div className='flex items-center justify-between py-2'>
                      <span className='text-sm text-muted-foreground'>
                        Permissions
                      </span>
                      <span className='text-sm font-medium'>
                        {user.permissions.join(", ")}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='activity'>
          <Card>
            <CardHeader>
              <CardTitle>Account Activity</CardTitle>
              <CardDescription>
                View your recent account activity and login history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div className='flex items-center justify-between py-3 border-b'>
                  <div className='flex items-center space-x-3'>
                    <Activity className='h-5 w-5 text-muted-foreground' />
                    <div>
                      <p className='font-medium'>Last Login</p>
                      <p className='text-sm text-muted-foreground'>
                        {user.last_login
                          ? new Date(user.last_login).toLocaleString()
                          : "Never"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className='flex items-center justify-between py-3 border-b'>
                  <div className='flex items-center space-x-3'>
                    <Calendar className='h-5 w-5 text-muted-foreground' />
                    <div>
                      <p className='font-medium'>Account Created</p>
                      <p className='text-sm text-muted-foreground'>
                        {new Date(user.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className='flex items-center justify-between py-3'>
                  <div className='flex items-center space-x-3'>
                    <Shield className='h-5 w-5 text-muted-foreground' />
                    <div>
                      <p className='font-medium'>Account Status</p>
                      <p className='text-sm text-muted-foreground'>
                        {user.is_active ? "Active and secured" : "Inactive"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage;
