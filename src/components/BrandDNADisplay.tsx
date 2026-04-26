import { Palette, Type, Image as ImageIcon, ExternalLink } from "lucide-react";
import { BrandDNA } from "@/types/brand";
import { BrandResultCard } from "./BrandResultCard";
import { sanitizeColor, sanitizeFontFamily } from "@/lib/sanitize";

interface BrandDNADisplayProps {
  brandDna: BrandDNA;
  delay?: number;
}

function ColorSwatch({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div 
        className="w-10 h-10 rounded-lg border border-border shadow-sm flex-shrink-0"
        style={{ backgroundColor: sanitizeColor(color) }}
      />
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground font-mono">{color || 'Not detected'}</p>
      </div>
    </div>
  );
}

export function BrandDNADisplay({ brandDna, delay = 0 }: BrandDNADisplayProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Colors */}
      <BrandResultCard icon={<Palette className="h-4 w-4" />} title="Brand Colors" delay={delay}>
        <div className="space-y-3">
          <ColorSwatch color={brandDna.primary_color} label="Primary" />
          <ColorSwatch color={brandDna.secondary_color} label="Secondary" />
          <ColorSwatch color={brandDna.accent_color} label="Accent" />
        </div>
      </BrandResultCard>

      {/* Typography */}
      <BrandResultCard icon={<Type className="h-4 w-4" />} title="Typography" delay={delay + 50}>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Heading Font</p>
            <p 
              className="text-lg font-semibold text-foreground"
              style={{ fontFamily: sanitizeFontFamily(brandDna.heading_font || '') }}
            >
              {brandDna.heading_font || 'Not detected'}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Body Font</p>
            <p 
              className="text-base text-foreground"
              style={{ fontFamily: sanitizeFontFamily(brandDna.body_font || '') }}
            >
              {brandDna.body_font || 'Not detected'}
            </p>
          </div>
        </div>
      </BrandResultCard>

      {/* Logo */}
      {brandDna.logo_url && (
        <BrandResultCard icon={<ImageIcon className="h-4 w-4" />} title="Logo" delay={delay + 100}>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-lg border border-border bg-[conic-gradient(at_50%_50%,_#f3f4f6_25%,_#ffffff_25%_50%,_#f3f4f6_50%_75%,_#ffffff_75%)] bg-[length:16px_16px] flex items-center justify-center overflow-hidden flex-shrink-0">
              <img
                src={brandDna.logo_url}
                alt="Brand logo"
                className="max-w-full max-h-full object-contain"
                onError={(e) => { (e.currentTarget.parentElement as HTMLElement).style.display = 'none'; }}
              />
            </div>
            <a
              href={brandDna.logo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline inline-flex items-center gap-1 break-all"
            >
              Open logo <ExternalLink className="h-3 w-3 flex-shrink-0" />
            </a>
          </div>
        </BrandResultCard>
      )}
    </div>
  );
}
