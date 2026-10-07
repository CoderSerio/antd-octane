import { BasicDemo, MoreDemo } from "../demos/app-basic";
import { ConfigDemo, NestedDemo } from "../demos/app-config";
import { ApiTable, Demo, DocMeta, usePageAnchor } from "../docs-ui";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        App <span>包裹组件</span>
        <small>Alpha</small>
      </h1>
      <p className="lead">集中提供主题一致的消息与通知实例。</p>
      <DocMeta name="App" />
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <div className="demo-grid">
        <Demo
          id="basic"
          title="共享实例"
          description="子组件通过 App.useApp 获取消息与通知。"
          source={() => import("../demos/app-basic.tsx?raw")}
        >
          <BasicDemo />
        </Demo>
        <Demo
          id="more"
          title="不增加容器"
          description="component={false} 保留上下文，不额外包裹 div。"
          source={() => import("../demos/app-basic.tsx?raw")}
        >
          <MoreDemo />
        </Demo>
        <Demo
          id="config"
          title="消息与通知默认配置"
          description="maxCount=1 限制消息数量，通知通过 App 配置显示在 bottomLeft。"
          source={() => import("../demos/app-config.tsx?raw")}
        >
          <ConfigDemo />
        </Demo>
        <Demo
          id="nested"
          title="嵌套 App 的实例隔离"
          description="子组件取最近一层实例；清空内层不会清空外层，局部主题可分别继承。"
          source={() => import("../demos/app-config.tsx?raw")}
        >
          <NestedDemo />
        </Demo>
      </div>
      <h2 id="api" tabIndex={-1}>
        API
      </h2>
      <ApiTable
        rows={[
          [
            "App.useApp()",
            "在 App 子树内调用",
            "{ message, notification }",
            "—",
          ],
          [
            "message / notification",
            "实例默认配置",
            "MessageConfig / NotificationConfig",
            "—",
          ],
          ["component", "是否包裹 div", '"div" | false', "div"],
          [
            "className / style",
            "容器样式；component=false 时不生效",
            "string / CSSProperties",
            "—",
          ],
        ]}
      />
      <h2 id="tokens" tabIndex={-1}>
        主题与支持范围
      </h2>
      <p>
        ConfigProvider 应位于 App 外层；内部 contextHolder 会继承主题。暂不提供
        App.useApp().modal、useModal、任意 component 标签、SSR 契约或完整 antd
        reset 样式。在 App 外调用 useApp 会抛出明确错误。 嵌套 App
        各自持有独立消息与通知实例；useApp 返回最近一层 App
        的实例，离开该子树时对应 holder 和计时器会被清理。
      </p>
    </>
  );
}
