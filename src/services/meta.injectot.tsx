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
  const ogImage = `${siteBase}/og-images/${algo ? algo.id : 'og-image'}.png`;

  // Build JSON-LD that lists all algorithm pages (as requested)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "AlgoLib.io Algorithm Index",
    "description": "Index of algorithms available on AlgoLib.io (free & open-source).",
    "url": `${siteBase}/algorithm/`,
    "numberOfItems": algorithms.length,
    "itemListElement": algorithms.map((a, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "url": `${siteBase}/algorithm/${a.id}`,
      "name": a.name,
      "description": a.description
    }))
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

      {/* JSON-LD with full list of algorithms */}
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  );
}



export default AlgoMetaHead;
