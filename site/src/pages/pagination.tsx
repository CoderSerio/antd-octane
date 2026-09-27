import { BasicDemo, MoreDemo } from "../demos/pagination-basic";
import { FilteredTotalDemo } from "../demos/pagination-filtered-total";
import { ApiTable, Demo, DocMeta, usePageAnchor } from "../docs-ui";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Pagination <span>分页</span>
        <small>Alpha</small>
      </h1>
      <p className="lead">在大量数据中按页浏览，并调整每页显示数量。</p>
      <DocMeta name="Pagination" />
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <div className="demo-grid">
        <Demo
          id="basic"
          title="受控分页"
          description="页码和每页条数由应用控制；跳转输入按 Enter 或失焦提交。"
          source={() => import("../demos/pagination-basic.tsx?raw")}
        >
          <BasicDemo />
        </Demo>
        <Demo
          id="more"
          title="小尺寸与简洁模式"
          description="支持紧凑分页、直接输入页码和整体禁用。"
          source={() => import("../demos/pagination-basic.tsx?raw")}
        >
          <MoreDemo />
        </Demo>
        <Demo
          id="filtered-total"
          title="筛选后重置页码"
          description="切换结果总数时由应用将受控页码重置为 1；页数与范围随 total、pageSize 更新。"
          source={() => import("../demos/pagination-filtered-total.tsx?raw")}
        >
          <FilteredTotalDemo />
        </Demo>
      </div>
      <h2 id="api" tabIndex={-1}>
        API
      </h2>
      <ApiTable
        rows={[
          ["total", "数据总数", "number", "0"],
          ["current / defaultCurrent", "受控 / 初始页码", "number", "— / 1"],
          [
            "pageSize / defaultPageSize",
            "受控 / 初始每页条数",
            "number",
            "— / 10",
          ],
          [
            "onChange / onShowSizeChange",
            "页码或每页条数变化",
            "(page, pageSize) => void",
            "—",
          ],
          [
            "showSizeChanger / pageSizeOptions",
            "条数选择与选项",
            "boolean / (number | string)[]",
            "total > 50 / [10,20,50,100]",
          ],
          [
            "showQuickJumper / simple / showLessItems",
            "跳转、简洁和较少页码",
            "boolean",
            "false",
          ],
          ["showTotal / itemRender", "总数文案 / 按钮内容", "callback", "—"],
          [
            "disabled / hideOnSinglePage",
            "禁用 / 单页隐藏",
            "boolean",
            "false",
          ],
        ]}
      />
      <h2 id="tokens" tabIndex={-1}>
        主题与支持范围
      </h2>
      <p>
        支持 itemSize、itemSizeSM、itemBg、itemActiveBg token 及全局主题。total
        缩小时显示页码会限制在有效范围，但受控 current
        仍由应用维护；筛选时请按产品需求主动重置。条数选择暂用原生
        select；不支持 locale、align、响应式精简或 showQuickJumper
        对象配置。itemRender 只替换按钮内容，不应返回嵌套按钮或链接。
      </p>
    </>
  );
}
