import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import {
  MapPin,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

const ResetPasswordPage: React.FC = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    hasMinLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
  });
  const navigate = useNavigate();
  const { resetPassword } = useAuth();

  // Check password strength
  useEffect(() => {
    setPasswordStrength({
      hasMinLength: newPassword.length >= 8,
      hasUpperCase: /[A-Z]/.test(newPassword),
      hasLowerCase: /[a-z]/.test(newPassword),
      hasNumber: /[0-9]/.test(newPassword),
    });
  }, [newPassword]);

  const isPasswordValid = Object.values(passwordStrength).every(Boolean);
  const passwordsMatch =
    newPassword === confirmPassword && confirmPassword !== "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!isPasswordValid) {
      toast.error("Password doesn't meet the requirements");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const result = await resetPassword(newPassword);

      if (result.success) {
        toast.success("Password reset successful!");
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 2000);
      } else {
        toast.error(result.error || "Failed to reset password");
      }
    } catch (error) {
      console.error("Reset password error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const PasswordRequirement = ({
    met,
    text,
  }: {
    met: boolean;
    text: string;
  }) => (
    <div className='flex items-center space-x-2'>
      {met ? (
        <CheckCircle2 className='h-4 w-4 text-green-600' />
      ) : (
        <XCircle className='h-4 w-4 text-gray-400' />
      )}
      <span
        className={`text-sm ${
          met ? "text-green-600 font-medium" : "text-gray-500"
        }`}>
        {text}
      </span>
    </div>
  );

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
            <CardTitle>Reset Your Password</CardTitle>
            <CardDescription>
              Create a new password for your account
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='newPassword'>
                  <Lock className='h-4 w-4 inline mr-2' />
                  New Password
                </Label>
                <div className='relative'>
                  <Input
                    id='newPassword'
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder='Enter new password'
                    required
                    disabled={isLoading}
                    className='w-full pr-10'
                    autoFocus
                  />
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}>
                    {showPassword ? (
                      <EyeOff className='h-4 w-4' />
                    ) : (
                      <Eye className='h-4 w-4' />
                    )}
                  </Button>
                </div>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='confirmPassword'>
                  <Lock className='h-4 w-4 inline mr-2' />
                  Confirm New Password
                </Label>
                <div className='relative'>
                  <Input
                    id='confirmPassword'
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder='Confirm new password'
                    required
                    disabled={isLoading}
                    className='w-full pr-10'
                  />
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}>
                    {showConfirmPassword ? (
                      <EyeOff className='h-4 w-4' />
                    ) : (
                      <Eye className='h-4 w-4' />
                    )}
                  </Button>
                </div>
              </div>

              {confirmPassword && (
                <div
                  className={`p-3 rounded-lg border ${
                    passwordsMatch
                      ? "bg-green-50 border-green-200"
                      : "bg-red-50 border-red-200"
                  }`}>
                  <p
                    className={`text-sm font-medium ${
                      passwordsMatch ? "text-green-900" : "text-red-900"
                    }`}>
                    {passwordsMatch
                      ? "✓ Passwords match"
                      : "✗ Passwords do not match"}
                  </p>
                </div>
              )}

              <div className='bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2'>
                <p className='text-sm font-semibold text-gray-900 mb-2'>
                  Password Requirements:
                </p>
                <PasswordRequirement
                  met={passwordStrength.hasMinLength}
                  text='At least 8 characters'
                />
                <PasswordRequirement
                  met={passwordStrength.hasUpperCase}
                  text='One uppercase letter'
                />
                <PasswordRequirement
                  met={passwordStrength.hasLowerCase}
                  text='One lowercase letter'
                />
                <PasswordRequirement
                  met={passwordStrength.hasNumber}
                  text='One number'
                />
              </div>
            </CardContent>

            <CardFooter>
              <Button
                type='submit'
                className='w-full'
                disabled={isLoading || !isPasswordValid || !passwordsMatch}>
                {isLoading ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Resetting Password...
                  </>
                ) : (
                  <>
                    <Lock className='mr-2 h-4 w-4' />
                    Reset Password
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <div className='text-center mt-4'>
          <p className='text-sm text-muted-foreground'>
            Remember your password?{" "}
            <a href='/login' className='text-primary hover:underline'>
              Back to Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
