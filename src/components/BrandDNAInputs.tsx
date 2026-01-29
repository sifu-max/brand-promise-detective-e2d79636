import { Palette } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BrandDNA } from "@/types/brand";

interface BrandDNAInputsProps {
  brandDna: BrandDNA;
  onChange: (brandDna: BrandDNA) => void;
}

function ColorInput({ 
  label, 
  value, 
  onChange, 
  placeholder 
}: { 
  label: string; 
  value: string; 
  onChange: (value: string) => void;
  placeholder: string;
}) {
  const isValidHex = /^#[0-9A-Fa-f]{6}$/.test(value);
  
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="flex gap-2">
        <div 
          className="w-10 h-10 rounded-lg border border-border shadow-sm flex-shrink-0"
          style={{ backgroundColor: isValidHex ? value : '#e5e5e5' }}
        />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="font-mono text-sm"
        />
      </div>
    </div>
  );
}

export function BrandDNAInputs({ brandDna, onChange }: BrandDNAInputsProps) {
  const updateField = (field: keyof BrandDNA, value: string) => {
    onChange({ ...brandDna, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Palette className="h-4 w-4" />
        <span className="text-sm">Optional: Add your brand colors and fonts for website generation</span>
      </div>

      {/* Colors Row */}
      <div className="grid gap-4 sm:grid-cols-3">
        <ColorInput
          label="Primary Color"
          value={brandDna.primary_color}
          onChange={(v) => updateField("primary_color", v)}
          placeholder="#1E40AF"
        />
        <ColorInput
          label="Secondary Color"
          value={brandDna.secondary_color}
          onChange={(v) => updateField("secondary_color", v)}
          placeholder="#64748B"
        />
        <ColorInput
          label="Accent Color"
          value={brandDna.accent_color}
          onChange={(v) => updateField("accent_color", v)}
          placeholder="#F59E0B"
        />
      </div>

      {/* Fonts Row */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Heading Font</Label>
          <Input
            value={brandDna.heading_font}
            onChange={(e) => updateField("heading_font", e.target.value)}
            placeholder="e.g., Montserrat, Playfair Display"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium">Body Font</Label>
          <Input
            value={brandDna.body_font}
            onChange={(e) => updateField("body_font", e.target.value)}
            placeholder="e.g., Open Sans, Inter, Roboto"
          />
        </div>
      </div>
    </div>
  );
}
