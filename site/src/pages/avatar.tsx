import {
  ApiNote,
  ComponentApiTables,
  ComponentTokenTable,
} from "../component-reference";
import reference from "../data-display/avatar.json";
import {
  BadgeDemo,
  BasicDemo,
  DynamicDemo,
  GroupDemo,
  ResponsiveDemo,
  TypeDemo,
} from "../demos/avatar-basic";
import { Demo, DemoGrid, DocMeta, usePageAnchor } from "../docs-ui";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Avatar <span>头像</span>
      </h1>
      <p className="lead">用来代表用户或事物，支持图片、图标或字符展示。</p>
      <DocMeta name="Avatar" />
      <h2 id="designers" tabIndex={-1}>
        设计师专属
      </h2>
      <p>
        安装{" "}
        <a href="https://kitchen.alipay.com" target="_blank" rel="noreferrer">
          Kitchen Sketch 插件 💎
        </a>
        ，一键填充高逼格头像和文本。
      </p>
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <DemoGrid>
        <Demo
          id="basic"
          title={"基本"}
          description={"头像有三种尺寸，两种形状可选。"}
          descriptionMarkdown
          source={() => import("../demos/avatar-basic.tsx?raw")}
          sourceExport="BasicDemo"
        >
          <BasicDemo />
        </Demo>
        <Demo
          id="type"
          title={"类型"}
          description={
            "支持三种类型：图片、Icon 以及字符，其中 Icon 和字符型可以自定义图标颜色及背景色。"
          }
          descriptionMarkdown
          source={() => import("../demos/avatar-basic.tsx?raw")}
          sourceExport="TypeDemo"
        >
          <TypeDemo />
        </Demo>
        <Demo
          id="dynamic"
          title={"自动调整字符大小"}
          description={
            "对于字符型的头像，当字符串较长时，字体大小可以根据头像宽度自动调整。也可使用 `gap` 来设置字符距离左右两侧边界单位像素。"
          }
          descriptionMarkdown
          source={() => import("../demos/avatar-basic.tsx?raw")}
          sourceExport="DynamicDemo"
        >
          <DynamicDemo />
        </Demo>
        <Demo
          id="badge"
          title={"带徽标的头像"}
          description={"通常用于消息提示。"}
          descriptionMarkdown
          source={() => import("../demos/avatar-basic.tsx?raw")}
          sourceExport="BadgeDemo"
        >
          <BadgeDemo />
        </Demo>
        <Demo
          id="group"
          title={"Avatar.Group"}
          description={"头像组合展现。"}
          descriptionMarkdown
          source={() => import("../demos/avatar-basic.tsx?raw")}
          sourceExport="GroupDemo"
        >
          <GroupDemo />
        </Demo>
        <Demo
          id="responsive"
          title={"响应式尺寸"}
          description={"头像大小可以根据屏幕大小自动调整。"}
          descriptionMarkdown
          source={() => import("../demos/avatar-basic.tsx?raw")}
          sourceExport="ResponsiveDemo"
        >
          <ResponsiveDemo />
        </Demo>
      </DemoGrid>
      <h2 id="api" tabIndex={-1}>
        API
      </h2>
      <ComponentApiTables
        component="Avatar"
        sections={reference.api}
        sectionNotes={{
          Avatar: (
            <ApiNote>
              Tip：你可以设置 <code>icon</code> 或 <code>children</code>{" "}
              作为图片加载失败的默认 fallback 行为，优先级为 <code>icon</code>{" "}
              &gt; <code>children</code>
            </ApiNote>
          ),
        }}
      />
      <h2 id="tokens" tabIndex={-1}>
        主题变量（Design Token）
      </h2>
      <ComponentTokenTable component="Avatar" tokens={reference.tokens} />
    </>
  );
}
