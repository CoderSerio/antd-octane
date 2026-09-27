import { BasicDemo, MoreDemo } from "../demos/dropdown-basic";
import { ControlledOpenDemo } from "../demos/dropdown-controlled-open";
import { ApiTable, Demo, DocMeta, usePageAnchor } from "../docs-ui";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Dropdown <span>下拉菜单</span>
        <small>Alpha</small>
      </h1>
      <p className="lead">将次要操作收纳到菜单中，支持点击、悬停和右键触发。</p>
      <DocMeta name="Dropdown" />
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <div className="demo-grid">
        <Demo
          id="basic"
          title="点击展开"
          description="使用真实状态响应选择，禁用项不触发操作。"
          source={() => import("../demos/dropdown-basic.tsx?raw")}
        >
          <BasicDemo />
        </Demo>
        <Demo
          id="more"
          title="悬停与右键"
          description="支持键盘操作，焦点与当前选中状态分别管理。"
          source={() => import("../demos/dropdown-basic.tsx?raw")}
        >
          <MoreDemo />
        </Demo>
        <Demo
          id="controlled-open"
          title="受控展开"
          description="应用同步维护 open，既可从触发器打开，也可从外部按钮操作；onOpenChange 报告触发来源。"
          source={() => import("../demos/dropdown-controlled-open.tsx?raw")}
        >
          <ControlledOpenDemo />
        </Demo>
      </div>
      <h2 id="api" tabIndex={-1}>
        API
      </h2>
      <ApiTable
        rows={[
          ["menu", "菜单条目及事件", "MenuProps", "—"],
          ["trigger", "触发方式", "(click | hover | contextMenu)[]", "[hover]"],
          ["open / defaultOpen", "受控 / 初始展开", "boolean", "— / false"],
          [
            "onOpenChange",
            "展开变化及来源",
            "(open, { source: trigger | menu }) => void",
            "—",
          ],
          ["placement", "菜单位置", "Placement", "bottomLeft"],
          ["disabled / autoFocus", "禁用 / 打开后聚焦首项", "boolean", "false"],
          ["autoAdjustOverflow", "越界调整", "boolean", "true"],
          [
            "getPopupContainer",
            "浮层挂载容器",
            "(trigger) => HTMLElement",
            "document.body",
          ],
          ["destroyOnHidden", "关闭时卸载菜单", "boolean", "false"],
        ]}
      />
      <h2 id="tokens" tabIndex={-1}>
        主题与支持范围
      </h2>
      <p>
        触发内容应为能获得焦点的按钮或链接。受控时需在 onOpenChange 中同步
        open；由应用直接设置 open 不会触发该回调。ArrowDown
        打开并聚焦第一项；Escape
        关闭并回到触发器，菜单选择或外部点击会关闭。右键按鼠标位置定位，支持门户容器和越界调整。支持
        paddingBlock、zIndexPopup 及全局主题，菜单样式使用 Menu token。暂不支持
        Dropdown.Button、箭头、popupRender、动画和多级浮层子菜单。示例只反馈所选操作，不实际访问剪贴板或下载文件。
      </p>
    </>
  );
}
