import { ComponentDescription, ComponentWhenToUse } from "../component-prose";
import {
  ComponentApiTables,
  ComponentTokenTable,
} from "../component-reference";
import { BasicDemo } from "../demos/breadcrumb-basic";
import { IconsDemo } from "../demos/breadcrumb-icons";
import { SeparatorDemo } from "../demos/breadcrumb-separator";
import { SeparatorItemsDemo } from "../demos/breadcrumb-separator-items";
import { Demo, DemoGrid, DocMeta, usePageAnchor } from "../docs-ui";
import reference from "../navigation/breadcrumb.json";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Breadcrumb <span>面包屑</span>
      </h1>
      <ComponentDescription component="Breadcrumb" />
      <DocMeta name="Breadcrumb" />
      <ComponentWhenToUse component="Breadcrumb" />
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <DemoGrid
        component="breadcrumb"
        columns={reference.demoColumns === 2 ? 2 : 1}
      >
        <Demo
          id="basic"
          title="基本"
          description={"最简单的用法。"}
          descriptionMarkdown
          source={() => import("../demos/breadcrumb-basic.tsx?raw")}
        >
          <BasicDemo />
        </Demo>
        <Demo
          id="withIcon"
          title="带有图标的"
          description={"图标放在文字前面。"}
          descriptionMarkdown
          source={() => import("../demos/breadcrumb-icons.tsx?raw")}
        >
          <IconsDemo />
        </Demo>
        <Demo
          id="separator"
          title="分隔符"
          description={'使用 `separator=">"` 可以自定义分隔符。'}
          descriptionMarkdown
          source={() => import("../demos/breadcrumb-separator.tsx?raw")}
        >
          <SeparatorDemo />
        </Demo>
        <Demo
          id="separator-component"
          title="独立的分隔符"
          description={"自定义单独的分隔符。"}
          descriptionMarkdown
          source={() => import("../demos/breadcrumb-separator-items.tsx?raw")}
        >
          <SeparatorItemsDemo />
        </Demo>
      </DemoGrid>
      <h2 id="api" tabIndex={-1}>
        API
      </h2>
      <ComponentApiTables component="Breadcrumb" sections={reference.api} />
      <h2 id="tokens" tabIndex={-1}>
        主题变量（Design Token）
      </h2>
      <ComponentTokenTable component="Breadcrumb" tokens={reference.tokens} />
    </>
  );
}
