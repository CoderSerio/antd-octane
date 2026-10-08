import { Code, usePageAnchor } from "../docs-ui";
export default function StartPage({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <div className="eyebrow">GUIDE / GETTING STARTED</div>
      <h1>开始使用</h1>
      <p className="lead">
        从安装到第一个按钮，在 Octane 项目中使用 Ant Design 风格组件。
      </p>
      <p>
        初次使用 Octane 可先阅读{" "}
        <a className="text-link" href="https://octanejs.dev/docs">
          Octane 官方文档
        </a>
        。本库参考{" "}
        <a
          className="text-link"
          href="https://5x.ant.design/components/overview/"
        >
          Ant Design 5
        </a>
        的设计与 API，并借鉴{" "}
        <a
          className="text-link"
          href="https://antdv-next.com/components/overview-cn"
        >
          Antdv Next
        </a>
        的案例组织；具体能力以本站组件页为准。
      </p>
      <div className="notice">
        <strong>Alpha 开发预览</strong>
        <p>
          当前为 alpha 阶段，API 可能调整。以下示例使用 Node.js ≥
          22.22.2、Octane 0.4.3、Vite 8 和 TypeScript 5.9。 Ant Design 5.29.3
          是组件对照基线，消费项目无需安装 React 或 antd。
        </p>
      </div>
      <h2 id="integration" tabIndex={-1}>
        安装组件库
      </h2>
      <p>在已有 Octane 项目中执行：</p>
      <Code language="bash" source="pnpm add antd-octane@alpha octane@0.4.3" />
      <p>
        需要固定版本时，先用 npm view antd-octane dist-tags.alpha
        查看当前发布版本，再将 antd-octane@alpha
        替换为对应版本号。新建项目可先创建空目录，执行 pnpm init，
        再安装上述依赖和以下开发工具。
      </p>
      <Code language="bash" source="pnpm add -D vite@8 typescript@5.9" />
      <h2 id="configure" tabIndex={-1}>
        配置 Vite 与 TypeScript
      </h2>
      <p>在项目根目录创建 vite.config.ts，启用 Octane 编译插件：</p>
      <Code
        language="ts"
        source={
          'import { defineConfig } from "vite";\nimport { octane } from "octane/compiler/vite";\n\nexport default defineConfig({ plugins: [octane()] });'
        }
      />
      <p>创建 tsconfig.json；已有项目请合并以下配置：</p>
      <Code
        language="json"
        source={
          '{\n  "compilerOptions": {\n    "target": "ES2022",\n    "module": "ESNext",\n    "moduleResolution": "Bundler",\n    "lib": ["ES2022", "DOM", "DOM.Iterable"],\n    "jsx": "react-jsx",\n    "jsxImportSource": "octane",\n    "strict": true,\n    "noEmit": true\n  },\n  "include": ["src"]\n}'
        }
      />
      <p>react-jsx 是 TypeScript 的 JSX 配置名称，不表示需要 React 运行时。</p>
      <h2 id="usage" tabIndex={-1}>
        使用组件
      </h2>
      <p>在项目根目录创建 index.html，提供挂载节点并加载入口：</p>
      <Code
        language="html"
        source={
          '<!doctype html>\n<html lang="zh-CN">\n  <head>\n    <meta charset="UTF-8" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    <title>Ant Design for Octane</title>\n  </head>\n  <body>\n    <div id="root"></div>\n    <script type="module" src="/src/main.tsx"></script>\n  </body>\n</html>'
        }
      />
      <p>创建 src/main.tsx。样式需要显式导入，ConfigProvider 用于配置主题：</p>
      <Code
        source={
          'import { createRoot, useState } from "octane";\nimport { Button, ConfigProvider } from "antd-octane";\nimport "antd-octane/style.css";\n\nfunction Example() {\n  const [count, setCount] = useState(0);\n  return (\n    <Button type="primary" onClick={() => setCount(count + 1)}>\n      已点击 {count} 次\n    </Button>\n  );\n}\n\nconst root = document.getElementById("root");\nif (!root) throw new Error("Missing #root");\ncreateRoot(root).render(\n  <ConfigProvider theme={{ token: { colorPrimary: "#1677ff" } }}>\n    <Example />\n  </ConfigProvider>,\n);'
        }
      />
      <h2 id="run" tabIndex={-1}>
        运行与检查
      </h2>
      <Code language="bash" source="pnpm exec vite" />
      <p>
        打开终端显示的地址，点击按钮确认计数更新。提交应用前检查类型与生产构建：
      </p>
      <Code
        language="bash"
        source={"pnpm exec tsc --noEmit\npnpm exec vite build"}
      />
      <p>
        继续阅读{" "}
        <a className="text-link" href="#theme">
          定制主题
        </a>
        、
        <a className="text-link" href="#api-conventions">
          API 与语法约定
        </a>{" "}
        和
        <a className="text-link" href="#compatibility">
          兼容与迁移
        </a>
        。
        <a className="text-link" href="#form">
          Form
        </a>
        已提供平面字段、同步与异步校验的基础版；Table、DatePicker
        等在开发源码中已有基础实现，尚未发布到本站使用的 npm 版本。
        请先查阅各组件的支持范围，不能直接照搬上游示例。
      </p>
      <h2 id="troubleshooting" tabIndex={-1}>
        遇到问题
      </h2>
      <ul className="prose-list">
        <li>
          <strong>按钮没有样式：</strong>检查应用入口是否导入{" "}
          <code>antd-octane/style.css</code>。已导入时检查应用 CSS 是否覆盖了
          antd layer；先移除冲突规则再确认。详见
          <a href="#button/faq">按钮样式排查</a>与
          <a href="#tailwindcss">Tailwind 层级</a>。
        </li>
        <li>
          <strong>JSX 编译或类型检查失败：</strong>检查 Vite 配置是否启用
          octane()，tsconfig 的 jsxImportSource 是否为 octane，并确认安装
          octane@0.4.3。按本页配置修正后重启开发服务，再运行 tsc
          --noEmit；不要通过安装 React 来掩盖配置问题。
        </li>
        <li>
          <strong>示例里的 API 不存在：</strong>运行 pnpm list antd-octane
          octane，核对<a href="#changelog">本站使用版本与更新日志</a>
          。若安装版本较旧，升级到所需已发布版本；若
          <a href="#compatibility">支持范围</a>
          注明未实现，使用本站替代方式，不照搬上游 API。
        </li>
      </ul>
      <p>
        想修改组件库或文档站？参阅{" "}
        <a className="text-link" href="#contributing">
          参与贡献
        </a>
        。
      </p>
    </>
  );
}
