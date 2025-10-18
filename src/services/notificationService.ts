import { supabase } from "@/lib/supabase";

export type NotificationType = "info" | "success" | "warning" | "error";

export interface AppNotification {
  id: string;
  created_at: string;
  title: string;
  message: string;
  type: NotificationType;
  event: string;
  target_user_id: string;
  actor_user_id?: string | null;
  metadata: Record<string, any>;
  read_at?: string | null;
  dismissed_at?: string | null;
}

async function getUserIdsByRole(role: string): Promise<string[]> {
  const { data, error } = await supabase
    .from("users")
    .select("id")
    .eq("role", role)
    .eq("is_active", true);
  if (error) throw error;
  return (data || []).map((u) => u.id);
}

export async function notifyUser(params: {
  targetUserId: string;
  title: string;
  message: string;
  type?: NotificationType;
  event: string;
  actorUserId?: string;
  metadata?: Record<string, any>;
}): Promise<AppNotification> {
  const { data, error } = await supabase
    .from("notifications")
    .insert({
      target_user_id: params.targetUserId,
      title: params.title,
      message: params.message,
      type: params.type || "info",
      event: params.event,
      actor_user_id: params.actorUserId || null,
      metadata: params.metadata || {},
    })
    .select("*")
    .single();
  if (error) throw error;
  return data as AppNotification;
}

export async function notifyRole(params: {
  role: string;
  title: string;
  message: string;
  type?: NotificationType;
  event: string;
  actorUserId?: string;
  metadata?: Record<string, any>;
}): Promise<AppNotification[]> {
  const userIds = await getUserIdsByRole(params.role);
  if (userIds.length === 0) return [];

  const payloads = userIds.map((uid) => ({
    target_user_id: uid,
    title: params.title,
    message: params.message,
    type: params.type || "info",
    event: params.event,
    actor_user_id: params.actorUserId || null,
    metadata: params.metadata || {},
  }));

  const { data, error } = await supabase
    .from("notifications")
    .insert(payloads)
    .select("*");
  if (error) throw error;
  return (data || []) as AppNotification[];
}

export async function markNotificationRead(notificationId: string) {
  // Verify user is authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    console.error("User not authenticated:", authError);
    throw new Error("You must be logged in to mark notifications as read");
  }

  const { data, error, count } = await supabase
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("id", notificationId)
    .select();
  
  return data[0];
}

export async function dismissNotification(notificationId: string) {
  // Verify user is authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    throw new Error("You must be logged in to dismiss notifications");
  }

  const { error } = await supabase
    .from("notifications")
    .update({ dismissed_at: new Date().toISOString() })
    .eq("id", notificationId);
  
  if (error) {
    console.error("Error dismissing notification:", error);
    throw error;
  }
}

export async function listUnreadNotifications() {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .is("dismissed_at", null)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []) as AppNotification[];
}

export async function listAllNotifications(limit = 50) {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data || []) as AppNotification[];
}