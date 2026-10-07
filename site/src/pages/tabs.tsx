import { BasicDemo, MoreDemo } from "../demos/tabs-basic";
import { ApiTable, Demo, DocMeta, usePageAnchor } from "../docs-ui";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Tabs <span>标签页</span>
        <small>Alpha</small>
      </h1>
      <p className="lead">在相关内容之间切换，保留各页的输入状态。</p>
      <DocMeta name="Tabs" />
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <div className="demo-grid">
        <Demo
          id="basic"
          title="切换与键盘操作"
          description="方向键移动标签焦点，Enter 或 Space 激活。切换回来后，设置页保留输入内容。"
          source={() => import("../demos/tabs-basic.tsx?raw")}
        >
          <BasicDemo />
        </Demo>
        <Demo
          id="more"
          title="新增和关闭标签"
          description="通过 onEdit 更新 items；关闭当前标签后切换到可用页面，并恢复标签焦点。"
          source={() => import("../demos/tabs-basic.tsx?raw")}
        >
          <MoreDemo />
        </Demo>
      </div>
      <h2 id="api" tabIndex={-1}>
        API
      </h2>
      <ApiTable
        rows={[
          ["items", "标签及面板配置", "TabItem[]", "[]"],
          [
            "activeKey / defaultActiveKey / onChange",
            "受控值、初始值与变化回调",
            "string / string / (key) => void",
            "首个可用项",
          ],
          [
            "type",
            "线条、卡片或可编辑卡片",
            "line | card | editable-card",
            "line",
          ],
          [
            "tabPosition / size / centered",
            "位置、尺寸和居中",
            "top | bottom | left | right / Size / boolean",
            "top / middle / false",
          ],
          [
            "destroyOnHidden / forceRender",
            "销毁非活动页 / item 预渲染",
            "boolean",
            "false",
          ],
          [
            "onEdit / hideAdd",
            "可编辑卡片增删回调和新增按钮",
            "(keyOrEvent, action) => void / boolean",
            "— / false",
          ],
          [
            "tabBarGutter / tabBarStyle / tabBarExtraContent",
            "标签间距、样式与附加内容",
            "number / CSSProperties / OctaneNode",
            "—",
          ],
        ]}
      />
      <h2 id="tokens" tabIndex={-1}>
        主题与支持范围
      </h2>
      <p>
        支持已声明的文字、间距、选中颜色、指示线和卡片背景
        token。方向键/Home/End 移动焦点，Enter/Space
        激活；超出空间的标签可滚动。暂不支持动画指示条、自定义
        indicator、overflow 更多菜单、renderTabBar、TabPane 旧语法和 ref 契约。
      </p>
    </>
  );
}
