import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";
import { MapPin, Users, Shield, Loader2, Eye, EyeOff, Zap } from "lucide-react";
import { toast } from "sonner";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn, user, loading } = useAuth();

  // Load saved email if "Remember Me" was checked
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  useEffect(() => {
    if (!loading && user) {
      const dashboardRoutes: Record<string, string> = {
        super_admin: "/admin/dashboard",
        admin: "/admin/dashboard",
        booking_manager: "/booking/dashboard",
        operations_coordinator: "/operations/dashboard",
        driver: "/driver/dashboard",
        finance_officer: "/finance/dashboard",
        customer_service: "/support/dashboard",
      };

      const route = dashboardRoutes[user.role] || "/admin/dashboard";
      navigate(route, { replace: true });
    }
  }, [user, loading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      const result = await signIn(email, password);

      if (result.success) {
        // Handle "Remember Me" functionality
        if (rememberMe) {
          localStorage.setItem("rememberedEmail", email);
        } else {
          localStorage.removeItem("rememberedEmail");
        }

        toast.success("Login successful! Redirecting...");
      } else {
        toast.error(result.error || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-warm flex items-center justify-center'>
        <div className='flex items-center space-x-2'>
          <Loader2 className='h-6 w-6 animate-spin text-primary' />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-warm flex items-center justify-center p-4'>
      <div className='w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center'>
        <div className='text-center lg:text-left space-y-6'>
          <div className='flex items-center justify-center lg:justify-start'>
            <img
              src='/LION-TRACK-LOGO-FINAL-01.svg'
              alt='Lion Track Safari'
              className='h-16 w-auto'
            />
          </div>

          <div className='space-y-4'>
            <h2 className='text-4xl font-bold text-foreground'>
              Streamline Your Safari Operations
            </h2>
            <p className='text-lg text-muted-foreground'>
              Centralized messaging, role-based access, and comprehensive
              booking management for your safari business.
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-8'>
            <div className='flex items-center space-x-3 p-4 bg-card rounded-lg border'>
              <Zap className='h-8 w-8 text-primary' />
              <div>
                <h3 className='font-semibold'>Lightning Fast</h3>
                <p className='text-sm text-muted-foreground'>
                  Quick access to all features
                </p>
              </div>
            </div>
            <div className='flex items-center space-x-3 p-4 bg-card rounded-lg border'>
              <Shield className='h-8 w-8 text-primary' />
              <div>
                <h3 className='font-semibold'>Always Secure</h3>
                <p className='text-sm text-muted-foreground'>
                  Bank-level encryption
                </p>
              </div>
            </div>
          </div>
        </div>

        <Card className='safari-card'>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access the system
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleLogin}>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='email'>Email Address</Label>
                <Input
                  id='email'
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder='Enter your email address'
                  required
                  disabled={isLoading}
                  className='w-full'
                  autoComplete='email'
                />
              </div>

              <div className='space-y-2'>
                <div className='flex items-center justify-between'>
                  <Label htmlFor='password'>Password</Label>
                  <Link
                    to='/forgot-password'
                    className='text-xs text-primary hover:underline'
                    tabIndex={-1}>
                    Forgot password?
                  </Link>
                </div>
                <div className='relative'>
                  <Input
                    id='password'
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder='Enter your password'
                    required
                    disabled={isLoading}
                    className='w-full pr-10'
                    autoComplete='current-password'
                  />
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    tabIndex={-1}>
                    {showPassword ? (
                      <EyeOff className='h-4 w-4' />
                    ) : (
                      <Eye className='h-4 w-4' />
                    )}
                  </Button>
                </div>
              </div>

              <div className='flex items-center space-x-2'>
                <Checkbox
                  id='remember'
                  checked={rememberMe}
                  onCheckedChange={(checked) =>
                    setRememberMe(checked as boolean)
                  }
                  disabled={isLoading}
                />
                <Label htmlFor='remember' className='text-sm cursor-pointer'>
                  Remember my email
                </Label>
              </div>
            </CardContent>

            <CardFooter className='flex flex-col space-y-4'>
              <Button
                type='submit'
                className='w-full'
                disabled={isLoading || !email || !password}>
                {isLoading ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>

              <p className='text-xs text-center text-muted-foreground'>
                Contact your administrator for account access
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
