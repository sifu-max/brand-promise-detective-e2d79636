import { useState, useRef, useImperativeHandle, forwardRef } from "react";
import { Globe, ArrowRight, Loader2, GitCompareArrows, User, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface BrandResearchFormProps {
  onSubmit: (url: string, leadInfo?: { firstName?: string; email?: string }) => void;
  onCompare?: (originalUrl: string, improvedUrl: string, leadInfo?: { firstName?: string; email?: string }) => void;
  isLoading: boolean;
  adminMode?: boolean;
}

export interface BrandResearchFormRef {
  clearAndFocus: () => void;
}

export const BrandResearchForm = forwardRef<BrandResearchFormRef, BrandResearchFormProps>(
  ({ onSubmit, onCompare, isLoading, adminMode = false }, ref) => {
    const [url, setUrl] = useState("");
    const [improvedUrl, setImprovedUrl] = useState("");
    const [compareMode, setCompareMode] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [email, setEmail] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
      clearAndFocus: () => {
        setUrl("");
        setImprovedUrl("");
        setTimeout(() => inputRef.current?.focus(), 100);
      },
    }));

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const leadInfo = (firstName.trim() || email.trim())
        ? { firstName: firstName.trim() || undefined, email: email.trim() || undefined }
        : undefined;

      if (compareMode && url.trim() && improvedUrl.trim() && onCompare) {
        onCompare(url.trim(), improvedUrl.trim(), leadInfo);
      } else if (url.trim()) {
        onSubmit(url.trim(), leadInfo);
      }
    };

    return (
      <form onSubmit={handleSubmit} className="w-full space-y-3">
        {/* Compare toggle - admin only */}
        {adminMode && (
          <div className="flex items-center justify-center gap-2">
            <Switch
              id="compare-mode"
              checked={compareMode}
              onCheckedChange={setCompareMode}
              disabled={isLoading}
            />
            <Label htmlFor="compare-mode" className="text-sm text-primary-foreground/70 cursor-pointer flex items-center gap-1.5">
              <GitCompareArrows className="h-3.5 w-3.5" />
              Compare original vs improved
            </Label>
          </div>
        )}

        {/* Optional Lead Capture */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <User className="h-4 w-4" />
            </div>
            <Input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First name (optional)"
              className="h-11 pl-9 text-sm text-foreground bg-card border-border/50 shadow-sm placeholder:text-muted-foreground/60"
              disabled={isLoading}
            />
          </div>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <Mail className="h-4 w-4" />
            </div>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email (optional)"
              className="h-11 pl-9 text-sm text-foreground bg-card border-border/50 shadow-sm placeholder:text-muted-foreground/60"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Original URL */}
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Globe className="h-5 w-5" />
          </div>
          <Input
            ref={inputRef}
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={compareMode ? "https://original-site.com/" : "https://yourdomain.com/"}
            className="h-16 pl-12 pr-36 text-lg text-foreground bg-card border-border/50 shadow-sm focus:shadow-md transition-shadow placeholder:text-base"
            disabled={isLoading}
            required
          />
          {!compareMode && (
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
          )}
        </div>

        {/* Improved URL (compare mode) */}
        {compareMode && (
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              <Globe className="h-5 w-5" />
            </div>
            <Input
              type="url"
              value={improvedUrl}
              onChange={(e) => setImprovedUrl(e.target.value)}
              placeholder="https://improved-site.com/"
              className="h-16 pl-12 pr-36 text-lg text-foreground bg-card border-border/50 shadow-sm focus:shadow-md transition-shadow placeholder:text-base"
              disabled={isLoading}
              required
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <Button
                type="submit"
                disabled={isLoading || !url.trim() || !improvedUrl.trim()}
                className="h-10 px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Comparing
                  </>
                ) : (
                  <>
                    Compare
                    <GitCompareArrows className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        <p className="text-sm text-muted-foreground text-center">
          {compareMode
            ? "Enter the original URL and the improved URL to see score improvements"
            : "Enter a complete URL (e.g., https://example.com)"}
        </p>
      </form>
    );
  }
);

BrandResearchForm.displayName = "BrandResearchForm";
