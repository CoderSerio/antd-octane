import { BasicDemo, MoreDemo } from "../demos/empty-basic";
import { ApiTable, Demo, DocMeta, usePageAnchor } from "../docs-ui";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Empty <span>空状态</span>
        <small>Alpha</small>
      </h1>
      <p className="lead">在没有数据时说明当前状态，并提供下一步操作。</p>
      <DocMeta name="Empty" />
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <div className="demo-grid">
        <Demo
          id="basic"
          title="空状态"
          description="没有数据时展示占位图与说明，可通过 description 自定义文案或隐藏说明。"
          source={() => import("../demos/empty-basic.tsx?raw")}
        >
          <BasicDemo />
        </Demo>
        <Demo
          id="more"
          title="简洁图与操作入口"
          description="使用简洁占位图，并在底部放置操作按钮；本例跳转到接入指南。"
          source={() => import("../demos/empty-basic.tsx?raw")}
        >
          <MoreDemo />
        </Demo>
      </div>
      <h2 id="api" tabIndex={-1}>
        API
      </h2>
      <ApiTable
        rows={[
          ["image", "自定义图片地址或节点", "string | OctaneNode", "默认图示"],
          ["imageStyle", "图示容器样式", "CSSProperties", "—"],
          [
            "description",
            "说明文字；false/null 隐藏",
            "OctaneNode",
            "暂无数据",
          ],
          ["children", "底部操作区域", "OctaneNode", "—"],
        ]}
      />
      <h2 id="tokens" tabIndex={-1}>
        主题与支持范围
      </h2>
      <p>
        支持全局颜色、字体与间距 token。PRESENTED_IMAGE_SIMPLE
        提供小图示。本库图示为独立绘制，尚未移植上游完整插画；暂不支持
        ConfigProvider locale / renderEmpty。
      </p>
    </>
  );
}
