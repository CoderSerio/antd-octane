import { usePageAnchor } from "../docs-ui";

export default function ChangelogPage({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <div className="eyebrow">GUIDE / CHANGELOG</div>
      <h1>更新日志</h1>
      <p className="lead">这里记录已发布到 npm 的 alpha 版本。</p>
      <p>
        文档站当前安装 <code>antd-octane@0.1.0-alpha.5</code>。完整记录见{" "}
        <a
          className="text-link"
          href="https://github.com/CoderSerio/antd-octane/blob/main/CHANGELOG.md"
        >
          仓库 CHANGELOG.md
        </a>
        。组件支持范围见{" "}
        <a className="text-link" href="#compatibility">
          兼容与迁移
        </a>
        。
      </p>
      <h2 id="alpha-5" tabIndex={-1}>
        0.1.0-alpha.5 · 2026-09-29
      </h2>
      <p>
        Select 新增多选、数组受控值、移除回调与键盘操作；修复 Input
        字数统计容器宽度、FloatButton.Group
        点击回调，并补充导航及反馈组件案例。标签模式、labelInValue
        和虚拟列表仍未支持。
      </p>
      <h2 id="alpha-4" tabIndex={-1}>
        0.1.0-alpha.4 · 2026-09-28
      </h2>
      <p>
        Button 新增图标位置与延迟加载配置，Input 系列新增内置字数统计，
        同时修复隐藏的全屏 Spin
        可能遮挡点击的问题。非数据展示组件页补充了更多可运行案例。
      </p>
      <h2 id="alpha-3" tabIndex={-1}>
        0.1.0-alpha.3 · 2026-09-28
      </h2>
      <p>
        新增 Form
        基础版，提供平面字段绑定、同步规则校验、提交、重置和实例方法；嵌套字段、动态列表与异步校验仍待实现。
      </p>
      <h2 id="alpha-2" tabIndex={-1}>
        0.1.0-alpha.2 · 2026-09-27
      </h2>
      <p>
        新增 Select 单选基础版，支持搜索、受控值、键盘操作、清除与主题尺寸。
        多选、标签模式、labelInValue 和虚拟列表仍待实现。
      </p>
      <h2 id="alpha-1" tabIndex={-1}>
        0.1.0-alpha.1 · 2026-09-27
      </h2>
      <ul className="prose-list">
        <li>npm 包以原始 TSX 源码为入口，由消费项目的 Octane 编译器处理。</li>
        <li>
          修复 TSRX 项目中的 Space、Splitter.Panel 和 Carousel 子节点渲染。
        </li>
        <li>扩展独立安装包验证，覆盖 TSRX 渲染和 Signal 驱动的受控交互。</li>
      </ul>
      <p>
        当前仍需 Octane 0.4.3 和显式导入 <code>antd-octane/style.css</code>。
        alpha 版本尚未覆盖完整 Ant Design API、视觉、无障碍和 SSR 兼容。
      </p>
      <h2 id="alpha-0" tabIndex={-1}>
        0.1.0-alpha.0 · 2026-09-26
      </h2>
      <p>首个 npm alpha 预览版本，提供基础组件、主题算法与中文文档站。</p>
    </>
  );
}
