import { NestedDemo } from "../demos/nested";
import { ThemeAlgorithmsDemo } from "../demos/theme-algorithms";
import { ThemeBrandDemo } from "../demos/theme-brand";
import { ThemeComponentsDemo } from "../demos/theme-components";
import { Code, Demo, usePageAnchor } from "../docs-ui";
export default function ThemePage({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>定制主题</h1>
      <p className="lead">通过 Design Token 定制品牌色、圆角和组件样式。</p>
      <p className="intro">
        第一版复用 antd 5.29.3 的 seed / map / alias 算法。纯 token
        配置保持相同结构，算法导入改为来自 antd-octane。
      </p>
      <h2 id="configure" tabIndex={-1}>
        配置主题
      </h2>
      <p>
        在 ConfigProvider 中传入
        theme，可将配置应用于其内部组件。主题在运行时更新，支持多个作用域同时存在。
      </p>
      <Code
        source={
          'import { ConfigProvider, theme } from "antd-octane";\n\nconst preset = {\n  algorithm: [theme.darkAlgorithm, theme.compactAlgorithm],\n  token: { colorPrimary: "#722ed1", borderRadius: 8 },\n  components: { Button: { fontWeight: 600 } },\n};\n\n<ConfigProvider theme={preset}>...</ConfigProvider>'
        }
      />
      <h3 id="brand" tabIndex={-1}>
        修改主题变量
      </h3>
      <p>
        colorPrimary、borderRadius
        等基础变量会参与派生计算。原有配置可按支持清单逐项迁移。
      </p>
      <Demo
        title="品牌色与圆角"
        description="局部配置绿色主色与 8px 圆角。"
        source={() => import("../demos/theme-brand.tsx?raw")}
      >
        <ThemeBrandDemo />
      </Demo>
      <h3 id="algorithms" tabIndex={-1}>
        使用预设算法
      </h3>
      <p>
        提供默认、暗色和紧凑三套算法。algorithm
        支持数组，按顺序组合；这里的开关只改变演示区域。
      </p>
      <Demo
        title="预设算法"
        description="可组合暗色与紧凑算法。"
        source={() => import("../demos/theme-algorithms.tsx?raw")}
      >
        <ThemeAlgorithmsDemo />
      </Demo>
      <h3 id="component-token" tabIndex={-1}>
        修改组件变量
      </h3>
      <p>
        components 按组件名配置变量。algorithm: true
        启用该组件的派生计算；未启用时仅覆盖指定值。
      </p>
      <Demo
        title="组件级主题"
        description="按钮和输入框各自消费组件变量。"
        source={() => import("../demos/theme-components.tsx?raw")}
      >
        <ThemeComponentsDemo />
      </Demo>
      <h2 id="nested" tabIndex={-1}>
        局部主题与动态切换
      </h2>
      <p>
        嵌套 ConfigProvider 默认继承父主题；inherit: false 从默认主题开始。通过
        Octane 状态更新 theme 对象即可动态切换。
      </p>
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
        style 扩展入口。Tailwind 与 StyleX 的支持范围需要分别验证。Tailwind v4
        的接入、层级和主题映射详见专页；StyleX 尚未完成工具链消费测试。
      </p>
      <p>
        <a href="#tailwindcss">Tailwind CSS 接入指南 →</a> ·{" "}
        <a href="#for-agents">给 Agent 的指南 →</a>
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
          ConfigProvider 支持 prefixCls；自定义前缀仍需逐组件核对输出和样式。
          antd-octane/style 的 StyleProvider 目前只有 layer
          配置，作用于原生注册的 App/Modal 样式，不是完整 cssinjs
          替代。尚不提供主题 cssVar、hashed 或 SSR 样式契约。原有 Less、DOM
          选择器覆盖、React 主题插件需要单独适配。Button 未实现的组件 token
          不会被描述为已兼容。
        </p>
      </div>
    </>
  );
}
