import { theme } from "antd-octane";
import {
  ComponentDescription,
  ComponentProse,
  ComponentWhenToUse,
} from "../component-prose";
import {
  ComponentApiTables,
  ComponentTokenTable,
} from "../component-reference";
import { AlignmentDemo } from "../demos/grid-alignment";
import { BasicDemo } from "../demos/grid-basic";
import { BreakpointDemo } from "../demos/grid-breakpoint";
import { FlexDemo } from "../demos/grid-flex";
import { FlexFillDemo } from "../demos/grid-flex-fill";
import { OffsetDemo } from "../demos/grid-offset";
import { OrderingDemo } from "../demos/grid-ordering";
import { PlaygroundDemo } from "../demos/grid-playground";
import { ResponsiveDemo } from "../demos/grid-responsive";
import { ResponsiveFlexDemo } from "../demos/grid-responsive-flex";
import { ResponsiveMoreDemo } from "../demos/grid-responsive-more";
import { SortDemo } from "../demos/grid-sort";
import { SpacingDemo } from "../demos/grid-spacing";
import "../demos/grid-demo.css";
import { Demo, DemoGrid, DocMeta, usePageAnchor } from "../docs-ui";
import reference from "../layout/grid.json";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  const { token } = theme.useToken();
  return (
    <div
      className="grid-demo"
      style={{
        "--grid-demo-primary": token.colorPrimary,
        "--grid-demo-padding": `${token.padding}px`,
        "--grid-demo-margin": `${token.marginXS}px`,
      }}
    >
      <h1>
        Grid <span>栅格</span>
      </h1>
      <ComponentDescription component="Grid" />
      <DocMeta name="Grid" />
      <ComponentWhenToUse component="Grid" />
      <ComponentProse component="Grid" part="beforeExamples" />
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <DemoGrid component="grid" columns={reference.demoColumns === 2 ? 2 : 1}>
        <Demo
          id="basic"
          title="基础栅格"
          description={
            "从堆叠到水平排列。\n\n使用单一的一组 `Row` 和 `Col` 栅格组件，就可以创建一个基本的栅格系统，所有列（Col）必须放在 `Row` 内。"
          }
          descriptionMarkdown
          source={() => import("../demos/grid-basic.tsx?raw")}
        >
          <BasicDemo />
        </Demo>
        <Demo
          id="gutter"
          title="区块间隔"
          description={
            "栅格常常需要和间隔进行配合，你可以使用 `Row` 的 `gutter` 属性，我们推荐使用 `(16+8n)px` 作为栅格间隔(n 是自然数)。\n\n如果要支持响应式，可以写成 `{ xs: 8, sm: 16, md: 24, lg: 32 }`。\n\n如果需要垂直间距，可以写成数组形式 `[水平间距, 垂直间距]` `[16, { xs: 8, sm: 16, md: 24, lg: 32 }]`。"
          }
          descriptionMarkdown
          source={() => import("../demos/grid-spacing.tsx?raw")}
        >
          <SpacingDemo />
        </Demo>
        <Demo
          id="offset"
          title="左右偏移"
          description={
            "列偏移。\n\n使用 `offset` 可以将列向右侧偏。例如，`offset={4}` 将元素向右侧偏移了 4 个列（column）的宽度。"
          }
          descriptionMarkdown
          source={() => import("../demos/grid-offset.tsx?raw")}
        >
          <OffsetDemo />
        </Demo>
        <Demo
          id="sort"
          title="栅格排序"
          description={
            "列排序。\n\n通过使用 `push` 和 `pull` 类就可以很容易的改变列（column）的顺序。"
          }
          descriptionMarkdown
          source={() => import("../demos/grid-sort.tsx?raw")}
        >
          <SortDemo />
        </Demo>
        <Demo
          id="flex"
          title="排版"
          description={
            "布局基础。\n\n子元素根据不同的值 `start`、`center`、`end`、`space-between`、`space-around` 和 `space-evenly`，分别定义其在父节点里面的排版方式。"
          }
          descriptionMarkdown
          source={() => import("../demos/grid-flex.tsx?raw")}
        >
          <FlexDemo />
        </Demo>
        <Demo
          id="flex-align"
          title="对齐"
          description={"子元素垂直对齐。"}
          descriptionMarkdown
          source={() => import("../demos/grid-alignment.tsx?raw")}
        >
          <AlignmentDemo />
        </Demo>
        <Demo
          id="flex-order"
          title="排序"
          description={"通过 `order` 来改变元素的排序。"}
          descriptionMarkdown
          source={() => import("../demos/grid-ordering.tsx?raw")}
        >
          <OrderingDemo />
        </Demo>
        <Demo
          id="flex-stretch"
          title="Flex 填充"
          description={"Col 提供 `flex` 属性以支持填充。"}
          descriptionMarkdown
          source={() => import("../demos/grid-flex-fill.tsx?raw")}
        >
          <FlexFillDemo />
        </Demo>
        <Demo
          id="responsive"
          title="响应式布局"
          description={
            "参照 Bootstrap 的 [响应式设计](http://getbootstrap.com/css/#grid-media-queries)，预设六个响应尺寸：`xs` `sm` `md` `lg` `xl` `xxl`。"
          }
          descriptionMarkdown
          source={() => import("../demos/grid-responsive.tsx?raw")}
        >
          <ResponsiveDemo />
        </Demo>
        <Demo
          id="responsive-flex"
          title="Flex 响应式布局"
          description={
            "支持更灵活的响应式下的任意 flex 比例，该功能需要浏览器支持 CSS Variables。"
          }
          descriptionMarkdown
          source={() => import("../demos/grid-responsive-flex.tsx?raw")}
        >
          <ResponsiveFlexDemo />
        </Demo>
        <Demo
          id="responsive-more"
          title="其他属性的响应式"
          description={
            "`span` `pull` `push` `offset` `order` 属性可以通过内嵌到 `xs` `sm` `md` `lg` `xl` `xxl` 属性中来使用。\n\n其中 `xs={6}` 相当于 `xs={{ span: 6 }}`。"
          }
          descriptionMarkdown
          source={() => import("../demos/grid-responsive-more.tsx?raw")}
        >
          <ResponsiveMoreDemo />
        </Demo>
        <Demo
          id="playground"
          title="栅格配置器"
          description={"可以简单配置几种等分栅格和间距。"}
          descriptionMarkdown
          source={() => import("../demos/grid-playground.tsx?raw")}
        >
          <PlaygroundDemo />
        </Demo>
        <Demo
          id="useBreakpoint"
          title="useBreakpoint Hook"
          description={
            "使用 `useBreakpoint` Hook 个性化布局，其中 `xs` 仅当满足最小宽度时生效。"
          }
          descriptionMarkdown
          source={() => import("../demos/grid-breakpoint.tsx?raw")}
        >
          <BreakpointDemo />
        </Demo>
      </DemoGrid>
      <h2 id="api" tabIndex={-1}>
        API
      </h2>
      <ComponentApiTables component="Grid" sections={reference.api} />
      <h2 id="tokens" tabIndex={-1}>
        主题变量（Design Token）
      </h2>
      <ComponentTokenTable component="Grid" tokens={reference.tokens} />
    </div>
  );
}
