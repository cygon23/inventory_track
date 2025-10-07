import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

serve(async (req) => {
  // Handle preflight OPTIONS request for CORS
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
    const body = await req.json();
    const { action, data } = body;

    switch (action) {
      // ---------------- CREATE DRIVER ----------------
      case "createDriver": {
        const { data: authUser, error: authError } = await supabase.auth.admin
          .createUser({
            email: data.email,
            email_confirm: true,
            password: data.password || crypto.randomUUID(),
          });
        if (authError) throw authError;

        const userId = authUser.user.id;

        const { error: userError } = await supabase.from("users").insert({
          id: userId,
          name: data.name,
          email: data.email,
          phone: data.phone,
          role: "driver",
          status: "active",
        });
        if (userError) throw userError;

        const { data: vehicle, error: vehicleError } = await supabase
          .from("vehicles")
          .insert({
            model: data.vehicle_model,
            plate: data.vehicle_plate,
            year: data.vehicle_year,
          })
          .select()
          .single();
        if (vehicleError) throw vehicleError;

        const { data: driver, error: driverError } = await supabase
          .from("drivers")
          .insert({
            user_id: userId,
            experience: data.experience,
            languages: data.languages,
            specialties: data.specialties,
            rating: 0,
            total_trips: 0,
            average_rating: 0,
            on_time_percentage: 0,
            next_available: new Date().toISOString(),
          })
          .select()
          .single();
        if (driverError) throw driverError;

        // 5. Assign vehicle to driver
        const { error: updateVehicleError } = await supabase
          .from("vehicles")
          .update({ driver_id: driver.id })
          .eq("id", vehicle.id);
        if (updateVehicleError) throw updateVehicleError;

        const scheduleInserts = Array.from({ length: 7 }, (_, i) => ({
          driver_id: driver.id,
          day_of_week: i,
          available: true,
          trip_id: null,
          notes: null,
        }));
        const { error: scheduleError } = await supabase
          .from("driver_schedule")
          .insert(scheduleInserts);
        if (scheduleError) throw scheduleError;

        return jsonRes({ driver });
      }

      // ---------------- GET ALL DRIVERS ----------------
     case "getAllDrivers": {
        const { data: drivers, error } = await supabase
          .from("drivers")
          .select(`
            *,
            user:users(id, email, name, phone, role, status),
            vehicle:vehicles(id, model, plate, year),
            trips!trips_driver_id_fkey(id, status, end_date)
          `)
          .order("created_at", { ascending: false });
        if (error) throw error;
        return jsonRes({ drivers });
      }

      // ---------------- GET DRIVER BY ID ----------------
      case "getDriverById": {
        const { data: driver, error } = await supabase
          .from("drivers")
          .select(`
            *,
            user:users(*),
            vehicle:vehicles(*)
          `)
          .eq("id", data.driverId)
          .single();
        if (error) throw error;
        return jsonRes({ driver });
      }

      // ---------------- UPDATE DRIVER ----------------
      case "updateDriver": {
        const { data: driver, error } = await supabase
          .from("drivers")
          .update(data.updates)
          .eq("id", data.driverId)
          .select()
          .single();
        if (error) throw error;
        return jsonRes({ driver });
      }

      // ---------------- GET DRIVER SCHEDULE ----------------
      case "getDriverSchedule": {
        const { data: schedule, error } = await supabase
          .from("driver_schedule")
          .select("*")
          .eq("driver_id", data.driverId)
          .order("day_of_week", { ascending: true });
        if (error) throw error;
        return jsonRes({ schedule });
      }

      // ---------------- UPDATE SCHEDULE DAY ----------------
      case "updateScheduleDay": {
        const { data: schedule, error } = await supabase
          .from("driver_schedule")
          .update(data.updates)
          .eq("id", data.scheduleId)
          .select()
          .single();
        if (error) throw error;
        return jsonRes({ schedule });
      }

      // ---------------- GET AVAILABLE DRIVERS ----------------
      case "getAvailableDrivers": {
        const dayOfWeek = new Date(data.date).getDay();
        const { data: available, error } = await supabase
          .from("driver_schedule")
          .select(`
            *,
            driver:drivers(
              *,
              user:users(*),
              vehicle:vehicles(*)
            )
          `)
          .eq("day_of_week", dayOfWeek)
          .eq("available", true)
          .is("trip_id", null);
        if (error) throw error;
        return jsonRes({ available });
      }

      default:
        return new Response(
          JSON.stringify({ error: "Invalid action" }),
          {
            status: 400,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          },
        );
    }
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      status: 400,
    });
  }
});

// JSON helper
function jsonRes(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    status,
  });
}
