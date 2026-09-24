import { BasicDemo, MoreDemo } from "../demos/statistic-basic";
import { ApiTable, Demo, DocMeta, usePageAnchor } from "../docs-ui";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Statistic <span>统计数值</span>
        <small>Alpha</small>
      </h1>
      <p className="lead">突出展示数量、金额或其他关键指标。</p>
      <DocMeta name="Statistic" />
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <div className="demo-grid">
        <Demo
          id="basic"
          title="数值与金额"
          description="使用千分位展示统计数值，通过 precision 和 prefix 设置小数位与货币符号。"
          source={() => import("../demos/statistic-basic.tsx?raw")}
        >
          <BasicDemo />
        </Demo>
        <Demo
          id="more"
          title="字符串精度"
          description="输入大数字字符串，避免先转为 Number 导致精度丢失；小数按 precision 截取和补零。"
          source={() => import("../demos/statistic-basic.tsx?raw")}
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
            "value / title",
            "数值和标题",
            "number | string / OctaneNode",
            "0 / —",
          ],
          [
            "precision / decimalSeparator / groupSeparator",
            "小数位、小数符与分组符",
            "number / string / string",
            "— / . / ,",
          ],
          ["prefix / suffix", "前后缀", "OctaneNode", "—"],
          ["formatter", "自定义内容格式", "(value) => OctaneNode", "—"],
          [
            "loading / valueStyle",
            "加载占位与数值样式",
            "boolean / CSSProperties",
            "false / —",
          ],
        ]}
      />
      <h2 id="tokens" tabIndex={-1}>
        主题与支持范围
      </h2>
      <p>
        支持 titleFontSize、contentFontSize 和 alias
        token。字符串格式化不经过浮点数转换；precision
        按上游行为截取和补零，不进行四舍五入。暂不支持 Countdown、Timer 和完整
        Skeleton 动画。
      </p>
    </>
  );
}
