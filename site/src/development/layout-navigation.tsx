// Development-only adaptations of Ant Design 5.29.3 examples (MIT).
import type { ComponentType, ElementDescriptor, OctaneNode } from "octane";
import { isValidElement } from "octane";
import { Demo } from "../docs-ui";
import "./demos.css";

interface Preview {
  iframe?: { demo: string; height: number };
  id: string;
  title: string;
  description: string;
  load: () => Promise<{ default: ComponentType }>;
  source: () => Promise<{ default: string }>;
}

const previews: Record<string, Preview[]> = {
  grid: [
    {
      id: "gutter",
      title: "区块间隔",
      description:
        "栅格常常需要和间隔进行配合，你可以使用 `Row` 的 `gutter` 属性，我们推荐使用 `(16+8n)px` 作为栅格间隔(n 是自然数)。\n\n如果要支持响应式，可以写成 `{ xs: 8, sm: 16, md: 24, lg: 32 }`。\n\n如果需要垂直间距，可以写成数组形式 `[水平间距, 垂直间距]` `[16, { xs: 8, sm: 16, md: 24, lg: 32 }]`。\n\n`Row` 的 `gutter` 属性可以设置为[字符串CSS单位](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Values_and_Units)，例如：`px`、`rem`、`vw`、`vh` 等。",
      load: () => import("./demos/grid/gutter"),
      source: () => import("./demos/grid/gutter.tsx?raw"),
    },
  ],
  divider: [
    {
      id: "size",
      title: "设置分割线的间距大小",
      description: "间距的大小。",
      load: () => import("./demos/divider/size"),
      source: () => import("./demos/divider/size.tsx?raw"),
    },
    {
      id: "variant",
      title: "变体",
      description:
        "分隔线默认为 `solid`（实线）变体。您可以将其更改为 `dashed`（虚线）或 `dotted`（点线）。",
      load: () => import("./demos/divider/variant"),
      source: () => import("./demos/divider/variant.tsx?raw"),
    },
  ],
  splitter: [
    {
      id: "collapsible",
      title: "可折叠",
      description:
        "配置 `collapsible` 提供快捷收缩能力。可以通过 `min` 限制收缩后不能通过拖拽展开。",
      load: () => import("./demos/splitter/collapsible"),
      source: () => import("./demos/splitter/collapsible.tsx?raw"),
    },
    {
      id: "collapsibleIcon",
      title: "可折叠图标显示",
      description:
        "配置 `collapsible.showCollapsibleIcon` 控制可折叠图标的显示方式。",
      load: () => import("./demos/splitter/collapsibleIcon"),
      source: () => import("./demos/splitter/collapsibleIcon.tsx?raw"),
    },
    {
      id: "lazy",
      title: "延迟渲染模式",
      description:
        "延迟渲染模式，拖拽时不会立即更新大小，而是等到松手时才更新。",
      load: () => import("./demos/splitter/lazy"),
      source: () => import("./demos/splitter/lazy.tsx?raw"),
    },
    {
      id: "nested",
      title: "复杂组合",
      description: "复杂组合面板，快捷折叠，禁止改变大小",
      load: () => import("./demos/splitter/group"),
      source: () => import("./demos/splitter/group.tsx?raw"),
    },
    {
      id: "multiple",
      title: "多面板",
      description: "多面板",
      load: () => import("./demos/splitter/multiple"),
      source: () => import("./demos/splitter/multiple.tsx?raw"),
    },
  ],
  breadcrumb: [
    {
      id: "withParams",
      title: "带有参数的",
      description: "带有路由参数的。",
      load: () => import("./demos/breadcrumb/withParams"),
      source: () => import("./demos/breadcrumb/withParams.tsx?raw"),
    },
    {
      id: "overlay",
      title: "带下拉菜单的面包屑",
      description: "面包屑支持下拉菜单。",
      load: () => import("./demos/breadcrumb/overlay"),
      source: () => import("./demos/breadcrumb/overlay.tsx?raw"),
    },
  ],
  dropdown: [
    {
      id: "extra",
      title: "额外节点",
      description: "带有快捷方式的下拉菜单。",
      load: () => import("./demos/dropdown/extra"),
      source: () => import("./demos/dropdown/extra.tsx?raw"),
    },
    {
      id: "arrow",
      title: "箭头",
      description: "可以展示一个箭头。",
      load: () => import("./demos/dropdown/arrow"),
      source: () => import("./demos/dropdown/arrow.tsx?raw"),
    },
    {
      id: "arrow-center",
      title: "箭头指向",
      description:
        "设置 `arrow` 为 `{ pointAtCenter: true }` 后，箭头将指向目标元素的中心。",
      load: () => import("./demos/dropdown/arrow-center"),
      source: () => import("./demos/dropdown/arrow-center.tsx?raw"),
    },
    {
      id: "dropdown-button",
      title: "带下拉框的按钮",
      description:
        "左边是按钮，右边是额外的相关功能菜单。可设置 `icon` 属性来修改右边的图标。",
      load: () => import("./demos/dropdown/dropdown-button"),
      source: () => import("./demos/dropdown/dropdown-button.tsx?raw"),
    },
    {
      id: "custom-dropdown",
      title: "扩展菜单",
      description:
        "使用 `popupRender` 对下拉菜单进行自由扩展。如果你并不需要 Menu 内容，请直接使用 Popover 组件。",
      load: () => import("./demos/dropdown/custom-dropdown"),
      source: () => import("./demos/dropdown/custom-dropdown.tsx?raw"),
    },
    {
      id: "loading",
      title: "加载中状态",
      description:
        "添加 `loading` 属性即可让按钮处于加载状态，最后两个按钮演示点击后进入加载状态。",
      load: () => import("./demos/dropdown/loading"),
      source: () => import("./demos/dropdown/loading.tsx?raw"),
    },
  ],
  menu: [
    {
      id: "inline-collapsed",
      title: "缩起内嵌菜单",
      description:
        "内嵌菜单可以被缩起/展开。\n\n你可以在 [Layout](/components/layout-cn/#layout-demo-side) 里查看侧边布局结合的完整示例。",
      load: () => import("./demos/menu/inline-collapsed"),
      source: () => import("./demos/menu/inline-collapsed.tsx?raw"),
    },
    {
      id: "theme",
      title: "主题",
      description: "内建了两套主题 `light` 和 `dark`，默认 `light`。",
      load: () => import("./demos/menu/theme"),
      source: () => import("./demos/menu/theme.tsx?raw"),
    },
    {
      id: "submenu-theme",
      title: "子菜单主题",
      description:
        "你可以通过 `theme` 属性来设置 SubMenu 的主题从而达到不同目录树下不同主题色的效果。该例子默认为根目录深色，子目录浅色效果。",
      load: () => import("./demos/menu/submenu-theme"),
      source: () => import("./demos/menu/submenu-theme.tsx?raw"),
    },
    {
      id: "switch-mode",
      title: "切换菜单类型",
      description: "展示动态切换模式。",
      load: () => import("./demos/menu/switch-mode"),
      source: () => import("./demos/menu/switch-mode.tsx?raw"),
    },
  ],
  pagination: [
    {
      id: "simple",
      title: "简洁",
      description: "简单的翻页。",
      load: () => import("./demos/pagination/simple"),
      source: () => import("./demos/pagination/simple.tsx?raw"),
    },

    {
      id: "align",
      title: "方向",
      description: "",
      load: () => import("./demos/pagination/align"),
      source: () => import("./demos/pagination/align.tsx?raw"),
    },
  ],
  layout: [
    {
      id: "basic",
      title: "基本结构",
      description: "典型的页面布局。",
      load: () => import("./demos/layout/basic"),
      source: () => import("./demos/layout/basic.tsx?raw"),
    },
    {
      id: "top",
      title: "上中下布局",
      description:
        "最基本的『上-中-下』布局。\n\n一般主导航放置于页面的顶端，从左自右依次为：logo、一级导航项、辅助菜单（用户、设置、通知等）。通常将内容放在固定尺寸（例如：1200px）内，整个页面排版稳定，不受用户终端显示器影响；上下级的结构符合用户上下浏览的习惯，也是较为经典的网站导航模式。页面上下切分的方式提高了主工作区域的信息展示效率，但在纵向空间上会有一些牺牲。此外，由于导航栏水平空间的限制，不适合那些一级导航项很多的信息结构。",
      load: () => import("./demos/layout/top"),
      source: () => import("./demos/layout/top.tsx?raw"),
    },
    {
      id: "top-side",
      title: "顶部-侧边布局",
      description: "拥有顶部导航及侧边栏的页面，多用于展示类网站。",
      load: () => import("./demos/layout/top-side"),
      source: () => import("./demos/layout/top-side.tsx?raw"),
    },
    {
      id: "top-side-2",
      title: "顶部-侧边布局-通栏",
      description:
        "同样拥有顶部导航及侧边栏，区别是两边未留边距，多用于应用型的网站。",
      load: () => import("./demos/layout/top-side-2"),
      source: () => import("./demos/layout/top-side-2.tsx?raw"),
    },
    {
      id: "side",
      title: "侧边布局",
      description:
        "侧边两列式布局。页面横向空间有限时，侧边导航可收起。\n\n侧边导航在页面布局上采用的是左右的结构，一般主导航放置于页面的左侧固定位置，辅助菜单放置于工作区顶部。内容根据浏览器终端进行自适应，能提高横向空间的使用率，但是整个页面排版不稳定。侧边导航的模式层级扩展性强，一、二、三级导航项目可以更为顺畅且具关联性的被展示，同时侧边导航可以固定，使得用户在操作和浏览中可以快速的定位和切换当前位置，有很高的操作效率。但这类导航横向页面内容的空间会被牺牲一部分。\n\n> 🛎️ 想要 3 分钟实现？试试 [ProLayout](https://procomponents.ant.design/components/layout)！",
      load: () => import("./demos/layout/side"),
      source: () => import("./demos/layout/side.tsx?raw"),
      iframe: { demo: "development/layout/side", height: 360 },
    },
    {
      id: "responsive",
      title: "响应式布局",
      description:
        "Layout.Sider 支持响应式布局。\n\n> 说明：配置 `breakpoint` 属性即生效，视窗宽度小于 `breakpoint` 时 Sider 缩小为 `collapsedWidth` 宽度，若将 `collapsedWidth` 设置为 0，会出现特殊 trigger。",
      load: () => import("./demos/layout/responsive"),
      source: () => import("./demos/layout/responsive.tsx?raw"),
    },
    {
      id: "fixed",
      title: "固定头部",
      description: "一般用于固定顶部导航，方便页面切换。",
      load: () => import("./demos/layout/fixed"),
      source: () => import("./demos/layout/fixed.tsx?raw"),
      iframe: { demo: "development/layout/fixed", height: 360 },
    },
    {
      id: "fixed-sider",
      title: "固定侧边栏",
      description: "当内容较长时，使用固定侧边栏可以提供更好的体验。",
      load: () => import("./demos/layout/fixed-sider"),
      source: () => import("./demos/layout/fixed-sider.tsx?raw"),
      iframe: { demo: "development/layout/fixed-sider", height: 360 },
    },

    {
      id: "custom-trigger",
      title: "自定义触发器",
      description:
        "要使用自定义触发器，可以设置 `trigger={null}` 来隐藏默认设定。",
      load: () => import("./demos/layout/custom-trigger"),
      source: () => import("./demos/layout/custom-trigger.tsx?raw"),
    },
  ],
};

const order: Record<string, string[]> = {
  divider: ["basic", "orientation", "size", "plain", "vertical", "variant"],
  flex: ["basic", "alignment", "gap", "wrapping", "combination"],
  grid: [
    "basic",
    "gutter",
    "offset",
    "sort",
    "flex",
    "flex-align",
    "flex-order",
    "flex-stretch",
    "responsive",
    "responsive-flex",
    "responsive-more",
    "playground",
    "useBreakpoint",
  ],
  layout: [
    "basic",
    "top",
    "top-side",
    "top-side-2",
    "side",
    "custom-trigger",
    "responsive",
    "fixed",
    "fixed-sider",
  ],
  space: [
    "basic",
    "vertical",
    "sizes",
    "alignment",
    "layout",
    "split",
    "compact",
    "compact-buttons",
    "compact-vertical",
  ],
  splitter: [
    "basic",
    "controlled",
    "more",
    "collapsible",
    "collapsibleIcon",
    "multiple",
    "nested",
    "lazy",
  ],
  anchor: [
    "basic",
    "horizontal",
    "static",
    "onClick",
    "customizeHighlight",
    "targetOffset",
    "onChange",
    "replace",
  ],
  breadcrumb: [
    "basic",
    "withIcon",
    "withParams",
    "separator",
    "overlay",
    "separator-component",
  ],
  dropdown: [
    "basic",
    "extra",
    "placement",
    "arrow",
    "item",
    "arrow-center",
    "trigger",
    "event",
    "dropdown-button",
    "custom-dropdown",
    "sub-menu",
    "overlay-open",
    "context-menu",
    "loading",
    "selectable",
  ],
  menu: [
    "horizontal",
    "inline",
    "inline-collapsed",
    "sider-current",
    "vertical",
    "theme",
    "submenu-theme",
    "switch-mode",
  ],
  pagination: [
    "basic",
    "align",
    "more",
    "changer",
    "jump",
    "mini",
    "simple",
    "controlled",
    "total",
    "all",
    "itemRender",
  ],
};

export async function augmentExamples(
  component: string,
  examples: OctaneNode[],
) {
  const definitions = previews[component] ?? [];
  const loaded = await Promise.all(
    definitions.map((definition) => definition.load()),
  );
  const replacements = definitions.map((definition, index) => {
    const Component = loaded[index].default;
    return (
      <Demo
        id={definition.id}
        title={definition.title}
        description={definition.description}
        descriptionMarkdown
        source={definition.source}
        iframe={definition.iframe}
      >
        <Component />
      </Demo>
    ) as ElementDescriptor<{ id?: string }>;
  });
  const byId = new Map(
    examples
      .filter((example): example is ElementDescriptor<{ id?: string }> =>
        isValidElement(example),
      )
      .map((example) => [String(example.props.id), example]),
  );
  for (const example of replacements)
    byId.set(String(example.props.id), example);
  return (order[component] ?? [...byId.keys()]).flatMap((id) => {
    const example = byId.get(id);
    return example ? [example] : [];
  });
}

export function loadIsolatedExample(name: string) {
  const [component, id] = name.split("/");
  return previews[component]?.find((example) => example.id === id)?.load();
}
