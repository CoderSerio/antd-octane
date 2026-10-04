import { ReferenceApiTables } from "../component-reference";
import {
  DirectionDemo,
  LocaleDemo,
  SizeDemo,
  ThemeDemo,
  WaveDemo,
} from "../demos/config-provider-basic";
import HolderDemo from "../demos/config-provider-holder";
import { Code, Demo, DemoGrid, DocMeta, usePageAnchor } from "../docs-ui";

export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        ConfigProvider <span>全局化配置</span>
      </h1>
      <p className="lead">为组件提供统一的全局化配置。</p>
      <DocMeta name="ConfigProvider" />
      <h2 id="usage">使用</h2>
      <p>
        ConfigProvider 使用 Octane 的 context
        特性，只需在应用外围包裹一次即可全局生效。
      </p>
      <Code
        source={
          'import { ConfigProvider } from "antd-octane";\n\n<ConfigProvider direction="rtl">\n  <App />\n</ConfigProvider>'
        }
      />
      <h3 id="csp">内容安全策略（CSP）</h3>
      <p>
        开启 Content Security Policy (CSP) 时，可以通过 <code>csp</code>{" "}
        属性配置动态样式的 nonce：
      </p>
      <Code
        source={
          '<ConfigProvider csp={{ nonce: "YourNonceCode" }}>\n  <Button>My Button</Button>\n</ConfigProvider>'
        }
      />
      <h2 id="examples">代码演示</h2>
      <DemoGrid columns={1}>
        <Demo
          id="locale"
          title={"国际化"}
          description={"此处列出需要国际化支持的组件，你可以在演示里切换语言。"}
          descriptionMarkdown
          source={() => import("../demos/config-provider-basic.tsx?raw")}
          sourceExport="LocaleDemo"
        >
          <LocaleDemo />
        </Demo>
        <Demo
          id="direction"
          title={"方向"}
          description={
            "这里列出了支持 `rtl` 方向的组件，您可以在演示中切换方向。"
          }
          descriptionMarkdown
          source={() => import("../demos/config-provider-basic.tsx?raw")}
          sourceExport="DirectionDemo"
        >
          <DirectionDemo />
        </Demo>
        <Demo
          id="size"
          title={"组件尺寸"}
          description={"修改默认组件尺寸。"}
          descriptionMarkdown
          source={() => import("../demos/config-provider-basic.tsx?raw")}
          sourceExport="SizeDemo"
        >
          <SizeDemo />
        </Demo>
        <Demo
          id="theme"
          title={"主题"}
          description={"通过 `theme` 修改主题。"}
          descriptionMarkdown
          source={() => import("../demos/config-provider-basic.tsx?raw")}
          sourceExport="ThemeDemo"
        >
          <ThemeDemo />
        </Demo>
        <Demo
          id="wave"
          title={"自定义波纹"}
          description={"波纹效果带来了灵动性，可以通过 wave 配置控制和自定义。"}
          descriptionMarkdown
          source={() => import("../demos/config-provider-basic.tsx?raw")}
          sourceExport="WaveDemo"
        >
          <WaveDemo />
        </Demo>
        <Demo
          id="holderRender"
          title={"静态方法"}
          description={
            "使用 `holderRender` 给 `message` 、`modal` 、`notification` 静态方法设置 `Provider`"
          }
          descriptionMarkdown
          source={() => import("../demos/config-provider-holder.tsx?raw")}
        >
          <HolderDemo />
        </Demo>
      </DemoGrid>
      <h2 id="api">API</h2>
      <ReferenceApiTables component="ConfigProvider" />
    </>
  );
}
