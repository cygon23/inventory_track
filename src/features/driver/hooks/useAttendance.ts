import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AttendanceFilters,
  deleteAttendance,
  fetchAttendanceByDate,
  fetchAttendanceStats,
  fetchMyAttendance,
  submitAttendanceDetails,
} from "../api/attendance.service";

export function useMyAttendance(userId: string, date: string) {
  return useQuery({
    queryKey: ['my-attendance', userId, date],
    queryFn: () => fetchMyAttendance(userId, date),
    staleTime: 10000
  });
}

export function useAttendanceByDate(date: string, filters?: AttendanceFilters) {
  return useQuery({
    queryKey: ["attendance", date, filters],
    queryFn: () => fetchAttendanceByDate(date, filters),
    staleTime: 30000,
  });
}

export function useAttendanceStats(date: string) {
  return useQuery({
    queryKey: ["attendance-stats", date],
    queryFn: () => fetchAttendanceStats(date),
    staleTime: 30000,
  });
}

export function useSubmitAttendance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitAttendanceDetails,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      queryClient.invalidateQueries({ queryKey: ['attendance-stats'] });
      queryClient.invalidateQueries({ queryKey: ['my-attendance'] });
    }
  });
}

export function useDeleteAttendance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAttendance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
      queryClient.invalidateQueries({ queryKey: ["attendance-stats"] });
    },
  });
}