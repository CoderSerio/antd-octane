import { fileURLToPath } from "node:url";
import { octane } from "octane/compiler/vite";
import { defineConfig } from "vite";

export default defineConfig({
  root: fileURLToPath(new URL(".", import.meta.url)),
  base: "./",
  plugins: [octane()],
  optimizeDeps: {
    include: [
      "antd-octane > dayjs",
      "antd-octane > dayjs/plugin/advancedFormat",
      "antd-octane > dayjs/plugin/customParseFormat",
      "antd-octane > dayjs/plugin/localeData",
      "antd-octane > dayjs/plugin/weekday",
      "antd-octane > dayjs/plugin/weekOfYear",
      "antd-octane > dayjs/plugin/weekYear",
    ],
  },
  resolve: {
    dedupe: ["octane"],
  },
  server: { host: "127.0.0.1", port: 4173, strictPort: true },
  build: { target: "es2022" },
});
