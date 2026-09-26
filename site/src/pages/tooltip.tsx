import { BasicDemo, MoreDemo } from "../demos/tooltip-basic";
import { ApiTable, Demo, DocMeta, usePageAnchor } from "../docs-ui";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Tooltip <span>文字提示</span>
        <small>Alpha</small>
      </h1>
      <p className="lead">提供简短的补充说明；需要操作按钮时使用 Popover。</p>
      <DocMeta name="Tooltip" />
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <div className="demo-grid">
        <Demo
          id="basic"
          title="基本提示"
          description="鼠标悬停或键盘聚焦显示提示，Escape 关闭。"
          source={() => import("../demos/tooltip-basic.tsx?raw")}
        >
          <BasicDemo />
        </Demo>
        <Demo
          id="more"
          title="十二种位置"
          description="默认自动避让视口边缘；页面滚动或尺寸变化后重新定位。"
          source={() => import("../demos/tooltip-basic.tsx?raw")}
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
            "title",
            "提示内容；空内容不显示",
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
        继承全局字体、颜色、圆角和阴影，支持 Tooltip.zIndexPopup。color 接收 CSS
        颜色，不提供上游预设颜色别名映射。
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
