import { BasicDemo, MoreDemo } from "../demos/spin-basic";
import { FullscreenDemo } from "../demos/spin-fullscreen";
import { IndicatorDemo } from "../demos/spin-indicator";
import { PercentDemo } from "../demos/spin-percent";
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
        <Demo
          id="fullscreen"
          title="全屏刷新反馈"
          description="短时间刷新整个工作区时使用全屏遮罩，任务完成后由应用关闭。"
          source={() => import("../demos/spin-fullscreen.tsx?raw")}
        >
          <FullscreenDemo />
        </Demo>
        <Demo
          id="indicator"
          title="自定义指示器"
          description="indicator 替换默认四点图案；提示与内容加载状态仍由 Spin 管理，自定义图标不会自动获得动画。"
          source={() => import("../demos/spin-indicator.tsx?raw")}
        >
          <IndicatorDemo />
        </Demo>
        <Demo
          id="percent"
          title="百分比与自动进度"
          description="percent 显示进度环；auto 模拟等待进度，任务结束仍由应用关闭 spinning。"
          source={() => import("../demos/spin-percent.tsx?raw")}
        >
          <PercentDemo />
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
          [
            "indicator",
            "自定义加载元素；优先于 ConfigProvider.spin.indicator 和静态默认值",
            "SpinIndicator",
            "默认指示器",
          ],
          [
            "percent",
            "数值进度或模拟进度；不自动结束加载",
            "number | auto",
            "—",
          ],
          [
            "Spin.setDefaultIndicator",
            "设置进程级默认指示器；需作用域隔离时用 ConfigProvider",
            "(indicator: OctaneNode) => void",
            "—",
          ],
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
        使用。percent="auto"
        随时间模拟增长，不反映真实请求进度，也不会自行完成任务。
        全屏层采用固定定位，尚未接入共享 portal；带 transform
        的祖先可能限制其覆盖范围。 嵌套模式通过模糊和遮罩反馈等待，没有设置
        inert 或统一拦截键盘焦点；
        需要阻止编辑时由应用禁用内容控件。全屏模式由应用维护 spinning 状态。
        示例仅在加载时挂载全屏 Spin，任务结束后移除相关节点。
      </p>
    </>
  );
}
