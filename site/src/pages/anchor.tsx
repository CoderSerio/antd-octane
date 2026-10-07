import { ComponentDescription, ComponentWhenToUse } from "../component-prose";
import {
  ComponentApiTables,
  ComponentTokenTable,
} from "../component-reference";
import Demo0 from "../demos/anchor/basic";
import Demo4 from "../demos/anchor/customizeHighlight";
import Demo1 from "../demos/anchor/horizontal";
import Demo6 from "../demos/anchor/onChange";
import Demo3 from "../demos/anchor/onClick";
import Demo7 from "../demos/anchor/replace";
import Demo2 from "../demos/anchor/static";
import Demo5 from "../demos/anchor/targetOffset";
import { Demo, DemoGrid, DocMeta, usePageAnchor } from "../docs-ui";
import reference from "../navigation/anchor.json";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Anchor <span>锚点</span>
      </h1>
      <ComponentDescription component="Anchor" />
      <DocMeta name="Anchor" />
      <ComponentWhenToUse component="Anchor" />
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <DemoGrid
        component="anchor"
        columns={reference.demoColumns === 2 ? 2 : 1}
      >
        <Demo
          id="basic"
          title="基本"
          description={"最简单的用法。"}
          descriptionMarkdown
          iframe={{ demo: "anchor/basic", height: 200 }}
          source={() => import("../demos/anchor/basic.tsx?raw")}
        >
          <Demo0 />
        </Demo>
        <Demo
          id="horizontal"
          title="横向 Anchor"
          description={"横向 Anchor。"}
          descriptionMarkdown
          iframe={{ demo: "anchor/horizontal", height: 200 }}
          source={() => import("../demos/anchor/horizontal.tsx?raw")}
        >
          <Demo1 />
        </Demo>
        <Demo
          id="static"
          title="静态位置"
          description={"不浮动，状态不随页面滚动变化。"}
          descriptionMarkdown
          source={() => import("../demos/anchor/static.tsx?raw")}
        >
          <Demo2 />
        </Demo>
        <Demo
          id="onClick"
          title="自定义 onClick 事件"
          description={"点击锚点不记录历史。"}
          descriptionMarkdown
          source={() => import("../demos/anchor/onClick.tsx?raw")}
        >
          <Demo3 />
        </Demo>
        <Demo
          id="customizeHighlight"
          title="自定义锚点高亮"
          description={"自定义锚点高亮。"}
          descriptionMarkdown
          source={() => import("../demos/anchor/customizeHighlight.tsx?raw")}
        >
          <Demo4 />
        </Demo>
        <Demo
          id="targetOffset"
          title="设置锚点滚动偏移量"
          description={"锚点目标滚动到屏幕正中间。"}
          descriptionMarkdown
          iframe={{ demo: "anchor/targetOffset", height: 200 }}
          source={() => import("../demos/anchor/targetOffset.tsx?raw")}
        >
          <Demo5 />
        </Demo>
        <Demo
          id="onChange"
          title="监听锚点链接改变"
          description={"监听锚点链接改变"}
          descriptionMarkdown
          source={() => import("../demos/anchor/onChange.tsx?raw")}
        >
          <Demo6 />
        </Demo>
        <Demo
          id="replace"
          title="替换历史中的 href"
          description={
            "替换浏览器历史记录中的路径，后退按钮将返回到上一页而不是上一个锚点。"
          }
          descriptionMarkdown
          iframe={{ demo: "anchor/replace", height: 200 }}
          source={() => import("../demos/anchor/replace.tsx?raw")}
        >
          <Demo7 />
        </Demo>
      </DemoGrid>
      <h2 id="api" tabIndex={-1}>
        API
      </h2>
      <ComponentApiTables component="Anchor" sections={reference.api} />
      <h2 id="tokens" tabIndex={-1}>
        主题变量（Design Token）
      </h2>
      <ComponentTokenTable component="Anchor" tokens={reference.tokens} />
    </>
  );
}
