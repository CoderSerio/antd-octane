import { BasicDemo, MoreDemo } from "../demos/skeleton-basic";
import { ElementSizesDemo, LayoutDemo } from "../demos/skeleton-layout";
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
        <Demo
          id="layout"
          title="按内容结构配置"
          description="独立设置头像形状、标题宽度与每行段落宽度；可以切换圆角与动画。"
          source={() => import("../demos/skeleton-layout.tsx?raw")}
        >
          <LayoutDemo />
        </Demo>
        <Demo
          id="element-sizes"
          title="独立占位尺寸"
          description="头像使用数值尺寸，按钮和输入框使用预设尺寸；输入框可撑满容器。"
          source={() => import("../demos/skeleton-layout.tsx?raw")}
        >
          <ElementSizesDemo />
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
            "头像 / 输入框占位，size 支持预设值或数值；Input 支持 block",
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
        独立占位元素仅表达加载形状，不是可点击按钮或可输入控件；请用 loading
        控制 Skeleton 包裹的实际内容。主组件不提供独立 Button/Input 的
        size、block 属性，也暂不支持语义 classNames/styles 配置。
      </p>
    </>
  );
}
