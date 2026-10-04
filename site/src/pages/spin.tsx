import { ComponentWhenToUse } from "../component-prose";
import {
  ReferenceApiTables,
  ReferenceTokenTable,
} from "../component-reference";
import Demo0 from "../demos/spin/basic";
import Demo5 from "../demos/spin/custom-indicator";
import Demo4 from "../demos/spin/delayAndDebounce";
import Demo7 from "../demos/spin/fullscreen";
import Demo2 from "../demos/spin/nested";
import Demo6 from "../demos/spin/percent";
import Demo1 from "../demos/spin/size";
import Demo3 from "../demos/spin/tip";
import { Demo, DemoGrid, DocMeta, usePageAnchor } from "../docs-ui";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Spin <span>加载中</span>
      </h1>
      <p className="lead">用于页面和区块的加载中状态。</p>
      <DocMeta name="Spin" />
      <ComponentWhenToUse component="Spin" />
      <h2 id="examples">代码演示</h2>
      <DemoGrid>
        <Demo
          id={"basic"}
          title={"基本用法"}
          description={"一个简单的 loading 状态。"}
          descriptionMarkdown
          source={() => import("../demos/spin/basic.tsx?raw")}
        >
          <Demo0 />
        </Demo>
        <Demo
          id={"size"}
          title={"各种大小"}
          description={
            "小的用于文本加载，默认用于卡片容器级加载，大的用于**页面级**加载。"
          }
          descriptionMarkdown
          source={() => import("../demos/spin/size.tsx?raw")}
        >
          <Demo1 />
        </Demo>
        <Demo
          id={"nested"}
          title={"卡片加载中"}
          description={
            "可以直接把内容内嵌到 `Spin` 中，将现有容器变为加载状态。"
          }
          descriptionMarkdown
          source={() => import("../demos/spin/nested.tsx?raw")}
        >
          <Demo2 />
        </Demo>
        <Demo
          id={"tip"}
          title={"自定义描述文案"}
          description={"自定义描述文案。"}
          descriptionMarkdown
          source={() => import("../demos/spin/tip.tsx?raw")}
        >
          <Demo3 />
        </Demo>
        <Demo
          id={"delayAndDebounce"}
          title={"延迟"}
          description={
            "延迟显示 loading 效果。当 spinning 状态在 `delay` 时间内结束，则不显示 loading 状态。"
          }
          descriptionMarkdown
          source={() => import("../demos/spin/delayAndDebounce.tsx?raw")}
        >
          <Demo4 />
        </Demo>
        <Demo
          id={"custom-indicator"}
          title={"自定义指示符"}
          description={"使用自定义指示符。"}
          descriptionMarkdown
          source={() => import("../demos/spin/custom-indicator.tsx?raw")}
        >
          <Demo5 />
        </Demo>
        <Demo
          id={"percent"}
          title={"进度"}
          description={
            '展示进度，当设置 `percent="auto"` 时会预估一个永远不会停止的进度条。'
          }
          descriptionMarkdown
          source={() => import("../demos/spin/percent.tsx?raw")}
        >
          <Demo6 />
        </Demo>
        <Demo
          id={"fullscreen"}
          title={"全屏"}
          description={
            "`fullscreen` 属性非常适合创建流畅的页面加载器。它添加了半透明覆盖层，并在其中心放置了一个旋转加载符号。"
          }
          descriptionMarkdown
          source={() => import("../demos/spin/fullscreen.tsx?raw")}
        >
          <Demo7 />
        </Demo>
      </DemoGrid>
      <h2 id="api">API</h2>
      <ReferenceApiTables component="Spin" />
      <h2 id="tokens">主题变量（Design Token）</h2>
      <ReferenceTokenTable component="Spin" />
    </>
  );
}
