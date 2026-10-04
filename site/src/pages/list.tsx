import { ComponentWhenToUse } from "../component-prose";
import {
  ComponentApiTables,
  ComponentTokenTable,
} from "../component-reference";
import reference from "../data-display/list.json";
import {
  BasicDemo,
  DragSortingDemo,
  DragSortingHandlerDemo,
  GridDemo,
  GridDragSortingDemo,
  GridDragSortingHandlerDemo,
  InfiniteLoadDemo,
  LoadMoreDemo,
  PaginationDemo,
  ResponsiveDemo,
  SimpleDemo,
  VerticalDemo,
  VirtualListDemo,
} from "../demos/list-basic";
import { Demo, DocMeta, usePageAnchor } from "../docs-ui";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        List <span>列表</span>
      </h1>
      <p className="lead">最基础的列表展示，可承载文字、列表、图片、段落。</p>
      <DocMeta name="List" />
      <ComponentWhenToUse component="List" />
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <div
        className="demo-grid"
        style={{
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(100%, 450px), 1fr))",
        }}
      >
        <Demo
          id="simple"
          title={"简单列表"}
          description={
            "列表拥有大、中、小三种尺寸。\n\n通过设置 `size` 为 `large` `small` 分别把按钮设为大、小尺寸。若不设置 `size`，则尺寸为中。\n\n可通过设置 `header` 和 `footer`，来自定义列表头部和尾部。"
          }
          descriptionMarkdown
          source={() => import("../demos/list-basic.tsx?raw")}
          sourceExport="SimpleDemo"
        >
          <SimpleDemo />
        </Demo>
        <Demo
          id="basic"
          title={"基础列表"}
          description={"基础列表。"}
          descriptionMarkdown
          source={() => import("../demos/list-basic.tsx?raw")}
          sourceExport="BasicDemo"
        >
          <BasicDemo />
        </Demo>
        <Demo
          id="loadmore"
          title={"加载更多"}
          description={"可通过 `loadMore` 属性实现加载更多功能。"}
          descriptionMarkdown
          source={() => import("../demos/list-basic.tsx?raw")}
          sourceExport="LoadMoreDemo"
        >
          <LoadMoreDemo />
        </Demo>
        <Demo
          id="vertical"
          title={"竖排列表样式"}
          description={
            "通过设置 `itemLayout` 属性为 `vertical` 可实现竖排列表样式。"
          }
          descriptionMarkdown
          source={() => import("../demos/list-basic.tsx?raw")}
          sourceExport="VerticalDemo"
        >
          <VerticalDemo />
        </Demo>
        <Demo
          id="pagination"
          title={"分页设置"}
          description={"可通过 `pagination` 属性使用列表分页，并进行设置。"}
          descriptionMarkdown
          source={() => import("../demos/list-basic.tsx?raw")}
          sourceExport="PaginationDemo"
        >
          <PaginationDemo />
        </Demo>
        <Demo
          id="grid"
          title={"栅格列表"}
          description={
            "可以通过设置 `List` 的 `grid` 属性来实现栅格列表，`column` 可设置期望显示的列数。"
          }
          descriptionMarkdown
          source={() => import("../demos/list-basic.tsx?raw")}
          sourceExport="GridDemo"
        >
          <GridDemo />
        </Demo>
        <Demo
          id="responsive"
          title={"响应式的栅格列表"}
          description={
            "响应式的栅格列表。尺寸与 [Layout Grid](/components/grid-cn/#col) 保持一致。"
          }
          descriptionMarkdown
          source={() => import("../demos/list-basic.tsx?raw")}
          sourceExport="ResponsiveDemo"
        >
          <ResponsiveDemo />
        </Demo>
        <Demo
          id="infinite-load"
          title={"滚动加载"}
          description={"滚动容器内逐步追加列表内容。"}
          descriptionMarkdown
          source={() => import("../demos/list-basic.tsx?raw")}
          sourceExport="InfiniteLoadDemo"
        >
          <InfiniteLoadDemo />
        </Demo>
        <Demo
          id="drag-sorting"
          title={"拖拽排序"}
          description={"拖动列表项调整顺序。"}
          descriptionMarkdown
          source={() => import("../demos/list-basic.tsx?raw")}
          sourceExport="DragSortingDemo"
        >
          <DragSortingDemo />
        </Demo>
        <Demo
          id="drag-sorting-handler"
          title={"拖拽排序（拖拽手柄）"}
          description={"只通过拖动手柄调整列表顺序。"}
          descriptionMarkdown
          source={() => import("../demos/list-basic.tsx?raw")}
          sourceExport="DragSortingHandlerDemo"
        >
          <DragSortingHandlerDemo />
        </Demo>
        <Demo
          id="grid-drag-sorting"
          title={"栅格拖拽排序"}
          description={"拖动栅格卡片调整顺序。"}
          descriptionMarkdown
          source={() => import("../demos/list-basic.tsx?raw")}
          sourceExport="GridDragSortingDemo"
        >
          <GridDragSortingDemo />
        </Demo>
        <Demo
          id="grid-drag-sorting-handler"
          title={"栅格拖拽排序（拖拽手柄）"}
          description={"通过卡片内的拖动手柄调整栅格顺序。"}
          descriptionMarkdown
          source={() => import("../demos/list-basic.tsx?raw")}
          sourceExport="GridDragSortingHandlerDemo"
        >
          <GridDragSortingHandlerDemo />
        </Demo>
        <Demo
          id="virtual-list"
          title={"滚动加载无限长列表"}
          description={"在固定高度的滚动容器中展示大量列表项。"}
          descriptionMarkdown
          source={() => import("../demos/list-basic.tsx?raw")}
          sourceExport="VirtualListDemo"
        >
          <VirtualListDemo />
        </Demo>
      </div>
      <h2 id="api" tabIndex={-1}>
        API
      </h2>
      <ComponentApiTables component="List" sections={reference.api} />

      <h2 id="tokens" tabIndex={-1}>
        主题变量（Design Token）
      </h2>
      <ComponentTokenTable component="List" tokens={reference.tokens} />
    </>
  );
}
