import { BasicDemo, MoreDemo } from "../demos/input-number-basic";
import { ApiTable, Demo, DocMeta, usePageAnchor } from "../docs-ui";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        InputNumber <span>数字输入框</span>
        <small>Alpha</small>
      </h1>
      <p className="lead">输入数值，或通过键盘和步进按钮精确调整数量。</p>
      <DocMeta name="InputNumber" />
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <div className="demo-grid">
        <Demo
          id="basic"
          title="尺寸与状态"
          description="三种尺寸，以及禁用、只读和校验状态。"
          source={() => import("../demos/input-number-basic.tsx?raw")}
        >
          <BasicDemo />
        </Demo>
        <Demo
          id="more"
          title="精度、格式化与受控值"
          description="上下方向键调整 0.1；失焦后保留两位小数。金额示例配合 formatter 与 parser。"
          source={() => import("../demos/input-number-basic.tsx?raw")}
        >
          <MoreDemo />
        </Demo>
      </div>
      <h2 id="api" tabIndex={-1}>
        API
      </h2>
      <ApiTable
        rows={[
          [
            "value / defaultValue",
            "受控值 / 初始值，空值为 null",
            "number | null",
            "null",
          ],
          [
            "min / max",
            "最小值 / 最大值",
            "number",
            "Number.MIN_SAFE_INTEGER / MAX_SAFE_INTEGER",
          ],
          ["step", "每次增减的数值", "number | string", "1"],
          ["precision", "提交后的显示精度", "number", "—"],
          [
            "formatter",
            "格式化展示，info 含 userTyping 和 input",
            "(value, info) => string",
            "—",
          ],
          [
            "parser",
            "将展示文本转换为数字",
            "(text) => number | string",
            "去除逗号",
          ],
          [
            "onChange",
            "有效值变化时触发，清空时为 null",
            "(value: number | null) => void",
            "—",
          ],
          [
            "onStep",
            "步进操作后的值及方向",
            "(value, {offset, type}) => void",
            "—",
          ],
          [
            "keyboard / controls",
            "方向键步进 / 显示增减按钮",
            "boolean",
            "true",
          ],
          [
            "changeOnBlur",
            "失焦或 Enter 时规范化输入并提交",
            "boolean",
            "true",
          ],
          ["disabled / readOnly", "禁用 / 只读", "boolean", "false"],
          [
            "size / status",
            "尺寸 / 校验状态",
            "small | middle | large / error | warning",
            "middle / —",
          ],
          ["bordered", "显示边框", "boolean", "true"],
          ["ref", "input、nativeElement、focus、blur", "InputNumberRef", "—"],
        ]}
      />
      <h2 id="tokens" tabIndex={-1}>
        主题与支持范围
      </h2>
      <p>
        支持 InputNumber 的
        controlWidth、handleWidth、handleFontSize、handleVisible、handleBg、handleActiveBg、handleHoverColor、handleBorderColor，以及输入框
        paddingBlock、paddingInline、inputFontSize
        的尺寸变体、hoverBg、activeBg、hoverBorderColor、activeBorderColor
        和状态阴影 token。
      </p>
      <p>
        输入中保留负号、小数点与超范围草稿；失焦或 Enter 时校正范围和精度。受控
        value 及动态 min / max 不会自行触发 onChange。请从 onChange
        读取数值，onBlur 的 DOM value 可能包含格式化文本。
      </p>
      <p>
        目前采用 JavaScript number；十进制步进避免常见的 0.1
        累加误差，但不提供任意精度保证。暂不支持
        stringMode、decimalSeparator、前后缀和附加标签、variant、滚轮、长按重复步进、自定义
        controls 图标、修饰键加速及 focus 的 cursor 选项。键入时 formatter 可按
        userTyping 保留原始输入；自定义 parser 应返回可转换为有限数值的结果。
      </p>
    </>
  );
}
