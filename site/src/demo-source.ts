export interface SourceToken {
  text: string;
  kind?: string;
}
export interface DemoSourceVariants {
  typescript: string;
  javascript: string;
  typescriptTokens: SourceToken[];
  javascriptTokens: SourceToken[];
}
export interface DemoSourceModule {
  default: string;
  code?: DemoSourceVariants;
  examples?: Record<string, DemoSourceVariants>;
}

/** Hide tooling directives in displayed/copied examples, retaining explanatory comments. */
export function cleanDemoSource(source: string) {
  return source
    .replace(/^[ \t]*\{\s*\/\*\s*biome-ignore[^\n]*?\*\/\s*\}[ \t]*\r?\n/gm, "")
    .replace(
      /^[ \t]*\/\*\*?\s*(?:biome-ignore|@jsxImportSource)[^\n]*?\*\/[ \t]*\r?\n/gm,
      "",
    )
    .replace(/^[ \t]*\/\/\s*biome-ignore[^\n]*\r?\n/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * Demo files intentionally keep related examples together so their shared
 * data and helpers stay in one place.  The antd site shows one source block
 * per example, though, so select the exported demo (and the helpers it uses)
 * before rendering or copying the code.
 */
function findFunctionEnd(source: string, openBrace: number) {
  let depth = 0;
  let quote = "";
  let escaped = false;
  let lineComment = false;
  let blockComment = false;

  for (let index = openBrace; index < source.length; index += 1) {
    const char = source[index];
    const next = source[index + 1];

    if (lineComment) {
      if (char === "\n") lineComment = false;
      continue;
    }
    if (blockComment) {
      if (char === "*" && next === "/") {
        blockComment = false;
        index += 1;
      }
      continue;
    }
    if (quote) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === quote) {
        quote = "";
      }
      continue;
    }
    if (char === "/" && next === "/") {
      lineComment = true;
      index += 1;
      continue;
    }
    if (char === "/" && next === "*") {
      blockComment = true;
      index += 1;
      continue;
    }
    if (char === '"' || char === "'" || char === "`") {
      quote = char;
      continue;
    }
    if (char === "{") depth += 1;
    if (char === "}" && --depth === 0) return index + 1;
  }
  return source.length;
}

function trimUnusedImports(source: string) {
  const withoutImports = source.replace(
    /import\s+\{[\s\S]*?\}\s+from\s+["'][^"']+["'];?/g,
    "",
  );
  return source.replace(
    /import\s+\{([\s\S]*?)\}\s+from\s+(["'][^"']+["'])[ \t]*;?([ \t]*\r?\n)?/g,
    (
      _statement,
      names: string,
      moduleName: string,
      lineBreak: string | undefined,
    ) => {
      const kept = names
        .split(",")
        .map((name) => name.trim())
        .filter((name) => {
          const identifier = name
            .split(/\s+as\s+/i)
            .at(-1)
            ?.trim();
          return (
            identifier && new RegExp(`\\b${identifier}\\b`).test(withoutImports)
          );
        });
      return kept.length
        ? `import { ${kept.join(", ")} } from ${moduleName};${lineBreak ?? ""}`
        : "";
    },
  );
}

export function selectDemoSource(source: string, exportName?: string) {
  source = cleanDemoSource(source);
  if (!exportName) return source;
  const matches = Array.from(
    source.matchAll(
      /(^|\n)(export\s+)?function\s+([A-Za-z_$][\w$]*)\s*\([^)]*\)\s*\{/g,
    ),
  );
  if (!matches.length) return source;

  const functions = matches.map((match) => {
    const start = (match.index ?? 0) + match[1].length;
    const openBrace = (match.index ?? 0) + match[0].lastIndexOf("{");
    return {
      name: match[3],
      exported: /^export\s+function/.test(source.slice(start, start + 32)),
      start,
      end: findFunctionEnd(source, openBrace),
    };
  });
  const exported = new Map(
    functions.filter((item) => item.exported).map((item) => [item.name, item]),
  );
  if (!exported.has(exportName)) return source;

  const selected = new Set<string>();
  const byName = new Map(functions.map((item) => [item.name, item]));
  const visit = (name: string) => {
    if (selected.has(name)) return;
    const item = byName.get(name);
    if (!item) return;
    selected.add(name);
    const body = source.slice(item.start, item.end);
    for (const dependency of byName.keys()) {
      if (dependency !== name && new RegExp(`\\b${dependency}\\b`).test(body)) {
        visit(dependency);
      }
    }
  };
  visit(exportName);

  const spans = functions.filter((item) => selected.has(item.name));
  const chunks: string[] = [source.slice(0, functions[0].start)];
  for (const item of spans.sort((left, right) => left.start - right.start)) {
    chunks.push(source.slice(item.start, item.end));
  }
  const selectedSource = chunks.join("\n\n").replace(/\n{3,}/g, "\n\n");
  return trimUnusedImports(selectedSource)
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
