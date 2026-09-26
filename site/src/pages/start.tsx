import { Code, usePageAnchor } from "../docs-ui";
export default function StartPage({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <div className="eyebrow">GUIDE / GETTING STARTED</div>
      <h1>快速开始</h1>
      <p className="lead">
        从安装到第一个按钮，在 Octane 项目中使用 Ant Design。
      </p>
      <div className="notice">
        <strong>Alpha 开发预览</strong>
        <p>
          当前版本为 0.1.0-alpha.0，API 可能调整。以下示例使用 Node.js ≥
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
        需要固定版本时，将 antd-octane@alpha 替换为
        antd-octane@0.1.0-alpha.0。新建项目可先创建空目录，执行 pnpm init，
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
        。 Form、Table 等尚未实现的组件请先查阅组件总览，不能直接照搬上游示例。
      </p>
      <h2 id="install" tabIndex={-1}>
        开发本库与文档站
      </h2>
      <p>如需贡献代码或修改文档，先克隆仓库，再使用 pnpm 10.29.2 安装依赖：</p>
      <Code
        language="bash"
        source={
          "git clone --branch main https://github.com/CoderSerio/antd-octane.git\ncd antd-octane\npnpm install\npnpm dev"
        }
      />
      <h2 id="build" tabIndex={-1}>
        仓库构建与验证
      </h2>
      <Code
        language="bash"
        source={
          "pnpm check        # 格式、类型、测试、构建\npnpm preview      # 预览静态站点\npnpm pack:check   # 打包并在独立目录验证消费"
        }
      />
      <p>
        分支、PR 和浏览器验证要求见{" "}
        <a
          className="text-link"
          href="https://github.com/CoderSerio/antd-octane/blob/main/CONTRIBUTE.md"
        >
          贡献指南
        </a>
        。
      </p>
    </>
  );
}
