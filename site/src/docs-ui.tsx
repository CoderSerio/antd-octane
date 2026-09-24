import type { OctaneNode } from "octane";
import { useEffect, useState } from "octane";
import { Icon } from "./icons";

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
  language?: "tsx" | "ts" | "bash" | "css";
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
  const load = async () => {
    const value = text ?? (await source()).default;
    setText(value);
    return value;
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
          href={`https://ant.design/components/${name.toLowerCase()}-cn/`}
          target="_blank"
          rel="noreferrer"
        >
          上游参考 ↗
        </a>
      </div>
    </div>
  );
}
export function ApiTable({ rows }: { rows: string[][] }) {
  return (
    <div className="table-scroll">
      <table>
        <thead>
          <tr>
            <th>参数</th>
            <th>说明</th>
            <th>类型</th>
            <th>默认值</th>
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
    </div>
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
