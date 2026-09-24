import { BasicDemo, MoreDemo } from "../demos/tag-basic";
import { ApiTable, Demo, DocMeta, usePageAnchor } from "../docs-ui";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Tag <span>标签</span>
        <small>Alpha</small>
      </h1>
      <p className="lead">用于标记、分类和轻量筛选。</p>
      <DocMeta name="Tag" />
      <h2 id="when" tabIndex={-1}>
        何时使用
      </h2>
      <p>状态颜色表达语义；可选择标签适合展示筛选条件。</p>
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <div className="demo-grid">
        <Demo
          id="basic"
          title="基本使用"
          description="常用形态与状态，主题配置跟随页面切换。"
          source={() => import("../demos/tag-basic.tsx?raw")}
        >
          <BasicDemo />
        </Demo>
        <Demo
          id="more"
          title="组合与交互"
          description="结合业务内容验证配置和交互。"
          source={() => import("../demos/tag-basic.tsx?raw")}
        >
          <MoreDemo />
        </Demo>
      </div>
      <h2 id="api" tabIndex={-1}>
        API
      </h2>
      <ApiTable
        rows={[
          ["color", "预设色、状态色或自定义 CSS 颜色", "string", "—"],
          [
            "closable / closeIcon",
            "显示关闭按钮与自定义图标",
            "boolean / OctaneNode",
            "false / ×",
          ],
          [
            "onClose",
            "关闭前回调，可 preventDefault 取消",
            "(MouseEvent) => void",
            "—",
          ],
          [
            "bordered / icon",
            "边框与前置图标",
            "boolean / OctaneNode",
            "true / —",
          ],
          [
            "checked / onChange",
            "CheckableTag 受控状态",
            "boolean / (boolean) => void",
            "—",
          ],
        ]}
      />
      <h2 id="tokens" tabIndex={-1}>
        主题与支持范围
      </h2>
      <p>
        支持 defaultBg、defaultColor 组件 token 和 alias token。预设色支持常用
        13 色，状态色支持 success / processing / warning /
        error。关闭按钮可用键盘操作。暂不支持 inverse 预设色、closable
        对象、deprecated visible、wave 与关闭动画。
      </p>
    </>
  );
}
