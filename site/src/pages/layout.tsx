import { BasicDemo, MoreDemo } from "../demos/layout-basic";
import { CustomTriggerDemo } from "../demos/layout-custom-trigger";
import { HeaderSiderDemo } from "../demos/layout-header-sider";
import { StickyHeaderDemo } from "../demos/layout-sticky-header";
import { ApiTable, Demo, DocMeta, usePageAnchor } from "../docs-ui";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Layout <span>布局</span>
        <small>Alpha</small>
      </h1>
      <p className="lead">组合页头、侧栏、内容和页脚，搭建应用页面。</p>
      <DocMeta name="Layout" />
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <div className="demo-grid">
        <Demo
          id="basic"
          title="上下结构"
          description="使用 Header、Content 和 Footer 组成页面，尺寸与背景随主题调整。"
          source={() => import("../demos/layout-basic.tsx?raw")}
        >
          <BasicDemo />
        </Demo>
        <Demo
          id="more"
          title="响应式侧栏"
          description="点击底部按钮收起侧栏；窗口小于 md 断点时自动收起，onCollapse 同步受控状态。"
          source={() => import("../demos/layout-basic.tsx?raw")}
        >
          <MoreDemo />
        </Demo>
        <Demo
          id="header-sider"
          title="顶部与侧边布局"
          description="Header 在外层，Sider 与 Content 在内层，组合通栏页头和侧栏。"
          source={() => import("../demos/layout-header-sider.tsx?raw")}
        >
          <HeaderSiderDemo />
        </Demo>
        <Demo
          id="custom-trigger"
          title="自定义触发器"
          description="trigger=null 隐藏内置按钮，通过页头按钮控制侧栏。"
          source={() => import("../demos/layout-custom-trigger.tsx?raw")}
        >
          <CustomTriggerDemo />
        </Demo>
        <Demo
          id="sticky-header"
          title="固定头部"
          description="使用应用 CSS 的 sticky 固定头部；演示在独立滚动容器内运行。"
          source={() => import("../demos/layout-sticky-header.tsx?raw")}
        >
          <StickyHeaderDemo />
        </Demo>
      </div>
      <h2 id="api" tabIndex={-1}>
        API
      </h2>
      <ApiTable
        rows={[
          ["Layout.hasSider", "声明包含侧栏；默认自动识别", "boolean", "自动"],
          ["Header / Footer / Content", "布局区域", "Layout 子组件", "—"],
          [
            "Sider.width / collapsedWidth",
            "展开和收起宽度",
            "number | string",
            "200 / 80",
          ],
          [
            "collapsed / defaultCollapsed",
            "受控状态 / 初始状态",
            "boolean",
            "— / false",
          ],
          [
            "collapsible / trigger / reverseArrow",
            "收起按钮配置；null 隐藏",
            "boolean / OctaneNode / boolean",
            "false / 默认 / false",
          ],
          [
            "breakpoint / onBreakpoint",
            "响应式阈值及回调",
            "xs…xxl / (broken) => void",
            "—",
          ],
          [
            "onCollapse / theme",
            "收起回调和侧栏风格",
            "(collapsed, type) => void / dark | light",
            "— / dark",
          ],
        ]}
      />
      <h2 id="tokens" tabIndex={-1}>
        主题与支持范围
      </h2>
      <p>
        支持 Layout 头部、主体、底部、侧栏和 trigger 主题变量。Sider
        触发器定位在当前侧栏底部，未实现上游固定在视口底部的定位方式、zeroWidthTriggerStyle、反向文档布局和完整过渡动画。固定头部与固定侧栏属于应用的
        CSS 布局，需要自行指定滚动容器、定位和占位尺寸。
      </p>
    </>
  );
}
