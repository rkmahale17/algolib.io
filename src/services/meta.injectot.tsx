import { Helmet } from "react-helmet-async";
import Script from "next/script";

// Helper utilities
const siteBase = "https://rulcode.com";
const defaultOg = `${siteBase}/og-image.png`;

function capitalize(s: string) {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function buildTitle(algo: any) {
  return `${algo.name} – RulCode | ${algo.category} | ${capitalize(
    algo.difficulty
  )}`;
}

// === React component to inject meta tags dynamically ===
export function AlgoMetaHead({ algorithm }: { algorithm?: any }) {
  const algo = algorithm;

  // Build page-level defaults
  const title = algo
    ? buildTitle(algo)
    : "RulCode - Master 200+ Algorithms with Interactive Visualizations | Free & Open Source";
  const description = algo
    ? `${algo.name}: ${algo.description}. Code snippets in Python, Java, C++, and TypeScript. Time: ${algo.timeComplexity}. Space: ${algo.spaceComplexity}. Free & open-source resource for competitive programming.`
    : "RulCode is a free and open-source algorithm library for competitive programmers. Learn, visualize, and master algorithms with step-by-step explanations and multi-language snippets.";

  const keywords = algo
    ? [
        algo.id,
        algo.name,
        algo.category,
        "algorithms",
        "competitive programming",
        "python",
        "java",
        "c++",
        "typescript",
        "rulcode",
      ].join(", ")
    : "algorithms, open source, free, competitive programming, algorithm library, rulcode";

  const pageUrl = algo ? `${siteBase}/problem/${algo.id}` : siteBase;
  const ogImage = `${siteBase}/og-image.png`;

  // Build JSON-LD structured data
  const jsonLd = algo
    ? {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        headline: algo.name,
        description: algo.description,
        url: `${siteBase}/problem/${algo.id}`,
        image: {
          "@type": "ImageObject",
          url: ogImage,
          width: 1200,
          height: 630,
        },
        author: {
          "@type": "Organization",
          name: "RulCode",
          url: siteBase,
          logo: {
            "@type": "ImageObject",
            url: `${siteBase}/android-chrome-512x512.png`,
            width: 512,
            height: 512,
          },
        },
        publisher: {
          "@type": "Organization",
          name: "RulCode",
          url: siteBase,
          logo: {
            "@type": "ImageObject",
            url: `${siteBase}/android-chrome-512x512.png`,
            width: 512,
            height: 512,
          },
        },
        datePublished: "2024-01-01",
        dateModified: new Date().toISOString().split("T")[0],
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `${siteBase}/problem/${algo.id}`,
        },
        about: {
          "@type": "Thing",
          name: algo.category,
          description: `${algo.category} algorithms`,
        },
        keywords: [
          algo.id,
          algo.name,
          algo.category,
          "algorithm",
          "data structure",
          "competitive programming",
        ].join(", "),
        articleSection: algo.category,
        proficiencyLevel: algo.difficulty,
        educationalLevel:
          algo.difficulty === "beginner"
            ? "Beginner"
            : algo.difficulty === "intermediate"
            ? "Intermediate"
            : "Advanced",
        timeRequired: "PT5M",
      }
    : {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "RulCode",
        url: siteBase,
        description:
          "Free and open-source algorithm library for competitive programming",
        publisher: {
          "@type": "Organization",
          name: "RulCode",
          url: siteBase,
          logo: {
            "@type": "ImageObject",
            url: `${siteBase}/android-chrome-512x512.png`,
          },
        },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${siteBase}/?search={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      };

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="robots" content="index, follow" />

        {/* Open Graph */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content={algo ? "article" : "website"} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:image" content={ogImage || defaultOg} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@rulcode" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage || defaultOg} />

        {/* Canonical */}
        <link rel="canonical" href={pageUrl} />
      </Helmet>

      <Script
        id={`algo-json-ld-${algo?.id || 'default'}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {algo && (
        <Script
          id={`algo-breadcrumb-json-ld-${algo.id}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  item: {
                    "@id": siteBase,
                    name: "Home",
                  },
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  item: {
                    "@id": `${siteBase}/?category=${encodeURIComponent(
                      algo.category
                    )}`,
                    name: algo.category,
                  },
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  item: {
                    "@id": `${siteBase}/problem/${algo.id}`,
                    name: algo.name,
                  },
                },
              ],
            })
          }}
        />
      )}
    </>
  );
}

export default AlgoMetaHead;
