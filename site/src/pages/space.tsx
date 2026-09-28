import { AlignmentDemo } from "../demos/space-alignment";
import { BasicDemo } from "../demos/space-basic";
import { LayoutDemo } from "../demos/space-layout";
import { SizesDemo } from "../demos/space-sizes";
import { SplitDemo } from "../demos/space-split";
import { VerticalDemo } from "../demos/space-vertical";
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
      <div className="demo-grid">
        <Demo
          id="basic"
          title="基本使用"
          description="相邻的行内组件使用一致的水平间距。"
          source={() => import("../demos/space-basic.tsx?raw")}
        >
          <BasicDemo />
        </Demo>
        <Demo
          id="sizes"
          title="间距尺寸"
          description="在 small、middle 和 large 之间切换，预设值随主题 token 变化。"
          source={() => import("../demos/space-sizes.tsx?raw")}
        >
          <SizesDemo />
        </Demo>
        <Demo
          id="layout"
          title="自动换行"
          description="size 数组分别设置横向、纵向间距；窄容器中项目自动换行。"
          source={() => import("../demos/space-layout.tsx?raw")}
        >
          <LayoutDemo />
        </Demo>
        <Demo
          id="vertical"
          title="垂直间距"
          description="direction=vertical 以一致间距排列块级内容。"
          source={() => import("../demos/space-vertical.tsx?raw")}
        >
          <VerticalDemo />
        </Demo>
        <Demo
          id="alignment"
          title="对齐"
          description="比较 start、center、end、baseline 对不同高度子项的效果。"
          source={() => import("../demos/space-alignment.tsx?raw")}
        >
          <AlignmentDemo />
        </Demo>
        <Demo
          id="split"
          title="分隔符"
          description="split 在有效子项之间加入分隔元素。"
          source={() => import("../demos/space-split.tsx?raw")}
        >
          <SplitDemo />
        </Demo>
      </div>
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
        Space.Compact、Space.Addon、语义化 classNames /
        styles；上游紧凑布局案例暂不提供。可使用 Flex 控制无包装布局。
      </p>
    </>
  );
}
