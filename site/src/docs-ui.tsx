import { theme } from "antd-octane";
import type { OctaneNode } from "octane";
import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useState,
} from "octane";
import { upstreamSlug } from "./component-coverage";
import { DemoIframe } from "./demo-frame";
import { Icon } from "./icons";
import { readPageToc } from "./page-toc";

function Highlight({ source }: { source: string }) {
  const parts = source.split(
    /(\/\/[^\n]*|\/\*[\s\S]*?\*\/|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`|\b(?:import|from|export|default|function|return|const|let|if|else|type|interface|true|false|null|undefined|new|async|await)\b|\b\d+\b)/g,
  );
  return (
    <>
      {parts.map((part, index) => (
        <span
          key={`${index}-${part}`}
          className={
            part.startsWith("//") || part.startsWith("/*")
              ? "code-comment"
              : /^["'`]/.test(part)
                ? "code-string"
                : /^(import|from|export|default|function|return|const|let|if|else|type|interface|true|false|null|undefined|new|async|await)$/.test(
                      part,
                    )
                  ? "code-keyword"
                  : /^\d+$/.test(part)
                    ? "code-number"
                    : undefined
          }
        >
          {part}
        </span>
      ))}
    </>
  );
}
export function Code({
  source,
  language = "tsx",
}: {
  source: string;
  language?: "tsx" | "ts" | "bash" | "css" | "json" | "html";
}) {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);
  return (
    <div className="code-wrap">
      <span className="code-language">
        {language === "bash"
          ? "Shell"
          : language === "css"
            ? "CSS"
            : language === "ts"
              ? "TypeScript"
              : language === "json"
                ? "JSON"
                : language === "html"
                  ? "HTML"
                  : "TSX"}
      </span>
      <button
        className="copy-button"
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(source);
            setCopied(true);
            setFailed(false);
          } catch {
            setFailed(true);
          }
        }}
      >
        {failed ? "请手动复制" : copied ? "已复制 ✓" : "复制代码"}
      </button>
      <pre>
        <code>
          <Highlight source={source} />
        </code>
      </pre>
    </div>
  );
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

export function Demo({
  id,
  title,
  description,
  descriptionMarkdown = false,
  iframe,
  source,
  sourceExport,
  children,
}: {
  id?: string;
  title: string;
  description: string;
  descriptionMarkdown?: boolean;
  iframe?: { demo: string; height: number };
  source: () => Promise<{ default: string }>;
  sourceExport?: string;
  children: OctaneNode;
}) {
  const { token } = theme.useToken();
  const [text, setText] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);
  const load = async () => {
    const value =
      text ?? selectDemoSource((await source()).default, sourceExport);
    setText(value);
    return value;
  };
  return (
    <section className="demo-card" id={id} tabIndex={-1}>
      <div className="demo-stage" style={iframe ? { padding: 0 } : undefined}>
        {iframe ? (
          <DemoIframe title={title} demo={iframe.demo} height={iframe.height} />
        ) : (
          <div className="demo-content">{children}</div>
        )}
      </div>
      <div className="demo-caption">
        <h3>
          {id ? (
            <a href={`#${window.location.hash.slice(1).split("/")[0]}/${id}`}>
              {title}
            </a>
          ) : (
            title
          )}
        </h3>
        {descriptionMarkdown ? (
          description.split(/\n\s*\n/).map((paragraph, index) =>
            paragraph.startsWith("> ") ? (
              <blockquote
                key={index}
                className="api-note"
                style={{
                  "--api-note-color": token.colorTextSecondary,
                  "--api-note-border": token.colorSplit,
                  "--api-note-code-bg": token.colorFillTertiary,
                  "--api-note-code-radius": `${token.borderRadiusSM}px`,
                  "--api-note-font-size": `${token.fontSize}px`,
                }}
              >
                <p>
                  <ReferenceText text={paragraph.replace(/^>\s?/gm, "")} />
                </p>
              </blockquote>
            ) : (
              <p key={index}>
                <ReferenceText text={paragraph} />
              </p>
            ),
          )
        ) : (
          <p>{description}</p>
        )}
      </div>
      <div className="demo-actions">
        <button
          type="button"
          title={copied ? "已复制" : "复制示例代码"}
          aria-label={`复制${title}代码`}
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(await load());
              setCopied(true);
              setFailed(false);
            } catch {
              setFailed(true);
              setOpen(true);
            }
          }}
        >
          <Icon name={copied ? "check" : "copy"} />
        </button>
        <button
          type="button"
          title={open ? "收起代码" : "显示代码"}
          aria-label={`${open ? "收起" : "查看"}${title}代码`}
          aria-expanded={open}
          onClick={() => {
            setOpen(!open);
            if (!open) void load().catch(() => setFailed(true));
          }}
        >
          <Icon name="code" />
        </button>
      </div>
      {open && (
        <div className="demo-code">
          {failed && (
            <p role="status">
              加载或复制失败，可手动复制代码，或刷新页面重试。
            </p>
          )}
          {text !== null ? (
            <Code source={text} />
          ) : !failed ? (
            <p role="status">正在加载代码…</p>
          ) : null}
        </div>
      )}
    </section>
  );
}
/** antd's two demo columns flow independently, alternating examples by source order. */
export function DemoGrid({
  children,
  columns = 2,
}: {
  children: OctaneNode;
  columns?: 1 | 2;
}) {
  const [wide, setWide] = useState(
    () => typeof window === "undefined" || window.innerWidth > 1024,
  );
  useEffect(() => {
    const update = () => setWide(window.innerWidth > 1024);
    window.addEventListener("resize", update);
    update();
    return () => window.removeEventListener("resize", update);
  }, []);
  const columnCount = wide ? columns : 1;
  const examples = Children.toArray(children).map((child, index) =>
    isValidElement(child)
      ? cloneElement(child, { key: child.key ?? index })
      : child,
  );
  return (
    <div
      className="demo-grid"
      style={
        columnCount === 1
          ? { gridTemplateColumns: "minmax(0, 1fr)" }
          : undefined
      }
    >
      {Array.from({ length: columnCount }, (_, column) => (
        <div className="demo-column" key={column}>
          {examples.filter((_, index) => index % columnCount === column)}
        </div>
      ))}
    </div>
  );
}

export function DocMeta({
  name,
  importName = name,
}: {
  name: string;
  importName?: string;
}) {
  return (
    <div className="doc-meta">
      <span>使用</span>
      <code>import {`{ ${importName} }`} from 'antd-octane';</code>
      <span>反馈</span>
      <div>
        <a
          href="https://github.com/CoderSerio/antd-octane/issues"
          target="_blank"
          rel="noreferrer"
        >
          提出问题 ↗
        </a>
        <a href="#compatibility">支持范围与差异</a>
      </div>
      <span>文档</span>
      <div>
        <a href="#api-conventions">API 与语法约定</a>
        <a
          href={`https://5x.ant.design/components/${upstreamSlug(name)}-cn/`}
          target="_blank"
          rel="noreferrer"
        >
          上游参考 ↗
        </a>
      </div>
    </div>
  );
}
export function ApiTable({
  rows,
  headers = ["参数", "说明", "类型", "默认值"],
  label = "API 参数表，可横向滚动",
  markdown = false,
  referenceUrl,
  className,
  codeName = true,
  renderValue,
}: {
  rows: string[][];
  headers?: [string, string, string, string];
  label?: string;
  markdown?: boolean;
  referenceUrl?: string;
  className?: string;
  codeName?: boolean;
  renderValue?: (value: string) => OctaneNode;
}) {
  return (
    // Keyboard users can scroll the table without moving the entire page.
    <section
      className={["table-scroll", className].filter(Boolean).join(" ")}
      aria-label={label}
      // biome-ignore lint/a11y/noNoninteractiveTabindex: scrollable API region needs keyboard access.
      tabIndex={0}
    >
      <table>
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header} scope="col">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([name, description, type, value]) => (
            <tr key={name}>
              <td>
                {codeName ? (
                  <code>
                    {markdown ? (
                      <ReferenceText
                        text={name}
                        inlineCode={false}
                        referenceUrl={referenceUrl}
                      />
                    ) : (
                      name
                    )}
                  </code>
                ) : (
                  name
                )}
              </td>
              <td>
                {markdown ? (
                  <ReferenceText
                    text={description}
                    referenceUrl={referenceUrl}
                  />
                ) : (
                  description
                )}
              </td>
              <td>
                <code>
                  {markdown ? (
                    <ReferenceText
                      text={type}
                      inlineCode={false}
                      referenceUrl={referenceUrl}
                    />
                  ) : (
                    type
                  )}
                </code>
              </td>
              <td>
                {renderValue ? (
                  renderValue(value)
                ) : markdown ? (
                  <ReferenceText text={value} referenceUrl={referenceUrl} />
                ) : (
                  value
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

/** Render the inline syntax used in the pinned upstream API tables, without HTML injection. */
export function ReferenceText({
  text,
  inlineCode = true,
  referenceUrl,
}: {
  text: string;
  inlineCode?: boolean;
  referenceUrl?: string;
}) {
  const parts = text.split(
    /(`[^`]*`|\*\*[^*]+\*\*|\[(?:[^[\]]|\[[^\]]*\])+\]\([^)]*\)|<https?:\/\/[^>]+>|~~[^~]+~~|<br\s*\/?\s*>)/g,
  );
  return (
    <>
      {parts.map((part, index) => {
        const key = `${index}-${part}`;
        if (part.startsWith("`"))
          return inlineCode ? (
            <code key={key}>{part.slice(1, -1)}</code>
          ) : (
            part.slice(1, -1)
          );
        if (part.startsWith("~~"))
          return <del key={key}>{part.slice(2, -2)}</del>;
        if (part.startsWith("**"))
          return (
            <strong key={key}>
              <ReferenceText
                text={part.slice(2, -2)}
                inlineCode={inlineCode}
                referenceUrl={referenceUrl}
              />
            </strong>
          );
        if (/^<br/.test(part)) return <br key={key} />;
        if (/^<https?:\/\//.test(part)) {
          const href = part.slice(1, -1);
          return (
            <a key={key} href={href} target="_blank" rel="noreferrer">
              {href}
            </a>
          );
        }
        const link = part.match(/^\[((?:[^[\]]|\[[^\]]*\])+)\]\(([^)]+)\)$/);
        if (link) {
          const [, label, path] = link;
          const url = new URL(path, referenceUrl ?? "https://5x.ant.design/");
          if (!["https:", "http:"].includes(url.protocol)) return label;
          return (
            <a key={key} href={url.href} target="_blank" rel="noreferrer">
              {label}
            </a>
          );
        }
        return part;
      })}
    </>
  );
}

export function usePageAnchor(section?: string) {
  useEffect(() => {
    const content = document.getElementById("main-content");
    if (content) readPageToc(content);
    window.dispatchEvent(new Event("docs:ready"));
    const target = section ? document.getElementById(section) : null;
    if (target) {
      target.scrollIntoView();
      target.focus({ preventScroll: true });
    } else window.scrollTo(0, 0);
  }, [section]);
}
