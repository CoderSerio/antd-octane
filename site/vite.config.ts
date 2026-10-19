import { fileURLToPath } from "node:url";
import { antdOctane } from "antd-octane/vite";
import { octane } from "octane/compiler/vite";
import { defineConfig } from "vite";

export default defineConfig({
  root: fileURLToPath(new URL(".", import.meta.url)),
  base: "./",
  plugins: [octane(), antdOctane()],
  resolve: {
    dedupe: ["octane"],
  },
  server: { host: "127.0.0.1", port: 4173, strictPort: true },
  build: { target: "es2022" },
});
