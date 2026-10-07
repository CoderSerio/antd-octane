import { ComponentDescription, ComponentWhenToUse } from "../component-prose";
import {
  ComponentApiTables,
  ComponentTokenTable,
} from "../component-reference";
import { BasicDemo } from "../demos/divider-basic";
import { OrientationDemo } from "../demos/divider-orientation";
import { PlainDemo } from "../demos/divider-plain";
import { VerticalDemo } from "../demos/divider-vertical";
import { Demo, DemoGrid, DocMeta, usePageAnchor } from "../docs-ui";
import reference from "../layout/divider.json";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Divider <span>分割线</span>
      </h1>
      <ComponentDescription component="Divider" />
      <DocMeta name="Divider" />
      <ComponentWhenToUse component="Divider" />
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <DemoGrid
        component="divider"
        columns={reference.demoColumns === 2 ? 2 : 1}
      >
        <Demo
          id="basic"
          title="水平分割线"
          description={"默认为水平分割线，可在中间加入文字。"}
          source={() => import("../demos/divider-basic.tsx?raw")}
        >
          <BasicDemo />
        </Demo>
        <Demo
          id="orientation"
          title="带文字的分割线"
          description={"分割线中带有文字，可以用 `orientation` 指定文字位置。"}
          descriptionMarkdown
          source={() => import("../demos/divider-orientation.tsx?raw")}
        >
          <OrientationDemo />
        </Demo>
        <Demo
          id="plain"
          title="分割文字使用正文样式"
          description={"使用 `plain` 可以设置为更轻量的分割文字样式。"}
          descriptionMarkdown
          source={() => import("../demos/divider-plain.tsx?raw")}
        >
          <PlainDemo />
        </Demo>
        <Demo
          id="vertical"
          title="垂直分割线"
          description={'使用 `type="vertical"` 设置为行内的垂直分割线。'}
          descriptionMarkdown
          source={() => import("../demos/divider-vertical.tsx?raw")}
        >
          <VerticalDemo />
        </Demo>
      </DemoGrid>
      <h2 id="api" tabIndex={-1}>
        API
      </h2>
      <ComponentApiTables component="Divider" sections={reference.api} />
      <h2 id="tokens" tabIndex={-1}>
        主题变量（Design Token）
      </h2>
      <ComponentTokenTable component="Divider" tokens={reference.tokens} />
    </>
  );
}
