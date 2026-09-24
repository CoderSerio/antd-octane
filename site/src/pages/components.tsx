import { Button } from "antd-octane";
import { usePageAnchor } from "../docs-ui";
export default function ComponentsPage({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>组件总览</h1>
      <p className="lead">
        从常用组件开始，逐步验证 Ant Design 在 Octane 中的体验。
      </p>
      <p className="intro">当前为开发预览，仅列出已实现的组件与配置能力。</p>
      <h2 id="general" tabIndex={-1}>
        通用 <small className="count">1</small>
      </h2>
      <section className="component-card">
        <div className="component-preview">
          <Button type="primary">Primary</Button>
          <Button>Default</Button>
        </div>
        <a href="#button">
          <strong>Button 按钮</strong>
          <span>查看文档 →</span>
        </a>
      </section>
      <h2 id="configuration" tabIndex={-1}>
        主题与配置
      </h2>
      <p>ConfigProvider 提供全局主题、嵌套继承和 Button 组件级覆盖。</p>
      <a className="text-link" href="#theme">
        查看主题配置与兼容边界 →
      </a>
    </>
  );
}
