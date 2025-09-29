// Supabase Edge Function: create-user
// Creates a new auth user and corresponding row in the public.users table.
// Requires the function to run with SUPABASE_SERVICE_ROLE_KEY (never expose to clients).

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.1";

const corsHeaders: HeadersInit = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json"
};

type Role =
  | "super_admin"
  | "admin"
  | "admin_helper"
  | "booking_manager"
  | "operations_coordinator"
  | "driver"
  | "finance_officer"
  | "customer_service";

interface CreateUserPayload {
  name: string;
  email: string;
  phone: string | null;
  role: Role;
  assigned_region: string | null;
  permissions: string[];
  is_active: boolean;
}

function generateTempPassword(length = 16): string {
  const charset = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*()_-+=";
  const array = new Uint32Array(length);
  crypto.getRandomValues(array);
  return Array.from(array).map((v) => charset[v % charset.length]).join("");
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !serviceRoleKey) {
      return new Response(JSON.stringify({ error: "Missing server configuration" }), { status: 500, headers: corsHeaders });
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    const payload = (await req.json()) as Partial<CreateUserPayload>;
    const name = (payload.name || "").toString().trim();
    const email = (payload.email || "").toString().trim().toLowerCase();
    const phone = payload.phone ?? null;
    const role = payload.role as Role | undefined;
    const assigned_region = payload.assigned_region ?? null;
    const permissions = Array.isArray(payload.permissions) ? payload.permissions : [];
    const is_active = payload.is_active ?? true;

    const allowedRoles: Role[] = [
      "super_admin",
      "admin",
      "admin_helper",
      "booking_manager",
      "operations_coordinator",
      "driver",
      "finance_officer",
      "customer_service",
    ];

    if (!name || !email || !role) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400, headers: corsHeaders });
    }
    if (!allowedRoles.includes(role)) {
      return new Response(JSON.stringify({ error: "Invalid role" }), { status: 400, headers: corsHeaders });
    }

    // Create auth user with a temporary password and mark email as confirmed
    const tempPassword = generateTempPassword();
    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true,
    });
    if (authError || !authData?.user) {
      return new Response(JSON.stringify({ error: authError?.message || "Failed to create auth user" }), { status: 400, headers: corsHeaders });
    }

    // Insert into public.users profile table
    const nowIso = new Date().toISOString();
    const { error: dbError } = await adminClient.from("users").insert({
      id: authData.user.id,
      name,
      email,
      role,
      avatar: null,
      is_active,
      last_login: null,
      permissions: permissions.length > 0 ? permissions : ["dashboard"],
      assigned_region,
      phone,
      created_at: nowIso,
      updated_at: nowIso,
    });
    if (dbError) {
      // Clean up auth user if database insert fails
      await adminClient.auth.admin.deleteUser(authData.user.id);
      return new Response(JSON.stringify({ error: dbError.message }), { status: 400, headers: corsHeaders });
    }

    return new Response(
      JSON.stringify({ success: true, user_id: authData.user.id, temp_password: tempPassword }),
      { status: 200, headers: corsHeaders }
    );
  } catch (err) {
    console.error("create-user function error", err);
    return new Response(JSON.stringify({ error: "Unexpected error" }), { status: 500, headers: corsHeaders });
  }
});

