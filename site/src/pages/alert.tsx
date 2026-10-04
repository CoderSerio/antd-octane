import { ComponentWhenToUse } from "../component-prose";
import {
  ReferenceApiTables,
  ReferenceTokenTable,
} from "../component-reference";
import Demo9 from "../demos/alert/action";
import Demo5 from "../demos/alert/banner";
import Demo0 from "../demos/alert/basic";
import Demo2 from "../demos/alert/closable";
import Demo3 from "../demos/alert/description";
import Demo8 from "../demos/alert/error-boundary";
import Demo4 from "../demos/alert/icon";
import Demo6 from "../demos/alert/loop-banner";
import Demo7 from "../demos/alert/smooth-closed";
import Demo1 from "../demos/alert/style";
import { Demo, DemoGrid, DocMeta, usePageAnchor } from "../docs-ui";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Alert <span>警告提示</span>
      </h1>
      <p className="lead">警告提示，展现需要关注的信息。</p>
      <DocMeta name="Alert" />
      <ComponentWhenToUse component="Alert" />
      <h2 id="examples">代码演示</h2>
      <DemoGrid>
        <Demo
          id={"basic"}
          title={"基本"}
          description={"最简单的用法，适用于简短的警告提示。"}
          descriptionMarkdown
          source={() => import("../demos/alert/basic.tsx?raw")}
        >
          <Demo0 />
        </Demo>
        <Demo
          id={"style"}
          title={"四种样式"}
          description={"共有四种样式 `success`、`info`、`warning`、`error`。"}
          descriptionMarkdown
          source={() => import("../demos/alert/style.tsx?raw")}
        >
          <Demo1 />
        </Demo>
        <Demo
          id={"closable"}
          title={"可关闭的警告提示"}
          description={"显示关闭按钮，点击可关闭警告提示。"}
          descriptionMarkdown
          source={() => import("../demos/alert/closable.tsx?raw")}
        >
          <Demo2 />
        </Demo>
        <Demo
          id={"description"}
          title={"含有辅助性文字介绍"}
          description={"含有辅助性文字介绍的警告提示。"}
          descriptionMarkdown
          source={() => import("../demos/alert/description.tsx?raw")}
        >
          <Demo3 />
        </Demo>
        <Demo
          id={"icon"}
          title={"图标"}
          description={"可口的图标让信息类型更加醒目。"}
          descriptionMarkdown
          source={() => import("../demos/alert/icon.tsx?raw")}
        >
          <Demo4 />
        </Demo>
        <Demo
          id={"banner"}
          title={"顶部公告"}
          description={"页面顶部通告形式，默认有图标且 `type` 为 'warning'。"}
          descriptionMarkdown
          source={() => import("../demos/alert/banner.tsx?raw")}
          iframe={{ demo: "alert/banner", height: 250 }}
        >
          <Demo5 />
        </Demo>
        <Demo
          id={"loop-banner"}
          title={"轮播的公告"}
          description={
            "配合 [react-text-loop-next](https://npmjs.com/package/react-text-loop-next) 或 [react-fast-marquee](https://npmjs.com/package/react-fast-marquee) 实现消息轮播通知栏。"
          }
          descriptionMarkdown
          source={() => import("../demos/alert/loop-banner.tsx?raw")}
        >
          <Demo6 />
        </Demo>
        <Demo
          id={"smooth-closed"}
          title={"平滑地卸载"}
          description={"平滑、自然的卸载提示。"}
          descriptionMarkdown
          source={() => import("../demos/alert/smooth-closed.tsx?raw")}
        >
          <Demo7 />
        </Demo>
        <Demo
          id={"error-boundary"}
          title={"Octane 错误处理"}
          description={"友好的错误处理包裹组件。"}
          descriptionMarkdown
          source={() => import("../demos/alert/error-boundary.tsx?raw")}
        >
          <Demo8 />
        </Demo>
        <Demo
          id={"action"}
          title={"操作"}
          description={"可以在右上角自定义操作项。"}
          descriptionMarkdown
          source={() => import("../demos/alert/action.tsx?raw")}
        >
          <Demo9 />
        </Demo>
      </DemoGrid>
      <h2 id="api">API</h2>
      <ReferenceApiTables component="Alert" />
      <h2 id="tokens">主题变量（Design Token）</h2>
      <ReferenceTokenTable component="Alert" />
    </>
  );
}
