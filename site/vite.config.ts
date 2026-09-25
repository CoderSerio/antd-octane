import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { octane } from "octane/compiler/vite";
import { defineConfig, type Plugin } from "vite";

// Serve the same maintained Markdown sources in development and static builds.
function agentDocuments(): Plugin {
  const sources: Record<string, URL> = {
    "agent-guide.md": new URL("../docs/agent-guide.md", import.meta.url),
    "compatibility.md": new URL("../docs/compatibility.md", import.meta.url),
  };
  return {
    name: "agent-readable-documents",
    generateBundle() {
      for (const [fileName, source] of Object.entries(sources)) {
        this.addWatchFile(fileURLToPath(source));
        this.emitFile({
          type: "asset",
          fileName,
          source: readFileSync(source, "utf8"),
        });
      }
    },
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        const name = request.url?.split("?")[0]?.replace(/^\//, "") ?? "";
        if (!Object.hasOwn(sources, name)) return next();
        response.setHeader("Content-Type", "text/markdown; charset=utf-8");
        response.end(readFileSync(sources[name], "utf8"));
      });
    },
  };
}
export default defineConfig({
  root: fileURLToPath(new URL(".", import.meta.url)),
  base: "./",
  plugins: [octane(), agentDocuments()],
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
