import { BasicDemo, MoreDemo } from "../demos/result-basic";
import { CustomIconDemo, ErrorDetailsDemo } from "../demos/result-details";
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
        <Demo
          id="error-details"
          title="错误详情与重新检查"
          description="使用 children 列出需要修正的问题，主要操作重新检查后更新结果。"
          source={() => import("../demos/result-details.tsx?raw")}
        >
          <ErrorDetailsDemo />
        </Demo>
        <Demo
          id="custom-icon"
          title="警告结果与自定义图标"
          description="业务图标可以替换默认图案；status 继续表达结果的语义。"
          source={() => import("../demos/result-details.tsx?raw")}
        >
          <CustomIconDemo />
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
        token。普通状态图标为本库绘制；HTTP
        状态默认使用状态码文字，没有移植上游完整插画。 Result
        不会自动跳转、重试或朗读结果变化；相关操作与动态反馈由应用管理。
      </p>
    </>
  );
}
