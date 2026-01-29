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
  Download
} from "lucide-react";
import { useState } from "react";
import { BrandResearchResult } from "@/types/brand";
import { BrandResultCard } from "./BrandResultCard";
import { BrandDNADisplay } from "./BrandDNADisplay";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface BrandResultsProps {
  data: BrandResearchResult;
}

export function BrandResults({ data }: BrandResultsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyJson = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      setCopied(true);
      toast.success("JSON copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const handleDownloadJson = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
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

  const structureColors = {
    "Basic and Premium options": "bg-purple-500/10 text-purple-600 border-purple-500/20",
    "Single Price Offer": "bg-teal-500/10 text-teal-600 border-teal-500/20",
    "Tiered 3+": "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
  };

  return (
    <div className="space-y-6">
      {/* Actions Bar */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Brand Analysis Results</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleCopyJson}>
            {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
            {copied ? "Copied" : "Copy JSON"}
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownloadJson}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
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

        {data.inference_notes && (
          <BrandResultCard icon={<FileText className="h-4 w-4" />} title="Inference Notes" delay={500}>
            <p className="text-sm text-muted-foreground italic">{data.inference_notes}</p>
          </BrandResultCard>
        )}
      </div>
    </div>
  );
}
