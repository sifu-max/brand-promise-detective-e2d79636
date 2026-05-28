import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  Brain,
  Eye,
  Globe,
  Megaphone,
  Search,
  Shield,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Brand Intelligence",
    description:
      "Our AI analyzes your business URL and extracts your core brand promise, ideal client profile, and competitive positioning — in seconds.",
  },
  {
    icon: Eye,
    title: "AI Visibility Schema Scan",
    description:
      "Discover if AI systems like ChatGPT, Claude, and Google AI Overviews can actually find and recommend your business. Most can't.",
  },
  {
    icon: Target,
    title: "Ideal Client Targeting",
    description:
      "Define and reach your ideal audience with data-driven personas built from your brand analysis and competitive landscape.",
  },
  {
    icon: Megaphone,
    title: "Social Campaign Strategy",
    description:
      "Get actionable campaign blueprints for LinkedIn, Instagram, Facebook, and more — tailored to your brand voice and goals.",
  },
  {
    icon: BarChart3,
    title: "Brand Effectiveness Scoring",
    description:
      "Receive a detailed scorecard covering messaging clarity, CTA strength, visual identity, target audience fit, and offer structure.",
  },
  {
    icon: Search,
    title: "Competitive Positioning",
    description:
      "Understand where you stand against competitors and identify untapped opportunities in your market.",
  },
];

const scores = [
  { label: "Messaging Clarity", value: 85, rating: "Excellent" },
  { label: "CTA Strength", value: 35, rating: "Weak" },
  { label: "Visual Identity", value: 70, rating: "Strong" },
  { label: "Target Audience Fit", value: 55, rating: "Needs Work" },
  { label: "Offer Structure", value: 25, rating: "Weak" },
];

const steps = [
  {
    num: "01",
    title: "Enter Your URL",
    description: "Provide your business website and our AI does the rest.",
  },
  {
    num: "02",
    title: "Get Your Brand Analysis",
    description: "Receive a comprehensive report on brand messaging, colors, typography, and positioning.",
  },
  {
    num: "03",
    title: "Review AI Visibility",
    description: "See if AI systems can find and recommend your business — and what's missing.",
  },
  {
    num: "04",
    title: "Launch & Optimize",
    description: "Use your insights to launch targeted social campaigns with confidence.",
  },
];

const SocialMedia = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-90" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-16 text-center">
          <Badge className="bg-primary/20 text-primary-foreground border-primary/30 mb-6">
            <Zap className="w-3 h-3 mr-1" /> Powered by CRMChains AI
          </Badge>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground max-w-4xl mx-auto leading-tight">
            Your Brand, Visible to{" "}
            <span className="text-coral">Every AI System</span>
          </h2>
          <p className="text-primary-foreground/70 mt-6 max-w-2xl mx-auto text-lg">
            AI systems like ChatGPT, Claude, and Google AI Overviews don't browse the web like humans.
            They need structured, machine-readable signals. We make sure they can find you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <Button
              size="lg"
              className="gap-2 text-base px-8 bg-coral hover:bg-coral/90 text-primary-foreground"
              onClick={() => navigate("/lab")}
            >
              <Globe className="w-5 h-5" /> Analyze Your Brand Free
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="gap-2 text-base px-8 border-primary-foreground/30 text-primary-foreground bg-transparent hover:bg-primary-foreground/10"
              onClick={() => navigate("/brand-builder")}
            >
              Define your Brand
            </Button>
          </div>
        </div>
      </section>

      {/* Brand Effectiveness Preview */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <Card className="p-6 sm:p-10 border-border shadow-lg" style={{ background: "var(--gradient-card)" }}>
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                Brand Effectiveness at a Glance
              </h3>
              <p className="text-muted-foreground mb-6">
                Our AI analyzes five critical dimensions of your brand's digital presence
                and delivers an actionable scorecard with improvement priorities.
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="w-4 h-4 text-primary" />
                AI-generated scores · Directional guidance for strategic planning
              </div>
            </div>
            <div className="space-y-4">
              {scores.map((score) => (
                <div key={score.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-foreground">{score.label}</span>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        score.value >= 70
                          ? "bg-success/15 text-success"
                          : score.value >= 50
                          ? "bg-warning/15 text-warning"
                          : "bg-destructive/15 text-destructive"
                      }`}
                    >
                      {score.rating}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-muted">
                    <div
                      className={`h-2 rounded-full transition-all duration-700 ${
                        score.value >= 70
                          ? "bg-success"
                          : score.value >= 50
                          ? "bg-warning"
                          : "bg-destructive"
                      }`}
                      style={{ width: `${score.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </section>

      {/* Features Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        <div className="text-center mb-12">
          <h3 className="text-3xl sm:text-4xl font-bold text-foreground">
            Everything You Need to Win on Social
          </h3>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
            From AI brand analysis to campaign strategy — one platform for total digital presence.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="p-6 border-border hover:border-primary/30 transition-colors group hover:shadow-glow"
              style={{ background: "var(--gradient-card)" }}
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-5 h-5 text-primary" />
              </div>
              <h4 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        <div className="text-center mb-12">
          <h3 className="text-3xl sm:text-4xl font-bold text-foreground">
            How It Works
          </h3>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <div key={step.num} className="relative">
              <span className="text-5xl font-bold text-primary/15 absolute -top-4 -left-1">
                {step.num}
              </span>
              <div className="pt-8 pl-1">
                <h4 className="text-lg font-semibold text-foreground mb-2">{step.title}</h4>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 -right-3 text-muted-foreground/30">→</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* AI Visibility CTA */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        <Card className="p-8 sm:p-12 border-primary/20 text-center shadow-glow" style={{ background: "var(--gradient-card)" }}>
          <Badge className="bg-destructive/10 text-destructive border-destructive/20 mb-4">
            ✕ Most Businesses Are Invisible to AI
          </Badge>
          <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
            Is Your Business AI-Visible?
          </h3>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Without machine-readable structured data, AI systems cannot confidently recognize or cite your business —
            even if your website looks perfect to human visitors. Ranking is irrelevant without eligibility.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-3xl mx-auto mb-8 text-left">
            {[
              { label: "Schema detected", value: "No" },
              { label: "Machine-readable identity", value: "Missing" },
              { label: "AI citation eligibility", value: "Not possible" },
              { label: "Structural trust signals", value: "Incomplete" },
            ].map((item) => (
              <div key={item.label} className="p-3 rounded-lg bg-muted/50 border border-border">
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="text-sm font-semibold text-destructive">{item.value}</p>
              </div>
            ))}
          </div>
          <Button
            size="lg"
            className="gap-2 text-base px-8 bg-coral hover:bg-coral/90 text-primary-foreground"
            onClick={() => window.open("https://www.crmchains.com", "_blank")}
          >
            <TrendingUp className="w-5 h-5" /> Check Your AI Visibility
          </Button>
        </Card>
      </section>

      {/* Quote */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-20 text-center">
        <blockquote className="text-xl sm:text-2xl text-foreground/80 italic leading-relaxed">
          "A defined brand promise attracts your ideal client. CRMChains nurtures them into solutions orchestrated by your team."
        </blockquote>
        <p className="text-muted-foreground mt-4 text-sm">— CRMChains</p>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>© {new Date().getFullYear()} CRMChains</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Designed by{" "}
            <a href="https://www.crmchains.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              www.crmchains.com
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default SocialMedia;
