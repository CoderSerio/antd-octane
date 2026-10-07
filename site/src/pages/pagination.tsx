import { BasicDemo, MoreDemo } from "../demos/pagination-basic";
import { DisabledDemo } from "../demos/pagination-disabled";
import { FilteredTotalDemo } from "../demos/pagination-filtered-total";
import { ItemRenderDemo } from "../demos/pagination-item-render";
import { QuickJumpDemo } from "../demos/pagination-quick-jump";
import { SimpleDemo } from "../demos/pagination-simple";
import { SizeChangeDemo } from "../demos/pagination-size-change";
import { TotalDemo } from "../demos/pagination-total";
import { UncontrolledDemo } from "../demos/pagination-uncontrolled";
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
          id="uncontrolled"
          title="基本"
          description="使用 defaultCurrent 初始化页码，由组件管理后续变化。"
          source={() => import("../demos/pagination-uncontrolled.tsx?raw")}
        >
          <UncontrolledDemo />
        </Demo>
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
          title="迷你"
          description="size=small 显示紧凑的分页按钮。"
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
        <Demo
          id="size-change"
          title="改变每页条数"
          description="使用 pageSizeOptions 定义选项，onShowSizeChange 报告新的条数。"
          source={() => import("../demos/pagination-size-change.tsx?raw")}
        >
          <SizeChangeDemo />
        </Demo>
        <Demo
          id="quick-jump"
          title="跳转"
          description="输入页码后按 Enter 或失焦提交；超出范围会限制到有效页码。"
          source={() => import("../demos/pagination-quick-jump.tsx?raw")}
        >
          <QuickJumpDemo />
        </Demo>
        <Demo
          id="simple"
          title="简洁"
          description="simple 仅显示上一页、页码输入和下一页。"
          source={() => import("../demos/pagination-simple.tsx?raw")}
        >
          <SimpleDemo />
        </Demo>
        <Demo
          id="total"
          title="总数"
          description="showTotal 可显示总数，也可显示当前页的条目范围。"
          source={() => import("../demos/pagination-total.tsx?raw")}
        >
          <TotalDemo />
        </Demo>
        <Demo
          id="item-render"
          title="上一页与下一页"
          description="itemRender 改变按钮内容，保留原生按钮的可访问语义。"
          source={() => import("../demos/pagination-item-render.tsx?raw")}
        >
          <ItemRenderDemo />
        </Demo>
        <Demo
          id="disabled"
          title="禁用"
          description="整体禁用同时覆盖页码、条数选择器与跳转输入。"
          source={() => import("../demos/pagination-disabled.tsx?raw")}
        >
          <DisabledDemo />
        </Demo>
      </div>
      <h2 id="api" tabIndex={-1}>
        API
      </h2>
      <ApiTable
        rows={[
          ["total", "数据总数", "number", "0"],
          ["size", "分页按钮尺寸", "default | small", "default"],
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
        select；不支持 locale、align、responsive、showTitle，以及
        simple、showSizeChanger、showQuickJumper 的对象配置。itemRender
        只替换按钮内容，不应返回嵌套按钮或链接。
      </p>
    </>
  );
}
