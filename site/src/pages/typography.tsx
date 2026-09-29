import { BasicDemo } from "../demos/typography-basic";
import { ControlledEditDemo } from "../demos/typography-controlled-edit";
import { CopyableDemo } from "../demos/typography-copyable";
import { EditableDemo } from "../demos/typography-editable";
import { EllipsisDemo } from "../demos/typography-ellipsis";
import { ExpandDemo } from "../demos/typography-expand";
import { HeadingsDemo } from "../demos/typography-headings";
import { SuffixDemo } from "../demos/typography-suffix";
import { TextDemo } from "../demos/typography-text";
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
      <p>
        案例按{" "}
        <a
          href="https://5x.ant.design/components/typography-cn/"
          target="_blank"
          rel="noreferrer"
        >
          Ant Design 5 排版文档
        </a>{" "}
        的使用场景组织。下方演示当前已发布能力；精确省略测量、自动保留中间文本等尚未实现。
      </p>
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
          id="headings"
          title="标题层级"
          description="使用 level 选择一至五级标题，按内容结构而不是字号安排层级。"
          source={() => import("../demos/typography-headings.tsx?raw")}
        >
          <HeadingsDemo />
        </Demo>
        <Demo
          id="text"
          title="文本与超链接"
          description="语义颜色、禁用状态与各类行内修饰分别展示；链接可使用原生 target 和 rel。"
          source={() => import("../demos/typography-text.tsx?raw")}
        >
          <TextDemo />
        </Demo>
        <Demo
          id="editable"
          title="可编辑"
          description="点击编辑按钮修改文本，Enter 或失焦保存，Escape 取消，Shift+Enter 换行。maxLength 限制输入长度。"
          source={() => import("../demos/typography-editable.tsx?raw")}
        >
          <EditableDemo />
        </Demo>
        <Demo
          id="controlled-edit"
          title="受控编辑"
          description="editing 由外部按钮控制，onStart、onEnd 与 onCancel 同步状态；取消后保留已保存内容。"
          source={() => import("../demos/typography-controlled-edit.tsx?raw")}
        >
          <ControlledEditDemo />
        </Demo>
        <Demo
          id="copyable"
          title="可复制"
          description="复制当前文本、自定义文本或异步生成的内容。成功后触发 onCopy；浏览器需允许剪贴板访问。"
          source={() => import("../demos/typography-copyable.tsx?raw")}
        >
          <CopyableDemo />
        </Demo>
        <Demo
          id="ellipsis"
          title="省略号"
          description="单行与多行省略；切换开关查看完整内容。当前实现使用 CSS 行数限制，不测量实际溢出。"
          source={() => import("../demos/typography-ellipsis.tsx?raw")}
        >
          <EllipsisDemo />
        </Demo>
        <Demo
          id="expand"
          title="受控展开与收起"
          description="expanded 和 onExpand 同步外部状态；展开后也能通过外部按钮收起。"
          source={() => import("../demos/typography-expand.tsx?raw")}
        >
          <ExpandDemo />
        </Demo>
        <Demo
          id="suffix"
          title="保留后缀"
          description="suffix 保留文件扩展名等信息。当前后缀独立于 CSS 截断区域渲染，不等同于上游的精确行内测量。"
          source={() => import("../demos/typography-suffix.tsx?raw")}
        >
          <SuffixDemo />
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
      <h2 id="configuration" tabIndex={-1}>
        交互配置
      </h2>
      <ApiTable
        rows={[
          [
            "copyable.text",
            "指定复制内容；函数可以异步返回文本",
            "string | (() => string | Promise<string>)",
            "显示文本",
          ],
          ["copyable.onCopy", "写入剪贴板成功后触发", "() => void", "—"],
          [
            "editable.editing / text",
            "受控编辑状态 / 编辑框初始内容",
            "boolean / string",
            "内部状态 / 显示文本",
          ],
          ["editable.maxLength", "限制输入长度", "number", "—"],
          [
            "editable.onChange",
            "保存时返回新文本，调用方需要更新 children",
            "(value: string) => void",
            "—",
          ],
          [
            "editable.onStart / onEnd / onCancel",
            "开始 / 保存完成 / Escape 取消",
            "() => void",
            "—",
          ],
          ["ellipsis.rows", "折叠时保留的行数", "number", "1"],
          [
            "ellipsis.expandable",
            "是否允许展开；collapsible 可再次收起",
            "boolean | 'collapsible'",
            "false",
          ],
          [
            "ellipsis.expanded / defaultExpanded",
            "受控 / 初始展开状态",
            "boolean",
            "false",
          ],
          [
            "ellipsis.onExpand",
            "展开或收起时通知调用方",
            "(event: MouseEvent, info: { expanded: boolean }) => void",
            "—",
          ],
          ["ellipsis.suffix", "截断区域之外保留的文本", "string", "—"],
          [
            "Link.href / target / rel / download",
            "透传原生链接属性",
            "HTML anchor 属性",
            "—",
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
