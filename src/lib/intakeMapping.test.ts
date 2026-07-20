import { describe, expect, it } from "vitest";
import { buildInferenceNotes, flattenBrandData, resolveOpportunityName } from "./intakeMapping";

describe("intake mapping", () => {
  it("flattens branding intake values into the top-level payload", () => {
    const input = {
      brandingIntake: {
        tagline: "Growth Systems",
        cta: "Book a call",
      },
    };

    const flattened = flattenBrandData(input);

    expect(flattened.tagline).toBe("Growth Systems");
    expect(flattened.cta).toBe("Book a call");
  });

  it("builds the swarm-aligned inference note", () => {
    const note = buildInferenceNotes({
      quizType: "conversation-map",
      icp: "Agency / Brokerage",
      tier: "Fragmented Infrastructure",
      totalScore: 24,
      maxScore: 50,
    });

    expect(note).toBe("Quiz: conversation-map — ICP: Agency / Brokerage — Tier: Fragmented Infrastructure — Score: 24/50");
  });

  it("uses the intake tagline for the opportunity name when available", () => {
    const name = resolveOpportunityName({
      brandingIntake: {
        tagline: "Revenue Recovery",
      },
    });

    expect(name).toBe("Revenue Recovery");
  });
});
