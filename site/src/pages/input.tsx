import { InputBasicDemo } from "../demos/input-basic";
import { InputControlledDemo } from "../demos/input-controlled";
import {
  InputAffixDemo,
  InputPasswordDemo,
  InputSearchDemo,
  InputTextAreaDemo,
} from "../demos/input-extended";
import { InputRefDemo } from "../demos/input-ref";
import { InputSizesDemo } from "../demos/input-sizes";
import { InputStatesDemo } from "../demos/input-states";
import { ApiTable, Demo, DocMeta, usePageAnchor } from "../docs-ui";
export default function InputPage({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Input <span>输入框</span>
        <small>Alpha</small>
      </h1>
      <p className="lead">通过鼠标或键盘输入内容，是基础的表单域。</p>
      <DocMeta name="Input" />
      <h2 id="when" tabIndex={-1}>
        何时使用
      </h2>
      <p>
        需要输入单行文本、邮箱等内容时使用。通过 label 或 aria-label
        提供明确名称，placeholder 用于补充提示。
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
          title="基本使用"
          description="基础输入框。defaultValue 设置非受控输入的初始值。"
          source={() => import("../demos/input-basic.tsx?raw")}
        >
          <InputBasicDemo />
        </Demo>
        <Demo
          id="sizes"
          title="三种大小"
          description="大号 40px、默认 32px、小号 24px；主题可以调整。"
          source={() => import("../demos/input-sizes.tsx?raw")}
        >
          <InputSizesDemo />
        </Demo>
        <Demo
          id="controlled"
          title="受控输入"
          description="onChange 每次输入时触发，Enter 确认。输入法组合期间不触发 onPressEnter。"
          source={() => import("../demos/input-controlled.tsx?raw")}
        >
          <InputControlledDemo />
        </Demo>
        <Demo
          id="states"
          title="状态"
          description="错误、警告、禁用和只读。业务校验逻辑由调用方负责。"
          source={() => import("../demos/input-states.tsx?raw")}
        >
          <InputStatesDemo />
        </Demo>
        <Demo
          id="refs"
          title="聚焦与选择"
          description="通过 ref.current 调用 focus、blur 和 select。"
          source={() => import("../demos/input-ref.tsx?raw")}
        >
          <InputRefDemo />
        </Demo>
        <Demo
          id="affix"
          title="前后缀与清除"
          description="在框内补充单位，或在框外组合域名标签。清除按钮保留输入焦点。"
          source={() => import("../demos/input-extended.tsx?raw")}
        >
          <InputAffixDemo />
        </Demo>
        <Demo
          id="password"
          title="密码输入"
          description="点击眼睛切换密码可见状态，不改变输入值。"
          source={() => import("../demos/input-extended.tsx?raw")}
        >
          <InputPasswordDemo />
        </Demo>
        <Demo
          id="search"
          title="搜索框"
          description="点击搜索或按 Enter 确认；输入法组合时不会误触发搜索。"
          source={() => import("../demos/input-extended.tsx?raw")}
        >
          <InputSearchDemo />
        </Demo>
        <Demo
          id="textarea"
          title="自动高度文本域"
          description="根据内容和宽度调整高度，达到最大行数后在框内滚动。"
          source={() => import("../demos/input-extended.tsx?raw")}
        >
          <InputTextAreaDemo />
        </Demo>
      </div>
      <h2 id="api" tabIndex={-1}>
        API
      </h2>
      <ApiTable
        rows={[
          ["value / defaultValue", "受控值 / 初始值", "string | number", "—"],
          [
            "size",
            "输入框尺寸，可继承 ConfigProvider",
            "small | middle | large",
            "middle",
          ],
          ["prefix / suffix", "框内前后缀", "OctaneNode", "—"],
          ["addonBefore / addonAfter", "框外组合标签", "OctaneNode", "—"],
          [
            "allowClear / onClear",
            "清除按钮及回调；只读或禁用时隐藏",
            "boolean | { clearIcon? } / () => void",
            "false / —",
          ],
          [
            "Password.visibilityToggle",
            "切换可见状态或受控配置",
            "boolean | { visible?, onVisibleChange? }",
            "true",
          ],
          [
            "Password.iconRender",
            "自定义可见切换图标",
            "(visible) => OctaneNode",
            "眼睛图标",
          ],
          [
            "Search.enterButton / loading",
            "搜索按钮内容 / 加载状态",
            "boolean | OctaneNode / boolean",
            "false / false",
          ],
          [
            "Search.onSearch",
            "搜索或清除回调",
            "(value, event, { source: input | clear }) => void",
            "—",
          ],
          [
            "TextArea.autoSize",
            "自动高度及行数范围",
            "boolean | { minRows?, maxRows? }",
            "false",
          ],
          [
            "TextArea.ref",
            "nativeElement、resizableTextArea.textArea、focus/blur/select",
            "Ref<TextAreaRef>",
            "—",
          ],
          ["status", "校验状态", "error | warning", "—"],
          ["disabled / readOnly", "禁用 / 只读", "boolean", "false"],
          [
            "onChange",
            "每次原生 input 事件时调用",
            "(event: InputChangeEvent) => void",
            "—",
          ],
          [
            "onPressEnter",
            "非组合输入时的 Enter 回调",
            "(event: KeyboardEvent) => void",
            "—",
          ],
          [
            "ref",
            "input、nativeElement、focus、blur、select",
            "Ref<InputRef>",
            "—",
          ],
          [
            "name / type / placeholder / maxLength",
            "原生 input 属性",
            "原生属性类型",
            "—",
          ],
        ]}
      />
      <h2 id="tokens" tabIndex={-1}>
        主题变量
      </h2>
      <p>
        支持全局主题与 components.Input 覆盖。可设置 paddingBlock、paddingInline
        及 SM/LG 变体、inputFontSize 及 SM/LG
        变体、activeBorderColor、hoverBorderColor、activeShadow、errorActiveShadow、warningActiveShadow、hoverBg、activeBg。
      </p>
      <div className="notice">
        <strong id="limitations" tabIndex={-1}>
          已知差异
        </strong>
        <p>
          尚不支持 variant、showCount/count、OTP、Password 的 hover action
          和语义 styles/classNames。Search.enterButton
          的节点作为按钮内容，不支持传入嵌套按钮。 autoSize 基于原生
          scrollHeight，暂不支持 onResize 或隐藏容器的预测量。
          改变前后缀/组合结构可能重建输入节点；需要保留焦点时请保留相应包裹结构。
          事件采用原生 Event；清除生成 input 事件，Search 的清除回调为 source:
          clear。 TextArea.ref 与 InputRef 不同，详见上表。 Form.Item
          已验证直接绑定基础 Input；复杂输入变体仍需分别验证。
        </p>
      </div>
    </>
  );
}
