export interface BrandResearchResult {
  business_tagline: string;
  primary_call_to_action: string;
  core_service_solution: string;
  core_client_pain_points: string[];
  communication_tone: "Professional" | "Casual/Friendly" | "Urgent/Direct";
  clients_budget_timeline: string;
  core_offer_investment: string;
  ideal_client_niche: string;
  offer_structure: "Basic and Premium options" | "Single Price Offer" | "Tiered 3+";
  source_url: string;
  inference_notes: string;
}
