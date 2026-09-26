import { BasicDemo, MoreDemo } from "../demos/rate-basic";
import { ApiTable, Demo, DocMeta, usePageAnchor } from "../docs-ui";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Rate <span>评分</span>
        <small>Alpha</small>
      </h1>
      <p className="lead">展示评分，或收集用户对内容的评价。</p>
      <DocMeta name="Rate" />
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <div className="demo-grid">
        <Demo
          id="basic"
          title="基本、半星与只读"
          description="选择适合当前内容的状态和尺寸。"
          source={() => import("../demos/rate-basic.tsx?raw")}
        >
          <BasicDemo />
        </Demo>
        <Demo
          id="more"
          title="受控评分与自定义字符"
          description="改变选项后，状态同步更新。"
          source={() => import("../demos/rate-basic.tsx?raw")}
        >
          <MoreDemo />
        </Demo>
      </div>
      <h2 id="api" tabIndex={-1}>
        API
      </h2>
      <ApiTable
        rows={[
          ["value / defaultValue", "受控值 / 初始值", "number", "0"],
          ["count", "星星数量", "number", "5"],
          ["allowHalf", "启用半星选择", "boolean", "false"],
          ["allowClear", "再次点击当前值时清零", "boolean", "true"],
          ["disabled", "只读显示", "boolean", "false"],
          ["onChange", "评分改变回调", "(value: number) => void", "—"],
          [
            "onHoverChange",
            "悬停值变化，离开时 undefined",
            "(value) => void",
            "—",
          ],
          [
            "character",
            "自定义字符或按索引渲染",
            "OctaneNode | ({index}) => OctaneNode",
            "星星",
          ],
          ["tooltips", "每颗星的原生提示", "string[]", "—"],
          ["keyboard", "启用键盘调整", "boolean", "true"],
        ]}
      />
      <h2 id="tokens" tabIndex={-1}>
        主题与支持范围
      </h2>
      <p>
        支持 starColor、starSize、starHoverScale、starBg。使用 slider
        语义提供键盘操作和半星读数。tooltips 当前使用浏览器原生 title
        提示，尚未接入 Tooltip；暂不支持命令式 ref、autoFocus 和 RTL 反向选择。
      </p>
    </>
  );
}
