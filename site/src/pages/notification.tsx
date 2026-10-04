import { ComponentWhenToUse } from "../component-prose";
import {
  ReferenceApiTables,
  ReferenceTokenTable,
} from "../component-reference";
import Demo10 from "../demos/notification/basic";
import Demo4 from "../demos/notification/custom-icon";
import Demo6 from "../demos/notification/custom-style";
import Demo1 from "../demos/notification/duration";
import Demo0 from "../demos/notification/hooks";
import Demo5 from "../demos/notification/placement";
import Demo9 from "../demos/notification/show-with-progress";
import Demo8 from "../demos/notification/stack";
import Demo7 from "../demos/notification/update";
import Demo3 from "../demos/notification/with-btn";
import Demo2 from "../demos/notification/with-icon";
import { Demo, DemoGrid, DocMeta, usePageAnchor } from "../docs-ui";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Notification <span>通知提醒框</span>
      </h1>
      <p className="lead">全局展示通知提醒信息。</p>
      <DocMeta name="Notification" importName="notification" />
      <ComponentWhenToUse component="Notification" />
      <h2 id="examples">代码演示</h2>
      <DemoGrid>
        <Demo
          id={"hooks"}
          title={"Hooks 调用（推荐）"}
          description={
            "通过 `notification.useNotification` 创建支持读取 context 的 `contextHolder`。请注意，我们推荐通过顶层注册的方式代替 `notification` 静态方法，因为静态方法无法消费上下文，因而 ConfigProvider 的数据也不会生效。"
          }
          descriptionMarkdown
          source={() => import("../demos/notification/hooks.tsx?raw")}
        >
          <Demo0 />
        </Demo>
        <Demo
          id={"duration"}
          title={"自动关闭的延时"}
          description={
            "自定义通知框自动关闭的延时，默认 `4.5s`，取消自动关闭只要将该值设为 `0` 即可。"
          }
          descriptionMarkdown
          source={() => import("../demos/notification/duration.tsx?raw")}
        >
          <Demo1 />
        </Demo>
        <Demo
          id={"with-icon"}
          title={"带有图标的通知提醒框"}
          description={"通知提醒框左侧有图标。"}
          descriptionMarkdown
          source={() => import("../demos/notification/with-icon.tsx?raw")}
        >
          <Demo2 />
        </Demo>
        <Demo
          id={"with-btn"}
          title={"自定义按钮"}
          description={"自定义关闭按钮的样式和文字。"}
          descriptionMarkdown
          source={() => import("../demos/notification/with-btn.tsx?raw")}
        >
          <Demo3 />
        </Demo>
        <Demo
          id={"custom-icon"}
          title={"自定义图标"}
          description={"图标可以被自定义。"}
          descriptionMarkdown
          source={() => import("../demos/notification/custom-icon.tsx?raw")}
        >
          <Demo4 />
        </Demo>
        <Demo
          id={"placement"}
          title={"位置"}
          description={
            "使用 `placement` 可以配置通知从上面、下面、左上角、右上角、左下角、右下角弹出。"
          }
          descriptionMarkdown
          source={() => import("../demos/notification/placement.tsx?raw")}
        >
          <Demo5 />
        </Demo>
        <Demo
          id={"custom-style"}
          title={"自定义样式"}
          description={"使用 style 和 className 来定义样式。"}
          descriptionMarkdown
          source={() => import("../demos/notification/custom-style.tsx?raw")}
        >
          <Demo6 />
        </Demo>
        <Demo
          id={"update"}
          title={"更新消息内容"}
          description={"可以通过唯一的 key 来更新内容。"}
          descriptionMarkdown
          source={() => import("../demos/notification/update.tsx?raw")}
        >
          <Demo7 />
        </Demo>
        <Demo
          id={"stack"}
          title={"堆叠"}
          description={
            "堆叠配置，默认开启。超过 3 个以上的消息会被自动收起，可以通过 `threshold` 来设置不会被收起的最大数量。"
          }
          descriptionMarkdown
          source={() => import("../demos/notification/stack.tsx?raw")}
        >
          <Demo8 />
        </Demo>
        <Demo
          id={"show-with-progress"}
          title={"显示进度条"}
          description={"显示自动关闭通知框的进度条。"}
          descriptionMarkdown
          source={() =>
            import("../demos/notification/show-with-progress.tsx?raw")
          }
        >
          <Demo9 />
        </Demo>
        <Demo
          id={"basic"}
          title={"静态方法（不推荐）"}
          description={
            "静态方法无法消费 Context，不能动态响应 ConfigProvider 提供的各项配置，启用 `layer` 时还可能导致样式异常。请优先使用 hooks 版本或者 App 组件提供的 `notification` 实例。"
          }
          descriptionMarkdown
          source={() => import("../demos/notification/basic.tsx?raw")}
        >
          <Demo10 />
        </Demo>
      </DemoGrid>
      <h2 id="api">API</h2>
      <ReferenceApiTables component="Notification" />
      <h2 id="tokens">主题变量（Design Token）</h2>
      <ReferenceTokenTable component="Notification" />
    </>
  );
}
