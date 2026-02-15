import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const ADMIN_EMAIL = "khenneman@spaulding.org";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY is not configured");

    const { name, email, organization, organization_type, phone_number } = await req.json();

    if (!name || !email) {
      return new Response(
        JSON.stringify({ error: "name and email are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "ImpactLink <onboarding@resend.dev>",
        to: [ADMIN_EMAIL],
        subject: `📋 New Registration Request: ${name}`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #1a365d, #2d5a87); border-radius: 16px; padding: 32px; margin-bottom: 24px;">
              <h1 style="color: #ffffff; margin: 0 0 8px 0; font-size: 24px;">New Registration Request 📋</h1>
              <p style="color: rgba(255,255,255,0.85); margin: 0; font-size: 16px;">Someone wants to join ImpactLink</p>
            </div>
            
            <div style="background: #f8fafc; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; color: #64748b; font-size: 14px; width: 140px; vertical-align: top;">Name</td>
                  <td style="padding: 10px 0; color: #1e293b; font-size: 14px; font-weight: 600;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #64748b; font-size: 14px; vertical-align: top;">Email</td>
                  <td style="padding: 10px 0; color: #1e293b; font-size: 14px;">${email}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #64748b; font-size: 14px; vertical-align: top;">Organization</td>
                  <td style="padding: 10px 0; color: #1e293b; font-size: 14px;">${organization}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #64748b; font-size: 14px; vertical-align: top;">Organization Type</td>
                  <td style="padding: 10px 0; color: #1e293b; font-size: 14px;">${organization_type}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #64748b; font-size: 14px; vertical-align: top;">Phone</td>
                  <td style="padding: 10px 0; color: #1e293b; font-size: 14px;">${phone_number}</td>
                </tr>
              </table>
            </div>

            <p style="color: #64748b; font-size: 14px;">Log in to the ImpactLink admin panel to review and approve or reject this request.</p>
            
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
    console.error("Error sending registration notification:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
