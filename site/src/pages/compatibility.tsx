import { MigrationFormDemo } from "../demos/migration-form";
import { ApiTable, Code, Demo, usePageAnchor } from "../docs-ui";
import { siteVersion } from "../site-version";
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
      <p>
        本站示例使用 antd-octane@{siteVersion}
        。下列版本表示本站运行基线，不表示首次支持版本或上游全部能力已验证；历史变化见
        <a href="#changelog">更新日志</a>。
      </p>
      <ApiTable
        headers={["组件", "支持范围", "状态", "本站示例版本"]}
        label="组件兼容矩阵，可横向滚动"
        rows={[
          [
            "Affix / Anchor / FloatButton / Tour",
            "定位、滚动、引导和键盘；不含所有变换/裁剪场景",
            "基础实现",
          ],
          [
            "Image / Carousel",
            "预览、分组、缩放、轮播与暂停；不含完整高级工具栏或 slick 接口",
            "基础实现",
          ],
          [
            "Splitter / Watermark",
            "拖拽与键盘尺寸调整、Canvas 水印；不含折叠/防篡改保障",
            "基础实现",
          ],
          [
            "App / Icon / QRCode",
            "消息上下文、SVG 数据适配、真实二维码；非完整上游 API",
            "基础实现",
          ],
          [
            "Message / Notification",
            "hook/App/静态入口、计时器与动效；Notification 支持堆叠/进度，Message 不含堆叠",
            "基础实现",
          ],
          [
            "Modal / Drawer",
            "受控浮层、焦点与滚动锁；Modal 另支持静态确认、useModal、响应式宽度与动效",
            "基础实现",
          ],
          [
            "Menu / Dropdown / Popconfirm",
            "菜单、触发与确认交互；详见各组件边界",
            "基础实现",
          ],
          [
            "InputNumber / Slider",
            "数值输入、精度、范围、键盘和指针操作；支持子集",
            "基础实现",
          ],
          [
            "Button",
            "常用类型、尺寸、状态、图标位置、延迟加载、链接与 ref",
            "基础实现",
          ],
          [
            "Input",
            "基础输入、前后缀/清除、字数统计、Password/Search/TextArea 与 ref",
            "基础实现",
          ],
          [
            "Form",
            "NamePath 嵌套字段、局部校验/重置、直接依赖、自定义映射和异步规则；不含 Form.List / useWatch",
            "基础实现",
          ],
          [
            "AutoComplete",
            "自由文本、建议选项、搜索、清除、键盘和浮层容器；不含分组与自定义输入子元素",
            "基础实现",
          ],
          [
            "Select",
            "单选/多选、一层分组、loading 与过滤字段；不含 tags、labelInValue、嵌套分组、虚拟列表",
            "基础实现",
          ],
          ["Radio", "单选、选择组、按钮样式与键盘", "基础实现"],
          [
            "Tag / Alert / Card / Badge / Avatar",
            "常用展示与交互；详见各组件页面",
            "基础实现",
          ],
          ["Switch", "状态、键盘、加载、大小与 ref", "基础实现"],
          [
            "Flex / Space / Divider",
            "基础布局、间距、Compact / Addon 组合与分割线",
            "基础实现",
          ],
          ["Checkbox", "受控、非受控、禁用、中间态、ref 与 Group", "基础实现"],
          ["Grid / Layout", "响应式栅格、布局与折叠侧栏", "基础实现"],
          ["Collapse / Tabs", "面板切换、内容保留与键盘交互", "基础实现"],
          [
            "Empty / Statistic / Timeline / Descriptions",
            "空状态、统计与信息展示",
            "基础实现",
          ],
          ["Typography / List", "文字编辑、复制、列表及响应式网格", "基础实现"],
          ["Spin / Skeleton", "延迟加载、局部加载与内容占位", "基础实现"],
          ["Progress / Result", "进度状态、结果展示与后续操作", "基础实现"],
          ["Segmented / Rate", "分段选择、评分与键盘交互", "基础实现"],
          [
            "Breadcrumb / Steps / Pagination",
            "面包屑、步骤、页码与条数切换",
            "基础实现",
          ],
          [
            "Tooltip / Popover",
            "原生 portal、触发、定位与上下文继承",
            "基础实现",
          ],
          ["ConfigProvider", "主题、尺寸、禁用与嵌套作用域", "基础实现"],
          [
            "Calendar / Table / Tree / Util",
            "日历面板、表格与行选择、树选择/勾选和编译期类型提取；详见各组件边界",
            "基础实现",
          ],
          [
            "Cascader / ColorPicker / DatePicker / Mentions / TimePicker / Transfer / TreeSelect / Upload",
            "路径/树选择、纯色、日期/日期范围/单值时间、提及、穿梭与上传；高级限制见各组件页",
            "基础实现",
          ],
        ].map(([component, scope, status]) => [
          component,
          scope,
          status,
          siteVersion,
        ])}
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
      <h2 id="migration-example" tabIndex={-1}>
        迁移一个表单与保存提示
      </h2>
      <p>
        迁移前：以下组件用于已配置的 React + Ant Design 5
        应用。这里只收集姓名并显示提示，不请求后端。
      </p>
      <Code
        source={`import { Button, Form, Input, message } from "antd";

export function ProfileForm() {
  return (
    <Form layout="vertical" onFinish={(values) => message.success(\`已保存：\${values.name}\`)}>
      <Form.Item name="name" label="姓名" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Button htmlType="submit" type="primary">保存</Button>
    </Form>
  );
}`}
      />
      <p>
        迁移后：先按<a href="#start">开始使用</a>配置 Octane
        和样式，再将示例组件放入入口的渲染树。消息改用 hook 返回的实例，并把
        holder 放在当前组件树内；提交空值可验证错误反馈。
      </p>
      <Demo
        id="migration-form"
        title="Octane 表单与消息"
        description="填写姓名后保存；校验通过才显示消息。"
        source={() => import("../demos/migration-form.tsx?raw")}
      >
        <MigrationFormDemo />
      </Demo>
      <ul className="prose-list">
        <li>
          <a href="#modal">Modal.confirm / Modal.useModal</a>{" "}
          已提供；需要继承上下文时 使用 hook 并渲染 holder，或使用
          App.useApp().modal。声明式 Modal 仍由 onOk / onCancel 更新应用的
          open。
        </li>
        <li>
          message.success / notification.info 静态调用已提供；需要上下文时优先用
          <a href="#message">message.useMessage</a>、
          <a href="#notification">notification.useNotification</a> 的实例与
          holder，或在 App 内用<a href="#app">App.useApp()</a>。
        </li>
        <li>
          React SyntheticEvent / persist：查看
          <a href="#api-conventions/refs">原生事件约定</a>
          ；异步操作前先取出所需值。Checkbox 的 target.checked
          是包装后的值，不要把所有 onChange 都视作文本事件。
        </li>
      </ul>
      <h2 id="pending" tabIndex={-1}>
        待验证能力
      </h2>
      <p>
        SSR、主题 cssVar/hashed 和 StyleX 工具链消费尚未完成。 ConfigProvider
        提供 prefixCls/getPrefixCls，但各组件支持需单独核对。 antd-octane/style
        的 StyleProvider 只控制原生 App/Modal 样式的 layer， 不代表完整 cssinjs
        兼容。Input.OTP、自定义计数和 variant 仍未提供。
        日期与时间选择只提供文档列出的子集。Form
        当前支持嵌套字段、直接依赖和异步规则，动态列表仍待实现；Select
        已支持单选与多选，标签模式、labelInValue 和虚拟列表仍待实现。
      </p>
      <p>
        Spin 支持数值与模拟自动进度，fullscreen 尚未接入共享 portal；Progress
        支持圆形分段、线形 percentPosition 和线形分段颜色数组。Result
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
