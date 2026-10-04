import { ComponentWhenToUse } from "../component-prose";
import {
  ReferenceApiTables,
  ReferenceTokenTable,
} from "../component-reference";
import Demo1 from "../demos/progress/circle";
import Demo3 from "../demos/progress/circle-micro";
import Demo4 from "../demos/progress/circle-mini";
import Demo12 from "../demos/progress/circle-steps";
import Demo7 from "../demos/progress/dashboard";
import Demo5 from "../demos/progress/dynamic";
import Demo6 from "../demos/progress/format";
import Demo10 from "../demos/progress/gradient-line";
import Demo14 from "../demos/progress/info-position";
import Demo0 from "../demos/progress/line";
import Demo2 from "../demos/progress/line-mini";
import Demo9 from "../demos/progress/linecap";
import Demo8 from "../demos/progress/segment";
import Demo13 from "../demos/progress/size";
import Demo11 from "../demos/progress/steps";
import { Demo, DemoGrid, DocMeta, usePageAnchor } from "../docs-ui";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Progress <span>进度条</span>
      </h1>
      <p className="lead">展示操作的当前进度。</p>
      <DocMeta name="Progress" />
      <ComponentWhenToUse component="Progress" />
      <h2 id="examples">代码演示</h2>
      <DemoGrid>
        <Demo
          id={"line"}
          title={"进度条"}
          description={"标准的进度条。"}
          descriptionMarkdown
          source={() => import("../demos/progress/line.tsx?raw")}
        >
          <Demo0 />
        </Demo>
        <Demo
          id={"circle"}
          title={"进度圈"}
          description={"圈形的进度。"}
          descriptionMarkdown
          source={() => import("../demos/progress/circle.tsx?raw")}
        >
          <Demo1 />
        </Demo>
        <Demo
          id={"line-mini"}
          title={"小型进度条"}
          description={"适合放在较狭窄的区域内。"}
          descriptionMarkdown
          source={() => import("../demos/progress/line-mini.tsx?raw")}
        >
          <Demo2 />
        </Demo>
        <Demo
          id={"circle-micro"}
          title={"响应式进度圈"}
          description={
            "响应式的圈形进度，当 `width` 小于等于 20 的时候，进度信息将不会显示在进度圈里面，而是以 Tooltip 的形式显示。"
          }
          descriptionMarkdown
          source={() => import("../demos/progress/circle-micro.tsx?raw")}
        >
          <Demo3 />
        </Demo>
        <Demo
          id={"circle-mini"}
          title={"小型进度圈"}
          description={"小一号的圈形进度。"}
          descriptionMarkdown
          source={() => import("../demos/progress/circle-mini.tsx?raw")}
        >
          <Demo4 />
        </Demo>
        <Demo
          id={"dynamic"}
          title={"动态展示"}
          description={"会动的进度条才是好进度条。"}
          descriptionMarkdown
          source={() => import("../demos/progress/dynamic.tsx?raw")}
        >
          <Demo5 />
        </Demo>
        <Demo
          id={"format"}
          title={"自定义文字格式"}
          description={"`format` 属性指定格式。"}
          descriptionMarkdown
          source={() => import("../demos/progress/format.tsx?raw")}
        >
          <Demo6 />
        </Demo>
        <Demo
          id={"dashboard"}
          title={"仪表盘"}
          description={
            "通过设置 `type=dashboard`，可以很方便地实现仪表盘样式的进度条。若想要修改缺口的角度，可以设置 `gapDegree` 为你想要的值。"
          }
          descriptionMarkdown
          source={() => import("../demos/progress/dashboard.tsx?raw")}
        >
          <Demo7 />
        </Demo>
        <Demo
          id={"segment"}
          title={"分段进度条"}
          description={"分段展示进度，可以用于细化进度语义。"}
          descriptionMarkdown
          source={() => import("../demos/progress/segment.tsx?raw")}
        >
          <Demo8 />
        </Demo>
        <Demo
          id={"linecap"}
          title={"边缘形状"}
          description={
            '通过设定 `strokeLinecap="butt"` 可以将进度条边缘的形状从闭合的圆形的圆弧调整为断口，详见 [stroke-linecap](https://developer.mozilla.org/docs/Web/SVG/Attribute/stroke-linecap)。'
          }
          descriptionMarkdown
          source={() => import("../demos/progress/linecap.tsx?raw")}
        >
          <Demo9 />
        </Demo>
        <Demo
          id={"gradient-line"}
          title={"自定义进度条渐变色"}
          description={
            "渐变色封装，`circle` 与 `dashboard` 设置渐变时 `strokeLinecap` 会被忽略。"
          }
          descriptionMarkdown
          source={() => import("../demos/progress/gradient-line.tsx?raw")}
        >
          <Demo10 />
        </Demo>
        <Demo
          id={"steps"}
          title={"步骤进度条"}
          description={"带步骤的进度条。"}
          descriptionMarkdown
          source={() => import("../demos/progress/steps.tsx?raw")}
        >
          <Demo11 />
        </Demo>
        <Demo
          id={"circle-steps"}
          title={"步骤进度圈"}
          description={"步骤进度圈，支持颜色分段展示，默认间隔为 2px。"}
          descriptionMarkdown
          source={() => import("../demos/progress/circle-steps.tsx?raw")}
        >
          <Demo12 />
        </Demo>
        <Demo
          id={"size"}
          title={"尺寸"}
          description={"进度条尺寸。"}
          descriptionMarkdown
          source={() => import("../demos/progress/size.tsx?raw")}
        >
          <Demo13 />
        </Demo>
        <Demo
          id={"info-position"}
          title={"改变进度数值位置"}
          description={
            "改变进度数值位置，可使用 `percentPosition` 调整，使进度条数值在进度条内部、外部或底部。"
          }
          descriptionMarkdown
          source={() => import("../demos/progress/info-position.tsx?raw")}
        >
          <Demo14 />
        </Demo>
      </DemoGrid>
      <h2 id="api">API</h2>
      <ReferenceApiTables component="Progress" />
      <h2 id="tokens">主题变量（Design Token）</h2>
      <ReferenceTokenTable component="Progress" />
    </>
  );
}
