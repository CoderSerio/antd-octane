import { ComponentWhenToUse } from "../component-prose";
import {
  ComponentApiTables,
  ComponentTokenTable,
} from "../component-reference";
import reference from "../data-display/tooltip.json";
import {
  ArrowDemo,
  BasicDemo,
  ColorDemo,
  CustomDemo,
  DisabledDemo,
  MoreDemo,
  OffsetDemo,
} from "../demos/tooltip-basic";
import { Demo, DemoGrid, DocMeta, usePageAnchor } from "../docs-ui";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Tooltip <span>文字提示</span>
      </h1>
      <p className="lead">简单的文字提示气泡框。</p>
      <DocMeta name="Tooltip" />
      <ComponentWhenToUse component="Tooltip" />
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <DemoGrid>
        <Demo
          id="basic"
          title={"基本"}
          description={"最简单的用法。"}
          descriptionMarkdown
          source={() => import("../demos/tooltip-basic.tsx?raw")}
          sourceExport="BasicDemo"
        >
          <BasicDemo />
        </Demo>
        <Demo
          id="placement"
          title={"位置"}
          description={"位置有 12 个方向。"}
          descriptionMarkdown
          source={() => import("../demos/tooltip-basic.tsx?raw")}
          sourceExport="MoreDemo"
        >
          <MoreDemo />
        </Demo>
        <Demo
          id="arrow"
          title={"箭头展示"}
          description={"支持显示、隐藏以及将箭头保持居中定位。"}
          descriptionMarkdown
          source={() => import("../demos/tooltip-basic.tsx?raw")}
          sourceExport="ArrowDemo"
        >
          <ArrowDemo />
        </Demo>
        <Demo
          id="shift"
          title={"贴边偏移"}
          description={
            "当 Tooltip 贴边时，自动偏移并且调整箭头位置。当超出过多时，则一同滚出屏幕。"
          }
          descriptionMarkdown
          source={() => import("../demos/tooltip-basic.tsx?raw")}
          sourceExport="OffsetDemo"
        >
          <OffsetDemo />
        </Demo>
        <Demo
          id="colorful"
          title={"多彩文字提示"}
          description={
            "我们添加了多种预设色彩的文字提示样式，用作不同场景使用。"
          }
          descriptionMarkdown
          source={() => import("../demos/tooltip-basic.tsx?raw")}
          sourceExport="ColorDemo"
        >
          <ColorDemo />
        </Demo>
        <Demo
          id="disabled"
          title={"禁用"}
          description={
            '通过设置 `title={null}` 或者 `title=""` 可以禁用 Tooltip。'
          }
          descriptionMarkdown
          source={() => import("../demos/tooltip-basic.tsx?raw")}
          sourceExport="DisabledDemo"
        >
          <DisabledDemo />
        </Demo>
        <Demo
          id="wrap-custom-component"
          title={"自定义子组件"}
          description={"与自定义组件一起使用."}
          descriptionMarkdown
          source={() => import("../demos/tooltip-basic.tsx?raw")}
          sourceExport="CustomDemo"
        >
          <CustomDemo />
        </Demo>
      </DemoGrid>
      <h2 id="api" tabIndex={-1}>
        API
      </h2>
      <ComponentApiTables component="Tooltip" sections={reference.api} />

      <h2 id="tokens" tabIndex={-1}>
        主题变量（Design Token）
      </h2>
      <ComponentTokenTable component="Tooltip" tokens={reference.tokens} />
    </>
  );
}
