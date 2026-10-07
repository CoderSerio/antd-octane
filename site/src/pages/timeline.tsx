import { BasicDemo, MoreDemo } from "../demos/timeline-basic";
import { ApiTable, Demo, DocMeta, usePageAnchor } from "../docs-ui";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Timeline <span>时间轴</span>
        <small>Alpha</small>
      </h1>
      <p className="lead">按时间或流程顺序展示事件记录。</p>
      <DocMeta name="Timeline" />
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <div className="demo-grid">
        <Demo
          id="basic"
          title="事件与状态"
          description="用节点颜色区分成功、失败和进行中的事件，按 items 顺序展示。"
          source={() => import("../demos/timeline-basic.tsx?raw")}
        >
          <BasicDemo />
        </Demo>
        <Demo
          id="more"
          title="交替布局与等待状态"
          description="标签与事件交替显示在时间轴两侧；pending 添加末尾的等待节点。"
          source={() => import("../demos/timeline-basic.tsx?raw")}
        >
          <MoreDemo />
        </Demo>
      </div>
      <h2 id="api" tabIndex={-1}>
        API
      </h2>
      <ApiTable
        rows={[
          [
            "items",
            "children、label、color、dot、position",
            "TimelineItem[]",
            "[]",
          ],
          ["mode", "内容布局", "left | right | alternate", "left"],
          [
            "pending / pendingDot",
            "等待中的事件与图标",
            "boolean | OctaneNode / OctaneNode",
            "false / 默认",
          ],
          ["reverse", "反向显示，不改变输入数组", "boolean", "false"],
        ]}
      />
      <h2 id="tokens" tabIndex={-1}>
        主题与支持范围
      </h2>
      <p>
        支持 tailColor、tailWidth、dotBorderWidth、dotBg、itemPaddingBottom
        和主题色。暂不支持旧 Timeline.Item 语法、逐项语义化 styles/classNames
        与完整无障碍时间关系标注。
      </p>
    </>
  );
}
