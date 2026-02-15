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

    // Verify the caller is an admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Authorization required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user: callerUser }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !callerUser) {
      return new Response(
        JSON.stringify({ error: "Invalid token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check admin role
    const { data: adminRole } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", callerUser.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!adminRole) {
      return new Response(
        JSON.stringify({ error: "Admin access required" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { request_id, action, admin_notes } = await req.json();

    if (!request_id || !action || !["approved", "rejected"].includes(action)) {
      return new Response(
        JSON.stringify({ error: "request_id and action (approved/rejected) are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch the registration request
    const { data: request, error: fetchError } = await supabase
      .from("registration_requests")
      .select("*")
      .eq("id", request_id)
      .single();

    if (fetchError || !request) {
      return new Response(
        JSON.stringify({ error: "Registration request not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (request.status !== "pending") {
      return new Response(
        JSON.stringify({ error: "This request has already been processed" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "approved") {
      // Create the user account via Supabase Auth admin API
      // Generate a random temporary password
      const tempPassword = crypto.randomUUID().slice(0, 16) + "Aa1!";

      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: request.email,
        password: tempPassword,
        email_confirm: true,
      });

      if (createError) {
        throw new Error(`Failed to create user account: ${createError.message}`);
      }

      // Update the registration request status
      await supabase
        .from("registration_requests")
        .update({
          status: "approved",
          admin_notes: admin_notes || null,
          reviewed_by: callerUser.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", request_id);

      // Generate a password reset link so the user can set their own password
      const { data: resetData, error: resetError } = await supabase.auth.admin.generateLink({
        type: "recovery",
        email: request.email,
      });

      const resetLink = resetData?.properties?.action_link || "";

      // Send approval email with password reset link
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "ImpactLink <onboarding@resend.dev>",
          to: [request.email],
          subject: "✅ Your ImpactLink Account Has Been Approved!",
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #16a34a, #15803d); border-radius: 16px; padding: 32px; margin-bottom: 24px;">
                <h1 style="color: #ffffff; margin: 0 0 8px 0; font-size: 24px;">Welcome to ImpactLink! ✅</h1>
                <p style="color: rgba(255,255,255,0.85); margin: 0; font-size: 16px;">Your registration has been approved</p>
              </div>
              
              <div style="background: #f8fafc; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
                <p style="margin: 0 0 16px 0; color: #1e293b; font-size: 14px;">
                  Hi ${request.name},
                </p>
                <p style="margin: 0 0 16px 0; color: #1e293b; font-size: 14px;">
                  Great news! Your registration request for ImpactLink has been approved. 
                  Please click the link below to set your password and get started:
                </p>
                ${resetLink ? `
                <a href="${resetLink}" style="display: inline-block; background: #1a365d; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
                  Set Your Password
                </a>
                ` : `
                <p style="color: #64748b; font-size: 14px;">Please visit ImpactLink and use the password reset feature to set your password.</p>
                `}
              </div>

              <p style="color: #64748b; font-size: 14px;">Once you've set your password, you can sign in and complete your profile.</p>
              
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
              <p style="color: #94a3b8; font-size: 12px; margin: 0;">ImpactLink — Connecting Research & Practice in Child Welfare</p>
            </div>
          `,
        }),
      });

      return new Response(
        JSON.stringify({ success: true, action: "approved", user_id: newUser.user.id }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );

    } else {
      // Rejected
      await supabase
        .from("registration_requests")
        .update({
          status: "rejected",
          admin_notes: admin_notes || null,
          reviewed_by: callerUser.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", request_id);

      // Send rejection email
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "ImpactLink <onboarding@resend.dev>",
          to: [request.email],
          subject: "ImpactLink Registration Update",
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #1a365d, #2d5a87); border-radius: 16px; padding: 32px; margin-bottom: 24px;">
                <h1 style="color: #ffffff; margin: 0 0 8px 0; font-size: 24px;">Registration Update</h1>
                <p style="color: rgba(255,255,255,0.85); margin: 0; font-size: 16px;">ImpactLink account request</p>
              </div>
              
              <div style="background: #f8fafc; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
                <p style="margin: 0 0 16px 0; color: #1e293b; font-size: 14px;">
                  Hi ${request.name},
                </p>
                <p style="margin: 0 0 16px 0; color: #1e293b; font-size: 14px;">
                  Thank you for your interest in ImpactLink. After reviewing your registration request, 
                  we are unable to approve your account at this time.
                </p>
                ${admin_notes ? `
                <div style="background: #fffbeb; border-left: 4px solid #f59e0b; border-radius: 0 8px 8px 0; padding: 16px; margin-bottom: 16px;">
                  <p style="margin: 0 0 4px 0; color: #92400e; font-size: 12px; font-weight: 600; text-transform: uppercase;">Note from Admin</p>
                  <p style="margin: 0; color: #451a03; font-size: 14px;">${admin_notes}</p>
                </div>
                ` : ""}
                <p style="margin: 0; color: #64748b; font-size: 14px;">
                  If you believe this was in error, please contact us for more information.
                </p>
              </div>
              
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
              <p style="color: #94a3b8; font-size: 12px; margin: 0;">ImpactLink — Connecting Research & Practice in Child Welfare</p>
            </div>
          `,
        }),
      });

      return new Response(
        JSON.stringify({ success: true, action: "rejected" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  } catch (error: unknown) {
    console.error("Error processing registration:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
