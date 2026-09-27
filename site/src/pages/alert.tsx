import { BasicDemo, MoreDemo } from "../demos/alert-basic";
import { RetryDemo } from "../demos/alert-retry";
import { ApiTable, Demo, DocMeta, usePageAnchor } from "../docs-ui";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Alert <span>警告提示</span>
        <small>Alpha</small>
      </h1>
      <p className="lead">在页面内显示需要用户关注的提示信息。</p>
      <DocMeta name="Alert" />
      <h2 id="when" tabIndex={-1}>
        何时使用
      </h2>
      <p>提供四种语义状态，可带描述、图标、操作和关闭入口。</p>
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <div className="demo-grid">
        <Demo
          id="basic"
          title="基本使用"
          description="常用形态与状态，主题配置跟随页面切换。"
          source={() => import("../demos/alert-basic.tsx?raw")}
        >
          <BasicDemo />
        </Demo>
        <Demo
          id="more"
          title="组合与交互"
          description="结合业务内容验证配置和交互。"
          source={() => import("../demos/alert-basic.tsx?raw")}
        >
          <MoreDemo />
        </Demo>
        <Demo
          id="retry"
          title="错误恢复与关闭回调"
          description="重试操作留在提示内部；关闭后可重新展示，并观察 onClose 与 afterClose。"
          source={() => import("../demos/alert-retry.tsx?raw")}
        >
          <RetryDemo />
        </Demo>
      </div>
      <h2 id="api" tabIndex={-1}>
        API
      </h2>
      <ApiTable
        rows={[
          ["type", "语义状态", "success | info | warning | error", "info"],
          ["message / description", "提示标题与详细说明", "OctaneNode", "—"],
          [
            "showIcon / icon",
            "显示图标与自定义图标",
            "boolean / OctaneNode",
            "false / 默认图标",
          ],
          ["banner", "顶部公告样式，默认 warning 和图标", "boolean", "false"],
          [
            "closable / onClose / afterClose",
            "关闭行为与移除后回调",
            "boolean / function / function",
            "false / — / —",
          ],
          ["action", "右侧操作区域", "OctaneNode", "—"],
          ["closeIcon", "自定义关闭按钮图标", "OctaneNode", "×"],
        ]}
      />
      <h2 id="tokens" tabIndex={-1}>
        主题与支持范围
      </h2>
      <p>
        支持 defaultPadding、withDescriptionPadding、withDescriptionIconSize
        和状态色 alias token。默认图标为本库绘制的 SVG；不引入 React
        图标。暂不支持 ErrorBoundary、closable 对象、关闭动画；afterClose
        在内部关闭状态生效后调用，onClose 不提供取消关闭契约。Alert
        的关闭状态由组件内部管理；需要重新显示时请重新挂载组件。
      </p>
    </>
  );
}
