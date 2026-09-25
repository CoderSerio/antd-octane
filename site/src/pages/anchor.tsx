import { BasicDemo, MoreDemo } from "../demos/anchor-basic";
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
          description="在示例区域操作，查看状态变化。"
          source={() => import("../demos/anchor-basic.tsx?raw")}
        >
          <BasicDemo />
        </Demo>
        <Demo
          id="more"
          title="横向导航"
          description="在示例区域操作，查看状态变化。"
          source={() => import("../demos/anchor-basic.tsx?raw")}
        >
          <MoreDemo />
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
        ]}
      />
      <h2 id="tokens" tabIndex={-1}>
        主题与支持范围
      </h2>
      <p>
        支持 linkPaddingBlock、linkPaddingInlineStart 及全局主色。items
        内部哈希链接滚动，普通外部链接保留浏览器行为；横向模式不渲染嵌套子链接。当前高亮为静态边线，不提供滚动滑块动画、旧
        Anchor.Link 或自定义 ink。
      </p>
    </>
  );
}
