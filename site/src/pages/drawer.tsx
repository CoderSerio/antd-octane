import { ComponentWhenToUse } from "../component-prose";
import {
  ReferenceApiTables,
  ReferenceTokenTable,
} from "../component-reference";
import Demo0 from "../demos/drawer/basic-right";
import Demo8 from "../demos/drawer/classNames";
import Demo9 from "../demos/drawer/closable-placement";
import Demo3 from "../demos/drawer/extra";
import Demo10 from "../demos/drawer/form";
import Demo2 from "../demos/drawer/loading";
import Demo6 from "../demos/drawer/multi-level-drawer";
import Demo1 from "../demos/drawer/placement";
import Demo4 from "../demos/drawer/render-in-current";
import Demo7 from "../demos/drawer/size";
import Demo5 from "../demos/drawer/user-profile";
import { Demo, DemoGrid, DocMeta, usePageAnchor } from "../docs-ui";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Drawer <span>抽屉</span>
      </h1>
      <p className="lead">屏幕边缘滑出的浮层面板。</p>
      <DocMeta name="Drawer" />
      <ComponentWhenToUse component="Drawer" />
      <h2 id="examples">代码演示</h2>
      <DemoGrid>
        <Demo
          id={"basic-right"}
          title={"基础抽屉"}
          description={"基础抽屉，点击触发按钮抽屉从右滑出，点击遮罩区关闭。"}
          descriptionMarkdown
          source={() => import("../demos/drawer/basic-right.tsx?raw")}
        >
          <Demo0 />
        </Demo>
        <Demo
          id={"placement"}
          title={"自定义位置"}
          description={
            "自定义位置，点击触发按钮抽屉从相应的位置滑出，点击遮罩区关闭。"
          }
          descriptionMarkdown
          source={() => import("../demos/drawer/placement.tsx?raw")}
        >
          <Demo1 />
        </Demo>
        <Demo
          id={"loading"}
          title={"加载中"}
          description={"设置抽屉加载状态。"}
          descriptionMarkdown
          source={() => import("../demos/drawer/loading.tsx?raw")}
        >
          <Demo2 />
        </Demo>
        <Demo
          id={"extra"}
          title={"额外操作"}
          description={
            "在 Ant Design 规范中，操作按钮建议放在抽屉的右上角，可以使用 `extra` 属性来实现。"
          }
          descriptionMarkdown
          source={() => import("../demos/drawer/extra.tsx?raw")}
        >
          <Demo3 />
        </Demo>
        <Demo
          id={"render-in-current"}
          title={"渲染在当前 DOM"}
          description={
            "渲染在当前 dom 里。自定义容器，查看 `getContainer`。\n\n> 注意：`style` 与 `className` 配置 Drawer 面板样式，与 Modal 保持一致。最外层元素样式通过 `rootStyle` 与 `rootClassName` 配置。\n\n> 当 `getContainer` 返回 DOM 节点时，需要手动设置 `rootStyle` 为 `{ position: 'absolute' }`，参考 [#41951](https://github.com/ant-design/ant-design/issues/41951#issuecomment-1521099152)。"
          }
          descriptionMarkdown
          source={() => import("../demos/drawer/render-in-current.tsx?raw")}
        >
          <Demo4 />
        </Demo>
        <Demo
          id={"form-in-drawer"}
          title={"抽屉表单"}
          description={"在抽屉中使用表单。"}
          descriptionMarkdown
          source={() => import("../demos/drawer/form.tsx?raw")}
        >
          <Demo10 />
        </Demo>
        <Demo
          id={"user-profile"}
          title={"信息预览抽屉"}
          description={"需要快速预览对象概要时使用，点击遮罩区关闭。"}
          descriptionMarkdown
          source={() => import("../demos/drawer/user-profile.tsx?raw")}
        >
          <Demo5 />
        </Demo>
        <Demo
          id={"multi-level-drawer"}
          title={"多层抽屉"}
          description={"在抽屉内打开新的抽屉，用以解决多分支任务的复杂状况。"}
          descriptionMarkdown
          source={() => import("../demos/drawer/multi-level-drawer.tsx?raw")}
        >
          <Demo6 />
        </Demo>
        <Demo
          id={"size"}
          title={"预设宽度"}
          description={
            "抽屉的默认宽度为 `378px`，另外还提供一个大号抽屉 `736px`，可以用 `size` 属性来设置。"
          }
          descriptionMarkdown
          source={() => import("../demos/drawer/size.tsx?raw")}
        >
          <Demo7 />
        </Demo>
        <Demo
          id={"classNames"}
          title={"自定义内部样式"}
          description={
            "通过 `classNames` 属性设置抽屉内部区域（header、body、footer、mask、wrapper）的 `className`。"
          }
          descriptionMarkdown
          source={() => import("../demos/drawer/classNames.tsx?raw")}
        >
          <Demo8 />
        </Demo>
        <Demo
          id={"closable-placement"}
          title={"关闭按钮位置"}
          description={"自定义抽屉的关闭按钮位置，放到右侧，默认为左侧。"}
          descriptionMarkdown
          source={() => import("../demos/drawer/closable-placement.tsx?raw")}
        >
          <Demo9 />
        </Demo>
      </DemoGrid>
      <h2 id="api">API</h2>
      <ReferenceApiTables component="Drawer" />
      <h2 id="tokens">主题变量（Design Token）</h2>
      <ReferenceTokenTable component="Drawer" />
    </>
  );
}
