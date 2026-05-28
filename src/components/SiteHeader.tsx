import { useState } from "react";
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import crmchainsLogo from "@/assets/crmchains-logo.jpg";
import { CRMCHAINS_CALENDAR_URL, CRMCHAINS_SHOWCASE_URL } from "@/lib/crmchains-constants";

type NavItem =
  | { label: string; href: string; external: true; hash?: boolean }
  | { label: string; href: string; external: false };

const navLinks: NavItem[] = [
  { label: "Home", href: "https://crmchains.com/home-2433", external: true },
  { label: "About", href: "https://branding.crmchains.com/crmchains", external: true },
  { label: "Service", href: "https://crmchains.com/#view", external: true },
  { label: "FAQ", href: "#faq", external: true, hash: true },
  { label: "Contact", href: "#contact", external: true, hash: true },
  { label: "Client Showcase", href: CRMCHAINS_SHOWCASE_URL, external: true },
  { label: "Branding", href: "/brand-builder", external: false },
  { label: "Brand Lab", href: "/lab", external: false },
];

function NavLink({
  link,
  onNavigate,
  className,
}: {
  link: NavItem;
  onNavigate?: () => void;
  className: string;
}) {
  if (link.external) {
    const isHash = "hash" in link && link.hash;
    return (
      <a
        href={link.href}
        target={isHash ? undefined : "_blank"}
        rel={isHash ? undefined : "noopener noreferrer"}
        className={className}
        onClick={onNavigate}
      >
        {link.label}
      </a>
    );
  }

  return (
    <Link to={link.href} className={className} onClick={onNavigate}>
      {link.label}
    </Link>
  );
}

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const linkClass =
    "text-sm font-medium text-foreground hover:text-primary transition-colors";

  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <nav
        className="container max-w-6xl flex items-center justify-between h-16 px-4"
        aria-label="Primary"
      >
        <Link to="/" className="shrink-0">
          <img src={crmchainsLogo} alt="CRMChains" className="h-10 w-auto" />
        </Link>

        <div className="hidden lg:flex items-center gap-5">
          {navLinks.map((link) => (
            <NavLink key={link.label} link={link} className={linkClass} />
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
          <Button
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold text-xs px-4"
            asChild
          >
            <a href={CRMCHAINS_CALENDAR_URL} target="_blank" rel="noopener noreferrer">
              Book a Strategy Call
            </a>
          </Button>
          <Button variant="secondary" className="font-semibold text-xs px-4" asChild>
            <a href="https://app.crmchains.com/" target="_blank" rel="noopener noreferrer">
              Login
            </a>
          </Button>
        </div>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="outline" size="icon" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[min(100vw-2rem,320px)]">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-4 mt-6">
              {navLinks.map((link) => (
                <NavLink
                  key={link.label}
                  link={link}
                  className="text-base font-medium py-1"
                  onNavigate={() => setMobileOpen(false)}
                />
              ))}
              <div className="pt-4 border-t border-border flex flex-col gap-2">
                <Button className="bg-coral hover:bg-coral/90 text-primary-foreground w-full" asChild>
                  <a
                    href={CRMCHAINS_CALENDAR_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileOpen(false)}
                  >
                    Book a Strategy Call
                  </a>
                </Button>
                <Button variant="secondary" className="w-full" asChild>
                  <a
                    href="https://app.crmchains.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileOpen(false)}
                  >
                    Login to App
                  </a>
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}
