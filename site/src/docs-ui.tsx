import { Tabs, theme } from "antd-octane";
import type { OctaneNode } from "octane";
import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useState,
} from "octane";
import { componentCoverage, upstreamSlug } from "./component-coverage";
import { DemoIframe } from "./demo-frame";
import {
  type DemoSourceModule,
  type DemoSourceVariants,
  type SourceToken,
  selectDemoSource,
} from "./demo-source";
import { Icon } from "./icons";
import { toc } from "./navigation";
import { readPageToc } from "./page-toc";

export { selectDemoSource } from "./demo-source";

function Highlight({
  source,
  tokens,
}: {
  source: string;
  tokens?: SourceToken[];
}) {
  if (tokens) {
    return (
      <>
        {tokens.map((token, index) => (
          <span
            key={index}
            className={token.kind ? `code-${token.kind}` : undefined}
          >
            {token.text}
          </span>
        ))}
      </>
    );
  }
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
  tokens,
  compact = false,
}: {
  source: string;
  language?: "tsx" | "jsx" | "ts" | "bash" | "css" | "json" | "html";
  tokens?: SourceToken[];
  compact?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);
  return (
    <div
      className={["code-wrap", compact && "demo-source-wrap"]}
      data-language={language}
    >
      <span className="code-language">
        {compact
          ? language
          : language === "bash"
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
        aria-label={
          compact
            ? `复制${language === "jsx" ? "JavaScript" : "TypeScript"}代码`
            : undefined
        }
        title={copied ? "已复制" : "复制代码"}
        data-copied={copied || undefined}
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
        {failed ? (
          "请手动复制"
        ) : compact ? (
          <Icon name={copied ? "check" : "copy"} />
        ) : copied ? (
          "已复制 ✓"
        ) : (
          "复制代码"
        )}
      </button>
      <pre>
        <code>
          <Highlight source={source} tokens={tokens} />
        </code>
      </pre>
    </div>
  );
}

/** Ant Design's code language tabs and collapse row, using native Octane controls. */
export function DemoCodePreview({
  source,
  variants,
  onCollapse,
  language: controlledLanguage,
  onLanguageChange,
}: {
  source: string;
  variants?: DemoSourceVariants;
  onCollapse: () => void;
  language?: string;
  onLanguageChange?: (language: string) => void;
}) {
  const { token } = theme.useToken();
  const [language, setLanguage] = useState("tsx");
  const items = [
    {
      key: "tsx",
      label: "TypeScript",
      children: (
        <Code source={source} tokens={variants?.typescriptTokens} compact />
      ),
    },
    ...(variants
      ? [
          {
            key: "jsx",
            label: "JavaScript",
            children: (
              <Code
                source={variants.javascript}
                tokens={variants.javascriptTokens}
                language="jsx"
                compact
              />
            ),
          },
        ]
      : []),
  ];
  return (
    <div
      className="demo-source-preview"
      style={{
        "--demo-source-bg": token.colorBgContainer,
        "--demo-source-text": token.colorText,
        "--demo-source-muted": token.colorIcon,
        "--demo-source-secondary": token.colorTextSecondary,
        "--demo-source-elevated": token.colorBgElevated,
        "--demo-source-success": token.colorSuccess,
        "--demo-source-radius": `${token.borderRadius}px`,
        "--demo-source-border": token.colorSplit,
        "--demo-source-font-size": `${token.fontSize}px`,
        "--demo-source-primary": token.colorPrimary,
      }}
    >
      <Tabs
        centered
        className="demo-source-tabs"
        activeKey={controlledLanguage ?? language}
        onChange={(next) => {
          setLanguage(next);
          onLanguageChange?.(next);
        }}
        items={items}
      />
      <button className="demo-code-collapse" type="button" onClick={onCollapse}>
        <Icon name="up" /> 收起
      </button>
    </div>
  );
}

export function Demo({
  id,
  title,
  description,
  descriptionMarkdown = false,
  iframe,
  source,
  sourceExport,
  order,
  children,
}: {
  id?: string;
  title: string;
  description: string;
  descriptionMarkdown?: boolean;
  iframe?: { demo: string; height: number };
  source: () => Promise<DemoSourceModule>;
  sourceExport?: string;
  order?: number;
  children: OctaneNode;
}) {
  const { token } = theme.useToken();
  const showBrowserFrame =
    iframe &&
    (iframe.demo.startsWith("layout-") ||
      iframe.demo.startsWith("development/layout/") ||
      iframe.demo.startsWith("anchor/"));
  const [text, setText] = useState<string | null>(null);
  const [variants, setVariants] = useState<DemoSourceVariants>();
  const [language, setLanguage] = useState("tsx");
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);
  const load = async () => {
    if (text !== null) return text;
    const module = await source();
    const value = selectDemoSource(module.default, sourceExport);
    const forms = module.examples?.[sourceExport ?? ""] ?? module.code;
    if (forms?.typescript === value) setVariants(forms);
    setText(value);
    return value;
  };
  return (
    <section
      className="demo-card"
      id={id}
      tabIndex={-1}
      data-demo-order={order}
    >
      <div
        className="demo-stage"
        style={{
          "--demo-link-color": token.colorLink,
          "--demo-link-hover": token.colorLinkHover,
          "--demo-link-active": token.colorLinkActive,
          ...(iframe ? { padding: 0 } : {}),
          ...(showBrowserFrame ? { overflow: "hidden" } : {}),
        }}
      >
        {iframe ? (
          <div
            className={showBrowserFrame ? "demo-browser-frame" : undefined}
            style={{ "--demo-frame-radius": `${token.borderRadiusSM}px` }}
          >
            <DemoIframe
              title={title}
              demo={iframe.demo}
              height={iframe.height}
            />
          </div>
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
              const selectedSource = await load();
              await navigator.clipboard.writeText(
                language === "jsx" && variants
                  ? variants.javascript
                  : selectedSource,
              );
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
            <DemoCodePreview
              source={text}
              variants={variants}
              language={language}
              onLanguageChange={(next) => {
                setLanguage(next);
                setCopied(false);
              }}
              onCollapse={() => setOpen(false)}
            />
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
  component,
}: {
  children: OctaneNode;
  columns?: 1 | 2;
  component?: string;
}) {
  const [developmentExamples, setDevelopmentExamples] = useState<
    OctaneNode[] | null
  >(null);
  useEffect(() => {
    if (!import.meta.env.DEV || !component) return;
    let cancelled = false;
    void import("./development/layout-navigation")
      .then(({ augmentExamples }) =>
        augmentExamples(component, Children.toArray(children)),
      )
      .then((examples) => {
        if (!cancelled) setDevelopmentExamples(examples);
      });
    return () => {
      cancelled = true;
    };
  }, [component]);
  useEffect(() => {
    if (!developmentExamples) return;
    window.dispatchEvent(new Event("docs:ready"));
    const [page, section] = window.location.hash.slice(1).split("/");
    if (page === component && section) {
      const target = document.getElementById(section);
      target?.scrollIntoView();
      target?.focus({ preventScroll: true });
    }
  }, [developmentExamples]);
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
  const examples = (developmentExamples ?? Children.toArray(children)).map(
    (child, index) =>
      isValidElement(child)
        ? cloneElement(child, { key: child.key ?? index, order: index })
        : child,
  );
  return (
    <div
      className="demo-grid"
      data-component={component}
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

/** Keep links to existing component documents within this site's route. */
function localReferenceHref(url: URL) {
  if (url.origin !== "https://5x.ant.design" || url.search) return undefined;
  const slug = url.pathname.match(/^\/components\/([^/]+?)(?:-cn)?\/?$/)?.[1];
  const page = componentCoverage.find(
    ({ name, pageId }) => pageId && upstreamSlug(name) === slug,
  );
  if (!page?.pageId) return undefined;
  const href = `#${page.pageId}`;
  if (!url.hash) return href;
  let fragment: string;
  try {
    fragment = decodeURIComponent(url.hash.slice(1));
  } catch {
    return href;
  }
  const prefix = `${slug}-demo-`;
  if (fragment.startsWith(prefix)) fragment = fragment.slice(prefix.length);
  if (page.pageId === "radio" && fragment === "radiobutton")
    fragment = "button-sizes";
  if (page.pageId === "anchor" && fragment.toLowerCase() === "targetoffset")
    return `${href}/targetOffset`;
  const anchors = [
    "api",
    "examples",
    "tokens",
    ...(toc[page.pageId] ?? []).map(([id]) => id),
  ];
  const section = anchors.find(
    (id) => id.toLowerCase() === fragment.toLowerCase(),
  );
  return section ? `${href}/${section}` : href;
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
            <a
              key={key}
              className="reference-link"
              href={href}
              target="_blank"
              rel="noreferrer"
            >
              {href}
            </a>
          );
        }
        const link = part.match(/^\[((?:[^[\]]|\[[^\]]*\])+)\]\(([^)]+)\)$/);
        if (link) {
          const [, label, path] = link;
          const url = new URL(path, referenceUrl ?? "https://5x.ant.design/");
          if (!["https:", "http:"].includes(url.protocol)) return label;
          const localHref = localReferenceHref(url);
          return (
            <a
              key={key}
              className="reference-link"
              href={localHref ?? url.href}
              target={localHref ? undefined : "_blank"}
              rel={localHref ? undefined : "noreferrer"}
            >
              <ReferenceText
                text={label}
                inlineCode={inlineCode}
                referenceUrl={referenceUrl}
              />
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
