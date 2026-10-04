import { ComponentWhenToUse } from "../component-prose";
import {
  ComponentApiTables,
  ComponentTokenTable,
} from "../component-reference";
import reference from "../data-display/empty.json";
import {
  BasicDemo,
  ConfigProviderDemo,
  CustomizeDemo,
  DescriptionDemo,
  SimpleDemo,
} from "../demos/empty-basic";
import { Demo, DemoGrid, DocMeta, usePageAnchor } from "../docs-ui";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Empty <span>空状态</span>
      </h1>
      <p className="lead">空状态时的展示占位图。</p>
      <DocMeta name="Empty" />
      <ComponentWhenToUse component="Empty" />
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <DemoGrid>
        <Demo
          id="basic"
          title={"基本"}
          description={"简单的展示。"}
          descriptionMarkdown
          source={() => import("../demos/empty-basic.tsx?raw")}
          sourceExport="BasicDemo"
        >
          <BasicDemo />
        </Demo>
        <Demo
          id="simple"
          title={"选择图片"}
          description={
            "可以通过设置 `image` 为 `Empty.PRESENTED_IMAGE_SIMPLE` 选择另一种风格的图片。"
          }
          descriptionMarkdown
          source={() => import("../demos/empty-basic.tsx?raw")}
          sourceExport="SimpleDemo"
        >
          <SimpleDemo />
        </Demo>
        <Demo
          id="customize"
          title={"自定义"}
          description={"自定义图片链接、图片大小、描述、附属内容。"}
          descriptionMarkdown
          source={() => import("../demos/empty-basic.tsx?raw")}
          sourceExport="CustomizeDemo"
        >
          <CustomizeDemo />
        </Demo>
        <Demo
          id="config-provider"
          title={"全局化配置"}
          description={"自定义全局组件的 Empty 样式。"}
          descriptionMarkdown
          source={() => import("../demos/empty-basic.tsx?raw")}
          sourceExport="ConfigProviderDemo"
        >
          <ConfigProviderDemo />
        </Demo>
        <Demo
          id="description"
          title={"无描述"}
          description={"无描述展示。"}
          descriptionMarkdown
          source={() => import("../demos/empty-basic.tsx?raw")}
          sourceExport="DescriptionDemo"
        >
          <DescriptionDemo />
        </Demo>
      </DemoGrid>
      <h2 id="api" tabIndex={-1}>
        API
      </h2>
      <ComponentApiTables component="Empty" sections={reference.api} />

      <h2 id="tokens" tabIndex={-1}>
        主题变量（Design Token）
      </h2>
      <ComponentTokenTable component="Empty" tokens={reference.tokens} />
    </>
  );
}
