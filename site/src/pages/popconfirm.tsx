import { BasicDemo, MoreDemo } from "../demos/popconfirm-basic";
import { ControlledDemo } from "../demos/popconfirm-controlled";
import { ApiTable, Demo, DocMeta, usePageAnchor } from "../docs-ui";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Popconfirm <span>气泡确认框</span>
        <small>Alpha</small>
      </h1>
      <p className="lead">在操作附近询问确认，支持同步和异步操作。</p>
      <DocMeta name="Popconfirm" />
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <div className="demo-grid">
        <Demo
          id="basic"
          title="确认与取消"
          description="确认、取消分别通知应用。"
          source={() => import("../demos/popconfirm-basic.tsx?raw")}
        >
          <BasicDemo />
        </Demo>
        <Demo
          id="more"
          title="异步确认"
          description="Promise 完成后关闭，等待期间防止重复提交；失败时保留确认框。"
          source={() => import("../demos/popconfirm-basic.tsx?raw")}
        >
          <MoreDemo />
        </Demo>
        <Demo
          id="controlled"
          title="受控显示与自定义文案"
          description="外部入口也能打开确认框；onOpenChange 必须回写 open。"
          source={() => import("../demos/popconfirm-controlled.tsx?raw")}
        >
          <ControlledDemo />
        </Demo>
      </div>
      <h2 id="api" tabIndex={-1}>
        API
      </h2>
      <ApiTable
        rows={[
          [
            "title / description",
            "标题和说明",
            "OctaneNode | (() => OctaneNode)",
            "—",
          ],
          ["open / defaultOpen", "受控 / 初始显示", "boolean", "— / false"],
          ["onOpenChange", "显示变化", "(open: boolean) => void", "—"],
          [
            "onConfirm / onCancel",
            "确认（可返回 Promise）/ 取消",
            "callback",
            "—",
          ],
          ["okText / cancelText", "按钮文案", "OctaneNode", "确定 / 取消"],
          [
            "okType / okButtonProps / cancelButtonProps",
            "按钮类型与属性",
            "ButtonProps",
            "primary / —",
          ],
          [
            "disabled / showCancel",
            "禁用触发 / 显示取消按钮",
            "boolean",
            "false / true",
          ],
          ["icon", "提示图标，null 隐藏", "OctaneNode", "警告图标"],
          [
            "placement / trigger / destroyOnHidden",
            "位置、触发与销毁",
            "同 Tooltip 基础子集",
            "top / click / false",
          ],
        ]}
      />
      <h2 id="tokens" tabIndex={-1}>
        主题与支持范围
      </h2>
      <p>
        支持全局浮层颜色、字体、圆角、阴影与 Popconfirm.zIndexPopup。原生 portal
        保留主题；触发内容增加 span 包裹。定位、箭头和容器限制同 Tooltip。
      </p>
      <p>
        等待期间按钮禁用，Escape 或外部点击仍可关闭。Promise
        拒绝时保留确认框，错误提示由应用负责。暂不提供 onPopupClick、语义
        classNames/styles、动画生命周期或完整 ref
        契约；这是非模态确认框，不锁定焦点。
      </p>
    </>
  );
}
