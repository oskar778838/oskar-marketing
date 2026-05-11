import { defineConfig } from "vite";

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
