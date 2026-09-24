import { BasicDemo } from "../demos/basic";
import { usePageAnchor } from "../docs-ui";
export default function Overview({ section }: { section?: string }) {
  usePageAnchor(section);
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
      <h2 id="progress" tabIndex={-1}>
        当前进度
      </h2>
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
