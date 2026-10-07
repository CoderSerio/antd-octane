import { BasicDemo, MoreDemo } from "../demos/badge-basic";
import { ApiTable, Demo, DocMeta, usePageAnchor } from "../docs-ui";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Badge <span>徽标数</span>
        <small>Alpha</small>
      </h1>
      <p className="lead">在图标或头像旁标记数量，也可以单独展示状态。</p>
      <DocMeta name="Badge" />
      <h2 id="when" tabIndex={-1}>
        何时使用
      </h2>
      <p>数量可折叠为上限值，状态点可用于异步任务进度。</p>
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <div className="demo-grid">
        <Demo
          id="basic"
          title="基本使用"
          description="常用形态与状态，主题配置跟随页面切换。"
          source={() => import("../demos/badge-basic.tsx?raw")}
        >
          <BasicDemo />
        </Demo>
        <Demo
          id="more"
          title="组合与交互"
          description="结合业务内容验证配置和交互。"
          source={() => import("../demos/badge-basic.tsx?raw")}
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
            "count / overflowCount",
            "数量与显示上限",
            "OctaneNode / number",
            "— / 99",
          ],
          ["showZero / dot", "零值可见与圆点模式", "boolean", "false"],
          [
            "status / text",
            "状态点与说明文字",
            "success | processing | default | error | warning / OctaneNode",
            "—",
          ],
          [
            "color / size",
            "自定义颜色与尺寸",
            "string / default | small",
            "— / default",
          ],
          [
            "offset / title",
            "指示器偏移与原生提示",
            "[number|string, number|string] / string",
            "—",
          ],
        ]}
      />
      <h2 id="tokens" tabIndex={-1}>
        主题与支持范围
      </h2>
      <p>
        支持 indicatorHeight / SM、dotSize、textFontSize /
        SM、textFontWeight、statusSize、indicatorZIndex。style
        作用于指示器，与上游保持一致。暂不支持
        Badge.Ribbon、数字滚动动画及预设颜色名映射；color 接收有效 CSS 颜色。
      </p>
    </>
  );
}
