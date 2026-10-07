import { BasicDemo, MoreDemo } from "../demos/avatar-basic";
import { ApiTable, Demo, DocMeta, usePageAnchor } from "../docs-ui";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Avatar <span>头像</span>
        <small>Alpha</small>
      </h1>
      <p className="lead">展示图片、字符或图标形式的用户标识。</p>
      <DocMeta name="Avatar" />
      <h2 id="when" tabIndex={-1}>
        何时使用
      </h2>
      <p>字符过长时按可用宽度缩放；图片失败可回退至 icon 或 children。</p>
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <div className="demo-grid">
        <Demo
          id="basic"
          title="基本使用"
          description="常用形态与状态，主题配置跟随页面切换。"
          source={() => import("../demos/avatar-basic.tsx?raw")}
        >
          <BasicDemo />
        </Demo>
        <Demo
          id="more"
          title="组合与交互"
          description="结合业务内容验证配置和交互。"
          source={() => import("../demos/avatar-basic.tsx?raw")}
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
            "size / shape",
            "尺寸和形状",
            "number | small | default | large / circle | square",
            "default / circle",
          ],
          ["src / srcSet / alt", "图片地址与替代文本", "string", "—"],
          [
            "icon / children",
            "图片不可用时显示的图标或字符",
            "OctaneNode",
            "—",
          ],
          ["gap", "字符左右留白", "number", "4"],
          [
            "onError",
            "图片失败；返回 false 阻止内部回退",
            "() => boolean | void",
            "—",
          ],
        ]}
      />
      <h2 id="tokens" tabIndex={-1}>
        主题与支持范围
      </h2>
      <p>
        支持 containerSize、textFontSize、iconFontSize 及各自的 LG / SM 组件
        token。支持 ResizeObserver 尺寸变化和文字缩放。暂不支持
        Avatar.Group、响应式 size 对象、元素形式 src。ref.current.nativeElement
        可访问外层元素。
      </p>
    </>
  );
}
