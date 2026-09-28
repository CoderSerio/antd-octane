import { BasicDemo, MoreDemo } from "../demos/anchor-basic";
import { CustomActiveDemo } from "../demos/anchor-custom-active";
import { CustomClickDemo } from "../demos/anchor-custom-click";
import { HistoryDemo } from "../demos/anchor-history";
import { NestedDemo } from "../demos/anchor-nested";
import { OffsetDemo } from "../demos/anchor-offset";
import { ApiTable, Demo, DocMeta, usePageAnchor } from "../docs-ui";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Anchor <span>锚点</span>
        <small>Alpha</small>
      </h1>
      <p className="lead">通过页内链接定位内容，并随滚动高亮当前章节。</p>
      <DocMeta name="Anchor" />
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <div className="demo-grid">
        <Demo
          id="basic"
          title="容器内定位"
          description="affix=false 保持静态位置；点击导航或滚动独立内容容器。"
          source={() => import("../demos/anchor-basic.tsx?raw")}
        >
          <BasicDemo />
        </Demo>
        <Demo
          id="more"
          title="横向导航"
          description="direction=horizontal 排列单层锚点；此示例链接到当前页面的章节。"
          source={() => import("../demos/anchor-basic.tsx?raw")}
        >
          <MoreDemo />
        </Demo>
        <Demo
          id="nested"
          title="嵌套与链接改变"
          description="children 形成嵌套导航，onChange 报告滚动或点击导致的当前链接变化。"
          source={() => import("../demos/anchor-nested.tsx?raw")}
        >
          <NestedDemo />
        </Demo>
        <Demo
          id="custom-click"
          title="自定义点击"
          description="onClick 可阻止默认滚动与 URL 改写，再交由业务处理。"
          source={() => import("../demos/anchor-custom-click.tsx?raw")}
        >
          <CustomClickDemo />
        </Demo>
        <Demo
          id="custom-active"
          title="自定义高亮"
          description="getCurrentAnchor 可覆盖滚动计算结果，固定高亮指定链接。"
          source={() => import("../demos/anchor-custom-active.tsx?raw")}
        >
          <CustomActiveDemo />
        </Demo>
        <Demo
          id="offset"
          title="滚动偏移"
          description="targetOffset 控制目标与滚动容器顶部的距离。"
          source={() => import("../demos/anchor-offset.tsx?raw")}
        >
          <OffsetDemo />
        </Demo>
        <Demo
          id="history"
          title="替换历史记录"
          description="replace 控制点击锚点时替换当前 hash，还是新增历史记录。"
          source={() => import("../demos/anchor-history.tsx?raw")}
        >
          <HistoryDemo />
        </Demo>
      </div>
      <h2 id="api" tabIndex={-1}>
        API
      </h2>
      <ApiTable
        rows={[
          ["items", "链接列表，支持 children", "AnchorItem[]", "[]"],
          ["affix", "使用 Affix 固定导航", "boolean", "true"],
          ["getContainer", "滚动容器", "() => Window | HTMLElement", "window"],
          [
            "offsetTop / targetOffset",
            "固定位置 / 滚动目标偏移",
            "number",
            "0 / offsetTop",
          ],
          ["bounds", "激活判定容差", "number", "5"],
          ["getCurrentAnchor", "自定义当前链接", "(activeLink) => string", "—"],
          ["direction", "布局方向", "vertical | horizontal", "vertical"],
          ["onClick / onChange", "点击 / 激活项改变", "function", "—"],
          ["replace", "替换历史而非新增", "boolean", "false"],
          [
            "items[].key / href / title / target",
            "稳定键值、链接、标题与打开目标",
            "string | number / string / OctaneNode / string",
            "—",
          ],
        ]}
      />
      <h2 id="tokens" tabIndex={-1}>
        主题与支持范围
      </h2>
      <p>
        支持 linkPaddingBlock、linkPaddingInlineStart 及全局主色。items
        内部哈希链接滚动，普通外部链接保留浏览器行为；横向模式不渲染嵌套子链接。当前高亮为静态边线，不提供滚动滑块动画、旧
        Anchor.Link、showInkInFixed 或自定义 ink。getCurrentAnchor
        接收当前计算的链接字符串，不提供上游的候选链接数组参数；onClick 接收原生
        MouseEvent。普通页内点击使用 History API 改写 hash；路由型应用可在
        onClick 中接管。
      </p>
    </>
  );
}
