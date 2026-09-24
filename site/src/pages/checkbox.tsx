import { CheckboxAllDemo } from "../demos/checkbox-all";
import { CheckboxBasicDemo } from "../demos/checkbox-basic";
import { CheckboxControlledDemo } from "../demos/checkbox-controlled";
import { CheckboxStatesDemo } from "../demos/checkbox-states";
import { ApiTable, Demo, DocMeta, usePageAnchor } from "../docs-ui";
export default function CheckboxPage({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Checkbox <span>多选框</span>
        <small>Alpha</small>
      </h1>
      <p className="lead">在一组选项中进行多项选择。</p>
      <DocMeta name="Checkbox" />
      <h2 id="when" tabIndex={-1}>
        何时使用
      </h2>
      <p>
        用于表示一个选项的选中与未选中状态，也可以组合多个选项。与开关不同，多选框通常作为表单的一部分提交。
      </p>
      <div className="section-title">
        <h2 id="examples" tabIndex={-1}>
          代码演示
        </h2>
        <span>可运行 · 支持键盘</span>
      </div>
      <div className="demo-grid">
        <Demo
          id="basic"
          title="基本使用"
          description="点击文字或方框均可切换；聚焦后按空格操作。"
          source={() => import("../demos/checkbox-basic.tsx?raw")}
        >
          <CheckboxBasicDemo />
        </Demo>
        <Demo
          id="states"
          title="不可用"
          description="禁用状态会阻止交互，可以继承 ConfigProvider 的禁用配置。"
          source={() => import("../demos/checkbox-states.tsx?raw")}
        >
          <CheckboxStatesDemo />
        </Demo>
        <Demo
          id="controlled"
          title="受控选择"
          description="使用 checked 与 onChange，由调用方管理状态。"
          source={() => import("../demos/checkbox-controlled.tsx?raw")}
        >
          <CheckboxControlledDemo />
        </Demo>
        <Demo
          id="all"
          title="全选与中间态"
          description="indeterminate 表示部分选中。本例由独立 Checkbox 组合，不依赖 Group。"
          source={() => import("../demos/checkbox-all.tsx?raw")}
        >
          <CheckboxAllDemo />
        </Demo>
      </div>
      <h2 id="api" tabIndex={-1}>
        API
      </h2>
      <ApiTable
        rows={[
          [
            "checked / defaultChecked",
            "受控状态 / 初始状态",
            "boolean",
            "false",
          ],
          ["indeterminate", "中间态，独立于 checked", "boolean", "false"],
          ["disabled", "禁用，可继承 ConfigProvider", "boolean", "false"],
          [
            "onChange",
            "状态变化，读取 event.target.checked",
            "(event: CheckboxChangeEvent) => void",
            "—",
          ],
          [
            "value / name",
            "原生表单提交的值和名称",
            "原生 input 属性类型",
            "—",
          ],
          ["ref", "input、nativeElement、focus、blur", "Ref<CheckboxRef>", "—"],
          ["children", "关联的标签内容", "OctaneNode", "—"],
        ]}
      />
      <h2 id="tokens" tabIndex={-1}>
        主题变量
      </h2>
      <p>
        跟随全局主题，可通过 components.Checkbox 覆盖
        colorPrimary、colorPrimaryHover、colorBorder、borderRadiusSM、controlInteractiveSize
        等全局 token。支持暗色、紧凑和嵌套主题。
      </p>
      <div className="notice">
        <strong id="limitations" tabIndex={-1}>
          已知差异
        </strong>
        <p>
          尚未提供 Checkbox.Group、options 或 Form.Item 集成，未实现上游 wave
          动效。回调提供
          target.checked、target.value、nativeEvent、preventDefault 与
          stopPropagation，不提供 React SyntheticEvent。
        </p>
      </div>
    </>
  );
}
