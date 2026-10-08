import { Button } from "antd-octane";
import type { OctaneNode } from "octane";
import { useEffect, useRef, useState } from "octane";
import { upstreamSlug } from "./component-coverage";
import { Icon } from "./icons";
import { Loading } from "./Loading";

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
      <Button
        className="copy-button"
        type="text"
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
      </Button>
      <pre>
        <code>
          <Highlight source={source} />
        </code>
      </pre>
    </div>
  );
}
export function Demo({
  id,
  title,
  description,
  source,
  children,
}: {
  id?: string;
  title: string;
  description: string;
  source: () => Promise<{ default: string }>;
  children: OctaneNode;
}) {
  const [text, setText] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);
  const pending = useRef<Promise<string> | null>(null);
  const mounted = useRef(true);
  useEffect(
    () => () => {
      mounted.current = false;
    },
    [],
  );
  const load = () => {
    if (text !== null) return Promise.resolve(text);
    if (!pending.current) {
      setFailed(false);
      pending.current = source()
        .then((module) => {
          if (mounted.current) setText(module.default);
          return module.default;
        })
        .finally(() => {
          pending.current = null;
        });
    }
    return pending.current;
  };
  return (
    <section className="demo-card" id={id} tabIndex={-1}>
      <div className="demo-stage">{children}</div>
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
        <p>{description}</p>
      </div>
      <div className="demo-actions">
        <Button
          type="text"
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
        </Button>
        <Button
          type="text"
          title={open ? "收起代码" : "显示代码"}
          aria-label={`${open ? "收起" : "查看"}${title}代码`}
          aria-expanded={open}
          onClick={() => {
            setOpen(!open);
            if (!open) void load().catch(() => setFailed(true));
          }}
        >
          <Icon name="code" />
        </Button>
      </div>
      {open && (
        <div className="demo-code">
          {failed && (
            <p role="status">
              {text !== null ? (
                "复制失败，请手动复制代码。"
              ) : (
                <>
                  代码加载失败。
                  <Button
                    size="small"
                    onClick={() => void load().catch(() => setFailed(true))}
                  >
                    重试加载
                  </Button>
                </>
              )}
            </p>
          )}
          {text !== null ? (
            <Code source={text} />
          ) : !failed ? (
            <Loading code />
          ) : null}
        </div>
      )}
    </section>
  );
}
export function DocMeta({ name }: { name: string }) {
  return (
    <div className="doc-meta">
      <span>使用</span>
      <code>import {`{ ${name} }`} from 'antd-octane';</code>
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
}: {
  rows: string[][];
  headers?: [string, string, string, string];
  label?: string;
}) {
  return (
    // Keyboard users can scroll the table without moving the entire page.
    <section
      className="table-scroll"
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
                <code>{name}</code>
              </td>
              <td>{description}</td>
              <td>
                <code>{type}</code>
              </td>
              <td>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export function usePageAnchor(section?: string) {
  useEffect(() => {
    window.dispatchEvent(new Event("docs:ready"));
    const target = section ? document.getElementById(section) : null;
    if (target) {
      target.scrollIntoView();
      target.focus({ preventScroll: true });
    } else window.scrollTo(0, 0);
  }, [section]);
}
