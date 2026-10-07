import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import type { Plugin } from "vite";
import {
  cleanDemoSource,
  type DemoSourceVariants,
  type SourceToken,
  selectDemoSource,
} from "./src/demo-source";

const biome = createRequire(import.meta.url).resolve(
  "@biomejs/biome/bin/biome",
);
const sourceCache = new Map<string, DemoSourceVariants>();

function highlight(source: string): SourceToken[] {
  const file = ts.createSourceFile(
    "demo.tsx",
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const ranges: { start: number; end: number; kind: string }[] = [];
  const mark = (node: ts.Node, kind: string) => {
    ranges.push({ start: node.getStart(file), end: node.end, kind });
  };
  const visit = (node: ts.Node) => {
    if (
      ts.isJsxOpeningElement(node) ||
      ts.isJsxClosingElement(node) ||
      ts.isJsxSelfClosingElement(node)
    )
      mark(node.tagName, "tag");
    if (ts.isJsxAttribute(node)) mark(node.name, "attribute");
    if (ts.isTypeReferenceNode(node)) mark(node.typeName, "type");
    if (
      (ts.isFunctionDeclaration(node) || ts.isMethodDeclaration(node)) &&
      node.name
    )
      mark(node.name, "function");
    if (ts.isCallExpression(node) && ts.isIdentifier(node.expression))
      mark(node.expression, "function");
    if (ts.isJsxText(node)) mark(node, "text");
    ts.forEachChild(node, visit);
  };
  visit(file);
  const scanner = ts.createScanner(
    ts.ScriptTarget.Latest,
    false,
    ts.LanguageVariant.JSX,
    source,
  );
  const tokens: SourceToken[] = [];
  while (scanner.scan() !== ts.SyntaxKind.EndOfFileToken) {
    const token = scanner.getToken();
    const start = scanner.getTokenPos();
    const text = scanner.getTokenText();
    const range = ranges.find(
      (item) => item.start <= start && scanner.getTextPos() <= item.end,
    );
    let kind = range?.kind;
    if (!kind) {
      if (
        token === ts.SyntaxKind.StringLiteral ||
        token === ts.SyntaxKind.NoSubstitutionTemplateLiteral ||
        token === ts.SyntaxKind.TemplateHead ||
        token === ts.SyntaxKind.TemplateMiddle ||
        token === ts.SyntaxKind.TemplateTail
      )
        kind = "string";
      else if (
        token === ts.SyntaxKind.NumericLiteral ||
        token === ts.SyntaxKind.BigIntLiteral
      )
        kind = "number";
      else if (
        token === ts.SyntaxKind.SingleLineCommentTrivia ||
        token === ts.SyntaxKind.MultiLineCommentTrivia
      )
        kind = "comment";
      else if (
        token >= ts.SyntaxKind.FirstKeyword &&
        token <= ts.SyntaxKind.LastKeyword
      )
        kind = "keyword";
      else if (
        token >= ts.SyntaxKind.FirstPunctuation &&
        token <= ts.SyntaxKind.LastPunctuation
      )
        kind = "punctuation";
    }
    tokens.push({ text, ...(kind && kind !== "text" ? { kind } : {}) });
  }
  return tokens;
}

/** Ant Design's tsToJs options: erase types and preserve JSX without browser compilation. */
export function buildDemoSource(
  source: string,
  exportName?: string,
): DemoSourceVariants {
  const typescript = selectDemoSource(source, exportName);
  const cached = sourceCache.get(typescript);
  if (cached) return cached;
  const emitted = ts
    .transpileModule(typescript, {
      fileName: "demo.tsx",
      compilerOptions: {
        target: ts.ScriptTarget.ES2020,
        module: ts.ModuleKind.ESNext,
        jsx: ts.JsxEmit.Preserve,
        esModuleInterop: true,
        removeComments: false,
        isolatedModules: true,
        noEmitHelpers: true,
      },
    })
    .outputText.trim();
  const formatted = spawnSync(
    process.execPath,
    [biome, "format", "--stdin-file-path=demo.jsx"],
    { input: emitted, encoding: "utf8" },
  );
  const javascript = formatted.status === 0 ? formatted.stdout.trim() : emitted;
  const result = {
    typescript,
    javascript,
    typescriptTokens: highlight(typescript),
    javascriptTokens: highlight(javascript),
  };
  sourceCache.set(typescript, result);
  return result;
}

/** Raw demo source exports its display forms; compiler code stays in the build process. */
export function demoSourcePlugin(): Plugin {
  const directories = ["./src/demos/", "./src/development/demos/"].map((path) =>
    fileURLToPath(new URL(path, import.meta.url)),
  );
  return {
    name: "antd-octane-demo-source",
    enforce: "pre",
    load(id) {
      const [path, query] = id.split("?");
      if (
        query !== "raw" ||
        !path.endsWith(".tsx") ||
        !directories.some((directory) => path.startsWith(directory))
      )
        return;
      this.addWatchFile(path);
      const source = cleanDemoSource(readFileSync(path, "utf8"));
      const examples = Object.fromEntries(
        [...source.matchAll(/export\s+function\s+(\w+)\s*\(/g)].map((match) => [
          match[1],
          buildDemoSource(source, match[1]),
        ]),
      );
      return `export default ${JSON.stringify(source)};\nexport const code = ${JSON.stringify(buildDemoSource(source))};\nexport const examples = ${JSON.stringify(examples)};\n`;
    },
  };
}
