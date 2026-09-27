import { BasicDemo, MoreDemo } from "../demos/steps-basic";
import { ValidationGateDemo } from "../demos/steps-validation-gate";
import { ApiTable, Demo, DocMeta, usePageAnchor } from "../docs-ui";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Steps <span>步骤条</span>
        <small>Alpha</small>
      </h1>
      <p className="lead">
        引导用户按顺序完成任务，也可直接切换允许访问的步骤。
      </p>
      <DocMeta name="Steps" />
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <div className="demo-grid">
        <Demo
          id="basic"
          title="顺序流程"
          description="使用上一步、下一步推进流程；到达边界后按钮禁用。"
          source={() => import("../demos/steps-basic.tsx?raw")}
        >
          <BasicDemo />
        </Demo>
        <Demo
          id="more"
          title="可点击的纵向步骤"
          description="点击切换当前步骤，禁用项不会响应。"
          source={() => import("../demos/steps-basic.tsx?raw")}
        >
          <MoreDemo />
        </Demo>
        <Demo
          id="validation-gate"
          title="校验与错误状态"
          description="应用决定能否进入下一步；未确认条款时当前步骤显示错误，确认后可继续。"
          source={() => import("../demos/steps-validation-gate.tsx?raw")}
        >
          <ValidationGateDemo />
        </Demo>
      </div>
      <h2 id="api" tabIndex={-1}>
        API
      </h2>
      <ApiTable
        rows={[
          ["items", "步骤标题、描述、图标、状态、禁用状态", "StepItem[]", "[]"],
          ["current / initial", "当前步骤 / 起始编号", "number", "0"],
          [
            "status",
            "当前步骤状态",
            "wait | process | finish | error",
            "process",
          ],
          [
            "direction / responsive",
            "方向 / 窄屏自动纵向",
            "horizontal | vertical / boolean",
            "horizontal / true",
          ],
          [
            "size / labelPlacement",
            "尺寸 / 标签位置",
            "default | small / horizontal | vertical",
            "default / horizontal",
          ],
          ["onChange", "点击可用步骤的回调", "(current: number) => void", "—"],
        ]}
      />
      <h2 id="tokens" tabIndex={-1}>
        主题与支持范围
      </h2>
      <p>
        支持 iconSize、iconSizeSM、descriptionMaxWidth token
        及全局主题。支持自定义图标、状态和受控点击；Steps 只发出
        onChange，步骤校验与访问规则需由应用实现。progressDot、导航式 / inline
        步骤、percent 与旧版 Step 子组件未实现。
      </p>
    </>
  );
}
