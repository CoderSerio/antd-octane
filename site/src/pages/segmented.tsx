import { BasicDemo, MoreDemo } from "../demos/segmented-basic";
import { ApiTable, Demo, DocMeta, usePageAnchor } from "../docs-ui";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Segmented <span>分段控制器</span>
        <small>Alpha</small>
      </h1>
      <p className="lead">在一组互斥选项之间快速切换。</p>
      <DocMeta name="Segmented" />
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <div className="demo-grid">
        <Demo
          id="basic"
          title="基本用法与尺寸"
          description="选择适合当前内容的状态和尺寸。"
          source={() => import("../demos/segmented-basic.tsx?raw")}
        >
          <BasicDemo />
        </Demo>
        <Demo
          id="more"
          title="受控值与布局"
          description="改变选项后，状态同步更新。"
          source={() => import("../demos/segmented-basic.tsx?raw")}
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
            "options",
            "选项，可含 label、value、icon、disabled、title",
            "(string | number | SegmentedOption)[]",
            "必填",
          ],
          [
            "value / defaultValue",
            "受控值 / 初始值",
            "string | number",
            "首项",
          ],
          ["onChange", "选项改变回调", "(value) => void", "—"],
          ["size", "尺寸", "small | middle | large", "middle"],
          ["disabled", "禁用整个控件", "boolean", "false"],
          ["name", "原生 radio 的表单名称", "string", "自动生成"],
          ["block / vertical", "填满宽度 / 垂直方向", "boolean", "false"],
          ["shape", "外形", "default | round", "default"],
        ]}
      />
      <h2 id="tokens" tabIndex={-1}>
        主题与支持范围
      </h2>
      <p>
        支持
        trackPadding、trackBg、itemColor、itemHoverColor、itemHoverBg、itemSelectedBg、itemActiveBg、itemSelectedColor。支持原生表单字段；方向键循环切换可用选项，Home
        / End 跳至首尾。当前采用即时选中背景，尚未实现滑块平移动画；不支持自定义
        prefixCls。
      </p>
    </>
  );
}
