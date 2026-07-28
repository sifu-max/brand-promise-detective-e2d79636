import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronRight, Loader2 } from "lucide-react";

export type DynamicField = {
  key: string;
  label: string;
  type?: "text" | "textarea" | "select";
  options?: string[];
  helpText?: string;
  required?: boolean;
};

type Props = {
  fields: DynamicField[];
  agencyId: string;
  jobId: string;
  webhookUrl?: string;
  onSuccess: (answers: Record<string, string>) => void;
};

export default function DynamicFieldsForm({
  fields,
  agencyId,
  jobId,
  webhookUrl,
  onSuccess,
}: Props) {
  const [data, setData] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValid = fields
    .filter((f) => f.required)
    .every((f) => (data[f.key] || "").trim().length > 0);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      if (webhookUrl) {
        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ agencyId, jobId, answers: data }),
        });
      }
      onSuccess(data);
    } catch (e) {
      console.error("Dynamic field submission failed", e);
      setError("Couldn't save those answers — continuing anyway.");
      onSuccess(data);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      {fields.map((field) => (
        <div key={field.key} className="space-y-2">
          <Label htmlFor={`dyn-${field.key}`} className="text-sm font-medium">
            {field.label}
            {field.required && <span className="text-destructive ml-1">*</span>}
          </Label>
          {field.helpText && (
            <p className="text-xs text-muted-foreground">{field.helpText}</p>
          )}
          {field.type === "select" && field.options ? (
            <Select
              value={data[field.key] || ""}
              onValueChange={(v) => setData((p) => ({ ...p, [field.key]: v }))}
            >
              <SelectTrigger id={`dyn-${field.key}`}>
                <SelectValue placeholder="Select…" />
              </SelectTrigger>
              <SelectContent>
                {field.options.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : field.type === "textarea" ? (
            <Textarea
              id={`dyn-${field.key}`}
              value={data[field.key] || ""}
              onChange={(e) =>
                setData((p) => ({ ...p, [field.key]: e.target.value }))
              }
              rows={4}
            />
          ) : (
            <Input
              id={`dyn-${field.key}`}
              value={data[field.key] || ""}
              onChange={(e) =>
                setData((p) => ({ ...p, [field.key]: e.target.value }))
              }
            />
          )}
        </div>
      ))}

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex justify-between pt-2">
        <Button
          variant="outline"
          onClick={() => onSuccess({})}
          disabled={submitting}
        >
          Skip
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!isValid || submitting}
          className="gap-2 px-6"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Submitting…
            </>
          ) : (
            <>
              Continue <ChevronRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
