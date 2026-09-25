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
        rows={[
          [
            "Button",
            "常用类型、尺寸、状态、图标、链接与 ref",
            "已实现",
            "alpha",
          ],
          ["Input", "基础文本、尺寸、状态、受控输入与 ref", "已实现", "alpha"],
          ["Radio", "单选、选择组、按钮样式与键盘", "已实现", "alpha"],
          [
            "Tag / Alert / Card / Badge / Avatar",
            "常用展示与交互；详见各组件页面",
            "已实现",
            "alpha",
          ],
          ["Switch", "状态、键盘、加载、大小与 ref", "已实现", "alpha"],
          [
            "Flex / Space / Divider",
            "基础布局、间距与分割线",
            "已实现",
            "alpha",
          ],
          [
            "Checkbox",
            "受控、非受控、禁用、中间态、ref 与 Group",
            "已实现",
            "alpha",
          ],
          ["Grid / Layout", "响应式栅格、布局与折叠侧栏", "已实现", "alpha"],
          [
            "Collapse / Tabs",
            "面板切换、内容保留与键盘交互",
            "已实现",
            "alpha",
          ],
          [
            "Empty / Statistic / Timeline / Descriptions",
            "空状态、统计与信息展示",
            "已实现",
            "alpha",
          ],
          [
            "Typography / List",
            "文字编辑、复制、列表及响应式网格",
            "已实现",
            "alpha",
          ],
          [
            "Spin / Skeleton",
            "延迟加载、局部加载与内容占位",
            "已实现",
            "alpha",
          ],
          [
            "Progress / Result",
            "进度状态、结果展示与后续操作",
            "已实现",
            "alpha",
          ],
          ["Segmented / Rate", "分段选择、评分与键盘交互", "已实现", "alpha"],
          [
            "Breadcrumb / Steps / Pagination",
            "面包屑、步骤、页码与条数切换",
            "已实现",
            "alpha",
          ],
          [
            "Tooltip / Popover",
            "原生 portal、触发、定位与上下文继承",
            "已实现",
            "alpha",
          ],
          ["ConfigProvider", "主题、尺寸、禁用与嵌套作用域", "已实现", "alpha"],
          ["Form / Table / Modal", "动态表单、表格及浮层", "未实现", "—"],
        ]}
      />
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
        完整消费、模态浮层和表单集成尚未完成。Input 的前后缀、清除、密码、搜索与
        TextArea，复杂输入组件仍未提供。
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
