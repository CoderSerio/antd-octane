import { BasicDemo, MoreDemo } from "../demos/radio-basic";
import { RadioButtonSizesDemo } from "../demos/radio-button-sizes";
import { RadioDisabledDemo } from "../demos/radio-disabled";
import { RadioVerticalDemo } from "../demos/radio-vertical";
import { ApiTable, Demo, DocMeta, usePageAnchor } from "../docs-ui";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Radio <span>单选框</span>
        <small>Alpha</small>
      </h1>
      <p className="lead">从互斥选项中选择一个，支持普通样式和按钮样式。</p>
      <DocMeta name="Radio" />
      <h2 id="when" tabIndex={-1}>
        何时使用
      </h2>
      <p>使用方向键切换同组单选项，使用 Tab 进入或离开选项组。</p>
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <div className="demo-grid">
        <Demo
          id="basic"
          title="基本使用"
          description="常用形态与状态，主题配置跟随页面切换。"
          source={() => import("../demos/radio-basic.tsx?raw")}
        >
          <BasicDemo />
        </Demo>
        <Demo
          id="more"
          title="组合与交互"
          description="结合业务内容验证配置和交互。"
          source={() => import("../demos/radio-basic.tsx?raw")}
        >
          <MoreDemo />
        </Demo>
        <Demo
          id="vertical"
          title="纵向排列与更多选项"
          description="通过 CSS 网格排列 Radio 子项；选择其他频率后启用独立输入框。"
          source={() => import("../demos/radio-vertical.tsx?raw")}
        >
          <RadioVerticalDemo />
        </Demo>
        <Demo
          id="button-sizes"
          title="按钮尺寸与整行布局"
          description="按钮组支持三种尺寸、outline/solid 填充与 block 整行布局。"
          source={() => import("../demos/radio-button-sizes.tsx?raw")}
        >
          <RadioButtonSizesDemo />
        </Demo>
        <Demo
          id="disabled"
          title="组禁用与单项禁用"
          description="动态禁用整组，同时保留某个选项自己的禁用设置。"
          source={() => import("../demos/radio-disabled.tsx?raw")}
        >
          <RadioDisabledDemo />
        </Demo>
      </div>
      <h2 id="api" tabIndex={-1}>
        API
      </h2>
      <ApiTable
        rows={[
          [
            "value / defaultValue",
            "Group 当前值 / 初始值",
            "string | number | boolean",
            "—",
          ],
          [
            "options",
            "Group 选项；也可使用 Radio 子项",
            "(string | number | RadioOption)[]",
            "—",
          ],
          [
            "checked / defaultChecked",
            "独立 Radio 的受控状态 / 初始状态",
            "boolean",
            "false",
          ],
          [
            "onChange",
            "选中值由 event.target.value 读取",
            "(RadioChangeEvent) => void",
            "—",
          ],
          [
            "optionType / buttonStyle",
            "普通/按钮样式与填充方式",
            "default | button / outline | solid",
            "default / outline",
          ],
          [
            "name / disabled",
            "原生组名与组禁用",
            "string / boolean",
            "自动生成 / false",
          ],
          [
            "size / block",
            "按钮尺寸与整行布局",
            "small | middle | large / boolean",
            "middle / false",
          ],
        ]}
      />
      <h2 id="tokens" tabIndex={-1}>
        主题与支持范围
      </h2>
      <p>
        支持组件变量 radioSize、dotSize、dotColorDisabled、按钮背景/颜色/间距及
        wrapperMarginInlineEnd；全局 token 参与主题计算。支持
        Radio.Button、原生输入属性和 ref.current.focus / blur。暂不支持 Form
        集成、wireframe、完整波纹与按压动效，以及语义化 styles/classNames。
        没有专用 vertical 属性，纵向排列由 CSS 实现。Group
        子项的选中状态由组值决定， 不应同时给子项设置独立 checked。
      </p>
    </>
  );
}
