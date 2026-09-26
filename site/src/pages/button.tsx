import { BasicDemo } from "../demos/basic";
import { ComponentDemo } from "../demos/component";
import { NestedDemo } from "../demos/nested";
import { SizesDemo } from "../demos/sizes";
import { StatesDemo } from "../demos/states";
import { ApiTable, Demo, DocMeta, usePageAnchor } from "../docs-ui";

const apiRows = [
  [
    "type",
    "设置按钮类型",
    "default | primary | dashed | text | link",
    "default",
  ],
  ["size", "设置按钮大小", "small | middle | large", "middle"],
  ["shape", "设置按钮形状", "default | circle | round", "default"],
  ["disabled", "禁用按钮", "boolean", "false"],
  ["loading", "显示加载状态，阻止重复点击", "boolean", "false"],
  ["danger / ghost / block", "危险、幽灵或块级样式", "boolean", "false"],
  ["icon", "按钮图标", "OctaneNode", "—"],
  ["htmlType", "原生 button 类型", "button | submit | reset", "button"],
  ["href / target / rel", "链接地址与打开方式", "string", "—"],
  ["onClick", "点击回调，使用原生事件", "(event: MouseEvent) => void", "—"],
  ["ref", "focus、blur 与 nativeElement", "Ref<ButtonRef>", "—"],
  ["className / style", "自定义类名与样式", "ClassValue / CSSProperties", "—"],
];
export default function ButtonPage({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Button <span>按钮</span>
        <small>Alpha</small>
      </h1>
      <p className="lead">按钮用于触发一个即时操作。</p>
      <DocMeta name="Button" />
      <h2 id="when" tabIndex={-1}>
        何时使用
      </h2>
      <p className="intro">
        需要提交表单、确认选择或执行操作时使用。一个操作区域通常只需要一个主按钮，其余操作可以使用默认、虚线、文字或链接按钮。
      </p>
      <div className="section-title">
        <h2 id="examples" tabIndex={-1}>
          代码演示
        </h2>
        <span>可运行 · 可切换主题</span>
      </div>
      <div className="demo-grid">
        <Demo
          id="basic"
          title="按钮类型"
          description="五种常用按钮类型。一个操作区域通常只需要一个主按钮。"
          source={() => import("../demos/basic.tsx?raw")}
        >
          <BasicDemo />
        </Demo>
        <Demo
          id="sizes"
          title="尺寸与形状"
          description="三种尺寸，以及圆角、圆形按钮。"
          source={() => import("../demos/sizes.tsx?raw")}
        >
          <SizesDemo />
        </Demo>
        <Demo
          id="states"
          title="状态与反馈"
          description="点击提交进入加载态，点击结束加载恢复。"
          source={() => import("../demos/states.tsx?raw")}
        >
          <StatesDemo />
        </Demo>
        <Demo
          id="nested"
          title="嵌套主题"
          description="局部覆盖主色与圆角；inherit: false 恢复独立默认主题。"
          source={() => import("../demos/nested.tsx?raw")}
        >
          <NestedDemo />
        </Demo>
        <Demo
          id="component"
          title="组件级覆盖"
          description="沿用 theme.components.Button，仅覆盖 Button 的样式。"
          source={() => import("../demos/component.tsx?raw")}
        >
          <ComponentDemo />
        </Demo>
      </div>
      <div className="section-title">
        <h2 id="api" tabIndex={-1}>
          API
        </h2>
        <span>本次原型支持范围</span>
      </div>
      <ApiTable rows={apiRows} />
      <div className="notice">
        <strong id="limitations" tabIndex={-1}>
          已知差异
        </strong>
        <p>
          尚未实现 wave 点击动效、自动中文空格、loading 延迟配置、Button.Group
          和 v5 新增的 color / variant API。事件使用原生 DOM 事件，不提供 React
          SyntheticEvent。
        </p>
      </div>
    </>
  );
}
