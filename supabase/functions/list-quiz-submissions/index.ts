import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-admin-token",
};

// Admin-only: returns Conversation Map Quiz submissions plus fresh signed
// URLs for their stored export JSON. Gated by ADMIN_DASHBOARD_TOKEN secret.
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ADMIN_TOKEN = Deno.env.get("ADMIN_DASHBOARD_TOKEN");
    if (ADMIN_TOKEN) {
      const provided = req.headers.get("x-admin-token") || "";
      if (provided !== ADMIN_TOKEN) {
        return new Response(
          JSON.stringify({ error: "Unauthorized" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { data, error } = await sb
      .from("quiz_submissions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);

    if (error) throw error;

    const rows = await Promise.all(
      (data || []).map(async (r: Record<string, unknown>) => {
        let exportUrl: string | null = null;
        if (r.export_path) {
          const { data: signed } = await sb.storage
            .from("brand-exports")
            .createSignedUrl(r.export_path as string, 60 * 60);
          exportUrl = signed?.signedUrl || null;
        }
        return { ...r, exportUrl };
      })
    );

    return new Response(
      JSON.stringify({ submissions: rows }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("list-quiz-submissions error:", msg);
    return new Response(
      JSON.stringify({ error: msg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
