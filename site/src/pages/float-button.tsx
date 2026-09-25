import { BasicDemo, MoreDemo } from "../demos/float-button-basic";
import { ApiTable, Demo, DocMeta, usePageAnchor } from "../docs-ui";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        FloatButton <span>悬浮按钮</span>
        <small>Alpha</small>
      </h1>
      <p className="lead">在页面固定位置提供便捷操作和返回顶部入口。</p>
      <DocMeta name="FloatButton" />
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <div className="demo-grid">
        <Demo
          id="basic"
          title="基础操作"
          description="在示例区域操作，查看状态变化。"
          source={() => import("../demos/float-button-basic.tsx?raw")}
        >
          <BasicDemo />
        </Demo>
        <Demo
          id="more"
          title="按钮组与返回顶部"
          description="在示例区域操作，查看状态变化。"
          source={() => import("../demos/float-button-basic.tsx?raw")}
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
            "icon / description / tooltip",
            "图标 / 文案 / 提示",
            "OctaneNode",
            "默认问号 / — / —",
          ],
          [
            "type / shape",
            "类型 / 形状",
            "default | primary / circle | square",
            "default / circle",
          ],
          [
            "onClick / href / target",
            "点击回调 / 链接 / 打开方式",
            "function / string / string",
            "—",
          ],
          [
            "Group.trigger / open / onOpenChange",
            "菜单触发与受控展开",
            "click | hover / boolean / function",
            "—",
          ],
          [
            "BackTop.target",
            "滚动目标",
            "() => Window | HTMLElement",
            "window",
          ],
          ["BackTop.visibilityHeight", "显示阈值", "number", "400"],
          ["BackTop.duration", "返回动画时长，毫秒", "number", "450"],
        ]}
      />
      <h2 id="tokens" tabIndex={-1}>
        主题与支持范围
      </h2>
      <p>
        使用 FloatButton 的全局背景、主色、controlHeightLG、阴影和圆角
        token。Group 继承 shape，可通过按钮键盘激活与 Escape 收起；hover
        模式也保留点击入口。BackTop 尊重减少动态效果偏好。暂不支持
        badge、placement、group动画和旧独立 BackTop 导出。
      </p>
    </>
  );
}
