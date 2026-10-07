import { BasicDemo, MoreDemo } from "../demos/drawer-basic";
import { NestedDemo } from "../demos/drawer-nested";
import { SizesDemo } from "../demos/drawer-sizes";
import { ApiTable, Demo, DocMeta, usePageAnchor } from "../docs-ui";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Drawer <span>抽屉</span>
        <small>Alpha</small>
      </h1>
      <p className="lead">从页面边缘展开额外内容，完成操作后回到原任务。</p>
      <DocMeta name="Drawer" />
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <div className="demo-grid">
        <Demo
          id="basic"
          title="四个方向"
          description="关闭后回到触发入口；可使用键盘操作。"
          source={() => import("../demos/drawer-basic.tsx?raw")}
        >
          <BasicDemo />
        </Demo>
        <Demo
          id="more"
          title="关闭后销毁内容"
          description="关闭后回到触发入口；可使用键盘操作。"
          source={() => import("../demos/drawer-basic.tsx?raw")}
        >
          <MoreDemo />
        </Demo>
        <Demo
          id="sizes"
          title="预设尺寸与遮罩行为"
          description="比较默认与大尺寸；maskClosable=false 可避免误触遮罩导致关闭。"
          source={() => import("../demos/drawer-sizes.tsx?raw")}
        >
          <SizesDemo />
        </Demo>
        <Demo
          id="nested"
          title="多层抽屉"
          description="子层使用更高 zIndex；最上层关闭后仍保留外层，当前不支持 push 推动父层。"
          source={() => import("../demos/drawer-nested.tsx?raw")}
        >
          <NestedDemo />
        </Demo>
      </div>
      <h2 id="api" tabIndex={-1}>
        API
      </h2>
      <ApiTable
        rows={[
          ["open", "是否显示", "boolean", "false"],
          ["onClose", "关闭请求，需更新 open", "(event) => void", "—"],
          [
            "title / extra / footer",
            "标题 / 标题额外内容 / 底部内容",
            "OctaneNode",
            "—",
          ],
          ["placement", "弹出方向", "top | right | bottom | left", "right"],
          ["width / height", "横向宽度 / 纵向高度", "number | string", "378"],
          ["size", "预设尺寸", "default | large", "default"],
          [
            "closable / closeIcon",
            "关闭按钮 / 图标",
            "boolean / OctaneNode",
            "true / ×",
          ],
          [
            "mask / maskClosable / keyboard",
            "遮罩 / 点击遮罩关闭 / Escape 关闭",
            "boolean",
            "true",
          ],
          ["autoFocus", "打开时自动聚焦首个可操作元素", "boolean", "true"],
          [
            "destroyOnHidden / forceRender",
            "关闭后销毁 / 提前渲染",
            "boolean",
            "false",
          ],
          [
            "getContainer",
            "挂载节点；false 为原地渲染",
            "HTMLElement | (() => HTMLElement) | false",
            "document.body",
          ],
          ["zIndex", "层级", "number", "1000"],
          [
            "style / rootStyle / bodyStyle",
            "内容面板 / 浮层根节点 / 内容区样式",
            "CSSProperties",
            "—",
          ],
          ["className / rootClassName", "内容容器 / 根节点类名", "string", "—"],
          ["afterOpenChange", "显示状态变更回调", "(open) => void", "—"],
        ]}
      />
      <h2 id="tokens" tabIndex={-1}>
        主题与支持范围
      </h2>
      <p>
        支持 Drawer 的 footerPaddingBlock、footerPaddingInline、zIndexPopup
        及全局字体、阴影、背景。当前支持四向打开与受控状态，不提供 push
        推动父层、loading 骨架屏、resizable、语义 styles/classNames
        或动画配置。large 默认宽度或高度为 736。
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
