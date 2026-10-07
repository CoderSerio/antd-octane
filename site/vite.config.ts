import { fileURLToPath } from "node:url";
import { octane } from "octane/compiler/vite";
import { defineConfig } from "vite";
import { demoSourcePlugin } from "./demo-source-plugin";

export default defineConfig({
  root: fileURLToPath(new URL(".", import.meta.url)),
  base: "./",
  plugins: [demoSourcePlugin(), octane()],
  resolve: {
    dedupe: ["octane"],
  },
  server: { host: "127.0.0.1", port: 4173, strictPort: true },
  build: { target: "es2022" },
});
