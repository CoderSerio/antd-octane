import { BasicDemo, MoreDemo } from "../demos/list-basic";
import { ApiTable, Demo, DocMeta, usePageAnchor } from "../docs-ui";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        List <span>列表</span>
        <small>Alpha</small>
      </h1>
      <p className="lead">按条目展示内容，支持元信息、操作和响应式网格。</p>
      <DocMeta name="List" />
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <div className="demo-grid">
        <Demo
          id="basic"
          title="带操作的列表"
          description="用 rowKey 保留条目身份，通过 Meta 展示头像、标题和描述，操作按钮更新完成状态。"
          source={() => import("../demos/list-basic.tsx?raw")}
        >
          <BasicDemo />
        </Demo>
        <Demo
          id="more"
          title="响应式网格与空状态"
          description="小屏单列、md 及以上双列。切换开关查看无数据时的占位。"
          source={() => import("../demos/list-basic.tsx?raw")}
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
            "dataSource / renderItem",
            "数据和条目渲染回调",
            "T[] / (item, index) => OctaneNode",
            "—",
          ],
          [
            "rowKey",
            "稳定的条目标识",
            "keyof T | (item) => string | number",
            "索引",
          ],
          [
            "header / footer / loadMore",
            "头部、底部及加载更多区域",
            "OctaneNode",
            "—",
          ],
          [
            "bordered / split / size",
            "边框、分割线和尺寸",
            "boolean / boolean / small | default | large",
            "false / true / default",
          ],
          [
            "itemLayout",
            "水平或纵向内容布局",
            "horizontal | vertical",
            "horizontal",
          ],
          ["grid", "列数、xs…xxl 断点和 gutter", "object", "—"],
          [
            "loading / locale.emptyText",
            "加载状态和空内容",
            "boolean / OctaneNode",
            "false / 默认空状态",
          ],
          [
            "Item.actions / extra",
            "操作列表和附加内容",
            "OctaneNode[] / OctaneNode",
            "—",
          ],
          [
            "Item.Meta",
            "头像、标题与描述",
            "avatar / title / description",
            "—",
          ],
        ]}
      />
      <h2 id="tokens" tabIndex={-1}>
        主题与支持范围
      </h2>
      <p>
        支持列表间距、背景、Meta 文字和间距 token。网格以 CSS Grid
        实现，使用主题断点。暂不支持内置 pagination、SpinProps 形式
        loading、虚拟列表、Item 的 colStyle 和完整 styles/classNames；可通过
        loadMore 提供实际的数据加载入口。
      </p>
    </>
  );
}
