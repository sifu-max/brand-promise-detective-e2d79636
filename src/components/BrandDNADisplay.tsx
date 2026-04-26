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
    </div>
  );
}
