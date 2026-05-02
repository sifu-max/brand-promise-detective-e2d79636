import { 
  XCircle, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Check, 
  ArrowRight,
  Shield,
  Eye,
  FileSearch,
  ExternalLink
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AIVisibilityResult } from "@/types/ai-visibility";

interface AIVisibilityDisplayProps {
  data: AIVisibilityResult;
  analyzedUrl?: string;
}

export function AIVisibilityDisplay({ data, analyzedUrl }: AIVisibilityDisplayProps) {
  const richResultsUrl = analyzedUrl
    ? `https://search.google.com/test/rich-results?url=${encodeURIComponent(analyzedUrl)}`
    : `https://search.google.com/test/rich-results`;
  const isEligible = data.eligibility === "Eligible";
  const isPartial = data.eligibility === "Partially Eligible";
  const isCritical = data.eligibility === "Critically Ineligible";

  const StatusIcon = isEligible ? CheckCircle2 : isPartial ? AlertTriangle : XCircle;
  const statusColor = isEligible 
    ? "text-green-500" 
    : isPartial 
    ? "text-yellow-500" 
    : "text-destructive";
  const statusBg = isEligible
    ? "bg-green-500/10 border-green-500/20"
    : isPartial
    ? "bg-yellow-500/10 border-yellow-500/20"
    : "bg-destructive/10 border-destructive/20";

  const statusLabel =
    data.eligibility === "Critically Ineligible" ? "✕ Critically Ineligible" :
    data.eligibility === "Not Eligible" ? "✕ Not Eligible" :
    data.eligibility === "Partially Eligible" ? "⚠ Partially Eligible" : "✓ Eligible";

  const markers = data.ai_knowledge_graph_markers;

  return (
    <div className="space-y-4 animate-fade-in">
      <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
        <Eye className="h-5 w-5 text-primary" />
        Advanced AI Visibility Scan
      </h3>
      <p className="text-sm text-muted-foreground -mt-2">
        Our scan doesn't just look for any code; it looks specifically for <span className="font-semibold text-foreground">AI-Citation Eligibility</span>. Basic tools see the old SEO tags — we see the future <span className="font-semibold text-foreground">AI-Identity tags</span>.
      </p>

      {/* Eligibility Banner */}
      <Card className={`${statusBg} border`}>
        <CardContent className="flex items-start gap-4 py-5">
          <StatusIcon className={`h-8 w-8 ${statusColor} shrink-0 mt-0.5`} />
          <div>
            <h4 className={`text-lg font-bold ${statusColor}`}>
              {statusLabel}
            </h4>
            <p className="text-sm text-muted-foreground mt-1">
              {data.eligibility_summary}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* AI Knowledge Graph Markers */}
      {markers && (
        <Card>
          <CardContent className="py-5 space-y-3">
            <h4 className="text-base font-bold text-foreground flex items-center gap-2">
              <FileSearch className="h-4 w-4 text-primary" />
              AI Knowledge Graph Markers
            </h4>
            <p className="text-xs text-muted-foreground">
              The specific schema types AI systems use to recognize your business identity, location, expertise, and lead-capture intent.
            </p>
            <ul className="space-y-2 mt-2">
              <FindingRow found={markers.organization} label="@type: Organization" value={markers.organization ? "Detected" : "Missing — No Identity"} highlight={!markers.organization} />
              <FindingRow found={markers.local_business} label="@type: LocalBusiness" value={markers.local_business ? "Detected" : "Missing — No Location/Niche"} highlight={!markers.local_business} />
              <FindingRow found={markers.service} label="@type: Service" value={markers.service ? "Detected" : "Missing — No Offer Definition"} highlight={!markers.service} />
              <FindingRow found={markers.knows_about} label="knowsAbout" value={markers.knows_about ? "Detected" : "Missing — No Authority/Expertise"} highlight={!markers.knows_about} />
              <FindingRow found={markers.potential_action} label="potentialAction" value={markers.potential_action ? "Detected" : "Missing — No Lead Capture for AI"} highlight={!markers.potential_action} />
            </ul>
          </CardContent>
        </Card>
      )}


      {/* Verify with Google */}
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="py-4 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              Verify AI Identity
            </h4>
            <p className="text-xs text-muted-foreground">
              See live in Google's Rich Results Test what AI systems detect on your site.
            </p>
          </div>
          <Button asChild variant="outline" className="shrink-0">
            <a href={richResultsUrl} target="_blank" rel="noopener noreferrer">
              Verify AI Identity
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </CardContent>
      </Card>

      {/* What We Found */}
      <Card>
        <CardContent className="py-5 space-y-4">
          <h4 className="text-base font-bold text-foreground">What We Found</h4>
          <ul className="space-y-3">
            <FindingRow
              found={data.findings.schema_detected}
              label="Schema detected"
              value={data.findings.schema_detected ? `Yes (${data.findings.schema_types.join(", ")})` : "No"}
            />
            <FindingRow
              found={data.findings.machine_readable_identity === "Present"}
              label="Machine-readable identity"
              value={data.findings.machine_readable_identity}
              highlight={data.findings.machine_readable_identity === "Missing"}
            />
            <FindingRow
              found={data.findings.ai_citation_eligibility === "Possible"}
              label="AI citation eligibility"
              value={data.findings.ai_citation_eligibility}
            />
            <FindingRow
              found={data.findings.trust_signal_count >= 4}
              partial={data.findings.trust_signal_count >= 2 && data.findings.trust_signal_count < 4}
              label="Structural trust signals"
              value={`${data.findings.trust_signal_count >= 4 ? "Complete" : "Incomplete"} (${data.findings.trust_signal_count}/${data.findings.trust_signal_total})`}
            />
          </ul>
        </CardContent>
      </Card>

      {/* Why This Matters */}
      <Card>
        <CardContent className="py-5 space-y-3">
          <h4 className="text-base font-bold text-foreground">Why This Matters</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            AI systems like ChatGPT, Claude, Perplexity, and Google's AI Overviews don't browse the web the way
            humans do. They ingest <span className="text-primary font-medium underline">structured data</span> — machine-readable signals that clearly define who you are,
            what you do, and why you matter.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Without this foundation, AI systems cannot confidently recognize or cite your business — even if your
            website looks perfect to human visitors.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            <span className="text-coral font-semibold">Ranking is irrelevant without eligibility.</span> Before AI can recommend you, it must first be able to <em>identify</em> you.
          </p>
        </CardContent>
      </Card>

      {/* What to Do Next - CTA */}
      <Card>
        <CardContent className="py-5 space-y-4">
          <h4 className="text-base font-bold text-foreground">What to Do Next</h4>
          <p className="text-sm text-muted-foreground">
            We recommend scheduling a brief <span className="font-semibold text-foreground">Eligibility Strategy Session</span> where we'll:
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
              Review your scan results together
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
              Clarify what's missing (and what's not)
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
              Outline the minimum structure required to become AI-visible
            </li>
          </ul>
          <Button asChild className="w-full sm:w-auto">
            <a
              href="https://www.crmchains.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Book an Eligibility Strategy Session
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
          <p className="text-xs text-muted-foreground italic">
            This conversation is about eligibility — not selling services. If visibility matters to your business, this is the right place to start.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function FindingRow({ 
  found, 
  partial, 
  label, 
  value, 
  highlight 
}: { 
  found: boolean; 
  partial?: boolean; 
  label: string; 
  value: string; 
  highlight?: boolean; 
}) {
  return (
    <li className="flex items-center gap-3 text-sm">
      {found ? (
        <Check className="h-4 w-4 text-green-500 shrink-0" />
      ) : partial ? (
        <AlertTriangle className="h-4 w-4 text-yellow-500 shrink-0" />
      ) : (
        <X className="h-4 w-4 text-destructive shrink-0" />
      )}
      <span className="text-muted-foreground">
        {label}:{" "}
        <span className={highlight ? "text-coral font-semibold" : "font-medium text-foreground"}>
          {value}
        </span>
      </span>
    </li>
  );
}
