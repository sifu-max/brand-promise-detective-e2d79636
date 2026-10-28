import { useState, useEffect } from "react";
import {
  ArrowRight, ArrowLeft, CheckCircle2, Target, Mail, Sparkles, Shield, Loader2,
  Copy, Download, FileText, ChevronRight, RotateCcw,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import crmchainsLogo from "@/assets/crmchains-logo.jpg";
import { supabase } from "@/integrations/supabase/client";
import DynamicFieldsForm, { type DynamicField } from "@/components/DynamicFieldsForm";
import { quizArtifactToMarkdown, type QuizArtifact } from "@/lib/quizArtifact";
import { quizQuestions, scoreBands, brandingScreens, stages, maxPossible } from "@/lib/quiz/conversationQuizData";
import { toast } from "sonner";

const icpProfiles = [
  { id: "service-local", label: "Local Service Business", description: "Plumbers, HVAC, roofers, clinics — relying on local calls & leads", icon: "🏠" },
  { id: "agency", label: "Agency / Brokerage", description: "Insurance, real estate, staffing — managing sub-agents & funnels", icon: "🏢" },
  { id: "coach-consultant", label: "Coach / Consultant", description: "Selling high-ticket expertise needing booked calls to close", icon: "🎯" },
  { id: "ecommerce-saas", label: "E-Commerce / SaaS", description: "Online sales with automated support & retention needs", icon: "🛒" },
];

type Phase = "icp" | "contact" | "quiz" | "branding" | "evaluating" | "dynamic_quiz" | "results";

export default function ConversationQuiz() {
  const [phase, setPhase] = useState<Phase>("icp");
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedIcp, setSelectedIcp] = useState<string | null>(null);
  const [contactInfo, setContactInfo] = useState({ firstName: "", email: "" });
  const [currentQ, setCurrentQ] = useState(0);
  // questionId -> selected option indices
  const [selections, setSelections] = useState<Record<string, number[]>>({});
  const [brandingData, setBrandingData] = useState<Record<string, string>>({});
  const [brandingScreen, setBrandingScreen] = useState(0);
  const [dynamicAnswers, setDynamicAnswers] = useState<Record<string, string>>({});
  const [dynamicFields, setDynamicFields] = useState<DynamicField[]>([]);
  const [intakeId, setIntakeId] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [adminMode, setAdminMode] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === "B" || e.key === "b")) {
        setAdminMode((prev) => {
          toast.success(prev ? "Admin mode off" : "Admin mode on");
          return !prev;
        });
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const question = quizQuestions[currentQ];

  const scoreFor = (qId: string) => {
    const q = quizQuestions.find((x) => x.id === qId);
    if (!q || q.unscored) return 0;
    const pts = (selections[qId] || []).map((i) => q.options[i].points);
    return Math.min(pts.reduce((s, v) => s + v, 0), 5);
  };
  const labelsFor = (qId: string) => {
    const q = quizQuestions.find((x) => x.id === qId);
    return (selections[qId] || []).map((i) => q?.options[i].label).filter(Boolean) as string[];
  };
  const answerLabel = (qId: string) => labelsFor(qId).join(", ");

  const scoredQuestions = quizQuestions.filter((q) => !q.unscored);
  const totalScore = scoredQuestions.reduce((s, q) => s + scoreFor(q.id), 0);
  const band = scoreBands.find((b) => totalScore >= b.min && totalScore <= b.max) || scoreBands[0];

  const totalSteps = quizQuestions.length + brandingScreens.length;
  const progress =
    phase === "quiz" ? ((currentQ + 1) / totalSteps) * 100
    : phase === "branding" ? ((quizQuestions.length + brandingScreen + 1) / totalSteps) * 100
    : 100;

  const isCurrentAnswered = () => (selections[question?.id] || []).length > 0;

  const selectOption = (idx: number) => {
    setSelections((prev) => {
      const cur = prev[question.id] || [];
      if (!question.multiSelect) return { ...prev, [question.id]: [idx] };
      return { ...prev, [question.id]: cur.includes(idx) ? cur.filter((i) => i !== idx) : [...cur, idx] };
    });
  };

  const nextQuestion = () => {
    if (currentQ < quizQuestions.length - 1) setCurrentQ((p) => p + 1);
    else { setPhase("branding"); setBrandingScreen(0); }
  };

  const isBrandingScreenValid = () =>
    brandingScreens[brandingScreen].fields.filter((f) => f.required).every((f) => brandingData[f.key]?.trim());

  const nextBranding = () => {
    if (brandingScreen < brandingScreens.length - 1) setBrandingScreen((p) => p + 1);
    else triggerSwarmEvaluation();
  };
  const prevBranding = () => {
    if (brandingScreen > 0) setBrandingScreen((p) => p - 1);
    else { setPhase("quiz"); setCurrentQ(quizQuestions.length - 1); }
  };

  const questionBreakdown = () =>
    scoredQuestions.map((q) => ({
      questionId: q.id, title: q.title, stage: q.stage, answer: answerLabel(q.id), score: scoreFor(q.id), maxScore: 5,
    }));

  const brandingIntakePayload = () => ({ ...brandingData, hurtingArea: answerLabel("hurting_area") });

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
            lead_capture_status: answerLabel("capture"),
            speed_to_lead_status: answerLabel("speed"),
            hurtingArea: answerLabel("hurting_area"),
            totalScore, maxScore: maxPossible, tier: band.label,
            questionBreakdown: questionBreakdown(),
            brandingIntake: brandingIntakePayload(),
          },
        }),
      });
      const result = await response.json();
      const payload = result.json ?? result.body ?? result;
      const isPartial = payload?.normalization_status === "partial";
      const missing = Array.isArray(payload?.missing_high_value_fields) ? payload.missing_high_value_fields : [];

      if (isPartial && missing.length > 0) {
        const fields: DynamicField[] = missing.map((f: string | Partial<DynamicField>) => {
          if (typeof f === "string") {
            return {
              key: f,
              label: f.split("_").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
              type: "text" as const,
              required: false,
            };
          }
          return { key: f.key as string, label: f.label || (f.key as string), type: f.type || ("text" as const), required: f.required ?? false };
        });
        if (payload?.intake_id) setIntakeId(payload.intake_id);
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
            quizType: "conversation-map",
            icp: selectedIcp,
            intakeId,
            totalScore,
            maxScore: maxPossible,
            tier: band.label,
            diagnosis: band.diagnosis,
            recommendation: band.recommendation,
            modules: band.modules,
            questionBreakdown: questionBreakdown(),
            brandingIntake: brandingIntakePayload(),
            dynamicAnswers: finalDynamicAnswers,
          },
          fullExportData: { ...buildArtifact(), brandBuilder: { brandingIntake: brandingIntakePayload(), dynamicAnswers: finalDynamicAnswers } },
        },
      });
    } catch (err) {
      console.error("GHL sync error:", err);
    } finally {
      setSyncing(false);
    }
  };

  const reset = () => {
    setPhase("icp"); setSelectedIcp(null); setContactInfo({ firstName: "", email: "" });
    setCurrentQ(0); setSelections({}); setBrandingData({}); setBrandingScreen(0);
    setDynamicAnswers({}); setDynamicFields([]); setIntakeId(null);
  };

  const buildArtifact = (): QuizArtifact => ({
    schemaVersion: "1.0",
    submissionId: intakeId || `local-${Date.now()}`,
    createdAt: new Date().toISOString(),
    source: "conversation-map-quiz",
    contact: { firstName: contactInfo.firstName || null, email: contactInfo.email || null },
    quiz: {
      quizType: "conversation-map",
      totalScore, maxScore: maxPossible, tier: band.label,
      diagnosis: band.diagnosis, recommendation: band.recommendation, modules: band.modules,
      questionBreakdown: questionBreakdown(),
    },
    brandBuilder: { brandingIntake: brandingIntakePayload(), dynamicAnswers },
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

  return (
    <div className="min-h-screen bg-background">
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
            <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/30">Admin</span>
          )}
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-10 space-y-6">
        {(phase === "quiz" || phase === "branding") && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>
                {phase === "branding"
                  ? `Branding Intake — Step ${brandingScreen + 1} of ${brandingScreens.length}`
                  : `Question ${currentQ + 1} of ${quizQuestions.length}`}
              </span>
              <span className="font-medium text-primary">{phase === "quiz" ? question.stage : "Branding Intake"}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {phase === "icp" && (
          <div className="space-y-8">
            <div className="text-center space-y-3">
              <span className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-primary font-semibold">
                <Sparkles className="w-4 h-4" /> AI Adaptive Diagnostic
              </span>
              <h1 className="text-3xl md:text-4xl font-bold">Is Your Business Leaking Revenue?</h1>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Answer a few quick questions to uncover where your leads, follow-ups, and revenue are falling through the cracks. Our AI Swarm then tailors follow-up questions to your exact business model.
              </p>
            </div>
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Which best describes your business?</h2>
              <div className="grid md:grid-cols-2 gap-3">
                {icpProfiles.map((icp) => (
                  <button
                    key={icp.id}
                    onClick={() => setSelectedIcp(icp.id)}
                    className={`text-left p-4 rounded-xl border-2 transition-all ${
                      selectedIcp === icp.id ? "border-primary bg-primary/5 ring-2 ring-primary/20" : "border-border bg-card hover:border-primary/40"
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
            <div className="flex justify-center">
              <Button size="lg" disabled={!selectedIcp} onClick={() => setPhase("contact")} className="px-8 gap-2">
                Start My Diagnostic <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {phase === "contact" && (
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <Mail className="w-8 h-8 mx-auto text-primary" />
              <h2 className="text-2xl font-bold">Where should we send your results?</h2>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                We'll email you a detailed breakdown of your score, diagnosis, and recommended fixes.
              </p>
            </div>
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="Enter your first name" value={contactInfo.firstName}
                    onChange={(e) => setContactInfo((p) => ({ ...p, firstName: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="you@company.com" value={contactInfo.email}
                    onChange={(e) => setContactInfo((p) => ({ ...p, email: e.target.value }))} />
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Shield className="w-3 h-3" /> Your info is private. No spam, ever.
                </p>
              </CardContent>
            </Card>
            <div className="flex justify-between">
              <Button variant="ghost" onClick={() => setPhase("icp")} className="gap-2"><ArrowLeft className="w-4 h-4" /> Back</Button>
              <Button size="lg" disabled={!contactInfo.firstName.trim() || !contactInfo.email.trim()}
                onClick={() => setPhase("quiz")} className="px-8 gap-2">
                Begin Quiz <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {phase === "quiz" && question && (
          <div className="space-y-6" key={question.id}>
            <div className="flex flex-wrap items-center gap-2">
              {stages.map((s, i) => {
                const isActive = s === question.stage;
                const isPast = stages.indexOf(question.stage) > i;
                return (
                  <div key={s} className={`text-xs px-3 py-1 rounded-full border ${
                    isActive ? "bg-primary text-primary-foreground border-primary"
                    : isPast ? "bg-primary/10 text-primary border-primary/30"
                    : "bg-muted text-muted-foreground border-border"}`}>
                    {s}
                  </div>
                );
              })}
            </div>
            <Card>
              <CardContent className="p-6 md:p-8 space-y-6">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary">{question.title}</p>
                  <h3 className="text-lg md:text-xl font-bold leading-snug">{question.prompt}</h3>
                  {question.multiSelect && <p className="text-xs text-muted-foreground">Select all that apply</p>}
                </div>
                <div className="space-y-2">
                  {question.options.map((opt, idx) => {
                    const isSelected = (selections[question.id] || []).includes(idx);
                    return (
                      <button key={idx} onClick={() => selectOption(idx)}
                        className={`w-full text-left flex items-center gap-3 text-sm rounded-xl px-5 py-4 border-2 transition-all ${
                          isSelected ? "border-primary bg-primary/5 ring-1 ring-primary/30" : "border-border bg-card hover:border-primary/40 hover:bg-muted/30"}`}>
                        <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          isSelected ? "border-primary bg-primary" : "border-border"}`}>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-primary-foreground" />}
                        </span>
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
                {isCurrentAnswered() && (
                  <div className="bg-muted/50 rounded-lg p-4 border border-border">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">💡 Insight</p>
                    <p className="text-sm italic">"{question.beliefAfter}"</p>
                  </div>
                )}
              </CardContent>
            </Card>
            <div className="flex justify-between">
              <Button variant="ghost" onClick={() => setCurrentQ((p) => Math.max(0, p - 1))} disabled={currentQ === 0} className="gap-2">
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>
              <Button onClick={nextQuestion} disabled={!isCurrentAnswered()} className="gap-2 px-6">
                {currentQ === quizQuestions.length - 1 ? "Continue to Branding Intake" : "Next"} <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {phase === "branding" && (
          <div className="space-y-6" key={`branding-${brandingScreen}`}>
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-sm text-primary font-semibold uppercase tracking-wider">
                <Sparkles className="w-4 h-4" /> Branding Intake
              </div>
              <h2 className="text-2xl font-bold">{brandingScreens[brandingScreen].title}</h2>
              <p className="text-muted-foreground">{brandingScreens[brandingScreen].subtitle}</p>
            </div>
            <Card>
              <CardContent className="p-6 md:p-8 space-y-5">
                {brandingScreens[brandingScreen].fields.map((field) => (
                  <div key={field.key} className="space-y-2">
                    <Label>
                      {field.label}
                      {field.required && <span className="text-destructive ml-1">*</span>}
                    </Label>
                    {field.type === "text" && (
                      <Input placeholder={field.placeholder} value={brandingData[field.key] || ""}
                        onChange={(e) => setBrandingData((p) => ({ ...p, [field.key]: e.target.value }))} />
                    )}
                    {field.type === "textarea" && (
                      <Textarea rows={3} placeholder={field.placeholder} value={brandingData[field.key] || ""}
                        onChange={(e) => setBrandingData((p) => ({ ...p, [field.key]: e.target.value }))} />
                    )}
                    {field.type === "select" && field.options && (
                      <Select value={brandingData[field.key] || ""} onValueChange={(v) => setBrandingData((p) => ({ ...p, [field.key]: v }))}>
                        <SelectTrigger><SelectValue placeholder={`Select ${field.label.split(":")[0].toLowerCase()}`} /></SelectTrigger>
                        <SelectContent>
                          {field.options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
            <div className="flex justify-between">
              <Button variant="ghost" onClick={prevBranding} className="gap-2"><ArrowLeft className="w-4 h-4" /> Back</Button>
              <Button onClick={nextBranding} disabled={!isBrandingScreenValid()} className="gap-2 px-6">
                {brandingScreen === brandingScreens.length - 1 ? "Analyze Profile with Swarm" : "Next"} <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {phase === "evaluating" && (
          <div className="text-center py-20 space-y-4">
            <Loader2 className="w-12 h-12 mx-auto animate-spin text-primary" />
            <h2 className="text-2xl font-bold">Analyzing Your Business Architecture...</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Our AI Swarm is evaluating your inputs against industry benchmarks to build custom follow-up questions.
            </p>
          </div>
        )}

        {phase === "dynamic_quiz" && (
          <div className="space-y-8">
            <div className="text-center space-y-3">
              <span className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-primary font-semibold">
                <Target className="w-4 h-4" /> Tailored For Your Business Model
              </span>
              <h2 className="text-2xl md:text-3xl font-bold">Targeted AI Follow-Up Questions</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Based on your answers, fill in these details to complete your revenue diagnostic.
              </p>
            </div>
            <Card>
              <CardContent className="p-6">
                <DynamicFieldsForm
                  fields={dynamicFields}
                  agencyId={selectedIcp || "unknown"}
                  jobId={intakeId || contactInfo.email || "anon"}
                  webhookUrl={import.meta.env.VITE_N8N_DYNAMIC_FIELDS_WEBHOOK_URL}
                  onSuccess={handleDynamicSuccess}
                />
              </CardContent>
            </Card>
          </div>
        )}

        {phase === "results" && (
          <div className="space-y-6">
            <h2 className="text-center text-2xl md:text-3xl font-bold">
              {contactInfo.firstName ? `${contactInfo.firstName}, here's` : "Here's"} your diagnosis
            </h2>
            <Card className={`border-2 ${band.bg}`}>
              <CardContent className="p-6 md:p-8 space-y-5">
                <div className="flex items-center gap-4">
                  <div className={band.color}>{band.icon}</div>
                  <div className="flex-1">
                    <p className="text-3xl font-bold">{totalScore} / {maxPossible}</p>
                    <p className={`text-sm font-bold ${band.color}`}>{band.label}</p>
                  </div>
                  <div className="relative w-16 h-16 shrink-0">
                    <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                      <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="hsl(var(--border))" strokeWidth="3" />
                      <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="hsl(var(--primary))" strokeWidth="3"
                        strokeDasharray={`${(totalScore / maxPossible) * 100}, 100`} />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                      {Math.round((totalScore / maxPossible) * 100)}%
                    </span>
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="text-lg font-bold mb-2">{band.headline}</p>
                  <p className="text-sm">{band.diagnosis}</p>
                </div>
                <div className="bg-card rounded-lg border border-border p-4 space-y-2">
                  <p className="text-sm font-semibold">📋 Recommendation</p>
                  <p className="text-sm text-muted-foreground">{band.recommendation}</p>
                </div>
                {band.modules.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-semibold">🔧 Suggested Modules</p>
                    <div className="flex flex-wrap gap-2">
                      {band.modules.map((m) => (
                        <span key={m} className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium">{m}</span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="bg-muted/50 rounded-lg p-4 border border-border">
                  <p className="text-sm italic">⚡ {band.urgency}</p>
                </div>
                <details>
                  <summary className="text-sm font-semibold text-primary cursor-pointer hover:underline">View question-by-question breakdown</summary>
                  <div className="mt-3 space-y-2">
                    {scoredQuestions.map((q) => {
                      const score = scoreFor(q.id);
                      return (
                        <div key={q.id} className="flex items-center gap-3 text-sm">
                          <span className="w-40 truncate text-muted-foreground">{q.title}</span>
                          <div className="flex-1 bg-border rounded-full h-2 overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: `${(score / 5) * 100}%` }} />
                          </div>
                          <span className="text-xs font-mono w-8 text-right">{score}/5</span>
                        </div>
                      );
                    })}
                  </div>
                </details>
                <Separator />
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button size="lg" className="gap-2 flex-1" onClick={() => setBookingOpen(true)}>
                    {band.cta} <ArrowRight className="w-4 h-4" />
                  </Button>
                  <Button size="lg" variant="outline" className="gap-2 bg-transparent" onClick={reset}>
                    <RotateCcw className="w-4 h-4" /> Retake
                  </Button>
                </div>
                {syncing && <p className="text-xs text-muted-foreground text-center animate-pulse">Saving your results…</p>}

                {adminMode && (
                  <div className="p-4 rounded-lg border border-primary/30 bg-primary/5 space-y-3">
                    <div className="text-xs uppercase tracking-wider font-semibold text-primary">Admin Export</div>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" onClick={async () => {
                        await navigator.clipboard.writeText(JSON.stringify(buildArtifact(), null, 2));
                        toast.success("JSON copied");
                      }}><Copy className="w-4 h-4 mr-2" /> Copy JSON</Button>
                      <Button variant="outline" size="sm" onClick={() =>
                        downloadFile(JSON.stringify(buildArtifact(), null, 2), `quiz-${Date.now()}.json`, "application/json")}>
                        <Download className="w-4 h-4 mr-2" /> Download JSON
                      </Button>
                      <Button variant="outline" size="sm" onClick={() =>
                        downloadFile(quizArtifactToMarkdown(buildArtifact()), `quiz-${Date.now()}.md`, "text/markdown")}>
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

      <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
        <DialogContent className="max-w-3xl h-[85vh] p-0 flex flex-col">
          <DialogHeader className="p-4 border-b shrink-0">
            <DialogTitle>Book Your Strategy Call</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            <iframe src="https://link.crmchains.com/widget/bookings/qualification-discovery" className="w-full h-full border-0" title="Book Strategy Call" />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
