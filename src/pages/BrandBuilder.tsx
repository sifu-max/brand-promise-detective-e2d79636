import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Sparkles, Video, Link, Plus, Printer, Download, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BrandResearchResult, BrandDNA } from "@/types/brand";
import { BrandDNAInputs } from "@/components/BrandDNAInputs";
import { toast } from "sonner";

const BrandBuilder = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const prefillData = location.state?.prefillData as BrandResearchResult | undefined;
  const [adminMode, setAdminMode] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "B") {
        setAdminMode((prev) => !prev);
        toast.success(adminMode ? "Admin mode off" : "Admin mode on");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [adminMode]);

  const defaultBrandDNA: BrandDNA = {
    primary_color: "",
    secondary_color: "",
    accent_color: "",
    heading_font: "",
    body_font: "",
  };

  const [formData, setFormData] = useState<BrandResearchResult>({
    business_tagline: "",
    primary_call_to_action: "",
    core_service_solution: "",
    core_client_pain_points: ["", "", ""],
    communication_tone: "Professional",
    clients_budget_timeline: "",
    core_offer_investment: "",
    ideal_client_niche: "",
    offer_structure: "Single Price Offer",
    source_url: "",
    extraction_confidence: "High",
    brand_dna: defaultBrandDNA,
  });

  const [contactInfo, setContactInfo] = useState({ firstName: "", email: "" });

  const [mediaAssets, setMediaAssets] = useState({
    video_url: "",
    embed_links: [""],
  });

  const updateEmbedLink = (index: number, value: string) => {
    const updated = [...mediaAssets.embed_links];
    updated[index] = value;
    setMediaAssets((prev) => ({ ...prev, embed_links: updated }));
  };

  const addEmbedLink = () => {
    if (mediaAssets.embed_links.length < 6) {
      setMediaAssets((prev) => ({ ...prev, embed_links: [...prev.embed_links, ""] }));
    }
  };

  const removeEmbedLink = (index: number) => {
    if (mediaAssets.embed_links.length > 1) {
      const updated = mediaAssets.embed_links.filter((_, i) => i !== index);
      setMediaAssets((prev) => ({ ...prev, embed_links: updated }));
    }
  };

  const updateBrandDNA = (brandDna: BrandDNA) => {
    setFormData((prev) => ({ ...prev, brand_dna: brandDna }));
  };

  useEffect(() => {
    if (prefillData) {
      setFormData(prefillData);
      toast.success("Form pre-filled from AI research!");
    }
  }, [prefillData]);

  const updateField = (field: keyof BrandResearchResult, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updatePainPoint = (index: number, value: string) => {
    const updated = [...formData.core_client_pain_points];
    updated[index] = value;
    updateField("core_client_pain_points", updated);
  };

  const addPainPoint = () => {
    if (formData.core_client_pain_points.length < 6) {
      updateField("core_client_pain_points", [...formData.core_client_pain_points, ""]);
    }
  };

  const removePainPoint = (index: number) => {
    if (formData.core_client_pain_points.length > 1) {
      const updated = formData.core_client_pain_points.filter((_, i) => i !== index);
      updateField("core_client_pain_points", updated);
    }
  };

  const [isSyncing, setIsSyncing] = useState(false);

  const handleSave = () => {
    // Filter out empty pain points
    const cleanedData = {
      ...formData,
      core_client_pain_points: formData.core_client_pain_points.filter((p) => p.trim() !== ""),
    };
    
    // For now, just show success and log - can be extended to save to DB
    console.log("Brand data:", cleanedData);
    toast.success("Brand profile saved!");
    
    // Copy to clipboard
    navigator.clipboard.writeText(JSON.stringify(cleanedData, null, 2));
    toast.info("JSON copied to clipboard");
  };

  const handleSyncToGHL = async () => {
    const cleanedData = {
      ...formData,
      core_client_pain_points: formData.core_client_pain_points.filter((p) => p.trim() !== ""),
      // Flatten brand DNA into top-level keys for GHL mapping
      brand_primary_color: formData.brand_dna?.primary_color || "",
      brand_secondary_color: formData.brand_dna?.secondary_color || "",
      brand_accent_color: formData.brand_dna?.accent_color || "",
      brand_heading_font: formData.brand_dna?.heading_font || "",
      brand_body_font: formData.brand_dna?.body_font || "",
      // Media assets
      video_url: mediaAssets.video_url || "",
      embed_links: mediaAssets.embed_links.filter((l) => l.trim() !== ""),
    };

    if (!cleanedData.business_tagline && !cleanedData.source_url) {
      toast.error("Please fill in at least a tagline or website URL.");
      return;
    }

    if (!contactInfo.firstName.trim() || !contactInfo.email.trim()) {
      toast.error("Please provide your first name and email before syncing.");
      return;
    }

    setIsSyncing(true);
    try {
      // Build the full export payload for storage upload
      const fullExportData = {
        brand_research: cleanedData,
        brand_dna: formData.brand_dna,
        media_assets: {
          video_url: mediaAssets.video_url,
          embed_links: mediaAssets.embed_links.filter((l) => l.trim() !== ""),
        },
        exported_at: new Date().toISOString(),
      };

      const { data, error } = await supabase.functions.invoke("ghl-create-opportunity", {
        body: {
          brandData: cleanedData,
          contactName: cleanedData.ideal_client_niche || cleanedData.business_tagline,
          fullExportData,
        },
      });

      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || "Unknown error");

      toast.success("Brand data synced to CRM pipeline!");
    } catch (err: unknown) {
      console.error("GHL sync error:", err);
      const msg = err instanceof Error ? err.message : "Failed to sync";
      toast.error(`CRM sync failed: ${msg}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleExport = () => {
    const cleanedData = {
      ...formData,
      core_client_pain_points: formData.core_client_pain_points.filter((p) => p.trim() !== ""),
    };
    const blob = new Blob([JSON.stringify(cleanedData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "brand-profile.json";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Brand profile exported!");
  };

  const handleExportDesignBrief = () => {
    const cleanedData = {
      ...formData,
      core_client_pain_points: formData.core_client_pain_points.filter((p) => p.trim() !== ""),
    };

    const designBrief = `# Website Design Brief

## Brand Overview
**Business Tagline:** ${cleanedData.business_tagline}
**Primary Call-to-Action:** ${cleanedData.primary_call_to_action}
**Communication Tone:** ${cleanedData.communication_tone}
**Website:** ${cleanedData.source_url}

## Core Service/Solution
${cleanedData.core_service_solution}

## Ideal Client Profile
${cleanedData.ideal_client_niche}

## Client Pain Points (Address These in Copy)
${cleanedData.core_client_pain_points.map((pain, i) => `${i + 1}. ${pain}`).join('\n')}

## Pricing & Investment
**Pricing:** ${cleanedData.core_offer_investment}
**Client Budget & Timeline:** ${cleanedData.clients_budget_timeline}
**Offer Structure:** ${cleanedData.offer_structure}



${cleanedData.brand_dna && (cleanedData.brand_dna.primary_color || cleanedData.brand_dna.heading_font) ? `## Brand DNA (Visual Identity)
**Colors:**
- Primary: ${cleanedData.brand_dna.primary_color || 'Not specified'}
- Secondary: ${cleanedData.brand_dna.secondary_color || 'Not specified'}
- Accent: ${cleanedData.brand_dna.accent_color || 'Not specified'}

**Typography:**
- Heading Font: ${cleanedData.brand_dna.heading_font || 'Not specified'}
- Body Font: ${cleanedData.brand_dna.body_font || 'Not specified'}
` : ''}
---

## Design Instructions for Lovable

Create a modern, professional website for this brand with the following pages and features:

### Pages to Include:
1. **Home Page** - Hero section with tagline, CTA button, pain points addressed, service overview
2. **Services/Solutions Page** - Detailed breakdown of core service offering
3. **About Page** - Brand story and team information
4. **Pricing Page** - ${cleanedData.offer_structure === 'Tiered 3+' ? 'Three-tier pricing table' : cleanedData.offer_structure === 'Basic and Premium options' ? 'Two-tier pricing comparison' : 'Single clear pricing section'}
5. **Contact Page** - Contact form with CTA: "${cleanedData.primary_call_to_action}"

### Design Guidelines:
- **Tone:** ${cleanedData.communication_tone} - ${cleanedData.communication_tone === 'Professional' ? 'Use clean lines, corporate colors, trustworthy imagery' : cleanedData.communication_tone === 'Casual/Friendly' ? 'Use warm colors, approachable imagery, conversational copy' : 'Use bold colors, strong CTAs, urgency-driven design'}
${cleanedData.brand_dna?.primary_color ? `- **Brand Colors:** Use ${cleanedData.brand_dna.primary_color} as primary, ${cleanedData.brand_dna.secondary_color || 'a complementary color'} as secondary, and ${cleanedData.brand_dna.accent_color || 'a bright accent'} for CTAs and highlights` : ''}
${cleanedData.brand_dna?.heading_font ? `- **Typography:** Use ${cleanedData.brand_dna.heading_font} for headings and ${cleanedData.brand_dna.body_font || 'a clean sans-serif'} for body text` : ''}
- **Hero Section:** Feature the tagline prominently with a clear CTA button
- **Pain Points Section:** Address each pain point with solution-focused messaging
- **Social Proof:** Include testimonial placeholders and trust badges
- **Mobile Responsive:** Ensure all pages work perfectly on mobile devices

### Copy Direction:
- Speak directly to: ${cleanedData.ideal_client_niche}
- Primary CTA everywhere: "${cleanedData.primary_call_to_action}"
- Address pain points with empathy, then present solutions

---

## Raw JSON Data
\`\`\`json
${JSON.stringify(cleanedData, null, 2)}
\`\`\`
`;

    const blob = new Blob([designBrief], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "website-design-brief.md";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Design brief exported! Use this with Lovable to generate your website.");
  };

  const handleCopyDesignBrief = async () => {
    const cleanedData = {
      ...formData,
      core_client_pain_points: formData.core_client_pain_points.filter((p) => p.trim() !== ""),
    };

    const hasBrandDNA = cleanedData.brand_dna && (cleanedData.brand_dna.primary_color || cleanedData.brand_dna.heading_font);

    const designBrief = `Create a professional website for my brand:

**Tagline:** ${cleanedData.business_tagline}
**CTA:** ${cleanedData.primary_call_to_action}
**Tone:** ${cleanedData.communication_tone}

**What We Do:** ${cleanedData.core_service_solution}

**Ideal Client:** ${cleanedData.ideal_client_niche}

**Pain Points to Address:**
${cleanedData.core_client_pain_points.map((pain, i) => `- ${pain}`).join('\n')}

**Pricing:** ${cleanedData.core_offer_investment} (${cleanedData.offer_structure})
${hasBrandDNA ? `
**Brand Colors:** Primary: ${cleanedData.brand_dna!.primary_color || 'not specified'}, Secondary: ${cleanedData.brand_dna!.secondary_color || 'not specified'}, Accent: ${cleanedData.brand_dna!.accent_color || 'not specified'}
**Fonts:** Headings: ${cleanedData.brand_dna!.heading_font || 'not specified'}, Body: ${cleanedData.brand_dna!.body_font || 'not specified'}` : ''}

Please create a landing page with: hero section featuring the tagline and CTA, pain points section, services overview, pricing section, and contact form. Use a ${cleanedData.communication_tone.toLowerCase()} design style${hasBrandDNA ? ' with the specified brand colors and fonts' : ''}.`;

    try {
      await navigator.clipboard.writeText(designBrief);
      toast.success("Design prompt copied! Paste this into Lovable to start building.");
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      {/* Header */}
      <div className="gradient-hero text-primary-foreground">
        <div className="container max-w-4xl py-12">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-6 text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary/20"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to AI Research
          </Button>
          
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary-foreground/90 text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              Manual Brand Definition
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Brand Builder
            </h1>
            
            <p className="text-lg text-primary-foreground/80 max-w-2xl">
              Define your brand promise, messaging, and ideal client profile manually. 
              All fields are editable and will be exported as structured data.
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="container max-w-4xl py-12">
        <div className="space-y-8">
          {/* Brand Identity */}
          <Card>
            <CardHeader>
              <CardTitle>Brand Identity</CardTitle>
              <CardDescription>Define your core brand messaging</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="tagline" className="text-base font-medium">Business Tagline</Label>
                <Input
                  id="tagline"
                  value={formData.business_tagline}
                  onChange={(e) => updateField("business_tagline", e.target.value)}
                  placeholder='e.g. "Your Forever Friend, Zero Maintenance."'
                  className="text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cta" className="text-base font-medium">Primary Call to Action</Label>
                <Input
                  id="cta"
                  value={formData.primary_call_to_action}
                  onChange={(e) => updateField("primary_call_to_action", e.target.value)}
                  placeholder='e.g. "Adopt Your Rock Today"'
                  className="text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="url" className="text-base font-medium">Website URL</Label>
                <Input
                  id="url"
                  type="url"
                  value={formData.source_url}
                  onChange={(e) => updateField("source_url", e.target.value)}
                  placeholder="https://example.com"
                  className="text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tone" className="text-base font-medium">Communication Tone</Label>
                <Select
                  value={formData.communication_tone}
                  onValueChange={(value) => updateField("communication_tone", value)}
                >
                  <SelectTrigger className="text-base">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Professional">Professional</SelectItem>
                    <SelectItem value="Casual/Friendly">Casual/Friendly</SelectItem>
                    <SelectItem value="Urgent/Direct">Urgent/Direct</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Core Offer */}
          <Card>
            <CardHeader>
              <CardTitle>Core Offer</CardTitle>
              <CardDescription>What you provide and how it's structured</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="service" className="text-base font-medium">Core Service / Solution</Label>
                <Textarea
                  id="service"
                  value={formData.core_service_solution}
                  onChange={(e) => updateField("core_service_solution", e.target.value)}
                  placeholder='e.g. "Premium companion stones hand-selected from riverbeds. Includes care guide & habitat."'
                  className="min-h-[100px] text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="investment" className="text-base font-medium">Pricing</Label>
                <Input
                  id="investment"
                  value={formData.core_offer_investment}
                  onChange={(e) => updateField("core_offer_investment", e.target.value)}
                  placeholder='e.g. "$15 – $75 per rock"'
                  className="text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="structure" className="text-base font-medium">Offer Structure</Label>
                <Select
                  value={formData.offer_structure}
                  onValueChange={(value) => updateField("offer_structure", value)}
                >
                  <SelectTrigger className="text-base">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Single Price Offer">Single Price Offer</SelectItem>
                    <SelectItem value="Basic and Premium options">Basic and Premium options</SelectItem>
                    <SelectItem value="Tiered 3+">Tiered 3+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* ICP & Pain Points */}
          <Card>
            <CardHeader>
              <CardTitle>Ideal Client Profile</CardTitle>
              <CardDescription>Who you serve and their pain points</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="niche" className="text-base font-medium">Ideal Client Niche</Label>
                <Textarea
                  id="niche"
                  value={formData.ideal_client_niche}
                  onChange={(e) => updateField("ideal_client_niche", e.target.value)}
                  placeholder='e.g. "Busy professionals who want companionship without commitment"'
                  className="min-h-[80px] text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget" className="text-base font-medium">Client's Budget & Timeline</Label>
                <Textarea
                  id="budget"
                  value={formData.clients_budget_timeline}
                  onChange={(e) => updateField("clients_budget_timeline", e.target.value)}
                  placeholder='e.g. "$15 – $75 range · Impulse buy · Ships same day"'
                  className="min-h-[80px] text-base"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium">Core Client Pain Points</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addPainPoint}
                    disabled={formData.core_client_pain_points.length >= 6}
                  >
                    Add Pain Point
                  </Button>
                </div>
                {formData.core_client_pain_points.map((pain, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={pain}
                      onChange={(e) => updatePainPoint(index, e.target.value)}
                      placeholder={[
                        'e.g. "Allergies to real pets"',
                        'e.g. "No time for walks or feeding"',
                        'e.g. "Lonely desk at work"',
                        'e.g. "Landlord says no pets"',
                        'e.g. "Previous pet trauma"',
                        'e.g. "Travel too often for a real pet"',
                      ][index] || `Pain point ${index + 1}...`}
                      className="text-base"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removePainPoint(index)}
                      disabled={formData.core_client_pain_points.length <= 1}
                      className="shrink-0"
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Brand DNA */}
          <Card>
            <CardHeader>
              <CardTitle>Brand DNA</CardTitle>
              <CardDescription>Visual identity for website generation (optional)</CardDescription>
            </CardHeader>
            <CardContent>
              <BrandDNAInputs 
                brandDna={formData.brand_dna || { primary_color: "", secondary_color: "", accent_color: "", heading_font: "", body_font: "" }} 
                onChange={updateBrandDNA} 
              />
            </CardContent>
          </Card>

          {/* Media & Assets */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5" />
                Media & Assets
              </CardTitle>
              <CardDescription>Add video links or file URLs to include in your design</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="video-url" className="text-base font-medium">Video URL</Label>
                <Input
                  id="video-url"
                  type="url"
                  value={mediaAssets.video_url}
                  onChange={(e) => setMediaAssets((prev) => ({ ...prev, video_url: e.target.value }))}
                  placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
                  className="text-base"
                />
                <p className="text-sm text-muted-foreground">YouTube, Vimeo, or any embeddable video link</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium flex items-center gap-2">
                    <Link className="h-4 w-4" />
                    Files / Embed Links
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addEmbedLink}
                    disabled={mediaAssets.embed_links.length >= 6}
                  >
                    <Plus className="mr-1 h-3 w-3" />
                    Add Link
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground -mt-2">
                  Links to files, documents, or embeds (Google Drive, Figma, Canva, etc.)
                </p>
                {mediaAssets.embed_links.map((link, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={link}
                      onChange={(e) => updateEmbedLink(index, e.target.value)}
                      placeholder="https://drive.google.com/... or any file URL"
                      className="text-base"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeEmbedLink(index)}
                      disabled={mediaAssets.embed_links.length <= 1}
                      className="shrink-0"
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {adminMode ? (
                <>
                  <Button onClick={handleSave} size="lg" className="flex-1">
                    <Save className="mr-2 h-4 w-4" />
                    Save & Copy JSON
                  </Button>
                  <Button onClick={handleExport} variant="outline" size="lg" className="flex-1">
                    <Download className="mr-2 h-4 w-4" />
                    Export JSON File
                  </Button>
                  <Button onClick={handleSyncToGHL} variant="secondary" size="lg" className="flex-1" disabled={isSyncing}>
                    <Send className="mr-2 h-4 w-4" />
                    {isSyncing ? "Syncing…" : "Sync to CRM"}
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={() => window.print()} size="lg" className="flex-1">
                    <Printer className="mr-2 h-4 w-4" />
                    Print / Save as PDF
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container text-center text-sm text-muted-foreground">
          Brand Builder • Define Your Brand Promise
        </div>
      </footer>
    </div>
  );
};

export default BrandBuilder;
