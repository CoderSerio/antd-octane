import { BasicDemo, MoreDemo } from "../demos/watermark-basic";
import { ApiTable, Demo, DocMeta, usePageAnchor } from "../docs-ui";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Watermark <span>水印</span>
        <small>Alpha</small>
      </h1>
      <p className="lead">为内容区叠加重复文字或图片，标记用途与来源。</p>
      <DocMeta name="Watermark" />
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <div className="demo-grid">
        <Demo
          id="basic"
          title="多行文字水印"
          description="可交互示例，可切换全局主题观察效果。"
          source={() => import("../demos/watermark-basic.tsx?raw")}
        >
          <BasicDemo />
        </Demo>
        <Demo
          id="more"
          title="图片、间距与旋转"
          description="通过按钮改变配置，观察内容和布局的更新。"
          source={() => import("../demos/watermark-basic.tsx?raw")}
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
            "content",
            "文字或多行文字；图片失败时回退内容",
            "string | string[]",
            "—",
          ],
          ["image", "图片地址；跨域图片需允许 CORS", "string", "—"],
          [
            "width / height",
            "单个水印内容尺寸",
            "number",
            "文字测量 / 图片120×64",
          ],
          ["rotate", "旋转角度", "number", "-22"],
          [
            "gap / offset",
            "重复图案间距 / 背景偏移",
            "[number, number]",
            "[100,100] / [0,0]",
          ],
          [
            "font",
            "颜色、字号、字重、字体、样式与对齐",
            "object",
            "继承全局字体及弱化文字色",
          ],
          ["zIndex", "水印层级", "number", "9"],
        ]}
      />
      <h2 id="tokens" tabIndex={-1}>
        主题与支持范围
      </h2>
      <p>
        使用原生 canvas
        生成重复背景并适配设备像素比；文字颜色、字体随全局主题更新。图片水印自行提供透明度。背景覆盖层不接收指针事件。暂不支持
        inherit、弹层自动继承、语义 styles/classNames 和上游交错布局算法。
      </p>
      <p>
        水印只用于视觉标记，不是访问控制或防泄漏措施；不提供防篡改能力。图片应来自可信且允许跨域读取的地址；加载或导出失败时回退文字。
      </p>
    </>
  );
}
