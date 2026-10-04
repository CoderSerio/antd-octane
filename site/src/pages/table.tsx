import { ComponentWhenToUse } from "../component-prose";
import {
  ComponentApiTables,
  ComponentTokenTable,
} from "../component-reference";
import reference from "../data-display/table.json";
import {
  AjaxDemo,
  BasicDemo,
  BorderedDemo,
  ColspanRowspanDemo,
  CustomEmptyDemo,
  CustomFilterPanelDemo,
  DragColumnSortingDemo,
  DragSortingDemo,
  DragSortingHandlerDemo,
  DynamicSettingsDemo,
  EditCellDemo,
  EditRowDemo,
  EllipsisCustomTooltipDemo,
  EllipsisDemo,
  ExpandDemo,
  FilterInTreeDemo,
  FilterSearchDemo,
  FixedColumnsDemo,
  FixedColumnsHeaderDemo,
  FixedGappedColumnsDemo,
  FixedHeaderDemo,
  GroupingColumnsDemo,
  HeadDemo,
  HiddenColumnsDemo,
  JsxDemo,
  MultipleSorterDemo,
  NestedTableDemo,
  OrderColumnDemo,
  PaginationDemo,
  ResetFilterDemo,
  ResponsiveDemo,
  RowSelectionCustomDemo,
  RowSelectionOperationDemo,
  SelectionDemo,
  SizeDemo,
  StickyDemo,
  SummaryDemo,
  TreeDataDemo,
  VirtualListDemo,
} from "../demos/table-basic";
import { Demo, DocMeta, usePageAnchor } from "../docs-ui";

export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Table <span>表格</span>
      </h1>
      <p className="lead">展示行列数据。</p>
      <DocMeta name="Table" />
      <ComponentWhenToUse component="Table" />
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <div
        className="demo-grid table-demo-grid"
        style={{ gridTemplateColumns: "minmax(0, 1fr)" }}
      >
        <Demo
          id="basic"
          title={"基本用法"}
          description={"简单的表格，最后一列是各种操作。"}
          descriptionMarkdown
          source={() => import("../demos/table-basic.tsx?raw")}
          sourceExport="BasicDemo"
        >
          <BasicDemo />
        </Demo>
        <Demo
          id="jsx"
          title={"JSX 风格的 API"}
          description={
            "使用 JSX 风格的 API\n\n> 这个只是一个描述 `columns` 的语法糖，所以你不能用其他组件去包裹 `Column` 和 `ColumnGroup`。"
          }
          descriptionMarkdown
          source={() => import("../demos/table-basic.tsx?raw")}
          sourceExport="JsxDemo"
        >
          <JsxDemo />
        </Demo>
        <Demo
          id="row-selection"
          title={"可选择"}
          description={
            "第一列是联动的选择框。可以通过 `rowSelection.type` 属性指定选择类型，默认为 `checkbox`。\n\n> 默认点击 checkbox 触发选择行为，需要点击行触发可以参考例子：<https://codesandbox.io/s/000vqw38rl>"
          }
          descriptionMarkdown
          source={() => import("../demos/table-basic.tsx?raw")}
          sourceExport="SelectionDemo"
        >
          <SelectionDemo />
        </Demo>
        <Demo
          id="row-selection-and-operation"
          title={"选择和操作"}
          description={
            "选择后进行操作，完成后清空选择，通过 `rowSelection.selectedRowKeys` 来控制选中项。"
          }
          descriptionMarkdown
          source={() => import("../demos/table-basic.tsx?raw")}
          sourceExport="RowSelectionOperationDemo"
        >
          <RowSelectionOperationDemo />
        </Demo>
        <Demo
          id="row-selection-custom"
          title={"自定义选择项"}
          description={
            "通过 `rowSelection.selections` 自定义选择项，默认不显示下拉选项，设为 `true` 时显示默认选择项。"
          }
          descriptionMarkdown
          source={() => import("../demos/table-basic.tsx?raw")}
          sourceExport="RowSelectionCustomDemo"
        >
          <RowSelectionCustomDemo />
        </Demo>
        <Demo
          id="head"
          title={"筛选和排序"}
          description={
            "对某一列数据进行筛选，使用列的 `filters` 属性来指定需要筛选菜单的列，`onFilter` 用于筛选当前数据，`filterMultiple` 用于指定多选和单选，`filterOnClose` 用于指定是否在筛选菜单关闭时触发筛选。\n\n使用 `defaultFilteredValue` 属性，设置列的默认筛选项。\n\n对某一列数据进行排序，通过指定列的 `sorter` 函数即可启动排序按钮。`sorter: function(rowA, rowB) { ... }`， rowA、rowB 为比较的两个行数据。\n\n`sortDirections: ['ascend', 'descend']` 改变每列可用的排序方式，切换排序时按数组内容依次切换，设置在 table props 上时对所有列生效。你可以通过设置 `['ascend', 'descend', 'ascend']` 禁止排序恢复到默认状态。\n\n使用 `defaultSortOrder` 属性，设置列的默认排序顺序。\n\n如果 `sortOrder` 或者 `defaultSortOrder` 的值为 `ascend` 或者 `descend`，则可以通过 `sorter` 的函数第三个参数获取当前排序的状态。该函数可以是 `function(a, b, sortOrder) { ... }` 的形式。"
          }
          descriptionMarkdown
          source={() => import("../demos/table-basic.tsx?raw")}
          sourceExport="HeadDemo"
        >
          <HeadDemo />
        </Demo>
        <Demo
          id="filter-in-tree"
          title={"树型筛选菜单"}
          description={
            "可以使用 `filterMode` 来修改筛选菜单的 UI，可选值有 `menu`（默认）和 `tree`。"
          }
          descriptionMarkdown
          source={() => import("../demos/table-basic.tsx?raw")}
          sourceExport="FilterInTreeDemo"
        >
          <FilterInTreeDemo />
        </Demo>
        <Demo
          id="filter-search"
          title={"自定义筛选的搜索"}
          description={
            "`filterSearch` 用于开启筛选项的搜索，通过 `filterSearch:(input, record) => boolean` 设置自定义筛选方法"
          }
          descriptionMarkdown
          source={() => import("../demos/table-basic.tsx?raw")}
          sourceExport="FilterSearchDemo"
        >
          <FilterSearchDemo />
        </Demo>
        <Demo
          id="multiple-sorter"
          title={"多列排序"}
          description={
            "`column.sorter` 支持 `multiple` 字段以配置多列排序优先级。通过 `sorter.compare` 配置排序逻辑，你可以通过不设置该函数只启动多列排序的交互形式。"
          }
          descriptionMarkdown
          source={() => import("../demos/table-basic.tsx?raw")}
          sourceExport="MultipleSorterDemo"
        >
          <MultipleSorterDemo />
        </Demo>
        <Demo
          id="reset-filter"
          title={"可控的筛选和排序"}
          description={
            "使用受控属性对筛选和排序状态进行控制。\n\n> 1. columns 中定义了 filteredValue 和 sortOrder 属性即视为受控模式。\n> 2. 只支持同时对一列进行排序，请保证只有一列的 sortOrder 属性是生效的。\n> 3. 务必指定 `column.key`。"
          }
          descriptionMarkdown
          source={() => import("../demos/table-basic.tsx?raw")}
          sourceExport="ResetFilterDemo"
        >
          <ResetFilterDemo />
        </Demo>
        <Demo
          id="custom-filter-panel"
          title={"自定义筛选菜单"}
          description={
            "通过 `filterDropdown` 自定义的列筛选功能，并实现一个搜索列的示例。\n\n给函数 `clearFilters` 添加 `boolean` 类型参数 `closeDropdown`，是否关闭筛选菜单，默认为 `true`。添加 `boolean` 类型参数 `confirm`，清除筛选时是否提交已选项，默认 `true`。"
          }
          descriptionMarkdown
          source={() => import("../demos/table-basic.tsx?raw")}
          sourceExport="CustomFilterPanelDemo"
        >
          <CustomFilterPanelDemo />
        </Demo>
        <Demo
          id="ajax"
          title={"远程加载数据"}
          description={
            "这个例子通过简单的 ajax 读取方式，演示了如何从服务端读取并展现数据，具有筛选、排序等功能以及页面 loading 效果。开发者可以自行接入其他数据处理方式。\n\n另外，本例也展示了筛选排序功能如何交给服务端实现，列不需要指定具体的 `onFilter` 和 `sorter` 函数，而是在把筛选和排序的参数发到服务端来处理。\n\n当使用 `rowSelection` 时，请设置 `rowSelection.preserveSelectedRowKeys` 属性以保留 `key`。\n\n**注意，此示例使用 [模拟接口](https://mocky.io)，展示数据可能不准确，请打开网络面板查看请求。**\n\n> 🛎️ 想要 3 分钟实现？试试 [ProTable](https://procomponents.ant.design/components/table)！"
          }
          descriptionMarkdown
          source={() => import("../demos/table-basic.tsx?raw")}
          sourceExport="AjaxDemo"
        >
          <AjaxDemo />
        </Demo>
        <Demo
          id="size"
          title={"紧凑型"}
          description={"两种紧凑型的列表，小型列表只用于对话框内。"}
          descriptionMarkdown
          source={() => import("../demos/table-basic.tsx?raw")}
          sourceExport="SizeDemo"
        >
          <SizeDemo />
        </Demo>
        <Demo
          id="bordered"
          title={"带边框"}
          description={"添加表格边框线，页头和页脚。"}
          descriptionMarkdown
          source={() => import("../demos/table-basic.tsx?raw")}
          sourceExport="BorderedDemo"
        >
          <BorderedDemo />
        </Demo>
        <Demo
          id="expand"
          title={"可展开"}
          description={"当表格内容较多不能一次性完全展示时。"}
          descriptionMarkdown
          source={() => import("../demos/table-basic.tsx?raw")}
          sourceExport="ExpandDemo"
        >
          <ExpandDemo />
        </Demo>
        <Demo
          id="order-column"
          title={"特殊列排序"}
          description={
            "你可以通过 `Table.EXPAND_COLUMN` 和 `Table.SELECTION_COLUMN` 来控制选择和展开列的顺序。"
          }
          descriptionMarkdown
          source={() => import("../demos/table-basic.tsx?raw")}
          sourceExport="OrderColumnDemo"
        >
          <OrderColumnDemo />
        </Demo>
        <Demo
          id="colspan-rowspan"
          title={"表格行/列合并"}
          description={
            "表头只支持列合并，使用 column 里的 colSpan 进行设置。\n\n表格支持行/列合并，当 `onCell` 里的单元格属性 `colSpan` 或者 `rowSpan` 设值为 0 时，设置的表格不会渲染。"
          }
          descriptionMarkdown
          source={() => import("../demos/table-basic.tsx?raw")}
          sourceExport="ColspanRowspanDemo"
        >
          <ColspanRowspanDemo />
        </Demo>
        <Demo
          id="tree-data"
          title={"树形数据展示"}
          description={
            "表格支持树形数据的展示，当数据中有 `children` 字段时会自动展示为树形表格，如果不需要或配置为其他字段可以用 `childrenColumnName` 进行配置。\n\n可以通过设置 `indentSize` 以控制每一层的缩进宽度。"
          }
          descriptionMarkdown
          source={() => import("../demos/table-basic.tsx?raw")}
          sourceExport="TreeDataDemo"
        >
          <TreeDataDemo />
        </Demo>
        <Demo
          id="fixed-header"
          title={"固定表头"}
          description={
            "方便一页内展示大量数据。\n\n需要指定 column 的 `width` 属性，否则列头和内容可能不对齐。如果指定 `width` 不生效或出现白色垂直空隙，请尝试建议留一列不设宽度以适应弹性布局，或者检查是否有[超长连续字段破坏布局](https://github.com/ant-design/ant-design/issues/13825#issuecomment-449889241)。"
          }
          descriptionMarkdown
          source={() => import("../demos/table-basic.tsx?raw")}
          sourceExport="FixedHeaderDemo"
        >
          <FixedHeaderDemo />
        </Demo>
        <Demo
          id="fixed-columns"
          title={"固定列"}
          description={
            "对于列数很多的数据，可以固定前后的列，横向滚动查看其它数据，需要和 `scroll.x` 配合使用。\n\n> 若列头与内容不对齐或出现列重复，请指定**固定列**的宽度 `width`。如果指定 `width` 不生效或出现白色垂直空隙，请尝试建议留一列不设宽度以适应弹性布局，或者检查是否有[超长连续字段破坏布局](https://github.com/ant-design/ant-design/issues/13825#issuecomment-449889241)。\n>\n> 建议指定 `scroll.x` 为大于表格宽度的固定值或百分比。注意，且非固定列宽度之和不要超过 `scroll.x`。"
          }
          descriptionMarkdown
          source={() => import("../demos/table-basic.tsx?raw")}
          sourceExport="FixedColumnsDemo"
        >
          <FixedColumnsDemo />
        </Demo>
        <Demo
          id="fixed-gapped-columns"
          title={"堆叠固定列"}
          description={
            "混合固定列，滚动到一定距离进行堆叠，推荐配合 `bordered` 使用。"
          }
          descriptionMarkdown
          source={() => import("../demos/table-basic.tsx?raw")}
          sourceExport="FixedGappedColumnsDemo"
        >
          <FixedGappedColumnsDemo />
        </Demo>
        <Demo
          id="fixed-columns-header"
          title={"固定头和列"}
          description={
            "适合同时展示有大量数据和数据列。\n\n> 若列头与内容不对齐或出现列重复，请指定**固定列**的宽度 `width`。如果指定 `width` 不生效或出现白色垂直空隙，请尝试建议留一列不设宽度以适应弹性布局，或者检查是否有[超长连续字段破坏布局](https://github.com/ant-design/ant-design/issues/13825#issuecomment-449889241)。\n>\n> 建议指定 `scroll.x` 为大于表格宽度的固定值或百分比。注意，且非固定列宽度之和不要超过 `scroll.x`。"
          }
          descriptionMarkdown
          source={() => import("../demos/table-basic.tsx?raw")}
          sourceExport="FixedColumnsHeaderDemo"
        >
          <FixedColumnsHeaderDemo />
        </Demo>
        <Demo
          id="hidden-columns"
          title={"隐藏列"}
          description={"使用 `hidden` 隐藏列。"}
          descriptionMarkdown
          source={() => import("../demos/table-basic.tsx?raw")}
          sourceExport="HiddenColumnsDemo"
        >
          <HiddenColumnsDemo />
        </Demo>
        <Demo
          id="grouping-columns"
          title={"表头分组"}
          description={"`columns[n]` 可以内嵌 `children`，以渲染分组表头。"}
          descriptionMarkdown
          source={() => import("../demos/table-basic.tsx?raw")}
          sourceExport="GroupingColumnsDemo"
        >
          <GroupingColumnsDemo />
        </Demo>
        <Demo
          id="edit-cell"
          title={"可编辑单元格"}
          description={
            "带单元格编辑功能的表格。当配合 `shouldCellUpdate` 使用时请注意[闭包问题](https://github.com/ant-design/ant-design/issues/29243)。"
          }
          descriptionMarkdown
          source={() => import("../demos/table-basic.tsx?raw")}
          sourceExport="EditCellDemo"
        >
          <EditCellDemo />
        </Demo>
        <Demo
          id="edit-row"
          title={"可编辑行"}
          description={
            "带行编辑功能的表格。\n\n> 🛎️ 想要 3 分钟实现？试试 [ProTable 的可编辑表格](https://procomponents.ant.design/components/editable-table)！"
          }
          descriptionMarkdown
          source={() => import("../demos/table-basic.tsx?raw")}
          sourceExport="EditRowDemo"
        >
          <EditRowDemo />
        </Demo>
        <Demo
          id="nested-table"
          title={"嵌套子表格"}
          description={"展示每行数据更详细的信息。"}
          descriptionMarkdown
          source={() => import("../demos/table-basic.tsx?raw")}
          sourceExport="NestedTableDemo"
        >
          <NestedTableDemo />
        </Demo>
        <Demo
          id="drag-sorting"
          title={"拖拽排序"}
          description={"通过拖拽行来调整数据顺序。"}
          descriptionMarkdown
          source={() => import("../demos/table-basic.tsx?raw")}
          sourceExport="DragSortingDemo"
        >
          <DragSortingDemo />
        </Demo>
        <Demo
          id="drag-column-sorting"
          title={"列拖拽排序"}
          description={"通过拖拽表头调整列顺序。"}
          descriptionMarkdown
          source={() => import("../demos/table-basic.tsx?raw")}
          sourceExport="DragColumnSortingDemo"
        >
          <DragColumnSortingDemo />
        </Demo>
        <Demo
          id="drag-sorting-handler"
          title={"拖拽手柄列"}
          description={"使用独立的拖拽手柄调整行顺序。"}
          descriptionMarkdown
          source={() => import("../demos/table-basic.tsx?raw")}
          sourceExport="DragSortingHandlerDemo"
        >
          <DragSortingHandlerDemo />
        </Demo>
        <Demo
          id="ellipsis"
          title={"单元格自动省略"}
          description={
            "设置 `column.ellipsis` 可以让单元格内容根据宽度自动省略。\n\n> 列头缩略暂不支持和排序筛选一起使用。"
          }
          descriptionMarkdown
          source={() => import("../demos/table-basic.tsx?raw")}
          sourceExport="EllipsisDemo"
        >
          <EllipsisDemo />
        </Demo>
        <Demo
          id="ellipsis-custom-tooltip"
          title={"自定义单元格省略提示"}
          description={
            "设置 `column.ellipsis.showTitle` 关闭单元格内容自动省略后默认的 `title` 提示, 使用 `Tooltip` 替代。"
          }
          descriptionMarkdown
          source={() => import("../demos/table-basic.tsx?raw")}
          sourceExport="EllipsisCustomTooltipDemo"
        >
          <EllipsisCustomTooltipDemo />
        </Demo>
        <Demo
          id="custom-empty"
          title={"自定义空状态"}
          description={"自定义空状态。"}
          descriptionMarkdown
          source={() => import("../demos/table-basic.tsx?raw")}
          sourceExport="CustomEmptyDemo"
        >
          <CustomEmptyDemo />
        </Demo>
        <Demo
          id="summary"
          title={"总结栏"}
          description={
            "通过 `summary` 设置总结栏。使用 `Table.Summary.Cell` 同步 Column 的固定状态。你可以通过配置 `Table.Summary` 的 `fixed` 属性使其固定。"
          }
          descriptionMarkdown
          source={() => import("../demos/table-basic.tsx?raw")}
          sourceExport="SummaryDemo"
        >
          <SummaryDemo />
        </Demo>
        <Demo
          id="virtual-list"
          title={"虚拟列表"}
          description={
            "通过 `virtual` 开启虚拟滚动，此时 `scroll.x` 与 `scroll.y` 必须设置且为 `number` 类型。"
          }
          descriptionMarkdown
          source={() => import("../demos/table-basic.tsx?raw")}
          sourceExport="VirtualListDemo"
        >
          <VirtualListDemo />
        </Demo>
        <Demo
          id="responsive"
          title={"响应式"}
          description={"响应式配置列的展示。"}
          descriptionMarkdown
          source={() => import("../demos/table-basic.tsx?raw")}
          sourceExport="ResponsiveDemo"
        >
          <ResponsiveDemo />
        </Demo>
        <Demo
          id="pagination"
          title={"分页设置"}
          description={"表格的分页设置。"}
          descriptionMarkdown
          source={() => import("../demos/table-basic.tsx?raw")}
          sourceExport="PaginationDemo"
        >
          <PaginationDemo />
        </Demo>
        <Demo
          id="sticky"
          title={"随页面滚动的固定表头和滚动条"}
          description={
            "对于长表格，需要滚动才能查看表头和滚动条，那么现在可以设置跟随页面固定表头和滚动条。"
          }
          descriptionMarkdown
          source={() => import("../demos/table-basic.tsx?raw")}
          sourceExport="StickyDemo"
        >
          <StickyDemo />
        </Demo>
        <Demo
          id="dynamic-settings"
          title={"动态控制表格属性"}
          description={"选择不同配置组合查看效果。"}
          descriptionMarkdown
          source={() => import("../demos/table-basic.tsx?raw")}
          sourceExport="DynamicSettingsDemo"
        >
          <DynamicSettingsDemo />
        </Demo>
      </div>
      <h2 id="api" tabIndex={-1}>
        API
      </h2>
      <ComponentApiTables component="Table" sections={reference.api} />

      <h2 id="tokens" tabIndex={-1}>
        主题变量（Design Token）
      </h2>
      <ComponentTokenTable component="Table" tokens={reference.tokens} />
    </>
  );
}
