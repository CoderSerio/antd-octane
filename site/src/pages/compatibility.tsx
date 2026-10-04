import { ComponentCompatibilityNotes } from "../component-compatibility";
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
            "预览、分组、旋转、翻转、双指缩放、自定义工具栏与 slick 参数；复杂动画中断、跨 iframe 拖拽及同步轮播组合仍需验证",
            "基础实现",
            "alpha",
          ],
          [
            "Calendar",
            "Dayjs、自定义 generateConfig、月/年视图、受控选择、locale 和单元格渲染；自定义日期库需提供完整 adapter",
            "基础实现",
            "alpha",
          ],
          [
            "Table",
            "列渲染、分页、排序、筛选、选择、展开、固定列、Summary、sticky 和平面行虚拟滚动；可变行高和树形虚拟化边界见下方组件实现差异",
            "基础实现",
            "alpha",
          ],
          [
            "Tree",
            "展开、选择、复选、异步加载、DirectoryTree、虚拟窗口、展开动画、拖放指示与 scrollTo；复杂运动和拖放组合需继续验证",
            "基础实现",
          ],
          [
            "Splitter / Watermark",
            "拖拽与键盘尺寸调整、Canvas 水印和覆盖层恢复；Splitter 暂不支持折叠",
            "基础实现",
          ],
          [
            "App / Icon / QRCode",
            "消息上下文、SVG 数据适配、真实二维码；非完整上游 API",
            "基础实现",
          ],
          [
            "Message / Notification",
            "静态与 hook API、contextHolder、计时器、更新和关闭；Notification 堆叠、悬停展开和进度条",
            "基础实现",
          ],
          [
            "Modal / Drawer",
            "受控浮层、焦点管理、滚动锁、Modal 静态及 Hook 实例；缩放、滑动、遮罩动画与结束回调",
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
            "平面字段、自定义值/事件映射、同步与异步规则、提交与重置；不含嵌套路径、动态列表",
            "基础实现",
          ],
          [
            "AutoComplete",
            "自由文本、建议选项、搜索、清除、键盘和浮层容器；不含分组与自定义输入子元素",
            "基础实现",
          ],
          [
            "Select",
            "单选与多选、搜索、受控值、键盘与清除；不含 tags、labelInValue、虚拟列表",
            "基础实现",
          ],
          ["Radio", "单选、选择组、按钮样式与键盘", "基础实现"],
          [
            "Tag / Alert / Card / Badge / Avatar",
            "展示交互、Tag 关闭配置、CheckableTag 图标、Avatar.Group 与响应式尺寸",
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
          ["DatePicker", "日期选择器", "未实现"],
        ].map(([component, scope, status]) => [
          component,
          scope,
          status,
          status === "未实现" ? "—" : siteVersion,
        ])}
      />
      <p>
        Typography 支持编辑、复制和受控展开，但省略仍使用 CSS 行数限制。
        暂不支持精确溢出测量、中间省略或自定义 symbol、tooltip；suffix
        在截断区域外渲染，与上游的行内测量存在差异。
      </p>
      <p>
        数据展示的参数与主题变量表参照 antd 5.29.3；表格包含上游参考 API，
        实际实现边界见下方组件实现差异。当前开发源码已接入 Table 自定义筛选、
        选择列、Summary、sticky 和平面行窗口化，以及 Tree 虚拟窗口和展开动效。
        Table 的源码筛选菜单进一步按 rc-menu/rc-dropdown
        修正菜单焦点、键盘选择、子菜单返回与再次打开，以及 Tab/Escape
        关闭；触发器使用原生 button，事件与上游 React SyntheticEvent 不同。
        Tooltip / Popover 提供 align、fresh、ref 和运动结束通知；复杂祖先裁剪、
        CSS 变换及第三方运动组合仍需额外验证。Tour 使用 SVG 遮罩保留高亮区域的
        点击通路。Empty、QRCode、Tour、Image、List 和 Calendar 接入
        ConfigProvider.locale，默认使用英文语言数据。新源码能力需随包发布后供
        npm 消费者使用；这些检查不代表完整 API、视觉或跨浏览器认证。
      </p>
      <h2 id="component-notes" tabIndex={-1}>
        组件实现差异
      </h2>
      <ComponentCompatibilityNotes />
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
          Modal.confirm / Modal.useModal：改为应用状态控制 open 的
          <a href="#modal">声明式 Modal</a>，由 onOk / onCancel 关闭；不只是替换
          import。
        </li>
        <li>
          message.success / notification.info 静态调用：改用
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
        SSR、全部组件的 prefixCls、cssVar、hashed、StyleProvider、Tailwind /
        StyleX 完整消费、复杂表单能力尚未完成。Input.OTP、完整计数与
        variant，以及日期选择等复杂输入组件仍未提供。Form
        当前支持平面字段和异步规则，嵌套字段与动态列表仍待实现；Select
        已支持单选与多选，标签模式、labelInValue 和虚拟列表仍待实现。
      </p>
      <p>
        反馈与其他模块的参数、可选值、默认值及 Token 表来自 antd 5.29.3
        源码。已补 Spin 自动进度、Progress 步骤及数值位置、Result 插画、Modal
        实例、Drawer push、Watermark 弹层继承。上游公开示例已移植到
        Octane；Drawer 表单和 Watermark 自定义配置依赖未提供的
        DatePicker/ColorPicker，暂缺这两例。ConfigProvider
        的复杂组合示例尚未完成对齐。源码已接入共用波纹、disabled 和 showEffect；
        浏览器夹具已对照 Happy Work 的原生效果；HappyProvider 公共导出及
        CSS-in-JS hashId 仍未覆盖。Message / Notification
        已接入原生进出场和离场期间更新；这些检查不代表所有交互与动效完全一致。
        源码中的新能力尚未发布到 npm。
      </p>
      <p>
        Skeleton 未发布源码已拆分 Element、Title、Paragraph 和五种子组件，
        补齐标题、段落配置、显式 undefined 覆盖及 loading 字段存在性判断。
        图片尺寸随 controlHeight 变化，头像方形、元素圆角与 blockRadius
        独立处理；Provider 的 skeleton 配置应用于主组件。
        这些定向案例已做默认、深色、紧凑、品牌、组件、嵌套主题与窄屏对照。
      </p>
      <p>
        Spin 未发布源码已按上游拆分指示器与进度环，使用显式参数和元素类型。
        百分比归零后保留进度环节点，嵌套图标、提示文字与遮罩分别定位；延迟取消、
        自动进度、Provider 配置和全屏样式已补定向对照。
        加载内容保留上游键盘焦点行为；这些案例不代表完整动效与跨浏览器认证。
      </p>
      <p>
        Progress 未发布源码已拆分条形、步骤、圆环及分段绘制，补齐显式参数、 div
        ref、原始尺寸传递、成功分段与渐变计算。71 个同参数实例组成的 22
        组案例已对照五组主题、嵌套主题、桌面、窄屏和 RTL； 进度更新、归零、微型
        Tooltip 与键盘焦点已做浏览器检查。 保留静态 ant-*
        样式别名；这些案例不代表完整动效、SSR 或跨浏览器认证。
      </p>
      <p>
        Result 未发布源码已按上游拆分 Icon/Extra 渲染，使用显式参数，保留空标题
        及其他内容的真值规则。固定插画尺寸、直接图标大小/颜色、操作区间距和
        错误详情链接已修正。8 个公开示例与 24 组边界案例已对照五组主题、
        嵌套主题、桌面、窄屏和 RTL；按钮点击、Enter 更新及跳过禁用按钮已检查。
        本地站点当前使用 workspace 源码，改动尚未发布到 npm。保留静态样式
        别名；这些案例不代表完整 API、SSR 或跨浏览器认证。
      </p>
      <p>
        Alert 未发布源码已按上游拆分 IconNode、CloseIconNode 与主题样式，
        使用显式参数和 nativeElement ref。自定义图标直接克隆，数字 padding、
        Provider 样式、RTL 与关闭配置已修正。10 个公开示例与定向边界案例已做
        多主题、桌面和窄屏对照；连续关闭、动态高度、禁用关闭、键盘与 afterClose
        时序已检查。ErrorBoundary 使用 Octane 原生堆栈，循环公告
        使用原生滚动实现；这些案例不代表完整 API、动效或跨浏览器认证。
      </p>
      <p>
        源码已补 ConfigProvider 的前缀样例：Button、Checkbox、Radio、Select
        和选择组可继承或覆盖前缀，空 Select 使用简洁 Empty 图像并继承语言。 静态
        ant-* 样式别名仍被保留；这不等同于完整 CSS-in-JS 隔离。
      </p>
      <p>
        ConfigProvider.useConfig 的完整上游样例已在浏览器夹具补齐。源码中的 Form
        基本标签布局、冒号、必填标记、help / extra 间距与 10 个组件 Token
        已补齐；响应式列网格与校验动效仍待实现。这些能力尚未发布到 npm。
      </p>
      <p>
        holderRender 的官方静态方法样例已在浏览器夹具补齐。源码已修正 Message /
        Notification 的静态 App 配置优先级与直接 hooks 的配置隔离。 Notification
        源码还修正了静态调用队列、关闭图标优先级、closable 对象、
        状态图标、内容缩进、操作区和焦点样式。Message 源码进一步修正 Holder
        就绪检查、对象参数覆盖顺序、关闭回调 / Promise 时序、
        样式快照、加载图标和长文本对齐；Hook / App 支持 transitionName。 静态
        Message / Notification 已接入主题上下文提示。Hook 通知和消息可继承
        getPopupContainer。Notification 独立公开接口限定数字 top / bottom
        与无参数 onClick；Message 保留字符串 top 和原生鼠标事件。 两者 Hook
        返回元组均为只读。ShadowRoot 只验证了挂载与语义属性， 样式注入尚未验证。
        通知容器留白拦截点击；Message 仅内容框接收点击。 并补齐 Modal
        确认框的内容、按钮区、图标样式和触发器焦点恢复。
        默认、深色、紧凑、品牌和组件主题已有定向检查；CSS-in-JS
        样式隔离和全部组合行为仍未覆盖。这些修正尚未发布到 npm。
      </p>
      <p>
        App 未发布源码已拆分实现、上下文和 Hook，补齐空上下文默认值、RTL、 App
        组件主题覆盖及嵌套配置。App 重置样式通过独立 Hook 按类名应用，
        自定义包裹组件忽略 style
        时仍能消费主题和方向；样式记录按实际主题共享与清理。 未发布源码已支持
        ConfigProvider.csp.nonce 继承和嵌套覆盖，App 动态重置样式在插入前设置
        nonce；启用 CSP
        的五组主题及窄屏夹具已检查。静态样式表加载仍由应用策略决定，
        hashed/cssVar、SSR 提取及全组件 CSP 组合未覆盖。 ConfigProvider.config
        已补 theme、 undefined 字段语义及旧颜色 CSS 变量；静态 Modal
        改为逐实例配置。 这些场景已有五组主题、桌面和窄屏对照。动态关闭 motion
        后，原生静态 Message 可重新取得 API，区别于 antd 5.29.3
        可能保留失效旧实例的行为； 该生命周期差异未算作对齐。
      </p>
      <p>
        未发布源码已补 ConfigProvider.warning.strict 和原生 Input.Group，
        对照上游 warning 样例检查逐条警告与废弃信息聚合。Tag、Card、Collapse、
        Descriptions、Image、Timeline、Statistic、浮层、Alert、Progress、Spin、
        Modal、Drawer、Result、Notification 和 Input.Group 已接入相关提示；
        ConfigProvider 自身的按钮空格、弹层宽度兼容参数和 SizeContext
        废弃提示也已接入。现代参数、嵌套配置及警告层级已有定向检查；Input.Group
        的普通、紧凑、尺寸、RTL 与输入框组合已有定向检查，
        Select、日期选择等全部子组件组合及 Form 状态隔离尚未覆盖。
      </p>
      <p>
        Drawer 未发布源码拆分主组件、面板、上下文和样式 Hook，补齐 panelRef、
        面板事件、ARIA/data 节点分配、Provider classNames 合并和关闭配置继承。
        根节点、内容与动画包裹节点按上游分离，无遮罩或内联抽屉不锁住 body， 嵌套
        Drawer 使用上游推动距离和层级偏移。 34 个定向案例已检查五组主题、窄屏与
        RTL，并复核关闭和恢复流程。 closable.disabled 保留禁用按钮功能；antd
        5.29.3 的 DrawerPanel 遗漏了按钮 disabled，这项差异未计为对齐。
        Modal/Drawer 共用上游 useZIndex 上下文；七种混合层级案例已检查五组主题、
        桌面、窄屏与默认主题 RTL，并对照关闭、重开、输入保留、焦点恢复和滚动锁。
        DatePicker 抽屉表单示例和自定义 motion
        尚未完成，其他弹层组合仍需逐项核查。
      </p>
      <p>
        普通 Modal 未发布源码进一步补齐 Provider 关闭与居中配置、面板 ref /
        height、 bodyProps / maskProps / wrapStyle、页脚按钮覆盖和加载骨架，
        并按上游拆分 Footer、按钮上下文、面板与样式 Hook。
        关闭回调顺序、焦点哨兵循环、输入保留、遮罩点击和响应式断点 Token
        已作同输入对照； 五组主题、窄屏与 RTL 有定向测量。确认框进一步拆出
        ConfirmDialog、HookModal 与 ActionButton， 补齐静态 / hook / App
        的返回值、函数式更新、销毁、异步按钮、失败重试和
        回调顺序；十六个站点样例均已接入对应官方源码的对照夹具。拖拽的事件、
        边界余量、选区、关闭重开已有桌面、窄屏及 RTL
        对照，真实触摸设备尚未检查。自定义 classNames 的默认层叠已通过原生未分层
        注册与上游选择器权重对齐；源码版 `antd-octane/style` 的 `StyleProvider`
        还支持显式 `layer` 模式，但该入口尚未发布到当前 alpha 包。Form / Space
        隔离、所有自定义动效、SSR 与跨浏览器行为仍需继续核查。
      </p>
      <p>
        Pagination 的条数选择暂用原生 select，List 已支持内置分页；Rate
        提示暂用原生 title。Tooltip / Popover
        增加触发包裹元素，自定义容器需满足定位上下文要求；多个裁剪祖先的交集和
        旋转、倾斜容器尚未完成。
      </p>
      <p>
        Button
        已完成一组固定上游样式对照；新增组件不据此自动获得相同的验证结论。
      </p>
    </>
  );
}
