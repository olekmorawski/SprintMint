import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: ["events"],
    },
  },
  resolve: {
    alias: {
      events: "events",
      buffer: "buffer/",
    },
  },
  // Include buffer polyfill
  optimizeDeps: {
    include: ["buffer"],
  },
});
