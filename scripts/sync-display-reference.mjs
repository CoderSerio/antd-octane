import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { theme } from "antd";
import ts from "typescript";
import { parseApi, readMarkdown } from "./reference-utils.mjs";

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
      String(values[token] ?? "-"),
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
