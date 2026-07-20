import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ALLOWED_UPDATE_KEYS = new Set([
  "brand_research",
  "effectiveness",
  "ai_visibility",
]);

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const body = await req.json().catch(() => ({}));
    const action = body?.action;

    if (action === "create") {
      const url = typeof body.url === "string" ? body.url.slice(0, 2048) : "";
      if (!url) {
        return new Response(JSON.stringify({ error: "url required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const firstName = typeof body.firstName === "string" ? body.firstName.slice(0, 120) : null;
      const email = typeof body.email === "string" ? body.email.slice(0, 320) : null;

      let leadId: string | null = null;
      if (firstName || email) {
        const { data: lead, error: leadErr } = await sb
          .from("leads")
          .insert({ first_name: firstName, email })
          .select("id")
          .single();
        if (leadErr) console.error("lead insert error", leadErr);
        leadId = lead?.id ?? null;
      }

      const { data: analysis, error: aErr } = await sb
        .from("brand_analyses")
        .insert({ lead_id: leadId, source_url: url })
        .select("id")
        .single();
      if (aErr) {
        return new Response(JSON.stringify({ error: "Failed to create analysis" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(
        JSON.stringify({ analysisId: analysis?.id ?? null, leadId }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if (action === "update") {
      const analysisId = typeof body.analysisId === "string" ? body.analysisId : "";
      if (!analysisId) {
        return new Response(JSON.stringify({ error: "analysisId required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const updates: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(body.updates ?? {})) {
        if (ALLOWED_UPDATE_KEYS.has(k)) updates[k] = v;
      }
      if (Object.keys(updates).length === 0) {
        return new Response(JSON.stringify({ ok: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const { error } = await sb.from("brand_analyses").update(updates).eq("id", analysisId);
      if (error) {
        return new Response(JSON.stringify({ error: "Failed to update analysis" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("save-analysis error", e);
    return new Response(JSON.stringify({ error: "Unexpected error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
