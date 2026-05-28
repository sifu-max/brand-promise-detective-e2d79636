# CRMChains → GoHighLevel build kit

Paste blocks **in order** into GHL **Sites → Website** (recommended) as **Custom HTML** elements.

## Funnel vs Website — use **Website**

| | **Website** | **Funnel** |
|---|-------------|------------|
| Best for | Main homepage, SEO, scrollable story | Paid ads, single offer, step 1→2→thank you |
| Your goal | Replace www home + link to showcase | Optional later for campaigns |
| This page | ✅ Build here | ❌ Too linear for full landing |

**Today:** GHL **Website** (or Sites 2.0) → one long homepage → point `www.crmchains.com` when ready. Keep `branding.crmchains.com` for Brand Lab / tools.

## GHL setup checklist

1. **Settings → Custom CSS** (optional): paste `00-global-styles.html` once if your theme needs it; each block also includes scoped styles.
2. **Settings → Head tracking / SEO**: paste `00-head-tracking.html` (JSON-LD + canonical).
3. Add blocks `01` through `12` top to bottom on the homepage.
4. Set page title: `CRMChains — CRM, AI Agents & Branded Ecosystems for Agencies`
5. Primary button site-wide: `https://crmchains.com/calendar`
6. Publish and test on mobile.

## Block order

| File | Section |
|------|---------|
| `00-head-tracking.html` | Head only (not a body block) |
| `01-video.html` | Video |
| `02-hero.html` | Hero + pain points |
| `03-how-it-works.html` | Timeline |
| `04-agents.html` | Sample AI agents |
| `05-brand-promise.html` | Quote + trust line |
| `06-services.html` | 6 service cards |
| `07-icp.html` | Built for agencies |
| `08-social-proof.html` | Testimonials + showcase |
| `09-pricing.html` | Pricing + monthly/yearly toggle |
| `10-contact.html` | Contact |
| `11-faq.html` | FAQ |
| `12-final-cta.html` | Book strategy call |

## Notes

- Blocks use class prefix `cc-` to avoid clashing with GHL theme CSS.
- Pricing toggle uses vanilla JS scoped to `#cc-pricing` only.
- Virtual office: no street address (Phoenix, AZ area only).
