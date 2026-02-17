export interface CategoryScore {
  category: string;
  score: number; // 0-100
  label: string; // e.g. "Strong", "Needs Work"
  reasoning: string;
}

export interface BrandSuggestion {
  category: string;
  suggestion: string;
  impact: "High" | "Medium" | "Low";
}

export interface BrandEffectivenessResult {
  overall_score: number;
  overall_grade: string;
  categories: CategoryScore[];
  free_suggestions: BrandSuggestion[];
  gated_suggestions?: BrandSuggestion[];
  gated_suggestion_count: number;
}
