import { ComponentWhenToUse } from "../component-prose";
import {
  ComponentApiTables,
  ComponentTokenTable,
} from "../component-reference";
import reference from "../data-display/card.json";
import {
  BasicDemo,
  BorderlessDemo,
  FlexibleDemo,
  GridDemo,
  InColumnDemo,
  InnerDemo,
  LoadingDemo,
  MetaDemo,
  SimpleDemo,
  TabsDemo,
} from "../demos/card-basic";
import { Demo, DemoGrid, DocMeta, usePageAnchor } from "../docs-ui";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Card <span>卡片</span>
      </h1>
      <p className="lead">通用卡片容器。</p>
      <DocMeta name="Card" />
      <ComponentWhenToUse component="Card" />
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <DemoGrid>
        <Demo
          id="basic"
          title={"典型卡片"}
          description={"包含标题、内容、操作区域。"}
          descriptionMarkdown
          source={() => import("../demos/card-basic.tsx?raw")}
          sourceExport="BasicDemo"
        >
          <BasicDemo />
        </Demo>
        <Demo
          id="border-less"
          title={"无边框"}
          description={"在灰色背景上使用无边框的卡片。"}
          descriptionMarkdown
          source={() => import("../demos/card-basic.tsx?raw")}
          sourceExport="BorderlessDemo"
        >
          <BorderlessDemo />
        </Demo>
        <Demo
          id="simple"
          title={"简洁卡片"}
          description={"只包含内容区域。"}
          descriptionMarkdown
          source={() => import("../demos/card-basic.tsx?raw")}
          sourceExport="SimpleDemo"
        >
          <SimpleDemo />
        </Demo>
        <Demo
          id="flexible-content"
          title={"更灵活的内容展示"}
          description={"可以利用 `Card.Meta` 支持更灵活的内容。"}
          descriptionMarkdown
          source={() => import("../demos/card-basic.tsx?raw")}
          sourceExport="FlexibleDemo"
        >
          <FlexibleDemo />
        </Demo>
        <Demo
          id="in-column"
          title={"栅格卡片"}
          description={"在系统概览页面常常和栅格进行配合。"}
          descriptionMarkdown
          source={() => import("../demos/card-basic.tsx?raw")}
          sourceExport="InColumnDemo"
        >
          <InColumnDemo />
        </Demo>
        <Demo
          id="loading"
          title={"预加载的卡片"}
          description={"数据读入前会有文本块样式。"}
          descriptionMarkdown
          source={() => import("../demos/card-basic.tsx?raw")}
          sourceExport="LoadingDemo"
        >
          <LoadingDemo />
        </Demo>
        <Demo
          id="grid-card"
          title={"网格型内嵌卡片"}
          description={"一种常见的卡片内容区隔模式。"}
          descriptionMarkdown
          source={() => import("../demos/card-basic.tsx?raw")}
          sourceExport="GridDemo"
        >
          <GridDemo />
        </Demo>
        <Demo
          id="inner"
          title={"内部卡片"}
          description={"可以放在普通卡片内部，展示多层级结构的信息。"}
          descriptionMarkdown
          source={() => import("../demos/card-basic.tsx?raw")}
          sourceExport="InnerDemo"
        >
          <InnerDemo />
        </Demo>
        <Demo
          id="tabs"
          title={"带页签的卡片"}
          description={"可承载更多内容。"}
          descriptionMarkdown
          source={() => import("../demos/card-basic.tsx?raw")}
          sourceExport="TabsDemo"
        >
          <TabsDemo />
        </Demo>
        <Demo
          id="meta"
          title={"支持更多内容配置"}
          description={"一种支持封面、头像、标题和描述信息的卡片。"}
          descriptionMarkdown
          source={() => import("../demos/card-basic.tsx?raw")}
          sourceExport="MetaDemo"
        >
          <MetaDemo />
        </Demo>
      </DemoGrid>
      <h2 id="api" tabIndex={-1}>
        API
      </h2>
      <ComponentApiTables component="Card" sections={reference.api} />

      <h2 id="tokens" tabIndex={-1}>
        主题变量（Design Token）
      </h2>
      <ComponentTokenTable component="Card" tokens={reference.tokens} />
    </>
  );
}
