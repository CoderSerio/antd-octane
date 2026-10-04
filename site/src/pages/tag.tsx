import { ComponentWhenToUse } from "../component-prose";
import {
  ComponentApiTables,
  ComponentTokenTable,
} from "../component-reference";
import reference from "../data-display/tag.json";
import {
  AnimationDemo,
  BasicDemo,
  BorderlessDemo,
  ColorsDemo,
  DraggableDemo,
  DynamicDemo,
  IconDemo,
  SelectableDemo,
  StatusDemo,
} from "../demos/tag-basic";
import { Demo, DemoGrid, DocMeta, usePageAnchor } from "../docs-ui";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Tag <span>标签</span>
      </h1>
      <p className="lead">进行标记和分类的小标签。</p>
      <DocMeta name="Tag" />
      <ComponentWhenToUse component="Tag" />
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <DemoGrid>
        <Demo
          id="basic"
          title={"基本"}
          description={
            "基本标签的用法，可以通过设置 `closeIcon` 变为可关闭标签并自定义关闭按钮，设置为 `true` 时将使用默认关闭按钮。可关闭标签具有 `onClose` 事件。"
          }
          descriptionMarkdown
          source={() => import("../demos/tag-basic.tsx?raw")}
          sourceExport="BasicDemo"
        >
          <BasicDemo />
        </Demo>
        <Demo
          id="colorful"
          title={"多彩标签"}
          description={
            "我们添加了多种预设色彩的标签样式，用作不同场景使用。如果预设值不能满足你的需求，可以设置为具体的色值。"
          }
          descriptionMarkdown
          source={() => import("../demos/tag-basic.tsx?raw")}
          sourceExport="ColorsDemo"
        >
          <ColorsDemo />
        </Demo>
        <Demo
          id="control"
          title={"动态添加和删除"}
          description={"用数组生成一组标签，可以动态添加和删除。"}
          descriptionMarkdown
          source={() => import("../demos/tag-basic.tsx?raw")}
          sourceExport="DynamicDemo"
        >
          <DynamicDemo />
        </Demo>
        <Demo
          id="checkable"
          title={"可选择标签"}
          description={
            "可通过 `CheckableTag` 实现类似 Checkbox 的效果，点击切换选中效果。\n\n> 该组件为完全受控组件，不支持非受控用法。"
          }
          descriptionMarkdown
          source={() => import("../demos/tag-basic.tsx?raw")}
          sourceExport="SelectableDemo"
        >
          <SelectableDemo />
        </Demo>
        <Demo
          id="animation"
          title={"添加动画"}
          description={"添加和删除标签时保留过渡效果。"}
          descriptionMarkdown
          source={() => import("../demos/tag-basic.tsx?raw")}
          sourceExport="AnimationDemo"
        >
          <AnimationDemo />
        </Demo>
        <Demo
          id="icon"
          title={"图标按钮"}
          description={
            "你可以通过 `icon` 属性为标签添加自定义图标。\n\n若需要控制图标的位置，请在 `children` 中直接使用 `<XXXIcon />` 组件，而非通过 `icon` 属性实现。"
          }
          descriptionMarkdown
          source={() => import("../demos/tag-basic.tsx?raw")}
          sourceExport="IconDemo"
        >
          <IconDemo />
        </Demo>
        <Demo
          id="status"
          title={"预设状态的标签"}
          description={
            "预设五种状态颜色，可以通过设置 `color` 为 `success`、 `processing`、`error`、`default`、`warning` 来代表不同的状态。"
          }
          descriptionMarkdown
          source={() => import("../demos/tag-basic.tsx?raw")}
          sourceExport="StatusDemo"
        >
          <StatusDemo />
        </Demo>
        <Demo
          id="borderless"
          title={"无边框"}
          description={"无边框模式。"}
          descriptionMarkdown
          source={() => import("../demos/tag-basic.tsx?raw")}
          sourceExport="BorderlessDemo"
        >
          <BorderlessDemo />
        </Demo>
        <Demo
          id="draggable"
          title={"可拖拽标签"}
          description={"使用 [dnd kit](https://dndkit.com) 实现的可拖拽标签。"}
          descriptionMarkdown
          source={() => import("../demos/tag-basic.tsx?raw")}
          sourceExport="DraggableDemo"
        >
          <DraggableDemo />
        </Demo>
      </DemoGrid>
      <h2 id="api" tabIndex={-1}>
        API
      </h2>
      <ComponentApiTables component="Tag" sections={reference.api} />

      <h2 id="tokens" tabIndex={-1}>
        主题变量（Design Token）
      </h2>
      <ComponentTokenTable component="Tag" tokens={reference.tokens} />
    </>
  );
}
