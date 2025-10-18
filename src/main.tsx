import "./index.css";

import App from "./App.tsx";
import { HelmetProvider } from "react-helmet-async";
import { createRoot } from "react-dom/client";

// 🔧 Runtime URL validation: Fix any malformed URLs in production
if (import.meta.env.PROD) {
  const currentUrl = window.location.href;
  
  // Check for malformed URLs like "http:path" or URLs with :8080
  if (currentUrl.match(/https?:[^\/]/) || currentUrl.includes(':8080')) {
    console.warn('🔧 Detected malformed URL, redirecting to correct format...');
    
    // Fix the URL
    let fixedUrl = currentUrl
      .replace(/:8080/g, '') // Remove port 8080
      .replace(/(https?):([^\/])/g, '$1://$2') // Fix missing //
      .replace(/http:\/\/(?!localhost)/g, 'https://'); // Force HTTPS
    
    // Only redirect if URL actually changed
    if (fixedUrl !== currentUrl) {
      window.location.replace(fixedUrl);
    }
  }
}

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);
