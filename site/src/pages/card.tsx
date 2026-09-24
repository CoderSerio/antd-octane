import { BasicDemo, MoreDemo } from "../demos/card-basic";
import { ApiTable, Demo, DocMeta, usePageAnchor } from "../docs-ui";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Card <span>卡片</span>
        <small>Alpha</small>
      </h1>
      <p className="lead">将相关信息和操作组合在一个容器内。</p>
      <DocMeta name="Card" />
      <h2 id="when" tabIndex={-1}>
        何时使用
      </h2>
      <p>适用于信息概览、项目列表和独立内容区块。</p>
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <div className="demo-grid">
        <Demo
          id="basic"
          title="基本使用"
          description="常用形态与状态，主题配置跟随页面切换。"
          source={() => import("../demos/card-basic.tsx?raw")}
        >
          <BasicDemo />
        </Demo>
        <Demo
          id="more"
          title="组合与交互"
          description="结合业务内容验证配置和交互。"
          source={() => import("../demos/card-basic.tsx?raw")}
        >
          <MoreDemo />
        </Demo>
      </div>
      <h2 id="api" tabIndex={-1}>
        API
      </h2>
      <ApiTable
        rows={[
          ["title / extra / cover", "标题、附加操作与封面", "OctaneNode", "—"],
          [
            "size / bordered / hoverable",
            "尺寸、边框和悬停阴影",
            "default | small / boolean / boolean",
            "default / true / false",
          ],
          ["loading", "显示加载占位，暂时隐藏内容", "boolean", "false"],
          ["actions", "底部操作项", "OctaneNode[]", "—"],
          [
            "styles / classNames",
            "header、body、cover、actions 样式与类",
            "object",
            "—",
          ],
          ["Card.Meta", "avatar、title、description", "OctaneNode", "—"],
        ]}
      />
      <h2 id="tokens" tabIndex={-1}>
        主题与支持范围
      </h2>
      <p>
        支持头部背景/字号/高度/内边距、内容内边距、actionsBg、extraColor 组件
        token。保留 headStyle / bodyStyle。暂不支持 Card.Grid、tabList、inner
        类型完整样式及完整 Skeleton 动画；type=inner 目前仅切换头部背景。
      </p>
    </>
  );
}
