import { AutoCompleteBasicDemo } from "../demos/auto-complete-basic";
import { AutoCompleteClearDemo } from "../demos/auto-complete-clear";
import { AutoCompleteControlledDemo } from "../demos/auto-complete-controlled";
import { AutoCompleteDynamicDemo } from "../demos/auto-complete-dynamic";
import { AutoCompleteEmptyOpenDemo } from "../demos/auto-complete-empty-open";
import { AutoCompleteFilterDemo } from "../demos/auto-complete-filter";
import { AutoCompleteRefContainerDemo } from "../demos/auto-complete-ref-container";
import { AutoCompleteStatesDemo } from "../demos/auto-complete-states";
import { ApiTable, Demo, DocMeta, usePageAnchor } from "../docs-ui";

export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        AutoComplete <span>自动完成</span>
      </h1>
      <p className="lead">自由输入文本，同时从建议列表中补全内容。</p>
      <DocMeta name="AutoComplete" />
      <h2 id="when" tabIndex={-1}>
        何时使用
      </h2>
      <p>
        为邮箱、搜索词等文本提供输入建议时使用。用户可以提交不在建议列表中的内容；需要限制为已有选项时使用
        Select。
      </p>
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <div className="demo-grid">
        <Demo
          id="basic"
          title="自由输入"
          description="非受控初始值、建议列表和禁用选项。输入值不受 options 限制。"
          source={() => import("../demos/auto-complete-basic.tsx?raw")}
        >
          <AutoCompleteBasicDemo />
        </Demo>
        <Demo
          id="dynamic"
          title="动态邮箱建议"
          description="onSearch 根据输入生成建议；选中建议不会再次触发搜索。"
          source={() => import("../demos/auto-complete-dynamic.tsx?raw")}
        >
          <AutoCompleteDynamicDemo />
        </Demo>
        <Demo
          id="controlled"
          title="受控值与事件"
          description="onChange 管理所有值变化，onSearch 记录输入，onSelect 记录选中建议；label 只用于显示，输入框填入 value。"
          source={() => import("../demos/auto-complete-controlled.tsx?raw")}
        >
          <AutoCompleteControlledDemo />
        </Demo>
        <Demo
          id="filter"
          title="内置与自定义过滤"
          description="按 value 过滤，或由函数同时匹配中英文；没有匹配建议时仍可自由输入。"
          source={() => import("../demos/auto-complete-filter.tsx?raw")}
        >
          <AutoCompleteFilterDemo />
        </Demo>
        <Demo
          id="clear"
          title="清除与回调"
          description="清除触发 onClear，并以空字符串更新值与搜索文本，不会触发 onSelect。"
          source={() => import("../demos/auto-complete-clear.tsx?raw")}
        >
          <AutoCompleteClearDemo />
        </Demo>
        <Demo
          id="states"
          title="尺寸、状态与禁用"
          description="继承 ConfigProvider 尺寸和禁用状态，展示小号、错误、警告和只读。status 表示外观，不执行业务校验。"
          source={() => import("../demos/auto-complete-states.tsx?raw")}
        >
          <AutoCompleteStatesDemo />
        </Demo>
        <Demo
          id="empty-open"
          title="空列表与受控展开"
          description="请求展开与实际浮层可见性不同：空 options、禁用或只读时不会显示菜单。"
          source={() => import("../demos/auto-complete-empty-open.tsx?raw")}
        >
          <AutoCompleteEmptyOpenDemo />
        </Demo>
        <Demo
          id="ref-container"
          title="聚焦与局部浮层"
          description="通过 ref 聚焦或移开焦点，用 getPopupContainer 指定浮层容器。"
          source={() => import("../demos/auto-complete-ref-container.tsx?raw")}
        >
          <AutoCompleteRefContainerDemo />
        </Demo>
      </div>
      <h2 id="api" tabIndex={-1}>
        API
      </h2>
      <ApiTable
        rows={[
          [
            "options",
            "建议项，包含 value、label、disabled、title",
            "AutoCompleteOption[]",
            "[]",
          ],
          [
            "value / defaultValue",
            "受控文本 / 非受控初始文本",
            "string",
            "— / 空字符串",
          ],
          [
            "onChange",
            "文本改变时触发，包括输入、选择和清除；相同值不重复触发",
            "(value: string) => void",
            "—",
          ],
          [
            "onSearch",
            "输入时触发；清除传空字符串；选择建议和外部设置 value 不触发",
            "(value: string) => void",
            "—",
          ],
          [
            "onSelect",
            "选中建议时触发，返回 value 和原始选项",
            "(value, option) => void",
            "—",
          ],
          [
            "open / defaultOpen",
            "受控展开请求 / 初始展开请求；空建议不显示浮层",
            "boolean",
            "false",
          ],
          ["onOpenChange", "展开请求变化回调", "(open: boolean) => void", "—"],
          [
            "filterOption",
            "false 保留建议；true 按 value 忽略大小写过滤；函数自定义",
            "boolean | (text, option) => boolean",
            "false",
          ],
          [
            "defaultActiveFirstOption",
            "展开时默认高亮第一个可用建议",
            "boolean",
            "false",
          ],
          [
            "allowClear / onClear",
            "清除按钮及清除回调",
            "boolean | { clearIcon?: OctaneNode } / () => void",
            "false / —",
          ],
          [
            "disabled / readOnly",
            "禁用 / 只读；两者均禁止选择及清除",
            "boolean",
            "false",
          ],
          [
            "size / status",
            "尺寸 / 校验外观",
            "small | middle | large / error | warning",
            "middle / —",
          ],
          [
            "getPopupContainer",
            "指定浮层容器，trigger 为输入框外层元素",
            "(trigger: HTMLElement) => HTMLElement",
            "document.body",
          ],
          [
            "onInputKeyDown",
            "输入框键盘事件；preventDefault 可阻止组件处理",
            "(event: KeyboardEvent) => void",
            "—",
          ],
          [
            "ref",
            "nativeElement、input、focus(options?)、blur()",
            "AutoCompleteRef",
            "—",
          ],
          [
            "原生输入属性",
            "支持 name、required、maxLength、placeholder、aria 属性及原生事件；onChange 为值回调，onInput 由组件管理",
            "InputHTMLAttributes（排除冲突项）",
            "—",
          ],
        ]}
      />
      <h2 id="scope" tabIndex={-1}>
        支持范围
      </h2>
      <p>
        支持自由文本、单个建议选择、受控与非受控值、过滤、清除和浮层容器。方向键在展开的列表内导航并跳过禁用项；菜单关闭时方向键先展开。Enter
        有高亮建议时选中，没有高亮时保留文本并关闭菜单；Escape 和 Tab 关闭。Home
        / End 保留原生文本光标行为。
      </p>
      <p>
        默认不高亮首项、不按输入过滤，适用于应用自己生成 suggestions
        的场景。输入法组合期间仍触发 onChange 和
        onSearch，但不执行键盘选择；受控输入应由 onChange 更新 value，不要仅靠
        onSearch 管理文本。清除后的受控 value 是否变化由调用方决定。
      </p>
      <p>
        空 options 不显示空菜单；即使 open=true 也一样。getPopupContainer
        的目标容器需要合理的定位与溢出样式。尚未支持自定义输入子元素、分组选项、虚拟列表、backfill、popupRender、variant
        和完整语义样式配置；远程请求、防抖、竞态控制和输入校验由应用实现。
      </p>
    </>
  );
}
