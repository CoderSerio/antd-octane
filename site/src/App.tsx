import type { ThemeConfig } from "antd-octane";
import { ConfigProvider, theme } from "antd-octane";
import { useEffect, useMemo, useState } from "octane";
import { Icon } from "./icons";
import { nav, toc } from "./navigation";
import { ThemePanel } from "./ThemePanel";

type PageComponent = (props: {
  section?: string;
}) => import("octane").OctaneNode;
const pages: Record<string, () => Promise<{ default: PageComponent }>> = {
  home: () => import("./pages/home"),
  tour: () => import("./pages/tour"),
  affix: () => import("./pages/affix"),
  anchor: () => import("./pages/anchor"),
  "float-button": () => import("./pages/float-button"),
  image: () => import("./pages/image"),
  carousel: () => import("./pages/carousel"),
  splitter: () => import("./pages/splitter"),
  watermark: () => import("./pages/watermark"),
  app: () => import("./pages/app"),
  icon: () => import("./pages/icon"),

  message: () => import("./pages/message"),
  notification: () => import("./pages/notification"),
  modal: () => import("./pages/modal"),
  drawer: () => import("./pages/drawer"),
  menu: () => import("./pages/menu"),
  dropdown: () => import("./pages/dropdown"),
  popconfirm: () => import("./pages/popconfirm"),

  "qr-code": () => import("./pages/qr-code"),
  "input-number": () => import("./pages/input-number"),
  slider: () => import("./pages/slider"),
  typography: () => import("./pages/typography"),
  list: () => import("./pages/list"),
  spin: () => import("./pages/spin"),
  skeleton: () => import("./pages/skeleton"),
  progress: () => import("./pages/progress"),
  result: () => import("./pages/result"),
  segmented: () => import("./pages/segmented"),
  rate: () => import("./pages/rate"),
  breadcrumb: () => import("./pages/breadcrumb"),
  pagination: () => import("./pages/pagination"),
  steps: () => import("./pages/steps"),
  tooltip: () => import("./pages/tooltip"),
  popover: () => import("./pages/popover"),
  button: () => import("./pages/button"),
  grid: () => import("./pages/grid"),
  layout: () => import("./pages/layout"),
  collapse: () => import("./pages/collapse"),
  tabs: () => import("./pages/tabs"),
  empty: () => import("./pages/empty"),
  statistic: () => import("./pages/statistic"),
  timeline: () => import("./pages/timeline"),
  descriptions: () => import("./pages/descriptions"),
  radio: () => import("./pages/radio"),
  tag: () => import("./pages/tag"),
  alert: () => import("./pages/alert"),
  card: () => import("./pages/card"),
  badge: () => import("./pages/badge"),
  avatar: () => import("./pages/avatar"),
  flex: () => import("./pages/flex"),
  space: () => import("./pages/space"),
  divider: () => import("./pages/divider"),
  switch: () => import("./pages/switch"),
  input: () => import("./pages/input"),
  checkbox: () => import("./pages/checkbox"),
  overview: () => import("./pages/overview"),
  start: () => import("./pages/start"),
  theme: () => import("./pages/theme"),
  components: () => import("./pages/components"),
  "api-conventions": () => import("./pages/api-conventions"),
  compatibility: () => import("./pages/compatibility"),
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
  const [route, setRoute] = useState(window.location.hash.slice(1) || "home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeAnchor, setActiveAnchor] = useState("");
  const [page, section] = route.split("/");
  const isHome = page === "home";
  const current = nav.find((item) => item.id === page);
  const isComponents = current?.category === "components";
  const results = nav.filter((item) =>
    `${item.title} ${item.keywords}`
      .toLowerCase()
      .includes(query.trim().toLowerCase()),
  );
  useEffect(() => {
    const update = () => {
      setRoute(window.location.hash.slice(1) || "home");
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
    document.title = isHome
      ? "Ant Design for Octane · 熟悉的设计，原生的体验"
      : `${current?.title ?? "页面不存在"} · Ant Design for Octane`;
  }, [current, isHome]);
  useEffect(() => {
    let observer: IntersectionObserver | undefined;
    const setup = () => {
      observer?.disconnect();
      const headings = (Object.hasOwn(toc, page) ? toc[page] : [])
        .map(([id]) => document.getElementById(id))
        .filter((node): node is HTMLElement => node !== null);
      const update = () => {
        const above = headings.filter(
          (node) => node.getBoundingClientRect().top <= 160,
        );
        setActiveAnchor((above.at(-1) ?? headings[0])?.id ?? "");
      };
      observer = new IntersectionObserver(update, {
        rootMargin: "-80px 0px -60% 0px",
      });
      for (const node of headings) observer.observe(node);
      update();
    };
    setup();
    window.addEventListener("docs:ready", setup);
    return () => {
      observer?.disconnect();
      window.removeEventListener("docs:ready", setup);
    };
  }, [page]);
  const pageIndex = nav.findIndex((item) => item.id === page);
  const previous = pageIndex > 0 ? nav[pageIndex - 1] : undefined;
  const next = pageIndex >= 0 ? nav[pageIndex + 1] : undefined;
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
        <a
          href="#home"
          className="brand"
          aria-label="Ant Design for Octane 首页"
        >
          <span className="brand-mark">
            <svg viewBox="0 0 36 36" fill="none" aria-hidden="true">
              <path
                d="M18 2 32 10v16L18 34 4 26V10Z"
                stroke="currentColor"
                strokeWidth="2.5"
              />
              <path
                d="m4 10 14 8 14-8M18 18v16M11 14V6m14 8V6"
                stroke="currentColor"
                strokeWidth="2"
              />
              <circle cx="18" cy="18" r="3" fill="currentColor" />
            </svg>
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
          <Icon name="search" />
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
            className={!isHome && !isComponents ? "selected" : ""}
            aria-current={
              !isHome && !isComponents && current ? "true" : undefined
            }
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
            aria-label="主题实验室"
            title="主题实验室"
            onClick={() =>
              (
                document.getElementById("theme-dialog") as HTMLDialogElement
              ).showModal()
            }
          >
            <Icon name="theme" />
            <span>主题实验室</span>
          </button>
          <button
            type="button"
            className="theme-toggle"
            aria-label="切换暗色主题"
            aria-pressed={p.dark}
            onClick={() => p.setDark(!p.dark)}
          >
            <Icon name={p.dark ? "sun" : "moon"} />
          </button>
          <a
            className="github-link"
            aria-label="GitHub 仓库"
            title="GitHub 仓库"
            href="https://github.com/CoderSerio/antd-octane"
            target="_blank"
            rel="noreferrer"
          >
            <Icon name="github" />
          </a>
        </div>
      </header>
      {isHome ? (
        <main id="main-content" className="home-main" tabIndex={-1}>
          <RouteContent page={page} section={section} />
        </main>
      ) : (
        <>
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
                {(isComponents
                  ? [
                      "组件",
                      "通用",
                      "布局",
                      "导航",
                      "数据录入",
                      "数据展示",
                      "反馈",
                      "其他",
                    ].filter((group) =>
                      nav.some(
                        (item) =>
                          item.category === "components" &&
                          item.group === group,
                      ),
                    )
                  : ["开始", "进阶使用", "其他"]
                ).map((group) => (
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
                          <span className="nav-item-label" title={item.title}>
                            {item.title}
                          </span>
                        </a>
                      ))}
                  </div>
                ))}
              </nav>
              <div className="sidebar-note">
                <span className="status-dot" />
                0.1 开发预览<p>按组件验证，公开兼容边界。</p>
                <a href="https://github.com/CoderSerio/antd-octane/blob/main/docs/RFC-0001-antd-for-octane.md">
                  阅读 RFC ↗
                </a>
              </div>
            </aside>
            <main id="main-content" className="main" tabIndex={-1}>
              <RouteContent page={page} section={section} />
              {current && (
                <nav className="page-turning" aria-label="文档翻页">
                  {previous && (
                    <a href={`#${previous.id}`}>
                      <small>上一篇</small>
                      <span>← {previous.title}</span>
                    </a>
                  )}
                  {next && (
                    <a className="next-page" href={`#${next.id}`}>
                      <small>下一篇</small>
                      <span>{next.title} →</span>
                    </a>
                  )}
                </nav>
              )}
              <footer>
                Ant Design for Octane <span>独立社区探索 · MIT</span>
              </footer>
            </main>
            <aside className="page-toc" aria-label="页内目录">
              <span>本页内容</span>
              <nav>
                {(Object.hasOwn(toc, page) ? toc[page] : []).map(
                  ([id, title]) => (
                    <a
                      key={id}
                      href={`#${page}/${id}`}
                      className={
                        [
                          "basic",
                          "sizes",
                          "states",
                          "nested",
                          "component",
                          "controlled",
                          "all",
                          "refs",
                        ].includes(id)
                          ? "sub-anchor"
                          : undefined
                      }
                      aria-current={
                        activeAnchor === id ? "location" : undefined
                      }
                    >
                      {title}
                    </a>
                  ),
                )}
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
        </>
      )}
      <dialog id="theme-dialog" aria-labelledby="theme-title">
        <ThemePanel {...p} />
      </dialog>
    </div>
  );
}
