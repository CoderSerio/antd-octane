import { ComponentDescription, ComponentWhenToUse } from "../component-prose";
import {
  ComponentApiTables,
  ComponentTokenTable,
} from "../component-reference";
import Demo7 from "../demos/steps/clickable";
import Demo6 from "../demos/steps/error";
import Demo2 from "../demos/steps/icon";
import Demo8 from "../demos/steps/label-placement";
import Demo0 from "../demos/steps/simple";
import Demo1 from "../demos/steps/small-size";
import Demo3 from "../demos/steps/step-next";
import Demo4 from "../demos/steps/vertical";
import Demo5 from "../demos/steps/vertical-small";
import { Demo, DemoGrid, DocMeta, usePageAnchor } from "../docs-ui";
import reference from "../navigation/steps.json";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Steps <span>步骤条</span>
      </h1>
      <ComponentDescription component="Steps" />
      <DocMeta name="Steps" />
      <ComponentWhenToUse component="Steps" />
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <DemoGrid component="steps" columns={reference.demoColumns === 2 ? 2 : 1}>
        <Demo
          id="simple"
          title="基本用法"
          description={"简单的步骤条。"}
          descriptionMarkdown
          source={() => import("../demos/steps/simple.tsx?raw")}
        >
          <Demo0 />
        </Demo>
        <Demo
          id="small-size"
          title="迷你版"
          description={'迷你版的步骤条，通过设置 `<Steps size="small">` 启用.'}
          descriptionMarkdown
          source={() => import("../demos/steps/small-size.tsx?raw")}
        >
          <Demo1 />
        </Demo>
        <Demo
          id="icon"
          title="带图标的步骤条"
          description={"通过设置 `items` 的 `icon` 属性，可以启用自定义图标。"}
          descriptionMarkdown
          source={() => import("../demos/steps/icon.tsx?raw")}
        >
          <Demo2 />
        </Demo>
        <Demo
          id="step-next"
          title="步骤切换"
          description={"通常配合内容及按钮使用，表示一个流程的处理进度。"}
          descriptionMarkdown
          source={() => import("../demos/steps/step-next.tsx?raw")}
        >
          <Demo3 />
        </Demo>
        <Demo
          id="vertical"
          title="竖直方向的步骤条"
          description={"简单的竖直方向的步骤条。"}
          descriptionMarkdown
          source={() => import("../demos/steps/vertical.tsx?raw")}
        >
          <Demo4 />
        </Demo>
        <Demo
          id="vertical-small"
          title="竖直方向的小型步骤条"
          description={"简单的竖直方向的小型步骤条。"}
          descriptionMarkdown
          source={() => import("../demos/steps/vertical-small.tsx?raw")}
        >
          <Demo5 />
        </Demo>
        <Demo
          id="error"
          title="步骤运行错误"
          description={"使用 Steps 的 `status` 属性来指定当前步骤的状态。"}
          descriptionMarkdown
          source={() => import("../demos/steps/error.tsx?raw")}
        >
          <Demo6 />
        </Demo>
        <Demo
          id="clickable"
          title="可点击"
          description={"设置 `onChange` 后，Steps 变为可点击状态。"}
          descriptionMarkdown
          source={() => import("../demos/steps/clickable.tsx?raw")}
        >
          <Demo7 />
        </Demo>
        <Demo
          id="label-placement"
          title="标签放置位置"
          description={"修改标签放置位置为 `vertical`。"}
          descriptionMarkdown
          source={() => import("../demos/steps/label-placement.tsx?raw")}
        >
          <Demo8 />
        </Demo>
      </DemoGrid>
      <h2 id="api" tabIndex={-1}>
        API
      </h2>
      <ComponentApiTables component="Steps" sections={reference.api} />
      <h2 id="tokens" tabIndex={-1}>
        主题变量（Design Token）
      </h2>
      <ComponentTokenTable component="Steps" tokens={reference.tokens} />
    </>
  );
}
