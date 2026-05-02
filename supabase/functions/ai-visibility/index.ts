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

    // Fetch raw HTML - try direct first, then fallback to Jina Reader
    let htmlContent: string;
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
        },
        redirect: "follow",
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      htmlContent = await response.text();
    } catch (directError) {
      console.warn("Direct fetch failed, trying Jina Reader:", directError);
      try {
        const jinaResponse = await fetch(`https://r.jina.ai/${url}`, {
          headers: {
            "Accept": "text/html",
            "X-Return-Format": "html",
          },
        });
        if (!jinaResponse.ok) {
          throw new Error(`Jina HTTP ${jinaResponse.status}`);
        }
        htmlContent = await jinaResponse.text();
      } catch (jinaError) {
        console.error("Both fetch methods failed:", jinaError);
        return new Response(
          JSON.stringify({ error: "Unable to access the provided website." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
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

    // Flatten all schema nodes (handle @graph)
    const allNodes: any[] = [];
    for (const s of jsonLdSchemas) {
      if (Array.isArray(s["@graph"])) allNodes.push(...s["@graph"]);
      else allNodes.push(s);
    }
    const flattenTypes = (t: any): string[] => Array.isArray(t) ? t.flat() : t ? [t] : [];
    const schemaTypes = allNodes.flatMap(n => flattenTypes(n["@type"])).filter(Boolean);

    // ---- AI Knowledge Graph Markers ----
    const ORG_TYPES = ["Organization", "Corporation", "NGO", "EducationalOrganization", "GovernmentOrganization"];
    const LOCAL_BUSINESS_TYPES = [
      "LocalBusiness", "HealthAndBeautyBusiness", "MedicalBusiness", "ProfessionalService",
      "Restaurant", "Store", "Dentist", "AutomotiveBusiness", "FinancialService",
      "HomeAndConstructionBusiness", "LegalService", "LodgingBusiness", "RealEstateAgent",
      "TravelAgency", "Physician",
    ];
    const SERVICE_TYPES = ["Service", "Product", "Offer"];

    const hasOrganization = schemaTypes.some(t => ORG_TYPES.includes(t));
    const hasLocalBusiness = schemaTypes.some(t => LOCAL_BUSINESS_TYPES.includes(t));
    const hasService = schemaTypes.some(t => SERVICE_TYPES.includes(t));
    const hasKnowsAbout = allNodes.some(n => n && n.knowsAbout !== undefined);
    const hasPotentialAction = allNodes.some(n => n && n.potentialAction !== undefined);

    const aiMarkers = {
      organization: hasOrganization,
      local_business: hasLocalBusiness,
      service: hasService,
      knows_about: hasKnowsAbout,
      potential_action: hasPotentialAction,
    };
    const aiMarkerCount = Object.values(aiMarkers).filter(Boolean).length;

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

    // Determine overall eligibility — gated on AI Knowledge Graph markers
    const hasSchema = hasJsonLd;
    const hasMachineIdentity = hasOrganization || hasLocalBusiness;
    const isAIVisible = hasOrganization || hasLocalBusiness || hasService;
    const canBeCited = hasMachineIdentity && hasService && hasOpenGraph && hasMetaDescription;

    let eligibility: "Eligible" | "Partially Eligible" | "Not Eligible" | "Critically Ineligible";
    let eligibilityMessage = "";

    if (!isAIVisible) {
      eligibility = "Critically Ineligible";
      eligibilityMessage = "Google sees your code, but AI doesn't see your business identity. You are missing Organization and Service schemas — the markers AI systems use to recognize who you are and what you do.";
    } else if (canBeCited && aiMarkerCount >= 4 && trustSignalCount >= 4) {
      eligibility = "Eligible";
      eligibilityMessage = "Your website has strong AI Knowledge Graph markers. AI systems can identify, understand, and cite your business.";
    } else if (hasMachineIdentity || hasService) {
      eligibility = "Partially Eligible";
      eligibilityMessage = "Your website has some AI identity markers, but key Knowledge Graph signals are missing for full AI citation eligibility.";
    } else {
      eligibility = "Not Eligible";
      eligibilityMessage = "Your website lacks the machine-readable identity AI systems require to recognize, cite, or recommend your business.";
    }


    const result = {
      eligibility,
      eligibility_summary: eligibilityMessage,
      findings: {
        schema_detected: hasJsonLd,
        schema_types: schemaTypes,
        machine_readable_identity: hasMachineIdentity ? "Present" : "Missing",
        ai_citation_eligibility: canBeCited ? "Possible" : "Not possible",
        trust_signal_count: trustSignalCount,
        trust_signal_total: 5,
        ai_marker_count: aiMarkerCount,
        ai_marker_total: 5,
      },
      ai_knowledge_graph_markers: aiMarkers,
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
