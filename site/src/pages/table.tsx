import { BasicDemo, MoreDemo } from "../demos/table-business";
import { ApiTable, Demo, DocMeta, usePageAnchor } from "../docs-ui";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Table <span>表格</span>
        <small>Alpha</small>
      </h1>
      <p className="lead">
        使用稳定行键展示记录，并将排序、分页和选择接入业务状态。
      </p>
      <DocMeta name="Table" />
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <div className="demo-grid">
        <Demo
          id="basic"
          title="记录和本地排序"
          description="点击投入小时表头进行本地排序。"
          source={() => import("../demos/table-business.tsx?raw")}
        >
          <BasicDemo />
        </Demo>
        <Demo
          id="more"
          title="受控行选择与分页"
          description="Bob 不可选择；分页后选中键仍由父组件持有。"
          source={() => import("../demos/table-business.tsx?raw")}
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
            "dataSource / columns",
            "记录数组 / 列配置",
            "T[] / ColumnsType<T>",
            "[] / []",
          ],
          [
            "rowKey",
            "每行稳定键",
            "string | (record: T) => string | number",
            "key",
          ],
          [
            "pagination",
            "分页或关闭分页",
            "false | TablePaginationConfig",
            "分页开启",
          ],
          ["rowSelection", "受控选择和选择回调", "TableRowSelection<T>", "—"],
          [
            "columns.render",
            "单元格内容；value 按 unknown 处理",
            "(value, record, index) => OctaneNode",
            "—",
          ],
          [
            "columns.sorter",
            "本地比较器或远程排序标志",
            "boolean | CompareFn<T> | object",
            "—",
          ],
          [
            "columns.filters / onFilter",
            "筛选菜单及本地筛选",
            "ColumnFilterItem[] / callback",
            "—",
          ],
          [
            "onChange",
            "分页、筛选、排序变化",
            "(pagination, filters, sorter, extra) => void",
            "—",
          ],
          [
            "loading / size / bordered",
            "载入状态、密度、边框",
            "boolean | SpinProps / small | middle | large | default / boolean",
            "false / large / false",
          ],
          [
            "scroll / virtual",
            "滚动区域 / 虚拟行",
            "{x?, y?, scrollToFirstRowOnChange?} / boolean",
            "—",
          ],
          ["expandable", "行展开配置", "ExpandableConfig<T>", "—"],
          ["ref", "原生节点和定位", "TableRef: nativeElement, scrollTo", "—"],
        ]}
      />
      <h2 id="scope" tabIndex={-1}>
        支持边界
      </h2>
      <p>
        表格不会替应用获取服务端数据。远程排序或筛选应在 onChange
        中请求数据并更新
        dataSource、loading、pagination；不要再提供本地比较器来重复处理。虚拟行需要
        scroll.y；树形记录或额外展开内容会使用普通行渲染。自定义
        components、单元格和摘要应自行检查布局与可访问性。此页没有证明所有上游表格插件或组合兼容。
      </p>
    </>
  );
}
