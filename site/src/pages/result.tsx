import { BasicDemo, MoreDemo } from "../demos/result-basic";
import { ApiTable, Demo, DocMeta, usePageAnchor } from "../docs-ui";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Result <span>结果</span>
        <small>Alpha</small>
      </h1>
      <p className="lead">在流程结束后说明结果，并给用户清晰的下一步操作。</p>
      <DocMeta name="Result" />
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <div className="demo-grid">
        <Demo
          id="basic"
          title="成功与后续操作"
          description="结果标题说明已完成的事项；主要按钮提供下一步入口，次要按钮允许重新开始。"
          source={() => import("../demos/result-basic.tsx?raw")}
        >
          <BasicDemo />
        </Demo>
        <Demo
          id="more"
          title="异常页面"
          description="切换状态码查看不同异常说明；状态图示为本库独立绘制。"
          source={() => import("../demos/result-basic.tsx?raw")}
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
            "status",
            "结果状态",
            "success | error | info | warning | 403 | 404 | 500",
            "info",
          ],
          ["title / subTitle", "标题 / 补充说明", "OctaneNode", "—"],
          ["icon", "自定义状态图标", "OctaneNode", "按状态显示"],
          ["extra", "操作区域", "OctaneNode", "—"],
          ["children", "补充内容区域", "OctaneNode", "—"],
        ]}
      />
      <h2 id="tokens" tabIndex={-1}>
        主题与支持范围
      </h2>
      <p>
        支持全局颜色、间距与字体，以及 Result 的
        titleFontSize、subtitleFontSize、iconFontSize、extraMargin
        token。状态图标与 HTTP 状态图示独立绘制，没有移植上游完整插画。
      </p>
    </>
  );
}
