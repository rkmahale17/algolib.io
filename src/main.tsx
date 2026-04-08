import "./index.css";

import App from "./App.tsx";
import { HelmetProvider } from "react-helmet-async";
import { createRoot } from "react-dom/client";
import posthog from "posthog-js";
import { PostHogErrorBoundary, PostHogProvider } from "@posthog/react";

posthog.init(import.meta.env.VITE_PUBLIC_POSTHOG_TOKEN, {
  api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
  defaults: "2026-01-30",
});

// 🔧 Runtime URL validation: Fix any malformed URLs in production
if (import.meta.env.PROD) {
  const currentUrl = window.location.href;
  const currentHost = window.location.host;

  // Check for malformed URLs like "http:path" or URLs with :8080
  const hasPort8080 = currentUrl.includes(':8080') || currentHost.includes(':8080');
  const hasMalformedProtocol = currentUrl.match(/https?:[^\/]/);
  const isHttp = currentUrl.startsWith('http://') && !currentUrl.includes('localhost');

  if (hasPort8080 || hasMalformedProtocol || isHttp) {
    console.warn('🔧 Detected malformed URL, redirecting to correct format...', {
      current: currentUrl,
      hasPort8080,
      hasMalformedProtocol,
      isHttp
    });

    // Fix the URL
    let fixedUrl = currentUrl
      .replace(/:8080/g, '') // Remove port 8080
      .replace(/(https?):([^\/])/g, '$1://$2') // Fix missing //
      .replace(/http:\/\/(?!localhost)/g, 'https://'); // Force HTTPS

    // Remove trailing slash if present (except for root)
    if (fixedUrl.endsWith('/') && fixedUrl !== 'https://' + window.location.hostname + '/') {
      fixedUrl = fixedUrl.slice(0, -1);
    }

    // Only redirect if URL actually changed
    if (fixedUrl !== currentUrl) {
      console.log('🔧 Redirecting to:', fixedUrl);
      window.location.replace(fixedUrl);
    }
  }
}

createRoot(document.getElementById("root")!).render(
  <PostHogProvider client={posthog}>
    <PostHogErrorBoundary>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </PostHogErrorBoundary>
  </PostHogProvider>
);
