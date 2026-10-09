import { octane } from "octane/compiler/vite";
import { resolveConfig } from "vite";
import { describe, expect, it } from "vitest";
import { antdOctane } from "../packages/antd-octane/src/vite.mjs";

describe("Vite consumer integration", () => {
  it.each([
    false,
    true,
  ])("preserves application and Octane optimizer settings (plugin first: %s)", async (first) => {
    const plugins = first ? [antdOctane(), octane()] : [octane(), antdOctane()];
    const config = await resolveConfig(
      {
        configFile: false,
        plugins,
        optimizeDeps: { include: ["dayjs/locale/fr"], exclude: ["local-ui"] },
      },
      "serve",
    );
    expect(config.optimizeDeps.include).toContain("dayjs/locale/fr");
    expect(config.optimizeDeps.include).toContain("antd-octane > dayjs");
    expect(config.optimizeDeps.include).toContain(
      "antd-octane > dayjs/plugin/customParseFormat",
    );
    expect(config.optimizeDeps.exclude).toContain("local-ui");
    expect(config.optimizeDeps.exclude).toContain("octane");
  });

  it("leaves production dependency handling to the bundler", async () => {
    const config = await resolveConfig(
      { configFile: false, plugins: [octane(), antdOctane()] },
      "build",
    );
    expect(config.optimizeDeps.include ?? []).not.toContain(
      "antd-octane > dayjs",
    );
  });
});
