import { BasicDemo } from "../demos/select-basic";
import { ControlledDemo } from "../demos/select-controlled";
import { SelectControlledOpenDemo } from "../demos/select-controlled-open";
import { SelectCoordinatedDemo } from "../demos/select-coordinated";
import { SelectFilterEmptyDemo } from "../demos/select-filter-empty";
import { ControlledMultipleDemo, MultipleDemo } from "../demos/select-multiple";
import { SelectSizesStatusDemo } from "../demos/select-sizes-status";
import { ApiTable, Code, Demo, DocMeta, usePageAnchor } from "../docs-ui";

export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Select <span>选择器</span>
      </h1>
      <p className="lead">
        从有限选项中选择一个或多个值，也可以先输入文本过滤。
      </p>
      <DocMeta name="Select" />
      <h2 id="when" tabIndex={-1}>
        何时使用
      </h2>
      <p>
        选项数量有限、用户需要从已有值中选择时使用；选项较多时可启用搜索。单选使用标量值，多选使用数组值。
      </p>
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
          source={() => import("../demos/select-controlled.tsx?raw")}
        >
          <ControlledDemo />
        </Demo>
        <Demo
          id="filter-empty"
          title="自定义过滤与空结果"
          description="filterOption 可按选项 title 过滤，notFoundContent 自定义空结果；设为 false 可保留所有选项。"
          source={() => import("../demos/select-filter-empty.tsx?raw")}
        >
          <SelectFilterEmptyDemo />
        </Demo>
        <Demo
          id="controlled-open"
          title="受控展开与选中回调"
          description="open/onOpenChange 交由应用管理；onSelect 每次选中时返回选项，禁用选项不可选。"
          source={() => import("../demos/select-controlled-open.tsx?raw")}
        >
          <SelectControlledOpenDemo />
        </Demo>
        <Demo
          id="sizes-status"
          title="尺寸与校验状态"
          description="分别设置大/小尺寸、错误与警告状态；也可从 ConfigProvider 继承尺寸。"
          source={() => import("../demos/select-sizes-status.tsx?raw")}
        >
          <SelectSizesStatusDemo />
        </Demo>
        <Demo
          id="coordinated"
          title="省市联动"
          description="切换省份后由应用重置城市，避免保留不属于当前省份的值。"
          source={() => import("../demos/select-coordinated.tsx?raw")}
        >
          <SelectCoordinatedDemo />
        </Demo>
        <Demo
          id="multiple"
          title="多选与搜索"
          description="多选默认支持搜索；选中后保持菜单展开，可移除已选项或一次清空。"
          source={() => import("../demos/select-multiple.tsx?raw")}
        >
          <MultipleDemo />
        </Demo>
        <Demo
          id="controlled-multiple"
          title="受控多选与移除回调"
          description="由数组状态管理选中项，onSelect / onDeselect 区分选择和移除。"
          source={() => import("../demos/select-multiple.tsx?raw")}
        >
          <ControlledMultipleDemo />
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
          ["mode", "选择模式；省略为单选", "multiple", "—"],
          [
            "value / defaultValue",
            "受控值 / 初始值",
            "SelectValue | null / SelectValue[]（多选）",
            "—",
          ],
          [
            "onChange",
            "单选清除传 undefined，多选清除传 []；多选返回值与选项数组",
            "(value, option?) => void",
            "—",
          ],
          ["onDeselect", "多选移除选项时调用", "(value, option) => void", "—"],
          ["onSelect", "选中选项时调用", "(value, option) => void", "—"],
          ["open / defaultOpen", "受控展开 / 初始展开", "boolean", "false"],
          ["onOpenChange", "展开状态变化回调", "(open) => void", "—"],
          [
            "showSearch",
            "允许输入并过滤选项",
            "boolean",
            "单选 false / 多选 true",
          ],
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
          ["notFoundContent", "没有匹配项时的内容", "OctaneNode", "无匹配结果"],
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
      <h2 id="types" tabIndex={-1}>
        选项与回调类型
      </h2>
      <p>
        SelectValue、SelectOption 可从 antd-octane 导入；label 使用 Octane
        节点。单选与多选回调签名不同：
      </p>
      <Code
        language="ts"
        source={`import type { OctaneNode } from "octane";

type SelectValue = string | number;
interface SelectOption {
  value: SelectValue;
  label?: OctaneNode;
  disabled?: boolean;
  title?: string;
}
// 单选 onChange（清除时 value 为 undefined）
type SingleChange = (value: SelectValue | undefined, option?: SelectOption) => void;
// mode="multiple" 的 onChange（清除时两个数组均为空）
type MultipleChange = (values: SelectValue[], options: SelectOption[]) => void;`}
      />
      <h2 id="scope" tabIndex={-1}>
        支持范围
      </h2>
      <p>
        支持单选与多选。方向键移动、Enter 切换选项、Escape
        关闭；禁用选项不可选或移除。非搜索模式 Home / End
        跳到首尾，搜索模式保留文本光标行为。多选搜索为空时 Backspace
        移除最后一个可移除项。搜索默认按文本标签过滤，非文本标签按 value
        过滤。尚未实现 tags、labelInValue、选项分组、虚拟列表和完整上游样式。
        带搜索时可用 searchValue/onSearch 控制搜索文本；这与已选中的 value
        是两份独立状态。
      </p>
      <p>
        联动选项由应用负责同步：改变 options 不会自动清空已有
        value。单选清除回调传入 undefined，受控场景可将其转换为
        null；多选传入空数组。远程搜索可通过 onSearch 更新 options
        并关闭内置过滤，但目前没有内置请求、loading 或防抖能力。
      </p>
      <p>
        未发布源码支持省略 options、prefixCls / rootClassName 和 ConfigProvider
        的 select 样式默认值。默认空状态改用简洁 Empty，
        并继承语言、renderEmpty、弹层容器和方向；完整语义样式与选择器 DOM
        结构仍未覆盖。
      </p>
      <p>
        未发布源码已支持 popupMatchSelectWidth 和兼容参数
        dropdownMatchSelectWidth，组件参数优先于 ConfigProvider 配置。 true
        与输入框等宽，false 保留最小宽度并可随内容扩展，数值指定宽度。
        弹层使用绝对定位；选项圆角、选中样式和禁用颜色已接入对应主题 Token。
        这些定向检查不代表 Select 的全部上游行为已实现。
      </p>
    </>
  );
}
