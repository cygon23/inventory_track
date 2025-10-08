import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Clock, MapPin, CheckCircle, LogOut, Loader2 } from "lucide-react";
import {
  useCheckIn,
  useCheckOut,
  useAttendanceByDate,
} from "../features/driver/hooks/useAttendance";
import { format } from "date-fns";

interface AttendanceCheckInOutProps {
  userId: string;
  userName: string;
}

const AttendanceCheckInOut: React.FC<AttendanceCheckInOutProps> = ({
  userId,
  userName,
}) => {
  const [location, setLocation] = useState("");
  const today = format(new Date(), "yyyy-MM-dd");

  const { data: todayAttendance } = useAttendanceByDate(today);
  const checkInMutation = useCheckIn();
  const checkOutMutation = useCheckOut();

  // Find current user's attendance for today
  const myAttendance = todayAttendance?.find(
    (record) => record.user_id === userId
  );
  const hasCheckedIn = !!myAttendance?.check_in;
  const hasCheckedOut = !!myAttendance?.check_out;

  const handleCheckIn = async () => {
    if (!location.trim()) {
      alert("Please enter your location");
      return;
    }

    try {
      await checkInMutation.mutateAsync({ userId, location });
      setLocation("");
    } catch (error) {
      console.error("Check-in failed:", error);
      alert("Failed to check in. Please try again.");
    }
  };

  const handleCheckOut = async () => {
    try {
      await checkOutMutation.mutateAsync({ userId, date: today });
    } catch (error) {
      console.error("Check-out failed:", error);
      alert("Failed to check out. Please try again.");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center'>
          <Clock className='h-5 w-5 mr-2' />
          Quick Attendance
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {/* Current Status */}
        {hasCheckedIn && !hasCheckedOut && (
          <Alert>
            <CheckCircle className='h-4 w-4' />
            <AlertDescription>
              Checked in at <strong>{myAttendance?.check_in}</strong> from{" "}
              {myAttendance?.location}
            </AlertDescription>
          </Alert>
        )}

        {hasCheckedOut && (
          <Alert>
            <CheckCircle className='h-4 w-4' />
            <AlertDescription>
              Completed: {myAttendance?.check_in} - {myAttendance?.check_out} (
              {myAttendance?.hours_worked}h)
            </AlertDescription>
          </Alert>
        )}

        {/* Check In Form */}
        {!hasCheckedIn && (
          <div className='space-y-3'>
            <div>
              <Label htmlFor='location'>Location</Label>
              <div className='relative'>
                <MapPin className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                <Input
                  id='location'
                  placeholder='e.g., Head Office, Serengeti Camp'
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className='pl-10'
                />
              </div>
            </div>
            <Button
              onClick={handleCheckIn}
              disabled={checkInMutation.isPending}
              className='w-full'>
              {checkInMutation.isPending && (
                <Loader2 className='h-4 w-4 mr-2 animate-spin' />
              )}
              <Clock className='h-4 w-4 mr-2' />
              Check In
            </Button>
          </div>
        )}

        {/* Check Out Button */}
        {hasCheckedIn && !hasCheckedOut && (
          <Button
            onClick={handleCheckOut}
            disabled={checkOutMutation.isPending}
            variant='outline'
            className='w-full'>
            {checkOutMutation.isPending && (
              <Loader2 className='h-4 w-4 mr-2 animate-spin' />
            )}
            <LogOut className='h-4 w-4 mr-2' />
            Check Out
          </Button>
        )}

        {/* Info */}
        <p className='text-xs text-muted-foreground text-center'>
          {format(new Date(), "EEEE, MMMM d, yyyy • h:mm a")}
        </p>
      </CardContent>
    </Card>
  );
};

export default AttendanceCheckInOut;
