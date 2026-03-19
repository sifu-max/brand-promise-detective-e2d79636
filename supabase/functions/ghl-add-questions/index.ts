import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const GHL_API_BASE = "https://services.leadconnectorhq.com";

const bonusQuestions = [
  {
    title: "Conversation Capture",
    prompt:
      "How confident are you that your business captures every incoming customer conversation (calls, texts, social messages, website funnels, forms, etc.)?",
    type: "single",
    options: [
      { label: "We capture and track everything automatically", value: "5" },
      { label: "Most conversations are captured", value: "3" },
      { label: "Some conversations slip through the cracks", value: "2" },
      { label: "We probably miss a lot", value: "1" },
    ],
  },
  {
    title: "Where Conversations Happen",
    prompt:
      "Where do customers typically start conversations with your business?",
    type: "multi",
    options: [
      { label: "Phone calls", value: "1" },
      { label: "SMS / text", value: "1" },
      { label: "Email", value: "1" },
      { label: "Social media (DMs)", value: "1" },
      { label: "Website funnels / forms", value: "1" },
    ],
  },
  {
    title: "Response Speed",
    prompt:
      "When someone reaches out to your business, how quickly do they usually receive a response?",
    type: "single",
    options: [
      { label: "Immediate automated + personalized response", value: "5" },
      { label: "Quick automated response within minutes", value: "4" },
      { label: "Manual response within about an hour", value: "3" },
      { label: "Responses are inconsistent", value: "2" },
      { label: "Sometimes no response happens", value: "1" },
    ],
  },
  {
    title: "Client Engagement Management",
    prompt:
      "How are your client conversations and engagements managed today?",
    type: "single",
    options: [
      { label: "Everything is centralized in one system", value: "5" },
      { label: "2–3 tools manage conversations", value: "3" },
      { label: "Spread across multiple apps", value: "2" },
      { label: "Completely scattered", value: "1" },
    ],
  },
  {
    title: "Opportunity Recovery & Reactivation",
    prompt:
      "If a potential customer doesn't respond or an old lead goes cold, what typically happens next?",
    type: "single",
    options: [
      {
        label:
          "Automated follow-up and reactivation campaigns run automatically",
        value: "5",
      },
      {
        label: "We follow up manually and occasionally revisit old leads",
        value: "4",
      },
      { label: "We follow up sometimes but inconsistently", value: "3" },
      { label: "We rarely follow up or revisit old leads", value: "2" },
      { label: "Nothing usually happens", value: "1" },
    ],
  },
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const GHL_API_KEY = Deno.env.get("GHL_API_KEY");
    if (!GHL_API_KEY) {
      throw new Error("GHL_API_KEY is not configured");
    }

    const { surveyId } = await req.json();
    if (!surveyId || typeof surveyId !== "string") {
      return new Response(
        JSON.stringify({ error: "surveyId is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const results: Array<{ title: string; success: boolean; error?: string }> = [];

    for (const q of bonusQuestions) {
      const body: Record<string, unknown> = {
        title: `[Bonus] ${q.title}`,
        description: q.prompt,
        type: q.type === "multi" ? "checkbox" : "radio",
        options: q.options.map((o) => ({
          label: o.label,
          value: o.value,
        })),
        required: false,
      };

      // GHL Surveys API v2 — add question to survey
      const res = await fetch(
        `${GHL_API_BASE}/surveys/${surveyId}/questions`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${GHL_API_KEY}`,
            "Content-Type": "application/json",
            Version: "2021-07-28",
          },
          body: JSON.stringify(body),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        results.push({
          title: q.title,
          success: false,
          error: `GHL API [${res.status}]: ${JSON.stringify(data)}`,
        });
      } else {
        results.push({ title: q.title, success: true });
      }
    }

    return new Response(
      JSON.stringify({ success: true, results }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Error adding GHL questions:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
