import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  define: {
    "process.env.REACT_APP_PINATA_API_KEY": JSON.stringify(
      process.env.REACT_APP_PINATA_API_KEY
    ),
    "process.env.REACT_APP_PINATA_SECRET_API_KEY": JSON.stringify(
      process.env.REACT_APP_PINATA_SECRET_API_KEY
    ),
  },
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
