import { useState } from "react";
import {
  ArrowRight,
  Phone,
  PhoneCall,
  Bot,
  Globe,
  Calculator,
  Shield,
  Users,
  Zap,
  CheckCircle2,
  Building2,
  Home,
  Mail,
  MapPin,
  Star,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CRMChainsSeo } from "@/components/CRMChainsSeo";
import { SiteLayout } from "@/components/SiteLayout";
import {
  CRMCHAINS_ADDRESS_DISPLAY,
  CRMCHAINS_EMAIL,
  CRMCHAINS_H1,
  CRMCHAINS_INTRO,
  CRMCHAINS_MAPS_URL,
  CRMCHAINS_PHONE,
  CRMCHAINS_PHONE_DISPLAY,
  crmchainsFaqs,
} from "@/lib/crmchains-seo";
import { CRMCHAINS_CALENDAR_URL, CRMCHAINS_SHOWCASE_URL } from "@/lib/crmchains-constants";
import "@/styles/crmchains-pricing.css";

const VIDEO_SRC =
  "https://assets.cdn.filesafe.space/dwjn9ZCDakbpyKtXQ55s/media/68fbbf175947eb0892bd9fa6.mp4";

const agents = [
  {
    name: "Morgi",
    industry: "Mortgage",
    image:
      "https://assets.cdn.filesafe.space/dwjn9ZCDakbpyKtXQ55s/media/690289cee4eb0ba02af5e1cb.jpeg",
    phone: "+1 (520) 214-3204",
    tel: "+15202143204",
  },
  {
    name: "Fred",
    industry: "Insurance",
    image:
      "https://assets.cdn.filesafe.space/dwjn9ZCDakbpyKtXQ55s/media/690289cedf45432657c3ace1.jpeg",
    phone: "+1 (916) 776-5375",
    tel: "+19167765375",
  },
  {
    name: "Elle",
    industry: "AI Receptionist",
    image:
      "https://assets.cdn.filesafe.space/dwjn9ZCDakbpyKtXQ55s/media/690289cf9629bf7fa20dcc7a.jpeg",
    phone: "+1 (323) 543-7110",
    tel: "+13235437110",
  },
];

const services = [
  {
    icon: <Shield className="h-6 w-6" />,
    title: "CRM Infrastructure",
    description:
      "Purpose-built CRM systems designed for agency workflows — manage agents, clients, pipelines, and compliance in one unified platform.",
  },
  {
    icon: <Phone className="h-6 w-6" />,
    title: "Bilingual Human Virtual Assistants",
    description:
      "Real human VAs — not AI — handling calling campaigns at 100+ calls/hour with daily performance reports. Technical and administrative support included.",
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Service Agents",
    description:
      "When issues arise with your system or users, our dedicated service team resolves them — so your agents stay focused on selling.",
  },
  {
    icon: <Globe className="h-6 w-6" />,
    title: "Branded Website Ecosystem",
    description:
      "Seamless website design connected to your CRM. When your agency onboards a new agent, we auto-generate a branded landing page, digital business card, QR code, and personalized URL — all matching your agency branding.",
  },
  {
    icon: <Bot className="h-6 w-6" />,
    title: "AI Agents",
    description:
      "AI-powered agents for training, automation, onboarding, inbound/outbound calling, and SMS — working 24/7 alongside your team.",
  },
  {
    icon: <Calculator className="h-6 w-6" />,
    title: "Calculators & Pre-Qualification",
    description:
      "Quick-intake calculators so prospective agents and clients arrive pre-qualified — reducing training burden and expediting engagement.",
  },
];

const verticals = [
  { name: "Insurance Agencies", icon: <Shield className="h-5 w-5" /> },
  { name: "Real Estate Teams", icon: <Building2 className="h-5 w-5" /> },
  { name: "Mortgage", icon: <Home className="h-5 w-5" /> },
];

const howItWorksSteps = [
  {
    step: "1",
    title: "Kickoff & CRM access",
    description:
      "For insurance, real estate, and mortgage — your CRM workspace is provisioned right after payment. We map workflows and branding on your kickoff call.",
    timing: "Day 1",
  },
  {
    step: "2",
    title: "Automations & branded assets",
    description:
      "Pipelines, follow-up, speed-to-lead, and agent-branded sites are configured for your vertical.",
    timing: "Days 1–3",
  },
  {
    step: "3",
    title: "AI agents + human VAs live",
    description:
      "AI calling workflows and bilingual human VAs join your team. Existing industries are typically live within a few days.",
    timing: "Days 3–5",
  },
];

const testimonials = [
  {
    quote:
      "CRMChains replaced five tools we were duct-taping together. Our agents onboard faster and follow-up actually happens.",
    author: "Agency Principal",
    vertical: "Insurance",
  },
  {
    quote:
      "The bilingual VAs and AI agents let us scale outreach without scaling payroll the same way.",
    author: "Operations Director",
    vertical: "Real Estate",
  },
  {
    quote:
      "We went from scattered spreadsheets to one CRM with branded sites for every loan officer.",
    author: "Branch Manager",
    vertical: "Mortgage",
  },
];

function yearlySavings(monthly: number, yearly: number) {
  return monthly * 12 - yearly;
}

const painPoints = [
  "Agents stuck using 5+ disconnected tools",
  "No system to pre-qualify leads before they reach your team",
  "Onboarding new agents takes weeks instead of days",
  "You can't scale without adding overhead",
  "Your website doesn't connect to your CRM or pipeline",
  "Follow-up falls through the cracks",
];

type BillingPeriod = "monthly" | "yearly";

const pricingPlans = [
  {
    id: "basic",
    name: "AI Basic Suite",
    description: "Core CRM, automations, and follow-up systems to keep your pipeline moving.",
    monthlyPrice: 97,
    yearlyPrice: 970,
    monthlyUrl: "https://crmchains.com/ai-basic-suite-97",
    yearlyUrl: "https://crmchains.com/ai-basic-suite-970",
    features: [
      "CRM & pipeline management",
      "Automated email & SMS follow-up",
      "Contact & lead management",
      "Workflow automations",
      "Speed-to-lead systems",
    ],
  },
  {
    id: "pro",
    name: "AI Pro Suite",
    description: "Full communication infrastructure with AI agents and advanced outreach.",
    monthlyPrice: 197,
    yearlyPrice: 1970,
    monthlyUrl: "https://crmchains.com/ai-pro-suite-197",
    yearlyUrl: "https://crmchains.com/ai-pro-suite-1970",
    featured: true,
    features: [
      "Everything in AI Basic Suite",
      "AI calling agents (inbound & outbound)",
      "Automated visitor follow-up",
      "Branded website & funnel ecosystem",
      "Broadcast messaging & campaigns",
      "Member / team database (CRM)",
      "Priority support",
    ],
  },
];

const CRMChains = () => {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("monthly");

  return (
    <SiteLayout>
      <CRMChainsSeo />
      <article>
        {/* Video */}
        <section className="video-section w-full bg-muted/40 py-10 md:py-14">
          <div className="container max-w-6xl px-4">
            <video
              controls
              className="w-full max-w-4xl mx-auto block rounded-xl shadow-lg border border-border"
              playsInline
              preload="metadata"
            >
              <source src={VIDEO_SRC} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </section>

        {/* Hero */}
        <section className="gradient-hero text-primary-foreground">
          <div className="container max-w-6xl py-16 md:py-24 px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-sm font-medium">
                  <Zap className="h-4 w-4" />
                  Built for Insurance, Real Estate & Mortgage Agencies
                </div>

                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.15]">
                  {CRMCHAINS_H1}
                </h1>

                <p className="text-lg text-primary-foreground/85 max-w-lg">{CRMCHAINS_INTRO}</p>

                <h2 className="text-2xl md:text-3xl font-bold tracking-tight leading-[1.1] text-coral-light">
                  Stop Losing Agents to
                  <span className="block text-coral mt-1">Broken Systems</span>
                </h2>

                <p className="text-base md:text-lg text-primary-foreground/80 max-w-lg">
                  CRMChains gives your agency the CRM, AI agents, bilingual human VAs, and automated
                  websites your team needs — so every new agent is productive from day one.
                </p>

                <div className="flex flex-wrap gap-4">
                  <Button
                    size="lg"
                    className="bg-coral hover:bg-coral/90 text-primary-foreground"
                    asChild
                  >
                    <a
                      href={CRMCHAINS_CALENDAR_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Book a Strategy Call <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-coral/50 text-coral-light hover:bg-coral/10"
                    asChild
                  >
                    <a href="#how-it-works">See How It Works</a>
                  </Button>
                </div>

                <div className="flex flex-wrap items-center gap-4 md:gap-6 pt-2">
                  {verticals.map((v) => (
                    <div
                      key={v.name}
                      className="flex items-center gap-2 text-sm text-primary-foreground/70"
                    >
                      {v.icon}
                      <span>{v.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-primary-foreground/5 border border-primary-foreground/10 rounded-2xl p-8 space-y-5 backdrop-blur-sm">
                <h3 className="text-lg font-semibold text-primary-foreground/90">Sound familiar?</h3>
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

        {/* How it works */}
        <section id="how-it-works" className="py-16 md:py-20 bg-background">
          <div className="container max-w-6xl px-4">
            <div className="text-center mb-12 space-y-3">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">How It Works</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                CRM access right after payment for existing industries — full stack in days, not weeks.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {howItWorksSteps.map((item) => (
                <div
                  key={item.step}
                  className="rounded-xl border border-border bg-card p-6 shadow-sm text-center md:text-left"
                >
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold text-lg mb-4">
                    {item.step}
                  </span>
                  <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">
                    {item.timing}
                  </p>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground text-center max-w-2xl mx-auto mt-8">
              Need SMS at scale?{" "}
              <span className="text-foreground font-medium">A2P registration</span> is usually the
              longest step and runs in parallel. New or custom industries may take up to two weeks
              for tailored workflows.
            </p>
          </div>
        </section>

        {/* AI Calling Agents */}
        <section id="agents" className="agents-section py-16 md:py-20 bg-muted/30">
          <div className="container max-w-6xl px-4">
            <div className="text-center mb-12 space-y-3">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Meet Sample AI Calling Agents
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Examples of industry-specialized agents we deploy — your agency gets custom agents
                tailored to your vertical and scripts.
              </p>
            </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {agents.map((agent) => (
              <div
                key={agent.name}
                className="agent-card text-center border border-border rounded-xl p-8 bg-card shadow-sm hover:shadow-md transition-shadow"
              >
                <img
                  src={agent.image}
                  alt={agent.name}
                  className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-2 border-primary/20"
                />
                <h3 className="text-xl font-semibold text-foreground">{agent.name}</h3>
                <p className="text-muted-foreground mt-1">{agent.industry}</p>
                <a
                  href={`tel:${agent.tel}`}
                  className="inline-flex items-center justify-center gap-2 mt-4 font-semibold text-primary hover:underline"
                >
                  <PhoneCall className="h-4 w-4" />
                  {agent.phone}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

        {/* Brand Promise */}
        <section className="py-16 bg-muted/50">
          <div className="container max-w-4xl text-center space-y-6 px-4">
            <p className="text-2xl md:text-3xl font-semibold text-foreground leading-relaxed">
              "A defined brand promise attracts your ideal client.
              <br />
              <span className="text-primary">
                CRMChains nurtures them into solutions orchestrated by your team."
              </span>
            </p>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              Secure, agency-grade infrastructure · Bilingual support (EN/ES) · Serving the US,
              Colombia & Mexico
            </p>
          </div>
        </section>

      {/* Services */}
      <section id="services" className="py-20">
        <div className="container max-w-6xl px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              One Ecosystem. Everything Your Agency Needs.
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              From CRM to AI agents to branded websites — we replace your patchwork of tools with a
              single platform designed for the agency model.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Card
                key={service.title}
                className="group hover:shadow-lg transition-all duration-300 border-border hover:border-primary/30"
              >
                <CardContent className="p-6 space-y-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    {service.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{service.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ICP */}
      <section className="py-20 gradient-hero text-primary-foreground">
        <div className="container max-w-5xl px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">Built for Agencies That Scale Agents</h2>
              <p className="text-primary-foreground/80 text-lg leading-relaxed">
                Whether you run an insurance agency, real estate brokerage, or mortgage team, your
                challenge is the same: onboard agents fast, give them the right tools, and keep the
                pipeline moving.
              </p>
              <p className="text-primary-foreground/80 text-lg leading-relaxed">
                CRMChains was born from serving insurance agencies — then we saw the same pain in real
                estate and mortgage. The agency model is universal. Our platform adapts the copy,
                branding, and workflows for your vertical.
              </p>
            </div>

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
        </section>

        {/* Social proof */}
        <section id="clients" className="py-16 md:py-20 bg-background">
          <div className="container max-w-6xl px-4">
            <div className="text-center mb-10 space-y-3">
              <div className="inline-flex items-center gap-1 text-primary">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
                <span className="ml-2 text-sm font-semibold text-foreground">4.9 · 27 partners</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Trusted by Growing Agencies
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                See full client work and vertical-specific builds on our showcase.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-10">
              {testimonials.map((t) => (
                <blockquote
                  key={t.author}
                  className="rounded-xl border border-border bg-card p-6 shadow-sm"
                >
                  <p className="text-foreground text-sm leading-relaxed italic">"{t.quote}"</p>
                  <footer className="mt-4 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">{t.author}</span>
                    <span className="text-primary"> · {t.vertical}</span>
                  </footer>
                </blockquote>
              ))}
            </div>

            <div className="text-center">
              <Button size="lg" variant="outline" asChild>
                <a href={CRMCHAINS_SHOWCASE_URL} target="_blank" rel="noopener noreferrer">
                  View Client Showcase
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section
          id="pricing"
          className="crmchains-pricing py-16 md:py-24 bg-muted/30"
          data-billing={billingPeriod}
        >
        <div className="container max-w-6xl px-4">
          <div className="text-center mb-10 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Choose Your Suite</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Flexible plans for agencies ready to automate outreach and grow their pipeline.
            </p>

            <div
              className="pricing-billing-toggle inline-flex items-center rounded-full border border-border bg-background p-1 shadow-sm"
              role="group"
              aria-label="Billing period"
            >
              <button
                type="button"
                className={`pricing-toggle-btn px-6 py-2 rounded-full text-sm font-semibold transition-colors ${
                  billingPeriod === "monthly"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                aria-pressed={billingPeriod === "monthly"}
                onClick={() => setBillingPeriod("monthly")}
              >
                Monthly
              </button>
              <button
                type="button"
                className={`pricing-toggle-btn px-6 py-2 rounded-full text-sm font-semibold transition-colors ${
                  billingPeriod === "yearly"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                aria-pressed={billingPeriod === "yearly"}
                onClick={() => setBillingPeriod("yearly")}
              >
                Yearly
              </button>
            </div>
            {billingPeriod === "yearly" && (
              <p className="text-sm text-primary font-medium">
                Save up to $394/yr on AI Pro with annual billing
              </p>
            )}
          </div>

          <div className="pricing-grid grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {pricingPlans.map((plan) => {
              const price = billingPeriod === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
              const periodLabel = billingPeriod === "monthly" ? "/mo" : "/yr";
              const checkoutUrl = billingPeriod === "monthly" ? plan.monthlyUrl : plan.yearlyUrl;
              const savings = yearlySavings(plan.monthlyPrice, plan.yearlyPrice);
              const ctaHref = plan.featured ? CRMCHAINS_CALENDAR_URL : checkoutUrl;
              const ctaLabel = plan.featured ? "Book a Strategy Call" : "Get Started";

              return (
                <div
                  key={plan.id}
                  className={`pricing-card rounded-2xl border bg-card p-8 shadow-md ${
                    plan.featured
                      ? "border-primary ring-2 ring-primary/20 relative"
                      : "border-border"
                  }`}
                >
                  {plan.featured && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-coral text-primary-foreground text-xs font-bold px-4 py-1 rounded-full">
                      RECOMMENDED
                    </span>
                  )}
                  <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
                  <p className="text-muted-foreground text-sm mt-2">{plan.description}</p>
                  <div className="pricing-amount mt-6 mb-2">
                    <span className="text-4xl font-bold text-foreground">${price}</span>
                    <span className="text-muted-foreground ml-1">{periodLabel}</span>
                  </div>
                  {billingPeriod === "yearly" && (
                    <p className="text-sm text-primary font-medium mb-4">
                      Save ${savings}/year vs monthly
                    </p>
                  )}
                  {billingPeriod === "monthly" && <div className="mb-4" />}
                  <ul className="pricing-features space-y-3 text-sm text-foreground/90">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <span className="text-primary mt-0.5">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href={ctaHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pricing-cta"
                  >
                    {ctaLabel}
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </section>

        {/* Contact */}
        <section id="contact" className="py-16 md:py-20 bg-background border-t border-border">
          <div className="container max-w-3xl px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Contact CRMChains</h2>
            <p className="text-muted-foreground mb-8">
              Visit us, call, or email — we serve agencies across the US, Colombia, and Mexico.
            </p>
            <address className="not-italic inline-flex flex-col gap-4 text-left mx-auto text-foreground">
              <a
                href={CRMCHAINS_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 hover:text-primary transition-colors"
              >
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" aria-hidden />
                <span>{CRMCHAINS_ADDRESS_DISPLAY}</span>
              </a>
              <a
                href={`tel:${CRMCHAINS_PHONE}`}
                className="flex items-center gap-3 hover:text-primary transition-colors"
              >
                <PhoneCall className="h-5 w-5 text-primary shrink-0" aria-hidden />
                <span>{CRMCHAINS_PHONE_DISPLAY}</span>
              </a>
              <a
                href={`mailto:${CRMCHAINS_EMAIL}`}
                className="flex items-center gap-3 hover:text-primary transition-colors"
              >
                <Mail className="h-5 w-5 text-primary shrink-0" aria-hidden />
                <span>{CRMCHAINS_EMAIL}</span>
              </a>
            </address>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-16 md:py-20 bg-muted/30">
          <div className="container max-w-3xl px-4">
            <div className="text-center mb-10 space-y-3">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">Frequently Asked Questions</h2>
              <p className="text-muted-foreground">
                Quick answers for agencies evaluating CRMChains.
              </p>
            </div>
            <dl className="space-y-6">
              {crmchainsFaqs.map((faq) => (
                <div
                  key={faq.question}
                  className="rounded-xl border border-border bg-card p-6 shadow-sm"
                >
                  <dt className="text-lg font-semibold text-foreground">{faq.question}</dt>
                  <dd className="mt-2 text-muted-foreground leading-relaxed">{faq.answer}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20">
          <div className="container max-w-3xl text-center space-y-8 px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Ready to Give Your Agency an Unfair Advantage?
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Book a 30-minute strategy call. We'll show you exactly how CRMChains replaces your
              disconnected tools with one system built for growth.
            </p>
            <Button
              size="lg"
              className="bg-coral hover:bg-coral/90 text-primary-foreground px-10 py-6 text-lg"
              asChild
            >
              <a href={CRMCHAINS_CALENDAR_URL} target="_blank" rel="noopener noreferrer">
                Book Your Strategy Call <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
          </div>
        </section>
      </article>
    </SiteLayout>
  );
};

export default CRMChains;
