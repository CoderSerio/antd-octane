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
