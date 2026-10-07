import {
  ComponentDescription,
  ComponentProse,
  ComponentWhenToUse,
} from "../component-prose";
import {
  ComponentApiTables,
  ComponentTokenTable,
} from "../component-reference";
import { BasicDemo } from "../demos/layout-basic";
import { CustomTriggerDemo } from "../demos/layout-custom-trigger";
import FixedDemo from "../demos/layout-fixed";
import FixedSiderDemo from "../demos/layout-fixed-sider";
import ResponsiveDemo from "../demos/layout-responsive";
import SideDemo from "../demos/layout-side";
import TopDemo from "../demos/layout-top";
import TopSideDemo from "../demos/layout-top-side";
import TopSide2Demo from "../demos/layout-top-side-2";
import { Demo, DemoGrid, DocMeta, usePageAnchor } from "../docs-ui";
import reference from "../layout/layout.json";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Layout <span>布局</span>
      </h1>
      <ComponentDescription component="Layout" />
      <DocMeta name="Layout" />
      <ComponentWhenToUse component="Layout" />
      <ComponentProse component="Layout" part="beforeExamples" />
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <DemoGrid
        component="layout"
        columns={reference.demoColumns === 2 ? 2 : 1}
      >
        <Demo
          id="basic"
          title={"基本结构"}
          description={"典型的页面布局。"}
          source={() => import("../demos/layout-basic.tsx?raw")}
          descriptionMarkdown
        >
          <BasicDemo />
        </Demo>
        <Demo
          id="top"
          title={"上中下布局"}
          description={
            "最基本的『上-中-下』布局。\n\n一般主导航放置于页面的顶端，从左自右依次为：logo、一级导航项、辅助菜单（用户、设置、通知等）。通常将内容放在固定尺寸（例如：1200px）内，整个页面排版稳定，不受用户终端显示器影响；上下级的结构符合用户上下浏览的习惯，也是较为经典的网站导航模式。页面上下切分的方式提高了主工作区域的信息展示效率，但在纵向空间上会有一些牺牲。此外，由于导航栏水平空间的限制，不适合那些一级导航项很多的信息结构。"
          }
          source={() => import("../demos/layout-top.tsx?raw")}
          descriptionMarkdown
        >
          <TopDemo />
        </Demo>
        <Demo
          id="top-side"
          title={"顶部-侧边布局"}
          description={"拥有顶部导航及侧边栏的页面，多用于展示类网站。"}
          source={() => import("../demos/layout-top-side.tsx?raw")}
          descriptionMarkdown
        >
          <TopSideDemo />
        </Demo>
        <Demo
          id="top-side-2"
          title={"顶部-侧边布局-通栏"}
          description={
            "同样拥有顶部导航及侧边栏，区别是两边未留边距，多用于应用型的网站。"
          }
          source={() => import("../demos/layout-top-side-2.tsx?raw")}
          descriptionMarkdown
        >
          <TopSide2Demo />
        </Demo>
        <Demo
          id="side"
          title={"侧边布局"}
          description={
            "侧边两列式布局。页面横向空间有限时，侧边导航可收起。\n\n侧边导航在页面布局上采用的是左右的结构，一般主导航放置于页面的左侧固定位置，辅助菜单放置于工作区顶部。内容根据浏览器终端进行自适应，能提高横向空间的使用率，但是整个页面排版不稳定。侧边导航的模式层级扩展性强，一、二、三级导航项目可以更为顺畅且具关联性的被展示，同时侧边导航可以固定，使得用户在操作和浏览中可以快速的定位和切换当前位置，有很高的操作效率。但这类导航横向页面内容的空间会被牺牲一部分。\n\n> 🛎️ 想要 3 分钟实现？试试 [ProLayout](https://procomponents.ant.design/components/layout)！"
          }
          source={() => import("../demos/layout-side.tsx?raw")}
          iframe={{ demo: "layout-side", height: 360 }}
          descriptionMarkdown
        >
          <SideDemo />
        </Demo>
        <Demo
          id="custom-trigger"
          title={"自定义触发器"}
          description={
            "要使用自定义触发器，可以设置 `trigger={null}` 来隐藏默认设定。"
          }
          source={() => import("../demos/layout-custom-trigger.tsx?raw")}
          descriptionMarkdown
        >
          <CustomTriggerDemo />
        </Demo>
        <Demo
          id="responsive"
          title={"响应式布局"}
          description={
            "Layout.Sider 支持响应式布局。\n\n> 说明：配置 `breakpoint` 属性即生效，视窗宽度小于 `breakpoint` 时 Sider 缩小为 `collapsedWidth` 宽度，若将 `collapsedWidth` 设置为 0，会出现特殊 trigger。"
          }
          source={() => import("../demos/layout-responsive.tsx?raw")}
          descriptionMarkdown
        >
          <ResponsiveDemo />
        </Demo>
        <Demo
          id="fixed"
          title={"固定头部"}
          description={"一般用于固定顶部导航，方便页面切换。"}
          source={() => import("../demos/layout-fixed.tsx?raw")}
          iframe={{ demo: "layout-fixed", height: 360 }}
          descriptionMarkdown
        >
          <FixedDemo />
        </Demo>
        <Demo
          id="fixed-sider"
          title={"固定侧边栏"}
          description={"当内容较长时，使用固定侧边栏可以提供更好的体验。"}
          source={() => import("../demos/layout-fixed-sider.tsx?raw")}
          iframe={{ demo: "layout-fixed-sider", height: 360 }}
          descriptionMarkdown
        >
          <FixedSiderDemo />
        </Demo>
      </DemoGrid>
      <h2 id="api" tabIndex={-1}>
        API
      </h2>
      <ComponentApiTables component="Layout" sections={reference.api} />
      <h2 id="tokens" tabIndex={-1}>
        主题变量（Design Token）
      </h2>
      <ComponentTokenTable component="Layout" tokens={reference.tokens} />
    </>
  );
}
