import { BasicDemo, MoreDemo } from "../demos/collapse-basic";
import { ApiTable, Demo, DocMeta, usePageAnchor } from "../docs-ui";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Collapse <span>折叠面板</span>
        <small>Alpha</small>
      </h1>
      <p className="lead">分组收纳内容，支持多个面板或手风琴模式。</p>
      <DocMeta name="Collapse" />
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <div className="demo-grid">
        <Demo
          id="basic"
          title="折叠与状态保留"
          description="展开输入面板后输入内容，再关闭并重新打开；默认保留已挂载内容。"
          source={() => import("../demos/collapse-basic.tsx?raw")}
        >
          <BasicDemo />
        </Demo>
        <Demo
          id="more"
          title="手风琴与独立操作"
          description="手风琴模式同时展开一项。额外操作按钮独立计数，不触发面板切换。"
          source={() => import("../demos/collapse-basic.tsx?raw")}
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
            "key、label、children、extra 等面板配置",
            "CollapseItem[]",
            "[]",
          ],
          [
            "activeKey / defaultActiveKey",
            "受控键 / 初始键",
            "string | number | Key[]",
            "—",
          ],
          [
            "accordion / onChange",
            "单面板模式和变化回调",
            "boolean / (keys: string[]) => void",
            "false / —",
          ],
          [
            "collapsible",
            "可点击标题、图标或禁用",
            "header | icon | disabled",
            "header",
          ],
          [
            "bordered / ghost / size",
            "边框、透明背景和尺寸",
            "boolean / boolean / small | middle | large",
            "true / false / middle",
          ],
          [
            "destroyOnHidden / forceRender",
            "关闭后销毁 / item 预渲染",
            "boolean",
            "false",
          ],
          [
            "expandIcon / expandIconPosition",
            "自定义图标与位置",
            "function / start | end",
            "默认 / start",
          ],
        ]}
      />
      <h2 id="tokens" tabIndex={-1}>
        主题与支持范围
      </h2>
      <p>
        支持 headerBg、headerPadding、contentBg、contentPadding 和
        borderlessContent 系列
        token。默认首次打开才挂载，关闭后保留；destroyOnHidden
        可销毁。暂不支持旧 Collapse.Panel 语法、折叠动画和
        items.styles/classNames。
      </p>
    </>
  );
}
