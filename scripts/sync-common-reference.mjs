import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { theme } from "antd";
import { parseApi, readMarkdown } from "./reference-utils.mjs";

// Ant Design 5.29.3 (MIT). See THIRD_PARTY_NOTICES.md.
// Run with a checkout of the pinned tag:
// node scripts/sync-common-reference.mjs /path/to/ant-design
const root = resolve(import.meta.dirname, "..");
const upstream = process.argv[2];
if (!upstream) throw new Error("Pass the Ant Design 5.29.3 source directory");
const version = JSON.parse(
  readFileSync(resolve(upstream, "package.json")),
).version;
if (version !== "5.29.3")
  throw new Error(`Expected 5.29.3, received ${version}`);

const components = {
  Button: "button",
  Typography: "typography",
  FloatButton: "float-button",
  Icon: "icon",
};
const npmRoot = resolve(root, "node_modules/antd");
const meta = JSON.parse(
  readFileSync(resolve(npmRoot, "es/version/token-meta.json")),
);
const data = JSON.parse(
  readFileSync(resolve(npmRoot, "es/version/token.json")),
);
const globals = theme.getDesignToken();
const outputRoot = resolve(root, "site/src/general");
mkdirSync(outputRoot, { recursive: true });

const rows = (entries, values) =>
  entries.map(({ token, desc, type }) => [
    token,
    desc,
    type,
    String(values[token] ?? "-"),
  ]);

for (const [component, slug] of Object.entries(components)) {
  const tokens = meta.components[component] ?? [];
  const api = parseApi(
    readMarkdown(resolve(upstream, `components/${slug}/index.zh-CN.md`)),
    component,
  );
  const tokenData = data[component] ?? { global: [], component: {} };
  const globalKeys = [...tokenData.global].sort((a, b) => {
    const aColor = a.toLowerCase().includes("color");
    const bColor = b.toLowerCase().includes("color");
    return aColor !== bColor ? (aColor ? -1 : 1) : a.localeCompare(b, "en");
  });
  writeFileSync(
    resolve(outputRoot, `${slug}.json`),
    `${JSON.stringify(
      {
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
      },
      null,
      2,
    )}\n`,
  );
}

console.log(
  `Synchronized ${Object.keys(components).length} common references.`,
);
