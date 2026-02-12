import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Zap, RotateCcw, PenLine } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { BrandResearchResult } from "@/types/brand";
import { BrandEffectivenessResult } from "@/types/brand-effectiveness";
import { AIVisibilityResult } from "@/types/ai-visibility";
import { BrandResearchForm, BrandResearchFormRef } from "@/components/BrandResearchForm";
import { BrandResults } from "@/components/BrandResults";
import { BrandEffectivenessDisplay } from "@/components/BrandEffectivenessDisplay";
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

  const handleAnalyze = async (url: string) => {
    setIsLoading(true);
    setResult(null);
    setEffectiveness(null);
    setVisibility(null);

    try {
      const { data, error } = await supabase.functions.invoke("brand-research", {
        body: { url },
      });

      if (error) {
        console.error("Edge function error:", error);
        // Check if the error contains a specific message from the edge function
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
        toast.success("Brand analysis complete! Scoring effectiveness...");
        
        // Automatically trigger effectiveness scoring and AI visibility scan
        fetchEffectiveness(data.data);
        fetchVisibility(url);
      }
    } catch (err) {
      console.error("Analysis error:", err);
      toast.error("Failed to connect to analysis service");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEffectiveness = async (brandData: BrandResearchResult) => {
    setIsScoring(true);
    try {
      const { data, error } = await supabase.functions.invoke("brand-effectiveness", {
        body: { brandData },
      });

      if (error) {
        console.error("Effectiveness error:", error);
        toast.error("Could not score brand effectiveness");
        return;
      }

      if (data?.success && data?.data) {
        setEffectiveness(data.data);
        toast.success("Brand effectiveness scored!");
      }
    } catch (err) {
      console.error("Effectiveness error:", err);
    } finally {
      setIsScoring(false);
    }
  };

  const fetchVisibility = async (url: string) => {
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
        toast.success("AI visibility scan complete!");
      }
    } catch (err) {
      console.error("Visibility error:", err);
    } finally {
      setIsScanningVisibility(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setEffectiveness(null);
    setVisibility(null);
    formRef.current?.clearAndFocus();
  };

  const handleEditInBuilder = () => {
    navigate("/brand-builder", { state: { prefillData: result } });
  };

  return (
    <div className="min-h-screen bg-background">
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
              <BrandResearchForm ref={formRef} onSubmit={handleAnalyze} isLoading={isLoading} />
            </div>

            {/* Navigation to Brand Builder */}
            <div className="pt-4">
              <Button
                variant="ghost"
                onClick={() => navigate("/brand-builder")}
                className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary/20"
              >
                <PenLine className="mr-2 h-4 w-4" />
                Or define your brand manually
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
            <BrandResults data={result} effectiveness={effectiveness} visibility={visibility} />

            {/* Effectiveness Score */}
            {isScoring && (
              <div className="space-y-4 animate-pulse">
                <div className="h-8 w-64 bg-muted rounded mx-auto" />
                <div className="h-48 bg-muted rounded-xl" />
              </div>
            )}
            {!isScoring && effectiveness && (
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
