import { BasicDemo, MoreDemo } from "../demos/message-basic";
import { ApiTable, Demo, DocMeta, usePageAnchor } from "../docs-ui";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Message <span>全局提示</span>
        <small>Alpha</small>
      </h1>
      <p className="lead">用简短反馈说明操作结果，避免打断当前流程。</p>
      <DocMeta name="message" />
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <div className="demo-grid">
        <Demo
          id="basic"
          title="提示类型与自动关闭"
          description="通过 hook 创建独立实例，并在组件树中放置 contextHolder。悬停时暂停关闭计时。"
          source={() => import("../demos/message-basic.tsx?raw")}
        >
          <BasicDemo />
        </Demo>
        <Demo
          id="more"
          title="主题继承与消息更新"
          description="通过稳定 key 更新内容，使用实例方法手动关闭。"
          source={() => import("../demos/message-basic.tsx?raw")}
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
            "message.useMessage(config)",
            "返回 api 与必须插入组件树的 contextHolder",
            "[MessageInstance, OctaneNode]",
            "—",
          ],
          [
            "api.open(config)",
            "展示内容；相同 key 更新消息",
            "MessageArgs",
            "—",
          ],
          [
            "api.info/success/error/warning/loading",
            "快捷类型调用，支持内容或配置对象",
            "(content, duration?, onClose?) => MessageType",
            "—",
          ],
          [
            "api.destroy(key?)",
            "关闭指定消息或全部消息",
            "(key?) => void",
            "—",
          ],
          [
            "content / key / icon",
            "消息内容 / 标识 / 自定义图标",
            "OctaneNode / string | number / OctaneNode",
            "—",
          ],
          [
            "duration / onClose",
            "自动关闭秒数；0 保持显示 / 关闭回调",
            "number / () => void",
            "3 / —",
          ],
          [
            "hook config",
            "默认时长、最大数量、距顶部距离及容器",
            "duration / maxCount / top / getContainer",
            "3 / 不限 / 8 / body",
          ],
          [
            "MessageType",
            "可调用关闭函数，也可以 await 或 then 等待关闭",
            "(() => void) & PromiseLike<boolean>",
            "—",
          ],
        ]}
      />
      <h2 id="tokens" tabIndex={-1}>
        主题与支持范围
      </h2>
      <p>
        支持 Message.contentBg、contentPadding、zIndexPopup
        与全局颜色、字体和圆角。挂载位置决定主题和业务 context；示例将 holder
        放入局部 ConfigProvider。
      </p>
      <p>
        本版提供 hook 实例 API，不提供静态 open/success/config 方法和 App.useApp
        集成。原生 portal 保留上下文；自定义容器仍使用固定定位，带 transform
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
