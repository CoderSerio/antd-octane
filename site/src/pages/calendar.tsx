import { ComponentWhenToUse } from "../component-prose";
import {
  ComponentApiTables,
  ComponentTokenTable,
} from "../component-reference";
import reference from "../data-display/calendar.json";
import {
  BasicDemo,
  CardDemo,
  CustomHeaderDemo,
  LunarDemo,
  NoticeDemo,
  SelectDemo,
  WeekDemo,
} from "../demos/calendar-basic";
import { Demo, DemoGrid, DocMeta, usePageAnchor } from "../docs-ui";

export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Calendar <span>日历</span>
      </h1>
      <p className="lead">按照日历形式展示数据的容器。</p>
      <DocMeta name="Calendar" />
      <ComponentWhenToUse component="Calendar" />
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <DemoGrid>
        <div style={{ gridColumn: "1 / -1", minWidth: 0 }}>
          <Demo
            id="basic"
            title={"基本"}
            description={"一个通用的日历面板，支持年/月切换。"}
            descriptionMarkdown
            source={() => import("../demos/calendar-basic.tsx?raw")}
            sourceExport="BasicDemo"
          >
            <BasicDemo />
          </Demo>
        </div>
        <Demo
          id="notice-calendar"
          title={"通知事项日历"}
          description={
            "一个复杂的应用示例，用 `dateCellRender` 和 `monthCellRender` 函数来自定义需要渲染的数据。"
          }
          descriptionMarkdown
          source={() => import("../demos/calendar-basic.tsx?raw")}
          sourceExport="NoticeDemo"
        >
          <NoticeDemo />
        </Demo>
        <Demo
          id="card"
          title={"卡片模式"}
          description={"用于嵌套在空间有限的容器中。"}
          descriptionMarkdown
          source={() => import("../demos/calendar-basic.tsx?raw")}
          sourceExport="CardDemo"
        >
          <CardDemo />
        </Demo>
        <Demo
          id="select"
          title={"选择功能"}
          description={"一个通用的日历面板，支持年/月切换。"}
          descriptionMarkdown
          source={() => import("../demos/calendar-basic.tsx?raw")}
          sourceExport="SelectDemo"
        >
          <SelectDemo />
        </Demo>
        <Demo
          id="lunar"
          title={"农历日历"}
          description={"展示农历、节气等信息。"}
          descriptionMarkdown
          source={() => import("../demos/calendar-basic.tsx?raw")}
          sourceExport="LunarDemo"
        >
          <LunarDemo />
        </Demo>
        <Demo
          id="week"
          title={"周数"}
          description={
            "通过将 `showWeek` 属性设置为 `true`，在全屏日历中显示周数。"
          }
          descriptionMarkdown
          source={() => import("../demos/calendar-basic.tsx?raw")}
          sourceExport="WeekDemo"
        >
          <WeekDemo />
        </Demo>
        <Demo
          id="customize-header"
          title={"自定义头部"}
          description={"自定义日历头部内容。"}
          descriptionMarkdown
          source={() => import("../demos/calendar-basic.tsx?raw")}
          sourceExport="CustomHeaderDemo"
        >
          <CustomHeaderDemo />
        </Demo>
      </DemoGrid>
      <h2 id="api" tabIndex={-1}>
        API
      </h2>
      <ComponentApiTables component="Calendar" sections={reference.api} />

      <h2 id="tokens" tabIndex={-1}>
        主题变量（Design Token）
      </h2>
      <ComponentTokenTable component="Calendar" tokens={reference.tokens} />
    </>
  );
}
