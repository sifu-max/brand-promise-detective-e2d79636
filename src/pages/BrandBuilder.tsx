import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BrandResearchResult } from "@/types/brand";
import { toast } from "sonner";

const BrandBuilder = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const prefillData = location.state?.prefillData as BrandResearchResult | undefined;

  const [formData, setFormData] = useState<BrandResearchResult>({
    business_tagline: "",
    primary_call_to_action: "",
    core_service_solution: "",
    core_client_pain_points: ["", "", ""],
    communication_tone: "Professional",
    clients_budget_timeline: "",
    core_offer_investment: "",
    ideal_client_niche: "",
    offer_structure: "Single Price Offer",
    source_url: "",
    inference_notes: "",
  });

  useEffect(() => {
    if (prefillData) {
      setFormData(prefillData);
      toast.success("Form pre-filled from AI research!");
    }
  }, [prefillData]);

  const updateField = (field: keyof BrandResearchResult, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updatePainPoint = (index: number, value: string) => {
    const updated = [...formData.core_client_pain_points];
    updated[index] = value;
    updateField("core_client_pain_points", updated);
  };

  const addPainPoint = () => {
    if (formData.core_client_pain_points.length < 6) {
      updateField("core_client_pain_points", [...formData.core_client_pain_points, ""]);
    }
  };

  const removePainPoint = (index: number) => {
    if (formData.core_client_pain_points.length > 1) {
      const updated = formData.core_client_pain_points.filter((_, i) => i !== index);
      updateField("core_client_pain_points", updated);
    }
  };

  const handleSave = () => {
    // Filter out empty pain points
    const cleanedData = {
      ...formData,
      core_client_pain_points: formData.core_client_pain_points.filter((p) => p.trim() !== ""),
    };
    
    // For now, just show success and log - can be extended to save to DB
    console.log("Brand data:", cleanedData);
    toast.success("Brand profile saved!");
    
    // Copy to clipboard
    navigator.clipboard.writeText(JSON.stringify(cleanedData, null, 2));
    toast.info("JSON copied to clipboard");
  };

  const handleExport = () => {
    const cleanedData = {
      ...formData,
      core_client_pain_points: formData.core_client_pain_points.filter((p) => p.trim() !== ""),
    };
    const blob = new Blob([JSON.stringify(cleanedData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "brand-profile.json";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Brand profile exported!");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="gradient-hero text-primary-foreground">
        <div className="container max-w-4xl py-12">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-6 text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary/20"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to AI Research
          </Button>
          
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary-foreground/90 text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              Manual Brand Definition
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Brand Builder
            </h1>
            
            <p className="text-lg text-primary-foreground/80 max-w-2xl">
              Define your brand promise, messaging, and ideal client profile manually. 
              All fields are editable and will be exported as structured data.
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="container max-w-4xl py-12">
        <div className="space-y-8">
          {/* Brand Identity */}
          <Card>
            <CardHeader>
              <CardTitle>Brand Identity</CardTitle>
              <CardDescription>Define your core brand messaging</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="tagline" className="text-base font-medium">Business Tagline</Label>
                <Input
                  id="tagline"
                  value={formData.business_tagline}
                  onChange={(e) => updateField("business_tagline", e.target.value)}
                  placeholder="Your Growth, Powered by Predictable Leads."
                  className="text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cta" className="text-base font-medium">Primary Call to Action</Label>
                <Input
                  id="cta"
                  value={formData.primary_call_to_action}
                  onChange={(e) => updateField("primary_call_to_action", e.target.value)}
                  placeholder="Book a Free Strategy Call"
                  className="text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="url" className="text-base font-medium">Website URL</Label>
                <Input
                  id="url"
                  type="url"
                  value={formData.source_url}
                  onChange={(e) => updateField("source_url", e.target.value)}
                  placeholder="https://example.com"
                  className="text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tone" className="text-base font-medium">Communication Tone</Label>
                <Select
                  value={formData.communication_tone}
                  onValueChange={(value) => updateField("communication_tone", value)}
                >
                  <SelectTrigger className="text-base">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Professional">Professional</SelectItem>
                    <SelectItem value="Casual/Friendly">Casual/Friendly</SelectItem>
                    <SelectItem value="Urgent/Direct">Urgent/Direct</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Core Offer */}
          <Card>
            <CardHeader>
              <CardTitle>Core Offer</CardTitle>
              <CardDescription>What you provide and how it's structured</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="service" className="text-base font-medium">Core Service / Solution</Label>
                <Textarea
                  id="service"
                  value={formData.core_service_solution}
                  onChange={(e) => updateField("core_service_solution", e.target.value)}
                  placeholder="Describe what you do to solve the client's urgent problem..."
                  className="min-h-[100px] text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="investment" className="text-base font-medium">Core Offer Investment</Label>
                <Input
                  id="investment"
                  value={formData.core_offer_investment}
                  onChange={(e) => updateField("core_offer_investment", e.target.value)}
                  placeholder="$2,000 - $5,000 per month"
                  className="text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="structure" className="text-base font-medium">Offer Structure</Label>
                <Select
                  value={formData.offer_structure}
                  onValueChange={(value) => updateField("offer_structure", value)}
                >
                  <SelectTrigger className="text-base">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Single Price Offer">Single Price Offer</SelectItem>
                    <SelectItem value="Basic and Premium options">Basic and Premium options</SelectItem>
                    <SelectItem value="Tiered 3+">Tiered 3+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* ICP & Pain Points */}
          <Card>
            <CardHeader>
              <CardTitle>Ideal Client Profile</CardTitle>
              <CardDescription>Who you serve and their pain points</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="niche" className="text-base font-medium">Ideal Client Niche</Label>
                <Textarea
                  id="niche"
                  value={formData.ideal_client_niche}
                  onChange={(e) => updateField("ideal_client_niche", e.target.value)}
                  placeholder="Small to mid-sized local home service businesses such as HVAC companies, roofers, and plumbers..."
                  className="min-h-[80px] text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget" className="text-base font-medium">Client's Budget & Timeline</Label>
                <Textarea
                  id="budget"
                  value={formData.clients_budget_timeline}
                  onChange={(e) => updateField("clients_budget_timeline", e.target.value)}
                  placeholder="Most clients invest $2,000-$4,000/month over 90 days..."
                  className="min-h-[80px] text-base"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium">Core Client Pain Points</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addPainPoint}
                    disabled={formData.core_client_pain_points.length >= 6}
                  >
                    Add Pain Point
                  </Button>
                </div>
                {formData.core_client_pain_points.map((pain, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={pain}
                      onChange={(e) => updatePainPoint(index, e.target.value)}
                      placeholder={`Pain point ${index + 1}...`}
                      className="text-base"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removePainPoint(index)}
                      disabled={formData.core_client_pain_points.length <= 1}
                      className="shrink-0"
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Notes</CardTitle>
              <CardDescription>Any context or assumptions</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.inference_notes}
                onChange={(e) => updateField("inference_notes", e.target.value)}
                placeholder="Any additional context, assumptions, or notes about this brand profile..."
                className="min-h-[100px] text-base"
              />
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={handleSave} size="lg" className="flex-1">
              <Save className="mr-2 h-4 w-4" />
              Save & Copy JSON
            </Button>
            <Button onClick={handleExport} variant="outline" size="lg" className="flex-1">
              Export JSON File
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container text-center text-sm text-muted-foreground">
          Brand Builder • Define Your Brand Promise
        </div>
      </footer>
    </div>
  );
};

export default BrandBuilder;
