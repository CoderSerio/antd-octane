import { ComponentWhenToUse } from "../component-prose";
import {
  ComponentApiTables,
  ComponentTokenTable,
} from "../component-reference";
import reference from "../data-display/popover.json";
import {
  ArrowDemo,
  BasicDemo,
  ControlDemo,
  HoverWithClickDemo,
  OffsetDemo,
  PositionDemo,
  TriggerDemo,
} from "../demos/popover-basic";
import { Demo, DemoGrid, DocMeta, usePageAnchor } from "../docs-ui";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Popover <span>气泡卡片</span>
      </h1>
      <p className="lead">点击/鼠标移入元素，弹出气泡式的卡片浮层。</p>
      <DocMeta name="Popover" />
      <ComponentWhenToUse component="Popover" />
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <DemoGrid>
        <Demo
          id="basic"
          title={"基本"}
          description={"最简单的用法，浮层的大小由内容区域决定。"}
          descriptionMarkdown
          source={() => import("../demos/popover-basic.tsx?raw")}
          sourceExport="BasicDemo"
        >
          <BasicDemo />
        </Demo>
        <Demo
          id="triggerType"
          title={"三种触发方式"}
          description={"鼠标移入、聚集、点击。"}
          descriptionMarkdown
          source={() => import("../demos/popover-basic.tsx?raw")}
          sourceExport="TriggerDemo"
        >
          <TriggerDemo />
        </Demo>
        <Demo
          id="placement"
          title={"位置"}
          description={"位置有十二个方向。"}
          descriptionMarkdown
          source={() => import("../demos/popover-basic.tsx?raw")}
          sourceExport="PositionDemo"
        >
          <PositionDemo />
        </Demo>
        <Demo
          id="arrow"
          title={"箭头展示"}
          description={"通过 `arrow` 属性隐藏箭头。"}
          descriptionMarkdown
          source={() => import("../demos/popover-basic.tsx?raw")}
          sourceExport="ArrowDemo"
        >
          <ArrowDemo />
        </Demo>
        <Demo
          id="shift"
          title={"贴边偏移"}
          description={
            "当 Popover 贴边时，自动偏移并且调整箭头位置。当超出过多时，则一同滚出屏幕。"
          }
          descriptionMarkdown
          source={() => import("../demos/popover-basic.tsx?raw")}
          sourceExport="OffsetDemo"
        >
          <OffsetDemo />
        </Demo>
        <Demo
          id="control"
          title={"从浮层内关闭"}
          description={"使用 `open` 属性控制浮层显示。"}
          descriptionMarkdown
          source={() => import("../demos/popover-basic.tsx?raw")}
          sourceExport="ControlDemo"
        >
          <ControlDemo />
        </Demo>
        <Demo
          id="hover-with-click"
          title={"悬停点击弹出窗口"}
          description={"以下示例显示如何创建可悬停和单击的弹出窗口。"}
          descriptionMarkdown
          source={() => import("../demos/popover-basic.tsx?raw")}
          sourceExport="HoverWithClickDemo"
        >
          <HoverWithClickDemo />
        </Demo>
      </DemoGrid>
      <h2 id="api" tabIndex={-1}>
        API
      </h2>
      <ComponentApiTables component="Popover" sections={reference.api} />

      <h2 id="tokens" tabIndex={-1}>
        主题变量（Design Token）
      </h2>
      <ComponentTokenTable component="Popover" tokens={reference.tokens} />
    </>
  );
}
