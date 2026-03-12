import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import crmchainsLogo from "@/assets/crmchains-logo.jpg";

const navLinks = [
  { label: "Home", href: "https://www.crmchains.com", external: true },
  { label: "About", href: "https://www.crmchains.com/about", external: true },
  { label: "Service", href: "https://www.crmchains.com/service", external: true },
  { label: "Contact", href: "https://www.crmchains.com/contact", external: true },
  { label: "Branding", href: "/brand-builder", external: false },
  { label: "Showcase", href: "https://www.crmchains.com/showcase", external: true },
];

export function SiteHeader() {
  return (
    <nav className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container max-w-6xl flex items-center justify-between h-16">
        <Link to="/">
          <img src={crmchainsLogo} alt="CRMChains" className="h-10 w-auto" />
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) =>
            link.external ? (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                to={link.href}
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            )
          )}
        </div>

        {/* CTA Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold text-xs px-4"
            asChild
          >
            <a href="https://www.crmchains.com/calendar" target="_blank" rel="noopener noreferrer">
              BOOK A DEMO
            </a>
          </Button>
          <Button variant="secondary" className="font-semibold text-xs px-4 hidden sm:inline-flex" asChild>
            <a href="https://www.crmchains.com/login" target="_blank" rel="noopener noreferrer">
              LOGIN TO APP
            </a>
          </Button>
          <Button className="bg-coral hover:bg-coral/90 text-primary-foreground font-semibold text-xs px-4 hidden sm:inline-flex" asChild>
            <a href="https://www.crmchains.com/get-started" target="_blank" rel="noopener noreferrer">
              Get Started
            </a>
          </Button>
        </div>
      </div>
    </nav>
  );
}
