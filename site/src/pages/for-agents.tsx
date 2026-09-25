import { Code, usePageAnchor } from "../docs-ui";

export default function ForAgents({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>面向 AI Agent</h1>
      <p className="lead">让生成的代码建立在当前实现上。</p>
      <p>
        把{" "}
        <a className="text-link" href="./agent-guide.md">
          Agent 接入指南（Markdown）
        </a>
        交给编程助手；
        <a className="text-link" href="./llms.txt">
          llms.txt
        </a>
        提供文档入口。当前没有已发布的专用 CLI 或 MCP 服务。
      </p>
      <h2 id="baseline" tabIndex={-1}>
        先确认基线
      </h2>
      <p>
        本库原生运行于 Octane 0.4.3，Ant Design 5.29.3 是开发对照基线。 不使用
        React 包装，不承诺全部 API 或内部 DOM 兼容。 当前版本为
        0.1.0-alpha.0，已通过 npm alpha 标签发布。
      </p>
      <h2 id="context" tabIndex={-1}>
        提供给 Agent 的上下文
      </h2>
      <div className="code-wrap">
        <pre style={{ whiteSpace: "pre-wrap" }}>
          <code>{`请使用 antd-octane 当前构建实现此界面。
先读取本站提供的 agent-guide.md、compatibility.md，以及所需组件页面的 API 和支持范围。
这是 Octane 0.4.3 原生组件库，Hooks 与 JSX 来自 octane。
安装 antd-octane@alpha 和 octane@0.4.3，显式导入 antd-octane/style.css；配置 Octane Vite 插件。
以当前包导出和 TypeScript 声明为准，不从 React antd 推断未实现的 API。
不支持的能力请明确指出，交付前执行类型检查、生产构建和浏览器验证。`}</code>
        </pre>
      </div>
      <p>
        页面使用 hash 路由，需要 JavaScript。纯文本工具可直接读取 Markdown；
        仓库源码与已安装版本不一致时，应以正在消费的包声明为准。
      </p>
      <h2 id="usage" tabIndex={-1}>
        可用的状态与反馈
      </h2>
      <Code
        source={`import { useState } from "octane";
import { App, Button, ConfigProvider, Input } from "antd-octane";
import "antd-octane/style.css";

function Editor() {
  const [value, setValue] = useState("");
  const { message } = App.useApp();
  return <>
    <Input aria-label="名称" value={value}
      onChange={(event) => setValue(event.target.value)} />
    <Button onClick={() => message.success(value)}>保存</Button>
  </>;
}

export default function Example() {
  return <ConfigProvider theme={{ token: { colorPrimary: "#1677ff" } }}>
    <App><Editor /></App>
  </ConfigProvider>;
}`}
      />
      <p>
        App.useApp 在 App 后代中调用，目前提供 message 和 notification。
        使用独立 hook 时，要渲染 contextHolder 才能显示反馈并继承主题。
        安装、Vite 和 JSX 配置见{" "}
        <a className="text-link" href="#start">
          快速开始
        </a>
        。
      </p>
      <h2 id="boundaries" tabIndex={-1}>
        生成代码前核对边界
      </h2>
      <ul className="prose-list">
        <li>
          Modal 支持声明式 open；尚无 Modal.confirm、Modal.useModal 或
          App.useApp().modal。
        </li>
        <li>
          消息和通知使用实例 API，不支持全局静态 message.success /
          notification.open。
        </li>
        <li>
          主题支持 seed token、算法和已实现组件配置；不支持
          StyleProvider、cssVar、hashed、prefixCls 或 SSR 样式契约。
        </li>
        <li>
          不推断未导出的组件、上游子组件、事件、ref 或 token
          已兼容。检查组件页与当前类型。
        </li>
      </ul>
      <p>
        更多说明见{" "}
        <a className="text-link" href="#compatibility">
          兼容与迁移
        </a>
        、
        <a className="text-link" href="#api-conventions">
          API 与语法约定
        </a>
        。 Markdown 指南包含完整接入代码和验证步骤。
      </p>
    </>
  );
}
