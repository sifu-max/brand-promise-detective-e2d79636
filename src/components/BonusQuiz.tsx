import { useState } from "react";
import { ArrowRight, CheckCircle2, AlertTriangle, Target, TrendingUp, Zap, RotateCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const questions = [
  {
    num: 1,
    title: "Conversation Capture",
    prompt:
      "How confident are you that your business captures every incoming customer conversation (calls, texts, social messages, website funnels, forms, etc.)?",
    options: [
      { label: "We capture and track everything automatically", points: 5 },
      { label: "Most conversations are captured", points: 3 },
      { label: "Some conversations slip through the cracks", points: 2 },
      { label: "We probably miss a lot", points: 1 },
    ],
  },
  {
    num: 2,
    title: "Where Conversations Happen",
    prompt: "Where do customers typically start conversations with your business?",
    multiSelect: true,
    options: [
      { label: "Phone calls", points: 1 },
      { label: "SMS / text", points: 1 },
      { label: "Email", points: 1 },
      { label: "Social media (DMs)", points: 1 },
      { label: "Website funnels / forms", points: 1 },
    ],
  },
  {
    num: 3,
    title: "Response Speed",
    prompt:
      "When someone reaches out to your business, how quickly do they usually receive a response?",
    options: [
      { label: "Immediate automated + personalized response", points: 5 },
      { label: "Quick automated response within minutes", points: 4 },
      { label: "Manual response within about an hour", points: 3 },
      { label: "Responses are inconsistent", points: 2 },
      { label: "Sometimes no response happens", points: 1 },
    ],
  },
  {
    num: 4,
    title: "Client Engagement Management",
    prompt: "How are your client conversations and engagements managed today?",
    options: [
      { label: "Everything is centralized in one system", points: 5 },
      { label: "2–3 tools manage conversations", points: 3 },
      { label: "Spread across multiple apps", points: 2 },
      { label: "Completely scattered", points: 1 },
    ],
  },
  {
    num: 5,
    title: "Opportunity Recovery & Reactivation",
    prompt:
      "If a potential customer doesn't respond or an old lead goes cold, what typically happens next?",
    options: [
      { label: "Automated follow-up and reactivation campaigns run automatically", points: 5 },
      { label: "We follow up manually and occasionally revisit old leads", points: 4 },
      { label: "We follow up sometimes but inconsistently", points: 3 },
      { label: "We rarely follow up or revisit old leads", points: 2 },
      { label: "Nothing usually happens", points: 1 },
    ],
  },
  {
    num: 6,
    title: "Referral Systems",
    prompt:
      "Do you have an automated referral or review generation system in place?",
    options: [
      { label: "Yes", points: 5 },
      { label: "No", points: 1 },
    ],
  },
  {
    num: 7,
    title: "No-Show Recovery",
    prompt:
      "Do you have an automated process to follow up when someone misses a scheduled appointment or booking?",
    options: [
      { label: "Yes", points: 5 },
      { label: "No", points: 1 },
    ],
  },
  {
    num: 8,
    title: "Payment Automation",
    prompt: "How do you collect payments from clients?",
    options: [
      { label: "Automated invoicing and payment collection (recurring billing, auto-reminders)", points: 5 },
      { label: "We send invoices manually but use online payment links", points: 4 },
      { label: "We send invoices manually and chase payments by email/phone", points: 2 },
      { label: "We don't have a consistent invoicing process", points: 1 },
    ],
  },
];

const scoreBands = [
  {
    min: 0,
    max: 12,
    label: "Severe Revenue Leakage",
    color: "text-destructive",
    bg: "bg-destructive/10 border-destructive/30",
    icon: <AlertTriangle className="w-6 h-6" />,
    diagnosis:
      "Your business is likely missing conversations, has no automated follow-up, no referral engine, no no-show recovery, and inconsistent payment collection. Revenue is leaking at nearly every stage.",
    recommendation:
      "Start with the fundamentals: capture every conversation, centralize communication, and install automated follow-up, referral, and payment systems.",
    cta: "Book a strategy call to identify your first 1–2 fixes.",
  },
  {
    min: 13,
    max: 24,
    label: "Fragmented Infrastructure",
    color: "text-[hsl(35,90%,50%)]",
    bg: "bg-[hsl(35,90%,50%)]/10 border-[hsl(35,90%,50%)]/30",
    icon: <Target className="w-6 h-6" />,
    diagnosis:
      "You have some systems in place, but gaps remain in areas like referral generation, no-show recovery, or payment automation. Conversations and follow-ups are inconsistent.",
    recommendation:
      "Centralize your communication channels, automate your most important follow-up paths, and close the gaps in referrals, missed appointments, and invoicing.",
    cta: "Book a strategy call to map your highest-impact upgrades.",
  },
  {
    min: 25,
    max: 33,
    label: "Strong Communication Systems",
    color: "text-primary",
    bg: "bg-primary/10 border-primary/30",
    icon: <TrendingUp className="w-6 h-6" />,
    diagnosis:
      "You have a solid communication and revenue foundation. Most systems are in place, but there's still room to optimize conversion, referrals, or payment workflows.",
    recommendation:
      "Optimize routing, qualification, conversion flows, and tighten up any remaining gaps in referral engines, no-show recovery, or billing automation.",
    cta: "Book a strategy call to optimize the system you already have.",
  },
  {
    min: 34,
    max: 40,
    label: "Advanced Revenue Infrastructure",
    color: "text-[hsl(145,60%,40%)]",
    bg: "bg-[hsl(145,60%,40%)]/10 border-[hsl(145,60%,40%)]/30",
    icon: <Zap className="w-6 h-6" />,
    diagnosis:
      "Your revenue communication systems are well structured and performing at a high level across all key areas including referrals, recovery, and payments.",
    recommendation:
      "Shift from setup to optimization — improve analytics, test automations, and engineer better revenue performance across every touchpoint.",
    cta: "Book a strategy call for advanced optimization and scale.",
  },
];

export function BonusQuiz() {
  const [answers, setAnswers] = useState<Record<number, number | number[]>>({});
  const [showResults, setShowResults] = useState(false);

  const allAnswered = questions.every((q) => {
    const a = answers[q.num];
    if (q.multiSelect) return Array.isArray(a) && a.length > 0;
    return a !== undefined;
  });

  const totalScore = questions.reduce((sum, q) => {
    const a = answers[q.num];
    if (q.multiSelect && Array.isArray(a)) return sum + Math.min(a.reduce((s, v) => s + v, 0), 5);
    if (typeof a === "number") return sum + a;
    return sum;
  }, 0);

  const band = scoreBands.find((b) => totalScore >= b.min && totalScore <= b.max) || scoreBands[0];

  const handleSelect = (qNum: number, points: number, multiSelect?: boolean) => {
    if (multiSelect) {
      setAnswers((prev) => {
        const current = (prev[qNum] as number[]) || [];
        const exists = current.includes(points);
        // For multi-select with identical point values, track by index
        return { ...prev, [qNum]: exists ? current.filter((p) => p !== points) : [...current, points] };
      });
    } else {
      setAnswers((prev) => ({ ...prev, [qNum]: points }));
    }
    setShowResults(false);
  };

  const handleMultiSelect = (qNum: number, optionIndex: number, points: number) => {
    setAnswers((prev) => {
      const current = (prev[qNum] as number[]) || [];
      // Use index-based tracking for multi-select
      const key = optionIndex;
      const currentIndices = (prev[`${qNum}_indices`] as number[]) || [];
      const hasIndex = currentIndices.includes(key);
      const newIndices = hasIndex ? currentIndices.filter((i) => i !== key) : [...currentIndices, key];
      const newPoints = hasIndex ? current.filter((_, i) => i !== currentIndices.indexOf(key)) : [...current, points];
      return { ...prev, [qNum]: newPoints, [`${qNum}_indices`]: newIndices };
    });
    setShowResults(false);
  };

  const reset = () => {
    setAnswers({});
    setShowResults(false);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">
          Bonus: Revenue Infrastructure Quick Score
        </h2>
        <p className="text-muted-foreground text-sm max-w-lg mx-auto">
          Answer 5 quick questions to see where your revenue systems stand. Takes under 3 minutes.
        </p>
      </div>

      {questions.map((q) => {
        const selectedValue = answers[q.num];
        const selectedIndices = (answers[`${q.num}_indices`] as number[]) || [];

        return (
          <Card key={q.num} className="overflow-hidden">
            <CardHeader className="pb-3 bg-muted/30">
              <CardTitle className="text-base flex items-center gap-2">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold shrink-0">
                  {q.num}
                </span>
                {q.title}
                {q.multiSelect && (
                  <span className="ml-auto text-xs font-normal text-muted-foreground">Select all that apply</span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <p className="text-sm text-foreground font-medium">{q.prompt}</p>
              <div className="space-y-2">
                {q.options.map((opt, idx) => {
                  const isSelected = q.multiSelect
                    ? selectedIndices.includes(idx)
                    : selectedValue === opt.points;

                  return (
                    <button
                      key={idx}
                      onClick={() =>
                        q.multiSelect
                          ? handleMultiSelect(q.num, idx, opt.points)
                          : handleSelect(q.num, opt.points)
                      }
                      className={`w-full text-left flex items-center justify-between text-sm rounded-lg px-4 py-3 border transition-all ${
                        isSelected
                          ? "border-primary bg-primary/10 text-foreground ring-1 ring-primary/30"
                          : "border-border bg-background text-foreground hover:border-primary/40 hover:bg-muted/50"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />}
                        {opt.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Submit / Results */}
      <div className="text-center space-y-4">
        {!showResults ? (
          <Button
            size="lg"
            disabled={!allAnswered}
            onClick={() => setShowResults(true)}
            className="px-10"
          >
            See My Score <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Card className={`border-2 ${band.bg} text-left`}>
            <CardContent className="p-6 md:p-8 space-y-5">
              <div className="flex items-center gap-3">
                <span className={band.color}>{band.icon}</span>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    Your Score: {totalScore} / 25
                  </p>
                  <p className={`text-sm font-semibold ${band.color}`}>{band.label}</p>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm text-foreground">
                  <strong>Diagnosis:</strong> {band.diagnosis}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Recommendation:</strong> {band.recommendation}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button size="lg" className="gap-2" asChild>
                  <a href="https://crmchains.com/calendar" target="_blank" rel="noopener noreferrer">
                    {band.cta} <ArrowRight className="w-4 h-4" />
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="gap-2" onClick={reset}>
                  <RotateCcw className="w-4 h-4" /> Retake Quiz
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
