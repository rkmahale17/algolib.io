import { Metadata } from 'next';
import HomeClient from './HomeClient';
import Script from 'next/script';

export const metadata: Metadata = {
  title: "RulCode - Master Competitive Programming & Technical Interviews | Free & Open Source",
  description: "Accelerate your FAANG preparation with interactive visualizations, code execution in 4+ languages, and multi-approach solutions. Master Blind 75 and 200+ algorithms visually.",
  keywords: ["algorithms", "open source", "free", "data structures", "competitive programming", "coding interviews", "algorithm visualization", "code snippets", "python", "java", "c++", "typescript", "Rulcode.com"],
  openGraph: {
    title: "RulCode - Master Competitive Programming & Technical Interviews",
    description: "Interactive visualizations, integrated code runner, and multi-approach solutions in 4+ languages. Master Blind 75 and 200+ algorithms visually.",
    type: "website",
    url: "https://rulcode.com/",
    images: ["https://rulcode.com/og-image.png"],
    siteName: "rulcode.com",
  },
  twitter: {
    card: "summary_large_image",
    site: "@rulcode_com",
    title: "RulCode - Master Algorithms & Solve Visually",
    description: "Free interactive algorithm visualizations and integrated code runner for FAANG interview preparation.",
    images: ["https://rulcode.com/og-image.png"],
  },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "RulCode",
    url: "https://rulcode.com",
    description: "Interactive competitive coding and algorithm visualization platform",
  };

  return (
    <>
      <Script
        id="json-ld-home"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeClient />
    </>
  );
}
