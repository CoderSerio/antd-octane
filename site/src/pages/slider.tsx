import { BasicDemo, MoreDemo } from "../demos/slider-basic";
import { SliderCompleteDemo } from "../demos/slider-complete";
import { SliderInputNumberDemo } from "../demos/slider-input-number";
import { SliderTooltipDemo } from "../demos/slider-tooltip";
import { ApiTable, Demo, DocMeta, usePageAnchor } from "../docs-ui";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Slider <span>滑动输入条</span>
      </h1>
      <p className="lead">
        拖动滑块在数值区间中选择单值或范围，也可以使用方向键精确调整。
      </p>
      <DocMeta name="Slider" />
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <div className="demo-grid">
        <Demo
          id="basic"
          title="受控单值"
          description="鼠标、触摸和键盘均可调整音量。禁用后停止响应输入。"
          source={() => import("../demos/slider-basic.tsx?raw")}
        >
          <BasicDemo />
        </Demo>
        <Demo
          id="more"
          title="范围、刻度与方向"
          description="两个滑块保持先后顺序；step 为 null 时只选择刻度或端点。"
          source={() => import("../demos/slider-basic.tsx?raw")}
        >
          <MoreDemo />
        </Demo>
        <Demo
          id="input-number"
          title="与数字输入同步"
          description="滑块和数字输入共用受控状态，可用 0.01 步长精确调整透明度。"
          source={() => import("../demos/slider-input-number.tsx?raw")}
        >
          <SliderInputNumberDemo />
        </Demo>
        <Demo
          id="complete"
          title="操作完成回调"
          description="onChange 更新实时值；onChangeComplete 在拖动结束或键盘操作完成时记录结果。"
          source={() => import("../demos/slider-complete.tsx?raw")}
        >
          <SliderCompleteDemo />
        </Demo>
        <Demo
          id="tooltip"
          title="提示格式与独立刻度"
          description="格式化或隐藏提示；included=false 关闭选中区间填充，dots 显示步长点。"
          source={() => import("../demos/slider-tooltip.tsx?raw")}
        >
          <SliderTooltipDemo />
        </Demo>
      </div>
      <h2 id="api" tabIndex={-1}>
        API
      </h2>
      <ApiTable
        rows={[
          [
            "value / defaultValue",
            "受控 / 初始值",
            "number | [number, number]",
            "— / 0",
          ],
          ["range", "双滑块范围模式", "boolean", "false"],
          [
            "min / max / step",
            "上下界及步长；null 仅刻度",
            "number / number / number | null",
            "0 / 100 / 1",
          ],
          [
            "marks / dots / included",
            "刻度内容、步长点、区间填充",
            "Record<number, SliderMark> / boolean / boolean",
            "{} / false / true",
          ],
          ["disabled / keyboard", "禁用 / 启用键盘", "boolean", "false / true"],
          ["vertical / reverse", "纵向 / 反向", "boolean", "false"],
          [
            "onChange / onChangeComplete",
            "变化意图 / 拖动或键盘操作完成",
            "(value: SliderValue) => void",
            "—",
          ],
          [
            "tooltip",
            "标签显示和格式化",
            "{ open?: boolean; formatter?: (value) => OctaneNode | null }",
            "聚焦时显示",
          ],
        ]}
      />
      <h2 id="tokens" tabIndex={-1}>
        主题与支持范围
      </h2>
      <p>
        支持
        railSize、railBg、railHoverBg、trackBg、trackHoverBg、handleSize、handleColor、handleActiveColor、dotSize
        等 Slider token 及全局主题。支持 pointer 触摸拖动、方向键、Home / End 和
        PageUp /
        PageDown。当前范围仅支持两个不可交叉的滑块，未提供动态增删、拖动整段、range
        对象配置或 imperative
        ref。提示标签在滑块内定位，尚未接入浮层翻转和门户容器；不支持 tooltip
        placement / getPopupContainer。dots 超过 1,000 个间隔时仅绘制
        marks，避免过量节点。 onChangeComplete
        反馈的是操作结果，不负责业务提交或网络请求；受控 value 的
        外部更新不会触发该回调。与 InputNumber 联动时需要将 SliderValue
        的单值与范围类型区分开。
      </p>
    </>
  );
}
