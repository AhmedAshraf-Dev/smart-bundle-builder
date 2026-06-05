import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

/**
 * Smart Bundle Builder
 * Frontend Engineering Assessment
 *
 * Tech Stack:
 * - React 18
 * - TypeScript
 * - Vite
 * - Ant Design
 * - TailwindCSS
 *

 */

export default defineConfig({
  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  assetsInclude: ["**/*.svg", "**/*.csv"],

  server: {
    open: true,
    port: 3000,
  },

  preview: {
    port: 4173,
  },
});
