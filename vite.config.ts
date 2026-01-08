import path from "path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          // Inject data-source attribute for AI agent source location
          "./scripts/babel-plugin-jsx-source-location.cjs",
        ],
      },
    }),
    tailwindcss(),
  ],
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
  base: "./",
  build: {
    outDir: "dist",
    emptyOutDir: true,
    // Enable CSS minification with lightningcss
    cssMinify: "lightningcss",
    // Inline small assets, split larger ones
    assetsInlineLimit: 4096,
    // Code splitting configuration
    rollupOptions: {
      output: {
        // Manual chunks for better caching
        manualChunks: {
          "vendor-react": ["react", "react-dom"],
          "vendor-animation": ["framer-motion"],
          "vendor-charts": ["recharts"],
          "vendor-ui": [
            "@radix-ui/react-tooltip",
            "@radix-ui/react-dialog",
            "@radix-ui/react-popover",
            "@radix-ui/react-select",
          ],
        },
        // Better chunk naming
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]",
      },
    },
    // Target modern browsers for smaller bundles
    target: "esnext",
    // Enable minification (esbuild is default and faster)
    minify: true,
  },
});
