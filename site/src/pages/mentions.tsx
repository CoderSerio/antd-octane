import { BasicDemo } from "../demos/mentions-basic";
import { PrefixDemo } from "../demos/mentions-prefix";
import { ApiTable, Demo, DocMeta, usePageAnchor } from "../docs-ui";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Mentions <span>提及</span>
        <small>Alpha</small>
      </h1>
      <p className="lead">在多行文本的光标位置插入成员或标签。</p>
      <DocMeta name="Mentions" />
      <h2 id="when" tabIndex={-1}>
        何时使用
      </h2>
      <p>
        评论、任务描述等保留自由文本的输入场景；需要独立值选择时使用 Select。
      </p>
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <div className="demo-grid">
        <Demo
          id="basic"
          title={"受控成员提及"}
          description={
            "输入 @ 后用方向键/Enter 选择，禁用成员不能插入；支持清除和文本域自动高度。"
          }
          source={() => import("../demos/mentions-basic.tsx?raw")}
        >
          <BasicDemo />
        </Demo>
        <Demo
          id="prefix"
          title={"标签前缀与搜索"}
          description={
            "使用 #、自定义过滤及空状态；插入的是 option.value，而不是显示标签。"
          }
          source={() => import("../demos/mentions-prefix.tsx?raw")}
        >
          <PrefixDemo />
        </Demo>
      </div>
      <h2 id="api" tabIndex={-1}>
        API
      </h2>
      <p>
        以下为本页使用的支持子集。完整类型以安装包声明为准，不直接照搬上游未实现属性。
      </p>
      <ApiTable
        rows={[
          [
            "options",
            "包含 value、label、disabled、title、key 的建议",
            "MentionsOption[]",
            "[]",
          ],
          [
            "value / defaultValue / onChange",
            "受控文本 / 初始文本 / 全文本变化",
            "string / string / (text) => void",
            "— / 空字符串 / —",
          ],
          [
            "prefix / split",
            "触发前缀和插入后的分隔符",
            "string | string[] / string",
            "@ / 空格",
          ],
          [
            "onSearch / onSelect",
            "当前查询 / 选中项，均包含前缀",
            "(text, prefix) => void / (option, prefix) => void",
            "—",
          ],
          [
            "filterOption / validateSearch",
            "建议过滤 / 查询有效性",
            "false | function / function",
            "按 value 过滤 / 不含 split",
          ],
          [
            "notFoundContent",
            "自定义空内容；显式 null 不回退",
            "OctaneNode",
            "locale.Mentions",
          ],
          [
            "allowClear / onClear",
            "清除与通知",
            "boolean | { clearIcon } / () => void",
            "false / —",
          ],
          [
            "autoSize / rows",
            "自动高度或固定行数",
            "boolean | { minRows, maxRows } / number",
            "false / 1",
          ],
          [
            "placement / getPopupContainer",
            "建议上下位置 / 容器",
            "top | bottom / function",
            "bottom / provider",
          ],
          ["ref", "focus、blur、textarea、nativeElement", "MentionsRef", "—"],
        ]}
      />
      <h2 id="scope" tabIndex={-1}>
        行为与支持范围
      </h2>
      <p>
        {
          "输入法组合期间不选择建议；Escape 关闭，普通 Enter 在建议关闭时仍可换行。受控值须由父组件接受 onChange，不能依赖内部修改。"
        }
      </p>
      <p>
        {
          "空状态和清除标签来自 ConfigProvider.locale.Mentions，notFoundContent 属性优先。size、disabled、direction、variant 继承现有配置；只读文本不会选择建议。"
        }
      </p>
      <p>
        {
          "不含旧式 Mentions.Option、loading、自定义下拉渲染或完整上游 API。输入区复用 Input Token、建议区复用 Select Token，尚无独立 Mentions 专属 Token 合同。"
        }
      </p>
    </>
  );
}
