import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are a Brand Effectiveness Analyst. You will receive structured brand research data extracted from a website and evaluate the brand's effectiveness.

Score the brand across these 5 categories (0-100 each):

1. **Messaging Clarity** - Is the tagline clear? Is the value proposition obvious? Is the core service well-defined?
2. **CTA Strength** - Is the call-to-action compelling, specific, and action-oriented? Does it create urgency?
3. **Visual Identity** - Are brand colors defined? Is typography intentional? Is there a cohesive visual system?
4. **Target Audience Fit** - Is the ideal client clearly defined? Are pain points well-articulated and specific?
5. **Offer Structure** - Is pricing transparent? Is the offer structure clear? Is the investment justified?

For each category provide:
- score (0-100)
- label: "Excellent" (80-100), "Strong" (60-79), "Needs Work" (40-59), "Weak" (20-39), "Critical" (0-19)
- reasoning: One sentence explaining the score

Also provide exactly 5 improvement suggestions ranked by impact (High/Medium/Low). Each suggestion should be specific and actionable.

Respond with ONLY a valid JSON object matching this schema (no markdown, no explanation):

{
  "overall_score": 0,
  "overall_grade": "",
  "categories": [
    { "category": "", "score": 0, "label": "", "reasoning": "" }
  ],
  "suggestions": [
    { "category": "", "suggestion": "", "impact": "" }
  ]
}

Grade mapping: A (90-100), A- (85-89), B+ (80-84), B (75-79), B- (70-74), C+ (65-69), C (60-64), C- (55-59), D (40-54), F (0-39)`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { brandData } = await req.json();

    if (!brandData) {
      return new Response(
        JSON.stringify({ error: "Brand data is required" }),
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

    console.log("Evaluating brand effectiveness for:", brandData.source_url);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        temperature: 0,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `Evaluate this brand's effectiveness:\n\n${JSON.stringify(brandData, null, 2)}` },
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
        JSON.stringify({ error: "Analysis service temporarily unavailable." }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      return new Response(
        JSON.stringify({ error: "Failed to get effectiveness analysis" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let parsed;
    try {
      const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      console.error("Failed to parse AI response:", content);
      return new Response(
        JSON.stringify({ error: "Failed to parse effectiveness analysis" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Split suggestions: 2 free, rest gated
    const allSuggestions = parsed.suggestions || [];
    const freeSuggestions = allSuggestions.slice(0, 2);
    const gatedCount = Math.max(0, allSuggestions.length - 2);

    const result = {
      overall_score: parsed.overall_score,
      overall_grade: parsed.overall_grade,
      categories: parsed.categories,
      free_suggestions: freeSuggestions,
      gated_suggestion_count: gatedCount,
    };

    console.log("Brand effectiveness analysis complete, score:", result.overall_score);
    return new Response(
      JSON.stringify({ success: true, data: result }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Brand effectiveness error:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
