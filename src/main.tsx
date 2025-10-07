import "./index.css";

import App from "./App.tsx";
import { HelmetProvider } from "react-helmet-async";
import { createRoot } from "react-dom/client";

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);
