import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { theme } from "antd";
import ts from "typescript";

// Ant Design 5.29.3 (MIT). See THIRD_PARTY_NOTICES.md for provenance.
// Run with a checkout of the pinned tag: node scripts/sync-display-reference.mjs /path/to/ant-design
const root = resolve(import.meta.dirname, "..");
const upstream = process.argv[2];
if (!upstream) throw new Error("Pass the Ant Design 5.29.3 source directory");
const version = JSON.parse(
  readFileSync(resolve(upstream, "package.json")),
).version;
if (version !== "5.29.3")
  throw new Error(`Expected 5.29.3, received ${version}`);
const components = {
  Avatar: "avatar",
  Badge: "badge",
  Calendar: "calendar",
  Card: "card",
  Carousel: "carousel",
  Collapse: "collapse",
  Descriptions: "descriptions",
  Empty: "empty",
  Image: "image",
  List: "list",
  Popover: "popover",
  QRCode: "qr-code",
  Segmented: "segmented",
  Statistic: "statistic",
  Table: "table",
  Tag: "tag",
  Timeline: "timeline",
  Tooltip: "tooltip",
  Tour: "tour",
  Tree: "tree",
  Spin: "spin",
  Skeleton: "skeleton",
  Progress: "progress",
  Result: "result",
  Alert: "alert",
  Message: "message",
  Notification: "notification",
  Modal: "modal",
  Drawer: "drawer",
  Popconfirm: "popconfirm",
  Watermark: "watermark",
  Affix: "affix",
  App: "app",
  ConfigProvider: "config-provider",
};
const npmRoot = resolve(root, "node_modules/antd");
const meta = JSON.parse(
  readFileSync(resolve(npmRoot, "es/version/token-meta.json")),
);
const data = JSON.parse(
  readFileSync(resolve(npmRoot, "es/version/token.json")),
);
const globals = theme.getDesignToken();
const categoryByComponent = new Map([
  ...Object.keys(components)
    .slice(0, 20)
    .map((component) => [component, "data-display"]),
  ...Object.keys(components)
    .slice(20, 31)
    .map((component) => [component, "feedback"]),
  ["Affix", "other"],
  ["App", "other"],
  ["ConfigProvider", "other"],
]);
const outputRoot = resolve(root, "site/src");
for (const category of new Set(categoryByComponent.values())) {
  mkdirSync(resolve(outputRoot, category), { recursive: true });
}

function adapt(text) {
  return text
    .trim()
    .replace(
      /React\.(?:ReactNode|ReactElement)|ReactNode|ReactElement/g,
      "OctaneNode",
    )
    .replace(/React\.CSSProperties/g, "CSSProperties")
    .replace(/React\.AriaAttributes/g, "AriaAttributes")
    .replace(/React\.MouseEvent<[^>]+>/g, "MouseEvent")
    .replace(/React\.Key/g, "string | number")
    .replace(/React 需要的 key/g, "Octane 需要的 key")
    .replace(/React\.FC\b/g, "Octane.FC")
    .replace(/\bComponentType\b/g, "ElementType")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/<InlinePopover\b[^>]*>(.*?)<\/InlinePopover>/g, "")
    .replace(/\\([[\]])/g, "$1")
    .replace(/<Badge\b[^>]*>(.*?)<\/Badge>/g, "$1");
}
function readMarkdown(path) {
  return readFileSync(path, "utf8").replace(
    /<embed src="([^"]+)"[^>]*><\/embed>/g,
    (_, relative) => readMarkdown(resolve(dirname(path), relative)),
  );
}

// Upstream release history does not describe the first Octane release.
const descriptionsWithoutVersionHistory = {
  Alert: { closable: "可关闭配置，支持 `aria-*`" },
  Modal: {
    closeIcon: "自定义关闭图标。设置为 `null` 或 `false` 时隐藏关闭按钮",
  },
  Drawer: {
    closeIcon: "自定义关闭图标。设置为 `null` 或 `false` 时隐藏关闭按钮",
  },
  Popconfirm: { open: "用于手动控制浮层显隐" },
  Avatar: { max: "设置最多显示相关配置" },
  Calendar: {
    dateFullCellRender:
      "自定义渲染日期单元格，返回内容覆盖单元格，建议使用 `fullCellRender`",
  },
  Image: {
    "~~rootClassName~~": "预览图的根 DOM 类名，不做推荐了",
  },
  Popover: {
    open: "用于手动控制浮层显隐（[为什么?](/docs/react/faq#弹层类组件为什么要统一至-open-属性)）",
  },
  Table: {
    filterDropdownProps: "自定义下拉属性",
    title: "列头显示文字",
  },
  Tag: {
    closeIcon: "自定义关闭按钮。设置为 `null` 或 `false` 时隐藏关闭按钮",
  },
  Tooltip: {
    open: "用于手动控制浮层显隐（[为什么?](/docs/react/faq#弹层类组件为什么要统一至-open-属性)）",
  },
};

function splitRow(line) {
  // Split only unescaped pipes; unions in Markdown tables use \|.
  return line
    .trim()
    .slice(1, -1)
    .split(/(?<!\\)\|/)
    .map((cell) => adapt(cell.replace(/\\\|/g, "|")));
}

function parseApi(text, component) {
  const start = text.indexOf("## API");
  const end = text.indexOf("## 主题变量", start);
  const lines = text.slice(start, end < 0 ? undefined : end).split("\n");
  const sections = [];
  let title = component;
  for (let i = 0; i < lines.length; i++) {
    const heading = lines[i].match(/^#{2,4}\s+(.+)/);
    if (heading && heading[1] !== "API")
      title = adapt(heading[1])
        .replace(/\s*\{#[^}]+\}/g, "")
        .replace(/\s+\d+\.\d+\.\d+\+?$/, "")
        .trim();
    if (!/^\|\s*(参数|属性|返回值)\s*\|/.test(lines[i])) continue;
    const defaultColumn = splitRow(lines[i]).indexOf("默认值");
    const rows = [];
    i += 2;
    while (lines[i]?.trim().startsWith("|")) {
      const cells = splitRow(lines[i]);
      if (cells.length < 3)
        throw new Error(`Invalid ${component} API row: ${lines[i]}`);
      // Same-named props in other sections may have no release history.
      const description = /\d+\.\d+\.\d+|\bv\d+\b/.test(cells[1])
        ? (descriptionsWithoutVersionHistory[component]?.[cells[0]] ?? cells[1])
        : cells[1];
      rows.push([
        cells[0],
        description,
        cells[2],
        defaultColumn < 0 ? "-" : (cells[defaultColumn] ?? "-"),
      ]);
      i++;
    }
    if (rows.length)
      sections.push({
        title:
          sections.length > 0 && title === component ? "共同的 API" : title,
        rows,
      });
  }
  if (!sections.length) throw new Error(`No API tables for ${component}`);
  return sections;
}
const interfaces = [];
for (const [component, slug] of Object.entries(components)) {
  const tokens = meta.components[component] ?? [];
  const api = parseApi(
    readMarkdown(resolve(upstream, `components/${slug}/index.zh-CN.md`)),
    component,
  );
  const rows = (entries, values) =>
    entries.map(({ token, desc, type }) => [
      token,
      desc,
      type,
      String(values[token] ?? "—"),
    ]);
  const tokenData = data[component] ?? { global: [], component: {} };
  const globalKeys = [...tokenData.global].sort((a, b) => {
    const aColor = a.toLowerCase().includes("color");
    const bColor = b.toLowerCase().includes("color");
    return aColor !== bColor ? (aColor ? -1 : 1) : a.localeCompare(b, "en");
  });
  const reference = {
    version,
    api,
    tokens: {
      component: rows(tokens, tokenData.component),
      global: rows(
        globalKeys
          .filter((token) => meta.global[token])
          .map((token) => ({ token, ...meta.global[token] })),
        globals,
      ),
    },
  };
  writeFileSync(
    resolve(outputRoot, categoryByComponent.get(component), `${slug}.json`),
    `${JSON.stringify(reference, null, 2)}\n`,
  );
  if (!tokens.length) continue;
  const path = resolve(npmRoot, `es/${slug}/style/index.d.ts`);
  const source = ts.createSourceFile(
    path,
    readFileSync(path, "utf8"),
    ts.ScriptTarget.Latest,
    true,
  );
  const declaration = source.statements.find(
    (node) =>
      ts.isInterfaceDeclaration(node) && node.name.text === "ComponentToken",
  );
  if (!declaration) throw new Error(`Missing ${component} ComponentToken`);
  // Published arrow token interfaces are empty. TreeSharedToken has public keys.
  const shared = source.statements.find(
    (node) =>
      ts.isInterfaceDeclaration(node) && node.name.text === "TreeSharedToken",
  );
  if (shared) interfaces.push(shared.getFullText(source).trim());
  interfaces.push(
    `// components/${slug}/style/index.ts\n${declaration
      .getFullText(source)
      .trim()
      .replace(/interface ComponentToken/, `interface ${component}Token`)
      .replace(
        / extends (?:ArrowToken, ArrowOffsetToken|ArrowOffsetToken, ArrowToken)/g,
        "",
      )}`,
  );
}
writeFileSync(
  resolve(root, "packages/antd-octane/src/theme/component-tokens.ts"),
  `// Adapted from Ant Design 5.29.3, MIT © 2015-present Ant UED.\n// Public component tokens; defaults are resolved by each native component.\n// Source: components/*/style/index.ts at 14f397749dca177e5495dc9d1c2f7debfb639545.\nimport type { CSSProperties } from "octane";\n\n${interfaces.join("\n\n")}\n`,
);
console.log(
  `Synchronized ${Object.keys(components).length} API/token references and ${interfaces.length} component token interfaces.`,
);
