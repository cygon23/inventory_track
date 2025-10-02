const EDGE_FUNCTION_URL =
    "https://dzgrxteozcbxfrtsqqte.functions.supabase.co/vehicle-managment";

export async function callVehicleFunction(action: string, data: any = {}) {
    try {
        const res = await fetch(EDGE_FUNCTION_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action, data }),
        });

        if (!res.ok) {
            const text = await res.text();
            throw new Error(
                text || "Error calling vehicle management function",
            );
        }

        return res.json();
    } catch (error) {
        console.error("Vehicle API error:", error);
        return { error };
    }
}
