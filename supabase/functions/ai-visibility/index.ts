import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
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

    console.log("Scanning AI visibility for URL:", url);

    // Fetch raw HTML (not Jina - we need actual HTML to check for schema markup)
    let htmlContent: string;
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; AIVisibilityBot/1.0)",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
      });

      if (!response.ok) {
        return new Response(
          JSON.stringify({ error: "Unable to access the provided website." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      htmlContent = await response.text();
    } catch (fetchError) {
      console.error("Failed to fetch website:", fetchError);
      return new Response(
        JSON.stringify({ error: "Unable to access the provided website." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const htmlLower = htmlContent.toLowerCase();

    // 1. Check for JSON-LD Schema
    const jsonLdMatches = htmlContent.match(/<script[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi) || [];
    const jsonLdSchemas: any[] = [];
    for (const match of jsonLdMatches) {
      try {
        const jsonStr = match.replace(/<script[^>]*>/i, "").replace(/<\/script>/i, "").trim();
        const parsed = JSON.parse(jsonStr);
        jsonLdSchemas.push(parsed);
      } catch { /* skip malformed */ }
    }

    const hasJsonLd = jsonLdSchemas.length > 0;
    const schemaTypes = jsonLdSchemas.map(s => s["@type"] || (Array.isArray(s["@graph"]) ? s["@graph"].map((g: any) => g["@type"]).filter(Boolean) : [])).flat();

    // 2. Check for Open Graph tags
    const ogTags: Record<string, string> = {};
    const ogMatches = htmlContent.match(/<meta[^>]*property\s*=\s*["']og:[^"']*["'][^>]*>/gi) || [];
    for (const tag of ogMatches) {
      const propMatch = tag.match(/property\s*=\s*["'](og:[^"']*)["']/i);
      const contentMatch = tag.match(/content\s*=\s*["']([^"']*)["']/i);
      if (propMatch && contentMatch) {
        ogTags[propMatch[1]] = contentMatch[1];
      }
    }
    const hasOpenGraph = Object.keys(ogTags).length > 0;

    // 3. Check for Twitter Card tags
    const twitterTags: Record<string, string> = {};
    const twitterMatches = htmlContent.match(/<meta[^>]*(?:name|property)\s*=\s*["']twitter:[^"']*["'][^>]*>/gi) || [];
    for (const tag of twitterMatches) {
      const nameMatch = tag.match(/(?:name|property)\s*=\s*["'](twitter:[^"']*)["']/i);
      const contentMatch = tag.match(/content\s*=\s*["']([^"']*)["']/i);
      if (nameMatch && contentMatch) {
        twitterTags[nameMatch[1]] = contentMatch[1];
      }
    }
    const hasTwitterCards = Object.keys(twitterTags).length > 0;

    // 4. Check for meta description
    const metaDescMatch = htmlContent.match(/<meta[^>]*name\s*=\s*["']description["'][^>]*content\s*=\s*["']([^"']*)["']/i)
      || htmlContent.match(/<meta[^>]*content\s*=\s*["']([^"']*)["'][^>]*name\s*=\s*["']description["']/i);
    const hasMetaDescription = !!metaDescMatch;

    // 5. Check for canonical URL
    const hasCanonical = /<link[^>]*rel\s*=\s*["']canonical["']/i.test(htmlContent);

    // 6. Check for robots.txt hints (meta robots)
    const robotsMatch = htmlContent.match(/<meta[^>]*name\s*=\s*["']robots["'][^>]*content\s*=\s*["']([^"']*)["']/i);
    const robotsContent = robotsMatch ? robotsMatch[1].toLowerCase() : "";
    const blocksAI = robotsContent.includes("noindex") || robotsContent.includes("nofollow");

    // 7. Check for sitemap reference
    const hasSitemap = htmlLower.includes("sitemap");

    // 8. Check for semantic HTML
    const hasSemanticHTML = /<(main|article|section|nav|header|footer|aside)\b/i.test(htmlContent);

    // 9. Check for heading hierarchy
    const hasH1 = /<h1[\s>]/i.test(htmlContent);

    // 10. Check for alt text on images
    const imgTags = htmlContent.match(/<img[^>]*>/gi) || [];
    const imgsWithAlt = imgTags.filter(img => /alt\s*=\s*["'][^"']+["']/i.test(img)).length;
    const altTextRatio = imgTags.length > 0 ? imgsWithAlt / imgTags.length : 1;

    // Build trust signals
    const trustSignals = {
      has_meta_description: hasMetaDescription,
      has_canonical: hasCanonical,
      has_semantic_html: hasSemanticHTML,
      has_h1: hasH1,
      has_good_alt_text: altTextRatio >= 0.5,
    };
    const trustSignalCount = Object.values(trustSignals).filter(Boolean).length;

    // Determine overall eligibility
    const hasSchema = hasJsonLd;
    const hasMachineIdentity = hasJsonLd && schemaTypes.some(t =>
      ["Organization", "LocalBusiness", "Person", "Corporation", "ProfessionalService", "WebSite", "WebPage"].includes(t)
    );
    const canBeCited = hasMachineIdentity && hasOpenGraph && hasMetaDescription;

    let eligibility: "Eligible" | "Partially Eligible" | "Not Eligible";
    if (canBeCited && trustSignalCount >= 4) {
      eligibility = "Eligible";
    } else if (hasSchema || (hasOpenGraph && hasMetaDescription)) {
      eligibility = "Partially Eligible";
    } else {
      eligibility = "Not Eligible";
    }

    const result = {
      eligibility,
      eligibility_summary:
        eligibility === "Eligible"
          ? "Your website has strong machine-readable signals. AI systems can identify, understand, and cite your business."
          : eligibility === "Partially Eligible"
          ? "Your website has some machine-readable signals, but key elements are missing for full AI visibility."
          : "Your website is not machine-readable, which means AI systems cannot reliably recognize, cite, or recommend your business.",
      findings: {
        schema_detected: hasJsonLd,
        schema_types: schemaTypes,
        machine_readable_identity: hasMachineIdentity ? "Present" : "Missing",
        ai_citation_eligibility: canBeCited ? "Possible" : "Not possible",
        trust_signal_count: trustSignalCount,
        trust_signal_total: 5,
      },
      details: {
        json_ld: hasJsonLd,
        json_ld_types: schemaTypes,
        open_graph: hasOpenGraph,
        open_graph_tags: ogTags,
        twitter_cards: hasTwitterCards,
        meta_description: hasMetaDescription,
        canonical_url: hasCanonical,
        semantic_html: hasSemanticHTML,
        h1_present: hasH1,
        alt_text_coverage: Math.round(altTextRatio * 100),
        blocks_ai: blocksAI,
      },
      trust_signals: trustSignals,
      source_url: url,
    };

    console.log("AI visibility scan complete:", eligibility);

    return new Response(
      JSON.stringify({ success: true, data: result }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("AI visibility error:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
