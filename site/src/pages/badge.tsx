import { ComponentWhenToUse } from "../component-prose";
import {
  ComponentApiTables,
  ComponentTokenTable,
} from "../component-reference";
import reference from "../data-display/badge.json";
import {
  BasicDemo,
  ClickableDemo,
  ColorDemo,
  DotDemo,
  DynamicDemo,
  OffsetDemo,
  OverflowDemo,
  RibbonDemo,
  SizeDemo,
  StandaloneDemo,
  StatusDemo,
} from "../demos/badge-basic";
import { Demo, DemoGrid, DocMeta, usePageAnchor } from "../docs-ui";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Badge <span>徽标数</span>
      </h1>
      <p className="lead">图标右上角的圆形徽标数字。</p>
      <DocMeta name="Badge" />
      <ComponentWhenToUse component="Badge" />
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <DemoGrid>
        <Demo
          id="basic"
          title={"基本"}
          description={
            "简单的徽章展示，当 `count` 为 `0` 时，默认不显示，但是可以使用 `showZero` 修改为显示。"
          }
          descriptionMarkdown
          source={() => import("../demos/badge-basic.tsx?raw")}
          sourceExport="BasicDemo"
        >
          <BasicDemo />
        </Demo>
        <Demo
          id="no-wrapper"
          title={"独立使用"}
          description={
            "不包裹任何元素即是独立使用，可自定样式展现。\n\n> 在右上角的 badge 则限定为红色。"
          }
          descriptionMarkdown
          source={() => import("../demos/badge-basic.tsx?raw")}
          sourceExport="StandaloneDemo"
        >
          <StandaloneDemo />
        </Demo>
        <Demo
          id="overflow"
          title={"封顶数字"}
          description={
            // biome-ignore lint/suspicious/noTemplateCurlyInString: show the literal upstream placeholder in documentation.
            "超过 `overflowCount` 的会显示为 `${overflowCount}+`，默认的 `overflowCount` 为 `99`。"
          }
          descriptionMarkdown
          source={() => import("../demos/badge-basic.tsx?raw")}
          sourceExport="OverflowDemo"
        >
          <OverflowDemo />
        </Demo>
        <Demo
          id="dot"
          title={"讨嫌的小红点"}
          description={"没有具体的数字。"}
          descriptionMarkdown
          source={() => import("../demos/badge-basic.tsx?raw")}
          sourceExport="DotDemo"
        >
          <DotDemo />
        </Demo>
        <Demo
          id="change"
          title={"动态"}
          description={"展示动态变化的效果。"}
          descriptionMarkdown
          source={() => import("../demos/badge-basic.tsx?raw")}
          sourceExport="DynamicDemo"
        >
          <DynamicDemo />
        </Demo>
        <Demo
          id="link"
          title={"可点击"}
          description={"用 a 标签进行包裹即可。"}
          descriptionMarkdown
          source={() => import("../demos/badge-basic.tsx?raw")}
          sourceExport="ClickableDemo"
        >
          <ClickableDemo />
        </Demo>
        <Demo
          id="offset"
          title={"自定义位置偏移"}
          description={
            "设置状态点的位置偏移，格式为 `[left, top]`，表示状态点距默认位置左侧、上方的偏移量。"
          }
          descriptionMarkdown
          source={() => import("../demos/badge-basic.tsx?raw")}
          sourceExport="OffsetDemo"
        >
          <OffsetDemo />
        </Demo>
        <Demo
          id="size"
          title={"大小"}
          description={"可以设置有数字徽标的大小。"}
          descriptionMarkdown
          source={() => import("../demos/badge-basic.tsx?raw")}
          sourceExport="SizeDemo"
        >
          <SizeDemo />
        </Demo>
        <Demo
          id="status"
          title={"状态点"}
          description={"用于表示状态的小圆点。"}
          descriptionMarkdown
          source={() => import("../demos/badge-basic.tsx?raw")}
          sourceExport="StatusDemo"
        >
          <StatusDemo />
        </Demo>
        <Demo
          id="colorful"
          title={"多彩徽标"}
          description={
            "我们添加了多种预设色彩的徽标样式，用作不同场景使用。如果预设值不能满足你的需求，可以设置为具体的色值。"
          }
          descriptionMarkdown
          source={() => import("../demos/badge-basic.tsx?raw")}
          sourceExport="ColorDemo"
        >
          <ColorDemo />
        </Demo>
        <Demo
          id="ribbon"
          title={"缎带"}
          description={"使用缎带型的徽标。"}
          descriptionMarkdown
          source={() => import("../demos/badge-basic.tsx?raw")}
          sourceExport="RibbonDemo"
        >
          <RibbonDemo />
        </Demo>
      </DemoGrid>
      <h2 id="api" tabIndex={-1}>
        API
      </h2>
      <ComponentApiTables component="Badge" sections={reference.api} />

      <h2 id="tokens" tabIndex={-1}>
        主题变量（Design Token）
      </h2>
      <ComponentTokenTable component="Badge" tokens={reference.tokens} />
    </>
  );
}
