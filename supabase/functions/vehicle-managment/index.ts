import { serve } from "https://deno.land/std@0.203.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(supabaseUrl, supabaseKey);

serve(async (req) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  try {
    const { action, data } = await req.json();

    switch (action) {
      case "addVehicle": {
        const {
          model,
          year,
          plate,
          status,
          condition,
          driver_id,
          current_trip_id,
          mileage,
          fuel_level,
          last_service,
          next_service,
          service_due,
          capacity,
          features,
        } = data;

        const { data: vehicle, error } = await supabase
          .from("vehicles")
          .insert([
            {
              model,
              year,
              plate,
              status,
              condition,
              driver_id,
              current_trip_id,
              mileage,
              fuel_level,
              last_service,
              next_service,
              service_due,
              capacity,
              features,
            },
          ])
          .select()
          .single();

        if (error) throw error;

        return new Response(JSON.stringify({ vehicle }), {
          status: 200,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
        });
      }

      case "fetchVehicles": {
        const { data: vehicles, error } = await supabase
          .from("vehicles")
          .select(`
              *,
              vehicle_maintenance(*),
              vehicle_issues(*)
            `);

        if (error) throw error;

        return new Response(JSON.stringify({ vehicles }), {
          status: 200,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
        });
      }

      case "assignDriver": {
        const { vehicle_id, driver_id } = data;

        const { data: vehicle, error } = await supabase
          .from("vehicles")
          .update({ driver_id })
          .eq("id", vehicle_id)
          .select()
          .single();

        if (error) throw error;

        return new Response(JSON.stringify({ vehicle }), {
          status: 200,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
        });
      }

      case "addMaintenance": {
        const { vehicle_id, type, date, cost, description } = data;

        const { data: maintenance, error } = await supabase
          .from("vehicle_maintenance")
          .insert([{ vehicle_id, type, date, cost, description }])
          .select()
          .single();

        if (error) throw error;

        return new Response(JSON.stringify({ maintenance }), {
          status: 200,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
        });
      }

      case "addIssue": {
        const { vehicle_id, type, description, reported_date, status } = data;

        const { data: issue, error } = await supabase
          .from("vehicle_issues")
          .insert([{ vehicle_id, type, description, reported_date, status }])
          .select()
          .single();

        if (error) throw error;

        return new Response(JSON.stringify({ issue }), {
          status: 200,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
        });
      }

      default:
        return new Response(JSON.stringify({ error: "Unknown action" }), {
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
        });
    }
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    });
  }
});
