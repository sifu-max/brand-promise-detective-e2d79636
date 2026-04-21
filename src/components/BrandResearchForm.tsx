import { useState, useRef, useImperativeHandle, forwardRef } from "react";
import { Globe, ArrowRight, Loader2, GitCompareArrows, User, Mail, FileText, Image as ImageIcon, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";

export type UploadKind = "pdf" | "images";

export interface UploadSubmission {
  kind: UploadKind;
  files: File[];
}

interface BrandResearchFormProps {
  onSubmit: (url: string, leadInfo?: { firstName?: string; email?: string }) => void;
  onCompare?: (originalUrl: string, improvedUrl: string, leadInfo?: { firstName?: string; email?: string }) => void;
  onUpload?: (submission: UploadSubmission, leadInfo?: { firstName?: string; email?: string }) => void;
  isLoading: boolean;
  adminMode?: boolean;
}

export interface BrandResearchFormRef {
  clearAndFocus: () => void;
}

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
const MAX_IMAGES = 5;

export const BrandResearchForm = forwardRef<BrandResearchFormRef, BrandResearchFormProps>(
  ({ onSubmit, onCompare, onUpload, isLoading, adminMode = false }, ref) => {
    const [mode, setMode] = useState<"url" | "pdf" | "images">("url");
    const [url, setUrl] = useState("");
    const [improvedUrl, setImprovedUrl] = useState("");
    const [compareMode, setCompareMode] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [email, setEmail] = useState("");
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const pdfInputRef = useRef<HTMLInputElement>(null);
    const imagesInputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
      clearAndFocus: () => {
        setUrl("");
        setImprovedUrl("");
        setPdfFile(null);
        setImageFiles([]);
        setTimeout(() => inputRef.current?.focus(), 100);
      },
    }));

    const leadInfo = (firstName.trim() || email.trim())
      ? { firstName: firstName.trim() || undefined, email: email.trim() || undefined }
      : undefined;

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      if (mode === "url") {
        if (compareMode && url.trim() && improvedUrl.trim() && onCompare) {
          onCompare(url.trim(), improvedUrl.trim(), leadInfo);
        } else if (url.trim()) {
          onSubmit(url.trim(), leadInfo);
        }
        return;
      }

      if (!onUpload) return;

      if (mode === "pdf") {
        if (!pdfFile) {
          toast.error("Please choose a PDF file");
          return;
        }
        onUpload({ kind: "pdf", files: [pdfFile] }, leadInfo);
      } else if (mode === "images") {
        if (imageFiles.length === 0) {
          toast.error("Please choose at least one image");
          return;
        }
        onUpload({ kind: "images", files: imageFiles }, leadInfo);
      }
    };

    const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (file.type !== "application/pdf") {
        toast.error("File must be a PDF");
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        toast.error("PDF must be 20MB or smaller");
        return;
      }
      setPdfFile(file);
    };

    const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length === 0) return;
      const valid: File[] = [];
      for (const f of files) {
        if (!f.type.startsWith("image/")) {
          toast.error(`${f.name} is not an image`);
          continue;
        }
        if (f.size > MAX_FILE_SIZE) {
          toast.error(`${f.name} is larger than 20MB`);
          continue;
        }
        valid.push(f);
      }
      const combined = [...imageFiles, ...valid].slice(0, MAX_IMAGES);
      if (imageFiles.length + valid.length > MAX_IMAGES) {
        toast.warning(`Limited to ${MAX_IMAGES} images`);
      }
      setImageFiles(combined);
      if (imagesInputRef.current) imagesInputRef.current.value = "";
    };

    const removeImage = (idx: number) => {
      setImageFiles(prev => prev.filter((_, i) => i !== idx));
    };

    return (
      <form onSubmit={handleSubmit} className="w-full space-y-3">
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

        <Tabs value={mode} onValueChange={(v) => setMode(v as typeof mode)} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-card/80">
            <TabsTrigger value="url" disabled={isLoading}>
              <Globe className="h-4 w-4 mr-1.5" />
              Website
            </TabsTrigger>
            <TabsTrigger value="pdf" disabled={isLoading}>
              <FileText className="h-4 w-4 mr-1.5" />
              Brand PDF
            </TabsTrigger>
            <TabsTrigger value="images" disabled={isLoading}>
              <ImageIcon className="h-4 w-4 mr-1.5" />
              Mood Board
            </TabsTrigger>
          </TabsList>

          {/* URL MODE */}
          <TabsContent value="url" className="space-y-3 mt-3">
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
                required={mode === "url"}
              />
              {!compareMode && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  <Button
                    type="submit"
                    disabled={isLoading || !url.trim()}
                    className="h-10 px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                  >
                    {isLoading ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Analyzing</>
                    ) : (
                      <>Analyze<ArrowRight className="ml-2 h-4 w-4" /></>
                    )}
                  </Button>
                </div>
              )}
            </div>

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
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Comparing</>
                    ) : (
                      <>Compare<GitCompareArrows className="ml-2 h-4 w-4" /></>
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
          </TabsContent>

          {/* PDF MODE */}
          <TabsContent value="pdf" className="space-y-3 mt-3">
            <input
              ref={pdfInputRef}
              type="file"
              accept="application/pdf"
              onChange={handlePdfChange}
              className="hidden"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => pdfInputRef.current?.click()}
              disabled={isLoading}
              className="w-full min-h-[7rem] rounded-md border-2 border-dashed border-border/60 bg-card hover:bg-card/80 hover:border-primary/40 transition-colors flex flex-col items-center justify-center gap-2 p-4 text-muted-foreground"
            >
              {pdfFile ? (
                <div className="flex items-center gap-2 text-foreground">
                  <FileText className="h-5 w-5 text-primary" />
                  <span className="font-medium">{pdfFile.name}</span>
                  <span className="text-xs text-muted-foreground">
                    ({(pdfFile.size / 1024 / 1024).toFixed(1)} MB)
                  </span>
                </div>
              ) : (
                <>
                  <Upload className="h-6 w-6" />
                  <span className="text-sm font-medium">Click to upload your brand guide PDF</span>
                  <span className="text-xs">Max 20MB</span>
                </>
              )}
            </button>
            <Button
              type="submit"
              disabled={isLoading || !pdfFile}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
            >
              {isLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Analyzing brand PDF</>
              ) : (
                <>Analyze Brand PDF<ArrowRight className="ml-2 h-4 w-4" /></>
              )}
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              Upload an existing brand guide, style guide, or pitch deck (PDF)
            </p>
          </TabsContent>

          {/* IMAGES MODE */}
          <TabsContent value="images" className="space-y-3 mt-3">
            <input
              ref={imagesInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImagesChange}
              className="hidden"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => imagesInputRef.current?.click()}
              disabled={isLoading || imageFiles.length >= MAX_IMAGES}
              className="w-full min-h-[7rem] rounded-md border-2 border-dashed border-border/60 bg-card hover:bg-card/80 hover:border-primary/40 transition-colors flex flex-col items-center justify-center gap-2 p-4 text-muted-foreground disabled:opacity-60"
            >
              <Upload className="h-6 w-6" />
              <span className="text-sm font-medium">
                {imageFiles.length === 0
                  ? "Click to upload mood board images"
                  : `Add more (${imageFiles.length}/${MAX_IMAGES})`}
              </span>
              <span className="text-xs">PNG, JPG, WebP — up to {MAX_IMAGES} images, 20MB each</span>
            </button>

            {imageFiles.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {imageFiles.map((f, i) => (
                  <div key={i} className="relative group rounded-md overflow-hidden border border-border/50 bg-card aspect-square">
                    <img
                      src={URL.createObjectURL(f)}
                      alt={f.name}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 h-6 w-6 rounded-full bg-background/90 text-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Remove"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading || imageFiles.length === 0}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
            >
              {isLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Analyzing mood board</>
              ) : (
                <>Analyze Mood Board<ArrowRight className="ml-2 h-4 w-4" /></>
              )}
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              Pinterest exports, Figma screenshots, logos, or color palette swatches
            </p>
          </TabsContent>
        </Tabs>
      </form>
    );
  }
);

BrandResearchForm.displayName = "BrandResearchForm";
