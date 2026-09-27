import { BasicDemo, MoreDemo } from "../demos/modal-basic";
import { FooterDemo } from "../demos/modal-footer";
import { ApiTable, Demo, DocMeta, usePageAnchor } from "../docs-ui";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Modal <span>对话框</span>
        <small>Alpha</small>
      </h1>
      <p className="lead">在当前任务之上展示重要信息，并要求用户作出决定。</p>
      <DocMeta name="Modal" />
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <div className="demo-grid">
        <Demo
          id="basic"
          title="受控打开与确认反馈"
          description="关闭后回到触发入口；可使用键盘操作。"
          source={() => import("../demos/modal-basic.tsx?raw")}
        >
          <BasicDemo />
        </Demo>
        <Demo
          id="more"
          title="嵌套浮层与内容保留"
          description="关闭后回到触发入口；可使用键盘操作。"
          source={() => import("../demos/modal-basic.tsx?raw")}
        >
          <MoreDemo />
        </Demo>
        <Demo
          id="footer"
          title="自定义操作区"
          description="需要三种以上操作时，使用 footer 完整替换默认按钮；关闭状态仍由应用控制。"
          source={() => import("../demos/modal-footer.tsx?raw")}
        >
          <FooterDemo />
        </Demo>
      </div>
      <h2 id="api" tabIndex={-1}>
        API
      </h2>
      <ApiTable
        rows={[
          ["open", "是否显示，关闭回调不会自行修改", "boolean", "false"],
          [
            "title / footer",
            "标题 / 底部内容；footer=null 隐藏按钮",
            "OctaneNode",
            "— / 默认按钮",
          ],
          ["onOk / onCancel", "确认 / 关闭请求", "(event) => void", "—"],
          ["confirmLoading", "确认按钮加载状态", "boolean", "false"],
          ["okType", "默认确定按钮类型", "ButtonProps['type']", "primary"],
          ["okText / cancelText", "按钮文案", "OctaneNode", "确定 / 取消"],
          ["okButtonProps / cancelButtonProps", "按钮属性", "ButtonProps", "—"],
          [
            "width / centered",
            "宽度 / 垂直居中",
            "number | string / boolean",
            "520 / false",
          ],
          ["zIndex", "浮层层级", "number", "主题默认层级"],
          [
            "closable / closeIcon",
            "显示关闭按钮 / 自定义图标",
            "boolean / OctaneNode",
            "true / ×",
          ],
          [
            "mask / maskClosable / keyboard",
            "遮罩 / 点击遮罩关闭 / Escape 关闭",
            "boolean",
            "true",
          ],
          [
            "destroyOnHidden / forceRender",
            "关闭后销毁 / 提前渲染",
            "boolean",
            "false",
          ],
          [
            "getContainer",
            "渲染容器，false 为原地渲染",
            "HTMLElement | (() => HTMLElement) | false",
            "document.body",
          ],
          [
            "focusTriggerAfterClose",
            "关闭后恢复原触发元素焦点",
            "boolean",
            "true",
          ],
          [
            "afterOpenChange / afterClose",
            "显示状态变更 / 关闭完成回调",
            "(open) => void / () => void",
            "—",
          ],
        ]}
      />
      <h2 id="tokens" tabIndex={-1}>
        主题与支持范围
      </h2>
      <p>
        支持 Modal 的
        contentBg、headerBg、titleColor、titleFontSize、titleLineHeight、footerBg
        及全局字体、阴影、背景和圆角。当前是受控组件，不提供静态 confirm/info
        等方法、useModal、响应式 width、modalRender 或语义
        styles/classNames。onOk 不自动等待 Promise，异步状态由应用通过
        confirmLoading 与 open 管理。
      </p>
      <p>
        原生 portal 保留 ConfigProvider 上下文；打开时锁定 body
        滚动，嵌套浮层分别释放锁。Tab 焦点保持在最上层，Escape
        只通知最上层关闭。当前无进出场动画，afterOpenChange 表示 DOM
        显示状态已更新。getContainer=false 保留原地 DOM，但定位仍为
        fixed；自定义容器不替代 body
        滚动锁。关闭默认保留已挂载的子树；destroyOnHidden 可用于清空表单状态。
      </p>
    </>
  );
}
