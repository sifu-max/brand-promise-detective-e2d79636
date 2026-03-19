import { ArrowRight, Mail, Globe, CheckCircle2, AlertTriangle, TrendingUp, Zap, Target, MessageSquare, Clock, Users, BarChart3, Star, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import crmchainsLogo from "@/assets/crmchains-logo.jpg";
import { useEffect } from "react";

const scoreBands3Min = [
  {
    range: "0–8",
    label: "Severe Revenue Leakage",
    color: "text-destructive",
    bg: "bg-destructive/10 border-destructive/30",
    icon: <AlertTriangle className="w-5 h-5" />,
    diagnosis: "Your business is likely missing inbound conversations, responding inconsistently, and losing follow-up opportunities.",
    recommendation: "Start by fixing the basics: capture every conversation, centralize communication, and install immediate follow-up.",
    nextStep: "Focus on conversation capture + speed to lead + basic nurture.",
    cta: "Book a strategy call to identify your first 1–2 fixes.",
  },
  {
    range: "9–16",
    label: "Fragmented Infrastructure",
    color: "text-[hsl(35,90%,50%)]",
    bg: "bg-[hsl(35,90%,50%)]/10 border-[hsl(35,90%,50%)]/30",
    icon: <Target className="w-5 h-5" />,
    diagnosis: "You have some systems in place, but conversations and follow-ups are inconsistent or spread across multiple tools.",
    recommendation: "Centralize communication channels and automate your most important follow-up paths so leads stop slipping through the cracks.",
    nextStep: "Focus on centralization + response automation + follow-up consistency.",
    cta: "Book a strategy call to map your highest-impact upgrades.",
  },
  {
    range: "17–21",
    label: "Strong Communication Systems",
    color: "text-primary",
    bg: "bg-primary/10 border-primary/30",
    icon: <TrendingUp className="w-5 h-5" />,
    diagnosis: "You already have a solid communication foundation, but there is still room to improve conversion and efficiency.",
    recommendation: "Optimize routing, qualification, and conversion flows so more of your existing demand turns into booked appointments or sales.",
    nextStep: "Focus on qualification + routing + conversion optimization.",
    cta: "Book a strategy call to optimize the system you already have.",
  },
  {
    range: "22–25",
    label: "Advanced Revenue Infrastructure",
    color: "text-[hsl(145,60%,40%)]",
    bg: "bg-[hsl(145,60%,40%)]/10 border-[hsl(145,60%,40%)]/30",
    icon: <Zap className="w-5 h-5" />,
    diagnosis: "Your communication systems are well structured and already performing at a high level.",
    recommendation: "Shift from setup to optimization by improving analytics, testing automations, and engineering better revenue performance.",
    nextStep: "Focus on analytics + optimization + revenue engineering.",
    cta: "Book a strategy call for advanced optimization and scale.",
  },
];

const fullSections = [
  {
    title: "ATTENTION",
    maxScore: 9,
    icon: <Target className="w-5 h-5" />,
    questions: [
      {
        q: "How do people primarily discover your business?",
        options: [
          { label: "Multiple sources (social + search + referrals + ads)", points: 3 },
          { label: "2–3 consistent sources", points: 2 },
          { label: "Mostly one source", points: 1 },
          { label: "Unsure", points: 0 },
        ],
        purpose: "Measures demand diversity.",
      },
      {
        q: "Do you use landing pages or funnels to capture leads?",
        options: [
          { label: "Fully structured funnels", points: 3 },
          { label: "Basic forms only", points: 2 },
          { label: "Occasionally", points: 1 },
          { label: "No structured capture", points: 0 },
        ],
        modules: ["Funnels & Websites"],
      },
      {
        q: "When someone engages with your content, does your system capture that interaction automatically?",
        options: [
          { label: "Yes, engagement triggers conversations", points: 3 },
          { label: "Sometimes", points: 2 },
          { label: "Manual responses only", points: 1 },
          { label: "No capture system", points: 0 },
        ],
        modules: ["Social Planner", "Social Chat"],
      },
    ],
  },
  {
    title: "CONVERSATION",
    maxScore: 12,
    icon: <MessageSquare className="w-5 h-5" />,
    questions: [
      {
        q: "How do customers contact your business most often?",
        options: [
          { label: "Multiple channels managed well", points: 3 },
          { label: "Multiple channels but inconsistent", points: 2 },
          { label: "One main channel", points: 1 },
          { label: "Unclear", points: 0 },
        ],
        modules: ["Multi-Channel Messenger"],
      },
      {
        q: "Are all conversations centralized in one inbox?",
        options: [
          { label: "Yes", points: 3 },
          { label: "Mostly", points: 2 },
          { label: "Somewhat", points: 1 },
          { label: "No", points: 0 },
        ],
        modules: ["Multi-Channel Messenger"],
      },
      {
        q: "If someone calls after hours, what happens?",
        options: [
          { label: "AI answers and qualifies", points: 3 },
          { label: "Voicemail + follow-up", points: 2 },
          { label: "Voicemail only", points: 1 },
          { label: "Missed call", points: 0 },
        ],
        modules: ["Inbound Caller"],
      },
      {
        q: "How quickly do you respond to inquiries?",
        options: [
          { label: "Immediately / automated", points: 3 },
          { label: "Within an hour", points: 2 },
          { label: "Same day", points: 1 },
          { label: "Next day or later", points: 0 },
        ],
        modules: ["SMS Chat", "Web Chat", "Social Chat"],
      },
    ],
  },
  {
    title: "QUALIFICATION",
    maxScore: 9,
    icon: <Users className="w-5 h-5" />,
    questions: [
      {
        q: "Do you collect structured lead information before talking to prospects?",
        options: [
          { label: "Yes, automated intake", points: 3 },
          { label: "Sometimes", points: 2 },
          { label: "Manual questions", points: 1 },
          { label: "No process", points: 0 },
        ],
        modules: ["AI Intake"],
      },
      {
        q: "Do you prioritize leads based on data or scoring?",
        options: [
          { label: "Automated scoring", points: 3 },
          { label: "Manual prioritization", points: 2 },
          { label: "First come first served", points: 1 },
          { label: "No prioritization", points: 0 },
        ],
        modules: ["Lead Scoring"],
      },
      {
        q: "Can leads book appointments automatically?",
        options: [
          { label: "Yes", points: 3 },
          { label: "Sometimes", points: 2 },
          { label: "Manual scheduling", points: 1 },
          { label: "No booking system", points: 0 },
        ],
        modules: ["Calendar booking workflows"],
      },
    ],
  },
  {
    title: "NURTURE",
    maxScore: 12,
    icon: <Clock className="w-5 h-5" />,
    questions: [
      {
        q: "What happens if a lead doesn't respond?",
        options: [
          { label: "Automated follow-up sequence", points: 3 },
          { label: "Manual follow-up", points: 2 },
          { label: "Occasional reminders", points: 1 },
          { label: "Nothing", points: 0 },
        ],
        modules: ["SMS Nurture", "Email Nurture"],
      },
      {
        q: "Do you use automated SMS follow-ups?",
        options: [
          { label: "Yes", points: 3 },
          { label: "Sometimes", points: 2 },
          { label: "Rarely", points: 1 },
          { label: "Never", points: 0 },
        ],
        modules: ["SMS Nurture"],
      },
      {
        q: "Do you use automated email sequences?",
        options: [
          { label: "Yes", points: 3 },
          { label: "Sometimes", points: 2 },
          { label: "Rarely", points: 1 },
          { label: "Never", points: 0 },
        ],
        modules: ["Email Nurture"],
      },
      {
        q: "When was the last time you reactivated your old leads?",
        options: [
          { label: "Within 3 months", points: 3 },
          { label: "Within 1 year", points: 2 },
          { label: "More than a year", points: 1 },
          { label: "Never", points: 0 },
        ],
        modules: ["Reactivation Engine"],
      },
    ],
  },
  {
    title: "AUTHORITY & INTELLIGENCE",
    maxScore: 9,
    icon: <BarChart3 className="w-5 h-5" />,
    questions: [
      {
        q: "Do you automatically request reviews from customers?",
        options: [
          { label: "Yes", points: 3 },
          { label: "Sometimes", points: 2 },
          { label: "Rarely", points: 1 },
          { label: "Never", points: 0 },
        ],
        modules: ["Review Booster"],
      },
      {
        q: "Can you easily see metrics like response time, show rate, or conversion rate?",
        options: [
          { label: "Yes", points: 3 },
          { label: "Some metrics", points: 2 },
          { label: "Limited visibility", points: 1 },
          { label: "No tracking", points: 0 },
        ],
        modules: ["Insights Dashboard"],
      },
      {
        q: "Do you have systems that increase lifetime value?",
        options: [
          { label: "Memberships / upsells automated", points: 3 },
          { label: "Some manual efforts", points: 2 },
          { label: "Occasional upsells", points: 1 },
          { label: "None", points: 0 },
        ],
        modules: ["Course & Member Hub"],
      },
    ],
  },
];

const fullScoreBands = [
  {
    range: "0–20",
    label: "Major Revenue Leaks",
    color: "text-destructive",
    bg: "bg-destructive/10 border-destructive/30",
    diagnosis: "Your business likely misses calls, messages, and follow-ups.",
    recommendation: "Start with $97 modular systems.",
    priority: ["Inbound Caller", "Web Chat", "SMS Chat", "Reactivation Engine"],
  },
  {
    range: "21–35",
    label: "Fragmented Systems",
    color: "text-[hsl(35,90%,50%)]",
    bg: "bg-[hsl(35,90%,50%)]/10 border-[hsl(35,90%,50%)]/30",
    diagnosis: "You have tools but they are disconnected.",
    recommendation: "Install AI Pro ($197) for full communication infrastructure.",
    priority: [],
  },
  {
    range: "36–45",
    label: "Partially Automated",
    color: "text-primary",
    bg: "bg-primary/10 border-primary/30",
    diagnosis: "You have good systems but gaps remain.",
    recommendation: "AI Pro + system optimization.",
    priority: [],
  },
  {
    range: "46–51",
    label: "Advanced Infrastructure",
    color: "text-[hsl(145,60%,40%)]",
    bg: "bg-[hsl(145,60%,40%)]/10 border-[hsl(145,60%,40%)]/30",
    diagnosis: "Your systems are strong.",
    recommendation: "Performance Management — Optimization and revenue engineering.",
    priority: [],
  },
];

export default function RevenueScanner() {
  useEffect(() => {
    // Load GHL form embed script
    const script = document.createElement("script");
    script.src = "https://link.crmchains.com/js/form_embed.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* CRMChains Letterhead */}
      <header className="bg-[hsl(260,30%,15%)] text-white">
        <div className="container max-w-5xl py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={crmchainsLogo} alt="CRMChains" className="h-14 w-auto rounded-lg" />
            <div>
              <h2 className="text-xl font-bold tracking-tight">CRMChains</h2>
              <p className="text-sm text-white/70">Revenue Communication Architecture</p>
            </div>
          </div>
          <div className="hidden sm:flex flex-col items-end text-xs text-white/60 gap-0.5">
            <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> www.crmchains.com</span>
            <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> info@crmchains.com</span>
          </div>
        </div>
        <div className="h-1 bg-gradient-to-r from-[hsl(var(--coral))] via-[hsl(var(--primary))] to-[hsl(var(--coral))]" />
      </header>

      <main className="container max-w-5xl py-10 px-4 space-y-10">
        {/* Title */}
        <div className="text-center space-y-3">
          <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Internal Tool</p>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
            Revenue Health Scanner
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Diagnose revenue leaks across five critical business systems — in 3 minutes or with the full 17-question deep scan.
          </p>
          <Separator className="max-w-xs mx-auto" />
        </div>

        {/* Tabs: Survey | 3-Min SOP | Full SOP */}
        <Tabs defaultValue="survey" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="survey">Live Scanner</TabsTrigger>
            <TabsTrigger value="quick">3-Min Quick Scan</TabsTrigger>
            <TabsTrigger value="full">Full 51-Point Audit</TabsTrigger>
          </TabsList>

          {/* TAB 1: Embedded Survey */}
          <TabsContent value="survey" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  3-Minute Revenue Infrastructure Scanner
                </CardTitle>
                <p className="text-sm text-muted-foreground">Complete the survey below to receive your score and diagnosis.</p>
              </CardHeader>
              <CardContent>
                <iframe
                  src="https://link.crmchains.com/widget/survey/B293s34RwZozzXqwEeS2"
                  style={{ border: "none", width: "100%", minHeight: "600px" }}
                  scrolling="no"
                  id="B293s34RwZozzXqwEeS2"
                  title="Revenue Health Scanner Survey"
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 2: 3-Min Quick Scan SOP */}
          <TabsContent value="quick" className="space-y-8">
            <Card className="border-primary/30 bg-primary/5">
              <CardContent className="p-6">
                <p className="text-sm font-semibold uppercase tracking-wide text-primary mb-1">Quick Scan Overview</p>
                <p className="text-foreground">
                  <strong>5 Questions</strong> · Max <strong>5 points each</strong> · Score range: <strong>0–25</strong>
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Diagnoses five critical revenue systems: conversation capture, communication channels, response speed, system centralization, and lead recovery.
                </p>
              </CardContent>
            </Card>

            {/* Questions */}
            <div className="space-y-6">
              {[
                {
                  num: 1,
                  title: "Conversation Capture",
                  type: "Weighted",
                  prompt: "How confident are you that your business captures every incoming customer conversation (calls, texts, social messages, website funnels, forms, etc.)?",
                  options: [
                    { label: "We capture and track everything automatically", points: 5 },
                    { label: "Most conversations are captured", points: 3 },
                    { label: "Some conversations slip through the cracks", points: 2 },
                    { label: "We probably miss a lot", points: 1 },
                  ],
                  purpose: "Diagnoses lead capture reliability.",
                },
                {
                  num: 2,
                  title: "Where Conversations Happen",
                  type: "Multi-select (1pt each, max 5)",
                  prompt: "Where do customers typically start conversations with your business?",
                  options: [
                    { label: "Phone calls", points: 1 },
                    { label: "SMS / text", points: 1 },
                    { label: "Email", points: 1 },
                    { label: "Social media (DMs)", points: 1 },
                    { label: "Website funnels / forms", points: 1 },
                  ],
                  purpose: "Diagnoses communication channel complexity.",
                },
                {
                  num: 3,
                  title: "Response Speed",
                  type: "Weighted",
                  prompt: "When someone reaches out to your business, how quickly do they usually receive a response?",
                  options: [
                    { label: "Immediate automated + personalized response", points: 5 },
                    { label: "Quick automated response within minutes", points: 4 },
                    { label: "Manual response within about an hour", points: 3 },
                    { label: "Responses are inconsistent", points: 2 },
                    { label: "Sometimes no response happens", points: 1 },
                  ],
                  purpose: "Diagnoses response speed and automation maturity.",
                },
                {
                  num: 4,
                  title: "Client Engagement Management",
                  type: "Weighted",
                  prompt: "How are your client conversations and engagements managed today?",
                  options: [
                    { label: "Everything is centralized in one system", points: 5 },
                    { label: "2–3 tools manage conversations", points: 3 },
                    { label: "Spread across multiple apps", points: 2 },
                    { label: "Completely scattered", points: 1 },
                  ],
                  purpose: "Diagnoses tool fragmentation and operational complexity.",
                },
                {
                  num: 5,
                  title: "Opportunity Recovery & Reactivation",
                  type: "Weighted",
                  prompt: "If a potential customer doesn't respond or an old lead goes cold, what typically happens next?",
                  options: [
                    { label: "Automated follow-up and reactivation campaigns run automatically", points: 5 },
                    { label: "We follow up manually and occasionally revisit old leads", points: 4 },
                    { label: "We follow up sometimes but inconsistently", points: 3 },
                    { label: "We rarely follow up or revisit old leads", points: 2 },
                    { label: "Nothing usually happens", points: 1 },
                  ],
                  purpose: "Diagnoses lead recovery systems and database monetization.",
                },
              ].map((q) => (
                <Card key={q.num}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold shrink-0">
                        {q.num}
                      </span>
                      {q.title}
                      <span className="ml-auto text-xs font-normal text-muted-foreground">{q.type}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-foreground font-medium">{q.prompt}</p>
                    <div className="space-y-1.5">
                      {q.options.map((opt) => (
                        <div key={opt.label} className="flex items-center justify-between text-sm bg-muted/50 rounded-md px-3 py-2">
                          <span className="text-foreground">{opt.label}</span>
                          <span className="font-mono font-bold text-primary text-xs">{opt.points}pt{opt.points !== 1 ? "s" : ""}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground italic">Purpose: {q.purpose}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Score Bands */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-foreground">Score Bands & Response Copy</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {scoreBands3Min.map((band) => (
                  <Card key={band.range} className={`border ${band.bg}`}>
                    <CardContent className="p-5 space-y-3">
                      <div className="flex items-center gap-2">
                        <span className={band.color}>{band.icon}</span>
                        <span className="font-bold text-foreground">{band.range}</span>
                        <span className={`text-sm font-semibold ${band.color}`}>— {band.label}</span>
                      </div>
                      <p className="text-sm text-foreground"><strong>Diagnosis:</strong> {band.diagnosis}</p>
                      <p className="text-sm text-muted-foreground"><strong>Recommendation:</strong> {band.recommendation}</p>
                      <p className="text-sm text-muted-foreground"><strong>Best next step:</strong> {band.nextStep}</p>
                      <p className="text-xs font-semibold text-primary">CTA: {band.cta}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Example AI Message */}
            <Card className="border-primary/30">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Star className="w-5 h-5 text-primary" />
                  Example AI Result Message
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted/50 rounded-lg p-5 space-y-3">
                  <p className="font-bold text-foreground text-lg">Your Revenue Infrastructure Score: 14 / 25</p>
                  <p className="text-sm text-foreground">
                    <strong>Diagnosis:</strong> Your business likely manages conversations across multiple channels but relies on inconsistent follow-ups and manual response processes.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    This often leads to lost opportunities because modern customers expect immediate responses across calls, texts, and social platforms.
                  </p>
                  <p className="text-sm font-semibold text-primary">CTA: See How To Fix These Revenue Leaks</p>
                  <Button size="sm" className="gap-2" asChild>
                    <a href="https://crmchains.com/calendar" target="_blank" rel="noopener noreferrer">
                      Book Strategy Call <ArrowRight className="w-4 h-4" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 3: Full 51-Point Audit SOP */}
          <TabsContent value="full" className="space-y-8">
            <Card className="border-primary/30 bg-primary/5">
              <CardContent className="p-6">
                <p className="text-sm font-semibold uppercase tracking-wide text-primary mb-1">Full Audit Overview</p>
                <p className="text-foreground">
                  <strong>17 Questions</strong> across <strong>5 Sections</strong> · Max <strong>51 Points</strong>
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Scoring: 3 = Fully automated / optimized · 2 = Partial system · 1 = Manual / inconsistent · 0 = Not implemented
                </p>
              </CardContent>
            </Card>

            {/* Sections */}
            {fullSections.map((section, sIdx) => (
              <div key={section.title} className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground">
                    {section.icon}
                  </span>
                  <h3 className="text-lg font-bold text-foreground">
                    Section {sIdx + 1} — {section.title}
                  </h3>
                  <span className="ml-auto text-sm text-muted-foreground font-medium">Max: {section.maxScore} pts</span>
                </div>

                {section.questions.map((q, qIdx) => {
                  const globalNum = fullSections.slice(0, sIdx).reduce((sum, s) => sum + s.questions.length, 0) + qIdx + 1;
                  return (
                    <Card key={qIdx}>
                      <CardContent className="p-5 space-y-3">
                        <p className="text-sm font-bold text-foreground">
                          <span className="text-primary font-mono mr-2">Q{globalNum}.</span>
                          {q.q}
                        </p>
                        <div className="space-y-1.5">
                          {q.options.map((opt) => (
                            <div key={opt.label} className="flex items-center justify-between text-sm bg-muted/50 rounded-md px-3 py-2">
                              <span className="text-foreground">{opt.label}</span>
                              <span className="font-mono font-bold text-primary text-xs">{opt.points}pt{opt.points !== 1 ? "s" : ""}</span>
                            </div>
                          ))}
                        </div>
                        {q.modules && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            <span className="text-xs text-muted-foreground">Modules:</span>
                            {q.modules.map((m) => (
                              <span key={m} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">{m}</span>
                            ))}
                          </div>
                        )}
                        {q.purpose && <p className="text-xs text-muted-foreground italic">Purpose: {q.purpose}</p>}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ))}

            {/* Full Score Bands */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-foreground">Score Bands (Max 51)</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {fullScoreBands.map((band) => (
                  <Card key={band.range} className={`border ${band.bg}`}>
                    <CardContent className="p-5 space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground">{band.range}</span>
                        <span className={`text-sm font-semibold ${band.color}`}>— {band.label}</span>
                      </div>
                      <p className="text-sm text-foreground">{band.diagnosis}</p>
                      <p className="text-sm text-muted-foreground"><strong>Recommendation:</strong> {band.recommendation}</p>
                      {band.priority.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          <span className="text-xs text-muted-foreground">Priority installs:</span>
                          {band.priority.map((m) => (
                            <span key={m} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">{m}</span>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* How Module Recommendations Work */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  How Module Recommendations Work
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>Each low-scoring section maps directly to recommended modules:</p>
                <div className="space-y-2">
                  <p><strong className="text-foreground">Low Conversation score →</strong> Inbound Caller, SMS Chat, Web Chat, Multi-Channel Messenger</p>
                  <p><strong className="text-foreground">Low Nurture score →</strong> SMS Nurture, Email Nurture, Reactivation Engine</p>
                  <p><strong className="text-foreground">Low Authority score →</strong> Review Booster, Insights Dashboard</p>
                </div>
                <Separator />
                <p className="font-medium text-foreground">
                  This scoring system creates clear diagnosis, maps directly to modules, and reinforces that businesses need a <strong>Revenue Communication Architecture</strong>.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Button size="lg" className="gap-2" asChild>
            <a href="https://crmchains.com/calendar" target="_blank" rel="noopener noreferrer">
              Book a Strategy Call <ArrowRight className="w-4 h-4" />
            </a>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <a href="mailto:info@crmchains.com">
              <Mail className="w-4 h-4 mr-2" /> Email Us
            </a>
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[hsl(260,30%,15%)] text-white/60 mt-10">
        <div className="h-1 bg-gradient-to-r from-[hsl(var(--coral))] via-[hsl(var(--primary))] to-[hsl(var(--coral))]" />
        <div className="container max-w-5xl py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <img src={crmchainsLogo} alt="CRMChains" className="h-8 w-auto rounded" />
            <span>© {new Date().getFullYear()} CRMChains. All rights reserved.</span>
          </div>
          <span>www.crmchains.com</span>
        </div>
      </footer>
    </div>
  );
}
