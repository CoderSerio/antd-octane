import { BasicDemo } from "../demos/divider-basic";
import { DashedDemo } from "../demos/divider-dashed";
import { OrientationDemo } from "../demos/divider-orientation";
import { PlainDemo } from "../demos/divider-plain";
import { VerticalDemo } from "../demos/divider-vertical";
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
          title="水平分割线"
          description="用水平线分隔不同章节的内容。"
          source={() => import("../demos/divider-basic.tsx?raw")}
        >
          <BasicDemo />
        </Demo>
        <Demo
          id="orientation"
          title="标题位置与样式"
          description="比较 left、center、right；orientationMargin 设置文字与边缘的距离。"
          source={() => import("../demos/divider-orientation.tsx?raw")}
        >
          <OrientationDemo />
        </Demo>
        <Demo
          id="plain"
          title="正文样式"
          description="plain 让分隔文字使用正文的字号与字重。"
          source={() => import("../demos/divider-plain.tsx?raw")}
        >
          <PlainDemo />
        </Demo>
        <Demo
          id="vertical"
          title="垂直分割线"
          description="分隔同行中的链接和操作。"
          source={() => import("../demos/divider-vertical.tsx?raw")}
        >
          <VerticalDemo />
        </Demo>
        <Demo
          id="dashed"
          title="虚线"
          description="dashed 可用于无文字或带文字的水平分隔线。"
          source={() => import("../demos/divider-dashed.tsx?raw")}
        >
          <DashedDemo />
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
