import { Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface TeaserGateProps {
  featureName: string;
  description?: string;
}

export function TeaserGate({ featureName, description }: TeaserGateProps) {
  return (
    <Card className="border-border/50 bg-muted/30">
      <CardContent className="py-8 text-center space-y-4">
        <Lock className="h-10 w-10 text-primary mx-auto" />
        <div>
          <h4 className="text-base font-semibold text-foreground">
            {featureName}
          </h4>
          <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
            {description || "Get the full breakdown with actionable recommendations from CRMChains"}
          </p>
        </div>
        <Button asChild>
          <a href="https://www.crmchains.com" target="_blank" rel="noopener noreferrer">
            Unlock Full Report with CRMChains
            <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}
