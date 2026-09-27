import { usePageAnchor } from "../docs-ui";
export default function Overview({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>Ant Design for Octane</h1>
      <p className="lead">
        基于 Octane 的 Ant Design 组件库，让熟悉的设计与开发体验得以延续。
      </p>
      <p>
        面向从 antd 转向 Octane 的开发者，逐项对齐组件
        API、交互与主题配置。组件运行时由 Octane 原生实现。
      </p>
      <p>
        这个文档站也由 Octane 渲染，并安装 npm 上的{" "}
        <code>antd-octane@0.1.0-alpha.4</code>
        ，通过公开包入口使用布局、搜索、主题和示例组件。
      </p>
      <h2 id="features" tabIndex={-1}>
        特性
      </h2>
      <ul className="prose-list">
        <li>熟悉的组件名称与业务 API，减少重新学习的成本。</li>
        <li>
          延续 Ant Design v5 的主题 token，支持品牌色、暗色、紧凑与嵌套配置。
        </li>
        <li>TypeScript 类型、可运行示例与明确的兼容边界。</li>
        <li>静态 CSS 与命名 layer，不要求引入额外的样式框架。</li>
      </ul>
      <h2 id="environment" tabIndex={-1}>
        支持环境
      </h2>
      <p>
        当前使用 Octane 0.4.3 与 Ant Design 5.29.3 作为验证基线。开发环境要求
        Node.js ≥ 22.22.2、pnpm 10.29.2。
      </p>
      <p>
        目前主要在 Chromium
        中验证浏览器交互；SSR、其他浏览器及辅助技术的完整验证仍待补充。
      </p>
      <h2 id="progress" tabIndex={-1}>
        当前进度
      </h2>
      <p>
        已通过 npm 的 alpha 标签发布，安装前可查询当前版本。当前实现
        基础输入、布局、选择、信息展示和 Form 平面字段基础版，以及
        ConfigProvider。每个组件页列出当前支持范围与已知差异；目录项数量不代表
        API、视觉或无障碍已完全对齐。
      </p>
      <div className="demo-row">
        <a className="text-link" href="#start">
          快速开始 →
        </a>
        <a className="text-link" href="#components">
          浏览组件 →
        </a>
        <a className="text-link" href="#compatibility">
          兼容清单 →
        </a>
      </div>
      <h2 id="contribute" tabIndex={-1}>
        参与贡献
      </h2>
      <p>
        欢迎通过 Issue
        提交可复现问题，或从一个示例、测试和文档修正开始。新增组件需要同时补齐类型、行为测试、主题和使用文档。
        本地开发步骤见{" "}
        <a className="text-link" href="#contributing">
          参与贡献
        </a>
        。
      </p>
      <p>
        本项目为独立社区探索，不代表 Ant Design 或 Octane 官方。不承诺仅替换
        import 即可迁移整个应用。
      </p>
    </>
  );
}
