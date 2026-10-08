import { BasicDemo, MoreDemo } from "../demos/tree-business";
import { ApiTable, Demo, DocMeta, usePageAnchor } from "../docs-ui";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Tree <span>树形控件</span>
        <small>Alpha</small>
      </h1>
      <p className="lead">用稳定的节点 key 管理层级数据、选择和父子勾选。</p>
      <DocMeta name="Tree" />
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <div className="demo-grid">
        <Demo
          id="basic"
          title="受控选择"
          description="展开项目后选择一个节点，父组件保存 selectedKeys。"
          source={() => import("../demos/tree-business.tsx?raw")}
        >
          <BasicDemo />
        </Demo>
        <Demo
          id="more"
          title="关联勾选"
          description="选择子节点会计算祖先半选；父组件保存 onCheck 返回的键。"
          source={() => import("../demos/tree-business.tsx?raw")}
        >
          <MoreDemo />
        </Demo>
      </div>
      <h2 id="api" tabIndex={-1}>
        API
      </h2>
      <ApiTable
        rows={[
          ["treeData", "层级节点，所有 key 唯一", "TreeDataNode[]", "—"],
          [
            "expandedKeys / defaultExpandedKeys",
            "受控展开键 / 初始展开键",
            "Key[]",
            "—",
          ],
          [
            "selectedKeys / onSelect",
            "受控选择与回调",
            "Key[] / (keys, info) => void",
            "—",
          ],
          [
            "checkable / checkStrictly",
            "启用复选框 / 取消父子关联",
            "boolean",
            "false / false",
          ],
          [
            "checkedKeys / onCheck",
            "受控勾选；严格模式可分离半选",
            "Key[] | {checked: Key[]; halfChecked: Key[]} / callback",
            "—",
          ],
          [
            "defaultExpandAll / autoExpandParent",
            "初始全部展开 / 展开祖先",
            "boolean",
            "false / false",
          ],
          [
            "disabled / multiple",
            "整体禁用 / 多选",
            "boolean",
            "false / false",
          ],
          [
            "loadData / loadedKeys",
            "异步加载约定 / 已加载键",
            "(node) => Promise<unknown> / Key[]",
            "—",
          ],
          [
            "fieldNames / titleRender",
            "数据字段映射 / 自定义标题",
            "Partial<TreeFieldNames> / (node) => OctaneNode",
            "—",
          ],
          [
            "height / virtual",
            "虚拟滚动高度 / 开关",
            "number / boolean",
            "— / true",
          ],
          [
            "draggable / onDrop",
            "拖放开关与业务回调",
            "boolean | callback | TreeDraggableConfig / callback",
            "false / —",
          ],
          ["ref", "焦点和滚动实例", "TreeRef", "—"],
        ]}
      />
      <h2 id="scope" tabIndex={-1}>
        支持边界
      </h2>
      <p>
        loadData 完成后仍需由应用把子节点写回 treeData；onDrop
        不自动重排业务数据。default
        开头属性只提供初始状态，异步替换数据需要显式维护受控键。虚拟列表应提供
        height；自定义标题、拖放规则和大数据组合仍需应用验证。键盘选择与展开不等于对所有屏幕阅读器及拖放设备的兼容认证。
      </p>
    </>
  );
}
