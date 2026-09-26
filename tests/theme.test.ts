import { theme as antdTheme } from "antd";
import { describe, expect, it } from "vitest";
import {
  compactAlgorithm,
  darkAlgorithm,
  defaultAlgorithm,
  getDesignToken,
  mergeTheme,
  resolveButtonAlias,
} from "../packages/antd-octane/src/theme/resolve";
import type {
  MappingAlgorithm,
  ThemeConfig,
} from "../packages/antd-octane/src/theme/types";

const tokens = [
  {},
  { colorPrimary: "#722ed1", borderRadius: 12, fontSize: 16 },
  {
    colorPrimary: "#13a8a8",
    colorBgBase: "#f8f5ef",
    controlHeight: 38,
    motion: false,
  },
  { colorText: "#123456", colorPrimaryHover: "#ff00ff", padding: 23 },
];
const algorithms = [
  ["default", defaultAlgorithm, antdTheme.defaultAlgorithm],
  ["dark", darkAlgorithm, antdTheme.darkAlgorithm],
  ["compact", compactAlgorithm, antdTheme.compactAlgorithm],
  [
    "dark + compact",
    [darkAlgorithm, compactAlgorithm],
    [antdTheme.darkAlgorithm, antdTheme.compactAlgorithm],
  ],
] as const;

describe("antd 5.29.3 global token parity", () => {
  for (const [name, ours, upstream] of algorithms) {
    for (const token of tokens) {
      it(`${name}: ${JSON.stringify(token)}`, () => {
        const actual = getDesignToken({
          token,
          algorithm: ours as MappingAlgorithm | MappingAlgorithm[],
        });
        const expected = antdTheme.getDesignToken({
          token,
          algorithm: upstream as typeof antdTheme.defaultAlgorithm,
        });
        expect(actual).toEqual(expected);
      });
    }
  }
  it("supports a user supplied algorithm without mutating the preset", () => {
    const custom: MappingAlgorithm = (seed, previous) => ({
      ...defaultAlgorithm(seed),
      ...previous,
      colorPrimary: "#123456",
      controlHeight: 47,
    });
    const preset = Object.freeze({
      token: Object.freeze({ colorPrimary: "#722ed1" }),
      algorithm: custom,
    });
    expect(getDesignToken(preset)).toEqual(antdTheme.getDesignToken(preset));
  });
  it("merges nested presets and can reset inherited theme", () => {
    const parent: ThemeConfig = {
      token: { colorPrimary: "#722ed1" },
      algorithm: darkAlgorithm,
      components: { Button: { fontWeight: 600 } },
    };
    const child = mergeTheme(parent, {
      token: { borderRadius: 12 },
      components: { Button: { primaryColor: "#fff" } },
    });
    expect(child.token).toEqual({ colorPrimary: "#722ed1", borderRadius: 12 });
    expect(child.components?.Button).toEqual({
      fontWeight: 600,
      primaryColor: "#fff",
    });
    expect(getDesignToken(mergeTheme(parent, { inherit: false }))).toEqual(
      antdTheme.getDesignToken(),
    );
    expect(parent.token).toEqual({ colorPrimary: "#722ed1" });
  });
  it("derives component tokens only when requested", () => {
    const config: ThemeConfig = {
      token: { colorPrimary: "#1677ff" },
      components: { Button: { colorPrimary: "#722ed1" } },
    };
    const global = getDesignToken(config);
    expect(resolveButtonAlias(config, global).colorPrimaryHover).toBe(
      global.colorPrimaryHover,
    );
    const derived = resolveButtonAlias(
      {
        ...config,
        components: {
          Button: { ...config.components?.Button, algorithm: true },
        },
      },
      global,
    );
    expect(derived.colorPrimaryHover).toBe(
      antdTheme.getDesignToken({ token: { colorPrimary: "#722ed1" } })
        .colorPrimaryHover,
    );
  });
});
