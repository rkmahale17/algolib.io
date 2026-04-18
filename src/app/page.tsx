import { Metadata } from 'next';
import HomeClient from './HomeClient';
import Script from 'next/script';

export const metadata: Metadata = {
// ... same as before
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
