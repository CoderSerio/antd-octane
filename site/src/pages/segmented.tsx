import { ComponentWhenToUse } from "../component-prose";
import {
  ComponentApiTables,
  ComponentTokenTable,
} from "../component-reference";
import reference from "../data-display/segmented.json";
import {
  BasicDemo,
  BlockDemo,
  ControlledDemo,
  CustomRenderDemo,
  DisabledDemo,
  DynamicDemo,
  IconDemo,
  IconOnlyDemo,
  NameDemo,
  ShapeDemo,
  SizesDemo,
  VerticalDemo,
} from "../demos/segmented-basic";
import { Demo, DemoGrid, DocMeta, usePageAnchor } from "../docs-ui";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Segmented <span>分段控制器</span>
      </h1>
      <p className="lead">用于展示多个选项并允许用户选择其中单个选项。</p>
      <DocMeta name="Segmented" />
      <ComponentWhenToUse component="Segmented" />
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <DemoGrid>
        <Demo
          id="basic"
          title={"基本"}
          description={"最简单的用法。"}
          descriptionMarkdown
          source={() => import("../demos/segmented-basic.tsx?raw")}
          sourceExport="BasicDemo"
        >
          <BasicDemo />
        </Demo>
        <Demo
          id="vertical"
          title={"垂直方向"}
          description={"垂直方向。"}
          descriptionMarkdown
          source={() => import("../demos/segmented-basic.tsx?raw")}
          sourceExport="VerticalDemo"
        >
          <VerticalDemo />
        </Demo>
        <Demo
          id="block"
          title={"Block 分段选择器"}
          description={"`block` 属性使其适合父元素宽度。"}
          descriptionMarkdown
          source={() => import("../demos/segmented-basic.tsx?raw")}
          sourceExport="BlockDemo"
        >
          <BlockDemo />
        </Demo>
        <Demo
          id="shape"
          title={"胶囊形状"}
          description={"胶囊型的 Segmented。"}
          descriptionMarkdown
          source={() => import("../demos/segmented-basic.tsx?raw")}
          sourceExport="ShapeDemo"
        >
          <ShapeDemo />
        </Demo>
        <Demo
          id="disabled"
          title={"不可用"}
          description={"Segmented 不可用。"}
          descriptionMarkdown
          source={() => import("../demos/segmented-basic.tsx?raw")}
          sourceExport="DisabledDemo"
        >
          <DisabledDemo />
        </Demo>
        <Demo
          id="controlled"
          title={"受控模式"}
          description={"受控的 Segmented。"}
          descriptionMarkdown
          source={() => import("../demos/segmented-basic.tsx?raw")}
          sourceExport="ControlledDemo"
        >
          <ControlledDemo />
        </Demo>
        <Demo
          id="custom"
          title={"自定义渲染"}
          description={"使用 OctaneNode 自定义渲染每一个 Segmented Item。"}
          descriptionMarkdown
          source={() => import("../demos/segmented-basic.tsx?raw")}
          sourceExport="CustomRenderDemo"
        >
          <CustomRenderDemo />
        </Demo>
        <Demo
          id="dynamic"
          title={"动态数据"}
          description={"动态加载数据。"}
          descriptionMarkdown
          source={() => import("../demos/segmented-basic.tsx?raw")}
          sourceExport="DynamicDemo"
        >
          <DynamicDemo />
        </Demo>
        <Demo
          id="size"
          title={"三种大小"}
          description={
            "我们为 `<Segmented />` 组件定义了三种尺寸（大、默认、小），高度分别为 `40px`、`32px` 和 `24px`。"
          }
          descriptionMarkdown
          source={() => import("../demos/segmented-basic.tsx?raw")}
          sourceExport="SizesDemo"
        >
          <SizesDemo />
        </Demo>
        <Demo
          id="with-icon"
          title={"设置图标"}
          description={"给 Segmented Item 设置 Icon。"}
          descriptionMarkdown
          source={() => import("../demos/segmented-basic.tsx?raw")}
          sourceExport="IconDemo"
        >
          <IconDemo />
        </Demo>
        <Demo
          id="icon-only"
          title={"只设置图标"}
          description={"在 Segmented Item 选项中只设置 Icon。"}
          descriptionMarkdown
          source={() => import("../demos/segmented-basic.tsx?raw")}
          sourceExport="IconOnlyDemo"
        >
          <IconOnlyDemo />
        </Demo>
        <Demo
          id="with-name"
          title={"配合 name 使用"}
          description={
            "可以为 Segmented 配置 `name` 参数，为组合内的 input 元素赋予相同的 `name` 属性，使浏览器把 Segmented 下的 input 真正看作是一组（例如可以通过方向键始终**在同一组内**更改选项）。"
          }
          descriptionMarkdown
          source={() => import("../demos/segmented-basic.tsx?raw")}
          sourceExport="NameDemo"
        >
          <NameDemo />
        </Demo>
      </DemoGrid>
      <h2 id="api" tabIndex={-1}>
        API
      </h2>
      <ComponentApiTables component="Segmented" sections={reference.api} />

      <h2 id="tokens" tabIndex={-1}>
        主题变量（Design Token）
      </h2>
      <ComponentTokenTable component="Segmented" tokens={reference.tokens} />
    </>
  );
}
