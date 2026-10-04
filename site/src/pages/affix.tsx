import { ComponentWhenToUse } from "../component-prose";
import { ReferenceApiTables } from "../component-reference";
import Demo0 from "../demos/affix/basic";
import Demo1 from "../demos/affix/on-change";
import Demo2 from "../demos/affix/target";
import { Demo, DemoGrid, DocMeta, usePageAnchor } from "../docs-ui";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Affix <span>固钉</span>
      </h1>
      <p className="lead">将页面元素钉在可视范围。</p>
      <DocMeta name="Affix" />
      <ComponentWhenToUse component="Affix" />
      <h2 id="examples">代码演示</h2>
      <DemoGrid>
        <Demo
          id={"basic"}
          title={"基本"}
          description={"最简单的用法。"}
          descriptionMarkdown
          source={() => import("../demos/affix/basic.tsx?raw")}
        >
          <Demo0 />
        </Demo>
        <Demo
          id={"on-change"}
          title={"固定状态改变的回调"}
          description={"可以获得是否固定的状态。"}
          descriptionMarkdown
          source={() => import("../demos/affix/on-change.tsx?raw")}
        >
          <Demo1 />
        </Demo>
        <Demo
          id={"target"}
          title={"滚动容器"}
          description={
            "用 `target` 设置 `Affix` 需要监听其滚动事件的元素，默认为 `window`。"
          }
          descriptionMarkdown
          source={() => import("../demos/affix/target.tsx?raw")}
        >
          <Demo2 />
        </Demo>
      </DemoGrid>
      <h2 id="api">API</h2>
      <ReferenceApiTables component="Affix" />
    </>
  );
}
