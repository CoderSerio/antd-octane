import { BasicDemo } from "../demos/flex-basic";
import { ApiTable, Demo, DocMeta, usePageAnchor } from "../docs-ui";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Flex <span>弹性布局</span>
        <small>Alpha</small>
      </h1>
      <p className="lead">
        无需额外子元素包装，控制行列方向、对齐、换行和间距。
      </p>
      <DocMeta name="Flex" />
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <Demo
        id="basic"
        title="基本使用"
        description="切换顶部主题，观察布局与状态；展开查看完整示例。"
        source={() => import("../demos/flex-basic.tsx?raw")}
      >
        <BasicDemo />
      </Demo>
      <h2 id="api" tabIndex={-1}>
        API
      </h2>
      <ApiTable
        rows={[
          ["vertical", "使用纵向布局", "boolean", "false"],
          ["wrap", "换行设置", "boolean | CSS flex-wrap", "false"],
          ["justify / align", "主轴 / 交叉轴对齐", "CSS 属性值", "—"],
          [
            "gap",
            "间距；数字为像素",
            "small | middle | large | number | string",
            "—",
          ],
          ["flex", "自身弹性比例", "CSS flex", "—"],
        ]}
      />
      <h2 id="tokens" tabIndex={-1}>
        主题与支持范围
      </h2>
      <p>
        gap 的预设值随全局 paddingXS / padding / paddingLG 变化。支持 className
        和 style；暂不支持 component 自定义根节点和组件级 token。
      </p>
    </>
  );
}
