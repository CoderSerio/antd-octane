import { BasicDemo } from "../demos/transfer-basic";
import { SearchDemo } from "../demos/transfer-search";
import { ApiTable, Demo, DocMeta, usePageAnchor } from "../docs-ui";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Transfer <span>穿梭框</span>
        <small>Alpha</small>
      </h1>
      <p className="lead">通过左右列表分配一组已有条目。</p>
      <DocMeta name="Transfer" />
      <h2 id="when" tabIndex={-1}>
        何时使用
      </h2>
      <p>选择权限或成员子集，需要同时展示待选和已选项时使用。</p>
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <div className="demo-grid">
        <Demo
          id="basic"
          title={"受控目标列表"}
          description={"onChange 的 targetKeys 必须写回；禁用条目不能移动。"}
          source={() => import("../demos/transfer-basic.tsx?raw")}
        >
          <BasicDemo />
        </Demo>
        <Demo
          id="search"
          title={"搜索与受控勾选"}
          description={
            "搜索会匹配标题和描述；全选仅影响可见且可用条目，左右勾选回调分别返回。"
          }
          source={() => import("../demos/transfer-search.tsx?raw")}
        >
          <SearchDemo />
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
            "dataSource",
            "每项包含唯一字符串 key、title、description、disabled",
            "TransferItem[]",
            "[]",
          ],
          [
            "targetKeys / onChange",
            "目标列表及移动结果",
            "string[] / (keys, direction, moveKeys) => void",
            "[] / —",
          ],
          [
            "selectedKeys / onSelectChange",
            "受控勾选，或省略使用内部状态",
            "string[] / (sourceKeys, targetKeys) => void",
            "内部状态 / —",
          ],
          [
            "showSearch / filterOption / onSearch",
            "每侧搜索、过滤及输入回调",
            "boolean / (text, item) => boolean / (direction, text) => void",
            "false / 内置过滤 / —",
          ],
          [
            "titles / operations",
            "左右标题 / 向右和向左按钮内容",
            "[OctaneNode, OctaneNode]",
            "Source, Target / Move right, Move left",
          ],
          [
            "render",
            "自定义每项显示内容",
            "(item) => OctaneNode",
            "title 或 key",
          ],
          [
            "showSelectAll / disabled",
            "显示全选 / 禁用整个组件",
            "boolean",
            "true / provider",
          ],
          [
            "listStyle / style / className",
            "列表和根节点样式",
            "CSSProperties / CSSProperties / string",
            "—",
          ],
        ]}
      />
      <h2 id="scope" tabIndex={-1}>
        行为与支持范围
      </h2>
      <p>
        {
          "targetKeys 始终由外部控制。selectedKeys 可控或不传；回调中 direction 为 left 或 right，moveKeys 仅包含可移动条目。"
        }
      </p>
      <p>
        {
          "使用原生复选框和按钮：Tab 移动焦点、Space 勾选、Enter 激活移动按钮。全选和移动都跳过 disabled 条目。"
        }
      </p>
      <p>
        {
          "不含分页、oneWay、rowKey、footer、自定义列表、独立操作区定位或完整上游组件 Token/视觉对齐。继承 ConfigProvider 禁用、方向及基础主题。"
        }
      </p>
    </>
  );
}
