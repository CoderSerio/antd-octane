import { BasicDemo } from "../demos/color-picker-basic";
import { PresetsDemo } from "../demos/color-picker-presets";
import { ApiTable, Demo, DocMeta, usePageAnchor } from "../docs-ui";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        ColorPicker <span>颜色选择器</span>
        <small>Alpha</small>
      </h1>
      <p className="lead">选择、编辑并序列化纯色。</p>
      <DocMeta name="ColorPicker" />
      <h2 id="when" tabIndex={-1}>
        何时使用
      </h2>
      <p>品牌色、图表颜色等纯色配置；需要渐变或浏览器取色器时应另选方案。</p>
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <div className="demo-grid">
        <Demo
          id="basic"
          title={"受控颜色与清除"}
          description={
            "onChange 返回 Color 实例与 CSS 字符串；清除返回 cleared 颜色。"
          }
          source={() => import("../demos/color-picker-basic.tsx?raw")}
        >
          <BasicDemo />
        </Demo>
        <Demo
          id="presets"
          title={"预设与完成事件"}
          description={
            "预设、RGB 显示与禁止透明度；onChangeComplete 在一次调整完成时触发。"
          }
          source={() => import("../demos/color-picker-presets.tsx?raw")}
        >
          <PresetsDemo />
        </Demo>
      </div>
      <h2 id="api" tabIndex={-1}>
        API
      </h2>
      <p>
        以下为本页使用的支持子集。完整类型以安装包声明为准，不直接照搬上游未实现属性。
      </p>
      <ApiTable
        rows={[
          [
            "value / defaultValue",
            "纯色值；null 表示空值",
            "string | Color | null",
            "— / #1677ff",
          ],
          [
            "onChange / onChangeComplete",
            "实时变化 / 单次调整完成",
            "(color, css) => void / (color) => void",
            "—",
          ],
          [
            "allowClear / onClear",
            "允许清除，返回 cleared Color",
            "boolean / () => void",
            "false / —",
          ],
          [
            "format / defaultFormat / onFormatChange",
            "HEX、RGB、HSB 显示格式",
            "hex | rgb | hsb",
            "— / hex / —",
          ],
          [
            "disabledAlpha / disabledFormat",
            "禁用用户透明度调整 / 格式切换",
            "boolean",
            "false",
          ],
          [
            "presets",
            "带 label、colors、可选 key/defaultOpen 的分组",
            "object[]",
            "—",
          ],
          [
            "showText",
            "显示颜色文本或自定义颜色说明",
            "boolean | (color) => OctaneNode",
            "false",
          ],
          [
            "open / defaultOpen / onOpenChange",
            "受控或初始弹层状态",
            "boolean / boolean / (open) => void",
            "— / false / —",
          ],
          [
            "getPopupContainer / trigger / placement",
            "浮层容器、触发与位置",
            "function / click | hover / Popover placement",
            "provider / click / bottomLeft",
          ],
          [
            "disabled / size",
            "禁用与尺寸",
            "boolean / small | middle | large",
            "继承 provider",
          ],
        ]}
      />
      <h2 id="scope" tabIndex={-1}>
        行为与支持范围
      </h2>
      <p>
        {
          "支持十六进制和逗号分隔 RGB(A)、HSL(A)、HSB(A) 文本；非法或越界输入不会提交。Color 提供 toHexString、toRgbString、toHsbString、toCssString 等序列化方法。"
        }
      </p>
      <p>
        {
          "未实现渐变、CSS 命名色/CSS Color 4、eyedropper、自定义触发 children、panelRender、Picker/Presets 子组件及完整语义样式 API。"
        }
      </p>
      <p>
        {
          "面板用 H/S/B/A 滑块提供键盘入口，布局不与上游逐像素一致。disabledAlpha 只约束用户修改，不改写传入值。组件标签当前未完整国际化；SSR/hydration 未认证。"
        }
      </p>
    </>
  );
}
