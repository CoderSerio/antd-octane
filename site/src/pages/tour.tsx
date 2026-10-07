import { BasicDemo } from "../demos/tour-basic";
import { ApiTable, Demo, DocMeta, usePageAnchor } from "../docs-ui";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Tour <span>漫游式引导</span>
        <small>Alpha</small>
      </h1>
      <p className="lead">通过逐步高亮页面中的操作，帮助用户了解产品。</p>
      <DocMeta name="Tour" />
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <div className="demo-grid">
        <Demo
          id="basic"
          title="基础引导"
          description="引导上传、保存，再展示居中的结束步骤。支持键盘操作与 Escape 关闭。"
          source={() => import("../demos/tour-basic.tsx?raw")}
        >
          <BasicDemo />
        </Demo>
      </div>
      <h2 id="api" tabIndex={-1}>
        API
      </h2>
      <ApiTable
        rows={[
          [
            "steps",
            "步骤：target、title、description、cover、placement、type、mask、closable 与前后按钮属性",
            "TourStepProps[]",
            "[]",
          ],
          ["open / defaultOpen", "受控 / 初始是否打开", "boolean", "— / true"],
          [
            "current / defaultCurrent",
            "受控 / 初始步骤，从 0 开始",
            "number",
            "— / 0",
          ],
          [
            "onChange / onClose / onFinish",
            "步骤改变 / 关闭当前步骤 / 完成",
            "function",
            "—",
          ],
          [
            "placement",
            "目标周围的 12 个方向，空间不足时自动调整",
            "Placement",
            "bottom",
          ],
          [
            "gap",
            "高亮范围间距与圆角",
            "{ offset?: number | [number, number]; radius?: number }",
            "{ offset: 6, radius: 2 }",
          ],
          [
            "type / mask",
            "卡片类型 / 是否显示遮罩",
            "default | primary / boolean",
            "default / true",
          ],
          [
            "scrollIntoViewOptions",
            "目标在视窗外时滚动到可见范围",
            "boolean | ScrollIntoViewOptions",
            "true",
          ],
          [
            "indicatorsRender",
            "自定义步骤指示器",
            "(current, total) => OctaneNode",
            "—",
          ],
          [
            "closable / closeIcon / zIndex",
            "关闭按钮 / 关闭图标 / 浮层层级",
            "boolean / OctaneNode / number",
            "true / × / 1070",
          ],
        ]}
      />
      <h2 id="tokens" tabIndex={-1}>
        主题与支持范围
      </h2>
      <p>
        支持 Tour 的
        zIndexPopup、closeBtnSize、primaryPrevBtnBg、primaryNextBtnHoverBg，以及全局主色、背景、字体、间距、圆角和阴影。target
        可为元素或返回元素的函数，目标缺失或不可见时居中；滚动和尺寸变化会重新定位。原生
        portal 保留 ConfigProvider 上下文。
      </p>
      <p>
        当前提供带焦点约束的基础引导，高亮区域不支持点击穿透。mask=false
        仅隐藏遮罩，仍保留焦点管理与滚动锁，与上游非模态引导不同。暂不支持箭头、center
        placement、actionsRender、getPopupContainer、自定义遮罩对象、步骤级
        closeIcon/onClose/scrollIntoViewOptions、动态过渡及语义化
        styles/classNames。重新打开时保持当前步骤，可通过受控 current 重置。
      </p>
    </>
  );
}
