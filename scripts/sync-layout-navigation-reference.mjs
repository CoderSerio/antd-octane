import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { theme } from "antd";
import { adapt, parseApi, readMarkdown } from "./reference-utils.mjs";

// Pinned Ant Design 5.29.3 (MIT); framework types are adapted for Octane.
const root = resolve(import.meta.dirname, "..");
const upstream = process.argv[2];
if (!upstream) throw new Error("Pass the Ant Design 5.29.3 source directory");
const version = JSON.parse(
  readFileSync(resolve(upstream, "package.json")),
).version;
if (version !== "5.29.3")
  throw new Error(`Expected 5.29.3, received ${version}`);
const components = {
  layout: {
    Flex: "flex",
    Space: "space",
    Divider: "divider",
    Grid: "grid",
    Layout: "layout",
    Splitter: "splitter",
  },
  navigation: {
    Anchor: "anchor",
    Breadcrumb: "breadcrumb",
    Dropdown: "dropdown",
    Menu: "menu",
    Pagination: "pagination",
    Steps: "steps",
    Tabs: "tabs",
  },
};
const npmRoot = resolve(root, "node_modules/antd");
const meta = JSON.parse(
  readFileSync(resolve(npmRoot, "es/version/token-meta.json")),
);
const data = JSON.parse(
  readFileSync(resolve(npmRoot, "es/version/token.json")),
);
const globals = theme.getDesignToken();
const rows = (entries, values) =>
  entries.map(({ token, desc, type }) => [
    token,
    desc,
    type,
    String(values[token] ?? "-"),
  ]);
const prosePath = resolve(root, "site/src/component-prose.json");
const prose = JSON.parse(readFileSync(prosePath));
function usageText(component, text) {
  let result = adapt(text)
    .replace(/^\s*\{#[^}]+\}\s*/u, "")
    .replace(/（自 `antd@[\d.]+` 版本开始提供该组件）/gu, "");
  if (component === "Anchor") result = result.split("\n> 开发者注意事项：")[0];
  if (component === "Breadcrumb")
    result = result.replace(
      /```jsx[\s\S]*?```/u,
      "```jsx\nreturn <Breadcrumb items={[{ title: 'sample' }]} />;\n```",
    );
  return result.trim();
}
function between(source, start, end) {
  const from = source.indexOf(start);
  if (from < 0) return "";
  const to = source.indexOf(end, from + start.length);
  return source.slice(from + start.length, to < 0 ? undefined : to).trim();
}
for (const [category, group] of Object.entries(components)) {
  mkdirSync(resolve(root, "site/src", category), { recursive: true });
  for (const [component, slug] of Object.entries(group)) {
    const source = readMarkdown(
      resolve(upstream, `components/${slug}/index.zh-CN.md`),
    );
    const whenStart = source.indexOf("## 何时使用");
    const whenEnd = source.indexOf("\n## ", whenStart + 1);
    const api = parseApi(source, component);
    const sectionHeadings = Object.fromEntries(
      api.map(({ title }) => {
        const line = source
          .split("\n")
          .find(
            (line) =>
              /^#{3,4}\s/.test(line) &&
              adapt(line.replace(/^#+\s/, "")) === title,
          );
        return [title, line ? line.match(/^#+/)[0].length : 0];
      }),
    );
    prose[component] = {
      description: source.match(/^description: (.+)$/mu)?.[1],
      ...(whenStart >= 0
        ? {
            when: usageText(
              component,
              source.slice(
                whenStart + "## 何时使用".length,
                whenEnd < 0 ? undefined : whenEnd,
              ),
            ),
          }
        : {}),
      sectionHeadings,
    };
    if (component === "Flex")
      prose[component].apiIntro =
        "> Flex 组件默认行为在水平模式下，为向上对齐，在垂直模式下，为拉伸对齐，你可以通过属性进行调整。";
    if (component === "Splitter")
      prose[component].apiIntro =
        "> Splitter 组件需要通过子元素计算面板大小，因而其子元素仅支持 `Splitter.Panel`。";
    if (component === "Layout") {
      prose[component].beforeExamples = adapt(
        `## 设计规则\n\n${between(source, "## 设计规则", "## 代码演示")}`,
      );
      prose[component].apiIntro = between(source, "## API", "### Layout")
        .replace(/通用属性参考：[^\n]+/gu, "")
        .trim();
      prose[component].sectionIntro = {
        Layout: "布局容器。",
        "Layout.Sider": "侧边栏。",
      };
      prose[component].sectionAfter = {
        "Layout.Sider": `#### breakpoint width\n\n${between(source, "#### breakpoint width", "## 主题变量")}`,
      };
    }
    if (component === "Grid") {
      prose[component].beforeExamples = adapt(
        `## 设计理念\n\n${between(source, "## 设计理念", "## 代码演示")}`,
      ).replace(
        /<div class="grid-demo">\s*<img draggable="false" src="([^"]+)" alt="([^"]+)"\s*\/>\s*<\/div>/u,
        "![$2]($1)",
      );
      prose[component].afterApi = adapt(
        source.slice(
          source.indexOf("您可以使用"),
          source.indexOf("## 主题变量"),
        ),
      )
        .replace(/（自 5\.1\.0 起，\[codesandbox demo\]\([^\n]+?\)）/u, "")
        .trim();
    }
    if (component === "Space") {
      prose[component].sectionBefore = {
        "Space.Compact": `### Size\n\n${between(source, "### Size", "### Space.Compact")}`,
      };
      prose[component].sectionIntro = {
        // The Octane package has no Cascader, date/time picker or TreeSelect yet.
        "Space.Compact":
          "需要表单组件之间紧凑连接且合并边框时，使用 Space.Compact，支持的组件有：\n\n- Button\n- AutoComplete\n- Input/Input.Search\n- InputNumber\n- Select",
        "Space.Addon": "用于在紧凑布局中创建自定义单元格。",
      };
    }
    if (component === "Anchor")
      prose[component].sectionIntro = { "Link Props": "建议使用 items 形式。" };
    if (component === "Breadcrumb") {
      prose[component].sectionBefore = {
        RouteItemType: `### ItemType\n\n${between(source, "### ItemType", "### RouteItemType")}`,
      };
      prose[component].sectionIntro = {
        SeparatorType: between(source, "### SeparatorType", "| 参数"),
      };
    }
    if (component === "Dropdown") {
      prose[component].sectionIntro = {
        "Dropdown.Button": "属性与 Dropdown 的相同。还包含以下属性：",
      };
      prose[component].afterApi =
        `## 注意\n\n${between(source, "## 注意", "## 主题变量")}`;
    }
    if (component === "Menu") {
      prose[component].beforeExamples = adapt(
        `## 开发者注意事项\n\n${between(source, "## 开发者注意事项", "## 代码演示")}`,
      );
      prose[component].sectionBefore = {
        MenuItemType: `### ItemType\n\n${between(source, "### ItemType", "#### MenuItemType")}`,
      };
      prose[component].sectionIntro = {
        MenuItemGroupType: between(source, "#### MenuItemGroupType", "| 参数"),
        MenuDividerType: between(source, "#### MenuDividerType", "| 参数"),
      };
    }
    if (component === "Pagination")
      prose[component].apiIntro =
        "```jsx\n<Pagination onChange={onChange} total={50} />\n```";
    if (component === "Steps")
      prose[component].sectionIntro = {
        Steps: "整体步骤条。",
        StepItem: "步骤条内的每一个步骤。",
      };
    const tokens = data[component] ?? { global: [], component: {} };
    const globalKeys = [...tokens.global].sort((a, b) => {
      const aColor = a.toLowerCase().includes("color"),
        bColor = b.toLowerCase().includes("color");
      return aColor !== bColor ? (aColor ? -1 : 1) : a.localeCompare(b, "en");
    });
    const reference = {
      version,
      demoColumns: /^\s+cols:\s*2\s*$/mu.test(source.split("---")[1] ?? "")
        ? 2
        : 1,
      api,
      tokens: {
        component: rows(meta.components[component] ?? [], tokens.component),
        global: rows(
          globalKeys
            .filter((token) => meta.global[token])
            .map((token) => ({ token, ...meta.global[token] })),
          globals,
        ),
      },
    };
    writeFileSync(
      resolve(root, "site/src", category, `${slug}.json`),
      `${JSON.stringify(reference, null, 2)}\n`,
    );
  }
}
writeFileSync(prosePath, `${JSON.stringify(prose, null, 2)}\n`);
console.log("Synchronized 13 layout/navigation API and token references.");
