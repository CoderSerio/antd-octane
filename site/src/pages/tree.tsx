import { ComponentWhenToUse } from "../component-prose";
import {
  ComponentApiTables,
  ComponentTokenTable,
} from "../component-reference";
import reference from "../data-display/tree.json";
import {
  AsyncDemo,
  BasicDemo,
  BlockDemo,
  ControlledDemo,
  DirectoryDemo,
  DragDemo,
  IconDemo,
  LineDemo,
  SearchDemo,
  SwitcherDemo,
  VirtualDemo,
} from "../demos/tree-basic";
import { ApiTable, Demo, DemoGrid, DocMeta, usePageAnchor } from "../docs-ui";

export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Tree <span>树形控件</span>
      </h1>
      <p className="lead">多层次的结构列表。</p>
      <DocMeta name="Tree" />
      <ComponentWhenToUse component="Tree" />
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <DemoGrid>
        <Demo
          id="basic"
          title={"基本"}
          description={
            "最简单的用法，展示可勾选，可选中，禁用，默认展开等功能。"
          }
          descriptionMarkdown
          source={() => import("../demos/tree-basic.tsx?raw")}
          sourceExport="BasicDemo"
        >
          <BasicDemo />
        </Demo>
        <Demo
          id="basic-controlled"
          title={"受控操作示例"}
          description={"受控操作示例"}
          descriptionMarkdown
          source={() => import("../demos/tree-basic.tsx?raw")}
          sourceExport="ControlledDemo"
        >
          <ControlledDemo />
        </Demo>
        <Demo
          id="draggable"
          title={"拖动示例"}
          description={"将节点拖拽到其他节点内部或前后。"}
          descriptionMarkdown
          source={() => import("../demos/tree-basic.tsx?raw")}
          sourceExport="DragDemo"
        >
          <DragDemo />
        </Demo>
        <Demo
          id="dynamic"
          title={"异步数据加载"}
          description={"点击展开节点，动态加载数据。"}
          descriptionMarkdown
          source={() => import("../demos/tree-basic.tsx?raw")}
          sourceExport="AsyncDemo"
        >
          <AsyncDemo />
        </Demo>
        <Demo
          id="search"
          title={"可搜索"}
          description={"可搜索的树。"}
          descriptionMarkdown
          source={() => import("../demos/tree-basic.tsx?raw")}
          sourceExport="SearchDemo"
        >
          <SearchDemo />
        </Demo>
        <Demo
          id="line"
          title={"连接线"}
          description={
            "节点之间带连接线的树，常用于文件目录结构展示。使用 `showLine` 开启，可以用 `switcherIcon` 修改默认图标。"
          }
          descriptionMarkdown
          source={() => import("../demos/tree-basic.tsx?raw")}
          sourceExport="LineDemo"
        >
          <LineDemo />
        </Demo>
        <Demo
          id="customized-icon"
          title={"自定义图标"}
          description={"可以针对不同的节点定制图标。"}
          descriptionMarkdown
          source={() => import("../demos/tree-basic.tsx?raw")}
          sourceExport="IconDemo"
        >
          <IconDemo />
        </Demo>
        <Demo
          id="directory"
          title={"目录"}
          description={
            "内置的目录树，`multiple` 模式支持 `ctrl(Windows)` / `command(Mac)` 复选。"
          }
          descriptionMarkdown
          source={() => import("../demos/tree-basic.tsx?raw")}
          sourceExport="DirectoryDemo"
        >
          <DirectoryDemo />
        </Demo>
        <Demo
          id="switcher-icon"
          title={"自定义展开/折叠图标"}
          description={"自定义展开/折叠图标。"}
          descriptionMarkdown
          source={() => import("../demos/tree-basic.tsx?raw")}
          sourceExport="SwitcherDemo"
        >
          <SwitcherDemo />
        </Demo>
        <Demo
          id="virtual-scroll"
          title={"虚拟滚动"}
          description={"使用 `height` 属性则切换为虚拟滚动。"}
          descriptionMarkdown
          source={() => import("../demos/tree-basic.tsx?raw")}
          sourceExport="VirtualDemo"
        >
          <VirtualDemo />
        </Demo>
        <Demo
          id="block-node"
          title="占据整行"
          description="多行树节点。"
          source={() => import("../demos/tree-basic.tsx?raw")}
          sourceExport="BlockDemo"
        >
          <BlockDemo />
        </Demo>
      </DemoGrid>
      <h2 id="api" tabIndex={-1}>
        API
      </h2>
      <ComponentApiTables component="Tree" sections={reference.api} />
      <h3>Tree 方法</h3>
      <ApiTable
        rows={[
          [
            "scrollTo({ key, align, offset })",
            "虚拟滚动下，滚动到指定 key 条目",
            "function(options: { key: string | number; align?: 'top' | 'bottom' | 'auto'; offset?: number })",
            "—",
          ],
        ]}
        label="Tree 方法表，可横向滚动"
      />

      <h2 id="tokens" tabIndex={-1}>
        主题变量（Design Token）
      </h2>
      <ComponentTokenTable component="Tree" tokens={reference.tokens} />
    </>
  );
}
