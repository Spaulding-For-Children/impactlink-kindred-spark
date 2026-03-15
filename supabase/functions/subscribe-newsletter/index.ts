import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ error: "Valid email is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Store subscription in site_settings under newsletter_subscribers key
    const { data: existing } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "newsletter_subscribers")
      .maybeSingle();

    const subscribers: string[] = existing?.value?.emails || [];
    
    if (subscribers.includes(email.toLowerCase())) {
      return new Response(JSON.stringify({ success: true, message: "Already subscribed" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    subscribers.push(email.toLowerCase());

    await supabase
      .from("site_settings")
      .upsert({
        key: "newsletter_subscribers",
        value: { emails: subscribers },
        updated_at: new Date().toISOString(),
      }, { onConflict: "key" });

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
