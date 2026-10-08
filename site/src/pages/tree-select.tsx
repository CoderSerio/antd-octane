import { BasicDemo } from "../demos/tree-select-basic";
import { MultipleDemo } from "../demos/tree-select-multiple";
import { ApiTable, Demo, DocMeta, usePageAnchor } from "../docs-ui";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        TreeSelect <span>树选择</span>
        <small>Alpha</small>
      </h1>
      <p className="lead">在层级目录中选择独立节点。</p>
      <DocMeta name="TreeSelect" />
      <h2 id="when" tabIndex={-1}>
        何时使用
      </h2>
      <p>
        展示父子关系，但返回节点值而非整条路径时使用；完整路径选择使用
        Cascader。
      </p>
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <div className="demo-grid">
        <Demo
          id="basic"
          title={"单选与清除"}
          description={
            "字符串/数字值须在整棵树内唯一，单选清除回调为 undefined。"
          }
          source={() => import("../demos/tree-select-basic.tsx?raw")}
        >
          <BasicDemo />
        </Demo>
        <Demo
          id="multiple"
          title={"搜索与独立多选"}
          description={
            "搜索保留匹配节点的祖先路径；多选是节点选择，不是复选框父子联动。"
          }
          source={() => import("../demos/tree-select-multiple.tsx?raw")}
        >
          <MultipleDemo />
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
            "treeData / fieldNames",
            "树数据及 value/label/children 映射；默认显示 title",
            "TreeSelectNode[] / object",
            "[] / 默认字段",
          ],
          [
            "value / defaultValue",
            "单选值或 multiple 模式值数组",
            "string | number | null / (string | number)[]",
            "受控 / 初始值",
          ],
          [
            "multiple / onChange",
            "独立多选及值变化；回调只传值",
            "boolean / (value) => void",
            "false / —",
          ],
          [
            "showSearch / searchValue / onSearch",
            "文本标题搜索及受控搜索",
            "boolean / string / function",
            "false / — / —",
          ],
          [
            "treeDefaultExpandAll / treeExpandedKeys / onTreeExpand",
            "初始全展开 / 受控展开 / 变化通知",
            "boolean / (string | number)[] / function",
            "false / — / —",
          ],
          [
            "allowClear / onClear",
            "单选清除为 undefined，多选为 []",
            "boolean / () => void",
            "false / —",
          ],
          [
            "open / defaultOpen / onOpenChange",
            "弹层控制",
            "boolean / boolean / function",
            "— / false / —",
          ],
          [
            "getPopupContainer / ref",
            "容器及 focus/blur/nativeElement",
            "function / TreeSelectRef",
            "provider / —",
          ],
          [
            "disabled / size / status",
            "禁用、尺寸及校验外观",
            "boolean / small | middle | large / error | warning",
            "继承 provider / —",
          ],
        ]}
      />
      <h2 id="scope" tabIndex={-1}>
        行为与支持范围
      </h2>
      <p>
        {
          "省略 value 使用内部状态；显式 value={undefined} 是受控空值。单选回调只返回值，多选返回数组，不提供上游 label/extra 参数。"
        }
      </p>
      <p>
        {
          "方向键、Home/End、Enter/Space 由 Tree 提供；触发器 ArrowDown 打开，再按一次进入树，Escape 返回输入框，Tab 离开时关闭。非文本标题按 value 搜索与显示。"
        }
      </p>
      <p>
        {
          "不含 treeCheckable、checked strategy、labelInValue、simple mode、loadData、虚拟滚动、标签单独删除或 render hooks。异步数据由应用更新 treeData。触发器/弹层复用 Select Token，未声称全部无障碍、视觉或专属 Token 对齐。"
        }
      </p>
    </>
  );
}
