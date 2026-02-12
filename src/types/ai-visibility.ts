export interface AIVisibilityResult {
  eligibility: "Eligible" | "Partially Eligible" | "Not Eligible";
  eligibility_summary: string;
  findings: {
    schema_detected: boolean;
    schema_types: string[];
    machine_readable_identity: "Present" | "Missing";
    ai_citation_eligibility: "Possible" | "Not possible";
    trust_signal_count: number;
    trust_signal_total: number;
  };
  details: {
    json_ld: boolean;
    json_ld_types: string[];
    open_graph: boolean;
    open_graph_tags: Record<string, string>;
    twitter_cards: boolean;
    meta_description: boolean;
    canonical_url: boolean;
    semantic_html: boolean;
    h1_present: boolean;
    alt_text_coverage: number;
    blocks_ai: boolean;
  };
  trust_signals: {
    has_meta_description: boolean;
    has_canonical: boolean;
    has_semantic_html: boolean;
    has_h1: boolean;
    has_good_alt_text: boolean;
  };
  source_url: string;
}
