import type { ThemeConfig } from "antd-octane";
import { ConfigProvider, theme } from "antd-octane";
import { useEffect, useMemo, useState } from "octane";
import { nav, toc } from "./navigation";
import { ThemePanel } from "./ThemePanel";

type PageComponent = (props: {
  section?: string;
}) => import("octane").OctaneNode;
const pages: Record<string, () => Promise<{ default: PageComponent }>> = {
  button: () => import("./pages/button"),
  overview: () => import("./pages/overview"),
  start: () => import("./pages/start"),
  theme: () => import("./pages/theme"),
  components: () => import("./pages/components"),
};
function RouteContent({ page, section }: { page: string; section?: string }) {
  const [loaded, setLoaded] = useState<{
    id: string;
    Page: PageComponent;
  } | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let active = true;
    setFailed(false);
    const load = Object.hasOwn(pages, page) ? pages[page] : undefined;
    if (load)
      void load()
        .then((module) => {
          if (active) setLoaded({ id: page, Page: module.default });
        })
        .catch(() => {
          if (active) setFailed(true);
        });
    return () => {
      active = false;
    };
  }, [page]);
  const Page = loaded?.id === page ? loaded.Page : null;
  if (!Object.hasOwn(pages, page))
    return (
      <>
        <h1>页面不存在</h1>
        <a href="#overview">返回项目介绍</a>
      </>
    );
  if (failed)
    return (
      <div className="notice" role="alert">
        文档加载失败。
        <button type="button" onClick={() => window.location.reload()}>
          重新加载页面
        </button>
      </div>
    );
  return Page ? (
    <Page section={section} />
  ) : (
    <p className="page-loading" role="status">
      正在加载文档…
    </p>
  );
}

export function App() {
  const [dark, setDark] = useState(false);
  const [compact, setCompact] = useState(false);
  const [primary, setPrimary] = useState("#1677ff");
  const [radius, setRadius] = useState(6);
  const config: ThemeConfig = useMemo(
    () => ({
      algorithm: [
        dark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        ...(compact ? [theme.compactAlgorithm] : []),
      ],
      token: { colorPrimary: primary, borderRadius: radius },
    }),
    [dark, compact, primary, radius],
  );
  return (
    <ConfigProvider theme={config}>
      <Shell
        dark={dark}
        setDark={setDark}
        compact={compact}
        setCompact={setCompact}
        primary={primary}
        setPrimary={setPrimary}
        radius={radius}
        setRadius={setRadius}
      />
    </ConfigProvider>
  );
}
export interface ShellProps {
  dark: boolean;
  setDark: (value: boolean) => void;
  compact: boolean;
  setCompact: (value: boolean) => void;
  primary: string;
  setPrimary: (value: string) => void;
  radius: number;
  setRadius: (value: number) => void;
}

function Shell(p: ShellProps) {
  const [route, setRoute] = useState(
    window.location.hash.slice(1) || "overview",
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [page, section] = route.split("/");
  const current = nav.find((item) => item.id === page);
  const isComponents = current?.category === "components";
  const results = nav.filter((item) =>
    `${item.title} ${item.keywords}`
      .toLowerCase()
      .includes(query.trim().toLowerCase()),
  );
  useEffect(() => {
    const update = () => {
      setRoute(window.location.hash.slice(1) || "overview");
      setMenuOpen(false);
      (
        document.getElementById("theme-dialog") as HTMLDialogElement | null
      )?.close();
      setQuery("");
    };
    const shortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        document.getElementById("doc-search")?.focus();
      }
      if (event.key === "Escape") {
        setQuery("");
        setMenuOpen(false);
      }
    };
    window.addEventListener("hashchange", update);
    window.addEventListener("keydown", shortcut);
    return () => {
      window.removeEventListener("hashchange", update);
      window.removeEventListener("keydown", shortcut);
    };
  }, []);
  useEffect(() => {
    document.title = `${current?.title ?? "页面不存在"} · Ant Design for Octane`;
  }, [current]);
  return (
    <div
      className="site-root"
      data-theme={p.dark ? "dark" : "light"}
      style={{ "--accent": p.primary }}
    >
      <button
        type="button"
        className="skip-link"
        onClick={() => document.getElementById("main-content")?.focus()}
      >
        跳到内容
      </button>
      <header className="header">
        <a href="#overview" className="brand">
          <span className="brand-mark">
            a<span>°</span>
          </span>
          <span>
            Ant Design <b>for Octane</b>
          </span>
        </a>
        <form
          className="doc-search"
          aria-label="文档搜索"
          onSubmit={(event) => {
            event.preventDefault();
            if (results[0] && query.trim()) {
              window.location.hash = results[0].id;
              setQuery("");
            }
          }}
        >
          <span aria-hidden="true">⌕</span>
          <input
            id="doc-search"
            type="search"
            aria-label="搜索文档"
            placeholder="搜索文档…"
            autoComplete="off"
            value={query}
            onInput={(event) =>
              setQuery((event.currentTarget as HTMLInputElement).value)
            }
          />
          <kbd>⌘ K</kbd>
          {query.trim() && (
            <div className="search-results">
              <p role="status">
                {results.length
                  ? `找到 ${results.length} 篇文档 · Enter 打开第一项`
                  : "没有匹配的文档"}
              </p>
              {results.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setQuery("")}
                >
                  {item.title}
                  <small>
                    {item.category === "components" ? "组件" : "研发"}
                  </small>
                </a>
              ))}
            </div>
          )}
        </form>
        <nav className="top-nav" aria-label="主导航">
          <a
            href="#overview"
            className={!isComponents ? "selected" : ""}
            aria-current={!isComponents && current ? "true" : undefined}
          >
            研发
          </a>
          <a
            href="#components"
            className={isComponents ? "selected" : ""}
            aria-current={isComponents ? "true" : undefined}
          >
            组件
          </a>
        </nav>
        <div className="header-links">
          <span className="version">0.1.0-alpha.0</span>
          <button
            type="button"
            className="theme-entry"
            onClick={() =>
              (
                document.getElementById("theme-dialog") as HTMLDialogElement
              ).showModal()
            }
          >
            主题实验室
          </button>
          <button
            type="button"
            className="theme-toggle"
            aria-label="切换暗色主题"
            aria-pressed={p.dark}
            onClick={() => p.setDark(!p.dark)}
          >
            {p.dark ? "☀" : "☾"}
          </button>
          <a
            className="github-link"
            href="https://github.com/CoderSerio/antd-octane"
            target="_blank"
            rel="noreferrer"
          >
            GitHub ↗
          </a>
        </div>
      </header>
      <div className="mobile-toolbar">
        <button
          type="button"
          aria-expanded={menuOpen}
          aria-controls="doc-sidebar"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰ 文档导航
        </button>
        <span>{current?.title}</span>
      </div>
      <div className="workspace">
        <aside
          id="doc-sidebar"
          className={`sidebar ${menuOpen ? "is-open" : ""}`}
        >
          <nav aria-label="文档导航">
            {(isComponents ? ["组件", "通用"] : ["开始", "进阶使用"]).map(
              (group) => (
                <div className="nav-group" key={group}>
                  <div className="nav-group-title">{group}</div>
                  {nav
                    .filter((item) => item.group === group)
                    .map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        className={page === item.id ? "active" : ""}
                        aria-current={page === item.id ? "page" : undefined}
                        onClick={() => setMenuOpen(false)}
                      >
                        {item.title}
                        {item.id === "button" && <small>Alpha</small>}
                      </a>
                    ))}
                </div>
              ),
            )}
          </nav>
          <div className="sidebar-note">
            <span className="status-dot" />
            0.1 开发预览<p>已实现 Button 与主题基础。</p>
            <a href="https://github.com/CoderSerio/antd-octane/blob/main/docs/RFC-0001-antd-for-octane.md">
              阅读 RFC ↗
            </a>
          </div>
        </aside>
        <main id="main-content" className="main" tabIndex={-1}>
          <RouteContent page={page} section={section} />
          <footer>
            Ant Design for Octane <span>独立社区探索 · MIT</span>
          </footer>
        </main>
        <aside className="page-toc" aria-label="页内目录">
          <span>本页内容</span>
          <nav>
            {(Object.hasOwn(toc, page) ? toc[page] : []).map(([id, title]) => (
              <a
                key={id}
                href={`#${page}/${id}`}
                aria-current={section === id ? "location" : undefined}
              >
                {title}
              </a>
            ))}
          </nav>
          <a
            className="toc-help"
            href="https://github.com/CoderSerio/antd-octane/issues"
            target="_blank"
            rel="noreferrer"
          >
            反馈问题 ↗
          </a>
        </aside>
      </div>
      <dialog id="theme-dialog" aria-labelledby="theme-title">
        <ThemePanel {...p} />
      </dialog>
    </div>
  );
}
