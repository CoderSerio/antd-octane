import { ComponentWhenToUse } from "../component-prose";
import {
  ReferenceApiTables,
  ReferenceTokenTable,
} from "../component-reference";
import Demo0 from "../demos/app/basic";
import Demo1 from "../demos/app/config";
import { Code, Demo, DemoGrid, DocMeta, usePageAnchor } from "../docs-ui";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        App <span>包裹组件</span>
      </h1>
      <p className="lead">提供重置样式和提供消费上下文的默认环境。</p>
      <DocMeta name="App" />
      <ComponentWhenToUse component="App" />
      <h2 id="examples">代码演示</h2>
      <DemoGrid>
        <Demo
          id={"basic"}
          title={"基本用法"}
          description={"获取 `message`、`notification`、`modal` 实例。"}
          descriptionMarkdown
          source={() => import("../demos/app/basic.tsx?raw")}
        >
          <Demo0 />
        </Demo>
        <Demo
          id={"config"}
          title={"Hooks 配置"}
          description={"对 `message`、`notification` 进行配置。"}
          descriptionMarkdown
          source={() => import("../demos/app/config.tsx?raw")}
        >
          <Demo1 />
        </Demo>
      </DemoGrid>
      <h2 id="usage">如何使用</h2>
      <h3 id="basic-usage">基础用法</h3>
      <p>
        App 组件通过 <code>Context</code> 提供上下文方法调用，因而 useApp
        需要作为子组件才能使用，我们推荐在应用中顶层包裹 App。
      </p>
      <Code
        source={
          'import { App, Button } from "antd-octane";\n\nfunction MyPage() {\n  const { message } = App.useApp();\n  return <Button onClick={() => message.success("Good!")}>Open message</Button>;\n}\n\nexport default function MyApp() {\n  return <App><MyPage /></App>;\n}'
        }
      />
      <p>注意：App.useApp 必须在 App 之下方可使用。</p>
      <h3 id="config-order">与 ConfigProvider 先后顺序</h3>
      <p>
        App 组件只能在 <code>ConfigProvider</code> 之下才能使用 Design
        Token，如果需要使用其样式重置能力，则 ConfigProvider 与 App
        组件必须成对出现。
      </p>
      <Code
        source={
          '<ConfigProvider theme={{ token: { colorPrimary: "#722ed1" } }}>\n  <App>\n    <MyPage />\n  </App>\n</ConfigProvider>'
        }
      />
      <h3 id="nested-usage">内嵌使用场景（如无必要，尽量不做嵌套）</h3>
      <Code
        source={
          "<App>\n  <Space>\n    <MyPage />\n    <App><OtherPage /></App>\n  </Space>\n</App>"
        }
      />
      <h3 id="global-usage">全局场景</h3>
      <p>
        在 App 子组件中取得实例，供其他模块调用。调用前需确保该子组件已挂载。
      </p>
      <Code
        source={
          'import { App } from "antd-octane";\nimport type { MessageInstance, ModalInstance, NotificationInstance } from "antd-octane";\n\nexport let message: MessageInstance;\nexport let notification: NotificationInstance;\nexport let modal: ModalInstance;\n\nexport function GlobalInstances() {\n  const instances = App.useApp();\n  message = instances.message;\n  notification = instances.notification;\n  modal = instances.modal;\n  return null;\n}\n\n// Render <GlobalInstances /> inside <App>.'
        }
      />
      <h2 id="api">API</h2>
      <ReferenceApiTables component="App" />
      <h2 id="tokens">主题变量（Design Token）</h2>
      <ReferenceTokenTable component="App" />
    </>
  );
}
