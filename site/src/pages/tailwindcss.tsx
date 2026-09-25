import { Code, usePageAnchor } from "../docs-ui";
export default function TailwindPage({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>Tailwind CSS</h1>
      <p className="lead">用工具类组织页面，用组件主题保持视觉一致。</p>
      <div className="notice">
        <strong>接入方式与支持边界</strong>
        <p>
          antd-octane 不依赖 Tailwind，也尚未提供
          @antd-octane/tailwind。以下针对 Tailwind CSS v4 +
          Vite；v3、StyleX、SSR 和全部组件组合尚未完成验证。
        </p>
      </div>
      <p>
        已验证 Tailwind CSS / @tailwindcss/vite 4.3.3、Octane 0.4.3、Vite
        8.3.1：独立打包消费、Preflight 下的 Button、工具类覆盖、四种主题及应用侧
        token 映射。此范围不代表所有组件组合兼容。
      </p>
      <h2 id="setup" tabIndex={-1}>
        安装与编译
      </h2>
      <p>
        先按<a href="#start">快速开始</a>安装本地组件包。主包尚未发布到
        npm；以下命令只安装 Tailwind 的开发依赖。
      </p>
      <Code
        language="bash"
        source="pnpm add -D tailwindcss@4 @tailwindcss/vite@4"
      />
      <p>保留 Octane 编译插件，不要替换成 React 或 Vue 插件。</p>
      <Code
        language="ts"
        source={
          'import { defineConfig } from "vite";\nimport { octane } from "octane/compiler/vite";\nimport tailwindcss from "@tailwindcss/vite";\n\nexport default defineConfig({\n  plugins: [octane(), tailwindcss()],\n});'
        }
      />
      <h2 id="layers" tabIndex={-1}>
        集中声明样式层级
      </h2>
      <p>
        在应用唯一的样式入口 app.css 中先声明层级，再引入样式；main.tsx
        只引入这个入口。不要提前从 JavaScript 单独引入组件 CSS，否则 antd
        层可能先于 base 被创建。
      </p>
      <Code
        language="css"
        source={
          '@layer theme, base, antd, components, utilities;\n@import "tailwindcss";\n@import "antd-octane/style.css";'
        }
      />
      <Code
        language="ts"
        source={
          '// main.tsx\nimport "./app.css";\n// 继续保留 createRoot 等 Octane 应用启动代码。'
        }
      />
      <p>
        普通声明按上述层级排列：Tailwind Preflight 位于 base，组件默认样式位于
        antd，utilities 可覆盖组件的类样式。未分层 CSS、内联 style 和 !important
        有不同优先级，不能只靠调换 import
        顺序解决所有冲突。不要再次把组件样式包进 layer(antd)，它本身已经分层。
      </p>
      <h2 id="usage" tabIndex={-1}>
        从布局工具类开始
      </h2>
      <Code
        source={
          'import { Button } from "antd-octane";\n\nexport function Actions() {\n  return (\n    <div className="flex flex-wrap items-center gap-4 p-6">\n      <Button type="primary" className="h-12 px-6">保存</Button>\n      <Button>取消</Button>\n    </div>\n  );\n}'
        }
      />
      <p>
        className
        的挂载位置以各组件实现为准；复合组件可能带包裹层。布局类优先放在业务容器上。修改品牌色、尺寸和状态优先使用
        ConfigProvider 或组件属性，直接覆盖背景色可能破坏
        hover、禁用和暗色状态。
      </p>
      <h2 id="tokens" tabIndex={-1}>
        让工具类响应主题
      </h2>
      <p>
        ConfigProvider 不会自动向整个页面输出 --ant-* 变量，也不会自动生成
        bg-primary。可以在业务容器里用 theme.useToken()
        显式导出少量自有变量，再通过 Tailwind v4 的 @theme inline
        生成工具类。以下 app-* 命名属于应用示例，不是本库公共变量。
      </p>
      <Code
        language="css"
        source={
          "/* 接在 app.css 的 imports 后 */\n@theme inline {\n  --color-app-primary: var(--app-primary);\n  --color-app-surface: var(--app-surface);\n  --color-app-text: var(--app-text);\n}"
        }
      />
      <Code
        source={
          'import type { OctaneNode } from "octane";\nimport { ConfigProvider, theme } from "antd-octane";\n\nfunction ThemeScope({ children }: { children?: OctaneNode }) {\n  const { token } = theme.useToken();\n  return <section style={{\n    "--app-primary": token.colorPrimary,\n    "--app-surface": token.colorBgContainer,\n    "--app-text": token.colorText,\n  }}>{children}</section>;\n}\n\nexport function App() {\n  return <ConfigProvider theme={{ token: { colorPrimary: "#722ed1" } }}>\n    <ThemeScope>\n      <div className="bg-app-surface text-app-text p-6">\n        <span className="text-app-primary">主题文字</span>\n      </div>\n    </ThemeScope>\n  </ConfigProvider>;\n}'
        }
      />
      <p>
        ThemeScope 必须位于 ConfigProvider
        内部；嵌套主题需要在各自作用域重新映射。挂载到 body
        的浮层不会自动继承业务 DOM 容器的变量；组件自己的主题通过 context
        传递，但浮层内自定义内容需单独建立变量作用域。Tailwind 的 dark
        变体也不会自动切换 ConfigProvider 的暗色算法。
      </p>
      <h2 id="agents" tabIndex={-1}>
        给 Agent 的接入约束
      </h2>
      <ul>
        <li>
          不要安装 @antdv-next/tailwind、Vue 插件或 React 适配层来接入本库。
        </li>
        <li>
          不要生成不存在的 @antd-octane/tailwind、StyleProvider、cssVar 或
          prefixCls 配置。App 包裹组件也不是启用 Tailwind 的必要条件。
        </li>
        <li>
          不要依赖内部 --ao-* 变量作为稳定公共接口；需要 token 时使用
          theme.useToken()。
        </li>
        <li>
          使用静态完整类名；不要通过颜色变量动态拼接背景类名，这类字符串无法可靠扫描。
        </li>
        <li>
          报告所用版本、构建与浏览器验证范围；不能把一个示例通过描述为所有组件完全兼容。
        </li>
      </ul>
      <p>
        完整项目事实与生成代码前的检查顺序见
        <a href="#for-agents">给 Agent 的指南</a>。
      </p>
      <h2 id="references" tabIndex={-1}>
        参考与后续范围
      </h2>
      <p>
        本页参考{" "}
        <a href="https://www.antdv-next.cn/docs/vue/tailwindcss-cn">
          Antdv Next 的主题工具类方案
        </a>
        ，接入语法参考{" "}
        <a href="https://tailwindcss.com/docs/installation/using-vite">
          Tailwind Vite 文档
        </a>
        、<a href="https://tailwindcss.com/docs/preflight">Preflight</a> 与{" "}
        <a href="https://tailwindcss.com/docs/theme">主题变量</a>
        。两库的变量契约不同，插件不能直接互换。
      </p>
      <p>
        StyleX 暂未提供官方适配和消费验证，不要将 StyleX 原始样式对象直接作为
        DOM style。独立 Tailwind token
        插件、完整变量清单和更多工具链支持仍待设计与验证。
      </p>
    </>
  );
}
