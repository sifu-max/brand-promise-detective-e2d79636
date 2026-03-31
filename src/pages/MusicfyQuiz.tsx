import { useState } from "react";
import { Music, ArrowRight, ArrowLeft, CheckCircle2, Sparkles, Mic2, Headphones, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";

// ── Package definitions ──────────────────────────────────────────────
const packages = [
  {
    id: "creation",
    division: "Creation Division",
    title: "Full Song From Scratch",
    subtitle: "I Have Nothing",
    price: "$4,000 – $12,000",
    icon: <Sparkles className="w-7 h-7" />,
    description:
      "Start with just your story. We handle everything — songwriting, production, recording, mixing, mastering, and distribution.",
    includes: [
      "Story extraction interview",
      "AI-powered lyric writing",
      "Full beat production",
      "Studio recording",
      "Professional mix & master",
      "Cover art & distribution",
    ],
  },
  {
    id: "production",
    division: "Production Division",
    title: "Production Only",
    subtitle: "I Have a Song",
    price: "$2,000 – $6,000",
    icon: <Mic2 className="w-7 h-7" />,
    description:
      "You've got the words. We bring them to life with professional production, recording, and polishing.",
    includes: [
      "Custom beat production",
      "Studio recording session",
      "Vocal editing & tuning",
      "Professional mixing",
      "Mastering",
      "Distribution setup",
    ],
  },
  {
    id: "experience",
    division: "Experience Division",
    title: "Song Development",
    subtitle: "I Have a Beat",
    price: "$1,500 – $4,000",
    icon: <Headphones className="w-7 h-7" />,
    description:
      "You've got the vibe. We craft the song around your sound — lyrics, melody, recording and final polish.",
    includes: [
      "Lyric development",
      "Melody & toplining",
      "Vocal recording",
      "Basic mix & master",
      "Emotional storytelling",
      "Final delivery",
    ],
  },
  {
    id: "launch",
    division: "Launch Division",
    title: "Polish & Launch",
    subtitle: "Almost There",
    price: "$800 – $3,000",
    icon: <Rocket className="w-7 h-7" />,
    description:
      "Your song exists but needs the final touches — mixing, mastering, cover art, copyright, marketing, and release.",
    includes: [
      "Professional mixing",
      "Mastering",
      "Cover art design",
      "Copyright registration",
      "Distribution",
      "Marketing strategy",
    ],
  },
];

// ── Questions ────────────────────────────────────────────────────────
type Question = {
  id: string;
  title: string;
  subtitle: string;
  type: "single" | "multi" | "text" | "slider";
  options?: { label: string; score: Record<string, number> }[];
  max?: number;
  placeholder?: string;
};

const questions: Question[] = [
  {
    id: "situation",
    title: "Where are you in your music journey?",
    subtitle: "This helps us understand your starting point.",
    type: "single",
    options: [
      {
        label: "I have nothing — just a story or idea",
        score: { creation: 10, production: 0, experience: 2, launch: 0 },
      },
      {
        label: "I have lyrics or a demo ready",
        score: { creation: 0, production: 10, experience: 2, launch: 0 },
      },
      {
        label: "I want a personal, gift, or experience song",
        score: { creation: 3, production: 0, experience: 10, launch: 0 },
      },
      {
        label: "I have a finished song that needs polishing",
        score: { creation: 0, production: 2, experience: 0, launch: 10 },
      },
    ],
  },
  {
    id: "emotion",
    title: "What emotions must the listener feel?",
    subtitle: "Select all that apply (up to 3).",
    type: "multi",
    max: 3,
    options: [
      { label: "Empowered", score: { creation: 1, production: 1, experience: 1, launch: 1 } },
      { label: "Nostalgic", score: { creation: 1, production: 0, experience: 2, launch: 0 } },
      { label: "Romantic", score: { creation: 1, production: 0, experience: 2, launch: 0 } },
      { label: "Reflective", score: { creation: 1, production: 0, experience: 2, launch: 0 } },
      { label: "Celebratory", score: { creation: 1, production: 1, experience: 2, launch: 1 } },
      { label: "Healing", score: { creation: 2, production: 0, experience: 2, launch: 0 } },
      { label: "Cinematic", score: { creation: 2, production: 2, experience: 1, launch: 1 } },
    ],
  },
  {
    id: "involvement",
    title: "How involved do you want to be?",
    subtitle: "Your collaboration level shapes the right package.",
    type: "single",
    options: [
      {
        label: "Highly collaborative — I want to be part of every step",
        score: { creation: 3, production: 2, experience: 1, launch: 0 },
      },
      {
        label: "Guided but involved — keep me in the loop",
        score: { creation: 2, production: 3, experience: 2, launch: 1 },
      },
      {
        label: "Fully trust the team — just deliver something amazing",
        score: { creation: 1, production: 1, experience: 3, launch: 3 },
      },
    ],
  },
  {
    id: "perform",
    title: "Will you perform the song yourself?",
    subtitle: "This determines vocal recording needs.",
    type: "single",
    options: [
      {
        label: "Yes — I want to be the voice",
        score: { creation: 2, production: 3, experience: 1, launch: 0 },
      },
      {
        label: "No — find a vocalist for me",
        score: { creation: 3, production: 1, experience: 2, launch: 1 },
      },
      {
        label: "Not sure yet",
        score: { creation: 2, production: 2, experience: 2, launch: 1 },
      },
    ],
  },
  {
    id: "investment",
    title: "Which investment range feels right for you?",
    subtitle: "Aligning your intention with the right package.",
    type: "single",
    options: [
      {
        label: "$800 – $3,000",
        score: { creation: 0, production: 0, experience: 0, launch: 0 },
      },
      {
        label: "$1,500 – $4,000",
        score: { creation: 0, production: 0, experience: 0, launch: 0 },
      },
      {
        label: "$2,000 – $6,000",
        score: { creation: 0, production: 0, experience: 0, launch: 0 },
      },
      {
        label: "$4,000 – $12,000+",
        score: { creation: 0, production: 0, experience: 0, launch: 0 },
      },
    ],
  },
  {
    id: "timeline",
    title: "Are you ready to begin within 30 days?",
    subtitle: "Let's gauge your readiness.",
    type: "single",
    options: [
      {
        label: "Yes — let's go!",
        score: { creation: 2, production: 2, experience: 2, launch: 2 },
      },
      {
        label: "Possibly — I need a bit more info",
        score: { creation: 1, production: 1, experience: 1, launch: 1 },
      },
      {
        label: "Not yet — just exploring",
        score: { creation: 0, production: 0, experience: 0, launch: 0 },
      },
    ],
  },
  {
    id: "marketing",
    title: "Would you need marketing support after production?",
    subtitle: "Distribution, promotion, and release strategy.",
    type: "single",
    options: [
      {
        label: "Yes — I want the full launch experience",
        score: { creation: 3, production: 1, experience: 0, launch: 0 },
      },
      {
        label: "Maybe — I'm open to it",
        score: { creation: 1, production: 1, experience: 1, launch: 1 },
      },
      {
        label: "No — just the song itself",
        score: { creation: 0, production: 1, experience: 2, launch: 3 },
      },
    ],
  },
];

export default function MusicfyQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number | number[]>>({});
  const [showResult, setShowResult] = useState(false);

  const q = questions[step];
  const progress = ((step + 1) / questions.length) * 100;

  const handleSingle = (idx: number) => {
    setAnswers((p) => ({ ...p, [q.id]: idx }));
  };

  const handleMulti = (idx: number) => {
    setAnswers((p) => {
      const cur = (p[q.id] as number[]) || [];
      if (cur.includes(idx)) return { ...p, [q.id]: cur.filter((i) => i !== idx) };
      if (q.max && cur.length >= q.max) return p;
      return { ...p, [q.id]: [...cur, idx] };
    });
  };

  const isAnswered = () => {
    const a = answers[q.id];
    if (q.type === "multi") return Array.isArray(a) && a.length > 0;
    return a !== undefined;
  };

  const next = () => {
    if (step < questions.length - 1) setStep(step + 1);
    else setShowResult(true);
  };

  const prev = () => {
    if (showResult) {
      setShowResult(false);
    } else if (step > 0) setStep(step - 1);
  };

  // ── Scoring ──
  const computeScores = () => {
    const scores: Record<string, number> = { creation: 0, production: 0, experience: 0, launch: 0 };
    questions.forEach((question) => {
      const a = answers[question.id];
      if (question.type === "multi" && Array.isArray(a)) {
        a.forEach((idx) => {
          const opt = question.options![idx];
          Object.entries(opt.score).forEach(([k, v]) => (scores[k] += v));
        });
      } else if (typeof a === "number" && question.options) {
        const opt = question.options[a];
        Object.entries(opt.score).forEach(([k, v]) => (scores[k] += v));
      }
    });
    return scores;
  };

  const getBudgetLabel = () => {
    const investmentAnswer = answers["investment"];
    if (typeof investmentAnswer !== "number") return null;
    const investmentQ = questions.find((q) => q.id === "investment")!;
    return investmentQ.options![investmentAnswer].label;
  };

  const getReasonText = (pkgId: string) => {
    const reasons: Record<string, string> = {
      creation:
        "you're starting from scratch and want the full creative journey — from story extraction through songwriting, production, recording, and distribution.",
      production:
        "you already have lyrics or a demo and need professional production, recording, and polishing to bring it to life.",
      experience:
        "you're looking for a deeply personal or gift-driven song experience where we craft the emotion and story around your vision.",
      launch:
        "your song already exists and just needs the final professional touches — mixing, mastering, cover art, and release strategy.",
    };
    return reasons[pkgId] || "";
  };

  const getRecommendation = () => {
    const scores = computeScores();
    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    return packages.find((p) => p.id === sorted[0][0])!;
  };

  const restart = () => {
    setStep(0);
    setAnswers({});
    setShowResult(false);
  };

  // ── Result Screen ──
  if (showResult) {
    const rec = getRecommendation();
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-2xl space-y-8 animate-fade-in">
            <div className="text-center space-y-2">
              <p className="text-amber-400 uppercase tracking-widest text-sm font-semibold">
                Your Recommended Package
              </p>
              <h1 className="text-3xl md:text-4xl font-bold">{rec.division}</h1>
              <p className="text-gray-400">{rec.subtitle}</p>
            </div>

            <div className="bg-[#141414] border border-amber-500/30 rounded-2xl p-6 md:p-8 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  {rec.icon}
                </div>
                <div>
                  <h2 className="text-xl font-bold">{rec.title}</h2>
                  <p className="text-amber-400 font-semibold">{rec.price}</p>
                </div>
              </div>

              <p className="text-gray-300">{rec.description}</p>

              <div className="space-y-2">
                <p className="text-sm text-amber-400 font-semibold uppercase tracking-wide">
                  What's Included
                </p>
                <ul className="grid sm:grid-cols-2 gap-2">
                  {rec.includes.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-gray-300">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <a
                  href="https://lyric-lift-off.lovable.app/#pathways"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold text-base py-6 gap-2">
                    Get Started <ArrowRight className="w-4 h-4" />
                  </Button>
                </a>
                <Button
                  variant="outline"
                  className="flex-1 border-gray-700 text-gray-300 hover:bg-white/5 bg-transparent py-6"
                  onClick={restart}
                >
                  Retake Quiz
                </Button>
              </div>
            </div>

            {/* Other packages */}
            <div className="space-y-3">
              <p className="text-center text-sm text-gray-500">Other available packages</p>
              <div className="grid sm:grid-cols-3 gap-3">
                {packages
                  .filter((p) => p.id !== rec.id)
                  .map((p) => (
                    <div
                      key={p.id}
                      className="bg-[#141414] border border-gray-800 rounded-xl p-4 text-center space-y-1"
                    >
                      <div className="text-amber-400/60 flex justify-center">{p.icon}</div>
                      <p className="text-sm font-semibold">{p.title}</p>
                      <p className="text-xs text-gray-500">{p.price}</p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ── Quiz Steps ──
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      <Header />

      {/* Progress */}
      <div className="px-4 pt-6 max-w-2xl mx-auto w-full">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
          <span className="uppercase tracking-widest font-semibold text-amber-400">
            Question {step + 1} of {questions.length}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl space-y-8 animate-fade-in" key={step}>
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold">{q.title}</h2>
            <p className="text-gray-400">{q.subtitle}</p>
          </div>

          <div className="space-y-3">
            {q.options?.map((opt, idx) => {
              const selected =
                q.type === "multi"
                  ? ((answers[q.id] as number[]) || []).includes(idx)
                  : answers[q.id] === idx;

              return (
                <button
                  key={idx}
                  onClick={() => (q.type === "multi" ? handleMulti(idx) : handleSingle(idx))}
                  className={`w-full text-left px-5 py-4 rounded-xl border transition-all duration-200 flex items-center gap-3 ${
                    selected
                      ? "border-amber-500 bg-amber-500/10 text-white"
                      : "border-gray-800 bg-[#141414] text-gray-300 hover:border-amber-500/40 hover:bg-[#1a1a1a]"
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                      selected ? "border-amber-500 bg-amber-500" : "border-gray-600"
                    }`}
                  >
                    {selected && (
                      <span className="w-2 h-2 rounded-full bg-black" />
                    )}
                  </span>
                  <span className="text-sm md:text-base">{opt.label}</span>
                </button>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4">
            <Button
              variant="ghost"
              className="text-gray-400 hover:text-white gap-2"
              onClick={prev}
              disabled={step === 0}
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>
            <Button
              className="bg-amber-500 hover:bg-amber-600 text-black font-bold gap-2 px-8"
              onClick={next}
              disabled={!isAnswered()}
            >
              {step === questions.length - 1 ? "See My Result" : "Next"}{" "}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

function Header() {
  return (
    <header className="flex items-center justify-center py-6 px-4">
      <div className="flex items-center gap-2">
        <Music className="w-6 h-6 text-amber-400" />
        <span className="text-lg font-bold tracking-tight">
          <span className="text-amber-400">Musicfy</span>{" "}
          <span className="text-white">My Life</span>
        </span>
      </div>
    </header>
  );
}
