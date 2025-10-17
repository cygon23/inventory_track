import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export const useUrgentMessages = () => {
    const [urgentMessages, setUrgentMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUrgentMessages();

        const channel = supabase
            .channel("urgent-messages")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "conversations" },
                () => fetchUrgentMessages(),
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const fetchUrgentMessages = async () => {
        try {
            const { data, error } = await supabase
                .from("conversation_details")
                .select("*")
                .in("priority", ["urgent", "high"])
                .in("status", ["open", "pending"])
                .order("last_message_at", { ascending: false })
                .limit(3);

            if (error) throw error;
            setUrgentMessages(data || []);
        } catch (error) {
            console.error("Error fetching urgent messages:", error);
        } finally {
            setLoading(false);
        }
    };

    return { urgentMessages, loading };
};
