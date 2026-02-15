import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function generateICS(event: {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string | null;
  is_virtual: boolean;
  virtual_link: string | null;
}): string {
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  };

  const uid = crypto.randomUUID();
  const now = formatDate(new Date().toISOString());
  const dtStart = formatDate(event.start_date);
  const dtEnd = formatDate(event.end_date);
  const location = event.is_virtual && event.virtual_link
    ? event.virtual_link
    : event.location || "TBD";

  const description = event.description.replace(/\n/g, "\\n").replace(/,/g, "\\,");

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//ImpactLink//Events//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:REQUEST",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${now}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { event_id, user_id } = await req.json();

    if (!event_id || !user_id) {
      return new Response(
        JSON.stringify({ error: "event_id and user_id are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch event details
    const { data: event, error: eventError } = await supabase
      .from("events")
      .select("*")
      .eq("id", event_id)
      .single();

    if (eventError || !event) {
      throw new Error("Event not found: " + (eventError?.message || ""));
    }

    // Fetch user email
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(user_id);

    if (userError || !userData?.user?.email) {
      throw new Error("User not found: " + (userError?.message || ""));
    }

    const userEmail = userData.user.email;

    // Generate .ics file
    const icsContent = generateICS(event);
    const icsBase64 = btoa(icsContent);

    // Format dates for email
    const startDate = new Date(event.start_date);
    const endDate = new Date(event.end_date);
    const dateOptions: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZoneName: "short",
    };
    const formattedStart = startDate.toLocaleDateString("en-US", dateOptions);
    const formattedEnd = endDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      timeZoneName: "short",
    });

    const locationText = event.is_virtual
      ? `Virtual Event${event.virtual_link ? ` — <a href="${event.virtual_link}">Join Here</a>` : ""}`
      : event.location || "TBD";

    // Send email via Resend
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "ImpactLink <onboarding@resend.dev>",
        to: [userEmail],
        subject: `✅ Registered: ${event.title}`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #1a365d, #2d5a87); border-radius: 16px; padding: 32px; margin-bottom: 24px;">
              <h1 style="color: #ffffff; margin: 0 0 8px 0; font-size: 24px;">You're Registered! 🎉</h1>
              <p style="color: rgba(255,255,255,0.85); margin: 0; font-size: 16px;">Your spot has been confirmed.</p>
            </div>
            
            <div style="background: #f8fafc; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
              <h2 style="margin: 0 0 16px 0; color: #1a365d; font-size: 20px;">${event.title}</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px; width: 80px;">When</td>
                  <td style="padding: 8px 0; color: #1e293b; font-size: 14px;">${formattedStart} — ${formattedEnd}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Where</td>
                  <td style="padding: 8px 0; color: #1e293b; font-size: 14px;">${locationText}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Type</td>
                  <td style="padding: 8px 0; color: #1e293b; font-size: 14px; text-transform: capitalize;">${event.event_type}</td>
                </tr>
                ${event.host_organization ? `<tr><td style="padding: 8px 0; color: #64748b; font-size: 14px;">Host</td><td style="padding: 8px 0; color: #1e293b; font-size: 14px;">${event.host_organization}</td></tr>` : ""}
              </table>
            </div>

            <p style="color: #64748b; font-size: 14px; line-clamp: 3;">${event.description.substring(0, 300)}${event.description.length > 300 ? "..." : ""}</p>

            <p style="color: #64748b; font-size: 13px; margin-top: 24px;">📎 A calendar invite (.ics) is attached — add it to your calendar so you don't miss it!</p>
            
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
            <p style="color: #94a3b8; font-size: 12px; margin: 0;">ImpactLink — Connecting Research & Practice in Child Welfare</p>
          </div>
        `,
        attachments: [
          {
            filename: "event.ics",
            content: icsBase64,
            content_type: "text/calendar",
          },
        ],
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
    console.error("Error sending event notification:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
