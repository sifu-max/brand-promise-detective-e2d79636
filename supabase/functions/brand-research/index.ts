import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are a Brand Research Agent. You will receive HTML content from a website and extract structured brand information.

CRITICAL RULES:
1. ONLY report text, colors, fonts, and data that are EXPLICITLY visible in the HTML content provided
2. DO NOT infer, guess, or make up ANY information - especially pricing, timelines, budgets, or offer structures
3. If information is not in the HTML, use "Not found on site" - NEVER fabricate data
4. Quote exact text from the HTML whenever possible
5. For colors/fonts, extract them from inline styles, CSS classes, or style tags if present
6. Be consistent - the same input should always produce the same output

Given HTML content from a business website, extract ONLY what is explicitly present in the markup.

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
  "extraction_confidence": "",
  "brand_dna": {
    "primary_color": "",
    "secondary_color": "",
    "accent_color": "",
    "heading_font": "",
    "body_font": ""
  }
}

Field rules - EXTRACT ONLY, DO NOT INFER:

- "business_tagline": Copy the EXACT tagline/headline from the hero section. If no clear tagline exists, use "Not found on site".
- "primary_call_to_action": The EXACT text of the main button/link (e.g., "Book a Call", "Get Started"). Copy it exactly.
- "core_service_solution": Summarize ONLY what the site explicitly says they do. Use their words. If vague, say "Details not specified on site".
- "core_client_pain_points": List pain points ONLY if explicitly mentioned on the site. If the site doesn't list pain points, return ["Pain points not explicitly stated on site"].
- "communication_tone": Choose EXACTLY ONE of: "Professional", "Casual/Friendly", "Urgent/Direct" - based on the actual language used.
- "clients_budget_timeline": ONLY if pricing/timeline is shown on the site. Otherwise: "Not found on site".
- "core_offer_investment": ONLY if pricing is explicitly listed. Otherwise: "Not found on site".
- "ideal_client_niche": ONLY if the site explicitly states who they serve. Otherwise: "Target audience not explicitly defined on site".
- "offer_structure": Choose EXACTLY ONE of: "Basic and Premium options", "Single Price Offer", "Tiered 3+", "Not determinable from site"
- "source_url": The URL provided by the user.
- "extraction_confidence": Rate as "High" (most data found on site), "Medium" (some data missing), or "Low" (mostly missing).
- "brand_dna": Visual identity DETECTED from the website:
  - "primary_color": Main color as hex if detectable, otherwise "Unable to detect".
  - "secondary_color": Secondary color as hex if detectable, otherwise "Unable to detect".
  - "accent_color": Accent color as hex if detectable, otherwise "Unable to detect".
  - "heading_font": Font name if detectable, otherwise "Unable to detect".
  - "body_font": Font name if detectable, otherwise "Unable to detect".

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

    console.log("Fetching website content for URL:", url);

    // Actually fetch the website HTML content
    let htmlContent: string;
    try {
      const websiteResponse = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; BrandResearchBot/1.0)",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
      });
      
      if (!websiteResponse.ok) {
        return new Response(
          JSON.stringify({ error: `Failed to fetch website: ${websiteResponse.status} ${websiteResponse.statusText}` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      htmlContent = await websiteResponse.text();
      console.log("Fetched HTML content, length:", htmlContent.length);
      
      // Limit HTML size to avoid token limits (keep first 50KB)
      if (htmlContent.length > 50000) {
        htmlContent = htmlContent.substring(0, 50000);
        console.log("Truncated HTML to 50KB");
      }
    } catch (fetchError) {
      console.error("Failed to fetch website:", fetchError);
      return new Response(
        JSON.stringify({ error: `Cannot access website: ${fetchError instanceof Error ? fetchError.message : "Unknown error"}` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Analyzing brand with AI for URL:", url);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        temperature: 0, // Set to 0 for consistent, deterministic responses
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `Extract brand information from this website HTML. The source URL is: ${url}\n\nHTML Content:\n${htmlContent}` },
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
