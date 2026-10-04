import { ComponentWhenToUse } from "../component-prose";
import {
  ComponentApiTables,
  ComponentTokenTable,
} from "../component-reference";
import reference from "../data-display/timeline.json";
import {
  AlternateDemo,
  BasicDemo,
  ColorDemo,
  DotDemo,
  LabelDemo,
  PendingDemo,
  RightDemo,
} from "../demos/timeline-basic";
import { Demo, DemoGrid, DocMeta, usePageAnchor } from "../docs-ui";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Timeline <span>时间轴</span>
      </h1>
      <p className="lead">垂直展示的时间流信息。</p>
      <DocMeta name="Timeline" />
      <ComponentWhenToUse component="Timeline" />
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <DemoGrid>
        <Demo
          id="basic"
          title={"基本用法"}
          description={"基本的时间轴。"}
          descriptionMarkdown
          source={() => import("../demos/timeline-basic.tsx?raw")}
          sourceExport="BasicDemo"
        >
          <BasicDemo />
        </Demo>
        <Demo
          id="color"
          title={"圆圈颜色"}
          description={
            "圆圈颜色，绿色用于已完成、成功状态，红色表示告警或错误状态，蓝色可表示正在进行或其他默认状态，灰色表示未完成或失效状态。"
          }
          descriptionMarkdown
          source={() => import("../demos/timeline-basic.tsx?raw")}
          sourceExport="ColorDemo"
        >
          <ColorDemo />
        </Demo>
        <Demo
          id="pending"
          title={"最后一个及排序"}
          description={
            "当任务状态正在发生，还在记录过程中，可用幽灵节点来表示当前的时间节点，当 pending 为真值时展示幽灵节点，如果 pending 是 Octane 元素可用于定制该节点内容，同时 pendingDot 将可以用于定制其轴点。reverse 属性用于控制节点排序，为 false 时按正序排列，为 true 时按倒序排列。"
          }
          descriptionMarkdown
          source={() => import("../demos/timeline-basic.tsx?raw")}
          sourceExport="PendingDemo"
        >
          <PendingDemo />
        </Demo>
        <Demo
          id="alternate"
          title={"交替展现"}
          description={"内容在时间轴两侧轮流出现。"}
          descriptionMarkdown
          source={() => import("../demos/timeline-basic.tsx?raw")}
          sourceExport="AlternateDemo"
        >
          <AlternateDemo />
        </Demo>
        <Demo
          id="custom"
          title={"自定义时间轴点"}
          description={"可以设置为图标或其他自定义元素。"}
          descriptionMarkdown
          source={() => import("../demos/timeline-basic.tsx?raw")}
          sourceExport="DotDemo"
        >
          <DotDemo />
        </Demo>
        <Demo
          id="right"
          title={"右侧时间轴点"}
          description={"时间轴点可以在内容的右边。"}
          descriptionMarkdown
          source={() => import("../demos/timeline-basic.tsx?raw")}
          sourceExport="RightDemo"
        >
          <RightDemo />
        </Demo>
        <Demo
          id="label"
          title={"标签"}
          description={"使用 `label` 标签单独展示时间。"}
          descriptionMarkdown
          source={() => import("../demos/timeline-basic.tsx?raw")}
          sourceExport="LabelDemo"
        >
          <LabelDemo />
        </Demo>
      </DemoGrid>
      <h2 id="api" tabIndex={-1}>
        API
      </h2>
      <ComponentApiTables component="Timeline" sections={reference.api} />

      <h2 id="tokens" tabIndex={-1}>
        主题变量（Design Token）
      </h2>
      <ComponentTokenTable component="Timeline" tokens={reference.tokens} />
    </>
  );
}
