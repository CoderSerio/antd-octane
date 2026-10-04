import { ComponentWhenToUse } from "../component-prose";
import {
  ReferenceApiTables,
  ReferenceTokenTable,
} from "../component-reference";
import Demo2 from "../demos/skeleton/active";
import Demo0 from "../demos/skeleton/basic";
import Demo4 from "../demos/skeleton/children";
import Demo1 from "../demos/skeleton/complex";
import Demo3 from "../demos/skeleton/element";
import Demo5 from "../demos/skeleton/list";
import { Demo, DemoGrid, DocMeta, usePageAnchor } from "../docs-ui";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Skeleton <span>骨架屏</span>
      </h1>
      <p className="lead">在需要等待加载内容的位置提供一个占位图形组合。</p>
      <DocMeta name="Skeleton" />
      <ComponentWhenToUse component="Skeleton" />
      <h2 id="examples">代码演示</h2>
      <DemoGrid columns={1}>
        <Demo
          id={"basic"}
          title={"基本"}
          description={"最简单的占位效果。"}
          descriptionMarkdown
          source={() => import("../demos/skeleton/basic.tsx?raw")}
        >
          <Demo0 />
        </Demo>
        <Demo
          id={"complex"}
          title={"复杂的组合"}
          description={"更复杂的组合。"}
          descriptionMarkdown
          source={() => import("../demos/skeleton/complex.tsx?raw")}
        >
          <Demo1 />
        </Demo>
        <Demo
          id={"active"}
          title={"动画效果"}
          description={"显示动画效果。"}
          descriptionMarkdown
          source={() => import("../demos/skeleton/active.tsx?raw")}
        >
          <Demo2 />
        </Demo>
        <Demo
          id={"element"}
          title={"按钮/头像/输入框/图像/自定义节点"}
          description={"骨架按钮、头像、输入框、图像和自定义节点。"}
          descriptionMarkdown
          source={() => import("../demos/skeleton/element.tsx?raw")}
        >
          <Demo3 />
        </Demo>
        <Demo
          id={"children"}
          title={"包含子组件"}
          description={"加载占位图包含子组件。"}
          descriptionMarkdown
          source={() => import("../demos/skeleton/children.tsx?raw")}
        >
          <Demo4 />
        </Demo>
        <Demo
          id={"list"}
          title={"列表"}
          description={"在列表组件中使用加载占位符。"}
          descriptionMarkdown
          source={() => import("../demos/skeleton/list.tsx?raw")}
        >
          <Demo5 />
        </Demo>
      </DemoGrid>
      <h2 id="api">API</h2>
      <ReferenceApiTables component="Skeleton" />
      <h2 id="tokens">主题变量（Design Token）</h2>
      <ReferenceTokenTable component="Skeleton" />
    </>
  );
}
