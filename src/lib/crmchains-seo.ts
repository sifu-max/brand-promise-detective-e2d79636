export const CRMCHAINS_CANONICAL = "https://branding.crmchains.com/crmchains";
export const CRMCHAINS_OG_IMAGE = "https://branding.crmchains.com/og-image.jpg";
export const CRMCHAINS_LOGO = "https://branding.crmchains.com/logo.jpg";

export const CRMCHAINS_META_DESCRIPTION =
  "CRM, bilingual VAs, AI agents, and branded ecosystems for insurance and real estate agencies. Deploy in 7 days.";

export const CRMCHAINS_H1 =
  "CRMChains — CRM, AI Agents & Branded Ecosystems for Agencies";

export const CRMCHAINS_INTRO =
  "Bilingual CRM and AI-agent ecosystems for insurance and real estate teams.";

export const crmchainsFaqs = [
  {
    question: "What does CRMChains do?",
    answer:
      "CRMChains builds branded CRM ecosystems with AI agents and bilingual VAs for agencies.",
  },
  {
    question: "Which industries do you serve?",
    answer: "Insurance, real estate, and mortgage agencies in the US, Colombia, and Mexico.",
  },
  {
    question: "Do you offer bilingual support?",
    answer: "Yes. Every deployment ships English + Spanish AI agents and VAs.",
  },
  {
    question: "How fast can a workspace go live?",
    answer: "Branded CRMs go live in 7 days; custom AI workflows in 14.",
  },
] as const;

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://crmchains.com/#organization",
  name: "CRMChains",
  alternateName: ["CRM Chains", "CRMChains Branding"],
  url: "https://crmchains.com",
  logo: CRMCHAINS_LOGO,
  description:
    "CRM, bilingual VAs, AI agents, and branded ecosystems for insurance and real estate agencies.",
  foundingDate: "2023",
  areaServed: ["US", "CO", "MX"],
  knowsAbout: [
    "CRM",
    "AI Agents",
    "Insurance Agencies",
    "Real Estate Agencies",
    "Bilingual Virtual Assistants",
    "Lead Generation",
  ],
  sameAs: [
    "https://www.linkedin.com/company/crmchains",
    "https://www.instagram.com/crmchains",
    "https://www.facebook.com/crmchains",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "sales",
    email: "hello@crmchains.com",
    availableLanguage: ["en", "es"],
  },
};

export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": "https://crmchains.com/#business",
  name: "CRMChains",
  image: CRMCHAINS_OG_IMAGE,
  url: CRMCHAINS_CANONICAL,
  telephone: "+1-408-858-5737",
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    addressLocality: "San Jose",
    addressRegion: "CA",
    addressCountry: "US",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 37.3382,
    longitude: -121.8863,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
  ],
  makesOffer: {
    "@type": "Offer",
    itemOffered: {
      "@type": "Service",
      name: "CRM, AI Agents & Branded Ecosystems",
      serviceType: "CRM and AI agent deployment for insurance and real estate agencies",
      provider: { "@id": "https://crmchains.com/#organization" },
      areaServed: ["United States", "Colombia", "Mexico"],
    },
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "27",
  },
};

export const faqPageSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: crmchainsFaqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};
