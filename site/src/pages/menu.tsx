import {
  ComponentDescription,
  ComponentProse,
  ComponentWhenToUse,
} from "../component-prose";
import {
  ComponentApiTables,
  ComponentTokenTable,
} from "../component-reference";
import Demo0 from "../demos/menu/horizontal";
import Demo1 from "../demos/menu/inline";
import Demo2 from "../demos/menu/sider-current";
import Demo3 from "../demos/menu/vertical";
import { Demo, DemoGrid, DocMeta, usePageAnchor } from "../docs-ui";
import reference from "../navigation/menu.json";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Menu <span>导航菜单</span>
      </h1>
      <ComponentDescription component="Menu" />
      <DocMeta name="Menu" />
      <ComponentWhenToUse component="Menu" />
      <ComponentProse component="Menu" part="beforeExamples" />
      <p>
        上述为 Ant Design 5 的开发者说明。Octane Menu 当前通过{" "}
        <code>items</code>
        配置菜单，尚未提供 <code>Menu.Item</code> 和 HOC 子节点接口。详见
        <a className="reference-link" href="#compatibility">
          兼容说明
        </a>
        。
      </p>
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <DemoGrid component="menu" columns={reference.demoColumns === 2 ? 2 : 1}>
        <Demo
          id="horizontal"
          title={"顶部导航"}
          description={"水平的顶部导航菜单。"}
          descriptionMarkdown
          source={() => import("../demos/menu/horizontal.tsx?raw")}
        >
          <Demo0 />
        </Demo>
        <Demo
          id="inline"
          title={"内嵌菜单"}
          description={"垂直菜单，子菜单内嵌在菜单区域。"}
          descriptionMarkdown
          source={() => import("../demos/menu/inline.tsx?raw")}
        >
          <Demo1 />
        </Demo>
        <Demo
          id="sider-current"
          title={"只展开当前父级菜单"}
          description={"点击菜单，收起其他展开的所有菜单，保持菜单聚焦简洁。"}
          descriptionMarkdown
          source={() => import("../demos/menu/sider-current.tsx?raw")}
        >
          <Demo2 />
        </Demo>
        <Demo
          id="vertical"
          title={"垂直菜单"}
          description={"子菜单是弹出的形式。"}
          descriptionMarkdown
          source={() => import("../demos/menu/vertical.tsx?raw")}
        >
          <Demo3 />
        </Demo>
      </DemoGrid>
      <h2 id="api" tabIndex={-1}>
        API
      </h2>
      <ComponentApiTables component="Menu" sections={reference.api} />
      <h2 id="tokens" tabIndex={-1}>
        主题变量（Design Token）
      </h2>
      <ComponentTokenTable component="Menu" tokens={reference.tokens} />
    </>
  );
}
