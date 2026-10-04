import { ComponentWhenToUse } from "../component-prose";
import {
  ReferenceApiTables,
  ReferenceTokenTable,
} from "../component-reference";
import Demo6 from "../demos/popconfirm/async";
import Demo0 from "../demos/popconfirm/basic";
import Demo4 from "../demos/popconfirm/dynamic-trigger";
import Demo5 from "../demos/popconfirm/icon";
import Demo1 from "../demos/popconfirm/locale";
import Demo2 from "../demos/popconfirm/placement";
import Demo7 from "../demos/popconfirm/promise";
import Demo3 from "../demos/popconfirm/shift";
import { Demo, DemoGrid, DocMeta, usePageAnchor } from "../docs-ui";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Popconfirm <span>气泡确认框</span>
      </h1>
      <p className="lead">点击元素，弹出气泡式的确认框。</p>
      <DocMeta name="Popconfirm" />
      <ComponentWhenToUse component="Popconfirm" />
      <h2 id="examples">代码演示</h2>
      <DemoGrid>
        <Demo
          id={"basic"}
          title={"基本"}
          description={"最简单的用法，支持确认标题和描述。"}
          descriptionMarkdown
          source={() => import("../demos/popconfirm/basic.tsx?raw")}
        >
          <Demo0 />
        </Demo>
        <Demo
          id={"locale"}
          title={"国际化"}
          description={"使用 `okText` 和 `cancelText` 自定义按钮文字。"}
          descriptionMarkdown
          source={() => import("../demos/popconfirm/locale.tsx?raw")}
        >
          <Demo1 />
        </Demo>
        <Demo
          id={"placement"}
          title={"位置"}
          description={
            "位置有十二个方向。如需箭头指向目标元素中心，可以设置 `arrow: { pointAtCenter: true }`。"
          }
          descriptionMarkdown
          source={() => import("../demos/popconfirm/placement.tsx?raw")}
        >
          <Demo2 />
        </Demo>
        <Demo
          iframe={{ demo: "popconfirm/shift", height: 300 }}
          id={"shift"}
          title={"贴边偏移"}
          description={
            "当 Popconfirm 贴边时，自动偏移并且调整箭头位置。当超出过多时，则一同滚出屏幕。"
          }
          descriptionMarkdown
          source={() => import("../demos/popconfirm/shift.tsx?raw")}
        >
          <Demo3 />
        </Demo>
        <Demo
          id={"dynamic-trigger"}
          title={"条件触发"}
          description={"可以判断是否需要弹出。"}
          descriptionMarkdown
          source={() => import("../demos/popconfirm/dynamic-trigger.tsx?raw")}
        >
          <Demo4 />
        </Demo>
        <Demo
          id={"icon"}
          title={"自定义 Icon 图标"}
          description={"自定义提示 `icon`。"}
          descriptionMarkdown
          source={() => import("../demos/popconfirm/icon.tsx?raw")}
        >
          <Demo5 />
        </Demo>
        <Demo
          id={"async"}
          title={"异步关闭"}
          description={"点击确定后异步关闭气泡确认框，例如提交表单。"}
          descriptionMarkdown
          source={() => import("../demos/popconfirm/async.tsx?raw")}
        >
          <Demo6 />
        </Demo>
        <Demo
          id={"promise"}
          title={"基于 Promise 的异步关闭"}
          description={"点击确定后异步关闭 Popconfirm，例如提交表单。"}
          descriptionMarkdown
          source={() => import("../demos/popconfirm/promise.tsx?raw")}
        >
          <Demo7 />
        </Demo>
      </DemoGrid>
      <h2 id="api">API</h2>
      <ReferenceApiTables component="Popconfirm" />
      <h2 id="tokens">主题变量（Design Token）</h2>
      <ReferenceTokenTable component="Popconfirm" />
    </>
  );
}
