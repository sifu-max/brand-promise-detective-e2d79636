import { TrendingUp, Award, Lock, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BrandEffectivenessResult } from "@/types/brand-effectiveness";
import { BrandResultCard } from "./BrandResultCard";

interface BrandEffectivenessDisplayProps {
  data: BrandEffectivenessResult;
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

function getGradeColor(grade: string): string {
  if (grade.startsWith("A")) return "bg-green-500/10 text-green-600 border-green-500/20";
  if (grade.startsWith("B")) return "bg-blue-500/10 text-blue-600 border-blue-500/20";
  if (grade.startsWith("C")) return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
  if (grade.startsWith("D")) return "bg-orange-500/10 text-orange-600 border-orange-500/20";
  return "bg-red-500/10 text-red-600 border-red-500/20";
}

function getImpactColor(impact: string): string {
  if (impact === "High") return "bg-red-500/10 text-red-600 border-red-500/20";
  if (impact === "Medium") return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
  return "bg-blue-500/10 text-blue-600 border-blue-500/20";
}

export function BrandEffectivenessDisplay({ data }: BrandEffectivenessDisplayProps) {
  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <Card className="bg-card border-border/50 shadow-sm overflow-hidden animate-fade-in">
        <div className="flex flex-col md:flex-row">
          <div className="flex items-center justify-center p-8 md:p-12 bg-primary/5 md:w-1/3">
            <div className="text-center">
              <div className={`text-6xl font-bold ${getScoreColor(data.overall_score)}`}>
                {data.overall_score}
              </div>
              <div className="text-sm text-muted-foreground mt-1">out of 100</div>
              <Badge className={`${getGradeColor(data.overall_grade)} border text-lg font-bold mt-3 px-4 py-1`}>
                {data.overall_grade}
              </Badge>
            </div>
          </div>
          <div className="flex-1 p-6 md:p-8">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Brand Effectiveness Breakdown
            </h3>
            <div className="space-y-4">
              {data.categories.map((cat, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">{cat.category}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs font-normal">
                        {cat.label}
                      </Badge>
                      <span className={`font-semibold ${getScoreColor(cat.score)}`}>
                        {cat.score}
                      </span>
                    </div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ease-out ${getProgressColor(cat.score)}`}
                      style={{ width: `${cat.score}%`, animationDelay: `${i * 100}ms` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">{cat.reasoning}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Free Suggestions */}
      <BrandResultCard
        icon={<TrendingUp className="h-4 w-4" />}
        title="Improvement Suggestions"
        delay={100}
      >
        <div className="space-y-4">
          {data.free_suggestions.map((suggestion, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium flex items-center justify-center mt-0.5">
                {i + 1}
              </span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-foreground">{suggestion.category}</span>
                  <Badge className={`${getImpactColor(suggestion.impact)} border text-xs`}>
                    {suggestion.impact} Impact
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{suggestion.suggestion}</p>
              </div>
            </div>
          ))}

          {/* Gated CTA */}
          {data.gated_suggestion_count > 0 && (
            <div className="relative mt-4">
              {/* Blurred placeholder */}
              <div className="space-y-3 opacity-40 blur-[2px] pointer-events-none select-none">
                {Array.from({ length: Math.min(data.gated_suggestion_count, 2) }).map((_, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-muted" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-32 bg-muted rounded" />
                      <div className="h-3 w-full bg-muted rounded" />
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-card/95 backdrop-blur-sm border border-border rounded-xl p-6 text-center shadow-lg max-w-sm mx-4">
                  <Lock className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h4 className="text-base font-semibold text-foreground mb-1">
                    {data.gated_suggestion_count} More Improvement{data.gated_suggestion_count > 1 ? "s" : ""} Available
                  </h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Get a full brand audit with actionable recommendations from CRMChains
                  </p>
                  <Button asChild className="w-full">
                    <a
                      href="https://www.crmchains.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Contact CRMChains
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </BrandResultCard>
    </div>
  );
}
