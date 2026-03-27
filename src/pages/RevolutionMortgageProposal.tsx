import { Check, ArrowRight, Phone, Mail, Globe, Clock, Users, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import crmchainsLogo from "@/assets/crmchains-logo.jpg";

export default function RevolutionMortgageProposal() {
  const phases = [
    {
      number: 1,
      title: "Lead Capture + Leasing Engine",
      subtitle: "Stop the lead leakage now",
      icon: <Zap className="w-5 h-5" />,
      description:
        "Her biggest pain is that leads are coming in from multiple sources, Zillow is messy, and they are missing leases despite high inquiry volume. This is the first operational bottleneck.",
      features: [
        "Zillow / Rent.com / email lead intake",
        "Central inbox",
        "Call + text capture",
        "Facebook / Instagram lead capture",
        "Rental pipeline stages",
        "Aggressive follow-up system",
        "Incentive / price-drop re-engagement",
        "Application-first leasing flow",
        "Dashboard for lead response & conversion tracking",
      ],
      hours: "28–40",
    },
    {
      number: 2,
      title: "Rental Operations + Vacancy Prevention",
      subtitle: "Systemize property operations",
      icon: <Users className="w-5 h-5" />,
      description:
        "Repeatable move-in and move-out systems, handyman walk-throughs, scope-of-work creation, same-day turnover coordination, and immediate relisting. Operational workflow work that starts once lead flow is under control.",
      features: [
        "Move-in checklist system",
        "Move-out checklist system",
        "60-day pre-move-out marketing process",
        "30-day handyman walkthrough process",
        "Repair / cleaning / photo / relist workflow",
        "Zero-vacancy turnover process",
        "VA task ownership & recurring checklist structure",
      ],
      hours: "14–22",
    },
    {
      number: 3,
      title: "Short-Term Rental + Guest Reactivation",
      subtitle: "Growth & retention engine",
      icon: <Clock className="w-5 h-5" />,
      description:
        "Every STR inquiry in the CRM, up to 3 follow-ups per day until booked, plus a past-guest/VIG system and campaigns designed to shift toward more direct bookings.",
      features: [
        "Hostfully via Zapier lead sync",
        "Short-term rental inquiry capture",
        "STR follow-up workflows",
        "Past guest tagging",
        "VIG segmentation",
        "Repeat guest offers",
        "Direct booking nurture campaigns",
        "Campaign logic around 5-star guests & special offers",
      ],
      hours: "12–20",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* CRMChains Letterhead */}
      <header className="bg-[hsl(260,30%,15%)] text-white">
        <div className="container max-w-4xl py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={crmchainsLogo} alt="CRMChains" className="h-14 w-auto rounded-lg" />
            <div>
              <h2 className="text-xl font-bold tracking-tight">CRMChains</h2>
              <p className="text-sm text-white/70">CRM Infrastructure & Digital Growth</p>
            </div>
          </div>
          <div className="hidden sm:flex flex-col items-end text-xs text-white/60 gap-0.5">
            <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> www.crmchains.com</span>
            <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> info@crmchains.com</span>
          </div>
        </div>
        <div className="h-1 bg-gradient-to-r from-[hsl(var(--coral))] via-[hsl(var(--primary))] to-[hsl(var(--coral))]" />
      </header>

      <main className="container max-w-4xl py-10 px-4 space-y-10">
        {/* Title Block */}
        <div className="text-center space-y-3">
          <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Proposal</p>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
            CRM Build-Out &amp; Automation Proposal
          </h1>
          <Separator className="max-w-xs mx-auto" />
          <div className="text-sm text-muted-foreground space-y-1">
            <p><span className="font-medium text-foreground">Prepared for:</span> Zandra Jones — Revolution Mortgage</p>
            <p><span className="font-medium text-foreground">Project:</span> Lead Capture, Rental Operations &amp; STR Growth Engine</p>
          </div>
        </div>

        {/* Strategic Goal */}
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary mb-2">Strategic Goal</p>
            <p className="text-foreground leading-relaxed">
              To build a <strong>3-phase CRM infrastructure</strong> that stops lead leakage, systemizes rental operations for zero-vacancy turnovers, and creates a guest reactivation engine for short-term rental growth — all managed through a single command center.
            </p>
          </CardContent>
        </Card>

        {/* Phased Build-Out */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <span className="text-primary font-mono text-base">I.</span> Phased Build-Out
          </h2>

          {phases.map((phase) => (
            <Card key={phase.number} className={`border-border ${phase.number === 1 ? "ring-2 ring-primary/20 border-primary" : ""}`}>
              {phase.number === 1 && (
                <div className="bg-primary text-primary-foreground text-xs font-bold px-4 py-1.5 rounded-t-lg text-center uppercase tracking-wide">
                  Priority — Start Here
                </div>
              )}
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-3">
                  <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 text-primary">
                    {phase.icon}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-primary font-mono text-sm">Phase {phase.number}</span>
                      <span className="text-foreground">{phase.title}</span>
                    </div>
                    <p className="text-xs text-muted-foreground font-normal mt-0.5">{phase.subtitle}</p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">{phase.description}</p>
                <ul className="grid sm:grid-cols-2 gap-2 text-sm">
                  {phase.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Estimated Hours</span>
                  <span className="font-bold text-foreground text-lg">{phase.hours} hrs</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Summary Table */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <span className="text-primary font-mono text-base">II.</span> Investment Summary
          </h2>

          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted">
                  <th className="text-left p-3 font-semibold text-foreground">Phase</th>
                  <th className="text-center p-3 font-semibold text-foreground">Scope</th>
                  <th className="text-center p-3 font-semibold text-foreground">Est. Hours</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="p-3 text-foreground font-medium">Phase 1: Lead Capture + Leasing</td>
                  <td className="p-3 text-center text-muted-foreground">9 deliverables</td>
                  <td className="p-3 text-center font-semibold text-foreground">28–40</td>
                </tr>
                <tr className="bg-muted/30">
                  <td className="p-3 text-foreground font-medium">Phase 2: Rental Operations</td>
                  <td className="p-3 text-center text-muted-foreground">7 deliverables</td>
                  <td className="p-3 text-center font-semibold text-foreground">14–22</td>
                </tr>
                <tr>
                  <td className="p-3 text-foreground font-medium">Phase 3: STR + Guest Reactivation</td>
                  <td className="p-3 text-center text-muted-foreground">8 deliverables</td>
                  <td className="p-3 text-center font-semibold text-foreground">12–20</td>
                </tr>
                <tr className="bg-primary/5 font-bold">
                  <td className="p-3 text-foreground">Total</td>
                  <td className="p-3 text-center text-muted-foreground">24 deliverables</td>
                  <td className="p-3 text-center text-primary text-lg">54–82 hrs</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Pricing */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <span className="text-primary font-mono text-base">III.</span> Your Investment
          </h2>

          <Card className="border-primary ring-2 ring-primary/20 overflow-hidden">
            <div className="bg-primary text-primary-foreground text-center py-3 px-4">
              <p className="text-xs font-bold uppercase tracking-widest mb-1">CRMChains Unlimited Plan</p>
              <p className="text-sm opacity-80">Boundless Features, Limitless Potential</p>
            </div>
            <CardContent className="p-6 space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-center">
                <div>
                  <p className="text-4xl font-bold text-foreground">$297<span className="text-lg font-normal text-muted-foreground">/mo</span></p>
                  <p className="text-xs text-muted-foreground mt-1">Monthly Platform Fee</p>
                </div>
                <span className="text-2xl text-muted-foreground font-light">+</span>
                <div>
                  <p className="text-4xl font-bold text-foreground">$997</p>
                  <p className="text-xs text-muted-foreground mt-1">One-Time Setup Fee</p>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-sm font-semibold text-foreground mb-3">Everything Included:</p>
                <ul className="grid sm:grid-cols-2 gap-2 text-sm">
                  {[
                    "API Access — Integrate With Anything",
                    "Unlimited Sub-Accounts",
                    "Branded Desktop App & Custom Domains",
                    "SaaS Mode — Auto Sub-Account Creation",
                    "Rebilling Enabled With Custom Markup",
                    "Rebilling Available on Conversation AI",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <span className="text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-muted/50 rounded-lg p-4 text-center">
                <p className="text-xs text-muted-foreground">
                  All features provided via <span className="font-semibold text-foreground">CRMChains</span> integration
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CTA */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <span className="text-primary font-mono text-base">III.</span> Next Steps
          </h2>

          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-6">
              <p className="text-foreground leading-relaxed italic">
                "Zandra, we've mapped every item from your wishlist into a phased rollout designed to stop the bleeding first, then build the operational backbone, and finally unlock the STR growth channel. We're ready to start Phase 1 immediately."
              </p>
            </CardContent>
          </Card>

          <div className="space-y-4 mt-6">
            <p className="font-semibold text-foreground">To move forward:</p>
            <div className="space-y-4">
              {[
                { step: 1, title: "Approve Phase 1 Scope", desc: "Confirm the 28–40 hr lead capture build-out to begin immediately." },
                { step: 2, title: "Kickoff Call", desc: "A 45-minute session to map your Zillow, Rent.com, and social ad accounts into the central intake." },
                { step: 3, title: "Phase 1 Delivery", desc: "Full lead capture engine live within 2–3 weeks of kickoff." },
              ].map((item) => (
                <div key={item.step} className="flex gap-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold shrink-0">
                    {item.step}
                  </span>
                  <div>
                    <p className="font-semibold text-foreground">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button size="lg" className="gap-2" asChild>
              <a href="https://crmchains.com/calendar" target="_blank" rel="noopener noreferrer">
                Book a Call <ArrowRight className="w-4 h-4" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="mailto:info@crmchains.com">
                <Mail className="w-4 h-4 mr-2" /> Email Us
              </a>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[hsl(260,30%,15%)] text-white/60 mt-10">
        <div className="h-1 bg-gradient-to-r from-[hsl(var(--coral))] via-[hsl(var(--primary))] to-[hsl(var(--coral))]" />
        <div className="container max-w-4xl py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
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
