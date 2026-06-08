import { Metadata } from 'next';
import HomeClient from './HomeClient';
import Script from 'next/script';
import dynamic from 'next/dynamic';

// ── Above-the-fold sections (static imports for fast LCP) ───────────────────
import { HeroSection } from '@/components/Home/sections/HeroSection';
import { ProblemsSection } from '@/components/Home/sections/ProblemsSection';
import { GuidedSection } from '@/components/Home/sections/GuidedSection';
import { InteractiveSandboxTeaser } from '@/components/Home/sections/InteractiveSandboxTeaser';
import { SprintsAndTracksSection } from '@/components/Home/sections/SprintsAndTracksSection';
import { TopicRoadmapSection } from '@/components/Home/sections/TopicRoadmapSection';

// ── Below-the-fold sections (lazy loaded to reduce initial bundle) ───────────
const WorkspaceSection = dynamic(() =>
  import('@/components/Home/sections/WorkspaceSection').then(m => ({ default: m.WorkspaceSection }))
);
const ScratchpadSection = dynamic(() =>
  import('@/components/Home/sections/ScratchpadSection').then(m => ({ default: m.ScratchpadSection }))
);
const FeedbackSection = dynamic(() =>
  import('@/components/Home/sections/FeedbackSection').then(m => ({ default: m.FeedbackSection }))
);
const CommunitySection = dynamic(() =>
  import('@/components/Home/sections/CommunitySection').then(m => ({ default: m.CommunitySection }))
);
const CraftingSection = dynamic(() =>
  import('@/components/Home/sections/CraftingSection').then(m => ({ default: m.CraftingSection }))
);
const BottomCTA = dynamic(() =>
  import('@/components/Home/sections/BottomCTA').then(m => ({ default: m.BottomCTA }))
);
const FAQ = dynamic(() =>
  import('@/components/FAQ').then(m => ({ default: m.FAQ }))
);
const Footer = dynamic(() =>
  import('@/components/Footer').then(m => ({ default: m.Footer }))
);

export const metadata: Metadata = {
  title: "Rulcode | Master Algorithms & Coding Interviews",
  description: "Accelerate your coding prep with interactive visualizations and multi-language solutions. Master Blind 75 and 200+ algorithms visually.",
  keywords: ["algorithms", "open source", "data structures", "competitive programming", "coding interviews", "algorithm visualization", "code snippets", "python", "java", "c++", "typescript", "Rulcode.com"],
  openGraph: {
    title: "Rulcode | Master Algorithms & Coding Interviews",
    description: "Accelerate your coding prep with interactive visualizations and multi-language solutions. Master Blind 75 and 200+ algorithms visually.",
    type: "website",
    url: "https://rulcode.com/",
    images: ["https://rulcode.com/og-image.png"],
    siteName: "rulcode.com",
  },
  twitter: {
    card: "summary_large_image",
    site: "@rulcode_com",
    title: "Rulcode | Master Algorithms & Coding Interviews",
    description: "Accelerate your coding prep with interactive visualizations and multi-language solutions. Master Blind 75 and 200+ algorithms visually.",
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
        "url": "https://rulcode.com",
        "name": "Rulcode",
        "description": "Interactive open-source algorithm library and visualization platform",
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://rulcode.com/dsa/problems?q={search_term_string}"
          },
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "Organization",
        "@id": "https://rulcode.com/#organization",
        "name": "Rulcode",
        "url": "https://rulcode.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://rulcode.com/android-chrome-512x512.png"
        },
        "sameAs": [
          "https://github.com/rkmahale17/rulcode.com"
        ]
      }
    ]
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
        <div id="visualize">
          <InteractiveSandboxTeaser />
        </div>
        <div id="thinkpad">
          <ScratchpadSection />
        </div>
        <div id="guides">
          <GuidedSection />
        </div>
        <div id="problems">
          <ProblemsSection />
        </div>
        <SprintsAndTracksSection />
        <TopicRoadmapSection />
        <div id="playground">
          <HomeClient type="platform-preview" />
        </div>
        <div id="workspace">
          <WorkspaceSection />
        </div>
        <FeedbackSection />
        <CommunitySection />
        <CraftingSection />
        <BottomCTA />
        <FAQ />
        <Footer />
      </div>
    </>
  );
}
