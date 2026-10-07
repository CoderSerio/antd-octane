import { BasicDemo, MoreDemo } from "../demos/carousel-basic";
import { ApiTable, Demo, DocMeta, usePageAnchor } from "../docs-ui";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Carousel <span>走马灯</span>
        <small>Alpha</small>
      </h1>
      <p className="lead">将多个内容面板组织为可切换的幻灯片。</p>
      <DocMeta name="Carousel" />
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <div className="demo-grid">
        <Demo
          id="basic"
          title="基础使用"
          description="点击按钮查看内容，支持键盘聚焦与操作。"
          source={() => import("../demos/carousel-basic.tsx?raw")}
        >
          <BasicDemo />
        </Demo>
        <Demo
          id="more"
          title="自动播放"
          description="悬停、聚焦或使用暂停按钮停止自动播放。"
          source={() => import("../demos/carousel-basic.tsx?raw")}
        >
          <MoreDemo />
        </Demo>
      </div>
      <h2 id="api" tabIndex={-1}>
        API
      </h2>
      <ApiTable
        rows={[
          ["dots / arrows", "页码指示与切换按钮", "boolean", "true / false"],
          [
            "initialSlide / infinite",
            "初始索引 / 循环",
            "number / boolean",
            "0 / true",
          ],
          [
            "autoplay / autoplaySpeed",
            "自动切换及间隔",
            "boolean / number",
            "false / 3000",
          ],
          ["speed", "切换动画时长", "number", "500"],
          ["pauseOnHover / pauseOnFocus", "悬停 / 聚焦暂停", "boolean", "true"],
          [
            "dotPosition / vertical",
            "指示位置 / 纵向轨道",
            "top | bottom | left | right / boolean",
            "bottom / false",
          ],
          ["draggable", "指针滑动切换", "boolean", "true"],
          [
            "beforeChange / afterChange",
            "切换前 / 动画结束回调",
            "callback",
            "—",
          ],
          ["ref", "实例操作", "goTo(index, dontAnimate?), prev(), next()", "—"],
        ]}
      />
      <h2 id="tokens" tabIndex={-1}>
        主题与支持范围
      </h2>
      <p>
        支持 dotWidth、dotHeight、dotActiveWidth、dotGap、arrowSize、arrowOffset
        token。非当前面板
        inert，避免键盘进入屏外内容；自动播放提供暂停按钮，并在页面隐藏、聚焦、悬停或偏好减少动态效果时暂停。纵向轮播需指定容器高度。当前仅单面板滚动，不提供
        fade、多个同时显示、自定义箭头 / 指示器、adaptiveHeight 和完整 slick
        参数；循环边界直接回到首尾，不复制幻灯片形成无缝动画。
      </p>
    </>
  );
}
