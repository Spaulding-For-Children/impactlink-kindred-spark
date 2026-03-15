import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY is not configured");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { collaboration_id, requester_profile_id, recipient_profile_id, message } = await req.json();

    if (!requester_profile_id || !recipient_profile_id) {
      return new Response(
        JSON.stringify({ error: "requester_profile_id and recipient_profile_id are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch requester profile
    const { data: requester, error: reqErr } = await supabase
      .from("profiles")
      .select("name, profile_type, institution, university, user_id")
      .eq("id", requester_profile_id)
      .single();
    if (reqErr || !requester) throw new Error("Requester profile not found");

    // Fetch recipient profile
    const { data: recipient, error: recErr } = await supabase
      .from("profiles")
      .select("name, profile_type, user_id")
      .eq("id", recipient_profile_id)
      .single();
    if (recErr || !recipient) throw new Error("Recipient profile not found");

    // Check notification preferences
    const { data: recipientFull } = await supabase
      .from("profiles")
      .select("notification_preferences")
      .eq("id", recipient_profile_id)
      .single();

    const prefs = (recipientFull?.notification_preferences as any) || {};
    const emailEnabled = prefs.email_collaboration_requests !== false;

    // Get recipient's email
    const { data: userData, error: userErr } = await supabase.auth.admin.getUserById(recipient.user_id);
    if (userErr || !userData?.user?.email) throw new Error("Recipient email not found");

    const recipientEmail = userData.user.email;

    if (!emailEnabled) {
      return new Response(
        JSON.stringify({ success: true, skipped: true, reason: "User opted out of collaboration request emails" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const affiliation = requester.institution || requester.university || "";
    const profileType = requester.profile_type.charAt(0).toUpperCase() + requester.profile_type.slice(1);

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "ImpactLink <onboarding@resend.dev>",
        to: [recipientEmail],
        subject: `🤝 New Collaboration Request from ${requester.name}`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #1a365d, #2d5a87); border-radius: 16px; padding: 32px; margin-bottom: 24px;">
              <h1 style="color: #ffffff; margin: 0 0 8px 0; font-size: 24px;">New Collaboration Request 🤝</h1>
              <p style="color: rgba(255,255,255,0.85); margin: 0; font-size: 16px;">Someone wants to partner with you!</p>
            </div>
            
            <div style="background: #f8fafc; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
              <h2 style="margin: 0 0 16px 0; color: #1a365d; font-size: 20px;">${requester.name}</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px; width: 100px;">Role</td>
                  <td style="padding: 8px 0; color: #1e293b; font-size: 14px;">${profileType}</td>
                </tr>
                ${affiliation ? `<tr><td style="padding: 8px 0; color: #64748b; font-size: 14px;">Affiliation</td><td style="padding: 8px 0; color: #1e293b; font-size: 14px;">${affiliation}</td></tr>` : ""}
              </table>
            </div>

            ${message ? `
            <div style="background: #fffbeb; border-left: 4px solid #f59e0b; border-radius: 0 8px 8px 0; padding: 16px; margin-bottom: 24px;">
              <p style="margin: 0 0 4px 0; color: #92400e; font-size: 12px; font-weight: 600; text-transform: uppercase;">Message</p>
              <p style="margin: 0; color: #451a03; font-size: 14px;">${message}</p>
            </div>
            ` : ""}

            <p style="color: #64748b; font-size: 14px;">Log in to ImpactLink to review and respond to this collaboration request.</p>
            
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
            <p style="color: #94a3b8; font-size: 12px; margin: 0;">ImpactLink — Connecting Research & Practice in Child Welfare</p>
          </div>
        `,
      }),
    });

    const emailResult = await emailResponse.json();
    if (!emailResponse.ok) {
      throw new Error(`Resend API error [${emailResponse.status}]: ${JSON.stringify(emailResult)}`);
    }

    return new Response(
      JSON.stringify({ success: true, email_id: emailResult.id }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Error sending collaboration notification:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
