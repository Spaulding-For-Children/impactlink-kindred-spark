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
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY not configured");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { collaboration_id, status, requester_profile_id, responder_profile_id } = await req.json();

    // Get responder profile (the person who accepted/declined)
    const { data: responder } = await supabase
      .from("profiles")
      .select("name, profile_type")
      .eq("id", responder_profile_id)
      .single();

    // Get requester profile + user_id to find email
    const { data: requester } = await supabase
      .from("profiles")
      .select("name, user_id")
      .eq("id", requester_profile_id)
      .single();

    if (!responder || !requester) throw new Error("Profiles not found");

    // Check requester's notification preferences
    const { data: requesterFull } = await supabase
      .from("profiles")
      .select("notification_preferences")
      .eq("id", requester_profile_id)
      .single();

    const prefs = (requesterFull?.notification_preferences as any) || {};
    const emailEnabled = prefs.email_collaboration_status !== false;

    const { data: userData } = await supabase.auth.admin.getUserById(requester.user_id);
    if (!userData?.user?.email) throw new Error("Requester email not found");

    const isAccepted = status === "accepted";
    const emoji = isAccepted ? "✅" : "❌";
    const statusText = isAccepted ? "Accepted" : "Declined";
    const color = isAccepted ? "#16a34a" : "#dc2626";

    // Create in-app notification
    await supabase.from("notifications").insert({
      user_id: requester.user_id,
      type: "collaboration",
      title: `Collaboration ${statusText}`,
      message: `${responder.name} has ${status} your collaboration request.`,
      link: "/collaboration",
    });

    // Send email only if user opted in
    if (emailEnabled) {
      await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "ImpactLink <onboarding@resend.dev>",
        to: [userData.user.email],
        subject: `${emoji} Collaboration Request ${statusText} — ${responder.name}`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: ${color}; border-radius: 16px; padding: 32px; margin-bottom: 24px;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Collaboration ${statusText} ${emoji}</h1>
            </div>
            <p style="color: #1e293b; font-size: 16px;">
              <strong>${responder.name}</strong> (${responder.profile_type}) has <strong>${status}</strong> your collaboration request.
            </p>
            ${isAccepted
              ? `<p style="color: #16a34a; font-size: 14px;">You can now collaborate together on ImpactLink!</p>`
              : `<p style="color: #64748b; font-size: 14px;">Don't worry — there are many other partners to connect with on ImpactLink.</p>`
            }
            <p style="color: #64748b; font-size: 14px;">Log in to ImpactLink to view your collaborations.</p>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
            <p style="color: #94a3b8; font-size: 12px;">ImpactLink — Connecting Research & Practice in Child Welfare</p>
          </div>
        `,
      }),
    });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
