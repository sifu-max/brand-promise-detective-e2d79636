import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Zap, RotateCcw, PenLine } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { supabase } from "@/integrations/supabase/client";
import { BrandResearchResult } from "@/types/brand";
import { BrandEffectivenessResult } from "@/types/brand-effectiveness";
import { AIVisibilityResult } from "@/types/ai-visibility";
import { BrandResearchForm, BrandResearchFormRef } from "@/components/BrandResearchForm";
import { BrandResults } from "@/components/BrandResults";
import { BrandEffectivenessDisplay } from "@/components/BrandEffectivenessDisplay";
import { BrandEffectivenessComparison } from "@/components/BrandEffectivenessComparison";
import { AIVisibilityDisplay } from "@/components/AIVisibilityDisplay";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import crmchainsLogo from "@/assets/crmchains-logo.jpg";

const Index = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isScoring, setIsScoring] = useState(false);
  const [isScanningVisibility, setIsScanningVisibility] = useState(false);
  const [result, setResult] = useState<BrandResearchResult | null>(null);
  const [effectiveness, setEffectiveness] = useState<BrandEffectivenessResult | null>(null);
  const [visibility, setVisibility] = useState<AIVisibilityResult | null>(null);
  const formRef = useRef<BrandResearchFormRef>(null);
  const currentAnalysisIdRef = useRef<string | null>(null);
  const [adminMode, setAdminMode] = useState(false);

   // Secret keyboard shortcut: Ctrl+Shift+B toggles admin tools
   useEffect(() => {
     const handler = (e: KeyboardEvent) => {
       if (e.ctrlKey && e.shiftKey && e.key === "B") {
         setAdminMode(prev => !prev);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Comparison state
  const [isComparing, setIsComparing] = useState(false);
  const [comparisonOriginal, setComparisonOriginal] = useState<BrandEffectivenessResult | null>(null);
  const [comparisonImproved, setComparisonImproved] = useState<BrandEffectivenessResult | null>(null);
  const [comparisonUrls, setComparisonUrls] = useState<{ original: string; improved: string } | null>(null);

  // Store lead + create analysis record, return analysis id
  const saveLead = async (url: string, leadInfo?: { firstName?: string; email?: string }) => {
    try {
      let leadId: string | null = null;
      if (leadInfo?.firstName || leadInfo?.email) {
        const { data: lead } = await supabase
          .from("leads")
          .insert({ first_name: leadInfo.firstName || null, email: leadInfo.email || null })
          .select("id")
          .single();
        leadId = lead?.id || null;
      }
      const { data: analysis } = await supabase
        .from("brand_analyses")
        .insert({ lead_id: leadId, source_url: url })
        .select("id")
        .single();
      return analysis?.id || null;
    } catch (err) {
      console.error("Failed to save lead:", err);
      return null;
    }
  };

  const updateAnalysis = async (analysisId: string | null, updates: Record<string, any>) => {
    if (!analysisId) return;
    try {
      await supabase.from("brand_analyses").update(updates).eq("id", analysisId);
    } catch (err) {
      console.error("Failed to update analysis:", err);
    }
  };

  const handleAnalyze = async (url: string, leadInfo?: { firstName?: string; email?: string }) => {
    setIsLoading(true);
    setResult(null);
    setEffectiveness(null);
    setVisibility(null);
    setIsComparing(false);
    setComparisonOriginal(null);
    setComparisonImproved(null);
    setComparisonUrls(null);

    // Save lead & create analysis record
    const analysisId = await saveLead(url, leadInfo);
    currentAnalysisIdRef.current = analysisId;

    try {
      const { data, error } = await supabase.functions.invoke("brand-research", {
        body: { url },
      });

      if (error) {
        console.error("Edge function error:", error);
        const errorMessage = typeof error === 'object' && 'message' in error 
          ? error.message 
          : String(error);
        toast.error(errorMessage || "Failed to analyze website");
        return;
      }

      if (data?.error) {
        toast.error(data.error);
        return;
      }

      if (data?.success && data?.data) {
        setResult(data.data);
        updateAnalysis(analysisId, { brand_research: data.data });
        toast.success("Brand analysis complete! Scoring effectiveness...");
        fetchEffectiveness(data.data, null, analysisId);
        fetchVisibility(url, analysisId);
      }
    } catch (err) {
      console.error("Analysis error:", err);
      toast.error("Failed to connect to analysis service");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEffectiveness = async (brandData: BrandResearchResult, previousScores?: BrandEffectivenessResult | null, analysisId?: string | null) => {
    setIsScoring(true);
    try {
      const body: any = { brandData };
      if (previousScores) {
        body.previousScores = {
          overall_score: previousScores.overall_score,
          overall_grade: previousScores.overall_grade,
          categories: previousScores.categories,
        };
      }
      const { data, error } = await supabase.functions.invoke("brand-effectiveness", {
        body,
      });

      if (error) {
        console.error("Effectiveness error:", error);
        toast.error("Could not score brand effectiveness");
        return null;
      }

      if (data?.success && data?.data) {
        setEffectiveness(data.data);
        if (analysisId) updateAnalysis(analysisId, { effectiveness: data.data });
        toast.success("Brand effectiveness scored!");
        return data.data as BrandEffectivenessResult;
      }
      return null;
    } catch (err) {
      console.error("Effectiveness error:", err);
      return null;
    } finally {
      setIsScoring(false);
    }
  };

  const fetchVisibility = async (url: string, analysisId?: string | null) => {
    setIsScanningVisibility(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-visibility", {
        body: { url },
      });

      if (error) {
        console.error("Visibility scan error:", error);
        toast.error("Could not scan AI visibility");
        return;
      }

      if (data?.success && data?.data) {
        setVisibility(data.data);
        if (analysisId) updateAnalysis(analysisId, { ai_visibility: data.data });
        toast.success("AI visibility scan complete!");
      }
    } catch (err) {
      console.error("Visibility error:", err);
    } finally {
      setIsScanningVisibility(false);
    }
  };

  const handleCompare = async (originalUrl: string, improvedUrl: string, leadInfo?: { firstName?: string; email?: string }) => {
    setIsLoading(true);
    setIsComparing(true);
    setResult(null);
    setEffectiveness(null);
    setVisibility(null);
    setComparisonOriginal(null);
    setComparisonImproved(null);
    setComparisonUrls({ original: originalUrl, improved: improvedUrl });

    try {
      toast.info("Step 1/4: Analyzing original site...");

      // Fetch both brand research results in parallel
      const [originalRes, improvedRes] = await Promise.all([
        supabase.functions.invoke("brand-research", { body: { url: originalUrl } }),
        supabase.functions.invoke("brand-research", { body: { url: improvedUrl } }),
      ]);

      if (originalRes.error || !originalRes.data?.success) {
        toast.error("Failed to analyze original site");
        return;
      }
      if (improvedRes.error || !improvedRes.data?.success) {
        toast.error("Failed to analyze improved site");
        return;
      }

      // Show improved site's brand research as the main result
      setResult(improvedRes.data.data);
      setIsLoading(false);

      toast.info("Step 2/4: Scoring original site...");

      // Score original site first
      setIsScoring(true);
      const originalEffRes = await supabase.functions.invoke("brand-effectiveness", {
        body: { brandData: originalRes.data.data },
      });

      if (!originalEffRes.data?.success) {
        toast.error("Failed to score original site");
        setIsScoring(false);
        return;
      }

      const originalScores = originalEffRes.data.data as BrandEffectivenessResult;
      setComparisonOriginal(originalScores);

      toast.info("Step 3/4: Scoring improved site (anchored)...");

      // Score improved site with anchoring
      const improvedEffRes = await supabase.functions.invoke("brand-effectiveness", {
        body: {
          brandData: improvedRes.data.data,
          previousScores: {
            overall_score: originalScores.overall_score,
            overall_grade: originalScores.overall_grade,
            categories: originalScores.categories,
          },
        },
      });

      if (!improvedEffRes.data?.success) {
        toast.error("Failed to score improved site");
        setIsScoring(false);
        return;
      }

      const improvedScores = improvedEffRes.data.data as BrandEffectivenessResult;
      setComparisonImproved(improvedScores);
      setEffectiveness(improvedScores);
      setIsScoring(false);

      toast.info("Step 4/4: Scanning AI visibility...");
      fetchVisibility(improvedUrl);

      toast.success("Comparison complete!");
    } catch (err) {
      console.error("Comparison error:", err);
      toast.error("Failed to complete comparison");
    } finally {
      setIsLoading(false);
      setIsScoring(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setEffectiveness(null);
    setVisibility(null);
    setIsComparing(false);
    setComparisonOriginal(null);
    setComparisonImproved(null);
    setComparisonUrls(null);
    formRef.current?.clearAndFocus();
  };

  const handleEditInBuilder = () => {
    navigate("/brand-builder", { state: { prefillData: result } });
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      {/* Hero Section */}
      <div className="gradient-hero text-primary-foreground">
        <div className="container max-w-4xl py-16 md:py-24">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary-foreground/90 text-sm font-medium">
              <Zap className="h-4 w-4" />
              AI-Powered Brand Intelligence
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Discover Your Brand's
              <br />
              <span className="text-coral">Core Promise</span>
            </h1>
            
            <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto">
              Enter any business URL and let our AI extract the essential brand messaging, 
              ideal client profile, competitive positioning, and AI visibility schema in seconds.
            </p>

            {/* Search Form */}
            <div className="mt-8 max-w-2xl mx-auto">
              <BrandResearchForm ref={formRef} onSubmit={handleAnalyze} onCompare={handleCompare} isLoading={isLoading} adminMode={adminMode} />
            </div>

            {/* Navigation to Brand Builder */}
            <div className="pt-4">
              <Button
                variant="ghost"
                onClick={() => navigate("/brand-builder")}
                className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary/20"
              >
                <PenLine className="mr-2 h-4 w-4" />
                Or define your brand
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="container max-w-4xl py-12">
        {isLoading && <LoadingSkeleton />}
        
        {!isLoading && result && (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-3 justify-center">
              <Button variant="outline" onClick={handleReset}>
                <RotateCcw className="mr-2 h-4 w-4" />
                New Research
              </Button>
              <Button onClick={handleEditInBuilder}>
                <PenLine className="mr-2 h-4 w-4" />
                Edit in Brand Builder
              </Button>
            </div>
            <BrandResults data={result} effectiveness={effectiveness} visibility={visibility} adminMode={adminMode} />

            {/* Effectiveness Score or Comparison */}
            {isScoring && (
              <div className="space-y-4 animate-pulse">
                <div className="h-8 w-64 bg-muted rounded mx-auto" />
                <div className="h-48 bg-muted rounded-xl" />
              </div>
            )}
            {!isScoring && isComparing && comparisonOriginal && comparisonImproved && comparisonUrls && (
              <BrandEffectivenessComparison
                original={comparisonOriginal}
                improved={comparisonImproved}
                originalUrl={comparisonUrls.original}
                improvedUrl={comparisonUrls.improved}
              />
            )}
            {!isScoring && !isComparing && effectiveness && (
              <BrandEffectivenessDisplay data={effectiveness} />
            )}

            {/* AI Visibility Scan */}
            {isScanningVisibility && (
              <div className="space-y-4 animate-pulse">
                <div className="h-8 w-64 bg-muted rounded mx-auto" />
                <div className="h-48 bg-muted rounded-xl" />
              </div>
            )}
            {!isScanningVisibility && visibility && (
              <AIVisibilityDisplay data={visibility} />
            )}
          </div>
        )}
        
        {!isLoading && !result && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-muted mb-6">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Ready to analyze
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Enter a website URL above to extract brand messaging, pain points, 
              ideal client profile, and more.
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container max-w-4xl">
          <div className="flex flex-col items-center gap-6 text-center">
            <a 
              href="https://www.crmchains.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-80"
            >
              <img 
                src={crmchainsLogo} 
                alt="CRMChains Logo" 
                className="h-16 w-auto"
              />
            </a>
            
            <p className="text-base text-muted-foreground max-w-xl leading-relaxed">
              "A defined brand promise attracts your ideal client. CRMChains nurtures them into solutions orchestrated by your team."
            </p>
            
            <a 
              href="https://www.crmchains.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm font-medium text-primary hover:underline"
            >
              Powered by www.crmchains.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;