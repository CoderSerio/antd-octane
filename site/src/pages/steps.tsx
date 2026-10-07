import { BasicDemo, MoreDemo } from "../demos/steps-basic";
import { IconsDemo } from "../demos/steps-icons";
import { ItemStatusDemo } from "../demos/steps-item-status";
import { LabelPlacementDemo } from "../demos/steps-label-placement";
import { MiniDemo } from "../demos/steps-mini";
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
        <Demo
          id="mini"
          title="迷你版"
          description="size=small 用于空间较紧凑的流程导航。"
          source={() => import("../demos/steps-mini.tsx?raw")}
        >
          <MiniDemo />
        </Demo>
        <Demo
          id="icons"
          title="带图标的步骤条"
          description="items[].icon 替换步骤数字，图标可表达登录、确认和完成。"
          source={() => import("../demos/steps-icons.tsx?raw")}
        >
          <IconsDemo />
        </Demo>
        <Demo
          id="item-status"
          title="步骤运行错误"
          description="status=error 标记当前步骤；单项 status 可覆盖自动推导的状态。"
          source={() => import("../demos/steps-item-status.tsx?raw")}
        >
          <ItemStatusDemo />
        </Demo>
        <Demo
          id="label-placement"
          title="标签放置位置"
          description="切换水平步骤的标签位置；窄屏响应式纵向排列时不采用下方标签布局。"
          source={() => import("../demos/steps-label-placement.tsx?raw")}
        >
          <LabelPlacementDemo />
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
          [
            "items[].key / title / subTitle / description",
            "键值、标题、副标题和描述",
            "string | number / OctaneNode",
            "—",
          ],
          [
            "items[].icon / status / disabled",
            "自定义图标、状态和是否允许点击",
            "OctaneNode / StepStatus / boolean",
            "— / 自动推导 / false",
          ],
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
