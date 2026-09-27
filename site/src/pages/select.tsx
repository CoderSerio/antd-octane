import { BasicDemo, ControlledDemo } from "../demos/select-basic";
import { ApiTable, Demo, DocMeta, usePageAnchor } from "../docs-ui";

export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Select <span>选择器</span>
        <small>Alpha</small>
      </h1>
      <p className="lead">从有限选项中选择一个值，也可以先输入文本过滤。</p>
      <DocMeta name="Select" />
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <div className="demo-grid">
        <Demo
          id="basic"
          title="基本用法"
          description="单选、初始值、清除与禁用选项。"
          source={() => import("../demos/select-basic.tsx?raw")}
        >
          <BasicDemo />
        </Demo>
        <Demo
          id="controlled"
          title="搜索与受控值"
          description="输入文本过滤选项；由应用状态控制选中的值。"
          source={() => import("../demos/select-basic.tsx?raw")}
        >
          <ControlledDemo />
        </Demo>
      </div>
      <h2 id="api" tabIndex={-1}>
        API
      </h2>
      <ApiTable
        rows={[
          [
            "options",
            "选项，包含 value、label、disabled、title",
            "SelectOption[]",
            "必填",
          ],
          [
            "value / defaultValue",
            "受控值 / 初始值",
            "string | number | null",
            "—",
          ],
          [
            "onChange",
            "值变化回调；清除时传 undefined",
            "(value, option?) => void",
            "—",
          ],
          ["open / defaultOpen", "受控展开 / 初始展开", "boolean", "false"],
          ["onOpenChange", "展开状态变化回调", "(open) => void", "—"],
          ["showSearch", "允许输入并过滤选项", "boolean", "false"],
          [
            "searchValue / onSearch",
            "受控搜索文本 / 输入回调",
            "string / (text) => void",
            "—",
          ],
          [
            "filterOption",
            "关闭内置过滤或自定义过滤",
            "boolean | (text, option) => boolean",
            "true",
          ],
          [
            "allowClear / onClear",
            "显示清除按钮 / 清除回调",
            "boolean / () => void",
            "false",
          ],
          [
            "disabled / size / status",
            "禁用、尺寸与校验状态",
            "boolean / small | middle | large / error | warning",
            "false / middle / —",
          ],
          [
            "getPopupContainer",
            "指定浮层容器",
            "(trigger) => HTMLElement",
            "document.body",
          ],
          ["ref", "nativeElement、focus、blur", "SelectRef", "—"],
        ]}
      />
      <h2 id="scope" tabIndex={-1}>
        支持范围
      </h2>
      <p>
        当前仅支持单选。方向键移动、Home / End 跳到首尾、Enter 选中、Escape
        关闭；禁用选项不可选。搜索默认按文本标签过滤，非文本标签按 value
        过滤。尚未实现
        multiple、tags、labelInValue、选项分组、虚拟列表和完整上游样式。
      </p>
    </>
  );
}
