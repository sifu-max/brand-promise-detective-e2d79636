import { useState, useEffect } from "react";
import { ArrowRight, BookOpen, Users, Heart, MessageCircle, Play, CheckCircle, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const CLEAR_FAITH_SEO = {
  title: "Clear Faith Christian Ministries | Virtual Church — Teaching, Counseling & Coaching",
  description: "Join Clear Faith Christian Ministries — a 100% virtual church empowering ministry leaders and faith-driven business owners through teaching, counseling, and coaching. Watch live, catch replays, and grow in faith from anywhere.",
  url: "https://branding.crmchains.com/clearfaith",
  type: "website",
};

const ClearFaithLanding = () => {
  const [videoOpen, setVideoOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    // Save original meta values
    const originalTitle = document.title;
    const metaTags: Record<string, { el: HTMLMetaElement | null; original: string }> = {};

    const setMeta = (attr: string, key: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
      const original = el?.getAttribute("content") || "";
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
      metaTags[key] = { el, original };
    };

    document.title = CLEAR_FAITH_SEO.title;
    setMeta("name", "description", CLEAR_FAITH_SEO.description);
    setMeta("property", "og:title", CLEAR_FAITH_SEO.title);
    setMeta("property", "og:description", CLEAR_FAITH_SEO.description);
    setMeta("property", "og:url", CLEAR_FAITH_SEO.url);
    setMeta("property", "og:type", CLEAR_FAITH_SEO.type);
    setMeta("name", "twitter:title", CLEAR_FAITH_SEO.title);
    setMeta("name", "twitter:description", CLEAR_FAITH_SEO.description);

    // Add canonical
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    const hadCanonical = !!canonical;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", CLEAR_FAITH_SEO.url);

    // Add JSON-LD
    const jsonLd = document.createElement("script");
    jsonLd.type = "application/ld+json";
    jsonLd.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Church",
      name: "Clear Faith Christian Ministries",
      description: CLEAR_FAITH_SEO.description,
      url: CLEAR_FAITH_SEO.url,
      sameAs: ["https://www.youtube.com/@clearfaithchristianministr1532"],
      serviceType: ["Teaching", "Counseling", "Coaching"],
      areaServed: { "@type": "Place", name: "Virtual / Online" },
    });
    document.head.appendChild(jsonLd);

    return () => {
      document.title = originalTitle;
      Object.entries(metaTags).forEach(([key, { el, original }]) => {
        if (el) el.setAttribute("content", original);
      });
      if (!hadCanonical && canonical) canonical.remove();
      jsonLd.remove();
    };
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#1E293B]" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-[#4C1D95]/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/images/clearfaith-cross.png" alt="Clear Faith" className="w-12 h-12 rounded-lg object-cover" />
            <div>
              <span className="text-white font-bold text-lg tracking-tight leading-tight">Clear Faith</span>
              <span className="text-[#D4A017] text-xs block leading-none mt-0.5 font-medium tracking-wide">Teaching • Counseling • Coaching</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollToSection("services")} className="text-white/80 hover:text-white text-sm transition-colors">Services</button>
            <button onClick={() => scrollToSection("about")} className="text-white/80 hover:text-white text-sm transition-colors">About</button>
            <button onClick={() => scrollToSection("pricing")} className="text-white/80 hover:text-white text-sm transition-colors">Enrichment</button>
            <button onClick={() => scrollToSection("contact")} className="text-white/80 hover:text-white text-sm transition-colors">Contact</button>
          </div>
          <div className="flex items-center gap-3">
            <a href="https://www.paypal.com/donate" target="_blank" rel="noopener noreferrer">
              <Button className="bg-white/10 hover:bg-white/20 text-white font-semibold text-sm px-5 border border-white/20">
                Donate Now
              </Button>
            </a>
            <Button
              onClick={() => scrollToSection("contact")}
              className="bg-[#D4A017] hover:bg-[#B8860B] text-white font-semibold text-sm px-5"
            >
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#4C1D95] via-[#3B0764] to-[#2E1065]" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 30% 50%, rgba(212,160,23,0.4) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(139,92,246,0.2) 0%, transparent 50%)" }} />
        <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-36">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-8">
              <span className="w-2 h-2 rounded-full bg-[#D4A017] animate-pulse" />
              <span className="text-white/80 text-sm font-medium">Teaching • Counseling • Coaching</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6 tracking-tight">
              Ministries that are{" "}
              <span className="text-[#D4A017]">CLEAR</span>{" "}
              on where their{" "}
              <span className="text-[#D4A017]">FAITH</span>{" "}
              lies.
            </h1>
            <p className="text-xl text-white/70 mb-10 max-w-xl leading-relaxed">
              Empowering ministry leaders, business owners, and team leaders with clarity, purpose, and the tools to build faith-driven organizations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                onClick={() => scrollToSection("contact")}
                className="bg-[#D4A017] hover:bg-[#B8860B] text-white font-semibold text-lg px-8 py-6 rounded-xl shadow-lg shadow-yellow-700/25"
              >
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => setVideoOpen(true)}
                className="border-white/30 text-white hover:bg-white/10 font-semibold text-lg px-8 py-6 rounded-xl bg-transparent"
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Our Story
              </Button>
            </div>
          </div>
        </div>
        {/* Bottom curve */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" className="w-full">
            <path d="M0 60L1440 60L1440 0C1200 50 240 50 0 0L0 60Z" fill="#FAF9F6" />
          </svg>
        </div>
      </section>

      {/* Video Modal */}
      {videoOpen && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-6" onClick={() => setVideoOpen(false)}>
          <div className="w-full max-w-4xl aspect-video rounded-2xl overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <iframe
              src="https://www.youtube.com/embed/9Dgz0ReUHV4?autoplay=1"
              className="w-full h-full"
              allow="autoplay; encrypted-media"
              allowFullScreen
              title="Clear Faith Christian Ministries"
            />
          </div>
        </div>
      )}

      {/* Featured Video */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-10">
          <span className="text-[#D4A017] font-semibold text-sm uppercase tracking-widest">Watch & Worship</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-3 text-[#1E293B] tracking-tight">
            Experience Clear Faith Live
          </h2>
          <p className="text-[#64748B] text-lg mt-4 max-w-xl mx-auto">
            Join our 100% virtual church community. Watch live sessions, catch replays, and grow in faith — from anywhere.
          </p>
        </div>
        <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-purple-900/15 aspect-video">
          <iframe
            src="https://www.youtube.com/embed/9Dgz0ReUHV4"
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Clear Faith Christian Ministries — Live Session"
          />
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <a href="https://www.youtube.com/@clearfaithchristianministr1532" target="_blank" rel="noopener noreferrer">
            <Button className="bg-[#4C1D95] hover:bg-[#3B0764] text-white font-semibold px-6 rounded-xl">
              <Play className="mr-2 h-4 w-4" />
              Watch More on YouTube
            </Button>
          </a>
          <a href="https://www.youtube.com/@clearfaithchristianministr1532?sub_confirmation=1" target="_blank" rel="noopener noreferrer">
            <Button className="bg-[#FF0000] hover:bg-[#CC0000] text-white font-semibold px-6 rounded-xl">
              Subscribe to Our Channel
            </Button>
          </a>
          <Button
            variant="outline"
            onClick={() => scrollToSection("contact")}
            className="border-[#4C1D95]/30 text-[#4C1D95] hover:bg-[#4C1D95]/5 font-semibold px-6 rounded-xl"
          >
            Join the Community
          </Button>
        </div>
      </section>

      {/* Who We Serve */}
      <section id="about" className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <span className="text-[#D4A017] font-semibold text-sm uppercase tracking-widest">Who We Serve</span>
          <h2 className="text-3xl md:text-5xl font-bold mt-3 text-[#1E293B] tracking-tight">
            Called to Lead. Built to Serve.
          </h2>
          <p className="text-[#64748B] text-lg mt-4 max-w-2xl mx-auto">
            We partner with faith-driven leaders who are building something bigger than themselves.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: BookOpen, title: "Ministry Leaders", desc: "Pastors, church planters, and ministry directors seeking clarity in their mission and organizational growth." },
            { icon: Users, title: "Business Owners", desc: "Small to mid-size business owners integrating faith principles into their leadership and operations." },
            { icon: Heart, title: "Team Leaders", desc: "Leaders of decentralized, faith-based organizations building engaged, purpose-driven teams." },
          ].map((item, i) => (
            <Card key={i} className="group p-8 bg-white border-0 shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl hover:-translate-y-1">
              <div className="w-14 h-14 rounded-2xl bg-[#4C1D95]/10 flex items-center justify-center mb-6 group-hover:bg-[#4C1D95] transition-colors">
                <item.icon className="h-7 w-7 text-[#4C1D95] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#1E293B]">{item.title}</h3>
              <p className="text-[#64748B] leading-relaxed">{item.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Pain Points */}
      <section className="bg-[#4C1D95] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 80% 20%, rgba(212,160,23,0.4) 0%, transparent 40%)" }} />
        <div className="relative max-w-6xl mx-auto px-6 py-20">
          <div className="text-center mb-14">
            <span className="text-[#D4A017] font-semibold text-sm uppercase tracking-widest">The Challenge</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-3 text-white tracking-tight">
              We Understand Your Needs
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "A Dedicated Online Presence", desc: "Your ministry deserves a professional, purpose-built digital home that reflects your calling and attracts the right audience." },
              { title: "Relationship Tools That Work", desc: "Move beyond scattered communications to integrated tools that nurture every connection in your community." },
              { title: "Flexible Engagement", desc: "From first-time subscribers to long-term members, you need flexible tools that meet people where they are." },
            ].map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex-shrink-0 mt-1">
                  <CheckCircle className="h-6 w-6 text-[#D4A017]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-white/70 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <span className="text-[#D4A017] font-semibold text-sm uppercase tracking-widest">What We Offer</span>
          <h2 className="text-3xl md:text-5xl font-bold mt-3 text-[#1E293B] tracking-tight">
            Three Pillars of Growth
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: BookOpen,
              title: "Teaching",
              desc: "Foundational biblical teaching that brings clarity to your calling and equips you with the knowledge to lead with confidence.",
              features: ["Scripture-based curriculum", "Leadership development", "Group study resources"],
            },
            {
              icon: MessageCircle,
              title: "Counseling",
              desc: "One-on-one guidance to navigate challenges, build resilience, and align your personal and professional life with your faith.",
              features: ["Confidential sessions", "Faith-integrated approach", "Practical action plans"],
            },
            {
              icon: Users,
              title: "Coaching",
              desc: "Strategic coaching to transform your vision into actionable steps, driving measurable growth in your ministry or business.",
              features: ["Goal setting & tracking", "Accountability partnerships", "Ministry/business strategy"],
            },
          ].map((service, i) => (
            <Card key={i} className="relative overflow-hidden bg-white border-0 shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl group">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#4C1D95] to-[#D4A017] opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="p-8">
                <div className="w-14 h-14 rounded-2xl bg-[#D4A017]/10 flex items-center justify-center mb-6">
                  <service.icon className="h-7 w-7 text-[#D4A017]" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-[#1E293B]">{service.title}</h3>
                <p className="text-[#64748B] leading-relaxed mb-6">{service.desc}</p>
                <ul className="space-y-3">
                  {service.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-3 text-[#1E293B] text-sm">
                      <CheckCircle className="h-4 w-4 text-[#4C1D95] flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-white py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <span className="text-[#D4A017] font-semibold text-sm uppercase tracking-widest">Personal & Spiritual Enrichment</span>
          <h2 className="text-3xl md:text-5xl font-bold mt-3 text-[#1E293B] tracking-tight mb-6">
            One Clear Path Forward
          </h2>
          <p className="text-[#64748B] text-lg mb-12 max-w-xl mx-auto">
            A single, straightforward investment in your growth — no confusing tiers, no hidden fees.
          </p>
          <Card className="max-w-md mx-auto bg-gradient-to-br from-[#4C1D95] to-[#2E1065] border-0 rounded-3xl overflow-hidden shadow-2xl shadow-purple-900/20">
            <div className="p-10">
              <div className="inline-flex items-center gap-2 bg-[#D4A017]/20 border border-[#D4A017]/30 rounded-full px-4 py-1.5 mb-6">
                <span className="text-[#D4A017] text-sm font-semibold">Complete Package</span>
              </div>
              <div className="mb-6">
                <span className="text-6xl font-bold text-white">$250</span>
                <span className="text-white/60 text-lg ml-2">/ session</span>
              </div>
              <ul className="text-left space-y-4 mb-10">
                {[
                  "Teaching, Counseling & Coaching",
                  "Personalized action plan",
                  "Faith-integrated methodology",
                  "Follow-up resources & support",
                  "Flexible scheduling",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-white/90">
                    <CheckCircle className="h-5 w-5 text-[#D4A017] flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button
                size="lg"
                onClick={() => scrollToSection("contact")}
                className="w-full bg-[#D4A017] hover:bg-[#B8860B] text-white font-semibold text-lg py-6 rounded-xl shadow-lg"
              >
                Begin Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#1E293B] tracking-tight">Common Questions</h2>
        </div>
        {[
          { q: "Who is this for?", a: "Ministry leaders, small to mid-size business owners, and team leaders in faith-based organizations who want clarity and growth." },
          { q: "What does a session look like?", a: "Each session is tailored to your needs — combining teaching, counseling, or coaching based on where you are in your journey." },
          { q: "Is this only for churches?", a: "No. We serve any faith-driven leader or organization, whether it's a church, nonprofit, or business operating on biblical principles." },
          { q: "How do I get started?", a: "Simply reach out through the contact form below. We'll schedule a conversation to understand your needs and create a plan." },
        ].map((item, i) => (
          <div key={i} className="border-b border-[#E2E8F0] last:border-0">
            <button
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              className="w-full flex items-center justify-between py-5 text-left"
            >
              <span className="text-lg font-semibold text-[#1E293B]">{item.q}</span>
              <ChevronDown className={`h-5 w-5 text-[#64748B] transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
            </button>
            {openFaq === i && (
              <p className="pb-5 text-[#64748B] leading-relaxed">{item.a}</p>
            )}
          </div>
        ))}
      </section>

      {/* Contact CTA */}
      <section id="contact" className="bg-gradient-to-br from-[#4C1D95] via-[#3B0764] to-[#2E1065] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 80%, rgba(212,160,23,0.4) 0%, transparent 40%)" }} />
        <div className="relative max-w-3xl mx-auto px-6 py-24 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-6">
            Ready to Walk in{" "}
            <span className="text-[#D4A017]">Clear Faith</span>?
          </h2>
          <p className="text-xl text-white/70 mb-10 max-w-xl mx-auto leading-relaxed">
            Take the first step toward clarity in your ministry, business, or leadership. Let's build something rooted in faith together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:devinlmiller65@gmail.com">
              <Button
                size="lg"
                className="bg-[#D4A017] hover:bg-[#B8860B] text-white font-semibold text-lg px-10 py-6 rounded-xl shadow-lg shadow-yellow-700/25"
              >
                Contact Us Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1C0A33] text-white/60 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <img src="/images/clearfaith-cross.png" alt="Clear Faith" className="w-10 h-10 rounded-lg object-cover" />
              <div>
                <span className="text-white font-semibold leading-tight">Clear Faith Christian Ministries</span>
                <span className="text-[#D4A017] text-xs block leading-none mt-0.5">Teaching • Counseling • Coaching</span>
              </div>
            </div>
            </div>
            <p className="text-sm">
              © {new Date().getFullYear()} Clear Faith Christian Ministries. All rights reserved.
            </p>
            <p className="text-xs text-white/40">
              Powered by{" "}
              <a href="https://www.crmchains.com" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white/70 underline">
                www.crmchains.com
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ClearFaithLanding;
