import type { ButtonToken } from "antd-octane";
import { BasicDemo } from "../demos/basic";
import { ComponentDemo } from "../demos/component";
import { NestedDemo } from "../demos/nested";
import { SizesDemo } from "../demos/sizes";
import { StatesDemo } from "../demos/states";
import { ApiTable, Code, Demo, DocMeta, usePageAnchor } from "../docs-ui";

const tokenDescriptions = {
  fontWeight: ["文字字重", 'CSSProperties["fontWeight"]', "400"],
  iconGap: ["图标与文字间距", "number", "marginXS"],
  defaultShadow: [
    "默认按钮阴影",
    "string",
    "0 {controlOutlineWidth}px 0 {controlTmpOutline}",
  ],
  primaryShadow: [
    "主要按钮阴影",
    "string",
    "0 {controlOutlineWidth}px 0 {controlOutline}",
  ],
  dangerShadow: [
    "危险按钮阴影",
    "string",
    "0 {controlOutlineWidth}px 0 {colorErrorOutline}",
  ],
  primaryColor: ["主要按钮文字色", "string", "colorTextLightSolid"],
  dangerColor: ["危险主要按钮文字色", "string", "colorTextLightSolid"],
  defaultColor: ["默认文字色", "string", "colorText"],
  defaultBg: ["默认背景色", "string", "colorBgContainer"],
  defaultBorderColor: ["默认边框色", "string", "colorBorder"],
  defaultHoverBg: ["默认按钮悬停背景", "string", "colorBgContainer"],
  defaultHoverColor: ["默认按钮悬停文字", "string", "colorPrimaryHover"],
  defaultHoverBorderColor: ["默认按钮悬停边框", "string", "colorPrimaryHover"],
  defaultActiveBg: ["默认按钮按下背景", "string", "colorBgContainer"],
  defaultActiveColor: ["默认按钮按下文字", "string", "colorPrimaryActive"],
  defaultActiveBorderColor: [
    "默认按钮按下边框",
    "string",
    "colorPrimaryActive",
  ],
  borderColorDisabled: ["禁用边框色", "string", "colorBorder"],
  defaultGhostColor: ["默认幽灵按钮文字", "string", "colorBgContainer"],
  defaultGhostBorderColor: ["默认幽灵按钮边框", "string", "colorBgContainer"],
  ghostBg: ["幽灵按钮背景", "string", "transparent"],
  paddingInline: [
    "中号横向内边距",
    "number",
    "paddingContentHorizontal - lineWidth",
  ],
  paddingInlineLG: [
    "大号横向内边距",
    "number",
    "paddingContentHorizontal - lineWidth",
  ],
  paddingInlineSM: ["小号横向内边距", "number", "8 - lineWidth"],
  contentFontSize: ["中号文字大小", "number", "fontSize"],
  contentFontSizeLG: ["大号文字大小", "number", "fontSizeLG"],
  contentFontSizeSM: ["小号文字大小", "number", "fontSize"],
  textTextColor: ["文字按钮文字色", "string", "colorText"],
  textTextHoverColor: ["文字按钮悬停文字", "string", "colorText"],
  textTextActiveColor: ["文字按钮按下文字", "string", "colorText"],
  textHoverBg: ["文字按钮悬停背景", "string", "colorFillTertiary"],
  linkHoverBg: ["链接按钮悬停背景", "string", "transparent"],
} satisfies Record<keyof ButtonToken, [string, string, string]>;

const apiRows = [
  [
    "type",
    "设置按钮类型",
    "default | primary | dashed | text | link",
    "default",
  ],
  [
    "size",
    "设置按钮大小",
    "small | middle | large",
    "ConfigProvider.componentSize 或 middle",
  ],
  ["shape", "设置按钮形状", "default | circle | round", "default"],
  [
    "disabled",
    "禁用按钮",
    "boolean",
    "ConfigProvider.componentDisabled 或 false",
  ],
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
        <span>当前 alpha 支持范围</span>
      </div>
      <ApiTable rows={apiRows} />
      <h2 id="refs" tabIndex={-1}>
        事件与 ref
      </h2>
      <p>
        onClick 接收原生 MouseEvent；disabled 或 loading 时不调用业务回调。
        htmlType 默认为 button，需要提交原生表单时显式设置 submit。 ref.current
        提供 focus(options?)、blur() 和 nativeElement；href
        存在时原生节点为链接。
      </p>
      <Code
        source={
          'import { useRef } from "octane";\nimport { Button, type ButtonRef } from "antd-octane";\n\nexport function FocusExample() {\n  const buttonRef = useRef<ButtonRef | null>(null);\n  return <>\n    <Button ref={buttonRef}>目标按钮</Button>\n    <Button onClick={() => buttonRef.current?.focus()}>聚焦目标</Button>\n  </>;\n}'
        }
      />
      <h2 id="tokens" tabIndex={-1}>
        主题变量
      </h2>
      <p>
        在 ConfigProvider 的 theme.components.Button 中覆盖下列变量。
        默认值列中的 token 名称表示从当前主题派生，并非固定亮色值；
        数字间距和字号的单位为 px。字重无单位。
      </p>
      <ApiTable
        headers={["Token", "说明", "类型", "默认值 / 派生来源"]}
        label="Button 主题变量，可横向滚动"
        rows={Object.entries(tokenDescriptions).map(([name, details]) => [
          name,
          ...details,
        ])}
      />
      <p>
        还可覆盖 Button 使用的全局 alias token，例如 colorPrimary、controlHeight
        和 borderRadius。组件配置默认直接覆盖；algorithm: true 跟随全局算法，
        也可传入组件算法。详见{" "}
        <a className="text-link" href="#theme/component-token">
          组件主题配置
        </a>
        。
      </p>
      <h2 id="limitations" tabIndex={-1}>
        已知差异
      </h2>
      <div className="notice">
        <p>
          尚未实现 wave 点击动效、自动中文空格、loading 延迟配置、Button.Group
          和 color / variant、iconPosition、语义 classNames / styles API。
          contentLineHeight、onlyIconSize、groupBorderColor 和 paddingBlock
          等未列出的 组件 token 不支持。事件使用原生 DOM 事件，不提供 React
          SyntheticEvent。
        </p>
      </div>
      <h2 id="faq" tabIndex={-1}>
        常见问题
      </h2>
      <h3>按钮没有样式怎么办？</h3>
      <p>
        确认入口显式导入 antd-octane/style.css。样式位于 @layer
        antd，未分层的应用 CSS 可以覆盖它。
      </p>
      <h3>loading 可以传入延迟配置吗？</h3>
      <p>
        当前只接收
        boolean。需要延迟显示时由业务管理计时器与状态，并在组件卸载时清理计时器。
      </p>
      <h3>href 按钮可以传入所有链接属性吗？</h3>
      <p>
        href 模式渲染 a，支持
        href、target、rel、id、title、aria-label、aria-describedby 和 tabIndex
        等实现中明确透传的属性，不等价于完整 anchor 属性集合。
        禁用或加载时会移除 href 并阻止点击；图标按钮请提供 aria-label。
      </p>
    </>
  );
}
