import { defineConfig } from "vite";
import { resolve } from "node:path";

// `base` is set at deploy time via env var so the same build works for
// custom domains and GitHub Pages subpaths.
//   GH Pages user-subpath:  VITE_BASE=/oskarmarketing/ npm run build
//   custom domain / root:   npm run build
const base = process.env.VITE_BASE ?? "/";

export default defineConfig({
  base,
  build: {
    target: "es2022",
    cssMinify: true,
    minify: "esbuild",
    sourcemap: false,
    rollupOptions: {
      // Multi-page setup. Bio at /, Pro at /pro/.
      // Pro is a hidden funnel — noindex + robots.txt Disallow.
      input: {
        main: resolve(__dirname, "index.html"),
        pro: resolve(__dirname, "pro/index.html"),
      },
      output: {
        manualChunks: {
          three: ["three"],
          gsap: ["gsap"],
        },
      },
    },
  },
  server: {
    host: "127.0.0.1",
    port: 5173,
    open: false,
  },
});
