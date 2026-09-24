import { fileURLToPath } from "node:url";
import { octane } from "octane/compiler/vite";
import { defineConfig } from "vite";

export default defineConfig({
  root: fileURLToPath(new URL(".", import.meta.url)),
  base: "./",
  plugins: [octane()],
  resolve: {
    dedupe: ["octane"],
    alias: process.env.PACKED_CONSUMER
      ? {}
      : {
          "antd-octane/style.css": fileURLToPath(
            new URL("../packages/antd-octane/src/style.css", import.meta.url),
          ),
          "antd-octane": fileURLToPath(
            new URL("../packages/antd-octane/src/index.ts", import.meta.url),
          ),
        },
  },
  server: { host: "127.0.0.1", port: 4173, strictPort: true },
  build: { target: "es2022" },
});
