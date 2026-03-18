import { Check, X, ArrowRight, Phone, Mail, Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import crmchainsLogo from "@/assets/crmchains-logo.jpg";

export default function ClearFaithProposal() {
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
            Digital Presence &amp; Outreach Proposal
          </h1>
          <Separator className="max-w-xs mx-auto" />
          <div className="text-sm text-muted-foreground space-y-1">
            <p><span className="font-medium text-foreground">Prepared for:</span> Clear Faith Christian Ministries</p>
            <p><span className="font-medium text-foreground">Project:</span> Transition to <span className="font-mono text-primary">clearfaith.org</span> (Official Domain)</p>
          </div>
        </div>

        {/* Strategic Goal */}
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary mb-2">Strategic Goal</p>
            <p className="text-foreground leading-relaxed">
              To move from a digital placeholder to a high-performance <strong>"Digital Outreach"</strong> engine that welcomes seekers and automates ministry growth.
            </p>
          </CardContent>
        </Card>

        {/* Section I */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <span className="text-primary font-mono text-base">I.</span> The Strategy: A Modern "Digital Front Door"
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            We have already developed a modern prototype for Clear Faith. The final phase is to move this into a fully managed, secure environment. To support your mission, we are offering two distinct paths to launch:
          </p>

          <div className="grid md:grid-cols-2 gap-6 mt-6">
            {/* Option A */}
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">
                  <span className="text-primary font-mono text-sm mr-2">A</span>
                  The Foundation
                </CardTitle>
                <p className="text-xs text-muted-foreground">Website Only</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">A professional, mobile-responsive home for the ministry.</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2"><Check className="w-4 h-4 text-primary mt-0.5 shrink-0" /> <span><strong>Custom Web Build:</strong> Professional layout, "About Us," and Ministry sections.</span></li>
                  <li className="flex items-start gap-2"><Check className="w-4 h-4 text-primary mt-0.5 shrink-0" /> <span><strong>Giving Integration:</strong> Secure portal for tithes and offerings.</span></li>
                </ul>
                <Separator />
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Setup Fee</span>
                    <span className="font-bold text-foreground text-lg">$499</span>
                  </div>
                  <p className="text-xs text-muted-foreground text-right">One-Time Partnership Rate</p>
                  <div className="flex justify-between text-sm pt-2">
                    <span className="text-muted-foreground">Maintenance</span>
                    <span className="font-semibold text-foreground">$25/mo</span>
                  </div>
                  <p className="text-xs text-muted-foreground text-right">Hosting, Security &amp; SSL</p>
                </div>
              </CardContent>
            </Card>

            {/* Option B */}
            <Card className="border-primary ring-2 ring-primary/20 relative">
              <div className="absolute -top-3 right-4 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                RECOMMENDED
              </div>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">
                  <span className="text-primary font-mono text-sm mr-2">B</span>
                  The Growth Engine
                </CardTitle>
                <p className="text-xs text-muted-foreground">AI Pro Suite</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">Transforms the website from a brochure into an active outreach tool.</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2"><Check className="w-4 h-4 text-primary mt-0.5 shrink-0" /> <span><strong>Custom Web Build:</strong> <span className="text-primary font-semibold">FREE</span> (Included in Suite)</span></li>
                  <li className="flex items-start gap-2"><Check className="w-4 h-4 text-primary mt-0.5 shrink-0" /> <span><strong>Automated Visitor Follow-up:</strong> Instant text/email welcome for new guests.</span></li>
                  <li className="flex items-start gap-2"><Check className="w-4 h-4 text-primary mt-0.5 shrink-0" /> <span><strong>Member Database (CRM):</strong> Tracking growth &amp; volunteer team management.</span></li>
                  <li className="flex items-start gap-2"><Check className="w-4 h-4 text-primary mt-0.5 shrink-0" /> <span><strong>Broadcast Messaging:</strong> Rapid church-wide alerts for events or updates.</span></li>
                </ul>
                <Separator />
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Website Setup</span>
                    <span className="font-bold text-primary text-lg">$0</span>
                  </div>
                  <p className="text-xs text-muted-foreground text-right">Waived with suite</p>
                  <div className="flex justify-between text-sm pt-2">
                    <span className="text-muted-foreground">Monthly</span>
                    <span className="font-bold text-foreground text-lg">$197/mo</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Section II – Comparison */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <span className="text-primary font-mono text-base">II.</span> Partnership Comparison
          </h2>

          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted">
                  <th className="text-left p-3 font-semibold text-foreground">Feature</th>
                  <th className="text-center p-3 font-semibold text-foreground">Option A: Website Only</th>
                  <th className="text-center p-3 font-semibold text-primary">Option B: AI Pro Suite</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="p-3 text-foreground font-medium">Website Setup Fee</td>
                  <td className="p-3 text-center text-foreground">$499</td>
                  <td className="p-3 text-center font-bold text-primary">$0 (Waived)</td>
                </tr>
                <tr className="bg-muted/30">
                  <td className="p-3 text-foreground font-medium">Outreach Automation</td>
                  <td className="p-3 text-center"><X className="w-4 h-4 text-destructive mx-auto" /></td>
                  <td className="p-3 text-center"><Check className="w-4 h-4 text-primary mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-3 text-foreground font-medium">Visitor Tracking</td>
                  <td className="p-3 text-center"><X className="w-4 h-4 text-destructive mx-auto" /></td>
                  <td className="p-3 text-center"><Check className="w-4 h-4 text-primary mx-auto" /></td>
                </tr>
                <tr className="bg-muted/30">
                  <td className="p-3 text-foreground font-medium">Monthly Support</td>
                  <td className="p-3 text-center text-foreground">$25</td>
                  <td className="p-3 text-center text-foreground">$197</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section III – CTA */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <span className="text-primary font-mono text-base">III.</span> Call to Action (Next Steps)
          </h2>

          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-6">
              <p className="text-foreground leading-relaxed italic">
                "Pastor, we want to give Clear Faith the best tools possible to reach the community. Whether we start with the Foundation or the full Growth Engine, we are ready to move your prototype to the official domain immediately."
              </p>
            </CardContent>
          </Card>

          <div className="space-y-4 mt-6">
            <p className="font-semibold text-foreground">To move forward:</p>
            <div className="space-y-4">
              <div className="flex gap-4">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold shrink-0">1</span>
                <div>
                  <p className="font-semibold text-foreground">Select Your Path</p>
                  <p className="text-sm text-muted-foreground">Confirm if you'd like the $499 Foundation or the $197 Growth Engine.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold shrink-0">2</span>
                <div>
                  <p className="font-semibold text-foreground">Content Review</p>
                  <p className="text-sm text-muted-foreground">A final 30-minute walkthrough of the prototype to ensure all service times and mission statements are exact.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold shrink-0">3</span>
                <div>
                  <p className="font-semibold text-foreground">Official Launch</p>
                  <p className="text-sm text-muted-foreground">We secure your domain and go live within 7 business days.</p>
                </div>
              </div>
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
