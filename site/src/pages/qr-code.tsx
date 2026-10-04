import { ComponentWhenToUse } from "../component-prose";
import {
  ComponentApiTables,
  ComponentTokenTable,
} from "../component-reference";
import reference from "../data-display/qr-code.json";
import {
  AdvancedDemo,
  BasicDemo,
  ColorDemo,
  CustomStatusDemo,
  DownloadDemo,
  IconDemo,
  LevelDemo,
  SizeDemo,
  StatusDemo,
  TypeDemo,
} from "../demos/qr-code-basic";
import { Demo, DemoGrid, DocMeta, usePageAnchor } from "../docs-ui";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        QRCode <span>二维码</span>
      </h1>
      <p className="lead">
        能够将文本转换生成二维码的组件，支持自定义配色和 Logo 配置。
      </p>
      <DocMeta name="QRCode" />
      <ComponentWhenToUse component="QRCode" />
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <DemoGrid>
        <Demo
          id="base"
          title={"基本使用"}
          description={"基本用法。"}
          descriptionMarkdown
          source={() => import("../demos/qr-code-basic.tsx?raw")}
          sourceExport="BasicDemo"
        >
          <BasicDemo />
        </Demo>
        <Demo
          id="icon"
          title={"带 Icon 的例子"}
          description={"带 Icon 的二维码。"}
          descriptionMarkdown
          source={() => import("../demos/qr-code-basic.tsx?raw")}
          sourceExport="IconDemo"
        >
          <IconDemo />
        </Demo>
        <Demo
          id="status"
          title={"不同的状态"}
          description={
            "可以通过 `status` 的值控制二维码的状态，提供了 `active`、`expired`、`loading`、`scanned` 四个值。"
          }
          descriptionMarkdown
          source={() => import("../demos/qr-code-basic.tsx?raw")}
          sourceExport="StatusDemo"
        >
          <StatusDemo />
        </Demo>
        <Demo
          id="customStatusRender"
          title={"自定义状态渲染器"}
          description={
            "可以通过 `statusRender` 的值控制二维码不同状态的渲染逻辑。"
          }
          descriptionMarkdown
          source={() => import("../demos/qr-code-basic.tsx?raw")}
          sourceExport="CustomStatusDemo"
        >
          <CustomStatusDemo />
        </Demo>
        <Demo
          id="type"
          title={"自定义渲染类型"}
          description={
            "通过设置 `type` 自定义渲染结果，提供 `canvas` 和 `svg` 两个选项。"
          }
          descriptionMarkdown
          source={() => import("../demos/qr-code-basic.tsx?raw")}
          sourceExport="TypeDemo"
        >
          <TypeDemo />
        </Demo>
        <Demo
          id="customSize"
          title={"自定义尺寸"}
          description={"自定义尺寸"}
          descriptionMarkdown
          source={() => import("../demos/qr-code-basic.tsx?raw")}
          sourceExport="SizeDemo"
        >
          <SizeDemo />
        </Demo>
        <Demo
          id="customColor"
          title={"自定义颜色"}
          description={
            "通过设置 `color` 自定义二维码颜色，通过设置 `bgColor` 自定义背景颜色。"
          }
          descriptionMarkdown
          source={() => import("../demos/qr-code-basic.tsx?raw")}
          sourceExport="ColorDemo"
        >
          <ColorDemo />
        </Demo>
        <Demo
          id="download"
          title={"下载二维码"}
          description={"下载二维码的简单实现。"}
          descriptionMarkdown
          source={() => import("../demos/qr-code-basic.tsx?raw")}
          sourceExport="DownloadDemo"
        >
          <DownloadDemo />
        </Demo>
        <Demo
          id="errorlevel"
          title={"纠错比例"}
          description={"通过设置 errorLevel 调整不同的容错等级。"}
          descriptionMarkdown
          source={() => import("../demos/qr-code-basic.tsx?raw")}
          sourceExport="LevelDemo"
        >
          <LevelDemo />
        </Demo>
        <Demo
          id="Popover"
          title={"高级用法"}
          description={"带气泡卡片的例子。"}
          descriptionMarkdown
          source={() => import("../demos/qr-code-basic.tsx?raw")}
          sourceExport="AdvancedDemo"
        >
          <AdvancedDemo />
        </Demo>
      </DemoGrid>
      <h2 id="api" tabIndex={-1}>
        API
      </h2>
      <ComponentApiTables component="QRCode" sections={reference.api} />

      <h2 id="tokens" tabIndex={-1}>
        主题变量（Design Token）
      </h2>
      <ComponentTokenTable component="QRCode" tokens={reference.tokens} />
    </>
  );
}
