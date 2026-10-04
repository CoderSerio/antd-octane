import { ComponentWhenToUse } from "../component-prose";
import {
  ComponentApiTables,
  ComponentTokenTable,
} from "../component-reference";
import reference from "../data-display/statistic.json";
import {
  AnimatedDemo,
  BasicDemo,
  CardDemo,
  TimerDemo,
  UnitDemo,
} from "../demos/statistic-basic";
import { Demo, DemoGrid, DocMeta, usePageAnchor } from "../docs-ui";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Statistic <span>统计数值</span>
      </h1>
      <p className="lead">展示统计数值。</p>
      <DocMeta name="Statistic" />
      <ComponentWhenToUse component="Statistic" />
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <DemoGrid>
        <Demo
          id="basic"
          title={"基本"}
          description={"简单的展示。"}
          descriptionMarkdown
          source={() => import("../demos/statistic-basic.tsx?raw")}
          sourceExport="BasicDemo"
        >
          <BasicDemo />
        </Demo>
        <Demo
          id="unit"
          title={"单位"}
          description={"通过前缀和后缀添加单位。"}
          descriptionMarkdown
          source={() => import("../demos/statistic-basic.tsx?raw")}
          sourceExport="UnitDemo"
        >
          <UnitDemo />
        </Demo>
        <Demo
          id="animated"
          title={"动画效果"}
          description={"使用 formatter 自定义数值展示。"}
          descriptionMarkdown
          source={() => import("../demos/statistic-basic.tsx?raw")}
          sourceExport="AnimatedDemo"
        >
          <AnimatedDemo />
        </Demo>
        <Demo
          id="card"
          title={"在卡片中使用"}
          description={"在卡片中展示统计数值。"}
          descriptionMarkdown
          source={() => import("../demos/statistic-basic.tsx?raw")}
          sourceExport="CardDemo"
        >
          <CardDemo />
        </Demo>
        <Demo
          id="timer"
          title={"计时器"}
          description={"计时器组件。"}
          descriptionMarkdown
          source={() => import("../demos/statistic-basic.tsx?raw")}
          sourceExport="TimerDemo"
        >
          <TimerDemo />
        </Demo>
      </DemoGrid>
      <h2 id="api" tabIndex={-1}>
        API
      </h2>
      <ComponentApiTables component="Statistic" sections={reference.api} />

      <h2 id="tokens" tabIndex={-1}>
        主题变量（Design Token）
      </h2>
      <ComponentTokenTable component="Statistic" tokens={reference.tokens} />
    </>
  );
}
