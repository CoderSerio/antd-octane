import { BasicDemo } from "../demos/switch-basic";
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
      <Demo
        id="basic"
        title="基本使用"
        description="切换顶部主题，观察布局与状态；展开查看完整示例。"
        source={() => import("../demos/switch-basic.tsx?raw")}
      >
        <BasicDemo />
      </Demo>
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
      </p>
    </>
  );
}
