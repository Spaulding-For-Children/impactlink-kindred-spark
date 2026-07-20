import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.110.7";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface PolicySettings {
  password_strength_enabled?: boolean;
  password_min_length?: number;
  password_require_uppercase?: boolean;
  password_require_numbers?: boolean;
  password_require_special?: boolean;
}

function validate(pw: string, s: PolicySettings): string | null {
  const min = s.password_min_length ?? 8;
  if (pw.length < Math.max(min, 6)) return `Password must be at least ${Math.max(min, 6)} characters`;
  if (!s.password_strength_enabled) return null;
  if (s.password_require_uppercase && !/[A-Z]/.test(pw)) return "Password must contain an uppercase letter";
  if (s.password_require_numbers && !/[0-9]/.test(pw)) return "Password must contain a number";
  if (s.password_require_special && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pw))
    return "Password must contain a special character";
  return null;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { password } = await req.json();
    if (typeof password !== "string" || password.length > 200) {
      return new Response(JSON.stringify({ error: "Invalid password" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(supabaseUrl, serviceKey);
    const { data: settingRow } = await admin
      .from("site_settings")
      .select("value")
      .eq("key", "security")
      .maybeSingle();
    const policy = (settingRow?.value ?? {}) as PolicySettings;

    const err = validate(password, policy);
    if (err) {
      return new Response(JSON.stringify({ error: err }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { error: updErr } = await admin.auth.admin.updateUserById(userData.user.id, { password });
    if (updErr) {
      return new Response(JSON.stringify({ error: updErr.message }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
