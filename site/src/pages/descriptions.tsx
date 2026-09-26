import { BasicDemo, MoreDemo } from "../demos/descriptions-basic";
import { ApiTable, Demo, DocMeta, usePageAnchor } from "../docs-ui";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Descriptions <span>描述列表</span>
        <small>Alpha</small>
      </h1>
      <p className="lead">以标签和值展示一组只读信息。</p>
      <DocMeta name="Descriptions" />
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <div className="demo-grid">
        <Demo
          id="basic"
          title="成组信息"
          description="用标签与内容展示只读信息；span 可让较长的说明跨越多列。"
          source={() => import("../demos/descriptions-basic.tsx?raw")}
        >
          <BasicDemo />
        </Demo>
        <Demo
          id="more"
          title="响应式与边框"
          description="窄屏显示一列，md 及以上显示两列；filled 填满当前行，small 缩小单元格间距。"
          source={() => import("../demos/descriptions-basic.tsx?raw")}
        >
          <MoreDemo />
        </Demo>
      </div>
      <h2 id="api" tabIndex={-1}>
        API
      </h2>
      <ApiTable
        rows={[
          ["items", "label、children、key 与 span", "DescriptionsItem[]", "[]"],
          ["column", "列数或响应式列数", "number | Responsive<number>", "3"],
          [
            "bordered / size / layout",
            "边框、尺寸与排列方向",
            "boolean / default | middle | small / horizontal | vertical",
            "false / default / horizontal",
          ],
          [
            "title / extra / colon",
            "标题、操作与冒号",
            "OctaneNode / OctaneNode / boolean",
            "— / — / true",
          ],
          ["labelStyle / contentStyle", "标签与内容样式", "CSSProperties", "—"],
          ["items.span", "占据列数或填满当前行", "number | filled", "1"],
        ]}
      />
      <h2 id="tokens" tabIndex={-1}>
        主题与支持范围
      </h2>
      <p>
        支持
        labelBg、labelColor、contentColor、titleColor、titleMarginBottom、itemPaddingBottom、itemPaddingEnd。暂不支持旧
        Descriptions.Item、span 响应式对象和语义化
        styles/classNames；长字段采用换行。
      </p>
    </>
  );
}
