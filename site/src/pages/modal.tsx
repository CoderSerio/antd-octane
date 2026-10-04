import { ComponentWhenToUse } from "../component-prose";
import {
  ReferenceApiTables,
  ReferenceTokenTable,
} from "../component-reference";
import Demo1 from "../demos/modal/async";
import Demo0 from "../demos/modal/basic";
import Demo9 from "../demos/modal/button-props";
import Demo14 from "../demos/modal/classNames";
import Demo13 from "../demos/modal/confirm";
import Demo15 from "../demos/modal/confirm-router";
import Demo2 from "../demos/modal/footer";
import Demo4 from "../demos/modal/footer-render";
import Demo5 from "../demos/modal/hooks";
import Demo3 from "../demos/modal/loading";
import Demo6 from "../demos/modal/locale";
import Demo7 from "../demos/modal/manual";
import Demo10 from "../demos/modal/modal-render";
import Demo8 from "../demos/modal/position";
import Demo12 from "../demos/modal/static-info";
import Demo11 from "../demos/modal/width";
import { Demo, DemoGrid, DocMeta, usePageAnchor } from "../docs-ui";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Modal <span>对话框</span>
      </h1>
      <p className="lead">展示一个对话框，提供标题、内容区、操作区。</p>
      <DocMeta name="Modal" />
      <ComponentWhenToUse component="Modal" />
      <h2 id="examples">代码演示</h2>
      <DemoGrid>
        <Demo
          id={"basic"}
          title={"基本"}
          description={"基础弹框。"}
          descriptionMarkdown
          source={() => import("../demos/modal/basic.tsx?raw")}
        >
          <Demo0 />
        </Demo>
        <Demo
          id={"async"}
          title={"异步关闭"}
          description={"点击确定后异步关闭对话框，例如提交表单。"}
          descriptionMarkdown
          source={() => import("../demos/modal/async.tsx?raw")}
        >
          <Demo1 />
        </Demo>
        <Demo
          id={"footer"}
          title={"自定义页脚"}
          description={
            "更复杂的例子，自定义了页脚的按钮，点击提交后进入 loading 状态，完成后关闭。\n\n不需要默认确定取消按钮时，你可以把 `footer` 设为 `null`。"
          }
          descriptionMarkdown
          source={() => import("../demos/modal/footer.tsx?raw")}
        >
          <Demo2 />
        </Demo>
        <Demo
          id={"loading"}
          title={"加载中"}
          description={"设置对话框加载状态。"}
          descriptionMarkdown
          source={() => import("../demos/modal/loading.tsx?raw")}
        >
          <Demo3 />
        </Demo>
        <Demo
          id={"footer-render"}
          title={"自定义页脚渲染函数"}
          description={"自定义页脚渲染函数，支持在原有基础上进行扩展。"}
          descriptionMarkdown
          source={() => import("../demos/modal/footer-render.tsx?raw")}
        >
          <Demo4 />
        </Demo>
        <Demo
          id={"hooks"}
          title={"使用 hooks 获得上下文"}
          description={
            "通过 `Modal.useModal` 创建支持读取 context 的 `contextHolder`。其中仅有 hooks 方法支持 Promise `await` 操作。"
          }
          descriptionMarkdown
          source={() => import("../demos/modal/hooks.tsx?raw")}
        >
          <Demo5 />
        </Demo>
        <Demo
          id={"locale"}
          title={"国际化"}
          description={"设置 `okText` 与 `cancelText` 以自定义按钮文字。"}
          descriptionMarkdown
          source={() => import("../demos/modal/locale.tsx?raw")}
        >
          <Demo6 />
        </Demo>
        <Demo
          id={"manual"}
          title={"手动更新和移除"}
          description={"通过返回的 instance 手动更新和关闭对话框。"}
          descriptionMarkdown
          source={() => import("../demos/modal/manual.tsx?raw")}
        >
          <Demo7 />
        </Demo>
        <Demo
          id={"position"}
          title={"自定义位置"}
          description={
            "使用 `centered` 或类似 `style.top` 的样式来设置对话框位置。"
          }
          descriptionMarkdown
          source={() => import("../demos/modal/position.tsx?raw")}
        >
          <Demo8 />
        </Demo>
        <Demo
          id={"button-props"}
          title={"自定义页脚按钮属性"}
          description={
            "传入 `okButtonProps` 和 `cancelButtonProps` 可分别自定义确定按钮和取消按钮的 props。"
          }
          descriptionMarkdown
          source={() => import("../demos/modal/button-props.tsx?raw")}
        >
          <Demo9 />
        </Demo>
        <Demo
          id={"modal-render"}
          title={"自定义渲染对话框"}
          description={"自定义渲染对话框，可实现拖拽。"}
          descriptionMarkdown
          source={() => import("../demos/modal/modal-render.tsx?raw")}
        >
          <Demo10 />
        </Demo>
        <Demo
          id={"width"}
          title={"自定义模态的宽度"}
          description={"使用 `width` 来设置模态对话框的宽度。"}
          descriptionMarkdown
          source={() => import("../demos/modal/width.tsx?raw")}
        >
          <Demo11 />
        </Demo>
        <Demo
          id={"static-info"}
          title={"静态方法"}
          description={
            "静态方法无法消费 Context，不能动态响应 ConfigProvider 提供的各项配置，启用 `layer` 时还可能导致样式异常。请优先使用 hooks 版本或者 App 组件提供的 `modal` 实例。"
          }
          descriptionMarkdown
          source={() => import("../demos/modal/static-info.tsx?raw")}
        >
          <Demo12 />
        </Demo>
        <Demo
          id={"confirm"}
          title={"静态确认对话框"}
          description={
            "使用 `confirm()` 可以快捷地弹出确认框。onCancel/onOk 返回 promise 可以延迟关闭。"
          }
          descriptionMarkdown
          source={() => import("../demos/modal/confirm.tsx?raw")}
        >
          <Demo13 />
        </Demo>
        <Demo
          id={"classNames"}
          title={"自定义内部模块 className"}
          description={
            "通过 `classNames` 属性设置弹窗内部区域（header、body、footer、mask、wrapper）的 `className`。"
          }
          descriptionMarkdown
          source={() => import("../demos/modal/classNames.tsx?raw")}
        >
          <Demo14 />
        </Demo>
        <Demo
          id={"confirm-router"}
          title={"销毁确认对话框"}
          description={
            "使用 `Modal.destroyAll()` 可以销毁弹出的确认窗。通常用于路由监听当中，处理路由前进、后退不能销毁确认对话框的问题。"
          }
          descriptionMarkdown
          source={() => import("../demos/modal/confirm-router.tsx?raw")}
        >
          <Demo15 />
        </Demo>
      </DemoGrid>
      <h2 id="api">API</h2>
      <ReferenceApiTables component="Modal" />
      <h2 id="tokens">主题变量（Design Token）</h2>
      <ReferenceTokenTable component="Modal" />
    </>
  );
}
