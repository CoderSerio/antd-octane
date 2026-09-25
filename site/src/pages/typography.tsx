import { BasicDemo, MoreDemo } from "../demos/typography-basic";
import { ApiTable, Demo, DocMeta, usePageAnchor } from "../docs-ui";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Typography <span>排版</span>
        <small>Alpha</small>
      </h1>
      <p className="lead">组织标题、段落和文本，支持复制、编辑及展开。</p>
      <DocMeta name="Typography" />
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <div className="demo-grid">
        <Demo
          id="basic"
          title="文字层级与修饰"
          description="标题、正文和辅助信息随主题调整，使用 Text 修饰行内内容。"
          source={() => import("../demos/typography-basic.tsx?raw")}
        >
          <BasicDemo />
        </Demo>
        <Demo
          id="more"
          title="编辑、复制与省略"
          description="Enter 保存、Shift+Enter 换行、Escape 取消；复制结果会通过状态提示反馈。展开按钮控制多行内容。"
          source={() => import("../demos/typography-basic.tsx?raw")}
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
            "Text / Paragraph / Title / Link",
            "行内文本、段落、标题和链接",
            "组件",
            "—",
          ],
          ["level", "标题层级", "1 | 2 | 3 | 4 | 5", "1"],
          [
            "type / disabled",
            "语义颜色与禁用",
            "secondary | success | warning | danger / boolean",
            "—",
          ],
          [
            "strong / italic / underline / delete / mark / code / keyboard",
            "文本修饰",
            "boolean",
            "false",
          ],
          [
            "copyable",
            "复制文本或配置异步 text、onCopy",
            "boolean | CopyConfig",
            "false",
          ],
          [
            "editable",
            "编辑状态、text、maxLength 与 onStart/onChange/onCancel/onEnd",
            "boolean | EditConfig",
            "false",
          ],
          [
            "ellipsis",
            "CSS 多行省略、展开状态与后缀",
            "boolean | EllipsisConfig",
            "false",
          ],
        ]}
      />
      <h2 id="tokens" tabIndex={-1}>
        主题与支持范围
      </h2>
      <p>
        主题支持标题间距和相关全局 token。editable 的修改通过 onChange
        交给调用方保存；复制依赖浏览器 Clipboard
        API，失败时提示手动复制。省略使用 CSS
        行数限制，展开按钮始终显示，不做溢出测量；暂不支持
        tooltip、symbol、可定制复制图标、自动行高和完整 ref 契约。
      </p>
    </>
  );
}
