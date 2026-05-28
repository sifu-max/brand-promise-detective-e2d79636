import { useEffect } from "react";
import {
  CRMCHAINS_CANONICAL,
  CRMCHAINS_H1,
  CRMCHAINS_META_DESCRIPTION,
  CRMCHAINS_OG_IMAGE,
  faqPageSchema,
  localBusinessSchema,
  organizationSchema,
} from "@/lib/crmchains-seo";
import { usePageMeta } from "@/hooks/usePageMeta";

const SCHEMA_IDS = [
  "crmchains-schema-organization",
  "crmchains-schema-local-business",
  "crmchains-schema-faq",
] as const;

function injectJsonLd(id: string, data: object) {
  let script = document.getElementById(id) as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement("script");
    script.id = id;
    script.type = "application/ld+json";
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
}

export function CRMChainsSeo() {
  usePageMeta({
    title: CRMCHAINS_H1,
    description: CRMCHAINS_META_DESCRIPTION,
    canonical: CRMCHAINS_CANONICAL,
    ogImage: CRMCHAINS_OG_IMAGE,
    ogUrl: CRMCHAINS_CANONICAL,
  });

  useEffect(() => {
    injectJsonLd(SCHEMA_IDS[0], organizationSchema);
    injectJsonLd(SCHEMA_IDS[1], localBusinessSchema);
    injectJsonLd(SCHEMA_IDS[2], faqPageSchema);

    return () => {
      SCHEMA_IDS.forEach((id) => document.getElementById(id)?.remove());
    };
  }, []);

  return null;
}
