import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are a Brand Research Agent analyzing uploaded brand materials (PDF brand guides, mood boards, logo sheets, design system exports, Pinterest boards, Figma exports).

You will receive one or more files (PDFs and/or images). Extract every brand signal you can identify and return a SINGLE valid JSON object matching this schema EXACTLY:

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

RULES:
- "communication_tone": Choose ONE of: "Professional", "Casual/Friendly", "Urgent/Direct".
- "offer_structure": Choose ONE of: "Basic and Premium options", "Single Price Offer", "Tiered 3+", "Not determinable from site".
- "extraction_confidence": "High", "Medium", or "Low".
- "source_url": Use "uploaded-brand-assets" since there is no URL.
- Colors MUST be hex format #RRGGBB. If you see swatches, sample the dominant hex values.
- For images/mood boards: extract the dominant color palette and any visible typography.
- For PDFs: prioritize explicit brand-guide statements (color codes, font names, mission, voice).
- For missing fields, prefix the value with "Suggested: " and infer from visual style.
- If a color or font truly cannot be determined, use "Unable to detect".

Return ONLY the JSON object. No markdown, no commentary.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { files } = await req.json();

    if (!Array.isArray(files) || files.length === 0) {
      return new Response(
        JSON.stringify({ error: "At least one file is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (files.length > 6) {
      return new Response(
        JSON.stringify({ error: "Maximum 6 files allowed" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate file structure
    for (const f of files) {
      if (!f?.url || !f?.mimeType || typeof f.url !== "string" || typeof f.mimeType !== "string") {
        return new Response(
          JSON.stringify({ error: "Each file must have url and mimeType" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const isPdf = f.mimeType === "application/pdf";
      const isImage = f.mimeType.startsWith("image/");
      if (!isPdf && !isImage) {
        return new Response(
          JSON.stringify({ error: `Unsupported file type: ${f.mimeType}` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Analyzing ${files.length} uploaded file(s)`);

    // Build multimodal content array
    const userContent: any[] = [
      { type: "text", text: "Analyze the uploaded brand assets and extract brand information into the required JSON schema." },
    ];

    for (const f of files) {
      // Lovable AI Gateway accepts image_url with data URLs for both images and PDFs (Gemini multimodal)
      userContent.push({
        type: "image_url",
        image_url: { url: f.url },
      });
    }

    // Use Gemini 2.5 Pro for best multimodal (PDF + image) understanding
    const models = ["google/gemini-2.5-pro", "google/gemini-2.5-flash"];
    let content: string | null = null;

    for (const model of models) {
      console.log("Trying model:", model);
      try {
        const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model,
            temperature: 0,
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              { role: "user", content: userContent },
            ],
          }),
        });

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

        if (!response.ok) {
          const errText = await response.text();
          console.error(`Model ${model} failed:`, response.status, errText);
          continue;
        }

        const aiResponse = await response.json();
        content = aiResponse.choices?.[0]?.message?.content;
        if (content) {
          console.log("Success with model:", model);
          break;
        }
      } catch (e) {
        console.error(`Model ${model} error:`, e);
        continue;
      }
    }

    if (!content) {
      return new Response(
        JSON.stringify({ error: "Analysis service temporarily unavailable. Please try again later." }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let brandData;
    try {
      const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      brandData = JSON.parse(cleaned);
    } catch {
      console.error("Failed to parse AI response:", content);
      return new Response(
        JSON.stringify({ error: "Failed to parse brand analysis" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Upload analysis successful. Colors:", JSON.stringify(brandData.brand_dna));
    return new Response(
      JSON.stringify({ success: true, data: brandData }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Brand upload error:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred. Please try again." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
