import { AlignmentDemo } from "../demos/grid-alignment";
import { BasicDemo, MoreDemo } from "../demos/grid-basic";
import { FlexFillDemo } from "../demos/grid-flex-fill";
import { OffsetDemo } from "../demos/grid-offset";
import { OrderingDemo } from "../demos/grid-ordering";
import { SpacingDemo } from "../demos/grid-spacing";
import { ApiTable, Demo, DocMeta, usePageAnchor } from "../docs-ui";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Grid <span>栅格</span>
        <small>Alpha</small>
      </h1>
      <p className="lead">通过 24 栅格系统组织内容，支持响应式断点和间距。</p>
      <DocMeta name="Grid" />
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <div className="demo-grid">
        <Demo
          id="basic"
          title="基础栅格"
          description="将一行分为 24 份，通过 span 设置列宽，gutter 设置列间距。"
          source={() => import("../demos/grid-basic.tsx?raw")}
        >
          <BasicDemo />
        </Demo>
        <Demo
          id="more"
          title="响应式布局"
          description="缩小窗口查看单列布局；md 及以上显示两列，同时展示当前匹配的断点。"
          source={() => import("../demos/grid-basic.tsx?raw")}
        >
          <MoreDemo />
        </Demo>
        <Demo
          id="gutter"
          title="区块间隔"
          description="gutter 数组分别设置横向与纵向间距，调整滑块观察变化。"
          source={() => import("../demos/grid-spacing.tsx?raw")}
        >
          <SpacingDemo />
        </Demo>
        <Demo
          id="offset"
          title="左右偏移"
          description="offset 留出指定栅格宽度，列宽与偏移量共同占用 24 格。"
          source={() => import("../demos/grid-offset.tsx?raw")}
        >
          <OffsetDemo />
        </Demo>
        <Demo
          id="order"
          title="排序"
          description="order 调整视觉顺序，点击按钮切换正序与倒序。"
          source={() => import("../demos/grid-ordering.tsx?raw")}
        >
          <OrderingDemo />
        </Demo>
        <Demo
          id="alignment"
          title="对齐"
          description="Row.align 控制不同高度列的对齐位置，justify 控制主轴分布。"
          source={() => import("../demos/grid-alignment.tsx?raw")}
        >
          <AlignmentDemo />
        </Demo>
        <Demo
          id="flex-fill"
          title="Flex 填充"
          description="固定宽度与自适应列组合，也可按数字比例分配空间。"
          source={() => import("../demos/grid-flex-fill.tsx?raw")}
        >
          <FlexFillDemo />
        </Demo>
      </div>
      <h2 id="api" tabIndex={-1}>
        API
      </h2>
      <ApiTable
        rows={[
          [
            "Row.gutter",
            "横向或 [横向, 纵向] 间距",
            "number | Responsive<number> | [gutter, gutter]",
            "0",
          ],
          [
            "Row.align / justify / wrap",
            "交叉轴、主轴对齐与换行",
            "string | Responsive<string> / boolean",
            "top / start / true",
          ],
          [
            "Col.span / offset / order / push / pull",
            "列宽、偏移与顺序",
            "number",
            "—",
          ],
          ["Col.flex", "弹性比例或长度", "number | string", "—"],
          ["Col.xs…xxl", "断点下列配置", "number | ColSize", "—"],
          ["Grid.useBreakpoint()", "读取当前匹配的断点", "Screens", "—"],
        ]}
      />
      <h2 id="tokens" tabIndex={-1}>
        主题与支持范围
      </h2>
      <p>
        断点消费全局 screen token；Row 内所有 Col
        共享一次断点订阅，卸载时释放监听。仅提供浏览器端布局；暂不支持自定义
        gutter CSS 字符串、SSR 预计算与 Grid 组件 token。
      </p>
    </>
  );
}
