import type { ReactNode } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import crmchainsLogo from "@/assets/crmchains-logo.jpg";

interface SiteLayoutProps {
  children: ReactNode;
}

export function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border py-12 mt-auto" role="contentinfo">
        <div className="container max-w-6xl">
          <div className="flex flex-col items-center gap-6 text-center">
            <a
              href="https://crmchains.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-80"
            >
              <img src={crmchainsLogo} alt="CRMChains Logo" className="h-16 w-auto" />
            </a>
            <p className="text-base text-muted-foreground max-w-xl leading-relaxed">
              "A defined brand promise attracts your ideal client. CRMChains nurtures them into
              solutions orchestrated by your team."
            </p>
            <a
              href="https://crmchains.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-primary hover:underline"
            >
              www.crmchains.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
