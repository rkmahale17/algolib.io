import { DashboardWidgets } from "@/components/listing/DashboardWidgets";
import { GuidedSection } from "@/components/Home/sections/GuidedSection";
// ── Above-the-fold sections (static imports for fast LCP) ───────────────────
import { HeroSection } from "@/components/Home/sections/HeroSection";
import HomeClient from "./HomeClient";
import { InteractiveSandboxTeaser } from "@/components/Home/sections/InteractiveSandboxTeaser";
import { Metadata } from "next";
import { ProblemsSection } from "@/components/Home/sections/ProblemsSection";
import Script from "next/script";
import dynamic from "next/dynamic";

// ── Below-the-fold sections (lazy loaded to reduce initial bundle) ───────────
const ScratchpadSection = dynamic(() =>
  import("@/components/Home/sections/ScratchpadSection").then((m) => ({
    default: m.ScratchpadSection,
  })),
);
const FeedbackSection = dynamic(() =>
  import("@/components/Home/sections/FeedbackSection").then((m) => ({
    default: m.FeedbackSection,
  })),
);
const TestimonialsSection = dynamic(() =>
  import("@/components/Home/sections/TestimonialsSection").then((m) => ({
    default: m.TestimonialsSection,
  })),
);
const CommunitySection = dynamic(() =>
  import("@/components/Home/sections/CommunitySection").then((m) => ({
    default: m.CommunitySection,
  })),
);

const BottomCTA = dynamic(() =>
  import("@/components/Home/sections/BottomCTA").then((m) => ({
    default: m.BottomCTA,
  })),
);
const FAQ = dynamic(() =>
  import("@/components/FAQ").then((m) => ({ default: m.FAQ })),
);
const Footer = dynamic(() =>
  import("@/components/Footer").then((m) => ({ default: m.Footer })),
);
const PracticeQuestionBankSection = dynamic(() =>
  import("@/components/Home/sections/PracticeQuestionBankSection").then((m) => ({
    default: m.PracticeQuestionBankSection,
  })),
);

export const metadata: Metadata = {
  title: "Rulcode – Learn Data Structures & Algorithms with Interactive Visualizations",
  description:
    "Learn Data Structures & Algorithms with interactive visualizations, step-by-step explanations, hints, multiple programming languages, Blind 75, NeetCode 150, and coding interview preparation.",
  keywords: [
    "algorithms",
    "open source",
    "data structures",
    "competitive programming",
    "coding interviews",
    "algorithm visualization",
    "code snippets",
    "python",
    "java",
    "c++",
    "typescript",
    "Rulcode.com",
  ],
  openGraph: {
    title: "Rulcode – Learn Data Structures & Algorithms with Interactive Visualizations",
    description:
      "Learn Data Structures & Algorithms with interactive visualizations, step-by-step explanations, hints, multiple programming languages, Blind 75, NeetCode 150, and coding interview preparation.",
    type: "website",
    url: "https://rulcode.com/",
    images: ["https://rulcode.com/og-image.png"],
    siteName: "rulcode.com",
  },
  twitter: {
    card: "summary_large_image",
    site: "@rulcode_com",
    title: "Rulcode – Learn Data Structures & Algorithms with Interactive Visualizations",
    description:
      "Learn Data Structures & Algorithms with interactive visualizations, step-by-step explanations, hints, multiple programming languages, Blind 75, NeetCode 150, and coding interview preparation.",
    images: ["https://rulcode.com/og-image.png"],
  },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://rulcode.com/#website",
        url: "https://rulcode.com",
        name: "Rulcode",
        description:
          "Interactive open-source algorithm library and visualization platform",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate:
              "https://rulcode.com/dsa/problems?q={search_term_string}",
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": "https://rulcode.com/#organization",
        name: "Rulcode",
        url: "https://rulcode.com",
        logo: {
          "@type": "ImageObject",
          url: "https://rulcode.com/android-chrome-512x512.png",
        },
        sameAs: ["https://github.com/rkmahale17/rulcode.com"],
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://rulcode.com/#breadcrumb",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://rulcode.com/",
          },
        ],
      },
    ],
  };

  return (
    <>
      <Script
        id="json-ld-home"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-white dark:bg-black text-[#1A1A1A] dark:text-white overflow-x-hidden relative w-full">
        <HeroSection />
        <section className="relative overflow-hidden w-full py-12">
          {/* faint grid pattern background */}
          <div
            className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          ></div>
          <div className="m-auto p-4 pt-6 block relative z-10 max-w-[1200px]">
            <DashboardWidgets />
          </div>
        </section>

        <div id="visualize">
          <InteractiveSandboxTeaser />
        </div>
        <div id="thinkpad">
          <ScratchpadSection />
        </div>
        {/* Temporarily hidden */}
        {false && (
          <>
            <div id="guides">
              <GuidedSection />
            </div>
            <div id="problems">
              <ProblemsSection />
            </div>
          </>
        )}
        <PracticeQuestionBankSection />
        <div id="playground">
          <HomeClient type="platform-preview" />
        </div>
        <TestimonialsSection />
        <FeedbackSection />
        <CommunitySection />
        <BottomCTA />
        <FAQ />
        <Footer />
      </div>
    </>
  );
}
