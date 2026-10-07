import { octane } from "octane/compiler/vite";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [octane({ ssr: false })],
  test: { environment: "happy-dom", include: ["tests/**/*.test.{ts,tsx}"] },
});
