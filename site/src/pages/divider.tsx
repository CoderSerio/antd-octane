import { BasicDemo } from "../demos/divider-basic";
import { OrientationDemo } from "../demos/divider-orientation";
import { ApiTable, Demo, DocMeta, usePageAnchor } from "../docs-ui";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Divider <span>分割线</span>
        <small>Alpha</small>
      </h1>
      <p className="lead">分隔内容或行内操作，支持带文字的水平分割线。</p>
      <DocMeta name="Divider" />
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <div className="demo-grid">
        <Demo
          id="basic"
          title="水平与垂直分隔"
          description="用水平线分隔内容，或在行内操作之间使用垂直分隔。"
          source={() => import("../demos/divider-basic.tsx?raw")}
        >
          <BasicDemo />
        </Demo>
        <Demo
          id="orientation"
          title="标题位置与样式"
          description="调整文字位置，并组合 plain、dashed 和 orientationMargin。"
          source={() => import("../demos/divider-orientation.tsx?raw")}
        >
          <OrientationDemo />
        </Demo>
      </div>
      <h2 id="api" tabIndex={-1}>
        API
      </h2>
      <ApiTable
        rows={[
          ["type", "方向", "horizontal | vertical", "horizontal"],
          ["orientation", "文字位置", "left | center | right", "center"],
          ["orientationMargin", "文字侧边距", "number | string", "5%"],
          ["dashed", "虚线", "boolean", "false"],
          ["plain", "正文样式文字", "boolean", "false"],
        ]}
      />
      <h2 id="tokens" tabIndex={-1}>
        主题与支持范围
      </h2>
      <p>
        支持 colorSplit、字体等 alias token 和组件变量
        textPaddingInline、orientationMargin、verticalMarginInline。垂直模式不显示子文字。暂不支持
        size、variant 和新版 titlePlacement API。
      </p>
    </>
  );
}
