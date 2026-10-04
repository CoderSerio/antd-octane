import { ComponentWhenToUse } from "../component-prose";
import {
  ComponentApiTables,
  ComponentTokenTable,
} from "../component-reference";
import reference from "../data-display/image.json";
import {
  BasicDemo,
  ControlledDemo,
  FallbackDemo,
  ImageRenderDemo,
  ItemsDemo,
  MoreDemo,
  NestedDemo,
  PlaceholderDemo,
  PreviewSrcDemo,
  ToolbarDemo,
} from "../demos/image-basic";
import { Demo, DemoGrid, DocMeta, usePageAnchor } from "../docs-ui";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Image <span>图片</span>
      </h1>
      <p className="lead">可预览的图片。</p>
      <DocMeta name="Image" />
      <ComponentWhenToUse component="Image" />
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <DemoGrid>
        <Demo
          id="basic"
          title={"基本用法"}
          description={"单击图像可以放大显示。"}
          descriptionMarkdown
          source={() => import("../demos/image-basic.tsx?raw")}
          sourceExport="BasicDemo"
        >
          <BasicDemo />
        </Demo>
        <Demo
          id="fallback"
          title={"容错处理"}
          description={"加载失败显示图像占位符。"}
          descriptionMarkdown
          source={() => import("../demos/image-basic.tsx?raw")}
          sourceExport="FallbackDemo"
        >
          <FallbackDemo />
        </Demo>
        <Demo
          id="placeholder"
          title={"渐进加载"}
          description={"大图使用 placeholder 渐进加载。"}
          descriptionMarkdown
          source={() => import("../demos/image-basic.tsx?raw")}
          sourceExport="PlaceholderDemo"
        >
          <PlaceholderDemo />
        </Demo>
        <Demo
          id="preview-group"
          title={"多张图片预览"}
          description={"点击左右切换按钮可以预览多张图片。"}
          descriptionMarkdown
          source={() => import("../demos/image-basic.tsx?raw")}
          sourceExport="MoreDemo"
        >
          <MoreDemo />
        </Demo>
        <Demo
          id="preview-group-visible"
          title={"相册模式"}
          description={"从一张图片点开相册。"}
          descriptionMarkdown
          source={() => import("../demos/image-basic.tsx?raw")}
          sourceExport="ItemsDemo"
        >
          <ItemsDemo />
        </Demo>
        <Demo
          id="previewSrc"
          title={"自定义预览图片"}
          description={"可以设置不同的预览图片。"}
          descriptionMarkdown
          source={() => import("../demos/image-basic.tsx?raw")}
          sourceExport="PreviewSrcDemo"
        >
          <PreviewSrcDemo />
        </Demo>
        <Demo
          id="controlled-preview"
          title={"受控的预览"}
          description={"可以使预览受控。"}
          descriptionMarkdown
          source={() => import("../demos/image-basic.tsx?raw")}
          sourceExport="ControlledDemo"
        >
          <ControlledDemo />
        </Demo>
        <Demo
          id="toolbarRender"
          title={"自定义工具栏"}
          description={"可以自定义工具栏并添加下载原图或翻转旋转后图片的按钮。"}
          descriptionMarkdown
          source={() => import("../demos/image-basic.tsx?raw")}
          sourceExport="ToolbarDemo"
        >
          <ToolbarDemo />
        </Demo>
        <Demo
          id="imageRender"
          title={"自定义预览内容"}
          description={"可以自定义预览内容。"}
          descriptionMarkdown
          source={() => import("../demos/image-basic.tsx?raw")}
          sourceExport="ImageRenderDemo"
        >
          <ImageRenderDemo />
        </Demo>
        <Demo
          id="nested"
          title={"嵌套"}
          description={"嵌套在弹框当中使用"}
          descriptionMarkdown
          source={() => import("../demos/image-basic.tsx?raw")}
          sourceExport="NestedDemo"
        >
          <NestedDemo />
        </Demo>
      </DemoGrid>
      <h2 id="api" tabIndex={-1}>
        API
      </h2>
      <ComponentApiTables component="Image" sections={reference.api} />

      <h2 id="tokens" tabIndex={-1}>
        主题变量（Design Token）
      </h2>
      <ComponentTokenTable component="Image" tokens={reference.tokens} />
    </>
  );
}
