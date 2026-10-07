import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(import.meta.dirname, "..");

it("loads site cascade declarations before library styles and excludes Button links from link resets", () => {
  const entry = readFileSync(resolve(root, "site/src/main.tsx"), "utf8");
  expect(entry.indexOf('import "./style.css";')).toBeLessThan(
    entry.indexOf('import "antd-octane/style.css";'),
  );
  const css = readFileSync(resolve(root, "site/src/style.css"), "utf8");
  expect(css).toMatch(/^@layer reset, antd, site;/);
  for (const state of ["", ":hover", ":active"])
    expect(css).toContain(`:where(.demo-content a:not(.ant-btn)${state}) {`);
});

it("uses the upstream documentation column configuration for layout and navigation pages", () => {
  const columns: Record<string, 1 | 2> = {
    flex: 1,
    space: 1,
    divider: 2,
    grid: 1,
    layout: 1,
    splitter: 1,
    anchor: 1,
    breadcrumb: 2,
    dropdown: 2,
    menu: 1,
    pagination: 1,
    steps: 1,
    tabs: 1,
  };
  for (const [name, count] of Object.entries(columns)) {
    const category = [
      "flex",
      "space",
      "divider",
      "grid",
      "layout",
      "splitter",
    ].includes(name)
      ? "layout"
      : "navigation";
    const reference = JSON.parse(
      readFileSync(resolve(root, `site/src/${category}/${name}.json`), "utf8"),
    );
    expect(reference.demoColumns).toBe(count);
    const page = readFileSync(
      resolve(root, `site/src/pages/${name}.tsx`),
      "utf8",
    );
    expect(page).toContain("columns={reference.demoColumns === 2 ? 2 : 1}");
  }
});

it("scopes site footer styling to site footers", () => {
  const css = readFileSync(resolve(root, "site/src/style.css"), "utf8");
  expect(css).not.toMatch(/^\s*footer\s*\{/m);
  expect(css).toContain(".site-footer,");
  expect(readFileSync(resolve(root, "site/src/App.tsx"), "utf8")).toContain(
    'footer className="site-footer"',
  );
});

it("does not hide API rows with a deprecated-parameter CSS rule", () => {
  const css = readFileSync(resolve(root, "site/src/style.css"), "utf8");
  expect(css).not.toContain(".reference-table tr:has(td:first-child del)");
});

it("stretches the Tabs overflow control across a vertical navigation column", () => {
  const css = readFileSync(
    resolve(root, "packages/antd-octane/src/style.css"),
    "utf8",
  );
  expect(css).toMatch(
    /:where\(\s*\.ant-tabs-left \.ant-tabs-nav > \.ao-dropdown-trigger,\s*\.ant-tabs-right \.ant-tabs-nav > \.ao-dropdown-trigger\s*\)\s*\{\s*flex-direction: column;/,
  );
});

it("uses the upstream viewport reset for isolated Anchor demos", () => {
  const main = readFileSync(resolve(root, "site/src/main.tsx"), "utf8");
  expect(main).toMatch(
    /const viewportDemo =\s*demo\.startsWith\("layout-"\) \|\| demo\.startsWith\("anchor\/"\);/,
  );
  expect(main).toContain(
    'document.body.style.padding = viewportDemo ? "0" : "24px";',
  );
  expect(main).toContain(
    'if (demo.startsWith("anchor/")) document.body.style.overflowX = "hidden";',
  );
});

it("uses the upstream paragraph reset inside layout and navigation demos", () => {
  const css = readFileSync(resolve(root, "site/src/style.css"), "utf8");
  expect(css).toContain(
    ":where(.demo-grid[data-component] .demo-content p, .layout-demo-frame p) {",
  );
  expect(css).toContain(
    ":where(.demo-grid[data-component] .demo-content p, .layout-demo-frame p) {\n    margin: 0;",
  );
  expect(css).toContain(
    ".main p:where(:not(.demo-grid[data-component] .demo-content p)) {",
  );
  expect(readFileSync(resolve(root, "site/src/docs-ui.tsx"), "utf8")).toContain(
    "data-component={component}",
  );
});

const publicExamples: Record<string, string[]> = {
  Flex: ["basic", "alignment", "gap", "wrapping", "combination"],
  Space: [
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
  Divider: ["basic", "orientation", "plain", "vertical"],
  Grid: [
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
  Layout: [
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
  Splitter: ["basic", "controlled", "more", "multiple", "nested", "resizable"],
  Anchor: [
    "basic",
    "horizontal",
    "static",
    "onClick",
    "customizeHighlight",
    "targetOffset",
    "onChange",
    "replace",
  ],
  Breadcrumb: ["basic", "withIcon", "separator", "separator-component"],
  Dropdown: [
    "basic",
    "placement",
    "item",
    "trigger",
    "event",
    "sub-menu",
    "overlay-open",
    "context-menu",
    "selectable",
  ],
  Menu: ["horizontal", "inline", "sider-current", "vertical"],
  Pagination: [
    "basic",
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
  Steps: [
    "simple",
    "small-size",
    "icon",
    "step-next",
    "vertical",
    "vertical-small",
    "error",
    "clickable",
    "label-placement",
  ],
  Tabs: [
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
  ],
};

const releaseBoundaryExamples: Record<string, string[]> = {
  Divider: ["size", "variant"],
  Splitter: ["collapsible", "collapsibleIcon", "lazy"],
  Breadcrumb: ["withParams", "overlay", "debug-routes", "component-token"],
  Dropdown: [
    "extra",
    "arrow",
    "arrow-center",
    "dropdown-button",
    "custom-dropdown",
    "loading",
  ],
  Menu: ["inline-collapsed", "theme", "submenu-theme", "switch-mode"],
  Pagination: ["align"],
  Steps: [
    "progress",
    "progress-dot",
    "customized-progress-dot",
    "nav",
    "inline",
  ],
  Tabs: ["custom-tab-bar", "custom-tab-bar-node"],
};

function pageSource(component: string) {
  const slug = component.toLowerCase();
  return readFileSync(resolve(root, `site/src/pages/${slug}.tsx`), "utf8");
}

describe("layout/navigation documentation coverage", () => {
  it.each(
    Object.entries(publicExamples),
  )("%s keeps every published demo anchor", (component, ids) => {
    const source = pageSource(component);
    for (const id of ids) expect(source).toContain(`id="${id}"`);
  });

  it.each(
    Object.entries(publicExamples),
  )("%s keeps the published demo count exact", (component, expected) => {
    const actual = [
      ...pageSource(component).matchAll(/<Demo\s+id="([^"]+)"/g),
    ].map((match) => match[1]);
    expect(actual).toEqual(expected);
  });

  it("keeps API references pinned to Ant Design 5.29.3", () => {
    const components = [
      "flex",
      "space",
      "divider",
      "grid",
      "layout",
      "splitter",
    ];
    const navigation = [
      "anchor",
      "breadcrumb",
      "dropdown",
      "menu",
      "pagination",
      "steps",
      "tabs",
    ];
    for (const category of ["layout", "navigation"])
      for (const slug of category === "layout" ? components : navigation) {
        const reference = JSON.parse(
          readFileSync(
            resolve(root, `site/src/${category}/${slug}.json`),
            "utf8",
          ),
        );
        expect(reference.version).toBe("5.29.3");
        for (const section of reference.api)
          for (const row of section.rows) expect(row[3]).not.toBe("—");
        for (const row of [
          ...reference.tokens.component,
          ...reference.tokens.global,
        ])
          expect(row[3]).not.toBe("—");
      }
  });

  it("documents the release boundary for deferred advanced cases", () => {
    const notes = readFileSync(
      resolve(root, "site/src/component-compatibility.tsx"),
      "utf8",
    ).replace(/\s+/g, " ");
    for (const signal of [
      "zeroWidthTriggerStyle",
      "Panel.collapsible",
      "params、",
      "itemRender",
      "Dropdown.arrow、popupRender、Dropdown.Button",
      "inlineCollapsed",
      "progressDot、navigation / inline、percent",
      "renderTabBar",
    ])
      expect(notes).toContain(signal);

    expect(notes).toContain("公共页目前发布 4 个上游示例");
    expect(notes).toContain("公共页的 Dropdown");
    expect(notes).toMatch(/公共页的 Dropdown 目前发布 9 个上游示例/u);
    expect(notes).toMatch(/公共页目前\s*发布 12 个上游示例/u);
    for (const [component, ids] of Object.entries(releaseBoundaryExamples)) {
      expect(publicExamples[component]).toBeDefined();
      for (const id of ids) expect(publicExamples[component]).not.toContain(id);
    }
  });
});
