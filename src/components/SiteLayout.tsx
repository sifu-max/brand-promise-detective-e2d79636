import type { ReactNode } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import crmchainsLogo from "@/assets/crmchains-logo.jpg";
import {
  CRMCHAINS_ADDRESS_DISPLAY,
  CRMCHAINS_EMAIL,
  CRMCHAINS_PHONE,
  CRMCHAINS_PHONE_DISPLAY,
} from "@/lib/crmchains-seo";

interface SiteLayoutProps {
  children: ReactNode;
}

export function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border py-12 mt-auto" role="contentinfo">
        <div className="container max-w-6xl px-4">
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

            <address className="not-italic text-sm text-muted-foreground space-y-2 max-w-md">
              <div className="flex items-start justify-center gap-2">
                <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" aria-hidden />
                <span className="text-left">{CRMCHAINS_ADDRESS_DISPLAY}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Phone className="h-4 w-4 text-primary shrink-0" aria-hidden />
                <a href={`tel:${CRMCHAINS_PHONE}`} className="hover:text-primary transition-colors">
                  {CRMCHAINS_PHONE_DISPLAY}
                </a>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Mail className="h-4 w-4 text-primary shrink-0" aria-hidden />
                <a
                  href={`mailto:${CRMCHAINS_EMAIL}`}
                  className="hover:text-primary transition-colors"
                >
                  {CRMCHAINS_EMAIL}
                </a>
              </div>
            </address>

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
