import { ArrowRight, Phone, Bot, Globe, Calculator, Shield, Users, Zap, CheckCircle2, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SiteHeader } from "@/components/SiteHeader";
import crmchainsLogo from "@/assets/crmchains-logo.jpg";

const services = [
  {
    icon: <Shield className="h-6 w-6" />,
    title: "CRM Infrastructure",
    description: "Purpose-built CRM systems designed for agency workflows — manage agents, clients, pipelines, and compliance in one unified platform.",
  },
  {
    icon: <Phone className="h-6 w-6" />,
    title: "Bilingual Virtual Assistants",
    description: "Dedicated VAs handling calling campaigns at 100+ calls/hour with daily performance reports. Technical and administrative support included.",
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Service Agents",
    description: "When issues arise with your system or users, our dedicated service team resolves them — so your agents stay focused on selling.",
  },
  {
    icon: <Globe className="h-6 w-6" />,
    title: "Branded Website Ecosystem",
    description: "Seamless website design connected to your CRM. When your agency onboards a new agent, we auto-generate a branded landing page, digital business card, QR code, and personalized URL — all matching your agency branding.",
  },
  {
    icon: <Bot className="h-6 w-6" />,
    title: "AI Agents",
    description: "AI-powered agents for training, automation, onboarding, inbound/outbound calling, and SMS — working 24/7 alongside your team.",
  },
  {
    icon: <Calculator className="h-6 w-6" />,
    title: "Calculators & Pre-Qualification",
    description: "Quick-intake calculators so prospective agents and clients arrive pre-qualified — reducing training burden and expediting engagement.",
  },
];

const verticals = [
  { name: "Insurance Agencies", icon: <Shield className="h-5 w-5" /> },
  { name: "Real Estate Teams", icon: <Building2 className="h-5 w-5" /> },
];

const painPoints = [
  "Agents stuck using 5+ disconnected tools",
  "No system to pre-qualify leads before they reach your team",
  "Onboarding new agents takes weeks instead of days",
  "You can't scale without adding overhead",
  "Your website doesn't connect to your CRM or pipeline",
  "Follow-up falls through the cracks",
];

const CRMChains = () => {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="gradient-hero text-primary-foreground">
        <div className="container max-w-6xl py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-sm font-medium">
                <Zap className="h-4 w-4" />
                Built for Insurance & Real Estate Agencies
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
                Stop Losing Agents to
                <span className="block text-coral mt-2">Broken Systems</span>
              </h1>

              <p className="text-lg md:text-xl text-primary-foreground/80 max-w-lg">
                CRMChains gives your agency the CRM, AI agents, bilingual VAs, and automated 
                websites your team needs — so every new agent is productive from day one.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-coral hover:bg-coral/90 text-primary-foreground" asChild>
                  <a href="https://crmchains.com/calendar" target="_blank" rel="noopener noreferrer">
                    Book a Strategy Call <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="border-coral/50 text-coral-light hover:bg-coral/10" asChild>
                  <a href="#services">See How It Works</a>
                </Button>
              </div>

              <div className="flex items-center gap-6 pt-2">
                {verticals.map((v) => (
                  <div key={v.name} className="flex items-center gap-2 text-sm text-primary-foreground/70">
                    {v.icon}
                    <span>{v.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero right — pain points */}
            <div className="bg-primary-foreground/5 border border-primary-foreground/10 rounded-2xl p-8 space-y-5 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-primary-foreground/90">
                Sound familiar?
              </h3>
              {painPoints.map((point) => (
                <div key={point} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-coral shrink-0 mt-0.5" />
                  <p className="text-primary-foreground/80 text-sm leading-relaxed">{point}</p>
                </div>
              ))}
              <p className="text-xs text-primary-foreground/50 pt-2">
                If you checked even two — you need CRMChains.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Promise */}
      <section className="py-16 bg-muted/50">
        <div className="container max-w-4xl text-center space-y-4">
          <p className="text-2xl md:text-3xl font-semibold text-foreground leading-relaxed">
            "A defined brand promise attracts your ideal client.
            <br />
            <span className="text-primary">CRMChains nurtures them into solutions orchestrated by your team.</span>"
          </p>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-20">
        <div className="container max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              One Ecosystem. Everything Your Agency Needs.
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              From CRM to AI agents to branded websites — we replace your patchwork of tools 
              with a single platform designed for the agency model.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Card key={service.title} className="group hover:shadow-lg transition-all duration-300 border-border hover:border-primary/30">
                <CardContent className="p-6 space-y-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    {service.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{service.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ICP / Who We Serve */}
      <section className="py-20 gradient-hero text-primary-foreground">
        <div className="container max-w-5xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Built for Agencies That Scale Agents
              </h2>
              <p className="text-primary-foreground/80 text-lg leading-relaxed">
                Whether you run an insurance agency or a real estate brokerage, 
                your challenge is the same: onboard agents fast, give them the right tools, 
                and keep the pipeline moving.
              </p>
              <p className="text-primary-foreground/80 text-lg leading-relaxed">
                CRMChains was born from serving insurance agencies — then we saw the same 
                pain in real estate. The agency model is universal. Our platform adapts 
                the copy, branding, and workflows for your vertical.
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-primary-foreground/10 rounded-2xl p-6 space-y-4 border border-primary-foreground/10">
                <h4 className="font-semibold text-lg">Your Ideal Setup With CRMChains</h4>
                <ul className="space-y-3 text-sm text-primary-foreground/80">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 text-coral shrink-0 mt-0.5" />
                    New agent onboards → branded site auto-created
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 text-coral shrink-0 mt-0.5" />
                    Leads pre-qualified before they hit your team
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 text-coral shrink-0 mt-0.5" />
                    VAs making 100+ calls/hour with daily reports
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 text-coral shrink-0 mt-0.5" />
                    AI handles training, follow-up, and SMS outreach
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 text-coral shrink-0 mt-0.5" />
                    One CRM connects everything — no more duct-tape
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container max-w-3xl text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Ready to Give Your Agency an Unfair Advantage?
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Book a 30-minute strategy call. We'll show you exactly how CRMChains 
            replaces your disconnected tools with one system built for growth.
          </p>
          <Button size="lg" className="bg-coral hover:bg-coral/90 text-primary-foreground px-10 py-6 text-lg" asChild>
            <a href="https://crmchains.com/calendar" target="_blank" rel="noopener noreferrer">
              Book Your Strategy Call <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container max-w-6xl">
          <div className="flex flex-col items-center gap-6 text-center">
            <a href="https://crmchains.com/" target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-80">
              <img src={crmchainsLogo} alt="CRMChains Logo" className="h-16 w-auto" />
            </a>
            <p className="text-base text-muted-foreground max-w-xl leading-relaxed">
              "A defined brand promise attracts your ideal client. CRMChains nurtures them into solutions orchestrated by your team."
            </p>
            <a href="https://www.crmchains.com" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-primary hover:underline">
              www.crmchains.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CRMChains;
