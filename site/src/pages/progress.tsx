import { BasicDemo, MoreDemo } from "../demos/progress-basic";
import { VerificationDemo } from "../demos/progress-verification";
import { ApiTable, Demo, DocMeta, usePageAnchor } from "../docs-ui";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Progress <span>进度条</span>
        <small>Alpha</small>
      </h1>
      <p className="lead">
        展示任务的完成比例；只有完成量可计算时才使用百分比。
      </p>
      <DocMeta name="Progress" />
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <div className="demo-grid">
        <Demo
          id="basic"
          title="进度与状态"
          description="普通、活动、异常和成功状态，以及分段完成的进度。"
          source={() => import("../demos/progress-basic.tsx?raw")}
        >
          <BasicDemo />
        </Demo>
        <Demo
          id="more"
          title="圆形、仪表盘与步骤"
          description="点击按钮增减进度，观察不同形态如何表达同一份状态。"
          source={() => import("../demos/progress-basic.tsx?raw")}
        >
          <MoreDemo />
        </Demo>
        <Demo
          id="verification"
          title="传输完成后的校验进度"
          description="总进度保持 100%，success.percent 表示已确认成功的部分；format 显示校验状态。"
          source={() => import("../demos/progress-verification.tsx?raw")}
        >
          <VerificationDemo />
        </Demo>
      </div>
      <h2 id="api" tabIndex={-1}>
        API
      </h2>
      <ApiTable
        rows={[
          ["percent", "完成百分比；超出范围会限制到 0–100", "number", "0"],
          ["type", "进度条形态", "line | circle | dashboard", "line"],
          [
            "status",
            "状态；完成时自动显示成功，active 动效用于线形",
            "normal | active | exception | success",
            "normal",
          ],
          [
            "showInfo / format",
            "显示进度信息 / 自定义信息内容",
            "boolean / (percent, successPercent) => OctaneNode",
            "true / —",
          ],
          ["success", "已成功完成部分", "{ percent?, strokeColor? }", "—"],
          [
            "strokeColor / trailColor",
            "进度颜色 / 底色",
            "string | 渐变配置 / string",
            "主题值",
          ],
          [
            "size / strokeWidth",
            "整体尺寸 / 线条粗细",
            "default | small | number | [number, number] / number",
            "default / 随形态变化",
          ],
          ["strokeLinecap", "线段端点样式", "round | butt | square", "round"],
          ["steps", "线形进度条的分段数量", "number", "—"],
          [
            "gapDegree / gapPosition",
            "圆形缺口角度 / 位置",
            "number / top | bottom | left | right",
            "随形态变化 / bottom",
          ],
        ]}
      />
      <h2 id="tokens" tabIndex={-1}>
        主题与支持范围
      </h2>
      <p>
        跟随全局颜色与暗色、紧凑算法，支持 Progress 组件
        token：defaultColor、remainingColor、circleTextColor、circleTextFontSize、lineBorderRadius。支持线形分段；分段模式暂不支持渐变与逐段颜色数组，暂不支持圆形分段、percentPosition、rounding、旧
        width 属性和完整的上游语义样式配置。渐变 direction
        仅作用于线形，分段数量最多为 1000。
      </p>
    </>
  );
}
