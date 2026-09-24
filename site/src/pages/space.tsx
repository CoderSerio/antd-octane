import { BasicDemo } from "../demos/space-basic";
import { ApiTable, Demo, DocMeta, usePageAnchor } from "../docs-ui";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Space <span>间距</span>
        <small>Alpha</small>
      </h1>
      <p className="lead">
        为一组行内组件提供一致的间距，也支持纵向排列与分隔符。
      </p>
      <DocMeta name="Space" />
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <Demo
        id="basic"
        title="基本使用"
        description="切换顶部主题，观察布局与状态；展开查看完整示例。"
        source={() => import("../demos/space-basic.tsx?raw")}
      >
        <BasicDemo />
      </Demo>
      <h2 id="api" tabIndex={-1}>
        API
      </h2>
      <ApiTable
        rows={[
          ["direction", "排列方向", "horizontal | vertical", "horizontal"],
          [
            "size",
            "单值或 [横向, 纵向] 间距",
            "small | middle | large | number | [size, size]",
            "small",
          ],
          [
            "align",
            "对齐方式",
            "start | end | center | baseline",
            "水平为 center",
          ],
          ["wrap", "自动换行", "boolean", "false"],
          ["split", "间隔元素", "OctaneNode", "—"],
        ]}
      />
      <h2 id="tokens" tabIndex={-1}>
        主题与支持范围
      </h2>
      <p>
        预设间距消费全局 padding
        token。空子节点不占位；每个有效子项有包装节点。暂不支持
        Space.Compact、语义化 classNames / styles；可使用 Flex 控制无包装布局。
      </p>
    </>
  );
}
