import type { OctaneNode } from "octane";
import { useEffect, useState } from "octane";
export function Code({ source }: { source: string }) {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);
  return (
    <div className="code-wrap">
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
        <code>{source}</code>
      </pre>
    </div>
  );
}
export function Demo({
  title,
  description,
  source,
  children,
}: {
  title: string;
  description: string;
  source: () => Promise<{ default: string }>;
  children: OctaneNode;
}) {
  const [text, setText] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const load = async () => {
    try {
      setText((await source()).default);
      setFailed(false);
    } catch {
      setFailed(true);
    }
  };
  return (
    <section className="demo-card">
      <div className="demo-stage">{children}</div>
      <div className="demo-caption">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <details
        onToggle={(event) => {
          if ((event.currentTarget as HTMLDetailsElement).open && text === null)
            void load();
        }}
      >
        <summary>
          查看示例代码 <span>⌘</span>
        </summary>
        {text !== null ? (
          <Code source={text} />
        ) : failed ? (
          <button type="button" onClick={() => window.location.reload()}>
            加载失败，重新加载页面
          </button>
        ) : (
          <p role="status">正在加载代码…</p>
        )}
      </details>
    </section>
  );
}

export function usePageAnchor(section?: string) {
  useEffect(() => {
    const target = section ? document.getElementById(section) : null;
    if (target) {
      target.scrollIntoView();
      target.focus({ preventScroll: true });
    } else window.scrollTo(0, 0);
  }, [section]);
}
