import { 
  Sparkles, 
  MousePointerClick, 
  Lightbulb, 
  AlertCircle, 
  MessageSquare, 
  Clock, 
  DollarSign, 
  Users, 
  Layers, 
  Link, 
  FileText,
  Copy,
  Check,
  Download,
  Printer
} from "lucide-react";
import { useState } from "react";
import { BrandResearchResult } from "@/types/brand";
import { BrandEffectivenessResult } from "@/types/brand-effectiveness";
import { AIVisibilityResult } from "@/types/ai-visibility";
import { BrandResultCard } from "./BrandResultCard";
import { BrandDNADisplay } from "./BrandDNADisplay";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface BrandResultsProps {
  data: BrandResearchResult;
  effectiveness?: BrandEffectivenessResult | null;
  visibility?: AIVisibilityResult | null;
  adminMode?: boolean;
}

export function BrandResults({ data, effectiveness, visibility, adminMode = false }: BrandResultsProps) {
  const [copied, setCopied] = useState(false);
  const [serviceType, setServiceType] = useState<string>("complete");

  const buildExportData = () => {
    const exportData: any = {
      service_type: serviceType === "schema_only" ? "AI Schema Implementation Only" : "Complete Design / Redesign",
      brand_research: data,
    };
    if (effectiveness) exportData.brand_effectiveness = effectiveness;
    if (visibility) exportData.ai_visibility_schema = visibility;
    return exportData;
  };

  const handleCopyJson = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(buildExportData(), null, 2));
      setCopied(true);
      toast.success("JSON copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const handleDownloadJson = () => {
    const blob = new Blob([JSON.stringify(buildExportData(), null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `brand-research-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("JSON file downloaded");
  };

  const toneColors = {
    Professional: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    "Casual/Friendly": "bg-green-500/10 text-green-600 border-green-500/20",
    "Urgent/Direct": "bg-orange-500/10 text-orange-600 border-orange-500/20",
  };

  const structureColors: Record<string, string> = {
    "Basic and Premium options": "bg-purple-500/10 text-purple-600 border-purple-500/20",
    "Single Price Offer": "bg-teal-500/10 text-teal-600 border-teal-500/20",
    "Tiered 3+": "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
    "Not determinable from site": "bg-gray-500/10 text-gray-600 border-gray-500/20",
  };

  const confidenceColors = {
    High: "bg-green-500/10 text-green-600 border-green-500/20",
    Medium: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    Low: "bg-red-500/10 text-red-600 border-red-500/20",
  };

  return (
    <div className="space-y-6">
      {/* Service Type Selector - Admin only */}
      {adminMode && (
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 p-4 rounded-lg bg-muted/50 border border-border">
          <div className="flex-1 space-y-1.5">
            <Label htmlFor="service-type" className="text-sm font-medium">Service Type</Label>
            <Select value={serviceType} onValueChange={setServiceType}>
              <SelectTrigger id="service-type" className="w-full sm:w-[320px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="schema_only">Add AI Schema Only — No Other Modifications</SelectItem>
                <SelectItem value="complete">Complete Design or Redesign</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Actions Bar */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Brand Analysis Results</h2>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          {adminMode && (
            <>
              <Button variant="outline" size="sm" onClick={handleCopyJson}>
                {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                {copied ? "Copied" : "Copy JSON"}
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownloadJson}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Hero Section - Tagline & CTA */}
      <div className="grid gap-4 md:grid-cols-2">
        <BrandResultCard icon={<Sparkles className="h-4 w-4" />} title="Business Tagline" delay={0}>
          <p className="text-lg font-medium text-foreground">{data.business_tagline}</p>
        </BrandResultCard>
        
        <BrandResultCard icon={<MousePointerClick className="h-4 w-4" />} title="Primary Call-to-Action" delay={50}>
          <p className="text-lg font-medium text-primary">{data.primary_call_to_action}</p>
        </BrandResultCard>
      </div>

      {/* Core Solution */}
      <BrandResultCard icon={<Lightbulb className="h-4 w-4" />} title="Core Service/Solution" delay={100}>
        <p className="text-muted-foreground leading-relaxed">{data.core_service_solution}</p>
      </BrandResultCard>

      {/* Pain Points */}
      <BrandResultCard icon={<AlertCircle className="h-4 w-4" />} title="Core Client Pain Points" delay={150}>
        <ul className="space-y-2">
          {data.core_client_pain_points.map((pain, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-destructive/10 text-destructive text-sm font-medium flex items-center justify-center mt-0.5">
                {index + 1}
              </span>
              <span className="text-muted-foreground">{pain}</span>
            </li>
          ))}
        </ul>
      </BrandResultCard>

      {/* Communication & Structure Badges */}
      <div className="grid gap-4 md:grid-cols-2">
        <BrandResultCard icon={<MessageSquare className="h-4 w-4" />} title="Communication Tone" delay={200}>
          <Badge className={`${toneColors[data.communication_tone]} border text-sm font-medium`}>
            {data.communication_tone}
          </Badge>
        </BrandResultCard>

        <BrandResultCard icon={<Layers className="h-4 w-4" />} title="Offer Structure" delay={250}>
          <Badge className={`${structureColors[data.offer_structure]} border text-sm font-medium`}>
            {data.offer_structure}
          </Badge>
        </BrandResultCard>
      </div>

      {/* Pricing & Timeline */}
      <div className="grid gap-4 md:grid-cols-2">
        <BrandResultCard icon={<DollarSign className="h-4 w-4" />} title="Core Offer Investment" delay={300}>
          <p className="text-muted-foreground">{data.core_offer_investment}</p>
        </BrandResultCard>

        <BrandResultCard icon={<Clock className="h-4 w-4" />} title="Client Budget & Timeline" delay={350}>
          <p className="text-muted-foreground">{data.clients_budget_timeline}</p>
        </BrandResultCard>
      </div>

      {/* Brand DNA */}
      {data.brand_dna && (
        <BrandDNADisplay brandDna={data.brand_dna} delay={400} />
      )}

      {/* Ideal Client */}
      <BrandResultCard icon={<Users className="h-4 w-4" />} title="Ideal Client Niche" delay={450}>
        <p className="text-muted-foreground">{data.ideal_client_niche}</p>
      </BrandResultCard>

      {/* Source & Inference Notes */}
      <div className="grid gap-4 md:grid-cols-2">
        <BrandResultCard icon={<Link className="h-4 w-4" />} title="Source URL" delay={450}>
          <a 
            href={data.source_url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-primary hover:underline break-all"
          >
            {data.source_url}
          </a>
        </BrandResultCard>

        <BrandResultCard icon={<FileText className="h-4 w-4" />} title="Extraction Confidence" delay={500}>
          <Badge className={`${confidenceColors[data.extraction_confidence]} border text-sm font-medium`}>
            {data.extraction_confidence}
          </Badge>
          <p className="text-xs text-muted-foreground mt-2">
            {data.extraction_confidence === "High" ? "Most data was found directly on the site" : 
             data.extraction_confidence === "Medium" ? "Some fields could not be found on the site" :
             "Limited data found - many fields marked as not found"}
          </p>
        </BrandResultCard>
      </div>
    </div>
  );
}
