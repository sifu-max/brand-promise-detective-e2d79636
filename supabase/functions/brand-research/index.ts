import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are a Brand Research Agent. You will receive HTML content from a website and extract structured brand information.

CRITICAL RULES:
1. ONLY report text, colors, fonts, and data that are EXPLICITLY visible in the HTML content provided
2. Quote exact text from the HTML whenever possible
3. For colors/fonts, extract them from inline styles, CSS classes, or style tags if present
4. Be consistent - the same input should always produce the same output
5. When information is NOT explicitly found, provide a logical suggestion based on what IS found (see format below)

Given HTML content from a business website, extract what is explicitly present in the markup.

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

Field rules:

FOR EXPLICIT DATA (found on site):
- "business_tagline": Copy the EXACT tagline/headline from the hero section.
- "primary_call_to_action": The EXACT text of the main button/link (e.g., "Book a Call", "Get Started").
- "core_service_solution": Summarize what the site explicitly says they do using their words.
- "core_client_pain_points": List pain points if explicitly mentioned on the site.
- "communication_tone": Choose EXACTLY ONE of: "Professional", "Casual/Friendly", "Urgent/Direct" - based on the actual language used.
- "clients_budget_timeline": Only if pricing/timeline is shown on the site.
- "core_offer_investment": Only if pricing is explicitly listed.
- "ideal_client_niche": Only if the site explicitly states who they serve.
- "offer_structure": Choose EXACTLY ONE of: "Basic and Premium options", "Single Price Offer", "Tiered 3+", "Not determinable from site"
- "source_url": The URL provided by the user.
- "extraction_confidence": Rate as "High" (most data found), "Medium" (some data missing), or "Low" (mostly missing).

FOR MISSING DATA (not found on site) - PROVIDE LOGICAL SUGGESTIONS:
When data is not explicitly stated, use this format: "Suggested: [your logical inference based on what IS on the site]"

Examples:
- If no pricing shown but it's a consulting site with "Book a Call" CTA: "Suggested: Custom pricing discussed on consultation call"
- If no target audience stated but services are healthcare-related: "Suggested: Individuals and families seeking accessible healthcare services"
- If no pain points listed but it's a career coaching site: "Suggested: Professionals feeling stuck in their career, seeking advancement or transition"
- If no budget/timeline but it's a SaaS product: "Suggested: Monthly subscription model based on feature tiers"

BRAND DNA - Visual identity from the HTML:
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

    // Use Jina AI Reader to get rendered content (handles JavaScript SPAs)
    let pageContent: string;
    try {
      const jinaUrl = `https://r.jina.ai/${url}`;
      const jinaResponse = await fetch(jinaUrl, {
        headers: {
          "Accept": "text/plain",
        },
      });
      
      if (!jinaResponse.ok) {
        // Fallback to direct fetch if Jina fails
        console.log("Jina Reader failed, falling back to direct fetch");
        const directResponse = await fetch(url, {
          headers: {
            "User-Agent": "Mozilla/5.0 (compatible; BrandResearchBot/1.0)",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          },
        });
        
        if (!directResponse.ok) {
          return new Response(
            JSON.stringify({ error: `Failed to fetch website: ${directResponse.status} ${directResponse.statusText}` }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        
        pageContent = await directResponse.text();
      } else {
        pageContent = await jinaResponse.text();
        console.log("Successfully fetched rendered content via Jina Reader");
      }
      
      console.log("Fetched content, length:", pageContent.length);
      
      // Limit content size to avoid token limits (keep first 50KB)
      if (pageContent.length > 50000) {
        pageContent = pageContent.substring(0, 50000);
        console.log("Truncated content to 50KB");
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
          { role: "user", content: `Extract brand information from this website. The source URL is: ${url}\n\nPage Content:\n${pageContent}` },
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
