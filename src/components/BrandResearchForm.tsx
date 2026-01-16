import { useState } from "react";
import { Globe, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface BrandResearchFormProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

export function BrandResearchForm({ onSubmit, isLoading }: BrandResearchFormProps) {
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onSubmit(url.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
          <Globe className="h-5 w-5" />
        </div>
        <Input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter your business website URL..."
          className="h-16 pl-12 pr-36 text-lg bg-card border-border/50 shadow-sm focus:shadow-md transition-shadow placeholder:text-base"
          disabled={isLoading}
          required
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          <Button
            type="submit"
            disabled={isLoading || !url.trim()}
            className="h-10 px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing
              </>
            ) : (
              <>
                Analyze
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
      <p className="mt-3 text-sm text-muted-foreground text-center">
        Enter a complete URL (e.g., https://example.com)
      </p>
    </form>
  );
}
