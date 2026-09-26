import { octane } from "octane/compiler/vite";
import { defineConfig } from "vite";
export default defineConfig({
  plugins: [octane()],
  server: { host: "127.0.0.1", port: 4175, strictPort: true },
});
