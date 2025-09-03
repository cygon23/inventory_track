import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { mockUsers, User } from '@/data/mockUsers';
import { MapPin, Users, Shield } from 'lucide-react';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRoleSelect = (roleValue: string) => {
    setSelectedRole(roleValue);
    const user = mockUsers.find(u => u.role === roleValue);
    if (user) {
      setEmail(user.email);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    const user = mockUsers.find(u => u.email === email);
    if (user) {
      onLogin(user);
      toast({
        title: "Login Successful",
        description: `Welcome back, ${user.name}!`,
      });
      
      // Navigate to role-appropriate dashboard
      const dashboardRoutes = {
        super_admin: '/admin/dashboard',
        admin: '/admin/dashboard',
        admin_helper: '/admin/dashboard',
        booking_manager: '/booking/dashboard',
        operations_coordinator: '/operations/dashboard',
        driver: '/driver/dashboard',
        finance_officer: '/finance/dashboard',
        customer_service: '/support/dashboard'
      };
      
      navigate(dashboardRoutes[user.role] || '/dashboard');
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid credentials. Please try again.",
        variant: "destructive"
      });
    }
  };

  const roleOptions = [
    { value: 'super_admin', label: 'Super Admin', description: 'Full system access' },
    { value: 'admin', label: 'Admin', description: 'Business operations' },
    { value: 'admin_helper', label: 'Admin Helper', description: 'Assistant to admin' },
    { value: 'booking_manager', label: 'Booking Manager', description: 'Booking operations' },
    { value: 'operations_coordinator', label: 'Operations Coordinator', description: 'Trip logistics' },
    { value: 'driver', label: 'Driver/Guide', description: 'Field operations' },
    { value: 'finance_officer', label: 'Finance Officer', description: 'Financial management' },
    { value: 'customer_service', label: 'Customer Service', description: 'Customer support' }
  ];

  return (
    <div className="min-h-screen bg-gradient-warm flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding */}
        <div className="text-center lg:text-left space-y-6">
          <div className="flex items-center justify-center lg:justify-start space-x-3">
            <div className="w-12 h-12 bg-gradient-safari rounded-xl flex items-center justify-center">
              <MapPin className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Lion Track Safari</h1>
              <p className="text-muted-foreground">Booking Management System</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-foreground">
              Streamline Your Safari Operations
            </h2>
            <p className="text-lg text-muted-foreground">
              Centralized messaging, role-based access, and comprehensive booking management for your safari business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            <div className="flex items-center space-x-3 p-4 bg-card rounded-lg border">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold">Role-Based Access</h3>
                <p className="text-sm text-muted-foreground">8 different user roles</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-card rounded-lg border">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold">Secure & Reliable</h3>
                <p className="text-sm text-muted-foreground">Enterprise-grade security</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <Card className="safari-card">
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Select your role to access the appropriate dashboard
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="role">Select Role (Demo)</Label>
                <Select value={selectedRole} onValueChange={handleRoleSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose your role" />
                  </SelectTrigger>
                  <SelectContent className="z-50 bg-popover">
                    {roleOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex flex-col">
                          <span className="font-medium">{option.label}</span>
                          <span className="text-sm text-muted-foreground">{option.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <Label htmlFor="remember" className="text-sm">Remember me</Label>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={!selectedRole}>
                Sign In
              </Button>
              
              <div className="text-center space-y-2">
                <Button variant="ghost" size="sm">
                  Forgot Password?
                </Button>
                <p className="text-xs text-muted-foreground">
                  Demo mode: Select any role to explore the system
                </p>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;