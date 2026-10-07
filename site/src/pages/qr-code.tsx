import { BasicDemo, MoreDemo } from "../demos/qr-code-basic";
import { ApiTable, Demo, DocMeta, usePageAnchor } from "../docs-ui";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        QRCode <span>二维码</span>
        <small>Alpha</small>
      </h1>
      <p className="lead">将文本编码为可扫描的二维码，支持 Canvas 与 SVG。</p>
      <DocMeta name="QRCode" />
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <div className="demo-grid">
        <Demo
          id="basic"
          title="内容与渲染方式"
          description="修改文本同步生成两种渲染结果。"
          source={() => import("../demos/qr-code-basic.tsx?raw")}
        >
          <BasicDemo />
        </Demo>
        <Demo
          id="more"
          title="状态与颜色"
          description="刷新过期二维码；颜色需保持足够对比度。"
          source={() => import("../demos/qr-code-basic.tsx?raw")}
        >
          <MoreDemo />
        </Demo>
      </div>
      <h2 id="api" tabIndex={-1}>
        API
      </h2>
      <ApiTable
        rows={[
          ["value", "编码内容", "string", "—"],
          ["type", "渲染方式", "canvas | svg", "canvas"],
          ["size", "包含边框与间距的边长，最小64", "number", "160"],
          ["color / bgColor", "前景 / 背景色", "string", "主题文字 / 容器背景"],
          ["errorLevel", "纠错等级", "L | M | Q | H", "M"],
          ["bordered", "显示边框", "boolean", "true"],
          [
            "status / onRefresh",
            "状态 / 刷新回调",
            "active | expired | loading | scanned / callback",
            "active / —",
          ],
        ]}
      />
      <h2 id="tokens" tabIndex={-1}>
        主题与支持范围
      </h2>
      <p>
        使用 Project Nayuki 的 MIT 编码算法，保留四模块静区。支持 QRCode 全局
        alias token 覆盖；Canvas
        按设备像素比绘制。超长或空文本显示提示，不抛出渲染错误。
      </p>
      <p>
        暂不提供中心图标、iconSize、statusRender、下载 ref 或完整内部 DOM
        兼容。默认保留的静区与上游示例的视觉密度可能不同。
      </p>
    </>
  );
}
