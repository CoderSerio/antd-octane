import { BasicDemo, MoreDemo } from "../demos/popover-basic";
import { ApiTable, Demo, DocMeta, usePageAnchor } from "../docs-ui";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Popover <span>气泡卡片</span>
        <small>Alpha</small>
      </h1>
      <p className="lead">展示更多说明或轻量操作，保留当前页面上下文。</p>
      <DocMeta name="Popover" />
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <div className="demo-grid">
        <Demo
          id="basic"
          title="多种触发方式"
          description="可以选择浮层里的文字，点击浮层内容不会触发外部关闭。"
          source={() => import("../demos/popover-basic.tsx?raw")}
        >
          <BasicDemo />
        </Demo>
        <Demo
          id="more"
          title="受控显示与操作"
          description="确认后更新本地演示状态并关闭；外部点击和 Escape 也会请求关闭。"
          source={() => import("../demos/popover-basic.tsx?raw")}
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
            "title / content",
            "标题 / 内容",
            "OctaneNode | (() => OctaneNode)",
            "—",
          ],
          ["color", "自定义 CSS 背景色", "string", "主题值"],
          ["open / defaultOpen", "受控 / 初始显示状态", "boolean", "— / false"],
          ["onOpenChange", "显示状态变更请求", "(open: boolean) => void", "—"],
          [
            "trigger",
            "触发方式，可组合",
            "hover | focus | click | contextMenu | Trigger[]",
            "hover",
          ],
          ["placement", "四向及对齐变体，共十二种", "Placement", "top"],
          [
            "mouseEnterDelay / mouseLeaveDelay",
            "鼠标移入 / 移出延迟，单位秒",
            "number",
            "0.1",
          ],
          ["autoAdjustOverflow", "视口边缘翻转和位移", "boolean", "true"],
          ["arrow", "是否显示箭头", "boolean", "true"],
          [
            "getPopupContainer",
            "指定容器；需设置 position: relative 等定位样式",
            "(trigger: HTMLElement) => HTMLElement",
            "document.body",
          ],
          [
            "destroyOnHidden",
            "关闭后销毁内容，默认保留状态",
            "boolean",
            "false",
          ],
          [
            "overlayClassName / overlayStyle",
            "浮层根节点类名 / 样式",
            "string / CSSProperties",
            "—",
          ],
          [
            "className / style",
            "触发包裹元素的类名 / 样式",
            "string / CSSProperties",
            "—",
          ],
          ["zIndex", "浮层层级", "number", "主题值"],
        ]}
      />
      <h2 id="tokens" tabIndex={-1}>
        主题与支持范围
      </h2>
      <p>
        继承全局颜色、字体、圆角和阴影，支持
        Popover.zIndexPopup、titleMinWidth、innerPadding。它是非模态浮层，不锁定焦点；复杂表单流程应使用后续的
        Modal。
      </p>
      <p>
        使用 Octane 原生 portal 保留主题与业务上下文。触发内容外增加 inline-flex
        span，保留子元素事件；请提供一个可聚焦的触发元素，键盘提示需包含 focus
        触发。自定义容器采用绝对定位，暂不处理任意 transform 缩放或裁剪祖先。
      </p>
      <p>
        暂不支持 arrow 对象、align、fresh、旧 visible
        系列属性、动画生命周期、语义 styles/classNames 或完整 ref
        契约。箭头为基础几何图形，不承诺上游完整动效与像素一致。内容始终随状态更新，默认保留已挂载内容。
      </p>
    </>
  );
}
