import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    AttendanceFilters,
    checkIn,
    checkOut,
    deleteAttendance,
    fetchAttendanceByDate,
    fetchAttendanceStats,
    markAbsent,
    upsertAttendance,
} from "../api/attendance.service";

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

export function useCheckIn() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (
            { userId, location }: { userId: string; location?: string },
        ) => checkIn(userId, location),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["attendance"] });
            queryClient.invalidateQueries({ queryKey: ["attendance-stats"] });
        },
    });
}

export function useCheckOut() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ userId, date }: { userId: string; date: string }) =>
            checkOut(userId, date),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["attendance"] });
            queryClient.invalidateQueries({ queryKey: ["attendance-stats"] });
        },
    });
}

export function useMarkAbsent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (
            { userId, date, notes }: {
                userId: string;
                date: string;
                notes?: string;
            },
        ) => markAbsent(userId, date, notes),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["attendance"] });
            queryClient.invalidateQueries({ queryKey: ["attendance-stats"] });
        },
    });
}

export function useUpsertAttendance() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: upsertAttendance,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["attendance"] });
            queryClient.invalidateQueries({ queryKey: ["attendance-stats"] });
        },
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
