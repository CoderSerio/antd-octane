import { BasicDemo, MoreDemo } from "../demos/affix-basic";
import { ApiTable, Demo, DocMeta, usePageAnchor } from "../docs-ui";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Affix <span>固钉</span>
        <small>Alpha</small>
      </h1>
      <p className="lead">滚动时将操作保持在视口或指定容器边缘。</p>
      <DocMeta name="Affix" />
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <div className="demo-grid">
        <Demo
          id="basic"
          title="指定滚动容器"
          description="在示例区域操作，查看状态变化。"
          source={() => import("../demos/affix-basic.tsx?raw")}
        >
          <BasicDemo />
        </Demo>
        <Demo
          id="more"
          title="固定到底部"
          description="在示例区域操作，查看状态变化。"
          source={() => import("../demos/affix-basic.tsx?raw")}
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
            "offsetTop / offsetBottom",
            "距目标容器顶部 / 底部距离",
            "number",
            "顶部 0",
          ],
          [
            "target",
            "监听的滚动容器",
            "() => Window | HTMLElement | null",
            "window",
          ],
          ["onChange", "固定状态改变", "(affixed) => void", "—"],
          ["ref.updatePosition", "手动重算位置", "() => void", "—"],
        ]}
      />
      <h2 id="tokens" tabIndex={-1}>
        主题与支持范围
      </h2>
      <p>
        支持 zIndexPopup 和全局层级。监听目标滚动、窗口 resize 和
        ResizeObserver，卸载时移除监听并取消帧。固定元素采用 viewport fixed
        定位；带 transform 的祖先、跨窗口容器和滚动裁剪边缘不在当前保证范围。
      </p>
    </>
  );
}
