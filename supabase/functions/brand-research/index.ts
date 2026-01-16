import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are a Brand Research Agent.

Given a business website URL, research the site (and lightly the wider web if truly needed) to infer the brand's core messaging and offer. Prioritize what is explicitly on the site; only infer when necessary and stay realistic for the industry.

You must respond with a SINGLE valid JSON object matching this exact schema and nothing else (no markdown, no explanation, no extra text):

{
  "business_tagline": "",
  "primary_call_to_action": "",
  "core_service_solution": "",
  "core_client_pain_points": [ "" ],
  "communication_tone": "",
  "clients_budget_timeline": "",
  "core_offer_investment": "",
  "ideal_client_niche": "",
  "offer_structure": "",
  "source_url": "",
  "inference_notes": ""
}

Field rules:

- "business_tagline": A short, punchy line that fits the brand. Use or lightly refine any tagline on the site; if none, create one.
- "primary_call_to_action": The main action the site pushes (e.g., "Book a Free Consultation", "Get a Quote", "Start Free Trial").
- "core_service_solution": 1–3 sentences explaining what they do to solve the client's urgent problem.
- "core_client_pain_points": 3–6 core pains as an array of strings.
- "communication_tone": Choose EXACTLY ONE of: "Professional", "Casual/Friendly", "Urgent/Direct"
- "clients_budget_timeline": Typical budget range + time frame to solve the problem. Use site info or reasonable industry inference; clearly note if inferred.
- "core_offer_investment": Main price or range for the core offer. Use explicit pricing if available; otherwise provide a realistic "starting from" or range and note if inferred.
- "ideal_client_niche": 1–2 sentences on who they primarily serve (e.g., small business owners, families 35+, medical professionals).
- "offer_structure": Choose EXACTLY ONE of: "Basic and Premium options", "Single Price Offer", "Tiered 3+"
- "source_url": The URL provided by the user.
- "inference_notes": Briefly describe any major inferences or assumptions you made. If none, use an empty string.

Return ONLY the JSON object. Do not wrap it in backticks, markdown, or add any commentary.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();

    if (!url) {
      return new Response(
        JSON.stringify({ error: "URL is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Analyzing brand for URL:", url);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `Analyze this business website and extract brand information: ${url}` },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits depleted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Failed to analyze website" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      console.error("No content in AI response");
      return new Response(
        JSON.stringify({ error: "Failed to get analysis from AI" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse the JSON response
    let brandData;
    try {
      // Clean up the response in case there's any markdown formatting
      const cleanedContent = content
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      brandData = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      return new Response(
        JSON.stringify({ error: "Failed to parse brand analysis" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Brand analysis successful");
    return new Response(
      JSON.stringify({ success: true, data: brandData }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Brand research error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
