import { fileURLToPath } from "node:url";
import { octane } from "octane/compiler/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [octane()],
  build: {
    target: "es2022",
    outDir: fileURLToPath(new URL("./dist", import.meta.url)),
    emptyOutDir: true,
    lib: {
      entry: fileURLToPath(new URL("./src/entry.ts", import.meta.url)),
      formats: ["es"],
      fileName: "antd-octane",
      cssFileName: "antd-octane",
    },
    rollupOptions: {
      external: (id) => id === "octane" || id.startsWith("octane/"),
    },
  },
});
