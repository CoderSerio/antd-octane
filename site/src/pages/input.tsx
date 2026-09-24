import { InputBasicDemo } from "../demos/input-basic";
import { InputControlledDemo } from "../demos/input-controlled";
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
          目前只提供基础 Input。尚不支持
          prefix、suffix、allowClear、addonBefore/After、variant、showCount、Search、Password、TextArea、OTP
          和 Form 集成。事件为原生事件，不提供 SyntheticEvent。
        </p>
      </div>
    </>
  );
}
