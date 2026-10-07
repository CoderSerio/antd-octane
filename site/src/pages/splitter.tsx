import { ComponentDescription, ComponentWhenToUse } from "../component-prose";
import {
  ComponentApiTables,
  ComponentTokenTable,
} from "../component-reference";
import { BasicDemo, MoreDemo } from "../demos/splitter-basic";
import { ControlledDemo } from "../demos/splitter-controlled";
import { MultipleDemo } from "../demos/splitter-multiple";
import { NestedDemo } from "../demos/splitter-nested";
import { ResizableDemo } from "../demos/splitter-resizable";
import { Demo, DemoGrid, DocMeta, usePageAnchor } from "../docs-ui";
import reference from "../layout/splitter.json";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Splitter <span>分隔面板</span>
      </h1>
      <ComponentDescription component="Splitter" />
      <DocMeta name="Splitter" />
      <ComponentWhenToUse component="Splitter" />
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <DemoGrid
        component="splitter"
        columns={reference.demoColumns === 2 ? 2 : 1}
      >
        <Demo
          id="basic"
          title={"基本用法"}
          description={"初始化面板大小，面板大小限制。"}
          source={() => import("../demos/splitter-basic.tsx?raw")}
          descriptionMarkdown
        >
          <BasicDemo />
        </Demo>
        <Demo
          id="controlled"
          title={"受控模式"}
          description={
            "受控调整尺寸。当 Panel 之间任意一方禁用 `resizable`，则其拖拽将被禁用。"
          }
          descriptionMarkdown
          source={() => import("../demos/splitter-controlled.tsx?raw")}
        >
          <ControlledDemo />
        </Demo>
        <Demo
          id="more"
          title={"垂直方向"}
          description={"使用垂直布局。"}
          source={() => import("../demos/splitter-basic.tsx?raw")}
          descriptionMarkdown
        >
          <MoreDemo />
        </Demo>
        <Demo
          id="multiple"
          title="多面板"
          description="三块面板按初始比例分配空间，每条分隔线只调整相邻面板。"
          source={() => import("../demos/splitter-multiple.tsx?raw")}
        >
          <MultipleDemo />
        </Demo>
        <Demo
          id="nested"
          title="复杂组合"
          description="在 Panel 内嵌套另一个 Splitter，组成不同方向的区域。"
          source={() => import("../demos/splitter-nested.tsx?raw")}
        >
          <NestedDemo />
        </Demo>
        <Demo
          id="resizable"
          title="禁用调整"
          description="resizable=false 禁止相邻分隔线的鼠标与键盘调整。"
          source={() => import("../demos/splitter-resizable.tsx?raw")}
        >
          <ResizableDemo />
        </Demo>
      </DemoGrid>
      <h2 id="api" tabIndex={-1}>
        API
      </h2>
      <ComponentApiTables component="Splitter" sections={reference.api} />
      <h2 id="tokens" tabIndex={-1}>
        主题变量（Design Token）
      </h2>
      <ComponentTokenTable component="Splitter" tokens={reference.tokens} />
    </>
  );
}
