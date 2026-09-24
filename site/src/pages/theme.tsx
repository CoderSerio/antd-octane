import { NestedDemo } from "../demos/nested";
import { Code, Demo, usePageAnchor } from "../docs-ui";
export default function ThemePage({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <div className="eyebrow">GUIDE / THEMING</div>
      <h1>定制主题</h1>
      <p className="lead">从已有的 theme 配置出发，而不是重新调一遍颜色。</p>
      <p className="intro">
        第一版复用 antd 5.29.3 的 seed / map / alias 算法。纯 token
        配置保持相同结构，算法导入改为来自 antd-octane。
      </p>
      <Code
        source={
          'import { ConfigProvider, theme } from "antd-octane";\n\nconst preset = {\n  algorithm: [theme.darkAlgorithm, theme.compactAlgorithm],\n  token: { colorPrimary: "#722ed1", borderRadius: 8 },\n  components: { Button: { fontWeight: 600 } },\n};\n\n<ConfigProvider theme={preset}>...</ConfigProvider>'
        }
      />
      <h2 id="contract" tabIndex={-1}>
        已验证的契约
      </h2>
      <ul className="prose-list">
        <li>默认、暗色、紧凑及组合算法的全量全局 token 与固定上游版本对照。</li>
        <li>
          全局 token 覆盖、算法回调和 Button / Input / Checkbox 组件级配置。
        </li>
        <li>嵌套继承、独立主题，以及运行时切换。</li>
      </ul>
      <Demo
        title="局部主题不会改变外部按钮"
        description="打开顶部的主题实验室，可以观察继承与独立作用域的区别。"
        source={() => import("../demos/nested.tsx?raw")}
      >
        <NestedDemo />
      </Demo>
      <h2 id="styling" tabIndex={-1}>
        Tailwind CSS 与 StyleX
      </h2>
      <p>
        组件库不要求安装这两种工具。样式放在 antd CSS layer 中，保留 className /
        style 扩展入口。Tailwind 与 StyleX
        的完整工具链消费测试尚未完成，暂不宣称已兼容。
      </p>
      <Code
        language="css"
        source={
          "/* 使用 Tailwind v4 时，建议的层级顺序 */\n@layer theme, base, antd, components, utilities;"
        }
      />
      <div className="notice">
        <strong id="limitations" tabIndex={-1}>
          迁移边界
        </strong>
        <p>
          尚不支持 cssVar、hashed、prefixCls、StyleProvider 和 SSR
          样式契约。原有 Less、DOM 选择器覆盖、React
          主题插件需要单独适配。Button 未实现的组件 token 不会被描述为已兼容。
        </p>
      </div>
    </>
  );
}
