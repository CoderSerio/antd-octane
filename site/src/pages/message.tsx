import { ComponentWhenToUse } from "../component-prose";
import { ApiNote, ReferenceTokenTable } from "../component-reference";
import Demo5 from "../demos/message/custom-style";
import Demo2 from "../demos/message/duration";
import Demo0 from "../demos/message/hooks";
import Demo7 from "../demos/message/info";
import Demo3 from "../demos/message/loading";
import Demo1 from "../demos/message/other";
import Demo4 from "../demos/message/thenable";
import Demo6 from "../demos/message/update";
import { ApiTable, Demo, DemoGrid, DocMeta, usePageAnchor } from "../docs-ui";

const messageReferenceUrl = "https://5x.ant.design/components/message-cn/";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Message <span>全局提示</span>
      </h1>
      <p className="lead">全局展示操作反馈信息。</p>
      <DocMeta name="Message" importName="message" />
      <ComponentWhenToUse component="Message" />
      <h2 id="examples">代码演示</h2>
      <DemoGrid>
        <Demo
          id={"hooks"}
          title={"Hooks 调用（推荐）"}
          description={
            "通过 `message.useMessage` 创建支持读取 context 的 `contextHolder`。请注意，我们推荐通过顶层注册的方式代替 `message` 静态方法，因为静态方法无法消费上下文，因而 ConfigProvider 的数据也不会生效。"
          }
          descriptionMarkdown
          source={() => import("../demos/message/hooks.tsx?raw")}
        >
          <Demo0 />
        </Demo>
        <Demo
          id={"other"}
          title={"其他提示类型"}
          description={"包括成功、失败、警告。"}
          descriptionMarkdown
          source={() => import("../demos/message/other.tsx?raw")}
        >
          <Demo1 />
        </Demo>
        <Demo
          id={"duration"}
          title={"修改延时"}
          description={"自定义时长 `10s`，默认时长为 `3s`。"}
          descriptionMarkdown
          source={() => import("../demos/message/duration.tsx?raw")}
        >
          <Demo2 />
        </Demo>
        <Demo
          id={"loading"}
          title={"加载中"}
          description={"进行全局 loading，异步自行移除。"}
          descriptionMarkdown
          source={() => import("../demos/message/loading.tsx?raw")}
        >
          <Demo3 />
        </Demo>
        <Demo
          id={"thenable"}
          title={"Promise 接口"}
          description={
            "可以通过 then 接口在关闭后运行 callback 。以上用例将在每个 message 将要结束时通过 then 显示新的 message 。"
          }
          descriptionMarkdown
          source={() => import("../demos/message/thenable.tsx?raw")}
        >
          <Demo4 />
        </Demo>
        <Demo
          id={"custom-style"}
          title={"自定义样式"}
          description={"使用 `style` 和 `className` 来定义样式。"}
          descriptionMarkdown
          source={() => import("../demos/message/custom-style.tsx?raw")}
        >
          <Demo5 />
        </Demo>
        <Demo
          id={"update"}
          title={"更新消息内容"}
          description={"可以通过唯一的 `key` 来更新内容。"}
          descriptionMarkdown
          source={() => import("../demos/message/update.tsx?raw")}
        >
          <Demo6 />
        </Demo>
        <Demo
          id={"info"}
          title={"静态方法（不推荐）"}
          description={
            "静态方法无法消费 Context，不能动态响应 ConfigProvider 提供的各项配置，启用 `layer` 时还可能导致样式异常。请优先使用 hooks 版本或者 App 组件提供的 `message` 实例。"
          }
          descriptionMarkdown
          source={() => import("../demos/message/info.tsx?raw")}
        >
          <Demo7 />
        </Demo>
      </DemoGrid>
      <h2 id="api">API</h2>
      <p>组件提供了一些静态方法，使用方式和参数如下：</p>
      <ul className="prose-list">
        <li>
          <code>message.success(content, [duration], onClose)</code>
        </li>
        <li>
          <code>message.error(content, [duration], onClose)</code>
        </li>
        <li>
          <code>message.info(content, [duration], onClose)</code>
        </li>
        <li>
          <code>message.warning(content, [duration], onClose)</code>
        </li>
        <li>
          <code>message.loading(content, [duration], onClose)</code>
        </li>
      </ul>
      <ApiTable
        rows={[
          ["content", "提示内容", "OctaneNode | config", "-"],
          [
            "duration",
            "自动关闭的延时，单位秒。设为 0 时不自动关闭",
            "number",
            "3",
          ],
          ["onClose", "关闭时触发的回调函数", "function", "-"],
        ]}
        markdown
        referenceUrl={messageReferenceUrl}
        label="Message API 参数表，可横向滚动"
      />
      <p>组件同时提供 promise 接口。</p>
      <ul className="prose-list">
        <li>
          <code>message[level](content, [duration]).then(afterClose)</code>
        </li>
        <li>
          <code>
            message[level](content, [duration], onClose).then(afterClose)
          </code>
        </li>
      </ul>
      <p>
        其中 <code>message[level]</code> 是组件已经提供的静态方法。
        <code>then</code> 接口返回值是 Promise。
      </p>
      <p>也可以对象的形式传递参数：</p>
      <ul className="prose-list">
        <li>
          <code>message.open(config)</code>
        </li>
        <li>
          <code>message.success(config)</code>
        </li>
        <li>
          <code>message.error(config)</code>
        </li>
        <li>
          <code>message.info(config)</code>
        </li>
        <li>
          <code>message.warning(config)</code>
        </li>
        <li>
          <code>message.loading(config)</code>
        </li>
      </ul>
      <p>
        <code>config</code> 对象属性如下：
      </p>
      <ApiTable
        rows={[
          ["className", "自定义 CSS class", "string", "-"],
          ["content", "提示内容", "OctaneNode", "-"],
          [
            "duration",
            "自动关闭的延时，单位秒。设为 0 时不自动关闭",
            "number",
            "3",
          ],
          ["icon", "自定义图标", "OctaneNode", "-"],
          ["key", "当前提示的唯一标志", "string | number", "-"],
          [
            "style",
            "自定义内联样式",
            "[CSSProperties](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/e434515761b36830c3e58a970abf5186f005adac/types/react/index.d.ts#L794)",
            "-",
          ],
          ["onClick", "点击 message 时触发的回调函数", "function", "-"],
          ["onClose", "关闭时触发的回调函数", "function", "-"],
        ]}
        markdown
        referenceUrl={messageReferenceUrl}
        label="Message 共同的 API 参数表，可横向滚动"
      />
      <h3 id="global">全局方法</h3>
      <p>还提供了全局配置和全局销毁方法：</p>
      <ul className="prose-list">
        <li>
          <code>message.config(options)</code>
        </li>
        <li>
          <code>message.destroy()</code>
        </li>
      </ul>
      <ApiNote>
        也可通过 <code>message.destroy(key)</code> 来关闭一条消息。
      </ApiNote>
      <h4>message.config</h4>
      <ApiNote>
        当你使用 ConfigProvider 进行全局化配置时，系统会默认自动开启 RTL 模式。
        <br />
        当你想单独使用，可通过如下设置开启 RTL 模式。
      </ApiNote>
      <div className="code-wrap">
        <pre>
          <code>{`message.config({
  top: 100,
  duration: 2,
  maxCount: 3,
  rtl: true,
  prefixCls: 'my-message',
});`}</code>
        </pre>
      </div>
      <ApiTable
        rows={[
          ["duration", "默认自动关闭延时，单位秒", "number", "3"],
          [
            "getContainer",
            "配置渲染节点的输出位置，但依旧为全屏展示",
            "() => HTMLElement",
            "() => document.body",
          ],
          [
            "maxCount",
            "最大显示数，超过限制时，最早的消息会被自动关闭",
            "number",
            "-",
          ],
          ["prefixCls", "消息节点的 className 前缀", "string", "`ant-message`"],
          ["rtl", "是否开启 RTL 模式", "boolean", "false"],
          ["top", "消息距离顶部的位置", "string | number", "8"],
        ]}
        markdown
        referenceUrl={messageReferenceUrl}
        label="Message message.config API 参数表，可横向滚动"
      />
      <h2 id="tokens">主题变量（Design Token）</h2>
      <ReferenceTokenTable component="Message" />
    </>
  );
}
