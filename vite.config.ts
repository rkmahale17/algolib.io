import { componentTagger } from "lovable-tagger";
import compression from 'vite-plugin-compression';
import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react-swc"; 
import { prerenderPlugin } from "./vite.ssr.plugin";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  base: '/',
  plugins: [
    react(),
    compression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 10240,
      deleteOriginFile: false,
    }),
    mode === 'production' && prerenderPlugin(), // Only in production builds
    mode === "development" && componentTagger()
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {

      },
    },
  },
}));