import { ComponentDescription, ComponentWhenToUse } from "../component-prose";
import {
  ComponentApiTables,
  ComponentTokenTable,
} from "../component-reference";
import { AlignmentDemo } from "../demos/flex-alignment";
import { BasicDemo } from "../demos/flex-basic";
import { CombinationDemo } from "../demos/flex-combination";
import { GapControlDemo } from "../demos/flex-gap-control";
import { WrappingDemo } from "../demos/flex-wrapping";
import { Demo, DemoGrid, DocMeta, usePageAnchor } from "../docs-ui";
import reference from "../layout/flex.json";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Flex <span>弹性布局</span>
      </h1>
      <ComponentDescription component="Flex" />
      <DocMeta name="Flex" />
      <ComponentWhenToUse component="Flex" />
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <DemoGrid component="flex" columns={reference.demoColumns === 2 ? 2 : 1}>
        <Demo
          id="basic"
          title="基本布局"
          description="最简单的用法。"
          source={() => import("../demos/flex-basic.tsx?raw")}
        >
          <BasicDemo />
        </Demo>
        <Demo
          id="alignment"
          title="对齐方式"
          description="设置对齐方式。"
          source={() => import("../demos/flex-alignment.tsx?raw")}
        >
          <AlignmentDemo />
        </Demo>
        <Demo
          id="gap"
          title="设置间隙"
          descriptionMarkdown
          description="使用 `gap` 设置元素之间的间距，预设了 `small`、`middle`、`large` 三种尺寸，也可以自定义间距。"
          source={() => import("../demos/flex-gap-control.tsx?raw")}
        >
          <GapControlDemo />
        </Demo>
        <Demo
          id="wrapping"
          title="自动换行"
          description="自动换行。"
          source={() => import("../demos/flex-wrapping.tsx?raw")}
        >
          <WrappingDemo />
        </Demo>
        <Demo
          id="combination"
          title="组合使用"
          description="嵌套使用，可以实现更复杂的布局。"
          source={() => import("../demos/flex-combination.tsx?raw")}
        >
          <CombinationDemo />
        </Demo>
      </DemoGrid>
      <h2 id="api" tabIndex={-1}>
        API
      </h2>
      <ComponentApiTables component="Flex" sections={reference.api} />
      <h2 id="tokens" tabIndex={-1}>
        主题变量（Design Token）
      </h2>
      <ComponentTokenTable component="Flex" tokens={reference.tokens} />
    </>
  );
}
