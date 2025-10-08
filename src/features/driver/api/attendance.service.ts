import { supabase } from "@/lib/supabase";

export interface AttendanceRecord {
    id: string;
    user_id: string;
    date: string;
    check_in: string | null;
    check_out: string | null;
    status: "present" | "late" | "absent" | "working" | "halfday";
    hours_worked: number;
    overtime: number;
    location: string | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
    user?: {
        full_name: string;
        email: string;
        role: string;
    };
}

export interface AttendanceStats {
    totalEmployees: number;
    present: number;
    late: number;
    absent: number;
    working: number;
    attendanceRate: number;
}

export interface AttendanceFilters {
    search?: string;
    department?: string;
    status?: string;
}

// Fetch attendance records for a specific date with filters
export async function fetchAttendanceByDate(
    date: string,
    filters?: AttendanceFilters,
) {
    let query = supabase
        .from("attendance")
        .select(`
      *,
      user:users!attendance_user_id_fkey(
        name,
        email,
        role
      )
    `)
        .eq("date", date)
        .order("check_in", { ascending: true });

    // Apply status filter
    if (filters?.status && filters.status !== "all") {
        query = query.eq("status", filters.status);
    }

    const { data, error } = await query;

    if (error) throw error;

    let records = data as AttendanceRecord[];

    // Apply search filter (client-side)
    if (filters?.search) {
        const search = filters.search.toLowerCase();
        records = records.filter((record) =>
            record.user?.full_name?.toLowerCase().includes(search) ||
            record.user?.email?.toLowerCase().includes(search) ||
            record.user?.role?.toLowerCase().includes(search)
        );
    }

    // Apply department filter (client-side via role mapping)
    if (filters?.department && filters.department !== "all") {
        records = records.filter((record) => {
            const dept = getDepartmentFromRole(record.user?.role);
            return dept.toLowerCase() === filters.department.toLowerCase();
        });
    }

    return records;
}

// Fetch attendance stats for a date
export async function fetchAttendanceStats(
    date: string,
): Promise<AttendanceStats> {
    const { data: attendance } = await supabase
        .from("attendance")
        .select("status")
        .eq("date", date);

    const { data: allUsers } = await supabase
        .from("users")
        .select("id, role")
        .neq("role", "customer");

    const totalEmployees = allUsers?.length || 0;
    const present = attendance?.filter((a) => a.status === "present").length ||
        0;
    const late = attendance?.filter((a) => a.status === "late").length || 0;
    const absent = attendance?.filter((a) => a.status === "absent").length || 0;
    const working = attendance?.filter((a) => a.status === "working").length ||
        0;
    const attendanceRate = totalEmployees > 0
        ? ((present + late + working) / totalEmployees) * 100
        : 0;

    return {
        totalEmployees,
        present,
        late,
        absent,
        working,
        attendanceRate: Math.round(attendanceRate),
    };
}

// Create or update attendance record
export async function upsertAttendance(record: Partial<AttendanceRecord>) {
    const { data, error } = await supabase
        .from("attendance")
        .upsert({
            user_id: record.user_id,
            date: record.date,
            check_in: record.check_in,
            check_out: record.check_out,
            status: record.status,
            hours_worked: record.hours_worked,
            overtime: record.overtime,
            location: record.location,
            notes: record.notes,
        }, {
            onConflict: "user_id,date",
        })
        .select()
        .single();

    if (error) throw error;
    return data;
}

// Check in employee
export async function checkIn(userId: string, location?: string) {
    const now = new Date();
    const date = now.toISOString().split("T")[0];
    const time = now.toTimeString().split(" ")[0].substring(0, 5);

    // Determine if late (after 9:00 AM)
    const checkInHour = now.getHours();
    const status = checkInHour >= 9 ? "late" : "present";

    return upsertAttendance({
        user_id: userId,
        date,
        check_in: time,
        status,
        location: location || "Office",
        notes: status === "late" ? "Late arrival" : null,
    });
}

// Check out employee
export async function checkOut(userId: string, date: string) {
    const now = new Date();
    const time = now.toTimeString().split(" ")[0].substring(0, 5);

    const { data: existing } = await supabase
        .from("attendance")
        .select("check_in")
        .eq("user_id", userId)
        .eq("date", date)
        .single();

    if (!existing?.check_in) throw new Error("No check-in found");

    const checkInTime = new Date(`${date}T${existing.check_in}`);
    const checkOutTime = new Date(`${date}T${time}`);
    const hoursWorked = (checkOutTime.getTime() - checkInTime.getTime()) /
        (1000 * 60 * 60);
    const overtime = Math.max(0, hoursWorked - 8);

    return upsertAttendance({
        user_id: userId,
        date,
        check_out: time,
        hours_worked: Number(hoursWorked.toFixed(2)),
        overtime: Number(overtime.toFixed(2)),
    });
}

// Mark employee as absent
export async function markAbsent(userId: string, date: string, notes?: string) {
    return upsertAttendance({
        user_id: userId,
        date,
        status: "absent",
        notes: notes || "Marked absent",
        hours_worked: 0,
        overtime: 0,
    });
}

// Delete attendance record
export async function deleteAttendance(id: string) {
    const { error } = await supabase
        .from("attendance")
        .delete()
        .eq("id", id);

    if (error) throw error;
}

// Helper function to map role to department
function getDepartmentFromRole(role?: string): string {
    const departmentMap: Record<string, string> = {
        admin: "Management",
        manager: "Management",
        driver: "Operations",
        guide: "Operations",
        staff: "Support",
        finance: "Finance",
        booking: "Booking",
    };
    return departmentMap[role || ""] || "General";
}

// Export helper for use in components
export { getDepartmentFromRole };
