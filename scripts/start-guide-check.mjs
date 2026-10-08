import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { Window } from "happy-dom";
import ts from "typescript";

const root = resolve(import.meta.dirname, "..");
const source = readFileSync(join(root, "site/src/pages/start.tsx"), "utf8");
const page = ts.createSourceFile(
  "start.tsx",
  source,
  ts.ScriptTarget.Latest,
  true,
  ts.ScriptKind.TSX,
);
const snippets = [];
function visit(node) {
  if (
    ts.isJsxSelfClosingElement(node) &&
    node.tagName.getText(page) === "Code"
  ) {
    const props = {};
    for (const attr of node.attributes.properties) {
      if (!ts.isJsxAttribute(attr) || !attr.initializer) continue;
      const value = ts.isJsxExpression(attr.initializer)
        ? attr.initializer.expression
        : attr.initializer;
      assert.ok(
        value && ts.isStringLiteral(value),
        "Guide Code props must be static strings",
      );
      props[attr.name.getText(page)] = value.text;
    }
    snippets.push(props);
  }
  ts.forEachChild(node, visit);
}
visit(page);

function snippet(language) {
  const matches = snippets.filter((entry) => entry.language === language);
  assert.equal(
    matches.length,
    1,
    `Expected one ${language ?? "tsx"} guide snippet`,
  );
  return matches[0].source;
}

const site = JSON.parse(readFileSync(join(root, "site/package.json"), "utf8"));
const dependencies = {};
const devDependencies = {};
for (const { language, source: command } of snippets) {
  if (language !== "bash" || !command.startsWith("pnpm add ")) continue;
  const args = command.split(/\s+/).slice(2);
  const target = args[0] === "-D" ? devDependencies : dependencies;
  if (args[0] === "-D") args.shift();
  for (const spec of args) {
    const match = /^([a-z][a-z\d-]*)@([\w.^~-]+)$/.exec(spec);
    assert.ok(match, `Unsupported guide dependency: ${spec}`);
    const [, name, version] = match;
    // The guide permits pinning releases. Match the version the public site consumes.
    target[name] =
      name === "antd-octane" && version === "alpha"
        ? site.dependencies[name]
        : version;
  }
}
assert.ok(
  dependencies["antd-octane"],
  "Guide must install the published component package",
);
assert.ok(dependencies.octane, "Guide must install the Octane runtime");

const directory = mkdtempSync(join(tmpdir(), "antd-octane-start-guide-"));
const run = (args) =>
  execFileSync("pnpm", args, { cwd: directory, stdio: "inherit" });
let win;
try {
  mkdirSync(join(directory, "src"));
  writeFileSync(
    join(directory, "package.json"),
    JSON.stringify({
      name: "start-guide-consumer",
      private: true,
      type: "module",
      dependencies,
      devDependencies,
    }),
  );
  for (const [language, filename] of [
    ["ts", "vite.config.ts"],
    ["json", "tsconfig.json"],
    ["html", "index.html"],
    [undefined, "src/main.tsx"],
  ]) {
    writeFileSync(join(directory, filename), snippet(language));
  }
  run(["install", "--prefer-offline", "--ignore-scripts"]);
  run(["exec", "tsc", "--noEmit"]);
  run(["exec", "vite", "build"]);

  // Exercise the built guide application; do not substitute workspace components.
  win = new Window({ url: "http://localhost/" });
  for (const key of [
    "window",
    "document",
    "navigator",
    "Node",
    "Text",
    "Comment",
    "Document",
    "DocumentFragment",
    "Element",
    "SVGElement",
    "HTMLElement",
    "HTMLInputElement",
    "HTMLButtonElement",
    "Event",
    "PointerEvent",
    "MouseEvent",
    "MutationObserver",
    "ResizeObserver",
    "CustomEvent",
    "getComputedStyle",
    "requestAnimationFrame",
    "cancelAnimationFrame",
  ]) {
    const value =
      key === "window"
        ? win
        : [
              "getComputedStyle",
              "requestAnimationFrame",
              "cancelAnimationFrame",
            ].includes(key)
          ? win[key].bind(win)
          : win[key];
    Object.defineProperty(globalThis, key, { value, configurable: true });
  }
  win.document.body.innerHTML = '<div id="root"></div>';
  const html = readFileSync(join(directory, "dist/index.html"), "utf8");
  const entry = html.match(/src="([^"]+\.js)"/)?.[1];
  assert.ok(entry, "Guide build must emit a JavaScript entry");
  const css = html.match(/href="([^"]+\.css)"/)?.[1];
  assert.ok(css, "Guide must include the component stylesheet");
  assert.match(
    readFileSync(join(directory, "dist", css.replace(/^\//, "")), "utf8"),
    /\.ant-btn/,
  );
  await import(
    pathToFileURL(join(directory, "dist", entry.replace(/^\//, ""))).href
  );
  await new Promise((done) => setTimeout(done, 30));
  const button = win.document.querySelector("button");
  assert.ok(button, "Guide must render its first button");
  assert.match(button.textContent, /已点击\s*0\s*次/);
  button.click();
  await new Promise((done) => setTimeout(done, 30));
  assert.match(
    win.document.querySelector("button")?.textContent ?? "",
    /已点击\s*1\s*次/,
  );
  console.log(
    `Public start guide passed: npm ${dependencies["antd-octane"]}, types, production build, stylesheet and counter interaction.`,
  );
} finally {
  await win?.happyDOM.close();
  if (process.env.KEEP_CONSUMER)
    console.log(`Guide consumer retained at ${directory}`);
  else rmSync(directory, { recursive: true, force: true });
}
// Octane's browser scheduler can retain a Node MessagePort after DOM cleanup.
// Reach this only after every assertion and cleanup has succeeded.
process.exit(0);
