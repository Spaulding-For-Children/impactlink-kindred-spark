import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

  if (!LOVABLE_API_KEY) {
    return new Response(JSON.stringify({ error: "LOVABLE_API_KEY not configured" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const authHeader = req.headers.get("authorization") || "";
    const anon = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { data: { user } } = await anon.auth.getUser();
    if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });

    const { data: roleData } = await admin
      .from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle();
    if (!roleData) return new Response(JSON.stringify({ error: "Admin required" }), { status: 403, headers: corsHeaders });

    const { section_id, extra_context } = await req.json();
    if (!section_id) throw new Error("section_id required");

    const { data: section, error: sErr } = await admin
      .from("rfp_sections").select("*").eq("id", section_id).single();
    if (sErr) throw sErr;

    // Gather platform context
    const [topicsRes, popsRes, resourcesRes, profilesRes] = await Promise.all([
      admin.from("research_topics").select("name"),
      admin.from("research_populations").select("name"),
      admin.from("resources").select("title, category, resource_type").limit(20),
      admin.from("profiles").select("profile_type", { count: "exact" }),
    ]);

    const platformContext = `
PLATFORM SUMMARY:
This is a research-practice platform connecting Students, Researchers/University Faculty, and Agencies working on child welfare, family services, and social work.

Core features: unified directory, collaboration requests, research question board, forums, events (workshops/webinars/conferences), toolkits & guides, datasets & analysis tools, admin analytics, security controls (2FA/session timeout/password policy), taxonomy management, prospect discovery via Perplexity + Lovable AI, in-app notifications, role-based user guides, newsletter, CSV import across major entities.

Research topics on platform: ${(topicsRes.data || []).map((t: any) => t.name).join(", ") || "(seed topics)"}
Target populations: ${(popsRes.data || []).map((p: any) => p.name).join(", ") || "(seed populations)"}
Sample resources: ${(resourcesRes.data || []).map((r: any) => r.title).slice(0, 10).join("; ")}
Approx registered profiles: ${profilesRes.count || 0}
`;

    const prompt = `You are drafting section "${section.title}" (group: ${section.group_name}) of a comprehensive RFP / NOFO grant application narrative for this platform.

${platformContext}

${extra_context ? `Additional guidance from admin:\n${extra_context}\n` : ""}

Requirements for THIS section:
- Full narrative paragraph style (NOT bullet lists as the primary format; may use short bulleted lists inside a paragraph only when genuinely helpful).
- Comprehensive, specific, tied to the platform's actual features, roles, taxonomy, and workflows described above.
- 600-1200 words.
- Where relevant, cite evidence-based frameworks (Implementation Science, CQI, trauma-informed practice, community-based participatory research, IRB/HIPAA/FERPA, Kirkpatrick evaluation, logic-model theory, etc.).
- Grant-reviewer tone: rigorous, plain-language, no marketing fluff.
- Output pure Markdown (no code fences). Start with a level-3 heading "### ${section.title}".
`;

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You are a senior grant writer producing polished RFP/NOFO narrative sections." },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!aiRes.ok) {
      const err = await aiRes.text();
      throw new Error(`AI error [${aiRes.status}]: ${err}`);
    }

    const aiData = await aiRes.json();
    const content = aiData.choices?.[0]?.message?.content?.trim() || "";

    const { error: upErr } = await admin
      .from("rfp_sections")
      .update({ content_markdown: content, updated_by: user.id, updated_at: new Date().toISOString() })
      .eq("id", section_id);
    if (upErr) throw upErr;

    return new Response(JSON.stringify({ success: true, content }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("generate-rfp-section error:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
