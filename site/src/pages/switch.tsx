import { BasicDemo } from "../demos/switch-basic";
import { ControlledDemo } from "../demos/switch-controlled";
import { SwitchFormBindingDemo } from "../demos/switch-form-binding";
import { SwitchSaveFlowDemo } from "../demos/switch-save-flow";
import { ApiTable, Demo, DocMeta, usePageAnchor } from "../docs-ui";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Switch <span>开关</span>
        <small>Alpha</small>
      </h1>
      <p className="lead">
        立即切换两种状态；如果修改需要提交，请使用 Checkbox。
      </p>
      <DocMeta name="Switch" />
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <div className="demo-grid">
        <Demo
          id="basic"
          title="基本使用与状态"
          description="切换普通开关，对比小号、禁用、加载和文字状态。"
          source={() => import("../demos/switch-basic.tsx?raw")}
        >
          <BasicDemo />
        </Demo>
        <Demo
          id="controlled"
          title="受控状态"
          description="checked 由外部状态决定，开关和按钮都能更新同一个值。"
          source={() => import("../demos/switch-controlled.tsx?raw")}
        >
          <ControlledDemo />
        </Demo>
        <Demo
          id="save-flow"
          title="等待保存结果"
          description="本例显式模拟成功或失败；loading 期间阻止再次切换，成功后才接受新值。"
          source={() => import("../demos/switch-save-flow.tsx?raw")}
        >
          <SwitchSaveFlowDemo />
        </Demo>
        <Demo
          id="form-binding"
          title="表单绑定"
          description="Form.Item 使用 valuePropName=&quot;checked&quot; 收集布尔值，由提交按钮保存。"
          source={() => import("../demos/switch-form-binding.tsx?raw")}
        >
          <SwitchFormBindingDemo />
        </Demo>
      </div>
      <h2 id="api" tabIndex={-1}>
        API
      </h2>
      <ApiTable
        rows={[
          ["checked / value", "受控状态；checked 优先", "boolean", "—"],
          ["defaultChecked / defaultValue", "初始状态", "boolean", "false"],
          ["onChange", "状态变化回调", "(checked, nativeEvent) => void", "—"],
          ["onClick", "点击回调", "(checked, MouseEvent) => void", "—"],
          ["size", "大小", "default | small", "default"],
          ["disabled / loading", "禁用 / 加载，均阻止操作", "boolean", "false"],
          [
            "checkedChildren / unCheckedChildren",
            "状态文字",
            "OctaneNode",
            "—",
          ],
        ]}
      />
      <h2 id="tokens" tabIndex={-1}>
        主题与支持范围
      </h2>
      <p>
        支持原生 button ref、Space / Enter 与左右方向键；继承 componentDisabled
        / componentSize。组件 token 支持轨道尺寸、padding、handle
        尺寸、背景和阴影；暂不支持 innerMargin 系列 token、wave 及完整按压动效。
        Form.Item 应设置 valuePropName="checked"。loading
        只阻止操作并显示加载状态，
        不会发起请求、自动提交或回滚状态；这些流程由调用方管理。
      </p>
    </>
  );
}
