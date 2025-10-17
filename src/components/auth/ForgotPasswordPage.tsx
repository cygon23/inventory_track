import React, { useState } from "react";
import { Link } from "react-router-dom";
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
import { useAuth } from "@/contexts/AuthContext";
import { MapPin, ArrowLeft, Mail, Loader2, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { requestPasswordReset } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address");
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
      const result = await requestPasswordReset(email);

      if (result.success) {
        setEmailSent(true);
        toast.success("Password reset email sent!");
      } else {
        toast.error(result.error || "Failed to send reset email");
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className='min-h-screen bg-gradient-warm flex items-center justify-center p-4'>
        <Card className='w-full max-w-md safari-card'>
          <CardHeader className='text-center'>
            <div className='mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4'>
              <CheckCircle className='h-8 w-8 text-green-600' />
            </div>
            <CardTitle className='text-2xl'>Check Your Email</CardTitle>
            <CardDescription>
              We've sent a password reset link to
            </CardDescription>
          </CardHeader>
          <CardContent className='text-center space-y-4'>
            <p className='font-medium text-lg'>{email}</p>
            <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 text-left'>
              <p className='text-sm text-blue-900'>
                <strong>📧 Next steps:</strong>
              </p>
              <ul className='text-sm text-blue-800 mt-2 space-y-1 list-disc list-inside'>
                <li>Check your inbox for an email from Lion Track Safari</li>
                <li>Click the reset password link in the email</li>
                <li>The link will expire in 1 hour</li>
              </ul>
            </div>
            <p className='text-sm text-muted-foreground'>
              Didn't receive the email? Check your spam folder or try again.
            </p>
          </CardContent>
          <CardFooter className='flex flex-col space-y-2'>
            <Button
              variant='outline'
              className='w-full'
              onClick={() => {
                setEmailSent(false);
                setEmail("");
              }}>
              Send Another Email
            </Button>
            <Link to='/login' className='w-full'>
              <Button variant='ghost' className='w-full'>
                <ArrowLeft className='mr-2 h-4 w-4' />
                Back to Login
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-warm flex items-center justify-center p-4'>
      <div className='w-full max-w-md'>
        <div className='text-center mb-8'>
          <div className='flex items-center justify-center space-x-3 mb-4'>
            <div className='w-12 h-12 bg-gradient-safari rounded-xl flex items-center justify-center'>
              <MapPin className='h-6 w-6 text-white' />
            </div>
            <div>
              <h1 className='text-2xl font-bold text-foreground'>
                Lion Track Safari
              </h1>
              <p className='text-sm text-muted-foreground'>
                Booking Management System
              </p>
            </div>
          </div>
        </div>

        <Card className='safari-card'>
          <CardHeader>
            <CardTitle>Forgot Password?</CardTitle>
            <CardDescription>
              Enter your email address and we'll send you a link to reset your
              password
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='email'>
                  <Mail className='h-4 w-4 inline mr-2' />
                  Email Address
                </Label>
                <Input
                  id='email'
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder='Enter your email address'
                  required
                  disabled={isLoading}
                  className='w-full'
                  autoFocus
                />
              </div>

              <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-3'>
                <p className='text-sm text-yellow-900'>
                  <strong>⚠️ Note:</strong> The reset link will be valid for 1
                  hour. Make sure to check your spam folder if you don't see the
                  email.
                </p>
              </div>
            </CardContent>

            <CardFooter className='flex flex-col space-y-3'>
              <Button
                type='submit'
                className='w-full'
                disabled={isLoading || !email}>
                {isLoading ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Sending Email...
                  </>
                ) : (
                  <>
                    <Mail className='mr-2 h-4 w-4' />
                    Send Reset Link
                  </>
                )}
              </Button>

              <Link to='/login' className='w-full'>
                <Button variant='ghost' className='w-full'>
                  <ArrowLeft className='mr-2 h-4 w-4' />
                  Back to Login
                </Button>
              </Link>
            </CardFooter>
          </form>
        </Card>

        <div className='text-center mt-4'>
          <p className='text-sm text-muted-foreground'>
            Need help?{" "}
            <a
              href='mailto:support@liontracksafari.com'
              className='text-primary hover:underline'>
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
