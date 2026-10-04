import { ComponentWhenToUse } from "../component-prose";
import {
  ComponentApiTables,
  ComponentTokenTable,
} from "../component-reference";
import reference from "../data-display/descriptions.json";
import {
  BasicDemo,
  BlockDemo,
  BorderedDemo,
  ResponsiveDemo,
  SizeDemo,
  VerticalBorderedDemo,
  VerticalDemo,
} from "../demos/descriptions-basic";
import { Demo, DemoGrid, DocMeta, usePageAnchor } from "../docs-ui";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Descriptions <span>描述列表</span>
      </h1>
      <p className="lead">展示多个只读字段的组合。</p>
      <DocMeta name="Descriptions" />
      <ComponentWhenToUse component="Descriptions" />
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <DemoGrid>
        <Demo
          id="basic"
          title={"基本"}
          description={"简单的展示。"}
          descriptionMarkdown
          source={() => import("../demos/descriptions-basic.tsx?raw")}
          sourceExport="BasicDemo"
        >
          <BasicDemo />
        </Demo>
        <Demo
          id="border"
          title={"带边框的"}
          description={"带边框和背景颜色列表。"}
          descriptionMarkdown
          source={() => import("../demos/descriptions-basic.tsx?raw")}
          sourceExport="BorderedDemo"
        >
          <BorderedDemo />
        </Demo>
        <Demo
          id="size"
          title={"自定义尺寸"}
          description={"自定义尺寸，适应在各种容器中展示。"}
          descriptionMarkdown
          source={() => import("../demos/descriptions-basic.tsx?raw")}
          sourceExport="SizeDemo"
        >
          <SizeDemo />
        </Demo>
        <Demo
          id="responsive"
          title={"响应式"}
          description={"通过响应式的配置可以实现在小屏幕设备上的完美呈现。"}
          descriptionMarkdown
          source={() => import("../demos/descriptions-basic.tsx?raw")}
          sourceExport="ResponsiveDemo"
        >
          <ResponsiveDemo />
        </Demo>
        <Demo
          id="vertical"
          title={"垂直"}
          description={"垂直的列表。"}
          descriptionMarkdown
          source={() => import("../demos/descriptions-basic.tsx?raw")}
          sourceExport="VerticalDemo"
        >
          <VerticalDemo />
        </Demo>
        <Demo
          id="vertical-border"
          title={"垂直带边框的"}
          description={"垂直带边框和背景颜色的列表。"}
          descriptionMarkdown
          source={() => import("../demos/descriptions-basic.tsx?raw")}
          sourceExport="VerticalBorderedDemo"
        >
          <VerticalBorderedDemo />
        </Demo>
        <Demo
          id="block"
          title={"整行"}
          description={"整行的展示。"}
          descriptionMarkdown
          source={() => import("../demos/descriptions-basic.tsx?raw")}
          sourceExport="BlockDemo"
        >
          <BlockDemo />
        </Demo>
      </DemoGrid>
      <h2 id="api" tabIndex={-1}>
        API
      </h2>
      <ComponentApiTables component="Descriptions" sections={reference.api} />

      <h2 id="tokens" tabIndex={-1}>
        主题变量（Design Token）
      </h2>
      <ComponentTokenTable component="Descriptions" tokens={reference.tokens} />
    </>
  );
}
