import { Code, usePageAnchor } from "../docs-ui";
export default function StartPage({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <div className="eyebrow">GUIDE / GETTING STARTED</div>
      <h1>快速开始</h1>
      <p className="lead">先在本地运行，再把主题与组件带进你的项目。</p>
      <div className="notice">
        <strong>开发预览，尚未发布</strong>
        <p>
          当前请通过仓库运行。环境要求 Node.js ≥ 22.22.2、pnpm 10.29.2；固定
          Octane 0.4.3 与 antd 5.29.3 作为验证基线。
        </p>
      </div>
      <h2 id="install" tabIndex={-1}>
        启动文档站
      </h2>
      <Code
        language="bash"
        source={
          "git clone https://github.com/CoderSerio/antd-octane.git\ncd antd-octane\npnpm install\npnpm dev"
        }
      />
      <h2 id="integration" tabIndex={-1}>
        接入现有 Octane 项目
      </h2>
      <p>尚未发布到 npm，可先构建并打包，再从本地 tarball 安装。</p>
      <Code
        language="bash"
        source={
          "# 在本仓库内\npnpm build:lib\npnpm --filter antd-octane pack --pack-destination /tmp\n\n# 在你的 Octane 项目内\npnpm add /tmp/antd-octane-0.1.0-alpha.0.tgz octane@0.4.3"
        }
      />
      <p>
        Vite 配置需要启用 Octane 编译插件。TypeScript 使用 jsxImportSource:
        "octane"。
      </p>
      <Code
        language="ts"
        source={
          'import { defineConfig } from "vite";\nimport { octane } from "octane/compiler/vite";\n\nexport default defineConfig({ plugins: [octane()] });'
        }
      />
      <h2 id="usage" tabIndex={-1}>
        使用组件
      </h2>
      <p>以下为工作区或本地打包后的用法。消费构建产物时需要显式引入样式。</p>
      <Code
        source={
          'import { Button, ConfigProvider } from "antd-octane";\nimport "antd-octane/style.css";\n\nexport function App() {\n  return (\n    <ConfigProvider theme={{ token: { colorPrimary: "#1677ff" } }}>\n      <Button type="primary">开始使用</Button>\n    </ConfigProvider>\n  );\n}'
        }
      />
      <h2 id="build" tabIndex={-1}>
        构建与验证
      </h2>
      <Code
        language="bash"
        source={
          "pnpm check        # 格式、类型、测试、构建\npnpm preview      # 预览静态站点\npnpm pack:check   # 打包并在独立目录验证消费"
        }
      />
    </>
  );
}
