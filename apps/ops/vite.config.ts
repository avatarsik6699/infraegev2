import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "~": fileURLToPath(new URL("./src", import.meta.url)) },
    tsconfigPaths: true,
  },
  build: { outDir: "dist/client", emptyOutDir: true },
  test: {
    clearMocks: true,
    restoreMocks: true,
    unstubGlobals: true,
  },
  server: {
    host: "127.0.0.1",
    port: 4174,
    strictPort: true,
    proxy: { "/api": "http://127.0.0.1:8787" },
  },
});
