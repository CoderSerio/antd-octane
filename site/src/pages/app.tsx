import { BasicDemo, MoreDemo } from "../demos/app-basic";
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
        reset 样式。在 App 外调用 useApp 会抛出明确错误。
      </p>
    </>
  );
}
