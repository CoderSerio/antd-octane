import { AppContextDemo } from "../demos/notification-app-context";
import { BasicDemo, MoreDemo } from "../demos/notification-basic";
import { PersistentDemo } from "../demos/notification-persistent";
import { ApiTable, Demo, DocMeta, usePageAnchor } from "../docs-ui";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Notification <span>通知提醒框</span>
        <small>Alpha</small>
      </h1>
      <p className="lead">展示需要更多解释的系统事件，提供可选的后续操作。</p>
      <DocMeta name="notification" />
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <div className="demo-grid">
        <Demo
          id="basic"
          title="类型、位置与自动关闭"
          description="通过 hook 创建独立实例，并在组件树中放置 contextHolder。悬停时暂停关闭计时。"
          source={() => import("../demos/notification-basic.tsx?raw")}
        >
          <BasicDemo />
        </Demo>
        <Demo
          id="more"
          title="更新内容与操作按钮"
          description="通过稳定 key 更新内容，使用实例方法手动关闭。"
          source={() => import("../demos/notification-basic.tsx?raw")}
        >
          <MoreDemo />
        </Demo>
        <Demo
          id="persistent"
          title="持续通知与关闭回调"
          description="duration=0 保持显示；通知内操作或页面按钮关闭后触发 onClose。"
          source={() => import("../demos/notification-persistent.tsx?raw")}
        >
          <PersistentDemo />
        </Demo>
        <Demo
          id="app-context"
          title="通过 App 使用共享实例"
          description="ConfigProvider 包裹 App 后，子组件通过 App.useApp 取通知实例，并继承上下文与默认位置。"
          source={() => import("../demos/notification-app-context.tsx?raw")}
        >
          <AppContextDemo />
        </Demo>
      </div>
      <h2 id="api" tabIndex={-1}>
        API
      </h2>
      <ApiTable
        rows={[
          [
            "App.useApp().notification",
            "App 子组件内取得共享实例，无需重复插入 holder",
            "NotificationInstance",
            "—",
          ],
          [
            "notification.useNotification(config)",
            "返回 api 与必须插入组件树的 contextHolder",
            "[NotificationInstance, OctaneNode]",
            "—",
          ],
          [
            "api.open/success/info/warning/error",
            "展示通知；相同 key 更新内容",
            "(config: NotificationArgs) => void",
            "—",
          ],
          [
            "api.destroy(key?)",
            "关闭指定通知或全部通知",
            "(key?) => void",
            "—",
          ],
          [
            "message / description / icon",
            "标题 / 描述 / 自定义图标",
            "OctaneNode",
            "—",
          ],
          ["actions / btn", "操作区域；btn 为兼容别名", "OctaneNode", "—"],
          [
            "placement",
            "顶部、底部及四角",
            "top | topLeft | topRight | bottom | bottomLeft | bottomRight",
            "topRight",
          ],
          [
            "duration / pauseOnHover",
            "自动关闭秒数；0/null 不自动关闭 / 悬停暂停",
            "number | null / boolean",
            "4.5 / true",
          ],
          [
            "closeIcon / closable / onClose",
            "关闭图标 / 显示关闭按钮 / 回调",
            "OctaneNode / boolean / () => void",
            "× / true / —",
          ],
          ["role", "朗读方式", "alert | status", "alert"],
          [
            "hook config",
            "位置、时长、最大数量、上下偏移及容器",
            "NotificationConfig",
            "top/bottom 默认 24",
          ],
        ]}
      />
      <h2 id="tokens" tabIndex={-1}>
        主题与支持范围
      </h2>
      <p>
        支持 Notification.width、zIndexPopup
        与全局颜色、字体、间距和圆角。通知操作区支持正常键盘访问，聚焦通知内控件时暂停倒计时。
      </p>
      <p>
        本版提供 hook 实例与 App.useApp().notification，不提供静态
        open/success/config 方法。App 必须位于使用方的祖先组件，ConfigProvider
        应包裹 App，才能让共享实例继承主题。原生 portal
        保留上下文；自定义容器仍使用固定定位，带 transform
        的祖先可能限制覆盖范围。暂不支持
        RTL、prefixCls、堆叠收缩、进度条和完整进出场动效。默认图标为独立绘制。
      </p>
      <p>
        超过 maxCount 时关闭最早一条；同 key 更新会重启倒计时。卸载 holder
        时清理所有通知和计时器，之后调用旧实例不会继续显示。
      </p>
    </>
  );
}
