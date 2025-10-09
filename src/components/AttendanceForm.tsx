import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clock, MapPin, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import {
  useSubmitAttendance,
  useMyAttendance,
} from "../features/driver/hooks/useAttendance";
import { format } from "date-fns";
import { getDepartmentFromRole } from "../features/driver/api/attendance.service";
import { toast } from "@/hooks/use-toast";

interface AttendanceFormProps {
  userId: string;
  userName: string;
  userRole: string;
}

const AttendanceForm: React.FC<AttendanceFormProps> = ({
  userId,
  userName,
  userRole,
}) => {
  const today = format(new Date(), "yyyy-MM-dd");

  const { data: existingAttendance } = useMyAttendance(userId, today);
  const submitMutation = useSubmitAttendance();

  const [formData, setFormData] = useState({
    date: today,
    check_in: "",
    check_out: "",
    status: "present" as "present" | "late" | "absent" | "working" | "halfday",
    location: "",
    notes: "",
  });

  // Auto-fill if attendance already exists
  useEffect(() => {
    if (existingAttendance) {
      setFormData({
        date: existingAttendance.date,
        check_in: existingAttendance.check_in || "",
        check_out: existingAttendance.check_out || "",
        status: existingAttendance.status,
        location: existingAttendance.location || "",
        notes: existingAttendance.notes || "",
      });
    }
  }, [existingAttendance]);

  // Auto-determine status based on check-in time
  useEffect(() => {
    if (formData.check_in) {
      const hour = parseInt(formData.check_in.split(":")[0]);
      if (hour >= 9) {
        setFormData((prev) => ({ ...prev, status: "late" }));
      } else {
        setFormData((prev) => ({ ...prev, status: "present" }));
      }
    }
  }, [formData.check_in]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.check_in || !formData.location) {
      toast({
        variant: "destructive",
        description: "Please fill in check-in time and location",
      });
      return;
    }

    try {
      await submitMutation.mutateAsync({
        user_id: userId,
        ...formData,
      });
      toast({
        description: "Attendance submitted successfully!",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to submit attendance. Please try again.",
      });
    }
  };

  const department = getDepartmentFromRole(userRole);
  const isSubmitted = !!existingAttendance;

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center'>
          <Clock className='h-5 w-5 mr-2' />
          Submit Attendance - {department} Department
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isSubmitted && (
          <Alert className='mb-4'>
            <CheckCircle className='h-4 w-4' />
            <AlertDescription>
              Attendance already submitted for today. You can update it below.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className='space-y-4'>
          {/* User Info (Read-only) */}
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <Label>Employee Name</Label>
              <Input value={userName} disabled />
            </div>
            <div>
              <Label>Department</Label>
              <Input value={department} disabled />
            </div>
          </div>

          {/* Date */}
          <div>
            <Label htmlFor='date'>Date *</Label>
            <Input
              id='date'
              type='date'
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              max={today}
              required
            />
          </div>

          {/* Check In Time */}
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <Label htmlFor='check_in'>Check In Time *</Label>
              <Input
                id='check_in'
                type='time'
                value={formData.check_in}
                onChange={(e) =>
                  setFormData({ ...formData, check_in: e.target.value })
                }
                required
              />
              <p className='text-xs text-muted-foreground mt-1'>
                Late if after 9:00 AM
              </p>
            </div>

            {/* Check Out Time */}
            <div>
              <Label htmlFor='check_out'>Check Out Time</Label>
              <Input
                id='check_out'
                type='time'
                value={formData.check_out}
                onChange={(e) =>
                  setFormData({ ...formData, check_out: e.target.value })
                }
              />
              <p className='text-xs text-muted-foreground mt-1'>
                Leave empty if still working
              </p>
            </div>
          </div>

          {/* Status */}
          <div>
            <Label htmlFor='status'>Status *</Label>
            <Select
              value={formData.status}
              onValueChange={(value: any) =>
                setFormData({ ...formData, status: value })
              }>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='present'>Present</SelectItem>
                <SelectItem value='late'>Late</SelectItem>
                <SelectItem value='working'>Currently Working</SelectItem>
                <SelectItem value='halfday'>Half Day</SelectItem>
                <SelectItem value='absent'>Absent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Location */}
          <div>
            <Label htmlFor='location'>Location *</Label>
            <div className='relative'>
              <MapPin className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
              <Input
                id='location'
                placeholder='e.g., Head Office, Serengeti Camp, Remote'
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                className='pl-10'
                required
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor='notes'>Notes (Optional)</Label>
            <Textarea
              id='notes'
              placeholder='Any additional information...'
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              rows={3}
            />
          </div>

          {/* Submit Button */}
          <Button
            type='submit'
            disabled={submitMutation.isPending}
            className='w-full'>
            {submitMutation.isPending && (
              <Loader2 className='h-4 w-4 mr-2 animate-spin' />
            )}
            <CheckCircle className='h-4 w-4 mr-2' />
            {isSubmitted ? "Update Attendance" : "Submit Attendance"}
          </Button>

          <p className='text-xs text-muted-foreground text-center'>
            Submitted on: {format(new Date(), "EEEE, MMMM d, yyyy • h:mm a")}
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

export default AttendanceForm;
