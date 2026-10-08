import { BasicDemo } from "../demos/cascader-basic";
import { SearchDemo } from "../demos/cascader-search";
import { ApiTable, Demo, DocMeta, usePageAnchor } from "../docs-ui";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Cascader <span>级联选择</span>
        <small>Alpha</small>
      </h1>
      <p className="lead">用一条层级路径选择地区或目录。</p>
      <DocMeta name="Cascader" />
      <h2 id="when" tabIndex={-1}>
        何时使用
      </h2>
      <p>
        选项具有固定父子层级、需要返回完整路径时使用；独立树节点选择使用
        TreeSelect。
      </p>
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <div className="demo-grid">
        <Demo
          id="basic"
          title={"受控地区路径"}
          description={"选择叶节点提交路径，清除回调返回空数组。"}
          source={() => import("../demos/cascader-basic.tsx?raw")}
        >
          <BasicDemo />
        </Demo>
        <Demo
          id="search"
          title={"搜索与字段映射"}
          description={
            "使用自定义数据字段，按完整路径搜索；changeOnSelect 允许提交中间节点。"
          }
          source={() => import("../demos/cascader-search.tsx?raw")}
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
            "options / fieldNames",
            "层级数据与 value/label/children 字段映射；同级值须唯一",
            "CascaderOption[] / object",
            "[] / 默认字段",
          ],
          [
            "value / defaultValue",
            "受控路径 / 初始路径；清空为 []",
            "(string | number)[]",
            "— / []",
          ],
          [
            "onChange",
            "提交路径和对应的原始选项",
            "(path, selectedOptions) => void",
            "—",
          ],
          [
            "changeOnSelect",
            "允许中间节点提交，并保留展开菜单",
            "boolean",
            "false",
          ],
          [
            "showSearch / searchValue / onSearch",
            "整条文本路径过滤及受控搜索",
            "boolean / string / (text) => void",
            "false / — / —",
          ],
          [
            "allowClear / onClear",
            "清空路径及清除通知",
            "boolean / () => void",
            "false / —",
          ],
          [
            "open / defaultOpen / onOpenChange",
            "控制弹层显示",
            "boolean / boolean / (open) => void",
            "— / false / —",
          ],
          [
            "ref / getPopupContainer",
            "focus、blur、nativeElement；自定义容器",
            "CascaderRef / (trigger) => HTMLElement",
            "— / provider",
          ],
          [
            "disabled / size / status",
            "禁用、尺寸与校验外观",
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
          "只提供单路径选择。未实现 multiple、loadData、hover 展开、自定义过滤或渲染、Panel、labelInValue 和虚拟列表。"
        }
      </p>
      <p>
        {
          "ArrowDown 打开，再按一次进入列表；上下键与 Home/End 跳过禁用项，左右键展开或返回，Enter 选择，Escape 回到输入框。RTL 视觉方向会继承，但左右键语义尚不翻转。"
        }
      </p>
      <p>
        {
          "省略 value 使用内部状态；显式 value={undefined} 仍是受控空值。基础主题复用 Select Token，未声称完整 Cascader 视觉或专属 Token 对齐。"
        }
      </p>
    </>
  );
}
