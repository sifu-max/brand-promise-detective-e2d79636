// Shared type + markdown renderer for Conversation Map Quiz intake artifacts.
// Used by both the quiz results screen and the admin dashboard.

export interface QuizArtifact {
  schemaVersion: string;
  submissionId: string;
  createdAt: string;
  source: string;
  contact: {
    firstName: string | null;
    email: string | null;
    primaryGoal?: string | null;
    speedPreference?: string | null;
  };
  quiz: {
    quizType: string;
    totalScore: number;
    maxScore: number;
    tier: string;
    diagnosis: string;
    recommendation: string;
    modules: string[];
    questionBreakdown: Array<{
      questionId: string;
      title: string;
      stage: string;
      score: number;
      maxScore: number;
    }>;
  };
  brandBuilder: Record<string, unknown>;
  inference: {
    icp: string | null;
    notes?: string | null;
  };
  audit?: {
    submittedFrom?: string | null;
    gHLSyncStatus?: string;
  };
}

export function quizArtifactToMarkdown(artifact: QuizArtifact): string {
  const L: string[] = [];
  L.push(`# Intake Artifact — Conversation Map Quiz`);
  L.push("");
  L.push(`- Submission ID: ${artifact.submissionId}`);
  L.push(`- Created At: ${artifact.createdAt}`);
  L.push(`- Source: ${artifact.source}`);
  if (artifact.audit?.gHLSyncStatus) L.push(`- GHL Sync Status: ${artifact.audit.gHLSyncStatus}`);
  L.push("");
  L.push(`## Contact`);
  L.push(`- First Name: ${artifact.contact.firstName ?? "—"}`);
  L.push(`- Email: ${artifact.contact.email ?? "—"}`);
  if (artifact.contact.primaryGoal !== undefined)
    L.push(`- Primary Goal: ${artifact.contact.primaryGoal ?? "—"}`);
  if (artifact.contact.speedPreference !== undefined)
    L.push(`- Speed Preference: ${artifact.contact.speedPreference ?? "—"}`);
  L.push("");
  L.push(`## Quiz`);
  L.push(`- Quiz Type: ${artifact.quiz.quizType}`);
  L.push(`- Total Score: ${artifact.quiz.totalScore}`);
  L.push(`- Max Score: ${artifact.quiz.maxScore}`);
  L.push(`- Tier: ${artifact.quiz.tier}`);
  L.push(`- Diagnosis: ${artifact.quiz.diagnosis}`);
  L.push(`- Recommendation: ${artifact.quiz.recommendation}`);
  L.push(`- Modules: ${(artifact.quiz.modules || []).join(", ") || "—"}`);
  L.push("");
  L.push(`### Question Breakdown`);
  L.push("| Question | Stage | Score | Max |");
  L.push("|---|---|---|---|");
  for (const qb of artifact.quiz.questionBreakdown || []) {
    L.push(`| ${qb.title} | ${qb.stage} | ${qb.score} | ${qb.maxScore} |`);
  }
  L.push("");
  L.push(`## Brand Builder`);
  for (const [k, v] of Object.entries(artifact.brandBuilder || {})) {
    if (v == null || v === "") {
      L.push(`- ${k}: —`);
      continue;
    }
    if (Array.isArray(v)) {
      L.push(`- ${k}:`);
      for (const item of v) L.push(`  - ${item}`);
    } else if (typeof v === "object") {
      L.push(`- ${k}:\n\n\`\`\`json\n${JSON.stringify(v, null, 2)}\n\`\`\``);
    } else {
      L.push(`- ${k}: ${v}`);
    }
  }
  L.push("");
  L.push(`## Inference`);
  L.push(`- ICP: ${artifact.inference?.icp ?? "—"}`);
  if (artifact.inference?.notes) L.push(`- Notes: ${artifact.inference.notes}`);
  return L.join("\n");
}
