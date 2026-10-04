import { BasicDemo, MoreDemo } from "../demos/icon-basic";
import { ApiTable, Demo, DocMeta, usePageAnchor } from "../docs-ui";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Icon <span>图标</span>
        <small>Alpha</small>
      </h1>
      <p className="lead">渲染 SVG 图标描述与自定义图形。</p>
      <DocMeta name="Icon" />
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <div className="demo-grid">
        <Demo
          id="basic"
          title="尺寸、旋转与加载"
          description="图标继承文字颜色和字号；动画遵循减少动态效果设置。"
          source={() => import("../demos/icon-basic.tsx?raw")}
        >
          <BasicDemo />
        </Demo>
        <Demo
          id="more"
          title="自定义 SVG"
          description="提供 viewBox 与 SVG 子节点。"
          source={() => import("../demos/icon-basic.tsx?raw")}
        >
          <MoreDemo />
        </Demo>
      </div>
      <h2 id="api" tabIndex={-1}>
        API
      </h2>
      <ApiTable
        rows={[
          ["icon", "SVG 数据描述", "IconDefinition", "—"],
          [
            "createIcon(definition)",
            "生成可复用 Octane 图标组件",
            "(props: IconProps) => OctaneNode",
            "—",
          ],
          [
            "component / children",
            "自定义渲染函数或 SVG 内容",
            "(() => OctaneNode) / OctaneNode",
            "—",
          ],
          ["viewBox", "自定义 SVG 坐标", "string", "0 0 1024 1024"],
          [
            "spin / rotate",
            "旋转动画 / 旋转角度",
            "boolean / number",
            "false / —",
          ],
          [
            "twoToneColor",
            "双色定义使用的主色与副色",
            "string | [string,string]",
            "主题主色 / 主色背景",
          ],
          ["aria-label", "有语义的图标名称；未指定时作为装饰", "string", "—"],
        ]}
      />
      <h2 id="tokens" tabIndex={-1}>
        主题与支持范围
      </h2>
      <p>
        提供与 Ant Design 5 示例一致的命名图标入口，例如从 `antd-octane/icons`
        引入 `ClockCircleOutlined`、`MinusOutlined` 和
        `PlusOutlined`。图标数据兼容 @ant-design/icons-svg 的
        IconDefinition，也可以在应用安装该包并按图标导入，再交给 createIcon。
      </p>
      <p>
        `antd-octane/icons` 当前提供站点示例使用的基础图标集合，不等同于
        `@ant-design/icons` 的完整 React 图标包。这里不提供 React 图标组件兼容、
        iconfont 脚本加载器、全局 setTwoToneColor 或自动导入插件；component
        负责自己的 SVG 属性。不要把只有图标的可点击 span 当按钮，请包裹 Button
        并提供可访问名称。
      </p>
    </>
  );
}
