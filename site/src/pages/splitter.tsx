import { BasicDemo, MoreDemo } from "../demos/splitter-basic";
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
          description="可交互示例，可切换全局主题观察效果。"
          source={() => import("../demos/splitter-basic.tsx?raw")}
        >
          <BasicDemo />
        </Demo>
        <Demo
          id="more"
          title="垂直受控与多面板"
          description="通过按钮改变配置，观察内容和布局的更新。"
          source={() => import("../demos/splitter-basic.tsx?raw")}
        >
          <MoreDemo />
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
