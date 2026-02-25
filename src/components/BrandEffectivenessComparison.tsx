import { Award, TrendingUp, TrendingDown, Minus, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BrandEffectivenessResult } from "@/types/brand-effectiveness";

interface BrandEffectivenessComparisonProps {
  original: BrandEffectivenessResult;
  improved: BrandEffectivenessResult;
  originalUrl: string;
  improvedUrl: string;
}

function getScoreColor(score: number): string {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-yellow-600";
  if (score >= 40) return "text-orange-600";
  return "text-red-600";
}

function getProgressColor(score: number): string {
  if (score >= 80) return "bg-green-500";
  if (score >= 60) return "bg-yellow-500";
  if (score >= 40) return "bg-orange-500";
  return "bg-red-500";
}

function getDeltaDisplay(delta: number) {
  if (delta > 0) return { icon: <TrendingUp className="h-3.5 w-3.5" />, color: "text-green-600", prefix: "+" };
  if (delta < 0) return { icon: <TrendingDown className="h-3.5 w-3.5" />, color: "text-red-600", prefix: "" };
  return { icon: <Minus className="h-3.5 w-3.5" />, color: "text-muted-foreground", prefix: "±" };
}

function getGradeColor(grade: string): string {
  if (grade.startsWith("A")) return "bg-green-500/10 text-green-600 border-green-500/20";
  if (grade.startsWith("B")) return "bg-blue-500/10 text-blue-600 border-blue-500/20";
  if (grade.startsWith("C")) return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
  if (grade.startsWith("D")) return "bg-orange-500/10 text-orange-600 border-orange-500/20";
  return "bg-red-500/10 text-red-600 border-red-500/20";
}

export function BrandEffectivenessComparison({ original, improved, originalUrl, improvedUrl }: BrandEffectivenessComparisonProps) {
  const overallDelta = improved.overall_score - original.overall_score;
  const overallDeltaDisplay = getDeltaDisplay(overallDelta);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Overall Comparison Header */}
      <Card className="bg-card border-border/50 shadow-sm overflow-hidden">
        <div className="p-6 md:p-8">
          <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Brand Effectiveness Comparison
          </h3>

          {/* Overall scores side by side */}
          <div className="grid grid-cols-3 gap-4 items-center mb-8">
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1 truncate">{new URL(originalUrl).hostname}</p>
              <div className={`text-4xl font-bold ${getScoreColor(original.overall_score)}`}>
                {original.overall_score}
              </div>
              <Badge className={`${getGradeColor(original.overall_grade)} border mt-2`}>
                {original.overall_grade}
              </Badge>
            </div>

            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Change</p>
              <div className={`text-3xl font-bold flex items-center justify-center gap-1 ${overallDeltaDisplay.color}`}>
                {overallDeltaDisplay.icon}
                {overallDeltaDisplay.prefix}{Math.abs(overallDelta)}
              </div>
            </div>

            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1 truncate">{new URL(improvedUrl).hostname}</p>
              <div className={`text-4xl font-bold ${getScoreColor(improved.overall_score)}`}>
                {improved.overall_score}
              </div>
              <Badge className={`${getGradeColor(improved.overall_grade)} border mt-2`}>
                {improved.overall_grade}
              </Badge>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 text-sm text-foreground leading-relaxed">
            We analyzed your current site and created a preliminary revamp. Your brand effectiveness score went from{" "}
            <strong className={getScoreColor(original.overall_score)}>{original.overall_score} ({original.overall_grade})</strong> to{" "}
            <strong className={getScoreColor(improved.overall_score)}>{improved.overall_score} ({improved.overall_grade})</strong>.
            {" "}Our goal is to have all clients score a <strong>B or better</strong> with full AI visibility.
            {" "}Let us know if there is anything we can do to assist you —{" "}
            <a href="https://www.crmchains.com" target="_blank" rel="noopener noreferrer" className="text-primary font-medium hover:underline">
              www.crmchains.com
            </a>
          </div>

          {/* Category-by-category comparison */}
          <div className="space-y-5">
            {improved.categories.map((improvedCat, i) => {
              const originalCat = original.categories.find(c => c.category === improvedCat.category) || original.categories[i];
              const delta = improvedCat.score - (originalCat?.score || 0);
              const deltaDisplay = getDeltaDisplay(delta);

              return (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">{improvedCat.category}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground text-xs">{originalCat?.score || 0}</span>
                      <span className={`font-semibold flex items-center gap-1 ${deltaDisplay.color}`}>
                        {deltaDisplay.icon}
                        {deltaDisplay.prefix}{Math.abs(delta)}
                      </span>
                      <span className={`font-semibold ${getScoreColor(improvedCat.score)}`}>
                        {improvedCat.score}
                      </span>
                    </div>
                  </div>

                  {/* Stacked progress bars */}
                  <div className="space-y-1">
                    <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden opacity-40">
                      <div
                        className={`h-full rounded-full ${getProgressColor(originalCat?.score || 0)}`}
                        style={{ width: `${originalCat?.score || 0}%` }}
                      />
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ease-out ${getProgressColor(improvedCat.score)}`}
                        style={{ width: `${improvedCat.score}%` }}
                      />
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground">{improvedCat.reasoning}</p>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* AI Scoring Disclaimer */}
      <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/30 border border-border/50">
        <AlertTriangle className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          <span className="font-medium">About AI-based scoring:</span> Scores are generated by an AI model using anchored scoring (the improved site is scored relative to the original).
          Results may still vary slightly (±5 points) due to content extraction variability and model non-determinism.
          Use as directional guidance. For a definitive brand audit, consult a branding professional.
        </p>
      </div>
    </div>
  );
}