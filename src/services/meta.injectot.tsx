import { Helmet } from "react-helmet-async";
import { algorithms } from "@/data/algorithms";
import {useParams} from "react-router-dom";

// Helper utilities
const siteBase = "https://algolib.io";
const defaultOg = `${siteBase}/og-image.png`;

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function buildTitle(algo: any) {
  return `${algo.name} – AlgoLib.io | ${algo.category} | ${capitalize(algo.difficulty)}`;
}
function capitalize(s: string) {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// === React component to inject meta tags dynamically ===
export function AlgoMetaHead({ id }: { id?: string }) {
  // If id not passed, try to read from route params
  const params = useParams();
  const routeId = id || (params as any).id || '';
  const algo = algorithms.find(a => a.id === routeId);

  // Build page-level defaults
  const title = algo ? buildTitle(algo) : 'AlgoLib.io – Open-Source Algorithm Library for Competitive Programming';
  const description = algo
    ? `${algo.name}: ${algo.description}. Code snippets in Python, Java, C++, and TypeScript. Time: ${algo.timeComplexity}. Space: ${algo.spaceComplexity}. Free & open-source resource for competitive programming.`
    : 'AlgoLib.io is a free and open-source algorithm library for competitive programmers. Learn, visualize, and master algorithms with step-by-step explanations and multi-language snippets.';

  const keywords = algo
    ? [algo.id, algo.name, algo.category, 'algorithms', 'competitive programming', 'python', 'java', 'c++', 'typescript', 'algolib'].join(', ')
    : 'algorithms, open source, free, competitive programming, algorithm library, algolib';

  const pageUrl = algo ? `${siteBase}/algorithm/${algo.id}` : siteBase;
  const ogImage = `${siteBase}/og-image.png`; // Use default OG image for all pages

  // Build JSON-LD structured data
  const jsonLd = algo ? {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": algo.name,
    "description": algo.description,
    "url": `${siteBase}/algorithm/${algo.id}`,
    "image": {
      "@type": "ImageObject",
      "url": ogImage,
      "width": 1200,
      "height": 630
    },
    "author": {
      "@type": "Organization",
      "name": "AlgoLib.io",
      "url": siteBase,
      "logo": {
        "@type": "ImageObject",
        "url": `${siteBase}/android-chrome-512x512.png`,
        "width": 512,
        "height": 512
      }
    },
    "publisher": {
      "@type": "Organization",
      "name": "AlgoLib.io",
      "url": siteBase,
      "logo": {
        "@type": "ImageObject",
        "url": `${siteBase}/android-chrome-512x512.png`,
        "width": 512,
        "height": 512
      }
    },
    "datePublished": "2024-01-01",
    "dateModified": new Date().toISOString().split('T')[0],
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${siteBase}/algorithm/${algo.id}`
    },
    "about": {
      "@type": "Thing",
      "name": algo.category,
      "description": `${algo.category} algorithms`
    },
    "keywords": [algo.id, algo.name, algo.category, 'algorithm', 'data structure', 'competitive programming'].join(', '),
    "articleSection": algo.category,
    "proficiencyLevel": algo.difficulty,
    "educationalLevel": algo.difficulty === 'beginner' ? 'Beginner' : algo.difficulty === 'intermediate' ? 'Intermediate' : 'Advanced',
    "timeRequired": "PT5M"
  } : {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "AlgoLib.io",
    "url": siteBase,
    "description": "Free and open-source algorithm library for competitive programming",
    "publisher": {
      "@type": "Organization",
      "name": "AlgoLib.io",
      "url": siteBase,
      "logo": {
        "@type": "ImageObject",
        "url": `${siteBase}/android-chrome-512x512.png`
      }
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${siteBase}/?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content="index, follow" />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={algo ? 'article' : 'website'} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:image" content={ogImage || defaultOg} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@algolib_io" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage || defaultOg} />

      {/* Canonical */}
      <link rel="canonical" href={pageUrl} />

      {/* JSON-LD - TechArticle or WebSite */}
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      
      {/* JSON-LD - BreadcrumbList for algorithm pages */}
      {algo && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "item": {
                  "@id": siteBase,
                  "name": "Home"
                }
              },
              {
                "@type": "ListItem",
                "position": 2,
                "item": {
                  "@id": `${siteBase}/?category=${encodeURIComponent(algo.category)}`,
                  "name": algo.category
                }
              },
              {
                "@type": "ListItem",
                "position": 3,
                "item": {
                  "@id": `${siteBase}/algorithm/${algo.id}`,
                  "name": algo.name
                }
              }
            ]
          })}
        </script>
      )}
    </Helmet>
  );
}



export default AlgoMetaHead;
