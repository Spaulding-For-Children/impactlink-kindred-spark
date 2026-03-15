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

  const PERPLEXITY_API_KEY = Deno.env.get("PERPLEXITY_API_KEY");
  if (!PERPLEXITY_API_KEY) {
    return new Response(JSON.stringify({ error: "PERPLEXITY_API_KEY not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) {
    return new Response(JSON.stringify({ error: "LOVABLE_API_KEY not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  try {
    const authHeader = req.headers.get("authorization");
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Verify the caller is admin
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

    // Fetch current topics and populations
    const [topicsRes, popsRes] = await Promise.all([
      supabase.from("research_topics").select("name"),
      supabase.from("research_populations").select("name"),
    ]);

    const topics = (topicsRes.data || []).map((t: any) => t.name);
    const populations = (popsRes.data || []).map((p: any) => p.name);

    if (topics.length === 0) {
      return new Response(JSON.stringify({ error: "No research topics found. Add topics first." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create search record
    const { data: search, error: searchErr } = await supabase
      .from("prospect_searches")
      .insert({
        initiated_by: user.id,
        status: "in_progress",
        topics_used: topics,
        populations_used: populations,
      })
      .select()
      .single();

    if (searchErr) throw searchErr;

    // Step 1: Use Perplexity to find real organizations and researchers
    const perplexityPrompt = `Find real organizations, agencies, and university researchers/faculty who work on the following child welfare and social work research topics: ${topics.join(", ")}.
${populations.length > 0 ? `Target populations include: ${populations.join(", ")}.` : ""}

For each result, provide:
- Full name of person or organization
- Organization/university name
- Type (researcher or agency)
- Email (if publicly available)
- Phone (if publicly available)
- Website URL
- Location (city, state/country)
- Department or title
- Which of the listed topics they work on
- Source URL where you found this information

Focus on:
1. University faculty in social work, child welfare, family studies departments
2. Government child welfare agencies (federal, state, county)
3. Non-profit organizations focused on child welfare
4. Research centers and institutes

Provide at least 20 results. Include only real, verifiable organizations and people with actual web presences.`;

    const perplexityRes = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PERPLEXITY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "sonar-pro",
        messages: [
          {
            role: "system",
            content: "You are a research assistant helping identify organizations and researchers in child welfare. Return detailed, accurate results with real contact information when publicly available.",
          },
          { role: "user", content: perplexityPrompt },
        ],
      }),
    });

    if (!perplexityRes.ok) {
      const errBody = await perplexityRes.text();
      throw new Error(`Perplexity API error [${perplexityRes.status}]: ${errBody}`);
    }

    const perplexityData = await perplexityRes.json();
    const rawResults = perplexityData.choices?.[0]?.message?.content || "";
    const citations = perplexityData.citations || [];

    // Step 2: Use Lovable AI to structure the raw results into JSON
    const structurePrompt = `Parse the following research prospect data into a JSON array. Each item should have these exact fields:
- name (string, required)
- organization (string)
- prospect_type ("researcher" or "agency")
- email (string or null)
- phone (string or null)
- website (string or null)
- location (string or null)
- department_title (string or null)
- relevant_topics (string array - matching topics from this list: ${topics.join(", ")})
- relevance_score (integer 0-100 based on how closely they match the topics)
- suggested_outreach (a brief personalized outreach message)
- source_url (string or null)

Here are citation URLs that may be useful as source_urls: ${citations.join(", ")}

Raw data to parse:
${rawResults}

Return ONLY a valid JSON array, no other text.`;

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: "You parse unstructured text into clean JSON. Return only valid JSON arrays.",
          },
          { role: "user", content: structurePrompt },
        ],
      }),
    });

    if (!aiRes.ok) {
      const errBody = await aiRes.text();
      throw new Error(`Lovable AI error [${aiRes.status}]: ${errBody}`);
    }

    const aiData = await aiRes.json();
    let structuredText = aiData.choices?.[0]?.message?.content || "[]";

    // Clean markdown code fences if present
    structuredText = structuredText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    let prospects: any[];
    try {
      prospects = JSON.parse(structuredText);
    } catch {
      // If parsing fails, update search with error
      await supabase
        .from("prospect_searches")
        .update({ status: "error", error_message: "Failed to parse AI response", completed_at: new Date().toISOString() })
        .eq("id", search.id);

      return new Response(JSON.stringify({ error: "Failed to parse prospect data", raw: structuredText }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!Array.isArray(prospects)) prospects = [prospects];

    // Insert prospects
    const prospectRecords = prospects.map((p: any) => ({
      search_id: search.id,
      name: p.name || "Unknown",
      organization: p.organization || null,
      prospect_type: p.prospect_type === "agency" ? "agency" : "researcher",
      email: p.email || null,
      phone: p.phone || null,
      website: p.website || null,
      location: p.location || null,
      department_title: p.department_title || null,
      relevant_topics: Array.isArray(p.relevant_topics) ? p.relevant_topics : [],
      relevance_score: typeof p.relevance_score === "number" ? p.relevance_score : 50,
      suggested_outreach: p.suggested_outreach || null,
      source_url: p.source_url || null,
      outreach_status: "not_contacted",
    }));

    const { error: insertErr } = await supabase
      .from("prospects")
      .insert(prospectRecords);

    if (insertErr) throw insertErr;

    // Update search record
    await supabase
      .from("prospect_searches")
      .update({
        status: "completed",
        prospect_count: prospectRecords.length,
        completed_at: new Date().toISOString(),
      })
      .eq("id", search.id);

    return new Response(
      JSON.stringify({
        success: true,
        search_id: search.id,
        prospect_count: prospectRecords.length,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Prospect generation error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
