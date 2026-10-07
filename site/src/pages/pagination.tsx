import { ComponentDescription, ComponentWhenToUse } from "../component-prose";
import {
  ComponentApiTables,
  ComponentTokenTable,
} from "../component-reference";
import { AllDemo } from "../demos/pagination-all";
import { BasicDemo } from "../demos/pagination-basic";
import { ItemRenderDemo } from "../demos/pagination-item-render";
import { MiniDemo } from "../demos/pagination-mini";
import { MoreDemo } from "../demos/pagination-more";
import { QuickJumpDemo } from "../demos/pagination-quick-jump";
import { SimpleDemo } from "../demos/pagination-simple";
import { SizeChangeDemo } from "../demos/pagination-size-change";
import { TotalDemo } from "../demos/pagination-total";
import { UncontrolledDemo } from "../demos/pagination-uncontrolled";
import { Demo, DemoGrid, DocMeta, usePageAnchor } from "../docs-ui";
import reference from "../navigation/pagination.json";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Pagination <span>分页</span>
      </h1>
      <ComponentDescription component="Pagination" />
      <DocMeta name="Pagination" />
      <ComponentWhenToUse component="Pagination" />
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <DemoGrid
        component="pagination"
        columns={reference.demoColumns === 2 ? 2 : 1}
      >
        <Demo
          id="basic"
          title="基本"
          description={"基础分页。"}
          descriptionMarkdown
          source={() => import("../demos/pagination-uncontrolled.tsx?raw")}
        >
          <UncontrolledDemo />
        </Demo>
        <Demo
          id="more"
          title="更多"
          description={"更多分页。"}
          descriptionMarkdown
          source={() => import("../demos/pagination-more.tsx?raw")}
        >
          <MoreDemo />
        </Demo>
        <Demo
          id="changer"
          title="改变"
          description={"改变每页显示条目数。"}
          descriptionMarkdown
          source={() => import("../demos/pagination-size-change.tsx?raw")}
        >
          <SizeChangeDemo />
        </Demo>
        <Demo
          id="jump"
          title="跳转"
          description={"快速跳转到某一页。"}
          descriptionMarkdown
          source={() => import("../demos/pagination-quick-jump.tsx?raw")}
        >
          <QuickJumpDemo />
        </Demo>
        <Demo
          id="mini"
          title="迷你"
          description={"迷你版本。"}
          descriptionMarkdown
          source={() => import("../demos/pagination-mini.tsx?raw")}
        >
          <MiniDemo />
        </Demo>
        <Demo
          id="simple"
          title="简洁"
          description={"简单的翻页。"}
          descriptionMarkdown
          source={() => import("../demos/pagination-simple.tsx?raw")}
        >
          <SimpleDemo />
        </Demo>
        <Demo
          id="controlled"
          title="受控"
          description={"受控制的页码。"}
          descriptionMarkdown
          source={() => import("../demos/pagination-basic.tsx?raw")}
        >
          <BasicDemo />
        </Demo>
        <Demo
          id="total"
          title="总数"
          description={"通过设置 `showTotal` 展示总共有多少数据。"}
          descriptionMarkdown
          source={() => import("../demos/pagination-total.tsx?raw")}
        >
          <TotalDemo />
        </Demo>
        <Demo
          id="all"
          title="全部展示"
          description={"展示所有配置选项。"}
          descriptionMarkdown
          source={() => import("../demos/pagination-all.tsx?raw")}
        >
          <AllDemo />
        </Demo>
        <Demo
          id="itemRender"
          title="上一步和下一步"
          description={"修改上一步和下一步为文字链接。"}
          descriptionMarkdown
          source={() => import("../demos/pagination-item-render.tsx?raw")}
        >
          <ItemRenderDemo />
        </Demo>
      </DemoGrid>
      <h2 id="api" tabIndex={-1}>
        API
      </h2>
      <ComponentApiTables component="Pagination" sections={reference.api} />
      <h2 id="tokens" tabIndex={-1}>
        主题变量（Design Token）
      </h2>
      <ComponentTokenTable component="Pagination" tokens={reference.tokens} />
    </>
  );
}
