import { ComponentWhenToUse } from "../component-prose";
import {
  ComponentApiTables,
  ComponentTokenTable,
} from "../component-reference";
import reference from "../data-display/carousel.json";
import {
  ArrowsDemo,
  AutoplayDemo,
  BasicDemo,
  DotDurationDemo,
  FadeDemo,
  PositionDemo,
} from "../demos/carousel-basic";
import { ApiTable, Demo, DemoGrid, DocMeta, usePageAnchor } from "../docs-ui";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Carousel <span>走马灯</span>
      </h1>
      <p className="lead">一组轮播的区域。</p>
      <DocMeta name="Carousel" />
      <ComponentWhenToUse component="Carousel" />
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <DemoGrid>
        <Demo
          id="basic"
          title={"基本"}
          description={"最简单的用法。"}
          descriptionMarkdown
          source={() => import("../demos/carousel-basic.tsx?raw")}
          sourceExport="BasicDemo"
        >
          <BasicDemo />
        </Demo>
        <Demo
          id="position"
          title={"位置"}
          description={"位置有 4 个方向。"}
          descriptionMarkdown
          source={() => import("../demos/carousel-basic.tsx?raw")}
          sourceExport="PositionDemo"
        >
          <PositionDemo />
        </Demo>
        <Demo
          id="autoplay"
          title={"自动切换"}
          description={"定时切换下一张。"}
          descriptionMarkdown
          source={() => import("../demos/carousel-basic.tsx?raw")}
          sourceExport="AutoplayDemo"
        >
          <AutoplayDemo />
        </Demo>
        <Demo
          id="fade"
          title={"渐显"}
          description={"切换效果为渐显。"}
          descriptionMarkdown
          source={() => import("../demos/carousel-basic.tsx?raw")}
          sourceExport="FadeDemo"
        >
          <FadeDemo />
        </Demo>
        <Demo
          id="arrows"
          title={"切换箭头"}
          description={"显示切换箭头。"}
          descriptionMarkdown
          source={() => import("../demos/carousel-basic.tsx?raw")}
          sourceExport="ArrowsDemo"
        >
          <ArrowsDemo />
        </Demo>
        <Demo
          id="dot-duration"
          title={"进度条"}
          description={"展示指示点的进度。"}
          descriptionMarkdown
          source={() => import("../demos/carousel-basic.tsx?raw")}
          sourceExport="DotDurationDemo"
        >
          <DotDurationDemo />
        </Demo>
      </DemoGrid>
      <h2 id="api" tabIndex={-1}>
        API
      </h2>
      <ComponentApiTables component="Carousel" sections={reference.api} />
      <h3>方法</h3>
      <ApiTable
        rows={[
          [
            "goTo(slideNumber, dontAnimate)",
            "切换到指定面板，dontAnimate = true 时不使用动画",
            "function(slideNumber: number, dontAnimate?: boolean)",
            "—",
          ],
          ["next()", "切换到下一面板", "function()", "—"],
          ["prev()", "切换到上一面板", "function()", "—"],
        ]}
        label="Carousel 方法表，可横向滚动"
      />

      <h2 id="tokens" tabIndex={-1}>
        主题变量（Design Token）
      </h2>
      <ComponentTokenTable component="Carousel" tokens={reference.tokens} />
    </>
  );
}
