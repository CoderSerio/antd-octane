import { Code, usePageAnchor } from "../docs-ui";

export default function ContributingPage({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <div className="eyebrow">GUIDE / CONTRIBUTING</div>
      <h1>参与贡献</h1>
      <p className="lead">在本地开发组件库和文档站，并提交可验证的改动。</p>
      <p>
        如果只想在自己的项目中使用组件，请阅读{" "}
        <a className="text-link" href="#start">
          快速开始
        </a>
        。
      </p>
      <h2 id="install" tabIndex={-1}>
        开发本库与文档站
      </h2>
      <p>使用 Node.js ≥ 22.22.2 和 pnpm 10.29.2，克隆仓库并启动文档站：</p>
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
