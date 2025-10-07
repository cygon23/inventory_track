import { supabase } from "@/lib/supabase";

export async function getDriverIdFromUserId(
    userId: string,
): Promise<string | null> {
    const { data, error } = await supabase
        .from("drivers")
        .select("id")
        .eq("user_id", userId)
        .single();

    if (error) {
        console.error("Error fetching driver ID:", error);
        return null;
    }

    return data?.id || null;
}
