import { BasicDemo, MoreDemo } from "../demos/affix-basic";
import { OffsetDemo } from "../demos/affix-offset";
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
        <Demo
          id="offset"
          title="动态偏移与状态回调"
          description="指定容器内改变 offsetTop，观察固定状态；ref.updatePosition 可主动重算。"
          source={() => import("../demos/affix-offset.tsx?raw")}
        >
          <OffsetDemo />
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
        同时指定 offsetTop 与 offsetBottom 时优先使用顶部；target 返回 null
        时不会注册监听。updatePosition 用于应用已知的布局改变，不是滚动操作。
      </p>
    </>
  );
}
