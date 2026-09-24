import { Button, Checkbox, Input, Switch } from "antd-octane";
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
      <div className="component-catalog">
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
      </div>
      <h2 id="layout" tabIndex={-1}>
        布局 <small className="count">3</small>
      </h2>
      <div className="component-catalog">
        {[
          ["flex", "Flex 弹性布局"],
          ["space", "Space 间距"],
          ["divider", "Divider 分割线"],
        ].map(([id, label]) => (
          <section className="component-card" key={id}>
            <a href={`#${id}`}>
              <strong>{label}</strong>
              <span>查看文档 →</span>
            </a>
          </section>
        ))}
      </div>
      <h2 id="entry" tabIndex={-1}>
        数据录入 <small className="count">3</small>
      </h2>
      <div className="component-catalog">
        <section className="component-card">
          <div className="component-preview">
            <Input placeholder="请输入内容" aria-label="组件预览输入" />
          </div>
          <a href="#input">
            <strong>Input 输入框</strong>
            <span>查看文档 →</span>
          </a>
        </section>
        <section className="component-card">
          <div className="component-preview">
            <Checkbox defaultChecked>Checkbox</Checkbox>
          </div>
          <a href="#checkbox">
            <strong>Checkbox 多选框</strong>
            <span>查看文档 →</span>
          </a>
        </section>
      </div>
      <div className="component-catalog">
        <section className="component-card">
          <div className="component-preview">
            <Switch aria-label="预览开关" defaultChecked />
          </div>
          <a href="#switch">
            <strong>Switch 开关</strong>
            <span>查看文档 →</span>
          </a>
        </section>
      </div>
      <h2 id="configuration" tabIndex={-1}>
        主题与配置
      </h2>
      <p>ConfigProvider 提供全局主题、嵌套继承和组件级覆盖。</p>
      <a className="text-link" href="#theme">
        查看主题配置与兼容边界 →
      </a>
    </>
  );
}
