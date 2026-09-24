import type { ThemeConfig } from "antd-octane";
import { Button, ConfigProvider, theme } from "antd-octane";
import type { OctaneNode } from "octane";
import { useEffect, useMemo, useState } from "octane";
import { BasicDemo } from "./demos/basic";
import basicSource from "./demos/basic.tsx?raw";
import { ComponentDemo } from "./demos/component";
import componentSource from "./demos/component.tsx?raw";
import { NestedDemo } from "./demos/nested";
import nestedSource from "./demos/nested.tsx?raw";
import { SizesDemo } from "./demos/sizes";
import sizesSource from "./demos/sizes.tsx?raw";
import { StatesDemo } from "./demos/states";
import statesSource from "./demos/states.tsx?raw";

const nav = [
  { id: "overview", title: "项目介绍", en: "Overview" },
  { id: "start", title: "快速开始", en: "Getting started" },
  { id: "theme", title: "定制主题", en: "Theming" },
  { id: "button", title: "Button 按钮", en: "General" },
];
const apiRows = [
  ["type", "default | primary | dashed | text | link", "default"],
  ["size", "small | middle | large", "middle"],
  ["shape", "default | circle | round", "default"],
  ["disabled / loading / danger / ghost / block", "boolean", "false"],
  ["icon / children", "OctaneNode", "—"],
  ["htmlType", "button | submit | reset", "button"],
  ["href / target / rel", "string（href 渲染为链接）", "—"],
  ["onClick", "(event: MouseEvent) => void，原生事件", "—"],
  ["ref", "{ nativeElement, focus(), blur() }", "—"],
  ["className / style", "自定义类名 / CSS 属性", "—"],
];
function Code({ source }: { source: string }) {
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
function Demo({
  title,
  description,
  source,
  children,
}: {
  title: string;
  description: string;
  source: string;
  children: OctaneNode;
}) {
  return (
    <section className="demo-card">
      <div className="demo-stage">{children}</div>
      <div className="demo-caption">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <details>
        <summary>
          查看示例代码 <span>⌘</span>
        </summary>
        <Code source={source} />
      </details>
    </section>
  );
}
function ButtonPage() {
  return (
    <>
      <div className="eyebrow">COMPONENTS / GENERAL</div>
      <h1>
        Button <span>按钮</span>
        <small>Alpha</small>
      </h1>
      <p className="lead">用熟悉的按钮，开始构建 Octane 界面。</p>
      <p className="intro">
        用于触发一个操作。保留 antd 的常用类型与状态，并响应全局和局部主题配置。
      </p>
      <div className="section-title">
        <h2>代码演示</h2>
        <span>可运行 · 可切换主题</span>
      </div>
      <Demo
        title="按钮类型"
        description="五种常用按钮类型。一个操作区域通常只需要一个主按钮。"
        source={basicSource}
      >
        <BasicDemo />
      </Demo>
      <div className="demo-grid">
        <Demo
          title="尺寸与形状"
          description="三种尺寸，以及圆角、圆形按钮。"
          source={sizesSource}
        >
          <SizesDemo />
        </Demo>
        <Demo
          title="状态与反馈"
          description="点击提交进入加载态，点击结束加载恢复。"
          source={statesSource}
        >
          <StatesDemo />
        </Demo>
      </div>
      <Demo
        title="嵌套主题"
        description="局部覆盖主色与圆角；inherit: false 恢复独立默认主题。"
        source={nestedSource}
      >
        <NestedDemo />
      </Demo>
      <Demo
        title="组件级覆盖"
        description="沿用 theme.components.Button，仅覆盖 Button 的样式。"
        source={componentSource}
      >
        <ComponentDemo />
      </Demo>
      <div className="section-title">
        <h2>API</h2>
        <span>本次原型支持范围</span>
      </div>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>属性</th>
              <th>说明 / 类型</th>
              <th>默认值</th>
            </tr>
          </thead>
          <tbody>
            {apiRows.map(([name, desc, fallback]) => (
              <tr key={name}>
                <td>
                  <code>{name}</code>
                </td>
                <td>{desc}</td>
                <td>{fallback}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="notice">
        <strong>已知差异</strong>
        <p>
          尚未实现 wave 点击动效、自动中文空格、loading 延迟配置、Button.Group
          和 v5 新增的 color / variant API。事件使用原生 DOM 事件，不提供 React
          SyntheticEvent。
        </p>
      </div>
    </>
  );
}
function Overview() {
  return (
    <>
      <div className="eyebrow">ANT DESIGN × OCTANE</div>
      <h1>
        熟悉的设计，
        <br />
        新的运行方式。
      </h1>
      <p className="lead">将 Ant Design 的组件 API 与主题体系带到 Octane。</p>
      <div className="hero-demo">
        <BasicDemo />
      </div>
      <div className="feature-grid">
        <article>
          <span>01</span>
          <h3>熟悉的 API</h3>
          <p>从 Button 开始，逐项验证业务属性与交互行为。</p>
        </article>
        <article>
          <span>02</span>
          <h3>主题可以延续</h3>
          <p>复用 v5 token 派生算法，验证已有主题配置。</p>
        </article>
        <article>
          <span>03</span>
          <h3>Octane 原生</h3>
          <p>由 Octane 编译和渲染，组件运行时不依赖 React。</p>
        </article>
      </div>
      <h2>当前进度</h2>
      <p>
        这是 0.1.0-alpha.0 的开发原型，尚未发布 npm 包。已提供
        ConfigProvider、Button、主题算法及本地文档站。
      </p>
      <div className="demo-row">
        <a className="text-link" href="#start">
          本地运行 →
        </a>
        <a className="text-link" href="#button">
          查看 Button →
        </a>
      </div>
      <div className="notice">
        <strong>独立社区项目</strong>
        <p>
          不代表 Ant Design 或 Octane 的官方立场。不承诺仅替换 import
          即可迁移整个应用。
        </p>
      </div>
    </>
  );
}
function StartPage() {
  return (
    <>
      <div className="eyebrow">GUIDE / GETTING STARTED</div>
      <h1>快速开始</h1>
      <p className="lead">先在本地运行，再把主题与组件带进你的项目。</p>
      <div className="notice">
        <strong>开发预览，尚未发布</strong>
        <p>
          当前请通过仓库运行。环境要求 Node.js ≥ 22.22.2、pnpm 10.29.2；固定
          Octane 0.4.3 与 antd 5.29.3 作为验证基线。
        </p>
      </div>
      <h2>启动文档站</h2>
      <Code
        source={
          "git clone https://github.com/CoderSerio/antd-octane.git\ncd antd-octane\npnpm install\npnpm dev"
        }
      />
      <h2>使用组件</h2>
      <p>以下为工作区或本地打包后的用法。消费构建产物时需要显式引入样式。</p>
      <Code
        source={
          'import { Button, ConfigProvider } from "antd-octane";\nimport "antd-octane/style.css";\n\nexport function App() {\n  return (\n    <ConfigProvider theme={{ token: { colorPrimary: "#1677ff" } }}>\n      <Button type="primary">开始使用</Button>\n    </ConfigProvider>\n  );\n}'
        }
      />
      <h2>构建与验证</h2>
      <Code
        source={
          "pnpm check        # 格式、类型、测试、构建\npnpm preview      # 预览静态站点\npnpm pack:check   # 打包并在独立目录验证消费"
        }
      />
    </>
  );
}
function ThemePage() {
  return (
    <>
      <div className="eyebrow">GUIDE / THEMING</div>
      <h1>让主题延续</h1>
      <p className="lead">从已有的 theme 配置出发，而不是重新调一遍颜色。</p>
      <p className="intro">
        第一版复用 antd 5.29.3 的 seed / map / alias 算法。纯 token
        配置保持相同结构，算法导入改为来自 antd-octane。
      </p>
      <Code
        source={
          'import { ConfigProvider, theme } from "antd-octane";\n\nconst preset = {\n  algorithm: [theme.darkAlgorithm, theme.compactAlgorithm],\n  token: { colorPrimary: "#722ed1", borderRadius: 8 },\n  components: { Button: { fontWeight: 600 } },\n};\n\n<ConfigProvider theme={preset}>...</ConfigProvider>'
        }
      />
      <h2>已验证的契约</h2>
      <ul className="prose-list">
        <li>默认、暗色、紧凑及组合算法的全量全局 token 与固定上游版本对照。</li>
        <li>全局 token 覆盖、算法回调和 Button 组件级配置。</li>
        <li>嵌套继承、独立主题，以及运行时切换。</li>
      </ul>
      <Demo
        title="局部主题不会改变外部按钮"
        description="使用右侧主题面板，可以观察继承与独立作用域的区别。"
        source={nestedSource}
      >
        <NestedDemo />
      </Demo>
      <h2>Tailwind CSS 与 StyleX</h2>
      <p>
        组件库不要求安装这两种工具。样式放在 antd CSS layer 中，保留 className /
        style 扩展入口。Tailwind 与 StyleX
        的完整工具链消费测试尚未完成，暂不宣称已兼容。
      </p>
      <Code
        source={
          "/* 使用 Tailwind v4 时，建议的层级顺序 */\n@layer theme, base, antd, components, utilities;"
        }
      />
      <div className="notice">
        <strong>迁移边界</strong>
        <p>
          尚不支持 cssVar、hashed、prefixCls、StyleProvider 和 SSR
          样式契约。原有 Less、DOM 选择器覆盖、React
          主题插件需要单独适配。Button 未实现的组件 token 不会被描述为已兼容。
        </p>
      </div>
    </>
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
interface ShellProps {
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
  const [page, setPage] = useState(window.location.hash.slice(1) || "button");
  const { token } = theme.useToken();
  useEffect(() => {
    const update = () => {
      setPage(window.location.hash.slice(1) || "button");
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, []);
  const current = nav.find((item) => item.id === page);
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
        <div className="header-links">
          <span className="version">0.1.0-alpha.0</span>
          <a
            className="github-link"
            href="https://github.com/CoderSerio/antd-octane"
            target="_blank"
            rel="noreferrer"
          >
            GitHub ↗
          </a>
          <button
            type="button"
            className="theme-toggle"
            aria-label="切换暗色主题"
            aria-pressed={p.dark}
            onClick={() => p.setDark(!p.dark)}
          >
            {p.dark ? "☀" : "☾"}
          </button>
        </div>
      </header>
      <div className="workspace">
        <aside className="sidebar">
          <div className="sidebar-label">
            开发文档 <span>中文</span>
          </div>
          <nav aria-label="文档导航">
            {nav.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={page === item.id ? "active" : ""}
                aria-current={page === item.id ? "page" : undefined}
              >
                <span>{item.title}</span>
                <small>{item.en}</small>
              </a>
            ))}
          </nav>
          <div className="sidebar-note">
            <span className="status-dot" /> 原型开发中
            <p>小步实现，逐项验证。</p>
            <a href="https://github.com/CoderSerio/antd-octane/blob/main/docs/RFC-0001-antd-for-octane.md">
              阅读 RFC ↗
            </a>
          </div>
        </aside>
        <main id="main-content" className="main" tabIndex={-1}>
          {page === "button" ? (
            <ButtonPage />
          ) : page === "overview" ? (
            <Overview />
          ) : page === "start" ? (
            <StartPage />
          ) : page === "theme" ? (
            <ThemePage />
          ) : (
            <>
              <h1>页面不存在</h1>
              <a href="#button">返回组件文档</a>
            </>
          )}
          <footer>
            Ant Design for Octane <span>独立社区探索 · MIT</span>
          </footer>
        </main>
        <aside className="theme-panel" aria-label="主题实验室">
          <div className="panel-heading">
            <span className="spark">✦</span>
            <h2>主题实验室</h2>
            <span className="live">LIVE</span>
          </div>
          <p>调整配置，实时预览组件。</p>
          <label className="control-title" htmlFor="primary-color">
            品牌色 <code>{p.primary}</code>
          </label>
          <div className="swatches">
            {["#1677ff", "#722ed1", "#13a8a8", "#389e0d", "#eb2f96"].map(
              (color) => (
                <button
                  type="button"
                  key={color}
                  aria-label={`主色 ${color}`}
                  aria-pressed={p.primary === color}
                  style={{ background: color }}
                  onClick={() => p.setPrimary(color)}
                >
                  {p.primary === color ? "✓" : ""}
                </button>
              ),
            )}
            <input
              id="primary-color"
              aria-label="自定义品牌色"
              type="color"
              value={p.primary}
              onInput={(event) =>
                p.setPrimary((event.currentTarget as HTMLInputElement).value)
              }
            />
          </div>
          <label className="control-title" htmlFor="radius">
            圆角 <code>{p.radius}px</code>
          </label>
          <input
            id="radius"
            type="range"
            min="0"
            max="20"
            value={p.radius}
            onInput={(event) =>
              p.setRadius(
                Number((event.currentTarget as HTMLInputElement).value),
              )
            }
          />
          <label className="check-control">
            <span>暗色模式</span>
            <input
              type="checkbox"
              checked={p.dark}
              onChange={(event) =>
                p.setDark((event.currentTarget as HTMLInputElement).checked)
              }
            />
          </label>
          <label className="check-control">
            <span>紧凑模式</span>
            <input
              type="checkbox"
              checked={p.compact}
              onChange={(event) =>
                p.setCompact((event.currentTarget as HTMLInputElement).checked)
              }
            />
          </label>
          <div className="token-preview">
            <span>派生 Token</span>
            <div>
              <code>colorPrimaryHover</code>
              <i style={{ background: token.colorPrimaryHover }} />
            </div>
            <div>
              <code>controlHeight</code>
              <b>{token.controlHeight}px</b>
            </div>
            <div>
              <code>borderRadius</code>
              <b>{token.borderRadius}px</b>
            </div>
          </div>
          <Button
            block
            onClick={() => {
              p.setDark(false);
              p.setCompact(false);
              p.setPrimary("#1677ff");
              p.setRadius(6);
            }}
          >
            重置主题
          </Button>
          <a className="panel-link" href="#theme">
            了解主题迁移 →
          </a>
        </aside>
      </div>
    </div>
  );
}
