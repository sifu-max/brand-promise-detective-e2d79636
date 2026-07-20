import { useState, useEffect } from "react";
import {
  ArrowRight, ArrowLeft, CheckCircle2, AlertTriangle, Target,
  TrendingUp, Zap, Globe, Mail, RotateCcw, ChevronRight, Sparkles, Shield
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import crmchainsLogo from "@/assets/crmchains-logo.jpg";
import { supabase } from "@/integrations/supabase/client";

/* ─────────────────────────  ICP Definitions  ───────────────────────── */

const icpProfiles = [
  {
    id: "service-local",
    label: "Local Service Business",
    description: "Plumbers, HVAC, roofers, clinics — you rely on calls & leads",
    icon: "🏠",
  },
  {
    id: "agency",
    label: "Agency / Brokerage",
    description: "Insurance, real estate, or staffing — you manage sub-agents",
    icon: "🏢",
  },
  {
    id: "coach-consultant",
    label: "Coach / Consultant",
    description: "You sell expertise and need booked calls to close",
    icon: "🎯",
  },
  {
    id: "ecommerce-saas",
    label: "E-Commerce / SaaS",
    description: "Online sales with customer support & retention needs",
    icon: "🛒",
  },
];

/* ─────────────────────────  Quiz Questions  ───────────────────────── */

interface QuizOption {
  label: string;
  points: number;
}

interface QuizQuestion {
  id: string;
  stage: string;
  title: string;
  prompt: string;
  beliefBefore: string;
  beliefAfter: string;
  purpose: string;
  options: QuizOption[];
  multiSelect?: boolean;
}

const quizQuestions: QuizQuestion[] = [
  // ── PROBLEM AWARENESS ──
  {
    id: "capture",
    stage: "How you get leads",
    title: "Are you catching every lead?",
    prompt: "How confident are you that your business catches every incoming conversation — calls, texts, social DMs, and website forms?",
    beliefBefore: "I think we're doing okay.",
    beliefAfter: "There might be leads I'm not even seeing.",
    purpose: "Diagnose lead capture reliability",
    options: [
      { label: "We capture and track everything automatically", points: 5 },
      { label: "Most conversations are captured", points: 3 },
      { label: "Some slip through the cracks", points: 2 },
      { label: "We probably miss a lot", points: 1 },
    ],
  },
  {
    id: "channels",
    stage: "How you get leads",
    title: "Where do new leads come from?",
    prompt: "Where do people usually start a conversation with your business?",
    beliefBefore: "We cover the main channels.",
    beliefAfter: "We're spread too thin — or missing channels entirely.",
    purpose: "Map channel complexity & gaps",
    multiSelect: true,
    options: [
      { label: "Phone calls", points: 1 },
      { label: "SMS / text", points: 1 },
      { label: "Email", points: 1 },
      { label: "Social media (DMs)", points: 1 },
      { label: "Website funnels / forms", points: 1 },
    ],
  },
  // ── SELF DIAGNOSIS ──
  {
    id: "speed",
    stage: "How you respond",
    title: "How quickly do you reply?",
    prompt: "When someone reaches out, how fast do they usually hear back?",
    beliefBefore: "We respond fast enough.",
    beliefAfter: "Speed matters more than I thought — every minute costs money.",
    purpose: "Expose speed-to-lead gap",
    options: [
      { label: "Immediate automated + personalized response", points: 5 },
      { label: "Quick automated response within minutes", points: 4 },
      { label: "Manual response within about an hour", points: 3 },
      { label: "Responses are inconsistent", points: 2 },
      { label: "Sometimes no response happens", points: 1 },
    ],
  },
  {
    id: "centralization",
    stage: "How you respond",
    title: "How do you keep track of leads today?",
    prompt: "How do you manage calls, texts, follow-ups, and appointments today?",
    beliefBefore: "Our tools work fine.",
    beliefAfter: "Scattered tools = scattered results.",
    purpose: "Diagnose tool fragmentation",
    options: [
      { label: "Everything is centralized in one system", points: 5 },
      { label: "2–3 tools manage conversations", points: 3 },
      { label: "Spread across multiple apps", points: 2 },
      { label: "Completely scattered", points: 1 },
    ],
  },
  // ── CONSEQUENCE AMPLIFICATION ──
  {
    id: "followup",
    stage: "What happens when leads go cold",
    title: "What happens after a lead goes quiet?",
    prompt: "If a potential customer does not reply or goes cold, what usually happens next?",
    beliefBefore: "We follow up when we can.",
    beliefAfter: "Every unworked lead is lost revenue — multiplied over months.",
    purpose: "Reveal the cost of inconsistent follow-up",
    options: [
      { label: "Automated follow-up and reactivation campaigns run automatically", points: 5 },
      { label: "We follow up manually and occasionally revisit old leads", points: 4 },
      { label: "We follow up sometimes but inconsistently", points: 3 },
      { label: "We rarely follow up or revisit old leads", points: 2 },
      { label: "Nothing usually happens", points: 1 },
    ],
  },
  {
    id: "afterhours",
    stage: "What happens when leads go cold",
    title: "What happens after business hours?",
    prompt: "If someone calls or messages your business after hours, what happens next?",
    beliefBefore: "People understand we're closed.",
    beliefAfter: "My competitors answer 24/7 — I'm losing deals while I sleep.",
    purpose: "Expose the after-hours revenue gap",
    options: [
      { label: "AI answers, qualifies, and books appointments", points: 5 },
      { label: "Voicemail with automated follow-up", points: 3 },
      { label: "Voicemail only", points: 2 },
      { label: "Missed call — no response", points: 1 },
    ],
  },
  // ── SOLUTION FRAMING ──
  {
    id: "referrals",
    stage: "What would help most",
    title: "Do you ask happy clients for reviews or referrals automatically?",
    prompt: "Do you have a system that asks happy clients for reviews or referrals?",
    beliefBefore: "Referrals happen naturally.",
    beliefAfter: "Without a system, I'm leaving the easiest revenue on the table.",
    purpose: "Reveal untapped referral revenue",
    options: [
      { label: "Yes — automated review requests + referral campaigns", points: 5 },
      { label: "We ask sometimes but it's manual", points: 3 },
      { label: "Rarely", points: 2 },
      { label: "No system at all", points: 1 },
    ],
  },
  {
    id: "payments",
    stage: "What would help most",
    title: "How do you get paid?",
    prompt: "How do you collect payments from clients today?",
    beliefBefore: "Invoicing is just admin work.",
    beliefAfter: "Slow invoicing = slow cash flow = slower growth.",
    purpose: "Diagnose payment friction",
    options: [
      { label: "Automated invoicing with recurring billing & auto-reminders", points: 5 },
      { label: "Manual invoices with online payment links", points: 4 },
      { label: "Manual invoices, chase payments by phone/email", points: 2 },
      { label: "No consistent invoicing process", points: 1 },
    ],
  },
  // ── QUALIFICATION ──
  {
    id: "qualification",
    stage: "What would help most",
    title: "Do you get basic details from leads before talking to them?",
    prompt: "Do you collect basic information from leads before your team talks to them?",
    beliefBefore: "We just get on the phone.",
    beliefAfter: "Pre-qualified leads close faster and waste less of my team's time.",
    purpose: "Diagnose intake/qualification process",
    options: [
      { label: "Automated intake forms with scoring", points: 5 },
      { label: "Basic forms but no scoring", points: 3 },
      { label: "We ask questions manually", points: 2 },
      { label: "No qualification process", points: 1 },
    ],
  },
  {
    id: "metrics",
    stage: "What would help most",
    title: "Can you see your key numbers clearly?",
    prompt: "Can you easily see how fast you reply, how many leads show up, and how many turn into customers?",
    beliefBefore: "We know our numbers well enough.",
    beliefAfter: "If I can't measure it, I can't improve it.",
    purpose: "Expose lack of actionable data",
    options: [
      { label: "Yes — real-time dashboard with all key metrics", points: 5 },
      { label: "Some metrics in different tools", points: 3 },
      { label: "Limited visibility", points: 2 },
      { label: "No tracking at all", points: 1 },
    ],
  },
];

/* ─────────────────────────  Score Bands  ───────────────────────── */

const maxPossible = 50; // 10 questions, max 5 each

const scoreBands = [
  {
    min: 0,
    max: 15,
    label: "Severe Revenue Leakage",
    color: "text-destructive",
    bg: "bg-destructive/10 border-destructive/30",
    icon: <AlertTriangle className="w-7 h-7" />,
    headline: "You're losing revenue at nearly every stage.",
    diagnosis:
      "Your business is missing conversations, responding inconsistently, has no automated follow-up, no referral engine, and fragmented payment collection. Revenue is leaking at nearly every touchpoint.",
    recommendation:
      "Start with the fundamentals: capture every conversation, centralize communication, install automated follow-up, and build a referral + payment system.",
    modules: ["Inbound Caller", "Web Chat", "SMS Nurture", "Reactivation Engine"],
    cta: "Book a strategy call to plug your biggest leaks",
    urgency: "Businesses in this range typically recover 30–50% of lost revenue within 90 days of fixing these systems.",
  },
  {
    min: 16,
    max: 28,
    label: "Fragmented Infrastructure",
    color: "text-[hsl(35,90%,50%)]",
    bg: "bg-[hsl(35,90%,50%)]/10 border-[hsl(35,90%,50%)]/30",
    icon: <Target className="w-7 h-7" />,
    headline: "You have pieces — but the gaps are costing you.",
    diagnosis:
      "Some systems are in place, but critical gaps remain in areas like follow-up consistency, referral generation, payment automation, or after-hours coverage.",
    recommendation:
      "Centralize your channels, automate your most important follow-up paths, and close the gaps in referrals and invoicing.",
    modules: ["Multi-Channel Messenger", "AI Intake", "Review Booster", "Payment Automation"],
    cta: "Book a strategy call to map your highest-impact upgrades",
    urgency: "Most businesses at this level see measurable improvement within 60 days of closing 2–3 key gaps.",
  },
  {
    min: 29,
    max: 39,
    label: "Strong Communication Systems",
    color: "text-primary",
    bg: "bg-primary/10 border-primary/30",
    icon: <TrendingUp className="w-7 h-7" />,
    headline: "Solid foundation — time to optimize for conversion.",
    diagnosis:
      "You have a solid communication and revenue foundation. Most systems are in place, but there's room to optimize conversion rates, referral workflows, and analytics.",
    recommendation:
      "Optimize routing, qualification, conversion flows, and tighten up remaining gaps. Focus on turning existing demand into more booked appointments and closed deals.",
    modules: ["Lead Scoring", "Calendar Workflows", "Insights Dashboard"],
    cta: "Book a strategy call to optimize what you already have",
    urgency: "At this level, optimization typically yields 15–25% improvement in conversion rates.",
  },
  {
    min: 40,
    max: 50,
    label: "Advanced Revenue Infrastructure",
    color: "text-[hsl(145,60%,40%)]",
    bg: "bg-[hsl(145,60%,40%)]/10 border-[hsl(145,60%,40%)]/30",
    icon: <Zap className="w-7 h-7" />,
    headline: "Your systems are performing at a high level.",
    diagnosis:
      "Your revenue communication systems are well structured across all key areas. You're capturing, qualifying, nurturing, and converting at a high level.",
    recommendation:
      "Shift from setup to performance engineering — improve analytics, A/B test automations, and engineer better revenue performance across every touchpoint.",
    modules: ["Performance Management", "Advanced Analytics", "Scale Optimization"],
    cta: "Book a strategy call for advanced optimization and scale",
    urgency: "Top-performing businesses at this level focus on compounding gains — small improvements multiply across high volume.",
  },
];

/* ─────────────────────────  Branding Intake Screens  ───────────────────────── */

interface BrandingField {
  key: string;
  label: string;
  type: "text" | "textarea" | "select";
  placeholder?: string;
  options?: Array<string | { value: string; label: string }>;
  required?: boolean;
}


const brandingScreens: { title: string; subtitle: string; fields: BrandingField[] }[] = [
  {
    title: "Business Foundation",
    subtitle: "Tell us about your brand voice and core offer.",
    fields: [
      { key: "tagline", label: "Business Tagline", type: "text", placeholder: 'e.g. "Your Growth, Our Mission."' },
      { key: "cta", label: "What is your Primary Call to Action (CTA)?", type: "text", placeholder: "e.g. 'Book a Free Consultation', 'Get a Quote'" },
      { key: "coreSolution", label: "Core Service/Solution: What do you do to solve the urgent problem?", type: "textarea", placeholder: "Describe your core service..." },
      { key: "communicationTone", label: "Communication Tone", type: "select", options: ["Professional", "Casual/Friendly", "Urgent/Direct"], required: true },
    ],
  },
  {
    title: "Offer & Investment",
    subtitle: "Define your pricing and ideal client profile.",
    fields: [
      { key: "clientBudgetTimeline", label: "What is your client's typical budget and timeline for solving this problem?", type: "textarea", placeholder: "e.g. $500–$5,000, within 30 days" },
      { key: "coreOfferInvestment", label: "What is the price or fee for the customer?", type: "text", placeholder: "e.g. $2,500/mo or $10,000 one-time" },
      { key: "offerStructure", label: "Offer Structure: What clear options will you offer?", type: "select", options: ["Basic & Premium Options", "Single Price Offer", "Tiered (3+ Options)"] },
      { key: "idealClient", label: "Ideal Client (Niche): Who is the primary audience you serve?", type: "text", placeholder: "e.g. Families, 35+, Homeowners" },
      { key: "painPoints", label: "What are the core pain points you solve for your ideal clients?", type: "textarea", placeholder: "List the key problems..." },
    ],
  },
  {
    title: "Sales & Customer Profiles",
    subtitle: "Help us understand your customers and sales approach.",
    fields: [
      { key: "salesScript", label: "Sales Script Formula: Problem → Solution → Benefits → Investment. Outline your approach.", type: "textarea", placeholder: "Describe your sales flow..." },
      { key: "customerProfiles", label: "What are your main customer profiles, and which offer should each one be matched with?", type: "textarea", placeholder: "Profile A → Offer X, Profile B → Offer Y..." },
      { key: "profileGoals", label: "What is each profile trying to solve or accomplish?", type: "textarea", placeholder: "Describe goals per profile..." },
      { key: "profileTriggers", label: "What makes each profile take action?", type: "textarea", placeholder: "Describe what triggers them to buy..." },
    ],
  },
  {
    title: "Momentum & Engagement",
    subtitle: "Map where engagement is happening and where you want more.",
    fields: [
      { key: "entryPoint", label: "What asset or entry point do they usually interact with first?", type: "textarea", placeholder: "e.g. Google search, social ad, referral..." },
      { key: "currentMomentum", label: "Where is momentum already happening?", type: "textarea", placeholder: "Describe what's working..." },
      { key: "desiredMomentum", label: "Where would you like to create more momentum?", type: "textarea", placeholder: "Describe where you want growth..." },
      { key: "postEngagement", label: "What should happen after someone engages?", type: "textarea", placeholder: "Describe the ideal next steps..." },
    ],
  },
];

/* ─────────────────────────  Stages (for progress labels)  ───────────────────────── */

const stages = [
  "Problem Awareness",
  "Self Diagnosis",
  "Consequence Amplification",
  "Solution Framing",
];

/* ─────────────────────────  Component  ───────────────────────── */

type Phase = "icp" | "contact" | "quiz" | "branding" | "results";

export default function ConversationQuiz() {
  const [phase, setPhase] = useState<Phase>("icp");
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedIcp, setSelectedIcp] = useState<string | null>(null);
  const [contactInfo, setContactInfo] = useState({ firstName: "", email: "" });
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number | number[]>>({});
  const [multiIndices, setMultiIndices] = useState<Record<string, number[]>>({});
  const [brandingData, setBrandingData] = useState<Record<string, string>>({});
  const [brandingScreen, setBrandingScreen] = useState(0);
  const [syncing, setSyncing] = useState(false);

  // Load GHL embed script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://link.crmchains.com/js/form_embed.js";
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  const question = quizQuestions[currentQ];
  const totalBrandingScreens = brandingScreens.length;
  const totalSteps = quizQuestions.length + totalBrandingScreens;
  const progress = phase === "quiz"
    ? ((currentQ + 1) / totalSteps) * 100
    : phase === "branding"
    ? ((quizQuestions.length + brandingScreen + 1) / totalSteps) * 100
    : phase === "results" ? 100 : 0;

  const totalScore = Object.entries(answers).reduce((sum, [key, val]) => {
    if (key.endsWith("_indices")) return sum;
    if (Array.isArray(val)) return sum + Math.min(val.reduce((s, v) => s + v, 0), 5);
    return sum + (val as number);
  }, 0);

  const band = scoreBands.find((b) => totalScore >= b.min && totalScore <= b.max) || scoreBands[0];

  const isCurrentAnswered = () => {
    const a = answers[question?.id];
    if (question?.multiSelect) return Array.isArray(a) && a.length > 0;
    return a !== undefined;
  };

  const handleSingleSelect = (points: number) => {
    setAnswers((prev) => ({ ...prev, [question.id]: points }));
  };

  const handleMultiSelect = (optionIndex: number, points: number) => {
    const qId = question.id;
    setMultiIndices((prev) => {
      const current = prev[qId] || [];
      const has = current.includes(optionIndex);
      const next = has ? current.filter((i) => i !== optionIndex) : [...current, optionIndex];
      const nextPoints = next.map((i) => question.options[i].points);
      setAnswers((pa) => ({ ...pa, [qId]: nextPoints }));
      return { ...prev, [qId]: next };
    });
  };

  const next = () => {
    if (currentQ < quizQuestions.length - 1) {
      setCurrentQ((p) => p + 1);
    } else {
      setPhase("branding");
      setBrandingScreen(0);
    }
  };

  const prev = () => {
    if (currentQ > 0) setCurrentQ((p) => p - 1);
  };

  const isBrandingScreenValid = () => {
    const screen = brandingScreens[brandingScreen];
    return screen.fields.filter((f) => f.required).every((f) => brandingData[f.key]?.trim());
  };

  const nextBranding = () => {
    if (brandingScreen < totalBrandingScreens - 1) {
      setBrandingScreen((p) => p + 1);
    } else {
      setPhase("results");
      syncToGHL();
    }
  };

  const prevBranding = () => {
    if (brandingScreen > 0) {
      setBrandingScreen((p) => p - 1);
    } else {
      setPhase("quiz");
      setCurrentQ(quizQuestions.length - 1);
    }
  };

  const syncToGHL = async () => {
    setSyncing(true);
    try {
      const quizData = quizQuestions.map((q) => {
        const a = answers[q.id];
        const score = Array.isArray(a) ? Math.min(a.reduce((s, v) => s + v, 0), 5) : (a as number) || 0;
        return { questionId: q.id, title: q.title, stage: q.stage, score, maxScore: 5 };
      });

      await supabase.functions.invoke("ghl-create-opportunity", {
        body: {
          contactName: contactInfo.firstName,
          contactEmail: contactInfo.email,
          brandData: {
            quizType: "conversation-map",
            icp: selectedIcp,
            totalScore,
            maxScore: maxPossible,
            tier: band.label,
            diagnosis: band.diagnosis,
            recommendation: band.recommendation,
            modules: band.modules,
            questionBreakdown: quizData,
            brandingIntake: brandingData,
          },
        },
      });
    } catch (err) {
      console.error("GHL sync error:", err);
    } finally {
      setSyncing(false);
    }
  };

  const reset = () => {
    setPhase("icp");
    setSelectedIcp(null);
    setContactInfo({ firstName: "", email: "" });
    setCurrentQ(0);
    setAnswers({});
    setMultiIndices({});
    setBrandingData({});
    setBrandingScreen(0);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-[hsl(var(--slate-deep))] text-white">
        <div className="container max-w-3xl py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={crmchainsLogo} alt="CRMChains" className="h-12 w-auto rounded-lg" />
            <div>
              <h2 className="text-lg font-bold tracking-tight">CRMChains</h2>
              <p className="text-xs text-white/60">Revenue Communication Architecture</p>
            </div>
          </div>
          <div className="hidden sm:flex flex-col items-end text-xs text-white/50 gap-0.5">
            <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> crmchains.com</span>
            <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> info@crmchains.com</span>
          </div>
        </div>
        <div className="h-1 bg-gradient-to-r from-[hsl(var(--coral))] via-[hsl(var(--primary))] to-[hsl(var(--coral))]" />
      </header>

      <main className="container max-w-3xl py-8 px-4 space-y-6">
        {/* Progress bar */}
        {(phase === "quiz" || phase === "branding" || phase === "results") && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>
                {phase === "results"
                  ? "Complete"
                  : phase === "branding"
                  ? `Branding Intake — Step ${brandingScreen + 1} of ${totalBrandingScreens}`
                  : `Question ${currentQ + 1} of ${quizQuestions.length}`}
              </span>
              {phase === "quiz" && <span className="font-medium text-primary">{question.stage}</span>}
              {phase === "branding" && <span className="font-medium text-primary">Branding Intake</span>}
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {/* ── PHASE: ICP Selection ── */}
        {phase === "icp" && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 text-sm text-primary font-semibold uppercase tracking-wider">
                <Sparkles className="w-4 h-4" /> Free Diagnostic
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
                Is Your Business Leaking Revenue?
              </h1>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Answer 10 quick questions to uncover exactly where your leads, follow-ups, and revenue are falling through the cracks — and what to fix first.
              </p>
            </div>

            <Separator />

            <div className="space-y-3">
              <p className="text-sm font-semibold text-foreground">Which best describes your business?</p>
              <div className="grid gap-3 sm:grid-cols-2">
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
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{icp.icon}</span>
                      <div>
                        <p className="font-semibold text-foreground text-sm">{icp.label}</p>
                        <p className="text-xs text-muted-foreground">{icp.description}</p>
                      </div>
                      {selectedIcp === icp.id && <CheckCircle2 className="w-5 h-5 text-primary ml-auto shrink-0" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="text-center pt-2">
              <Button
                size="lg"
                disabled={!selectedIcp}
                onClick={() => setPhase("contact")}
                className="px-8 gap-2"
              >
                Start My Diagnostic <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* ── PHASE: Contact Info ── */}
        {phase === "contact" && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="text-center space-y-2">
              <Shield className="w-8 h-8 text-primary mx-auto" />
              <h2 className="text-2xl font-bold text-foreground">Where should we send your results?</h2>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                We'll email you a detailed breakdown of your score, diagnosis, and recommended fixes.
              </p>
            </div>

            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">First Name</label>
                  <Input
                    placeholder="Enter your first name"
                    value={contactInfo.firstName}
                    onChange={(e) => setContactInfo((p) => ({ ...p, firstName: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Email</label>
                  <Input
                    type="email"
                    placeholder="you@company.com"
                    value={contactInfo.email}
                    onChange={(e) => setContactInfo((p) => ({ ...p, email: e.target.value }))}
                  />
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Shield className="w-3 h-3" /> Your info is private. No spam, ever.
                </p>
              </CardContent>
            </Card>

            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => setPhase("icp")} className="gap-2">
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>
              <Button
                size="lg"
                disabled={!contactInfo.firstName.trim() || !contactInfo.email.trim()}
                onClick={() => setPhase("quiz")}
                className="px-8 gap-2"
              >
                Begin Quiz <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* ── PHASE: Quiz Questions ── */}
        {phase === "quiz" && question && (
          <div className="space-y-6 animate-in fade-in duration-300" key={question.id}>
            {/* Stage badge */}
            <div className="flex items-center gap-2">
              {stages.map((s, i) => {
                const isActive = s === question.stage;
                const isPast = stages.indexOf(question.stage) > i;
                return (
                  <div
                    key={s}
                    className={`text-xs px-3 py-1 rounded-full border transition-all ${
                      isActive
                        ? "bg-primary text-primary-foreground border-primary"
                        : isPast
                        ? "bg-primary/10 text-primary border-primary/30"
                        : "bg-muted text-muted-foreground border-border"
                    }`}
                  >
                    {s}
                  </div>
                );
              })}
            </div>

            <Card>
              <CardContent className="p-6 md:p-8 space-y-6">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                    {question.title}
                  </p>
                  <h3 className="text-lg md:text-xl font-bold text-foreground leading-snug">
                    {question.prompt}
                  </h3>
                  {question.multiSelect && (
                    <p className="text-xs text-muted-foreground">Select all that apply</p>
                  )}
                </div>

                <div className="space-y-2">
                  {question.options.map((opt, idx) => {
                    const isSelected = question.multiSelect
                      ? (multiIndices[question.id] || []).includes(idx)
                      : answers[question.id] === opt.points;

                    return (
                      <button
                        key={idx}
                        onClick={() =>
                          question.multiSelect
                            ? handleMultiSelect(idx, opt.points)
                            : handleSingleSelect(opt.points)
                        }
                        className={`w-full text-left flex items-center gap-3 text-sm rounded-xl px-5 py-4 border-2 transition-all ${
                          isSelected
                            ? "border-primary bg-primary/5 text-foreground ring-1 ring-primary/30"
                            : "border-border bg-card text-foreground hover:border-primary/40 hover:bg-muted/30"
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                          isSelected ? "border-primary bg-primary" : "border-muted-foreground/30"
                        }`}>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-primary-foreground" />}
                        </div>
                        {opt.label}
                      </button>
                    );
                  })}
                </div>

                {/* Belief shift insight */}
                {isCurrentAnswered() && (
                  <div className="bg-muted/50 rounded-lg p-4 border border-border animate-in fade-in duration-500">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">💡 Insight</p>
                    <p className="text-sm text-foreground italic">"{question.beliefAfter}"</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between">
              <Button variant="outline" onClick={prev} disabled={currentQ === 0} className="gap-2">
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>
              <Button
                onClick={next}
                disabled={!isCurrentAnswered()}
                className="gap-2 px-6"
              >
                {currentQ === quizQuestions.length - 1 ? "See My Results" : "Next"}
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* ── PHASE: Branding Intake ── */}
        {phase === "branding" && (
          <div className="space-y-6 animate-in fade-in duration-300" key={`branding-${brandingScreen}`}>
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-sm text-primary font-semibold uppercase tracking-wider">
                <Sparkles className="w-4 h-4" /> Branding Intake
              </div>
              <h2 className="text-2xl font-bold text-foreground">{brandingScreens[brandingScreen].title}</h2>
              <p className="text-muted-foreground">{brandingScreens[brandingScreen].subtitle}</p>
            </div>

            <Card>
              <CardContent className="p-6 md:p-8 space-y-5">
                {brandingScreens[brandingScreen].fields.map((field) => (
                  <div key={field.key} className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      {field.label}
                      {field.required && <span className="text-destructive ml-1">*</span>}
                    </label>
                    {field.type === "text" && (
                      <Input
                        placeholder={field.placeholder}
                        value={brandingData[field.key] || ""}
                        onChange={(e) => setBrandingData((p) => ({ ...p, [field.key]: e.target.value }))}
                      />
                    )}
                    {field.type === "textarea" && (
                      <Textarea
                        placeholder={field.placeholder}
                        value={brandingData[field.key] || ""}
                        onChange={(e) => setBrandingData((p) => ({ ...p, [field.key]: e.target.value }))}
                        rows={3}
                      />
                    )}
                    {field.type === "select" && field.options && (
                      <Select
                        value={brandingData[field.key] || ""}
                        onValueChange={(val) => setBrandingData((p) => ({ ...p, [field.key]: val }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={`Select ${field.label.split(":")[0].toLowerCase()}`} />
                        </SelectTrigger>
                        <SelectContent>
                          {field.options.map((opt) => (
                            <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={prevBranding} className="gap-2">
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>
              <Button
                onClick={nextBranding}
                disabled={!isBrandingScreenValid()}
                className="gap-2 px-6"
              >
                {brandingScreen === totalBrandingScreens - 1 ? "See My Results" : "Next"}
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* ── PHASE: Results ── */}
        {phase === "results" && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="text-center space-y-2">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                {contactInfo.firstName ? `${contactInfo.firstName}, here's` : "Here's"} your diagnosis
              </h2>
            </div>

            {/* Score card */}
            <Card className={`border-2 ${band.bg}`}>
              <CardContent className="p-6 md:p-8 space-y-5">
                <div className="flex items-center gap-4">
                  <div className={band.color}>{band.icon}</div>
                  <div className="flex-1">
                    <p className="text-3xl font-bold text-foreground">
                      {totalScore} / {maxPossible}
                    </p>
                    <p className={`text-sm font-bold ${band.color}`}>{band.label}</p>
                  </div>
                  {/* Score ring */}
                  <div className="relative w-16 h-16 shrink-0">
                    <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="hsl(var(--border))"
                        strokeWidth="3"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="hsl(var(--primary))"
                        strokeWidth="3"
                        strokeDasharray={`${(totalScore / maxPossible) * 100}, 100`}
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-foreground">
                      {Math.round((totalScore / maxPossible) * 100)}%
                    </span>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-lg font-bold text-foreground mb-2">{band.headline}</p>
                  <p className="text-sm text-foreground">{band.diagnosis}</p>
                </div>

                <div className="bg-card rounded-lg border border-border p-4 space-y-2">
                  <p className="text-sm font-semibold text-foreground">📋 Recommendation</p>
                  <p className="text-sm text-muted-foreground">{band.recommendation}</p>
                </div>

                {band.modules.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-foreground">🔧 Suggested Modules</p>
                    <div className="flex flex-wrap gap-2">
                      {band.modules.map((mod) => (
                        <span key={mod} className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium">
                          {mod}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-muted/50 rounded-lg p-4 border border-border">
                  <p className="text-sm text-foreground italic">⚡ {band.urgency}</p>
                </div>

                {/* Question breakdown */}
                <details className="group">
                  <summary className="text-sm font-semibold text-primary cursor-pointer hover:underline">
                    View question-by-question breakdown
                  </summary>
                  <div className="mt-3 space-y-2">
                    {quizQuestions.map((q) => {
                      const a = answers[q.id];
                      const score = Array.isArray(a) ? Math.min(a.reduce((s, v) => s + v, 0), 5) : (a as number) || 0;
                      const pct = (score / 5) * 100;
                      return (
                        <div key={q.id} className="flex items-center gap-3 text-sm">
                          <span className="w-40 truncate text-muted-foreground">{q.title}</span>
                          <div className="flex-1 bg-border rounded-full h-2 overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full transition-all"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-xs font-mono text-foreground w-8 text-right">{score}/5</span>
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
                  <Button size="lg" variant="outline" className="gap-2" onClick={reset}>
                    <RotateCcw className="w-4 h-4" /> Retake
                  </Button>
                </div>

                {syncing && (
                  <p className="text-xs text-muted-foreground text-center animate-pulse">Saving your results…</p>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
        <DialogContent className="max-w-4xl w-[95vw] h-[90vh] p-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle>Book Your Strategy Call</DialogTitle>
          </DialogHeader>
          <iframe
            src="https://link.crmchains.com/widget/booking/oZ01xEOkfEvyRVf1Mb7M"
            className="w-full h-full border-0"
            scrolling="no"
            title="Book a strategy call"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
