import { AlignmentDemo } from "../demos/flex-alignment";
import { BasicDemo } from "../demos/flex-basic";
import { CrossAxisDemo } from "../demos/flex-cross-axis";
import { GapControlDemo } from "../demos/flex-gap-control";
import { WrappingDemo } from "../demos/flex-wrapping";
import { ApiTable, Demo, DocMeta, usePageAnchor } from "../docs-ui";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Flex <span>弹性布局</span>
        <small>Alpha</small>
      </h1>
      <p className="lead">
        无需额外子元素包装，控制行列方向、对齐、换行和间距。
      </p>
      <DocMeta name="Flex" />
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <div className="demo-grid">
        <Demo
          id="basic"
          title="基本使用"
          description="组合纵向与横向布局，不需要为子节点加额外包装。"
          source={() => import("../demos/flex-basic.tsx?raw")}
        >
          <BasicDemo />
        </Demo>
        <Demo
          id="alignment"
          title="主轴对齐"
          description="切换 justify，观察项目在主轴上的分布。"
          source={() => import("../demos/flex-alignment.tsx?raw")}
        >
          <AlignmentDemo />
        </Demo>
        <Demo
          id="wrapping"
          title="换行与伸缩"
          description="窄容器里使用 wrap；子项可用原生 CSS flex 控制伸缩。"
          source={() => import("../demos/flex-wrapping.tsx?raw")}
        >
          <WrappingDemo />
        </Demo>
        <Demo
          id="cross-axis"
          title="交叉轴对齐"
          description="对照上游对齐方式案例，切换 align 观察不同高度项目的位置与拉伸。"
          source={() => import("../demos/flex-cross-axis.tsx?raw")}
        >
          <CrossAxisDemo />
        </Demo>
        <Demo
          id="gap"
          title="设置间隙"
          description="gap 可使用预设尺寸或自定义像素值；拖动滑块调整间距。"
          source={() => import("../demos/flex-gap-control.tsx?raw")}
        >
          <GapControlDemo />
        </Demo>
      </div>
      <h2 id="api" tabIndex={-1}>
        API
      </h2>
      <ApiTable
        rows={[
          ["vertical", "使用纵向布局", "boolean", "false"],
          ["wrap", "换行设置", "boolean | CSS flex-wrap", "false"],
          ["justify / align", "主轴 / 交叉轴对齐", "CSS 属性值", "—"],
          [
            "gap",
            "间距；数字为像素",
            "small | middle | large | number | string",
            "—",
          ],
          ["flex", "自身弹性比例", "CSS flex", "—"],
        ]}
      />
      <h2 id="tokens" tabIndex={-1}>
        主题与支持范围
      </h2>
      <p>
        gap 的预设值随全局 paddingXS / padding / paddingLG 变化。支持 className
        和 style；暂不支持 component 自定义根节点和组件级 token。
      </p>
      <p>
        Flex 直接排列子节点，适合需要响应式换行或弹性占位的区域。
        子项自身的伸缩行为请通过子项的 CSS flex 与 minWidth 设置。
      </p>
    </>
  );
}
