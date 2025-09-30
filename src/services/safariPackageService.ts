import { supabase } from "@/lib/supabaseClient";

export interface SafariPackage {
    id: string; // UUID
    name: string;
    price: number;
}

export async function getActiveSafariPackages(): Promise<
    { data: SafariPackage[] | null; error: any }
> {
    try {
        const { data, error } = await supabase
            .from("safari_packages")
            .select("id, name, price")
            .eq("is_active", true)
            .order("name");

        return { data, error };
    } catch (error) {
        console.error("Error fetching packages:", error);
        return { data: null, error };
    }
}
