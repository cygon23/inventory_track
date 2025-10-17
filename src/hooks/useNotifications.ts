import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { AppNotification } from "@/services/notificationService";

export function useNotifications() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .is("dismissed_at", null)
      .order("created_at", { ascending: false });
    if (!error) setNotifications((data || []) as AppNotification[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();

    const channel = supabase
      .channel("notifications_realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notifications" },
        (payload) => {
          // Re-fetch for simplicity; could apply granular updates
          load();
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [load]);

  return { notifications, loading, reload: load };
}
