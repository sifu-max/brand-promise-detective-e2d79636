import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function validateUrl(urlString: string): { valid: boolean; error?: string } {
  try {
    const url = new URL(urlString);
    if (!["http:", "https:"].includes(url.protocol)) {
      return { valid: false, error: "Only HTTP and HTTPS URLs are supported" };
    }
    const hostname = url.hostname.toLowerCase();
    if (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "0.0.0.0" ||
      hostname.startsWith("10.") ||
      hostname.startsWith("192.168.") ||
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(hostname) ||
      hostname === "169.254.169.254" ||
      hostname.endsWith(".local") ||
      hostname.endsWith(".internal")
    ) {
      return { valid: false, error: "Private and internal URLs are not allowed" };
    }
    return { valid: true };
  } catch {
    return { valid: false, error: "Invalid URL format" };
  }
}

const SYSTEM_PROMPT = `You are a Brand Research Agent. You will receive content from a website in TWO parts:

1. RAW HTML — contains CSS styles, inline styles, style tags, meta tags, and class names where colors and fonts are defined.
2. RENDERED TEXT — the readable text content extracted from the page (may be empty if unavailable).

CRITICAL RULES:
1. For COLORS and FONTS: Extract them from the RAW HTML section. Look in:
   - Inline style attributes (style="color: #FF5733")
   - <style> tags and CSS rules
   - CSS custom properties (--primary-color: #xxx)
   - Meta theme-color tags
   - Class names that hint at color systems (e.g. bg-blue-500, text-primary)
   - Common CSS frameworks (Tailwind, Bootstrap) color classes
2. For TEXT CONTENT: Use the RENDERED TEXT section primarily, supplemented by the RAW HTML.
3. Quote exact text whenever possible.
4. Be consistent - the same input should always produce the same output.
5. When information is NOT explicitly found, provide a logical suggestion prefixed with "Suggested:".

You must respond with a SINGLE valid JSON object matching this exact schema and nothing else:

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
    "body_font": "",
    "logo_url": ""
  }
}

Field rules:

FOR EXPLICIT DATA (found on site):
- "business_tagline": Copy the EXACT tagline/headline from the hero section.
- "primary_call_to_action": The EXACT text of the main button/link.
- "core_service_solution": Summarize what the site explicitly says they do.
- "core_client_pain_points": List pain points if explicitly mentioned.
- "communication_tone": Choose ONE of: "Professional", "Casual/Friendly", "Urgent/Direct".
- "clients_budget_timeline": Only if pricing/timeline is shown.
- "core_offer_investment": Only if pricing is explicitly listed.
- "ideal_client_niche": Only if the site explicitly states who they serve.
- "offer_structure": Choose ONE of: "Basic and Premium options", "Single Price Offer", "Tiered 3+", "Not determinable from site"
- "source_url": The URL provided by the user.
- "extraction_confidence": "High", "Medium", or "Low".

FOR MISSING DATA: Use format "Suggested: [inference]"

BRAND DNA - COLOR EXTRACTION (CRITICAL):
- "primary_color": The dominant brand color as a hex code (#RRGGBB). Look for:
  * CSS custom properties in HSL format: --primary: 222.2 47.4% 11.2% (convert HSL to hex!)
  * Tailwind/shadcn CSS variables: --background, --foreground, --primary, --secondary, --accent, --muted (these use space-separated HSL values WITHOUT "hsl()" wrapper, e.g. "222.2 47.4% 11.2%")
  * Standard CSS variables like --primary, --brand-color, --main-color
  * The most prominent background or text color in the hero/header
  * Logo colors or accent colors used throughout
  * Theme color meta tags
  * If the site uses Tailwind CSS, decode color classes (bg-primary, text-primary, etc.) by cross-referencing with :root CSS variables
- "secondary_color": The second most used color as hex. Check --secondary or --muted CSS variables.
- "accent_color": Accent/highlight color as hex (buttons, links, CTAs). Check --accent CSS variable.
- IMPORTANT: If colors are defined as HSL values (e.g. "222.2 47.4% 11.2%"), you MUST convert them to hex (#RRGGBB) before returning.
- "heading_font": Font family for headings. Check font-family CSS rules, Google Fonts links, @font-face declarations, and Tailwind fontFamily config.
- "body_font": Font family for body text. Also check CSS variables like --font-sans, --font-heading.

If a color or font truly cannot be determined from the HTML, use "Unable to detect".

Return ONLY the JSON object. No markdown, no backticks, no commentary.`;

async function fetchRawHtml(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, {
      redirect: "follow",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });
    console.log("Raw HTML fetch status:", response.status);
    if (!response.ok) {
      console.log("Raw HTML fetch failed with status:", response.status);
      return null;
    }
    const text = await response.text();
    if (text.length < 200) {
      console.log("Raw HTML too short, likely a challenge page:", text.length);
      return null;
    }
    return text;
  } catch (e) {
    console.error("Raw HTML fetch error:", e);
    return null;
  }
}

async function fetchJinaContent(url: string): Promise<string | null> {
  try {
    const response = await fetch(`https://r.jina.ai/${url}`, {
      headers: { "Accept": "text/plain" },
    });
    if (!response.ok) return null;
    return await response.text();
  } catch {
    return null;
  }
}

// Detect SPA shell (Vite/React/etc.) and fetch the linked CSS bundle so colors/fonts can be extracted.
async function fetchCssBundles(html: string, pageUrl: string): Promise<string> {
  try {
    const isSpa = /<div\s+id=["']root["']\s*>\s*<\/div>/i.test(html) || /<div\s+id=["']app["']\s*>\s*<\/div>/i.test(html);
    if (!isSpa) return "";

    const linkRegex = /<link[^>]+rel=["']stylesheet["'][^>]+href=["']([^"']+\.css[^"']*)["']/gi;
    const hrefs: string[] = [];
    let m;
    while ((m = linkRegex.exec(html)) !== null) {
      hrefs.push(m[1]);
      if (hrefs.length >= 3) break;
    }
    if (hrefs.length === 0) return "";

    const base = new URL(pageUrl);
    const cssChunks: string[] = [];
    for (const href of hrefs) {
      try {
        const cssUrl = new URL(href, base).toString();
        const res = await fetch(cssUrl, {
          headers: { "User-Agent": "Mozilla/5.0 (compatible; BrandResearchBot/1.0)" },
        });
        if (!res.ok) continue;
        const css = await res.text();
        // Keep only the parts most likely to contain brand tokens
        const rootVars = css.match(/:root\s*\{[\s\S]*?\}/g)?.join("\n") || "";
        const darkVars = css.match(/\.dark\s*\{[\s\S]*?\}/g)?.join("\n") || "";
        const fontFaces = css.match(/@font-face\s*\{[\s\S]*?\}/g)?.slice(0, 10).join("\n") || "";
        const fontFamilyDecls = css.match(/font-family\s*:\s*[^;}]+/g)?.slice(0, 30).join("\n") || "";
        const importFonts = css.match(/@import\s+url\([^)]+\)/g)?.join("\n") || "";
        const chunk = [importFonts, rootVars, darkVars, fontFaces, fontFamilyDecls].filter(Boolean).join("\n\n");
        if (chunk) cssChunks.push(`/* ${cssUrl} */\n${chunk}`);
      } catch (e) {
        console.error("CSS bundle fetch error:", e);
      }
    }
    return cssChunks.join("\n\n");
  } catch (e) {
    console.error("fetchCssBundles error:", e);
    return "";
  }
}

async function fetchJinaHtml(url: string): Promise<string | null> {
  try {
    const response = await fetch(`https://r.jina.ai/${url}`, {
      headers: {
        "Accept": "text/html",
        "X-Return-Format": "html",
      },
    });
    if (!response.ok) {
      console.log("Jina HTML fetch failed:", response.status);
      return null;
    }
    return await response.text();
  } catch (e) {
    console.error("Jina HTML fetch error:", e);
    return null;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();

    if (!url || typeof url !== "string") {
      return new Response(
        JSON.stringify({ error: "URL is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const urlValidation = validateUrl(url);
    if (!urlValidation.valid) {
      return new Response(
        JSON.stringify({ error: urlValidation.error }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Fetching website content for URL:", url);

    // Triple fetch: raw HTML for styles/colors, Jina text for content, Jina HTML as fallback for styles
    const [rawHtml, jinaText, jinaHtml] = await Promise.all([
      fetchRawHtml(url),
      fetchJinaContent(url),
      fetchJinaHtml(url),
    ]);

    if (!rawHtml && !jinaText && !jinaHtml) {
      return new Response(
        JSON.stringify({ error: "Unable to access the provided website. Please verify the URL is publicly accessible." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Raw HTML length:", rawHtml?.length ?? 0, "| Jina text length:", jinaText?.length ?? 0, "| Jina HTML length:", jinaHtml?.length ?? 0);

    // Extract style data from raw HTML or Jina HTML fallback
    const htmlSource = rawHtml || jinaHtml;
    let styleContent = "";

    // SPA bundle fetch — for client-rendered sites (Vite/React), the HTML is just <div id="root"></div>.
    // Fetch the linked CSS bundle to recover design tokens (HSL vars, font-family, @font-face).
    if (htmlSource) {
      const cssBundle = await fetchCssBundles(htmlSource, url);
      if (cssBundle) {
        console.log("Fetched CSS bundle, length:", cssBundle.length);
        styleContent += "=== CSS BUNDLE (extracted from linked stylesheet) ===\n" + cssBundle.substring(0, 20000) + "\n\n";
      }
    }

    if (htmlSource) {
      const headMatch = htmlSource.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
      if (headMatch) {
        styleContent += "=== HEAD SECTION ===\n" + headMatch[1].substring(0, 15000) + "\n\n";
      }

      const styleMatches = htmlSource.match(/<style[^>]*>[\s\S]*?<\/style>/gi);
      if (styleMatches) {
        styleContent += "=== STYLE TAGS ===\n" + styleMatches.join("\n").substring(0, 15000) + "\n\n";
      }

      const bodyMatch = htmlSource.match(/<body[^>]*>([\s\S]*)/i);
      if (bodyMatch) {
        const bodySnippet = bodyMatch[1].substring(0, 30000);
        const styledElements = bodySnippet.match(/<[^>]+style="[^"]*"[^>]*>/gi);
        if (styledElements) {
          styleContent += "=== INLINE STYLES ===\n" + styledElements.join("\n").substring(0, 10000) + "\n\n";
        }
        // Also extract class names with color hints
        const colorClasses = bodySnippet.match(/class="[^"]*(?:bg-|text-|border-|color)[^"]*"/gi);
        if (colorClasses) {
          styleContent += "=== COLOR CLASSES ===\n" + colorClasses.slice(0, 50).join("\n") + "\n\n";
        }
        // Extract CSS custom properties (critical for Lovable/Tailwind sites)
        const cssVarMatches = (headMatch?.[1] || '') .match(/--[\w-]+:\s*[^;]+/g);
        if (cssVarMatches) {
          styleContent += "=== CSS CUSTOM PROPERTIES ===\n" + cssVarMatches.join("\n") + "\n\n";
        }
      }
    }

    // Build the content for AI analysis
    let pageContent = "";

    if (styleContent) {
      pageContent += "=== RAW HTML (styles, colors, fonts) ===\n" + styleContent + "\n\n";
    } else if (htmlSource) {
      pageContent += "=== RAW HTML ===\n" + htmlSource.substring(0, 25000) + "\n\n";
    }

    if (jinaText) {
      pageContent += "=== RENDERED TEXT CONTENT ===\n" + jinaText.substring(0, 25000);
    } else if (htmlSource) {
      const bodyMatch = htmlSource.match(/<body[^>]*>([\s\S]*)<\/body>/i);
      if (bodyMatch) {
        pageContent += "=== BODY HTML ===\n" + bodyMatch[1].substring(0, 20000);
      }
    }

    // Strip base64 data, SVG paths, and other binary-like content that bloats the payload
    pageContent = pageContent
      .replace(/data:[^;]+;base64,[A-Za-z0-9+/=]+/g, "[base64-image]")
      .replace(/d="[^"]{200,}"/g, 'd="[svg-path]"')
      .replace(/<svg[^>]*>[\s\S]*?<\/svg>/gi, "[svg-graphic]")
      .replace(/url\(data:[^)]+\)/g, "url([inline-image])");

    if (pageContent.length > 45000) {
      pageContent = pageContent.substring(0, 45000);
    }

    console.log("Total content for AI analysis:", pageContent.length, "chars");

    const models = ["google/gemini-2.5-flash", "openai/gpt-5-mini", "google/gemini-2.5-flash-lite"];
    let content: string | null = null;

    for (const model of models) {
      console.log("Trying model:", model);
      const isOpenAI = model.startsWith("openai/");
      try {
        const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model,
            ...(isOpenAI ? {} : { temperature: 0 }),
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              { role: "user", content: `Extract brand information from this website. The source URL is: ${url}\n\n${pageContent}` },
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
          const errorText = await response.text();
          console.error(`Model ${model} failed:`, response.status, errorText);
          continue; // Try next model
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
      const cleanedContent = content
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      brandData = JSON.parse(cleanedContent);
    } catch {
      console.error("Failed to parse AI response:", content);
      return new Response(
        JSON.stringify({ error: "Failed to parse brand analysis" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Brand analysis successful. Colors:", JSON.stringify(brandData.brand_dna));
    return new Response(
      JSON.stringify({ success: true, data: brandData }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Brand research error:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred. Please try again." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
