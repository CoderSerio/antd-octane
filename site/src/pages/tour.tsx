import { ComponentWhenToUse } from "../component-prose";
import {
  ComponentApiTables,
  ComponentTokenTable,
} from "../component-reference";
import reference from "../data-display/tour.json";
import {
  ActionsDemo,
  BasicDemo,
  GapDemo,
  IndicatorDemo,
  MaskDemo,
  NonModalDemo,
  PlacementDemo,
} from "../demos/tour-basic";
import { Demo, DemoGrid, DocMeta, usePageAnchor } from "../docs-ui";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Tour <span>漫游式引导</span>
      </h1>
      <p className="lead">用于分步引导用户了解产品功能的气泡组件。</p>
      <DocMeta name="Tour" />
      <ComponentWhenToUse component="Tour" />
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <DemoGrid>
        <Demo
          id="basic"
          title={"基本"}
          description={"最简单的用法。"}
          descriptionMarkdown
          source={() => import("../demos/tour-basic.tsx?raw")}
          sourceExport="BasicDemo"
        >
          <BasicDemo />
        </Demo>
        <Demo
          id="non-modal"
          title={"非模态"}
          description={
            '使用 `mask={false}` 可以将引导变为非模态，同时为了强调引导本身，建议与 `type="primary"` 组合使用。'
          }
          descriptionMarkdown
          source={() => import("../demos/tour-basic.tsx?raw")}
          sourceExport="NonModalDemo"
        >
          <NonModalDemo />
        </Demo>
        <Demo
          id="placement"
          title={"位置"}
          description={
            "改变引导相对于目标的位置，共有 12 种位置可供选择。当 `target={null}` 时引导将会展示在正中央。"
          }
          descriptionMarkdown
          source={() => import("../demos/tour-basic.tsx?raw")}
          sourceExport="PlacementDemo"
        >
          <PlacementDemo />
        </Demo>
        <Demo
          id="mask"
          title={"自定义遮罩样式"}
          description={"自定义遮罩样式。"}
          descriptionMarkdown
          source={() => import("../demos/tour-basic.tsx?raw")}
          sourceExport="MaskDemo"
        >
          <MaskDemo />
        </Demo>
        <Demo
          id="indicator"
          title={"自定义指示器"}
          description={"自定义指示器。"}
          descriptionMarkdown
          source={() => import("../demos/tour-basic.tsx?raw")}
          sourceExport="IndicatorDemo"
        >
          <IndicatorDemo />
        </Demo>
        <Demo
          id="actions-render"
          title={"自定义操作按钮"}
          description={"自定义操作按钮。"}
          descriptionMarkdown
          source={() => import("../demos/tour-basic.tsx?raw")}
          sourceExport="ActionsDemo"
        >
          <ActionsDemo />
        </Demo>
        <Demo
          id="gap"
          title={"自定义高亮区域的样式"}
          description={"使用 `gap` 参数来控制高亮区域的边距和圆角。"}
          descriptionMarkdown
          source={() => import("../demos/tour-basic.tsx?raw")}
          sourceExport="GapDemo"
        >
          <GapDemo />
        </Demo>
      </DemoGrid>
      <h2 id="api" tabIndex={-1}>
        API
      </h2>
      <ComponentApiTables component="Tour" sections={reference.api} />

      <h2 id="tokens" tabIndex={-1}>
        主题变量（Design Token）
      </h2>
      <ComponentTokenTable component="Tour" tokens={reference.tokens} />
    </>
  );
}
