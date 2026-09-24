import { BasicDemo } from "../demos/basic";
import { ComponentDemo } from "../demos/component";
import { NestedDemo } from "../demos/nested";
import { SizesDemo } from "../demos/sizes";
import { StatesDemo } from "../demos/states";
import { Demo, usePageAnchor } from "../docs-ui";

const apiRows = [
  ["type", "default | primary | dashed | text | link", "default"],
  ["size", "small | middle | large", "middle"],
  ["shape", "default | circle | round", "default"],
  ["disabled / loading / danger / ghost / block", "boolean", "false"],
  ["icon / children", "OctaneNode", "—"],
  ["htmlType", "button | submit | reset", "button"],
  ["href / target / rel", "string（href 渲染为链接）", "—"],
  ["onClick", "(event: MouseEvent) => void，原生事件", "—"],
  ["ref", "{ nativeElement, focus(), blur() }", "—"],
  ["className / style", "自定义类名 / CSS 属性", "—"],
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
      <div className="doc-meta">
        <span>使用</span>
        <code>import {"{ Button }"} from "antd-octane";</code>
        <span>参考</span>
        <a
          href="https://ant.design/components/button-cn/"
          target="_blank"
          rel="noreferrer"
        >
          Ant Design Button ↗
        </a>
      </div>
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
      <Demo
        title="按钮类型"
        description="五种常用按钮类型。一个操作区域通常只需要一个主按钮。"
        source={() => import("../demos/basic.tsx?raw")}
      >
        <BasicDemo />
      </Demo>
      <div className="demo-grid">
        <Demo
          title="尺寸与形状"
          description="三种尺寸，以及圆角、圆形按钮。"
          source={() => import("../demos/sizes.tsx?raw")}
        >
          <SizesDemo />
        </Demo>
        <Demo
          title="状态与反馈"
          description="点击提交进入加载态，点击结束加载恢复。"
          source={() => import("../demos/states.tsx?raw")}
        >
          <StatesDemo />
        </Demo>
      </div>
      <Demo
        title="嵌套主题"
        description="局部覆盖主色与圆角；inherit: false 恢复独立默认主题。"
        source={() => import("../demos/nested.tsx?raw")}
      >
        <NestedDemo />
      </Demo>
      <Demo
        title="组件级覆盖"
        description="沿用 theme.components.Button，仅覆盖 Button 的样式。"
        source={() => import("../demos/component.tsx?raw")}
      >
        <ComponentDemo />
      </Demo>
      <div className="section-title">
        <h2 id="api" tabIndex={-1}>
          API
        </h2>
        <span>本次原型支持范围</span>
      </div>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>属性</th>
              <th>说明 / 类型</th>
              <th>默认值</th>
            </tr>
          </thead>
          <tbody>
            {apiRows.map(([name, desc, fallback]) => (
              <tr key={name}>
                <td>
                  <code>{name}</code>
                </td>
                <td>{desc}</td>
                <td>{fallback}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
