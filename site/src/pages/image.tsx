import { BasicDemo, MoreDemo } from "../demos/image-basic";
import { ApiTable, Demo, DocMeta, usePageAnchor } from "../docs-ui";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Image <span>图片</span>
        <small>Alpha</small>
      </h1>
      <p className="lead">显示图片，并在可访问的预览层中放大查看。</p>
      <DocMeta name="Image" />
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <div className="demo-grid">
        <Demo
          id="basic"
          title="基础使用"
          description="点击按钮查看内容，支持键盘聚焦与操作。"
          source={() => import("../demos/image-basic.tsx?raw")}
        >
          <BasicDemo />
        </Demo>
        <Demo
          id="more"
          title="预览分组"
          description="预览后可以切换组内图片或调整缩放。"
          source={() => import("../demos/image-basic.tsx?raw")}
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
            "src / alt / width / height",
            "原生图片内容与尺寸",
            "string / string / number | string",
            "—",
          ],
          ["loading", "浏览器原生懒加载", "lazy | eager", "浏览器默认"],
          [
            "fallback / placeholder",
            "加载失败替代图 / 加载占位",
            "string / OctaneNode",
            "—",
          ],
          ["preview", "启用或控制预览", "boolean | ImagePreviewConfig", "true"],
          [
            "preview.visible / onVisibleChange",
            "受控显示与变化",
            "boolean / callback",
            "—",
          ],
          ["preview.src", "单独预览源", "string", "src"],
          ["Image.PreviewGroup", "多图分组", "children, preview", "—"],
          [
            "PreviewGroup.preview.current / onChange",
            "受控序号与切换",
            "number / (current, previous) => void",
            "0 / —",
          ],
        ]}
      />
      <h2 id="tokens" tabIndex={-1}>
        主题与支持范围
      </h2>
      <p>
        预览复用共享对话框能力：锁定背景滚动、管理焦点、Escape
        关闭并返回原触发器。支持组内上下张及 100%–300% 缩放；左右键切换。支持
        Image 预览操作颜色与大小
        token。当前没有旋转、翻转、下载、图片拖拽、鼠标滚轮缩放和工具栏自定义；放大后通过预览区滚动查看。PreviewGroup
        当前从子 Image 注册图片，未提供 items 配置。
      </p>
    </>
  );
}
