import { ApiTable, usePageAnchor } from "../docs-ui";
export default function Compatibility({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>兼容与迁移</h1>
      <p className="lead">
        验证基线为 Ant Design 5.29.3、Octane
        0.4.3。以下为支持子集，不代表完整兼容。
      </p>
      <h2 id="matrix" tabIndex={-1}>
        支持矩阵
      </h2>
      <ApiTable
        headers={["组件", "支持范围", "状态", "版本"]}
        label="组件兼容矩阵，可横向滚动"
        rows={[
          [
            "Affix / Anchor / FloatButton / Tour",
            "定位、滚动、引导和键盘；不含所有变换/裁剪场景",
            "基础实现",
            "alpha",
          ],
          [
            "Image / Carousel",
            "预览、分组、缩放、轮播与暂停；不含完整高级工具栏或 slick 接口",
            "基础实现",
            "alpha",
          ],
          [
            "Splitter / Watermark",
            "拖拽与键盘尺寸调整、Canvas 水印；不含折叠/防篡改保障",
            "基础实现",
            "alpha",
          ],
          [
            "App / Icon / QRCode",
            "消息上下文、SVG 数据适配、真实二维码；非完整上游 API",
            "基础实现",
            "alpha",
          ],
          [
            "Message / Notification",
            "hook、contextHolder、计时器、更新和关闭；不含静态API/堆叠",
            "基础实现",
            "alpha",
          ],
          [
            "Modal / Drawer",
            "受控浮层、焦点管理、滚动锁；不含静态API/动画",
            "基础实现",
            "alpha",
          ],
          [
            "Menu / Dropdown / Popconfirm",
            "菜单、触发与确认交互；详见各组件边界",
            "基础实现",
            "alpha",
          ],
          [
            "InputNumber / Slider",
            "数值输入、精度、范围、键盘和指针操作；支持子集",
            "基础实现",
            "alpha",
          ],
          [
            "Button",
            "常用类型、尺寸、状态、图标位置、延迟加载、链接与 ref",
            "基础实现",
            "alpha.4",
          ],
          [
            "Input",
            "基础输入、前后缀/清除、字数统计、Password/Search/TextArea 与 ref",
            "基础实现",
            "alpha.4",
          ],
          [
            "Form",
            "平面字段绑定、同步规则、提交与重置；不含嵌套路径、动态列表和异步规则",
            "基础实现",
            "alpha.3",
          ],
          [
            "Select",
            "单选与多选、搜索、受控值、键盘与清除；不含 tags、labelInValue、虚拟列表",
            "基础实现",
            "alpha.5",
          ],
          ["Radio", "单选、选择组、按钮样式与键盘", "基础实现", "alpha"],
          [
            "Tag / Alert / Card / Badge / Avatar",
            "常用展示与交互；详见各组件页面",
            "基础实现",
            "alpha",
          ],
          ["Switch", "状态、键盘、加载、大小与 ref", "基础实现", "alpha"],
          [
            "Flex / Space / Divider",
            "基础布局、间距与分割线",
            "基础实现",
            "alpha",
          ],
          [
            "Checkbox",
            "受控、非受控、禁用、中间态、ref 与 Group",
            "基础实现",
            "alpha",
          ],
          ["Grid / Layout", "响应式栅格、布局与折叠侧栏", "基础实现", "alpha"],
          [
            "Collapse / Tabs",
            "面板切换、内容保留与键盘交互",
            "基础实现",
            "alpha",
          ],
          [
            "Empty / Statistic / Timeline / Descriptions",
            "空状态、统计与信息展示",
            "基础实现",
            "alpha",
          ],
          [
            "Typography / List",
            "文字编辑、复制、列表及响应式网格",
            "基础实现",
            "alpha",
          ],
          [
            "Spin / Skeleton",
            "延迟加载、局部加载与内容占位",
            "基础实现",
            "alpha",
          ],
          [
            "Progress / Result",
            "进度状态、结果展示与后续操作",
            "基础实现",
            "alpha",
          ],
          ["Segmented / Rate", "分段选择、评分与键盘交互", "基础实现", "alpha"],
          [
            "Breadcrumb / Steps / Pagination",
            "面包屑、步骤、页码与条数切换",
            "基础实现",
            "alpha",
          ],
          [
            "Tooltip / Popover",
            "原生 portal、触发、定位与上下文继承",
            "基础实现",
            "alpha",
          ],
          [
            "ConfigProvider",
            "主题、尺寸、禁用与嵌套作用域",
            "基础实现",
            "alpha",
          ],
          ["Table / DatePicker", "表格与日期选择器", "未实现", "—"],
        ]}
      />
      <p>
        Typography 支持编辑、复制和受控展开，但省略仍使用 CSS 行数限制。
        暂不支持精确溢出测量、中间省略或自定义 symbol、tooltip；suffix
        在截断区域外渲染，与上游的行内测量存在差异。
      </p>
      <h2 id="migration" tabIndex={-1}>
        迁移检查
      </h2>
      <ol className="prose-list">
        <li>将组件与主题算法导入改为 antd-octane，并显式引入 style.css。</li>
        <li>状态与 ref 从 octane 导入，使用 useState 和 ref.current。</li>
        <li>
          只迁移支持范围内的 theme.token 与组件
          token；先验证暗色、紧凑和局部覆盖。
        </li>
        <li>检查依赖 SyntheticEvent、深层 DOM 选择器或 React 插件的代码。</li>
      </ol>
      <h2 id="pending" tabIndex={-1}>
        待验证能力
      </h2>
      <p>
        SSR、prefixCls、cssVar、hashed、StyleProvider、Tailwind / StyleX
        完整消费、模态静态方法和复杂表单能力尚未完成。Input.OTP、完整计数与
        variant，以及日期选择等复杂输入组件仍未提供。Form
        当前只支持平面字段和同步规则；Select
        已支持单选与多选，标签模式、labelInValue 和虚拟列表仍待实现。
      </p>
      <p>
        Spin 暂不支持自动进度，fullscreen 尚未接入共享 portal；Progress
        暂不支持圆形分段、percentPosition 与逐段颜色数组。Result
        的状态图示独立绘制，不提供上游完整插画。具体参数与 token
        以各组件页面为准。
      </p>
      <p>
        Pagination 的条数选择暂用原生 select，List 已支持内置分页；Rate
        提示暂用原生 title。 Tooltip / Popover
        增加触发包裹元素，自定义容器需设置定位样式，尚不处理任意 transform
        缩放或裁剪祖先。
      </p>
      <p>
        Button
        已完成一组固定上游样式对照；新增组件不据此自动获得相同的验证结论。
      </p>
    </>
  );
}
