import { octane } from "octane/compiler/vite";
import { defineConfig } from "vitest/config";
import { demoSourcePlugin } from "./site/demo-source-plugin";

export default defineConfig({
  plugins: [demoSourcePlugin(), octane({ ssr: false })],
  test: { environment: "happy-dom", include: ["tests/**/*.test.{ts,tsx}"] },
});
