import { ComponentWhenToUse } from "../component-prose";
import {
  ReferenceApiTables,
  ReferenceTokenTable,
} from "../component-reference";
import Demo0 from "../demos/watermark/basic";
import Demo4 from "../demos/watermark/custom";
import Demo2 from "../demos/watermark/image";
import Demo1 from "../demos/watermark/multi-line";
import Demo3 from "../demos/watermark/portal";
import { Demo, DemoGrid, DocMeta, usePageAnchor } from "../docs-ui";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Watermark <span>水印</span>
      </h1>
      <p className="lead">给页面的某个区域加上水印。</p>
      <DocMeta name="Watermark" />
      <ComponentWhenToUse component="Watermark" />
      <h2 id="examples">代码演示</h2>
      <DemoGrid columns={1}>
        <Demo
          id={"basic"}
          title={"基本"}
          description={"最简单的用法。"}
          descriptionMarkdown
          source={() => import("../demos/watermark/basic.tsx?raw")}
        >
          <Demo0 />
        </Demo>
        <Demo
          id={"multi-line"}
          title={"多行水印"}
          description={"通过 `content` 设置 字符串数组 指定多行文字水印内容。"}
          descriptionMarkdown
          source={() => import("../demos/watermark/multi-line.tsx?raw")}
        >
          <Demo1 />
        </Demo>
        <Demo
          id={"image"}
          title={"图片水印"}
          description={
            "通过 `image` 指定图片地址。为保证图片高清且不被拉伸，请设置 width 和 height, 并上传至少两倍的宽高的 logo 图片地址。"
          }
          descriptionMarkdown
          source={() => import("../demos/watermark/image.tsx?raw")}
        >
          <Demo2 />
        </Demo>
        <Demo
          id={"custom"}
          title={"自定义配置"}
          description={"通过自定义参数配置预览水印效果。"}
          descriptionMarkdown
          source={() => import("../demos/watermark/custom.tsx?raw")}
        >
          <Demo4 />
        </Demo>
        <Demo
          id={"portal"}
          title={"Modal 与 Drawer"}
          description={"在 Modal 与 Drawer 中使用。"}
          descriptionMarkdown
          source={() => import("../demos/watermark/portal.tsx?raw")}
        >
          <Demo3 />
        </Demo>
      </DemoGrid>
      <h2 id="api">API</h2>
      <ReferenceApiTables component="Watermark" />
      <h2 id="tokens">主题变量（Design Token）</h2>
      <ReferenceTokenTable component="Watermark" />
    </>
  );
}
