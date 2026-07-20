import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const GHL_API_BASE = "https://services.leadconnectorhq.com";
const LOCATION_ID = "dwjn9ZCDakbpyKtXQ55s";
const PIPELINE_ID = "ENR2pj52LUpUIXrnefVy";

// Map brand form fields → GHL custom field keys
const FIELD_MAP: Record<string, string> = {
  // Brand Builder (AI research) top-level keys
  business_tagline: "business_tagline_ai",
  primary_call_to_action: "primary_call_to_action_ai",
  core_service_solution: "core_service_solution_ai",
  core_client_pain_points: "core_client_pain_points_ai",
  communication_tone: "communication_tone_ai",
  clients_budget_timeline: "clients_budget_timeline_ai",
  core_offer_investment: "core_offer_investment_ai",
  ideal_client_niche: "ideal_client_niche",
  offer_structure: "offer_structure",
  source_url: "source_url_ai",
  brand_primary_color: "brand_primary_color",
  brand_secondary_color: "brand_secondary_color",
  brand_accent_color: "brand_accent_color",
  brand_heading_font: "brand_heading_font",
  brand_body_font: "brand_body_font",
  video_url: "brand_video_url",
  embed_links: "upload_supporting_documents_or_files_eg_pdfs_csvs_etc",

  // Quiz brandingIntake keys (flattened from brandData.brandingIntake)
  tagline: "business_tagline_ai",
  cta: "primary_call_to_action_ai",
  coreSolution: "core_service_solution_ai",
  communicationTone: "communication_tone_ai",
  clientBudgetTimeline: "clients_budget_timeline_ai",
  coreOfferInvestment: "core_offer_investment_ai",
  offerStructure: "offer_structure",
  idealClient: "ideal_client_niche",
  painPoints: "core_client_pain_points_ai",
  salesScript: "sales_script_formula",
  customerProfiles: "customer_profiles",
  profileGoals: "profile_goals",
  profileTriggers: "profile_triggers",
  entryPoint: "entry_point",
  currentMomentum: "current_momentum",
  desiredMomentum: "desired_momentum",
  postEngagement: "postengagement_followup",
};

async function ghlFetch(path: string, token: string, options: RequestInit = {}) {
  const res = await fetch(`${GHL_API_BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Version: "2021-07-28",
      ...(options.headers || {}),
    },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(`GHL API [${res.status}] ${path}: ${JSON.stringify(data)}`);
  }
  return data;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const GHL_API_KEY = Deno.env.get("GHL_API_KEY");
    if (!GHL_API_KEY) {
      throw new Error("GHL_API_KEY is not configured");
    }

    const { brandData, contactEmail, contactName, fullExportData } = await req.json();

    if (!brandData || typeof brandData !== "object") {
      return new Response(
        JSON.stringify({ error: "brandData is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ── 1. Upsert contact ──────────────────────────────────────────────
    let contactId: string | null = null;
    let isExistingContact = false;

    if (contactEmail) {
      const searchRes = await ghlFetch(
        `/contacts/search/duplicate?locationId=${LOCATION_ID}&email=${encodeURIComponent(contactEmail)}`,
        GHL_API_KEY
      );
      contactId = searchRes?.contact?.id ?? null;
      isExistingContact = !!contactId;
    }

    // Build custom fields array (shared between contact & opportunity)
    const customFields: Array<{ key: string; field_value: string }> = [];
    for (const [formKey, ghlKey] of Object.entries(FIELD_MAP)) {
      let value = brandData[formKey];
      if (value === undefined || value === null || value === "") continue;
      if (Array.isArray(value)) {
        value = value.filter((v: string) => v && v.trim()).join(" | ");
      }
      customFields.push({ key: ghlKey, field_value: String(value) });
    }

    // Add inference notes
    const inferenceNotes = [
      brandData.extraction_confidence ? `Confidence: ${brandData.extraction_confidence}` : "",
      brandData.source_url ? `Source: ${brandData.source_url}` : "",
    ]
      .filter(Boolean)
      .join(" — ");

    if (inferenceNotes) {
      customFields.push({ key: "inference_notes", field_value: inferenceNotes });
    }

    // Upload full export JSON to storage
    let exportUrl = "";
    if (fullExportData) {
      const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
      const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

      const fileName = `export-${Date.now()}-${crypto.randomUUID().slice(0, 8)}.json`;
      const { error: uploadError } = await sb.storage
        .from("brand-exports")
        .upload(fileName, JSON.stringify(fullExportData, null, 2), {
          contentType: "application/json",
          upsert: false,
        });

      if (uploadError) {
        console.error("Storage upload error:", uploadError);
      } else {
        const { data: urlData } = sb.storage
          .from("brand-exports")
          .getPublicUrl(fileName);
        exportUrl = urlData?.publicUrl || "";
      }
    }

    if (exportUrl) {
      customFields.push({ key: "brand_research_export_link", field_value: exportUrl });
    }

    // ── 2. Create or update contact with custom fields ─────────────────
    if (isExistingContact && contactId) {
      // Update existing contact with latest custom fields
      await ghlFetch(`/contacts/${contactId}`, GHL_API_KEY, {
        method: "PUT",
        body: JSON.stringify({
          name: contactName || undefined,
          customFields,
          tags: ["brand-builder"],
        }),
      });
      console.log("Updated existing contact:", contactId);
    } else {
      // Create new contact with custom fields
      const createRes = await ghlFetch("/contacts/", GHL_API_KEY, {
        method: "POST",
        body: JSON.stringify({
          locationId: LOCATION_ID,
          email: contactEmail || undefined,
          name: contactName || brandData.source_url || "Brand Builder Lead",
          source: "Brand Builder",
          tags: ["brand-builder"],
          customFields,
        }),
      });
      contactId = createRes?.contact?.id;
    }

    if (!contactId) {
      throw new Error("Failed to create or find a GHL contact");
    }

    // ── 3. Check for existing opportunity on this contact ──────────────
    let existingOppId: string | null = null;

    try {
      const searchRes = await ghlFetch(
        `/opportunities/search?location_id=${LOCATION_ID}&contact_id=${contactId}&pipeline_id=${PIPELINE_ID}`,
        GHL_API_KEY
      );
      const opportunities = searchRes?.opportunities || [];
      if (opportunities.length > 0) {
        // Use the most recent open opportunity
        const openOpp = opportunities.find((o: Record<string, unknown>) => o.status === "open");
        existingOppId = (openOpp?.id || opportunities[0]?.id) as string;
      }
    } catch (e) {
      console.log("Opportunity search failed, will create new:", e);
    }

    // ── 4. Create or update opportunity ────────────────────────────────
    let oppResult;
    const oppName = brandData.business_tagline || brandData.source_url || "New Brand Opportunity";

    if (existingOppId) {
      // Update existing opportunity (no pipeline read required)
      oppResult = await ghlFetch(`/opportunities/${existingOppId}`, GHL_API_KEY, {
        method: "PUT",
        body: JSON.stringify({
          pipelineId: PIPELINE_ID,
          locationId: LOCATION_ID,
          name: oppName,
          customFields,
        }),
      });
      console.log("Updated existing opportunity:", existingOppId);
    } else {
      // Create new opportunity with stage fallback:
      // 1) Optional manual override via secret GHL_DEFAULT_STAGE_ID
      // 2) Auto-fetch first stage from pipeline
      // 3) Attempt create without stage as last resort
      let pipelineStageId = Deno.env.get("GHL_DEFAULT_STAGE_ID") || "";

      if (!pipelineStageId) {
        try {
          const pipelineRes = await ghlFetch(
            `/opportunities/pipelines/${PIPELINE_ID}?locationId=${LOCATION_ID}`,
            GHL_API_KEY
          );
          const stages = pipelineRes?.stages || pipelineRes?.pipeline?.stages || [];
          pipelineStageId = stages[0]?.id || "";
        } catch (e) {
          console.warn("Pipeline read failed, attempting create without stage:", e);
        }
      }

      const createPayload: Record<string, unknown> = {
        pipelineId: PIPELINE_ID,
        locationId: LOCATION_ID,
        contactId,
        name: oppName,
        status: "open",
        customFields,
      };

      if (pipelineStageId) {
        createPayload.pipelineStageId = pipelineStageId;
      }

      oppResult = await ghlFetch("/opportunities/", GHL_API_KEY, {
        method: "POST",
        body: JSON.stringify(createPayload),
      });
      console.log("Created new opportunity");
    }

    const opportunityId = existingOppId || oppResult?.opportunity?.id || oppResult?.id;

    return new Response(
      JSON.stringify({
        success: true,
        opportunityId,
        contactId,
        updated: !!existingOppId,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Error creating GHL opportunity:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
