# Admin Intake Artifact Spec

This artifact is for internal use only. It is not meant to be shown to the client.

## Purpose

Generate one structured intake snapshot per submission so the frontend, GHL, and swarm can all validate the same source-of-truth payload.

## Recommended storage

- Save the JSON artifact in a GHL custom field on the Contact object, such as:
  - `intake_artifact_json`
- Keep the Markdown version for admin review, Google Drive export, or operator handoff.

## JSON schema

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Admin Intake Artifact",
  "type": "object",
  "required": [
    "schemaVersion",
    "submissionId",
    "createdAt",
    "source",
    "contact",
    "opportunity",
    "quiz",
    "brandBuilder",
    "inference",
    "audit"
  ],
  "properties": {
    "schemaVersion": {
      "type": "string",
      "const": "1.0"
    },
    "submissionId": {
      "type": "string"
    },
    "createdAt": {
      "type": "string",
      "format": "date-time"
    },
    "source": {
      "type": "string",
      "enum": ["lovable-quiz", "brand-builder", "manual-import"]
    },
    "contact": {
      "type": "object",
      "properties": {
        "firstName": { "type": ["string", "null"] },
        "lastName": { "type": ["string", "null"] },
        "email": { "type": ["string", "null"] },
        "phone": { "type": ["string", "null"] },
        "businessName": { "type": ["string", "null"] },
        "website": { "type": ["string", "null"] },
        "coreService": { "type": ["string", "null"] },
        "idealClient": { "type": ["string", "null"] },
        "painPoints": { "type": "array", "items": { "type": "string" } },
        "leadSources": { "type": "array", "items": { "type": "string" } },
        "followUpProcess": { "type": ["string", "null"] },
        "hoursPerWeek": { "type": ["string", "null"] },
        "adsBudgetMonthlyUsd": { "type": ["string", "null"] },
        "teamSize": { "type": ["string", "null"] },
        "primaryGoal": { "type": ["string", "null"] },
        "speedPreference": { "type": ["string", "null"] }
      },
      "additionalProperties": false
    },
    "opportunity": {
      "type": "object",
      "properties": {
        "name": { "type": ["string", "null"] },
        "pipelineId": { "type": ["string", "null"] },
        "locationId": { "type": ["string", "null"] },
        "stage": { "type": ["string", "null"] },
        "status": { "type": ["string", "null"] },
        "estimatedValue": { "type": ["string", "null"] }
      },
      "additionalProperties": false
    },
    "quiz": {
      "type": "object",
      "properties": {
        "quizType": { "type": ["string", "null"] },
        "totalScore": { "type": ["number", "null"] },
        "maxScore": { "type": ["number", "null"] },
        "tier": { "type": ["string", "null"] },
        "diagnosis": { "type": ["string", "null"] },
        "recommendation": { "type": ["string", "null"] },
        "modules": { "type": "array", "items": { "type": "string" } },
        "questionBreakdown": { "type": "array", "items": { "type": "object" } }
      },
      "additionalProperties": false
    },
    "brandBuilder": {
      "type": "object",
      "properties": {
        "tagline": { "type": ["string", "null"] },
        "primaryCallToAction": { "type": ["string", "null"] },
        "coreServiceSolution": { "type": ["string", "null"] },
        "painPoints": { "type": "array", "items": { "type": "string" } },
        "communicationTone": { "type": ["string", "null"] },
        "budgetTimeline": { "type": ["string", "null"] },
        "coreOfferInvestment": { "type": ["string", "null"] },
        "offerStructure": { "type": ["string", "null"] },
        "idealClient": { "type": ["string", "null"] },
        "sourceUrl": { "type": ["string", "null"] },
        "brandColors": { "type": "array", "items": { "type": "string" } },
        "brandFonts": { "type": "array", "items": { "type": "string" } },
        "videoUrl": { "type": ["string", "null"] },
        "embedLinks": { "type": "array", "items": { "type": "string" } }
      },
      "additionalProperties": false
    },
    "inference": {
      "type": "object",
      "properties": {
        "notes": { "type": ["string", "null"] },
        "brandResearchExportLink": { "type": ["string", "null"] },
        "quizScoreTierIcp": { "type": ["string", "null"] }
      },
      "additionalProperties": false
    },
    "audit": {
      "type": "object",
      "properties": {
        "submittedBy": { "type": ["string", "null"] },
        "submittedFrom": { "type": ["string", "null"] },
        "gHLSyncStatus": { "type": "string" },
        "swarmSyncStatus": { "type": "string" }
      },
      "additionalProperties": false
    }
  },
  "additionalProperties": false
}
```

## Markdown template

```md
# Intake Artifact

- Submission ID: {submissionId}
- Created At: {createdAt}
- Source: {source}
- GHL Sync Status: {audit.gHLSyncStatus}
- Swarm Sync Status: {audit.swarmSyncStatus}

## Contact
- First Name: {contact.firstName}
- Email: {contact.email}
- Business Name: {contact.businessName}
- Website: {contact.website}
- Core Service: {contact.coreService}
- Ideal Client: {contact.idealClient}
- Pain Points: {contact.painPoints}
- Lead Sources: {contact.leadSources}
- Follow-Up Process: {contact.followUpProcess}
- Hours Per Week: {contact.hoursPerWeek}
- Ad Budget: {contact.adsBudgetMonthlyUsd}
- Team Size: {contact.teamSize}
- Primary Goal: {contact.primaryGoal}
- Speed Preference: {contact.speedPreference}

## Brand Builder
- Tagline: {brandBuilder.tagline}
- Primary CTA: {brandBuilder.primaryCallToAction}
- Core Service / Solution: {brandBuilder.coreServiceSolution}
- Communication Tone: {brandBuilder.communicationTone}
- Budget Timeline: {brandBuilder.budgetTimeline}
- Offer Structure: {brandBuilder.offerStructure}
- Ideal Client: {brandBuilder.idealClient}
- Source URL: {brandBuilder.sourceUrl}

## Quiz
- Quiz Type: {quiz.quizType}
- Total Score: {quiz.totalScore}
- Max Score: {quiz.maxScore}
- Tier: {quiz.tier}
- Diagnosis: {quiz.diagnosis}
- Recommendation: {quiz.recommendation}
- Modules: {quiz.modules}

## Inference
- Notes: {inference.notes}
- Brand Research Export Link: {inference.brandResearchExportLink}
- Quiz Score / Tier / ICP: {inference.quizScoreTierIcp}
```

## Implementation note

This artifact should be generated server-side or in an admin workflow, not rendered to the client as a primary experience. The resulting JSON can be stored in a GHL custom field such as `intake_artifact_json`.
