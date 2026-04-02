// defineConfig from vitest/config merges Vitest's test types into Vite's config.
// With Vitest 2.x, there is no longer a bundled internal Vite copy — it uses
// the project's own vite package, so plugin types are always compatible.
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target:       "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
  test: {
    environment: "jsdom",
    globals:     true,
    setupFiles:  ["./tests/setup.ts"],
  },
});