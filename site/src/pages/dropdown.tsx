import { ComponentDescription, ComponentWhenToUse } from "../component-prose";
import {
  ComponentApiTables,
  ComponentTokenTable,
} from "../component-reference";
import Demo0 from "../demos/dropdown/basic";
import Demo7 from "../demos/dropdown/context-menu";
import Demo4 from "../demos/dropdown/event";
import Demo2 from "../demos/dropdown/item";
import Demo6 from "../demos/dropdown/overlay-open";
import Demo1 from "../demos/dropdown/placement";
import Demo8 from "../demos/dropdown/selectable";
import Demo5 from "../demos/dropdown/sub-menu";
import Demo3 from "../demos/dropdown/trigger";
import { Demo, DemoGrid, DocMeta, usePageAnchor } from "../docs-ui";
import reference from "../navigation/dropdown.json";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Dropdown <span>下拉菜单</span>
      </h1>
      <ComponentDescription component="Dropdown" />
      <DocMeta name="Dropdown" />
      <ComponentWhenToUse component="Dropdown" />
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <DemoGrid
        component="dropdown"
        columns={reference.demoColumns === 2 ? 2 : 1}
      >
        <Demo
          id="basic"
          title="基本"
          description={"最简单的下拉菜单。"}
          descriptionMarkdown
          source={() => import("../demos/dropdown/basic.tsx?raw")}
        >
          <Demo0 />
        </Demo>
        <Demo
          id="placement"
          title="弹出位置"
          description={"支持 6 个弹出位置。"}
          descriptionMarkdown
          source={() => import("../demos/dropdown/placement.tsx?raw")}
        >
          <Demo1 />
        </Demo>
        <Demo
          id="item"
          title="其他元素"
          description={"分割线和不可用菜单项。"}
          descriptionMarkdown
          source={() => import("../demos/dropdown/item.tsx?raw")}
        >
          <Demo2 />
        </Demo>
        <Demo
          id="trigger"
          title="触发方式"
          description={"默认是移入触发菜单，可以点击触发。"}
          descriptionMarkdown
          source={() => import("../demos/dropdown/trigger.tsx?raw")}
        >
          <Demo3 />
        </Demo>
        <Demo
          id="event"
          title="触发事件"
          description={
            "点击菜单项后会触发事件，用户可以通过相应的菜单项 key 进行不同的操作。"
          }
          descriptionMarkdown
          source={() => import("../demos/dropdown/event.tsx?raw")}
        >
          <Demo4 />
        </Demo>
        <Demo
          id="sub-menu"
          title="多级菜单"
          description={"传入的菜单里有多个层级。"}
          descriptionMarkdown
          source={() => import("../demos/dropdown/sub-menu.tsx?raw")}
        >
          <Demo5 />
        </Demo>
        <Demo
          id="overlay-open"
          title="菜单隐藏方式"
          description={"默认是点击关闭菜单，可以关闭此功能。"}
          descriptionMarkdown
          source={() => import("../demos/dropdown/overlay-open.tsx?raw")}
        >
          <Demo6 />
        </Demo>
        <Demo
          id="context-menu"
          title="右键菜单"
          description={
            "默认是移入触发菜单，可以点击鼠标右键触发。弹出菜单位置会跟随右键点击位置变动。"
          }
          descriptionMarkdown
          source={() => import("../demos/dropdown/context-menu.tsx?raw")}
        >
          <Demo7 />
        </Demo>
        <Demo
          id="selectable"
          title="菜单可选选择"
          description={"添加 `menu` 中的 `selectable` 属性可以开启选择能力。"}
          descriptionMarkdown
          source={() => import("../demos/dropdown/selectable.tsx?raw")}
        >
          <Demo8 />
        </Demo>
      </DemoGrid>
      <h2 id="api" tabIndex={-1}>
        API
      </h2>
      <ComponentApiTables component="Dropdown" sections={reference.api} />
      <h2 id="tokens" tabIndex={-1}>
        主题变量（Design Token）
      </h2>
      <ComponentTokenTable component="Dropdown" tokens={reference.tokens} />
    </>
  );
}
