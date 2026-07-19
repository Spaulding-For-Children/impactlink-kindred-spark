import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface OsvVuln {
  id: string;
  summary?: string;
  details?: string;
  database_specific?: { severity?: string };
  severity?: Array<{ type: string; score: string }>;
  affected?: Array<{
    ranges?: Array<{ events?: Array<{ fixed?: string }> }>;
  }>;
  references?: Array<{ url: string }>;
}

async function queryOsv(pkg: string, version: string): Promise<OsvVuln[]> {
  try {
    const res = await fetch("https://api.osv.dev/v1/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        package: { name: pkg, ecosystem: "npm" },
        version,
      }),
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.vulns || [];
  } catch (e) {
    console.error(`OSV lookup failed for ${pkg}@${version}:`, e);
    return [];
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

  const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  try {
    // Load snapshot
    const { data: deps, error: depsErr } = await admin
      .from("dependency_snapshot")
      .select("package_name, installed_version");
    if (depsErr) throw depsErr;

    const foundAdvisories: any[] = [];
    for (const dep of deps || []) {
      const vulns = await queryOsv(dep.package_name, dep.installed_version);
      for (const v of vulns) {
        const fixed = v.affected?.[0]?.ranges?.[0]?.events?.find((e) => e.fixed)?.fixed || null;
        const severity =
          v.database_specific?.severity ||
          v.severity?.[0]?.score ||
          "UNKNOWN";
        foundAdvisories.push({
          advisory_id: v.id,
          package_name: dep.package_name,
          installed_version: dep.installed_version,
          severity: String(severity).toUpperCase(),
          summary: v.summary || v.details?.slice(0, 500) || "No summary",
          fixed_version: fixed,
          advisory_url: v.references?.[0]?.url || `https://osv.dev/vulnerability/${v.id}`,
        });
      }
    }

    // Dedup existing
    const { data: existing } = await admin
      .from("dependency_advisories")
      .select("advisory_id");
    const existingIds = new Set((existing || []).map((e: any) => e.advisory_id));

    const newAdvisories = foundAdvisories.filter((a) => !existingIds.has(a.advisory_id));

    if (newAdvisories.length > 0) {
      await admin.from("dependency_advisories").insert(newAdvisories);

      // Notify admins in-app
      const { data: admins } = await admin
        .from("user_roles").select("user_id").eq("role", "admin");
      const notifications = (admins || []).flatMap((a: any) =>
        newAdvisories.map((adv) => ({
          user_id: a.user_id,
          title: `New ${adv.severity} vulnerability: ${adv.package_name}`,
          message: adv.summary?.slice(0, 200) || adv.advisory_id,
          type: "security_alert",
          action_url: "/admin",
          read: false,
        }))
      );
      if (notifications.length > 0) {
        await admin.from("notifications").insert(notifications);
      }

      // Email admins
      if (RESEND_API_KEY) {
        const { data: adminProfiles } = await admin
          .from("profiles")
          .select("email")
          .in("id", (admins || []).map((a: any) => a.user_id));
        const emails = (adminProfiles || []).map((p: any) => p.email).filter(Boolean);
        if (emails.length > 0) {
          const list = newAdvisories.slice(0, 20).map((a) =>
            `<li><strong>${a.severity}</strong> — ${a.package_name}@${a.installed_version}: ${a.summary || a.advisory_id}${a.fixed_version ? ` (fixed in ${a.fixed_version})` : ""} — <a href="${a.advisory_url}">details</a></li>`
          ).join("");
          try {
            await fetch("https://api.resend.com/emails", {
              method: "POST",
              headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
              body: JSON.stringify({
                from: "Security Alerts <onboarding@resend.dev>",
                to: emails,
                subject: `${newAdvisories.length} new dependency vulnerability alert${newAdvisories.length === 1 ? "" : "s"}`,
                html: `<h2>New dependency advisories detected</h2><ul>${list}</ul><p>Review in the Admin panel.</p>`,
              }),
            });
          } catch (e) { console.error("Email send failed:", e); }
        }
      }

      await admin.from("dependency_advisories")
        .update({ notified: true })
        .in("advisory_id", newAdvisories.map((a) => a.advisory_id));
    }

    await admin.from("vulnerability_scan_runs").insert({
      advisories_found: foundAdvisories.length,
      new_advisories: newAdvisories.length,
      status: "ok",
    });

    return new Response(JSON.stringify({
      success: true,
      total_found: foundAdvisories.length,
      new_count: newAdvisories.length,
    }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("scan-dependencies error:", msg);
    await admin.from("vulnerability_scan_runs").insert({
      advisories_found: 0, new_advisories: 0, status: "error", error: msg,
    });
    return new Response(JSON.stringify({ error: msg }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
