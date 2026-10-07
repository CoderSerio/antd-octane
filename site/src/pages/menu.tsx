import { BasicDemo, MoreDemo } from "../demos/menu-basic";
import { ControlledTreeDemo } from "../demos/menu-controlled-tree";
import { ItemTypesDemo } from "../demos/menu-item-types";
import { ModeDemo } from "../demos/menu-mode";
import { SingleOpenDemo } from "../demos/menu-single-open";
import { ApiTable, Demo, DocMeta, usePageAnchor } from "../docs-ui";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Menu <span>导航菜单</span>
        <small>Alpha</small>
      </h1>
      <p className="lead">提供明确的导航层级，支持单选、多选和受控展开。</p>
      <DocMeta name="Menu" />
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <div className="demo-grid">
        <Demo
          id="basic"
          title="内嵌导航"
          description="使用真实状态响应选择，禁用项不触发操作。"
          source={() => import("../demos/menu-basic.tsx?raw")}
        >
          <BasicDemo />
        </Demo>
        <Demo
          id="more"
          title="水平菜单"
          description="支持键盘操作，焦点与当前选中状态分别管理。"
          source={() => import("../demos/menu-basic.tsx?raw")}
        >
          <MoreDemo />
        </Demo>
        <Demo
          id="controlled-tree"
          title="受控展开与多选"
          description="应用同步维护 selectedKeys 和 openKeys；再次选择会取消，外部按钮可统一展开或收起。"
          source={() => import("../demos/menu-controlled-tree.tsx?raw")}
        >
          <ControlledTreeDemo />
        </Demo>
        <Demo
          id="single-open"
          title="只展开当前父级"
          description="受控 openKeys 只保留最新展开的根菜单，实现手风琴行为。"
          source={() => import("../demos/menu-single-open.tsx?raw")}
        >
          <SingleOpenDemo />
        </Demo>
        <Demo
          id="mode"
          title="切换菜单类型"
          description="同一组选项可切换 inline、vertical 或 horizontal 布局。"
          source={() => import("../demos/menu-mode.tsx?raw")}
        >
          <ModeDemo />
        </Demo>
        <Demo
          id="item-types"
          title="菜单项与分组"
          description="分组、分隔线、图标、禁用项和危险操作；selectable=false 适用于操作菜单。"
          source={() => import("../demos/menu-item-types.tsx?raw")}
        >
          <ItemTypesDemo />
        </Demo>
      </div>
      <h2 id="api" tabIndex={-1}>
        API
      </h2>
      <ApiTable
        rows={[
          ["items", "条目、子菜单、分组和分隔线", "MenuItem[]", "[]"],
          ["mode", "菜单布局", "inline | vertical | horizontal", "vertical"],
          ["selectedKeys / defaultSelectedKeys", "选中键值", "string[]", "[]"],
          ["openKeys / defaultOpenKeys", "展开子菜单键值", "string[]", "[]"],
          ["selectable / multiple", "选择与多选", "boolean", "true / false"],
          [
            "onClick / onSelect / onDeselect",
            "点击、选中、取消选中",
            "(info: MenuInfo) => void",
            "—",
          ],
          ["onOpenChange", "展开变化意图", "(keys: string[]) => void", "—"],
          ["inlineIndent", "子级缩进", "number", "24"],
          [
            "items[].key / label / icon / title",
            "稳定键值、内容、图标与原生提示",
            "string / OctaneNode / OctaneNode / string",
            "—",
          ],
          [
            "items[].children / type",
            "嵌套条目 / 分组或分隔线",
            "MenuItem[] / group | divider",
            "—",
          ],
          ["items[].disabled / danger", "禁用 / 危险样式", "boolean", "false"],
        ]}
      />
      <h2 id="tokens" tabIndex={-1}>
        主题与支持范围
      </h2>
      <p>
        条目请使用稳定唯一的 key。受控时需在 onSelect、onDeselect 和
        onOpenChange 中更新对应状态，单独传入 key
        数组不会自动改变视图。支持方向键、Home / End、字符定位，以及 Enter /
        Space 激活；展开后右方向键进入子菜单、左方向键返回。支持
        itemColor、itemHoverBg、itemSelectedColor、itemSelectedBg、itemHeight、itemBorderRadius
        等 token。当前子菜单都在同一导航树中展开，vertical / horizontal
        尚未采用浮层子菜单；尚不支持水平溢出收纳、inlineCollapsed、dark theme
        属性、expandIcon、triggerSubMenuAction、子菜单浮层配置和旧版 Menu.Item
        子组件。全局暗色算法可用。MenuInfo 包含 key、从当前项到父级的
        keyPath、下一组选中键值 selectedKeys，以及原生 domEvent；与 React
        合成事件不同。
      </p>
    </>
  );
}
