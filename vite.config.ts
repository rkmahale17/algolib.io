import { componentTagger } from "lovable-tagger";
import compression from 'vite-plugin-compression';
import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(),

  compression({
    algorithm: 'brotliCompress', // Add Brotli compression
    ext: '.br',
    threshold: 10240,
    deleteOriginFile: false,
  }),

  mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
