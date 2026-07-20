export type BrandDataLike = Record<string, unknown>;

export function flattenBrandData(brandData: BrandDataLike): BrandDataLike {
  const flatBrandData: BrandDataLike = { ...brandData };

  if (brandData.brandingIntake && typeof brandData.brandingIntake === "object") {
    for (const [key, value] of Object.entries(brandData.brandingIntake as Record<string, unknown>)) {
      if (flatBrandData[key] === undefined || flatBrandData[key] === "") {
        flatBrandData[key] = value;
      }
    }
  }

  return flatBrandData;
}

export function buildInferenceNotes(brandData: BrandDataLike) {
  const parts = [
    brandData.quizType ? `Quiz: ${brandData.quizType}` : "",
    brandData.icp ? `ICP: ${brandData.icp}` : "",
    brandData.tier ? `Tier: ${brandData.tier}` : "",
    brandData.totalScore !== undefined && brandData.maxScore !== undefined
      ? `Score: ${brandData.totalScore}/${brandData.maxScore}`
      : "",
  ].filter(Boolean);

  return parts.join(" — ");
}

export function resolveOpportunityName(brandData: BrandDataLike) {
  const flatBrandData = flattenBrandData(brandData);
  const candidates = [
    flatBrandData.business_tagline,
    flatBrandData.tagline,
    flatBrandData.source_url,
  ];

  const firstString = candidates.find((value): value is string => typeof value === "string" && value.trim().length > 0);

  return firstString || "New Brand Opportunity";
}
