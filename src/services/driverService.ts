const EDGE_FUNCTION_URL =
    "https://dzgrxteozcbxfrtsqqte.functions.supabase.co/create-driver";

async function callEdgeFunction(action: string, data?: any) {
    try {
        const res = await fetch(EDGE_FUNCTION_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action, data }),
        });

        const json = await res.json();

        if (!res.ok) throw new Error(json.error || "Unknown error");

        // Normalize return based on action
        switch (action) {
            case "getAllDrivers":
                return { data: json.drivers, error: null };
            case "getDriverById":
                return { data: json.driver, error: null };
            case "getDriverSchedule":
                return { data: json.schedule, error: null };
            case "getAvailableDrivers":
                return { data: json.available, error: null };
            case "createDriver":
            case "updateDriver":
            case "updateScheduleDay":
                return { data: json.driver || json.schedule, error: null };
            default:
                return { data: json, error: null };
        }
    } catch (error: any) {
        return { data: null, error: error.message };
    }
}

export const driverService = {
    getAllDrivers: () => callEdgeFunction("getAllDrivers"),
    getDriverById: (driverId: string) =>
        callEdgeFunction("getDriverById", { driverId }),
    getDriverSchedule: (driverId: string) =>
        callEdgeFunction("getDriverSchedule", { driverId }),
    getAvailableDrivers: (date: string) =>
        callEdgeFunction("getAvailableDrivers", { date }),
    createDriver: (driverData: any) =>
        callEdgeFunction("createDriver", driverData),
    updateDriver: (driverId: string, updates: any) =>
        callEdgeFunction("updateDriver", { driverId, updates }),
    updateScheduleDay: (scheduleId: string, updates: any) =>
        callEdgeFunction("updateScheduleDay", { scheduleId, updates }),
};
