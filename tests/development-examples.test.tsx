import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { ElementDescriptor } from "octane";
import { describe, expect, it } from "vitest";
import { augmentExamples } from "../site/src/development/layout-navigation";

const root = resolve(import.meta.dirname, "..");

// Ordinary examples in Ant Design 5.29.3, in upstream source order.
const expected: Record<string, string[]> = {
  divider: ["basic", "orientation", "size", "plain", "vertical", "variant"],
  flex: ["basic", "alignment", "gap", "wrapping", "combination"],
  grid: [
    "basic",
    "gutter",
    "offset",
    "sort",
    "flex",
    "flex-align",
    "flex-order",
    "flex-stretch",
    "responsive",
    "responsive-flex",
    "responsive-more",
    "playground",
    "useBreakpoint",
  ],
  layout: [
    "basic",
    "top",
    "top-side",
    "top-side-2",
    "side",
    "custom-trigger",
    "responsive",
    "fixed",
    "fixed-sider",
  ],
  space: [
    "basic",
    "vertical",
    "sizes",
    "alignment",
    "layout",
    "split",
    "compact",
    "compact-buttons",
    "compact-vertical",
  ],
  splitter: [
    "basic",
    "controlled",
    "more",
    "collapsible",
    "collapsibleIcon",
    "multiple",
    "nested",
    "lazy",
  ],
  anchor: [
    "basic",
    "horizontal",
    "static",
    "onClick",
    "customizeHighlight",
    "targetOffset",
    "onChange",
    "replace",
  ],
  breadcrumb: [
    "basic",
    "withIcon",
    "withParams",
    "separator",
    "overlay",
    "separator-component",
  ],
  dropdown: [
    "basic",
    "extra",
    "placement",
    "arrow",
    "item",
    "arrow-center",
    "trigger",
    "event",
    "dropdown-button",
    "custom-dropdown",
    "sub-menu",
    "overlay-open",
    "context-menu",
    "loading",
    "selectable",
  ],
  menu: [
    "horizontal",
    "inline",
    "inline-collapsed",
    "sider-current",
    "vertical",
    "theme",
    "submenu-theme",
    "switch-mode",
  ],
  pagination: [
    "basic",
    "align",
    "more",
    "changer",
    "jump",
    "mini",
    "simple",
    "controlled",
    "total",
    "all",
    "itemRender",
  ],
  steps: [
    "simple",
    "small-size",
    "icon",
    "step-next",
    "vertical",
    "vertical-small",
    "error",
    "progress-dot",
    "customized-progress-dot",
    "clickable",
    "nav",
    "progress",
    "label-placement",
    "inline",
  ],
  tabs: [
    "basic",
    "disabled",
    "centered",
    "icon",
    "custom-indicator",
    "slide",
    "extra",
    "size",
    "position",
    "card",
    "editable-card",
    "custom-add-trigger",
    "custom-tab-bar",
    "custom-tab-bar-node",
  ],
};

describe("development layout/navigation examples", () => {
  it.each(
    Object.entries(expected),
  )("%s keeps the complete upstream order", async (component, ids) => {
    const page = readFileSync(
      resolve(root, `site/src/pages/${component}.tsx`),
      "utf8",
    );
    const existing = [...page.matchAll(/<Demo\s+id="([^"]+)"/g)].map(
      (match) => <div id={match[1]} key={match[1]} />,
    );
    const result = await augmentExamples(component, existing);
    expect(result.map((node) => node.props.id)).toEqual(ids);
  });

  it("retains the missing Divider parameters in the copyable source", async () => {
    const examples = await augmentExamples("divider", []);
    for (const [id, parameters] of [
      ["size", ['size="small"', 'size="middle"', 'size="large"']],
      [
        "variant",
        ['variant="dotted"', 'variant="dashed"', 'borderColor: "#7cb305"'],
      ],
    ] as const) {
      const node = examples.find((example) => example.props.id === id) as
        | ElementDescriptor<{ source: () => Promise<{ default: string }> }>
        | undefined;
      const source = (await node?.props.source())?.default;
      for (const parameter of parameters) expect(source).toContain(parameter);
    }
  });

  it("gates the development catalog behind Vite DEV in both entry points", () => {
    const grid = readFileSync(resolve(root, "site/src/docs-ui.tsx"), "utf8");
    const main = readFileSync(resolve(root, "site/src/main.tsx"), "utf8");
    expect(grid).toContain("if (!import.meta.env.DEV || !component) return;");
    expect(main).toContain(
      'if (import.meta.env.DEV && demo?.startsWith("development/"))',
    );
  });

  it("lets Layout's four basic panels determine their own preview height", async () => {
    const examples = await augmentExamples("layout", []);
    const basic = examples.find(
      (example) => example.props.id === "basic",
    ) as ElementDescriptor<{ iframe?: unknown }>;
    expect(basic.props.iframe).toBeUndefined();
  });

  it("uses the upstream iframe settings for all Layout previews", async () => {
    const examples = await augmentExamples("layout", []);
    const framed = new Set(["side", "fixed", "fixed-sider"]);
    for (const example of examples) {
      const { id, iframe } = example.props as {
        id: string;
        iframe?: { demo: string; height: number };
      };
      if (framed.has(id))
        expect(iframe).toEqual({
          demo: `development/layout/${id}`,
          height: 360,
        });
      else expect(iframe).toBeUndefined();
    }
  });
});
