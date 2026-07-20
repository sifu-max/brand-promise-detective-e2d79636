import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const FLATTEN_BRAND_DATA = (brandData: Record<string, unknown>) => {
  const flatBrandData: Record<string, unknown> = { ...brandData };
  if (brandData.brandingIntake && typeof brandData.brandingIntake === "object") {
    for (const [key, value] of Object.entries(brandData.brandingIntake as Record<string, unknown>)) {
      if (flatBrandData[key] === undefined || flatBrandData[key] === "") {
        flatBrandData[key] = value;
      }
    }
  }
  return flatBrandData;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const GHL_API_BASE = "https://services.leadconnectorhq.com";
const LOCATION_ID = "dwjn9ZCDakbpyKtXQ55s";
const PIPELINE_ID = "ENR2pj52LUpUIXrnefVy";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "intake";
}

function buildIntakeArtifact({
  brandData,
  contactEmail,
  contactName,
  opportunityName,
  locationId,
  pipelineId,
  stageName,
  status,
  exportUrl,
}: {
  brandData: Record<string, unknown>;
  contactEmail?: string;
  contactName?: string;
  opportunityName?: string;
  locationId?: string;
  pipelineId?: string;
  stageName?: string;
  status?: string;
  exportUrl?: string;
}) {
  const submissionId = `intake-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
  const libraryKey = slugify(
    `${contactName || contactEmail || "client"}-${submissionId}`
  );

  const artifact = {
    schemaVersion: "1.0",
    submissionId,
    createdAt: new Date().toISOString(),
    source: "lovable-quiz",
    contact: {
      firstName: contactName ? String(contactName).split(/\s+/)[0] : null,
      lastName: contactName ? String(contactName).split(/\s+/).slice(1).join(" ") || null : null,
      email: contactEmail || null,
      businessName: typeof brandData.business_name === "string" ? brandData.business_name : null,
      website: typeof brandData.source_url === "string" ? brandData.source_url : null,
      coreService: typeof brandData.core_service_solution === "string" ? brandData.core_service_solution : null,
      idealClient: typeof brandData.ideal_client_niche === "string" ? brandData.ideal_client_niche : null,
      painPoints: Array.isArray(brandData.core_client_pain_points_ai)
        ? brandData.core_client_pain_points_ai.filter((v): v is string => typeof v === "string")
        : typeof brandData.core_client_pain_points_ai === "string"
          ? [brandData.core_client_pain_points_ai]
          : [],
      leadSources: Array.isArray(brandData.channels)
        ? brandData.channels.filter((v): v is string => typeof v === "string")
        : [],
      followUpProcess: typeof brandData.followup_process === "string" ? brandData.followup_process : null,
      hoursPerWeek: typeof brandData.hours_per_week === "string" ? brandData.hours_per_week : null,
      adsBudgetMonthlyUsd: typeof brandData.ads_budget_monthly_usd === "string" ? brandData.ads_budget_monthly_usd : null,
      teamSize: typeof brandData.team_size === "string" ? brandData.team_size : null,
      primaryGoal: typeof brandData.primary_goal === "string" ? brandData.primary_goal : null,
      speedPreference: typeof brandData.speed_preference === "string" ? brandData.speed_preference : null,
    },
    opportunity: {
      name: opportunityName || null,
      pipelineId: pipelineId || null,
      locationId: locationId || null,
      stage: stageName || null,
      status: status || null,
      estimatedValue: typeof brandData.estimated_value === "string" ? brandData.estimated_value : null,
    },
    quiz: {
      quizType: typeof brandData.quizType === "string" ? brandData.quizType : null,
      totalScore: typeof brandData.totalScore === "number" ? brandData.totalScore : null,
      maxScore: typeof brandData.maxScore === "number" ? brandData.maxScore : null,
      tier: typeof brandData.tier === "string" ? brandData.tier : null,
      diagnosis: typeof brandData.diagnosis === "string" ? brandData.diagnosis : null,
      recommendation: typeof brandData.recommendation === "string" ? brandData.recommendation : null,
      modules: Array.isArray(brandData.modules) ? brandData.modules.filter((v): v is string => typeof v === "string") : [],
      questionBreakdown: Array.isArray(brandData.questionBreakdown) ? brandData.questionBreakdown : [],
    },
    brandBuilder: {
      tagline: typeof brandData.tagline === "string" ? brandData.tagline : null,
      primaryCallToAction: typeof brandData.cta === "string" ? brandData.cta : null,
      coreServiceSolution: typeof brandData.coreSolution === "string" ? brandData.coreSolution : null,
      painPoints: Array.isArray(brandData.painPoints)
        ? brandData.painPoints.filter((v): v is string => typeof v === "string")
        : typeof brandData.painPoints === "string"
          ? [brandData.painPoints]
          : [],
      communicationTone: typeof brandData.communicationTone === "string" ? brandData.communicationTone : null,
      budgetTimeline: typeof brandData.clientBudgetTimeline === "string" ? brandData.clientBudgetTimeline : null,
      coreOfferInvestment: typeof brandData.coreOfferInvestment === "string" ? brandData.coreOfferInvestment : null,
      offerStructure: typeof brandData.offerStructure === "string" ? brandData.offerStructure : null,
      idealClient: typeof brandData.idealClient === "string" ? brandData.idealClient : null,
      sourceUrl: typeof brandData.source_url === "string" ? brandData.source_url : null,
      brandColors: [],
      brandFonts: [],
      videoUrl: typeof brandData.video_url === "string" ? brandData.video_url : null,
      embedLinks: [],
    },
    inference: {
      notes: typeof brandData.inference_notes === "string" ? brandData.inference_notes : null,
      brandResearchExportLink: exportUrl || null,
      quizScoreTierIcp: typeof brandData.icp === "string" && typeof brandData.tier === "string"
        ? `${brandData.tier} | ${brandData.icp}`
        : null,
    },
    audit: {
      submittedBy: contactEmail || contactName || null,
      submittedFrom: "lovable-quiz",
      gHLSyncStatus: "synced",
      swarmSyncStatus: "pending",
    },
    clientLibrary: {
      key: libraryKey,
      entryType: "solution-library-entry",
      clientRef: contactEmail || contactName || "unknown-client",
      summary: typeof brandData.tier === "string" ? `${brandData.tier} intake` : "Intake captured",
    },
  };

  return artifact;
}

function buildMarkdownArtifact(artifact: Record<string, any>) {
  return [
    "# Intake Artifact",
    "",
    `- Submission ID: ${artifact?.submissionId || "n/a"}`,
    `- Created At: ${artifact?.createdAt || "n/a"}`,
    `- Source: ${artifact?.source || "n/a"}`,
    `- GHL Sync Status: ${artifact?.audit?.gHLSyncStatus || "pending"}`,
    `- Swarm Sync Status: ${artifact?.audit?.swarmSyncStatus || "pending"}`,
    "",
    "## Contact",
    `- First Name: ${artifact?.contact?.firstName || ""}`,
    `- Email: ${artifact?.contact?.email || ""}`,
    `- Business Name: ${artifact?.contact?.businessName || ""}`,
    `- Core Service: ${artifact?.contact?.coreService || ""}`,
    `- Ideal Client: ${artifact?.contact?.idealClient || ""}`,
    `- Pain Points: ${artifact?.contact?.painPoints?.join(", ") || ""}`,
    "",
    "## Quiz",
    `- Quiz Type: ${artifact?.quiz?.quizType || ""}`,
    `- Total Score: ${artifact?.quiz?.totalScore || ""}`,
    `- Tier: ${artifact?.quiz?.tier || ""}`,
    `- Recommendation: ${artifact?.quiz?.recommendation || ""}`,
    "",
    "## Client Library",
    `- Library Key: ${artifact?.clientLibrary?.key || ""}`,
    `- Entry Type: ${artifact?.clientLibrary?.entryType || ""}`,
    `- Summary: ${artifact?.clientLibrary?.summary || ""}`,
  ].join("\n");
}

function buildArtifactCustomFields(artifact: Record<string, any>) {
  const jsonValue = JSON.stringify(artifact, null, 2);
  const markdownValue = buildMarkdownArtifact(artifact);

  return [
    { key: "intake_submission_id", field_value: artifact.submissionId || "" },
    { key: "solution_library_key", field_value: artifact.clientLibrary?.key || "" },
    { key: "intake_artifact_json", field_value: jsonValue },
    { key: "intake_artifact_markdown", field_value: markdownValue },
  ].filter((field) => field.field_value);
}

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

function buildInferenceNotes(brandData: Record<string, unknown>) {
  const parts = [
    brandData.quizType ? `Quiz: ${brandData.quizType}` : "",
    brandData.icp ? `ICP: ${brandData.icp}` : "",
    brandData.tier ? `Tier: ${brandData.tier}` : "",
    brandData.totalScore !== undefined && brandData.maxScore !== undefined
      ? `Score: ${brandData.totalScore}/${brandData.maxScore}`
      : "",
  ].filter(Boolean);

  return parts.join(" — ");
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

    // Flatten nested brandingIntake (from Conversation Quiz) into top-level
    const flatBrandData = FLATTEN_BRAND_DATA(brandData as Record<string, unknown>);

    // Build custom fields array (shared between contact & opportunity)
    const customFields: Array<{ key: string; field_value: string }> = [];
    for (const [formKey, ghlKey] of Object.entries(FIELD_MAP)) {
      let value = flatBrandData[formKey];
      if (value === undefined || value === null || value === "") continue;
      if (Array.isArray(value)) {
        value = value.filter((v: string) => v && v.trim()).join(" | ");
      }
      customFields.push({ key: ghlKey, field_value: String(value) });
    }

    const artifact = buildIntakeArtifact({
      brandData: flatBrandData as Record<string, unknown>,
      contactEmail,
      contactName,
      opportunityName: flatBrandData.tagline || flatBrandData.business_tagline || flatBrandData.source_url || "New Brand Opportunity",
      locationId: LOCATION_ID,
      pipelineId: PIPELINE_ID,
      stageName: "",
      status: "open",
      exportUrl,
    });
    const artifactCustomFields = buildArtifactCustomFields(artifact);

    // Add inference notes in the swarm-aligned format.
    const inferenceNotes = buildInferenceNotes(flatBrandData as Record<string, unknown>);

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
        const { data: signed } = await sb.storage
          .from("brand-exports")
          .createSignedUrl(fileName, 60 * 60 * 24 * 365);
        exportUrl = signed?.signedUrl || "";
      }
    }

    if (exportUrl) {
      customFields.push({ key: "brand_research_export_link", field_value: exportUrl });
    }

    // ── 2. Create or update contact with custom fields ─────────────────
    const contactTags = ["brand-builder", "intake-artifact"];

    const syncContactFields = async (fields: Array<{ key: string; field_value: string }>) => {
      if (isExistingContact && contactId) {
        await ghlFetch(`/contacts/${contactId}`, GHL_API_KEY, {
          method: "PUT",
          body: JSON.stringify({
            name: contactName || undefined,
            customFields: fields,
            tags: contactTags,
          }),
        });
        console.log("Updated existing contact:", contactId);
      } else {
        const createRes = await ghlFetch("/contacts/", GHL_API_KEY, {
          method: "POST",
          body: JSON.stringify({
            locationId: LOCATION_ID,
            email: contactEmail || undefined,
            name: contactName || brandData.source_url || "Brand Builder Lead",
            source: "Brand Builder",
            tags: contactTags,
            customFields: fields,
          }),
        });
        contactId = createRes?.contact?.id;
      }
    };

    try {
      await syncContactFields([...customFields, ...artifactCustomFields]);
    } catch (fieldError) {
      console.warn("Artifact custom fields rejected; retrying without artifact fields:", fieldError);
      await syncContactFields(customFields);
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

    const oppTags = ["brand-builder", "intake-artifact"];

    if (existingOppId) {
      // Update existing opportunity (no pipeline read required)
      try {
        oppResult = await ghlFetch(`/opportunities/${existingOppId}`, GHL_API_KEY, {
          method: "PUT",
          body: JSON.stringify({
            pipelineId: PIPELINE_ID,
            locationId: LOCATION_ID,
            name: oppName,
            customFields: [...customFields, ...artifactCustomFields],
            tags: oppTags,
          }),
        });
      } catch (fieldError) {
        console.warn("Artifact custom fields rejected for opportunity update; retrying without artifact fields:", fieldError);
        oppResult = await ghlFetch(`/opportunities/${existingOppId}`, GHL_API_KEY, {
          method: "PUT",
          body: JSON.stringify({
            pipelineId: PIPELINE_ID,
            locationId: LOCATION_ID,
            name: oppName,
            customFields,
            tags: oppTags,
          }),
        });
      }
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
        customFields: [...customFields, ...artifactCustomFields],
        tags: oppTags,
      };

      if (pipelineStageId) {
        createPayload.pipelineStageId = pipelineStageId;
      }

      try {
        oppResult = await ghlFetch("/opportunities/", GHL_API_KEY, {
          method: "POST",
          body: JSON.stringify(createPayload),
        });
      } catch (fieldError) {
        console.warn("Artifact custom fields rejected for opportunity creation; retrying without artifact fields:", fieldError);
        oppResult = await ghlFetch("/opportunities/", GHL_API_KEY, {
          method: "POST",
          body: JSON.stringify({
            ...createPayload,
            customFields,
            tags: oppTags,
          }),
        });
      }
      console.log("Created new opportunity");
    }

    const opportunityId = existingOppId || oppResult?.opportunity?.id || oppResult?.id;

    return new Response(
      JSON.stringify({
        success: true,
        opportunityId,
        contactId,
        updated: !!existingOppId,
        artifactId: artifact.submissionId,
        clientLibraryKey: artifact.clientLibrary?.key,
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
