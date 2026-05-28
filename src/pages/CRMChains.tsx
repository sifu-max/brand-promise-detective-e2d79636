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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CRMChainsSeo } from "@/components/CRMChainsSeo";
import { SiteLayout } from "@/components/SiteLayout";
import { CRMCHAINS_H1, CRMCHAINS_INTRO, crmchainsFaqs } from "@/lib/crmchains-seo";
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
    title: "Bilingual Virtual Assistants",
    description:
      "Dedicated VAs handling calling campaigns at 100+ calls/hour with daily performance reports. Technical and administrative support included.",
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
];

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
        <section className="border-b border-border bg-background py-8 md:py-10">
          <div className="container max-w-6xl px-4 text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
              {CRMCHAINS_H1}
            </h1>
            <p className="mt-3 text-lg text-muted-foreground max-w-3xl">{CRMCHAINS_INTRO}</p>
          </div>
        </section>

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
        <div className="container max-w-6xl py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-sm font-medium">
                <Zap className="h-4 w-4" />
                Built for Insurance & Real Estate Agencies
              </div>

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
                Stop Losing Agents to
                <span className="block text-coral mt-2">Broken Systems</span>
              </h2>

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
                <Button
                  size="lg"
                  variant="outline"
                  className="border-coral/50 text-coral-light hover:bg-coral/10"
                  asChild
                >
                  <a href="#services">See How It Works</a>
                </Button>
              </div>

              <div className="flex items-center gap-6 pt-2">
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

      {/* AI Calling Agents */}
      <section id="agents" className="agents-section py-16 md:py-20 bg-background">
        <div className="container max-w-6xl px-4">
          <div className="text-center mb-12 space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Meet Some Sample AI Calling Agents
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Industry-specialized agents ready to handle inbound and outbound calls for your team.
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
        <div className="container max-w-4xl text-center space-y-4 px-4">
          <p className="text-2xl md:text-3xl font-semibold text-foreground leading-relaxed">
            "A defined brand promise attracts your ideal client.
            <br />
            <span className="text-primary">
              CRMChains nurtures them into solutions orchestrated by your team."
            </span>
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
                Whether you run an insurance agency or a real estate brokerage, your challenge is the
                same: onboard agents fast, give them the right tools, and keep the pipeline moving.
              </p>
              <p className="text-primary-foreground/80 text-lg leading-relaxed">
                CRMChains was born from serving insurance agencies — then we saw the same pain in real
                estate. The agency model is universal. Our platform adapts the copy, branding, and
                workflows for your vertical.
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
              <p className="text-sm text-primary font-medium">Save with annual billing</p>
            )}
          </div>

          <div className="pricing-grid grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {pricingPlans.map((plan) => {
              const price = billingPeriod === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
              const periodLabel = billingPeriod === "monthly" ? "/mo" : "/yr";
              const checkoutUrl = billingPeriod === "monthly" ? plan.monthlyUrl : plan.yearlyUrl;

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
                  <div className="pricing-amount mt-6 mb-6">
                    <span className="text-4xl font-bold text-foreground">${price}</span>
                    <span className="text-muted-foreground ml-1">{periodLabel}</span>
                  </div>
                  <ul className="pricing-features space-y-3 text-sm text-foreground/90">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <span className="text-primary mt-0.5">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href={checkoutUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pricing-cta"
                  >
                    Get Started
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </section>

        {/* FAQ */}
        <section id="faq" className="py-16 md:py-20 bg-background">
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
              <a href="https://crmchains.com/calendar" target="_blank" rel="noopener noreferrer">
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
