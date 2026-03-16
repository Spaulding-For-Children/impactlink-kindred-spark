import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
  if (!RESEND_API_KEY) {
    return new Response(JSON.stringify({ error: "RESEND_API_KEY not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  try {
    // Verify admin
    const authHeader = req.headers.get("authorization");
    const anonClient = createClient(
      SUPABASE_URL,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader! } } }
    );
    const { data: { user } } = await anonClient.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleData) {
      return new Response(JSON.stringify({ error: "Admin access required" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { prospect_ids, subject, body, from_name } = await req.json();

    if (!prospect_ids || !Array.isArray(prospect_ids) || prospect_ids.length === 0) {
      return new Response(JSON.stringify({ error: "prospect_ids array is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!subject || !body) {
      return new Response(JSON.stringify({ error: "subject and body are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch prospects with emails
    const { data: prospects, error: fetchErr } = await supabase
      .from("prospects")
      .select("id, name, email, organization, suggested_outreach")
      .in("id", prospect_ids);

    if (fetchErr) throw fetchErr;

    const withEmail = (prospects || []).filter((p: any) => p.email);
    const withoutEmail = (prospects || []).length - withEmail.length;

    let sent = 0;
    let failed = 0;
    const errors: string[] = [];

    for (const prospect of withEmail) {
      // Personalize the body with placeholders
      const personalizedBody = body
        .replace(/\{name\}/g, prospect.name || "there")
        .replace(/\{organization\}/g, prospect.organization || "your organization")
        .replace(/\{suggested_outreach\}/g, prospect.suggested_outreach || "");

      const personalizedSubject = subject
        .replace(/\{name\}/g, prospect.name || "there")
        .replace(/\{organization\}/g, prospect.organization || "your organization");

      try {
        const emailRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: `${from_name || "ImpactLink"} <onboarding@resend.dev>`,
            to: [prospect.email],
            subject: personalizedSubject,
            html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              ${personalizedBody.split("\n").map((line: string) => `<p style="margin: 0 0 12px 0; line-height: 1.6; color: #333;">${line}</p>`).join("")}
            </div>`,
          }),
        });

        if (emailRes.ok) {
          sent++;
          // Update outreach status
          await supabase
            .from("prospects")
            .update({ outreach_status: "contacted", updated_at: new Date().toISOString() })
            .eq("id", prospect.id);
        } else {
          const errBody = await emailRes.text();
          failed++;
          errors.push(`${prospect.name}: ${errBody}`);
        }
      } catch (e: unknown) {
        failed++;
        errors.push(`${prospect.name}: ${e instanceof Error ? e.message : "Unknown error"}`);
      }

      // Small delay to avoid rate limiting
      if (withEmail.length > 1) {
        await new Promise((r) => setTimeout(r, 200));
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        sent,
        failed,
        skipped_no_email: withoutEmail,
        errors: errors.length > 0 ? errors : undefined,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Prospect outreach error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
