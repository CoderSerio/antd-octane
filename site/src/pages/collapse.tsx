import { ComponentWhenToUse } from "../component-prose";
import {
  ComponentApiTables,
  ComponentTokenTable,
} from "../component-reference";
import reference from "../data-display/collapse.json";
import {
  AccordionDemo,
  BasicDemo,
  BorderlessDemo,
  CustomDemo,
  ExtraDemo,
  GhostDemo,
  MixDemo,
  NoArrowDemo,
  SizeDemo,
  TriggerDemo,
} from "../demos/collapse-basic";
import { Demo, DemoGrid, DocMeta, usePageAnchor } from "../docs-ui";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Collapse <span>折叠面板</span>
      </h1>
      <p className="lead">可以折叠/展开的内容区域。</p>
      <DocMeta name="Collapse" />
      <ComponentWhenToUse component="Collapse" />
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <DemoGrid>
        <Demo
          id="basic"
          title={"折叠面板"}
          description={"可以同时展开多个面板，这个例子默认展开了第一个。"}
          descriptionMarkdown
          source={() => import("../demos/collapse-basic.tsx?raw")}
          sourceExport="BasicDemo"
        >
          <BasicDemo />
        </Demo>
        <Demo
          id="size"
          title={"面板尺寸"}
          description={
            "折叠面板有大、中、小三种尺寸。\n\n通过设置 `size` 为 `large` `small` 分别把折叠面板设为大、小尺寸。若不设置 `size`，则尺寸默认为中。"
          }
          descriptionMarkdown
          source={() => import("../demos/collapse-basic.tsx?raw")}
          sourceExport="SizeDemo"
        >
          <SizeDemo />
        </Demo>
        <Demo
          id="accordion"
          title={"手风琴"}
          description={"手风琴模式，始终只有一个面板处在激活状态。"}
          descriptionMarkdown
          source={() => import("../demos/collapse-basic.tsx?raw")}
          sourceExport="AccordionDemo"
        >
          <AccordionDemo />
        </Demo>
        <Demo
          id="mix"
          title={"面板嵌套"}
          description={"嵌套折叠面板。"}
          descriptionMarkdown
          source={() => import("../demos/collapse-basic.tsx?raw")}
          sourceExport="MixDemo"
        >
          <MixDemo />
        </Demo>
        <Demo
          id="borderless"
          title={"简洁风格"}
          description={"一套没有边框的简洁样式。"}
          descriptionMarkdown
          source={() => import("../demos/collapse-basic.tsx?raw")}
          sourceExport="BorderlessDemo"
        >
          <BorderlessDemo />
        </Demo>
        <Demo
          id="custom"
          title={"自定义面板"}
          description={"自定义各个面板的背景色、圆角、边距和图标。"}
          descriptionMarkdown
          source={() => import("../demos/collapse-basic.tsx?raw")}
          sourceExport="CustomDemo"
        >
          <CustomDemo />
        </Demo>
        <Demo
          id="noarrow"
          title={"隐藏箭头"}
          description={
            "你可以通过 `showArrow={false}` 隐藏 `CollapsePanel` 组件的箭头图标。"
          }
          descriptionMarkdown
          source={() => import("../demos/collapse-basic.tsx?raw")}
          sourceExport="NoArrowDemo"
        >
          <NoArrowDemo />
        </Demo>
        <Demo
          id="extra"
          title={"额外节点"}
          description={"自定义渲染每个面板右上角的内容。"}
          descriptionMarkdown
          source={() => import("../demos/collapse-basic.tsx?raw")}
          sourceExport="ExtraDemo"
        >
          <ExtraDemo />
        </Demo>
        <Demo
          id="ghost"
          title={"幽灵折叠面板"}
          description={"将折叠面板的背景变成透明。"}
          descriptionMarkdown
          source={() => import("../demos/collapse-basic.tsx?raw")}
          sourceExport="GhostDemo"
        >
          <GhostDemo />
        </Demo>
        <Demo
          id="collapsible"
          title={"可折叠触发区域"}
          description={
            "通过 `collapsible` 属性，可以设置面板的可折叠触发区域。"
          }
          descriptionMarkdown
          source={() => import("../demos/collapse-basic.tsx?raw")}
          sourceExport="TriggerDemo"
        >
          <TriggerDemo />
        </Demo>
      </DemoGrid>
      <h2 id="api" tabIndex={-1}>
        API
      </h2>
      <ComponentApiTables component="Collapse" sections={reference.api} />

      <h2 id="tokens" tabIndex={-1}>
        主题变量（Design Token）
      </h2>
      <ComponentTokenTable component="Collapse" tokens={reference.tokens} />
    </>
  );
}
