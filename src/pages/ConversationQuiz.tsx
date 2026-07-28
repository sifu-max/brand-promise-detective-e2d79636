import { useState, useEffect } from "react";
import {
  ArrowRight, ArrowLeft, CheckCircle2, AlertTriangle, Target,
  TrendingUp, Zap, Mail, Sparkles, Shield, Loader2, Copy, Download, FileText,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import crmchainsLogo from "@/assets/crmchains-logo.jpg";
import { supabase } from "@/integrations/supabase/client";
import DynamicFieldsForm, { type DynamicField } from "@/components/DynamicFieldsForm";
import { quizArtifactToMarkdown, type QuizArtifact } from "@/lib/quizArtifact";
import { toast } from "sonner";

/* ───────────────────────── ICP Definitions ───────────────────────── */

const icpProfiles = [
  { id: "service-local", label: "Local Service Business", description: "Plumbers, HVAC, roofers, clinics — relying on local calls & leads", icon: "🏠" },
  { id: "agency", label: "Agency / Brokerage", description: "Insurance, real estate, staffing — managing sub-agents & funnels", icon: "🏢" },
  { id: "coach-consultant", label: "Coach / Consultant", description: "Selling high-ticket expertise needing booked calls to close", icon: "🎯" },
  { id: "ecommerce-saas", label: "E-Commerce / SaaS", description: "Online sales with automated support & retention needs", icon: "🛒" },
];

/* ───────────────────────── Lean Seed Quiz ───────────────────────── */

interface QuizOption { label: string; points: number; }
interface QuizQuestion { id: string; stage: string; title: string; prompt: string; options: QuizOption[]; }

const seedQuestions: QuizQuestion[] = [
  {
    id: "capture",
    stage: "Lead Capture",
    title: "Are you catching every lead?",
    prompt: "How confident are you that your business catches every incoming conversation — calls, texts, DMs, and web forms?",
    options: [
      { label: "We capture and track everything automatically", points: 5 },
      { label: "Most conversations are captured", points: 3 },
      { label: "Some slip through the cracks", points: 2 },
      { label: "We miss a significant amount", points: 1 },
    ],
  },
  {
    id: "speed",
    stage: "Speed-to-Lead",
    title: "How quickly do you reply?",
    prompt: "When someone reaches out after hours or during busy times, how fast do they hear back?",
    options: [
      { label: "Immediate automated + personalized response 24/7", points: 5 },
      { label: "Quick response within a few minutes", points: 4 },
      { label: "Manual response within an hour or two", points: 3 },
      { label: "Inconsistent — depends on workload", points: 2 },
      { label: "Often takes until the next business day", points: 1 },
    ],
  },
  {
    id: "hurting_area",
    stage: "Primary Bottleneck",
    title: "What is your biggest operational pain point?",
    prompt: "Which area is causing the most friction or lost revenue in your business right now?",
    options: [
      { label: "Speed-to-lead gap & missed call leakage", points: 1 },
      { label: "Rising lead costs / poor ad return", points: 2 },
      { label: "High no-show rates for appointments", points: 2 },
      { label: "Dormant leads that go cold without follow-up", points: 1 },
      { label: "Tool fragmentation & manual data entry", points: 1 },
    ],
  },
];

/* ───────────────────────── Score Bands ───────────────────────── */

const scoreBands = [
  {
    min: 0, max: 6, label: "Severe Revenue Leakage",
    color: "text-destructive", bg: "bg-destructive/10 border-destructive/30",
    icon: <AlertTriangle className="w-8 h-8 text-destructive" />,
    headline: "Critical gaps identified in lead response & tracking.",
    diagnosis: "Your intake infrastructure is missing high-intent conversations and lacks automated follow-up.",
    recommendation: "Install automated 24/7 capture, multi-channel response, and lead nurture workflows.",
    cta: "Book a strategy call to patch your revenue leaks",
  },
  {
    min: 7, max: 11, label: "Fragmented Infrastructure",
    color: "text-[hsl(35,90%,50%)]", bg: "bg-[hsl(35,90%,50%)]/10 border-[hsl(35,90%,50%)]/30",
    icon: <Zap className="w-8 h-8 text-[hsl(35,90%,50%)]" />,
    headline: "Core systems exist, but key execution gaps remain.",
    diagnosis: "You capture leads reasonably well, but manual friction or after-hours gaps cost you deals.",
    recommendation: "Centralize conversation channels and deploy automated qualification.",
    cta: "Book a strategy call to optimize your response stack",
  },
  {
    min: 12, max: 15, label: "Advanced Revenue Architecture",
    color: "text-primary", bg: "bg-primary/10 border-primary/30",
    icon: <TrendingUp className="w-8 h-8 text-primary" />,
    headline: "High-performing baseline ready for scale.",
    diagnosis: "Your initial capture and speed are strong. Primary upside lies in conversion optimization and AI orchestration.",
    recommendation: "Fine-tune lead routing, dynamic CRM fields, and automated retention.",
    cta: "Book a strategy call to scale your architecture",
  },
];

type Phase = "icp" | "contact" | "seed_quiz" | "evaluating" | "dynamic_quiz" | "results";

export default function ConversationQuiz() {
  const [phase, setPhase] = useState<Phase>("icp");
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedIcp, setSelectedIcp] = useState<string | null>(null);
  const [contactInfo, setContactInfo] = useState({ firstName: "", email: "" });
  const [currentQ, setCurrentQ] = useState(0);
  const [seedAnswers, setSeedAnswers] = useState<Record<string, { label: string; points: number }>>({});
  const [dynamicAnswers, setDynamicAnswers] = useState<Record<string, string>>({});
  const [dynamicFields, setDynamicFields] = useState<DynamicField[]>([]);
  const [intakeId, setIntakeId] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [adminMode, setAdminMode] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "B") {
        setAdminMode((prev) => {
          toast.success(prev ? "Admin mode off" : "Admin mode on");
          return !prev;
        });
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const currentSeedQuestion = seedQuestions[currentQ];
  const totalSeedScore = Object.values(seedAnswers).reduce((sum, item) => sum + item.points, 0);
  const band = scoreBands.find((b) => totalSeedScore >= b.min && totalSeedScore <= b.max) || scoreBands[0];

  const handleSeedSelect = (option: QuizOption) => {
    setSeedAnswers((prev) => ({
      ...prev,
      [currentSeedQuestion.id]: { label: option.label, points: option.points },
    }));
  };

  const nextSeedQuestion = () => {
    if (currentQ < seedQuestions.length - 1) {
      setCurrentQ((p) => p + 1);
    } else {
      triggerSwarmEvaluation();
    }
  };

  const triggerSwarmEvaluation = async () => {
    setPhase("evaluating");
    const swarmUrl = import.meta.env.VITE_N8N_SWARM_INTAKE_URL;

    if (!swarmUrl) {
      toast.error("Swarm webhook URL not configured");
      setPhase("results");
      syncToGHL({});
      return;
    }

    try {
      const response = await fetch(swarmUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contactName: contactInfo.firstName,
          contactEmail: contactInfo.email,
          brandData: {
            icp: selectedIcp,
            lead_capture_status: seedAnswers["capture"]?.label,
            speed_to_lead_status: seedAnswers["speed"]?.label,
            hurtingArea: seedAnswers["hurting_area"]?.label,
          },
        }),
      });

      const result = await response.json();

      const isPartial = result?.normalization_status === "partial";
      const missing = Array.isArray(result?.missing_high_value_fields) ? result.missing_high_value_fields : [];

      if (isPartial && missing.length > 0) {
        const fields: DynamicField[] = missing.map((f: DynamicField | string) =>
          typeof f === "string"
            ? { key: f, label: f.split("_").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") }
            : f
        );
        if (result?.intake_id) setIntakeId(result.intake_id);
        setDynamicFields(fields);
        setPhase("dynamic_quiz");
      } else {
        setPhase("results");
        syncToGHL({});
      }
    } catch (error) {
      console.error("Swarm evaluation error:", error);
      toast.error("Swarm evaluation bypassed. Advancing to results.");
      setPhase("results");
      syncToGHL({});
    }
  };

  const handleDynamicSuccess = (answers: Record<string, string>) => {
    setDynamicAnswers(answers);
    setPhase("results");
    syncToGHL(answers);
  };

  const syncToGHL = async (finalDynamicAnswers: Record<string, string>) => {
    setSyncing(true);
    try {
      await supabase.functions.invoke("ghl-create-opportunity", {
        body: {
          contactName: contactInfo.firstName,
          contactEmail: contactInfo.email,
          brandData: {
            icp: selectedIcp,
            seedScore: totalSeedScore,
            seedAnswers,
            dynamicAnswers: finalDynamicAnswers,
            tier: band.label,
            diagnosis: band.diagnosis,
          },
        },
      });
    } catch (err) {
      console.error("GHL sync error:", err);
    } finally {
      setSyncing(false);
    }
  };

  const progress = ((currentQ + 1) / seedQuestions.length) * 100;

  const buildArtifact = (): QuizArtifact => ({
    schemaVersion: "1.0",
    submissionId: `local-${Date.now()}`,
    createdAt: new Date().toISOString(),
    source: "conversation-map-quiz",
    contact: { firstName: contactInfo.firstName || null, email: contactInfo.email || null },
    quiz: {
      quizType: "conversation-map",
      totalScore: totalSeedScore,
      maxScore: 15,
      tier: band.label,
      diagnosis: band.diagnosis,
      recommendation: band.recommendation,
      modules: [],
      questionBreakdown: seedQuestions.map((q) => ({
        questionId: q.id,
        title: q.title,
        stage: q.stage,
        score: seedAnswers[q.id]?.points ?? 0,
        maxScore: Math.max(...q.options.map((o) => o.points)),
      })),
    },
    brandBuilder: { seedAnswers, dynamicAnswers },
    inference: { icp: selectedIcp },
  });

  const downloadFile = (content: string, filename: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyJson = async () => {
    await navigator.clipboard.writeText(JSON.stringify(buildArtifact(), null, 2));
    toast.success("JSON copied");
  };
  const handleDownloadJson = () => {
    downloadFile(JSON.stringify(buildArtifact(), null, 2), `quiz-${Date.now()}.json`, "application/json");
  };
  const handleDownloadMd = () => {
    downloadFile(quizArtifactToMarkdown(buildArtifact()), `quiz-${Date.now()}.md`, "text/markdown");
  };


  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={crmchainsLogo} alt="CRMChains" className="h-10 w-10 rounded-md object-cover" />
            <div>
              <div className="font-semibold">CRMChains</div>
              <div className="text-xs text-muted-foreground">Adaptive Diagnostic Architecture</div>
            </div>
          </div>
          {adminMode && (
            <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/30">
              Admin
            </span>
          )}
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-10">
        {/* PHASE 1: ICP */}
        {phase === "icp" && (
          <div className="space-y-8">
            <div className="text-center space-y-3">
              <span className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-primary font-semibold">
                <Sparkles className="w-4 h-4" /> AI Adaptive Diagnostic
              </span>
              <h1 className="text-3xl md:text-4xl font-bold">Analyze Your Revenue Communication Stack</h1>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Answer 3 quick questions. Our AI Swarm will analyze your profile and generate custom diagnostic questions for your exact business model.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Which best describes your business?
              </h2>
              <div className="grid md:grid-cols-2 gap-3">
                {icpProfiles.map((icp) => (
                  <button
                    key={icp.id}
                    onClick={() => setSelectedIcp(icp.id)}
                    className={`text-left p-4 rounded-xl border-2 transition-all ${
                      selectedIcp === icp.id
                        ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                        : "border-border bg-card hover:border-primary/40"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{icp.icon}</span>
                      <div className="flex-1">
                        <div className="font-semibold">{icp.label}</div>
                        <div className="text-sm text-muted-foreground">{icp.description}</div>
                      </div>
                      {selectedIcp === icp.id && <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <Button size="lg" disabled={!selectedIcp} onClick={() => setPhase("contact")} className="px-8 gap-2">
                Continue <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* PHASE 2: Contact */}
        {phase === "contact" && (
          <div className="space-y-8">
            <div className="text-center space-y-3">
              <Mail className="w-8 h-8 mx-auto text-primary" />
              <h2 className="text-2xl font-bold">Where should we route your diagnostic results?</h2>
            </div>

            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={contactInfo.firstName}
                    onChange={(e) => setContactInfo((p) => ({ ...p, firstName: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    value={contactInfo.email}
                    onChange={(e) => setContactInfo((p) => ({ ...p, email: e.target.value }))}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="ghost" onClick={() => setPhase("icp")} className="gap-2">
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>
              <Button
                size="lg"
                disabled={!contactInfo.firstName || !contactInfo.email}
                onClick={() => setPhase("seed_quiz")}
                className="px-8 gap-2"
              >
                Start Seed Questions <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* PHASE 3: Seed Quiz */}
        {phase === "seed_quiz" && currentSeedQuestion && (
          <div className="space-y-6">
            <Progress value={progress} className="h-2" />
            <Card>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <div className="text-xs uppercase tracking-wider text-primary font-semibold">
                    Step {currentQ + 1} of {seedQuestions.length} — {currentSeedQuestion.stage}
                  </div>
                  <h2 className="text-2xl font-bold">{currentSeedQuestion.title}</h2>
                  <p className="text-muted-foreground">{currentSeedQuestion.prompt}</p>
                </div>

                <div className="space-y-2">
                  {currentSeedQuestion.options.map((opt, idx) => {
                    const isSelected = seedAnswers[currentSeedQuestion.id]?.points === opt.points
                      && seedAnswers[currentSeedQuestion.id]?.label === opt.label;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleSeedSelect(opt)}
                        className={`w-full text-left flex items-center gap-3 text-sm rounded-xl px-5 py-4 border-2 transition-all ${
                          isSelected
                            ? "border-primary bg-primary/5 text-foreground ring-1 ring-primary/30"
                            : "border-border bg-card text-foreground hover:border-primary/40 hover:bg-muted/30"
                        }`}
                      >
                        <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          isSelected ? "border-primary bg-primary" : "border-border"
                        }`}>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-primary-foreground" />}
                        </span>
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="ghost" onClick={() => setCurrentQ((p) => Math.max(0, p - 1))} disabled={currentQ === 0} className="gap-2">
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>
              <Button
                size="lg"
                disabled={!seedAnswers[currentSeedQuestion.id]}
                onClick={nextSeedQuestion}
                className="px-8 gap-2"
              >
                {currentQ === seedQuestions.length - 1 ? "Analyze Profile with Swarm" : "Next"}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* PHASE 4: Evaluating */}
        {phase === "evaluating" && (
          <div className="text-center py-20 space-y-4">
            <Loader2 className="w-12 h-12 mx-auto animate-spin text-primary" />
            <h2 className="text-2xl font-bold">Analyzing Your Business Architecture...</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Our AI Swarm is evaluating your inputs against industry benchmark contracts to build custom follow-up questions.
            </p>
          </div>
        )}

        {/* PHASE 5: Dynamic Quiz */}
        {phase === "dynamic_quiz" && (
          <div className="space-y-8">
            <div className="text-center space-y-3">
              <span className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-primary font-semibold">
                <Target className="w-4 h-4" /> Tailored For Your Business Model
              </span>
              <h2 className="text-2xl md:text-3xl font-bold">Targeted AI Follow-Up Questions</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Based on your initial answers, answer these specific details to complete your revenue diagnostic.
              </p>
            </div>

            <Card>
              <CardContent className="p-6">
                <DynamicFieldsForm
                  fields={dynamicFields}
                  agencyId={selectedIcp || "unknown"}
                  jobId={contactInfo.email || "anon"}
                  webhookUrl={import.meta.env.VITE_N8N_DYNAMIC_FIELDS_WEBHOOK_URL}
                  onSuccess={handleDynamicSuccess}
                />
              </CardContent>
            </Card>
          </div>
        )}

        {/* PHASE 6: Results */}
        {phase === "results" && (
          <div className="space-y-6">
            <Card className={`border-2 ${band.bg}`}>
              <CardContent className="p-8 space-y-6">
                <div className="flex items-start gap-4">
                  <div>{band.icon}</div>
                  <div className="flex-1">
                    <div className={`text-xs uppercase tracking-wider font-semibold ${band.color}`}>
                      Score {totalSeedScore} / 15
                    </div>
                    <h2 className={`text-2xl md:text-3xl font-bold ${band.color}`}>{band.label}</h2>
                    <p className="text-muted-foreground mt-1">{band.headline}</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <Shield className="w-4 h-4" /> Diagnosis
                  </h3>
                  <p className="text-foreground">{band.diagnosis}</p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    📋 Strategic Recommendation
                  </h3>
                  <p className="text-foreground">{band.recommendation}</p>
                </div>

                <Button size="lg" className="w-full gap-2" onClick={() => setBookingOpen(true)} disabled={syncing}>
                  {syncing ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {band.cta} <ArrowRight className="w-4 h-4" />
                </Button>

                {adminMode && (
                  <div className="mt-4 p-4 rounded-lg border border-primary/30 bg-primary/5 space-y-3">
                    <div className="text-xs uppercase tracking-wider font-semibold text-primary">
                      Admin Export
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" onClick={handleCopyJson}>
                        <Copy className="w-4 h-4 mr-2" /> Copy JSON
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleDownloadJson}>
                        <Download className="w-4 h-4 mr-2" /> Download JSON
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleDownloadMd}>
                        <FileText className="w-4 h-4 mr-2" /> Download Markdown
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Booking Dialog */}
      <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
        <DialogContent className="max-w-3xl h-[85vh] p-0 flex flex-col">
          <DialogHeader className="p-4 border-b shrink-0">
            <DialogTitle>Book Your Strategy Call</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            <iframe
              src="https://link.crmchains.com/widget/bookings/qualification-discovery"
              className="w-full h-full border-0"
              title="Book Strategy Call"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
