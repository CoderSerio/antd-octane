import { BasicDemo, MoreDemo } from "../demos/spin-basic";
import { ApiTable, Demo, DocMeta, usePageAnchor } from "../docs-ui";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Spin <span>加载中</span>
        <small>Alpha</small>
      </h1>
      <p className="lead">内容正在异步加载时，提供明确的等待反馈。</p>
      <DocMeta name="Spin" />
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <div className="demo-grid">
        <Demo
          id="basic"
          title="三种尺寸"
          description="根据使用空间选择尺寸；页面内容的加载建议在容器内展示。"
          source={() => import("../demos/spin-basic.tsx?raw")}
        >
          <BasicDemo />
        </Demo>
        <Demo
          id="more"
          title="局部加载与延迟"
          description="加载切换后等待 200ms 再展示指示器，减少短暂请求引起的闪烁。"
          source={() => import("../demos/spin-basic.tsx?raw")}
        >
          <MoreDemo />
        </Demo>
      </div>
      <h2 id="api" tabIndex={-1}>
        API
      </h2>
      <ApiTable
        rows={[
          ["spinning", "是否加载中", "boolean", "true"],
          ["size", "指示器尺寸", "small | default | large", "default"],
          ["delay", "延迟显示指示器，单位毫秒", "number", "0"],
          ["tip", "嵌套内容或全屏模式的提示", "OctaneNode", "—"],
          ["indicator", "自定义加载图标", "OctaneNode", "默认指示器"],
          ["fullscreen", "全屏遮罩", "boolean", "false"],
          ["wrapperClassName", "嵌套内容外层的类名", "string", "—"],
        ]}
      />
      <h2 id="tokens" tabIndex={-1}>
        主题与支持范围
      </h2>
      <p>
        支持 Spin 的 dotSize、dotSizeSM、dotSizeLG、contentHeight
        token，继承全局主色与动效设置。tip 需要配合 children 或 fullscreen
        使用；暂不支持 percent / auto 进度和 setDefaultIndicator
        静态方法。全屏层采用固定定位，尚未接入共享 portal；带 transform
        的祖先可能限制其覆盖范围。
      </p>
    </>
  );
}
