import { ComponentDescription, ComponentWhenToUse } from "../component-prose";
import {
  ComponentApiTables,
  ComponentTokenTable,
} from "../component-reference";
import { BasicDemo } from "../demos/tabs-basic";
import { CardDemo } from "../demos/tabs-card";
import { CenteredDemo } from "../demos/tabs-centered";
import { CustomAddTriggerDemo } from "../demos/tabs-custom-add-trigger";
import { CustomIndicatorDemo } from "../demos/tabs-custom-indicator";
import { DisabledDemo } from "../demos/tabs-disabled";
import { EditableCardDemo } from "../demos/tabs-editable-card";
import { ExtraDemo } from "../demos/tabs-extra";
import { IconDemo } from "../demos/tabs-icon";
import { PositionDemo } from "../demos/tabs-position";
import { SizeDemo } from "../demos/tabs-size";
import { SlideDemo } from "../demos/tabs-slide";
import { Demo, DemoGrid, DocMeta, usePageAnchor } from "../docs-ui";
import reference from "../navigation/tabs.json";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Tabs <span>标签页</span>
      </h1>
      <ComponentDescription component="Tabs" />
      <DocMeta name="Tabs" />
      <ComponentWhenToUse component="Tabs" />
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <DemoGrid component="tabs" columns={reference.demoColumns === 2 ? 2 : 1}>
        <Demo
          id="basic"
          title="基本"
          description={"默认选中第一项。"}
          descriptionMarkdown
          source={() => import("../demos/tabs-basic.tsx?raw")}
        >
          <BasicDemo />
        </Demo>
        <Demo
          id="disabled"
          title="禁用"
          description={"禁用某一项。"}
          descriptionMarkdown
          source={() => import("../demos/tabs-disabled.tsx?raw")}
        >
          <DisabledDemo />
        </Demo>
        <Demo
          id="centered"
          title="居中"
          description={"标签居中展示。"}
          descriptionMarkdown
          source={() => import("../demos/tabs-centered.tsx?raw")}
        >
          <CenteredDemo />
        </Demo>
        <Demo
          id="icon"
          title="图标"
          description={"有图标的标签。"}
          descriptionMarkdown
          source={() => import("../demos/tabs-icon.tsx?raw")}
        >
          <IconDemo />
        </Demo>
        <Demo
          id="custom-indicator"
          title="指示条"
          description={"设置 `indicator` 属性，自定义指示条宽度和对齐方式。"}
          descriptionMarkdown
          source={() => import("../demos/tabs-custom-indicator.tsx?raw")}
        >
          <CustomIndicatorDemo />
        </Demo>
        <Demo
          id="slide"
          title="滑动"
          description={"可以左右、上下滑动，容纳更多标签。"}
          descriptionMarkdown
          source={() => import("../demos/tabs-slide.tsx?raw")}
        >
          <SlideDemo />
        </Demo>
        <Demo
          id="extra"
          title="附加内容"
          description={"可以在页签两边添加附加操作。"}
          descriptionMarkdown
          source={() => import("../demos/tabs-extra.tsx?raw")}
        >
          <ExtraDemo />
        </Demo>
        <Demo
          id="size"
          title="大小"
          description={"大号页签用在页头区域，小号用在弹出框等较狭窄的容器内。"}
          descriptionMarkdown
          source={() => import("../demos/tabs-size.tsx?raw")}
        >
          <SizeDemo />
        </Demo>
        <Demo
          id="position"
          title="位置"
          description={
            '有四个位置，`tabPosition="left|right|top|bottom"`。在移动端下，`left|right` 会自动切换成 `top`。'
          }
          descriptionMarkdown
          source={() => import("../demos/tabs-position.tsx?raw")}
        >
          <PositionDemo />
        </Demo>
        <Demo
          id="card"
          title="卡片式页签"
          description={"另一种样式的页签，不提供对应的垂直样式。"}
          descriptionMarkdown
          source={() => import("../demos/tabs-card.tsx?raw")}
        >
          <CardDemo />
        </Demo>
        <Demo
          id="editable-card"
          title="新增和关闭页签"
          description={
            "只有卡片样式的页签支持新增和关闭选项。使用 `closable={false}` 禁止关闭。"
          }
          descriptionMarkdown
          source={() => import("../demos/tabs-editable-card.tsx?raw")}
        >
          <EditableCardDemo />
        </Demo>
        <Demo
          id="custom-add-trigger"
          title="自定义新增页签触发器"
          description={"隐藏默认的页签增加图标，给自定义触发器绑定事件。"}
          descriptionMarkdown
          source={() => import("../demos/tabs-custom-add-trigger.tsx?raw")}
        >
          <CustomAddTriggerDemo />
        </Demo>
      </DemoGrid>
      <h2 id="api" tabIndex={-1}>
        API
      </h2>
      <ComponentApiTables component="Tabs" sections={reference.api} />
      <h2 id="tokens" tabIndex={-1}>
        主题变量（Design Token）
      </h2>
      <ComponentTokenTable component="Tabs" tokens={reference.tokens} />
    </>
  );
}
