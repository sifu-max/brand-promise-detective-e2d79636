import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Zap, RotateCcw, PenLine } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { BrandResearchResult } from "@/types/brand";
import { BrandResearchForm } from "@/components/BrandResearchForm";
import { BrandResults } from "@/components/BrandResults";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Index = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<BrandResearchResult | null>(null);

  const handleAnalyze = async (url: string) => {
    setIsLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("brand-research", {
        body: { url },
      });

      if (error) {
        console.error("Edge function error:", error);
        toast.error(error.message || "Failed to analyze website");
        return;
      }

      if (data?.error) {
        toast.error(data.error);
        return;
      }

      if (data?.success && data?.data) {
        setResult(data.data);
        toast.success("Brand analysis complete!");
      }
    } catch (err) {
      console.error("Analysis error:", err);
      toast.error("Failed to connect to analysis service");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
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
              <span className="text-teal-light">Core Promise</span>
            </h1>
            
            <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto">
              Enter any business URL and let our AI extract the essential brand messaging, 
              ideal client profile, and competitive positioning in seconds.
            </p>

            {/* Search Form */}
            <div className="mt-8 max-w-2xl mx-auto">
              <BrandResearchForm onSubmit={handleAnalyze} isLoading={isLoading} />
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
            <BrandResults data={result} />
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
      <footer className="border-t border-border py-8">
        <div className="container text-center text-sm text-muted-foreground">
          Brand Research Agent • Powered by AI
        </div>
      </footer>
    </div>
  );
};

export default Index;
