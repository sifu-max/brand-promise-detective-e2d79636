import { useRef } from "react";
import { FileImage } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandResearchResult } from "@/types/brand";
import { toast } from "sonner";

interface BrandBoardExportProps {
  data: BrandResearchResult;
}

export function BrandBoardExport({ data }: BrandBoardExportProps) {
  const boardRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const board = boardRef.current;
    if (!board) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Pop-up blocked — please allow pop-ups to export.");
      return;
    }

    const primary = data.brand_dna?.primary_color || "#000000";
    const secondary = data.brand_dna?.secondary_color || "#666666";
    const accent = data.brand_dna?.accent_color || "#888888";
    const headingFont = data.brand_dna?.heading_font || "Georgia, serif";
    const bodyFont = data.brand_dna?.body_font || "system-ui, sans-serif";

    const businessName = data.source_url
      .replace(/https?:\/\//, "")
      .replace(/\/$/, "")
      .split(".")[0]
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

    printWindow.document.write(`<!DOCTYPE html>
<html>
<head>
  <title>Brand Board — ${businessName}</title>
  <style>
    @page { size: A4 landscape; margin: 0; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { 
      font-family: ${bodyFont}; 
      background: #fff; 
      color: #1a1a1a;
      width: 297mm;
      height: 210mm;
      overflow: hidden;
    }
    .board {
      width: 297mm;
      height: 210mm;
      padding: 20mm 24mm;
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: auto 1fr auto;
      gap: 16px;
    }
    .header {
      grid-column: 1 / -1;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      border-bottom: 3px solid ${primary};
      padding-bottom: 12px;
      margin-bottom: 8px;
    }
    .brand-name {
      font-family: ${headingFont};
      font-size: 28px;
      font-weight: 700;
      color: ${primary};
      letter-spacing: -0.5px;
    }
    .brand-label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: #999;
    }
    .section {
      padding: 12px 0;
    }
    .section-title {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: #999;
      margin-bottom: 8px;
      font-weight: 600;
    }
    .tagline {
      font-family: ${headingFont};
      font-size: 18px;
      line-height: 1.4;
      color: #1a1a1a;
      font-style: italic;
    }
    .positioning {
      font-size: 13px;
      line-height: 1.6;
      color: #444;
    }
    .color-palette {
      display: flex;
      gap: 12px;
      align-items: flex-end;
    }
    .color-swatch {
      text-align: center;
    }
    .swatch-box {
      width: 60px;
      height: 60px;
      border-radius: 8px;
      border: 1px solid #e0e0e0;
      margin-bottom: 6px;
    }
    .swatch-label {
      font-size: 9px;
      color: #999;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .swatch-hex {
      font-size: 10px;
      font-family: monospace;
      color: #666;
    }
    .typography-sample {
      margin-bottom: 12px;
    }
    .type-heading {
      font-family: ${headingFont};
      font-size: 22px;
      font-weight: 700;
      color: #1a1a1a;
      margin-bottom: 2px;
    }
    .type-body {
      font-family: ${bodyFont};
      font-size: 14px;
      color: #444;
      line-height: 1.5;
    }
    .type-meta {
      font-size: 9px;
      color: #bbb;
      margin-top: 2px;
    }
    .tone-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 100px;
      font-size: 11px;
      font-weight: 600;
      background: ${primary}15;
      color: ${primary};
      border: 1px solid ${primary}30;
    }
    .pain-list {
      list-style: none;
      padding: 0;
    }
    .pain-list li {
      font-size: 12px;
      color: #444;
      padding: 3px 0;
      padding-left: 14px;
      position: relative;
      line-height: 1.4;
    }
    .pain-list li::before {
      content: "•";
      position: absolute;
      left: 0;
      color: ${primary};
      font-weight: bold;
    }
    .footer {
      grid-column: 1 / -1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid #e0e0e0;
      padding-top: 10px;
      font-size: 10px;
      color: #bbb;
    }
    .niche {
      font-size: 12px;
      color: #444;
      line-height: 1.5;
    }
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  <div class="board">
    <div class="header">
      <div>
        <div class="brand-name">${businessName}</div>
        <div class="brand-label">Brand Board</div>
      </div>
      <div class="brand-label">${data.source_url}</div>
    </div>

    <!-- Left Column -->
    <div>
      <div class="section">
        <div class="section-title">Tagline</div>
        <div class="tagline">"${data.business_tagline}"</div>
      </div>

      <div class="section">
        <div class="section-title">Color Palette</div>
        <div class="color-palette">
          <div class="color-swatch">
            <div class="swatch-box" style="background: ${primary}"></div>
            <div class="swatch-label">Primary</div>
            <div class="swatch-hex">${primary}</div>
          </div>
          <div class="color-swatch">
            <div class="swatch-box" style="background: ${secondary}"></div>
            <div class="swatch-label">Secondary</div>
            <div class="swatch-hex">${secondary}</div>
          </div>
          ${accent && accent !== "Unable to detect" ? `
          <div class="color-swatch">
            <div class="swatch-box" style="background: ${accent}"></div>
            <div class="swatch-label">Accent</div>
            <div class="swatch-hex">${accent}</div>
          </div>` : ""}
        </div>
      </div>

      <div class="section">
        <div class="section-title">Typography</div>
        <div class="typography-sample">
          <div class="type-heading">Heading Sample</div>
          <div class="type-meta">Font: ${data.brand_dna?.heading_font || "Not detected"}</div>
        </div>
        <div class="typography-sample">
          <div class="type-body">Body text sample — The quick brown fox jumps over the lazy dog.</div>
          <div class="type-meta">Font: ${data.brand_dna?.body_font || "Not detected"}</div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Communication Tone</div>
        <span class="tone-badge">${data.communication_tone}</span>
      </div>
    </div>

    <!-- Right Column -->
    <div>
      <div class="section">
        <div class="section-title">Brand Positioning</div>
        <div class="positioning">${data.core_service_solution}</div>
      </div>

      <div class="section">
        <div class="section-title">Ideal Client</div>
        <div class="niche">${data.ideal_client_niche}</div>
      </div>

      <div class="section">
        <div class="section-title">Client Pain Points</div>
        <ul class="pain-list">
          ${data.core_client_pain_points.map((p) => `<li>${p}</li>`).join("")}
        </ul>
      </div>

      <div class="section">
        <div class="section-title">Primary CTA</div>
        <span class="tone-badge">${data.primary_call_to_action}</span>
      </div>
    </div>

    <div class="footer">
      <span>Generated by Brand Research Agent — Powered by www.crmchains.com</span>
      <span>${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
    </div>
  </div>
  <script>window.onload = () => { window.print(); }</script>
</body>
</html>`);
    printWindow.document.close();
  };

  return (
    <Button variant="outline" size="sm" onClick={handlePrint}>
      <FileImage className="h-4 w-4 mr-2" />
      Brand Board
    </Button>
  );
}
