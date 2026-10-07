import { BasicDemo, MoreDemo } from "../demos/splitter-basic";
import { ControlledDemo } from "../demos/splitter-controlled";
import { MultipleDemo } from "../demos/splitter-multiple";
import { NestedDemo } from "../demos/splitter-nested";
import { ResizableDemo } from "../demos/splitter-resizable";
import { ApiTable, Demo, DocMeta, usePageAnchor } from "../docs-ui";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Splitter <span>分隔面板</span>
        <small>Alpha</small>
      </h1>
      <p className="lead">通过拖拽或键盘，为不同内容区域分配空间。</p>
      <DocMeta name="Splitter" />
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <div className="demo-grid">
        <Demo
          id="basic"
          title="基础拖拽与尺寸约束"
          description="拖动分隔线调整大小；min 和 max 同时支持像素与百分比。"
          source={() => import("../demos/splitter-basic.tsx?raw")}
        >
          <BasicDemo />
        </Demo>
        <Demo
          id="more"
          title="垂直方向"
          description="layout=vertical 将面板沿纵向排列，使用上下方向键调整。"
          source={() => import("../demos/splitter-basic.tsx?raw")}
        >
          <MoreDemo />
        </Demo>
        <Demo
          id="controlled"
          title="受控模式"
          description="onResize 返回像素尺寸，应用同步维护全部 Panel.size；外部按钮可重置比例。"
          source={() => import("../demos/splitter-controlled.tsx?raw")}
        >
          <ControlledDemo />
        </Demo>
        <Demo
          id="multiple"
          title="多面板"
          description="三块面板按初始比例分配空间，每条分隔线只调整相邻面板。"
          source={() => import("../demos/splitter-multiple.tsx?raw")}
        >
          <MultipleDemo />
        </Demo>
        <Demo
          id="nested"
          title="复杂组合"
          description="在 Panel 内嵌套另一个 Splitter，组成不同方向的区域。"
          source={() => import("../demos/splitter-nested.tsx?raw")}
        >
          <NestedDemo />
        </Demo>
        <Demo
          id="resizable"
          title="禁用调整"
          description="resizable=false 禁止相邻分隔线的鼠标与键盘调整。"
          source={() => import("../demos/splitter-resizable.tsx?raw")}
        >
          <ResizableDemo />
        </Demo>
      </div>
      <h2 id="api" tabIndex={-1}>
        API
      </h2>
      <ApiTable
        rows={[
          ["layout", "分隔方向", "horizontal | vertical", "horizontal"],
          [
            "onResizeStart / onResize / onResizeEnd",
            "开始、调整、结束时的像素尺寸数组",
            "(sizes: number[]) => void",
            "—",
          ],
          [
            "Panel.size / defaultSize",
            "受控 / 初始尺寸；数字为px，字符串支持百分比",
            "number | string",
            "自动分配",
          ],
          ["Panel.min / max", "最小 / 最大尺寸", "number | string", "0 / 不限"],
          [
            "Panel.resizable",
            "是否允许调整；相邻任一禁用时不可拖动",
            "boolean",
            "true",
          ],
        ]}
      />
      <h2 id="tokens" tabIndex={-1}>
        主题与支持范围
      </h2>
      <p>
        支持
        Splitter.splitBarSize、splitTriggerSize、splitBarDraggableSize、resizeSpinnerSize
        与全局颜色主题。子节点仅支持直接的
        Splitter.Panel，允许数组形式；不支持自定义组件包裹
        Panel。暂不支持折叠、lazy、RTL 和完整拖拽动画。方向键每次调整
        10px，Shift 为 1px，Home/End 到达约束边界。
      </p>
      <p>
        容器必须有可测量的宽高。尺寸约束应能共同满足容器大小；不兼容的 min/max
        或受控尺寸总和可能产生剩余空间或溢出。建议所有面板统一受控或非受控，受控时在
        onResize 中同时更新尺寸数组。
      </p>
    </>
  );
}
