import type { ThemeConfig } from "antd-octane";
import {
  Button,
  ConfigProvider,
  Drawer,
  Input,
  Layout,
  theme,
} from "antd-octane";
import { useEffect, useMemo, useState } from "octane";
import { Icon } from "./icons";
import { nav, toc } from "./navigation";
import { RouteContent } from "./RouteContent";
import { siteVersion } from "./site-version";
import { ThemePanel } from "./ThemePanel";

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
  const [themeOpen, setThemeOpen] = useState(false);
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
      setThemeOpen(false);
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
  const pagesInCategory = nav.filter(
    (item) => item.category === current?.category,
  );
  const pageIndex = pagesInCategory.findIndex((item) => item.id === page);
  const previous = pageIndex > 0 ? pagesInCategory[pageIndex - 1] : undefined;
  const next = pageIndex >= 0 ? pagesInCategory[pageIndex + 1] : undefined;
  return (
    <div
      className="site-root"
      data-theme={p.dark ? "dark" : "light"}
      style={{ "--accent": p.primary }}
    >
      <Button
        type="text"
        className="skip-link"
        onClick={() => document.getElementById("main-content")?.focus()}
      >
        跳到内容
      </Button>
      <header className="header">
        <a
          href="#home"
          className="brand"
          aria-label="Ant Design for Octane 首页"
        >
          <img
            className="brand-mark"
            src="./favicon.svg"
            width="32"
            height="32"
            alt=""
          />
          <span className="brand-name">
            <span>Ant Design</span>
            <b>
              for <strong>Octane</strong>
            </b>
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
          <Input
            id="doc-search"
            type="search"
            aria-label="搜索文档"
            placeholder="搜索文档…"
            autoComplete="off"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
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
                    {item.category === "components" ? "组件" : "指南"}
                  </small>
                </a>
              ))}
            </div>
          )}
        </form>
        <nav className="top-nav" aria-label="主导航">
          <a
            href="#start"
            className={!isHome && !isComponents ? "selected" : ""}
            aria-current={
              !isHome && !isComponents && current ? "true" : undefined
            }
          >
            指南
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
          <a className="version" href="#changelog" title="本站使用的组件库版本">
            {siteVersion}
          </a>
          <Button
            type="text"
            className="theme-entry"
            aria-label="主题实验室"
            title="主题实验室"
            onClick={() => setThemeOpen(true)}
          >
            <Icon name="theme" />
            <span className="theme-entry-label">主题实验室</span>
          </Button>
          <Button
            type="text"
            className="theme-toggle"
            aria-label="切换暗色主题"
            aria-pressed={p.dark}
            onClick={() => p.setDark(!p.dark)}
          >
            <Icon name={p.dark ? "sun" : "moon"} />
          </Button>
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
            <Button
              type="text"
              aria-expanded={menuOpen}
              aria-controls="doc-sidebar"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              ☰ 文档导航
            </Button>
            <span>{current?.title}</span>
          </div>
          <Layout className="workspace">
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
                  : ["开始使用", "AI", "进阶使用", "迁移", "其他"]
                ).map((group) => (
                  <div className="nav-group" key={group}>
                    <div className="nav-group-title">{group}</div>
                    {nav
                      .filter(
                        (item) =>
                          item.category ===
                            (isComponents ? "components" : "guide") &&
                          item.group === group,
                      )
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
                <a href="#compatibility">支持范围 →</a>
              </div>
            </aside>
            <Layout.Content
              id="main-content"
              className="main"
              role="main"
              tabIndex={-1}
            >
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
            </Layout.Content>
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
          </Layout>
        </>
      )}
      <Drawer
        title="主题实验室"
        open={themeOpen}
        onClose={() => setThemeOpen(false)}
        width="min(380px, 100vw)"
        rootClassName="theme-drawer"
        bodyStyle={{ padding: 24 }}
        destroyOnHidden
      >
        <ThemePanel {...p} onClose={() => setThemeOpen(false)} />
      </Drawer>
    </div>
  );
}
