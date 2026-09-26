import { BasicDemo, MoreDemo } from "../demos/skeleton-basic";
import { ApiTable, Demo, DocMeta, usePageAnchor } from "../docs-ui";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Skeleton <span>骨架屏</span>
        <small>Alpha</small>
      </h1>
      <p className="lead">首次加载时展示内容结构，减少等待过程中的布局突变。</p>
      <DocMeta name="Skeleton" />
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <div className="demo-grid">
        <Demo
          id="basic"
          title="内容占位"
          description="切换加载状态查看占位与实际内容。段落行数可以按内容结构配置。"
          source={() => import("../demos/skeleton-basic.tsx?raw")}
        >
          <BasicDemo />
        </Demo>
        <Demo
          id="more"
          title="独立占位组件"
          description="用头像、按钮、输入框、图片和自定义节点组合出与实际内容相近的结构。"
          source={() => import("../demos/skeleton-basic.tsx?raw")}
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
            "loading",
            "为 true 时展示骨架，为 false 时显示 children",
            "boolean",
            "true",
          ],
          ["active / round", "启用动画 / 圆角样式", "boolean", "false"],
          [
            "avatar",
            "头像占位及大小、形状",
            "boolean | { size?, shape? }",
            "false",
          ],
          ["title", "标题占位及宽度", "boolean | { width?, style? }", "true"],
          [
            "paragraph",
            "段落占位、行数与每行宽度",
            "boolean | { rows?, width?, style? }",
            "true",
          ],
          [
            "Skeleton.Button",
            "按钮占位，支持 active、size、shape、block",
            "组件",
            "—",
          ],
          [
            "Skeleton.Avatar / Input",
            "头像 / 输入框占位，支持 active、size 等",
            "组件",
            "—",
          ],
          [
            "Skeleton.Image / Node",
            "图片 / 自定义节点占位，支持 active、style",
            "组件",
            "—",
          ],
        ]}
      />
      <h2 id="tokens" tabIndex={-1}>
        主题与支持范围
      </h2>
      <p>
        支持全局字体、间距、圆角与动效配置，以及 Skeleton 的
        gradientFromColor、gradientToColor、titleHeight、blockRadius、paragraphMarginTop、paragraphLiHeight
        token；同时兼容旧的 color / colorGradientEnd。图片占位图为独立绘制。
      </p>
    </>
  );
}
