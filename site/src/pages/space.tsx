import { ComponentDescription, ComponentWhenToUse } from "../component-prose";
import {
  ComponentApiTables,
  ComponentTokenTable,
} from "../component-reference";
import { AlignmentDemo } from "../demos/space-alignment";
import { BasicDemo } from "../demos/space-basic";
import { CompactDemo } from "../demos/space-compact";
import { CompactButtonsDemo } from "../demos/space-compact-buttons";
import { CompactVerticalDemo } from "../demos/space-compact-vertical";
import { LayoutDemo } from "../demos/space-layout";
import { SizesDemo } from "../demos/space-sizes";
import { SplitDemo } from "../demos/space-split";
import { VerticalDemo } from "../demos/space-vertical";
import { Demo, DemoGrid, DocMeta, usePageAnchor } from "../docs-ui";
import reference from "../layout/space.json";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Space <span>间距</span>
      </h1>
      <ComponentDescription component="Space" />
      <DocMeta name="Space" />
      <ComponentWhenToUse component="Space" />
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <DemoGrid component="space" columns={reference.demoColumns === 2 ? 2 : 1}>
        <Demo
          id="basic"
          title="基本用法"
          description={"相邻组件水平间距。"}
          source={() => import("../demos/space-basic.tsx?raw")}
        >
          <BasicDemo />
        </Demo>
        <Demo
          id="vertical"
          title="垂直间距"
          description={"相邻组件垂直间距。"}
          source={() => import("../demos/space-vertical.tsx?raw")}
        >
          <VerticalDemo />
        </Demo>
        <Demo
          id="sizes"
          title="间距大小"
          description={
            "使用 `size` 设置元素之间的间距，预设了 `small`、`middle`、`large` 三种尺寸，也可以自定义间距，若不设置 `size`，则默认为 `small`。"
          }
          descriptionMarkdown
          source={() => import("../demos/space-sizes.tsx?raw")}
        >
          <SizesDemo />
        </Demo>
        <Demo
          id="alignment"
          title="对齐"
          description={"设置对齐模式。"}
          source={() => import("../demos/space-alignment.tsx?raw")}
        >
          <AlignmentDemo />
        </Demo>
        <Demo
          id="layout"
          title="自动换行"
          description={"自动换行。"}
          source={() => import("../demos/space-layout.tsx?raw")}
        >
          <LayoutDemo />
        </Demo>
        <Demo
          id="split"
          title="分隔符"
          description={"相邻组件分隔符。"}
          source={() => import("../demos/space-split.tsx?raw")}
        >
          <SplitDemo />
        </Demo>
        <Demo
          id="compact"
          title="紧凑布局组合"
          description={"使用 Space.Compact 让表单组件之间紧凑连接且合并边框。"}
          source={() => import("../demos/space-compact.tsx?raw")}
        >
          <CompactDemo />
        </Demo>
        <Demo
          id="compact-buttons"
          title="Button 紧凑布局"
          description={"Button 组件紧凑排列的示例。"}
          source={() => import("../demos/space-compact-buttons.tsx?raw")}
        >
          <CompactButtonsDemo />
        </Demo>
        <Demo
          id="compact-vertical"
          title="垂直方向紧凑布局"
          description={"垂直方向的紧凑布局，目前仅支持 Button 组合。"}
          source={() => import("../demos/space-compact-vertical.tsx?raw")}
        >
          <CompactVerticalDemo />
        </Demo>
      </DemoGrid>
      <h2 id="api" tabIndex={-1}>
        API
      </h2>
      <ComponentApiTables component="Space" sections={reference.api} />
      <h2 id="tokens" tabIndex={-1}>
        主题变量（Design Token）
      </h2>
      <ComponentTokenTable component="Space" tokens={reference.tokens} />
    </>
  );
}
