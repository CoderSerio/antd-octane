/** Component implementation differences, kept outside upstream reference pages. */
export function ComponentCompatibilityNotes() {
  return (
    <>

      <details>
        <summary>Alert</summary>
        <p>
          支持类型、自定义图标、关闭配置、操作、Provider 样式与 nativeElement
          ref。关闭时按上游测量更新后的高度，在移除节点前触发 afterClose；
          禁用主题动画时不触发该动画回调。10 个公开示例与定向边界案例已对照 antd
          5.29.3 的默认、深色、紧凑、品牌、组件及嵌套主题，包含桌面、窄屏与
          RTL。ErrorBoundary 使用 Octane 原生错误边界，提供错误信息与原生堆栈；
          React 的组件堆栈不适用于 Octane。循环公告使用 Octane 原生滚动实现。
          本地站点当前使用 workspace 源码，改动尚未发布到 npm；这些案例不代表
          完整 API、动效、SSR 或跨浏览器认证。
        </p>
      </details>

      <details>
        <summary>Badge</summary>
        <p>
          支持 indicatorHeight / SM、dotSize、textFontSize /
          SM、textFontWeight、statusSize、indicatorZIndex。color 支持 antd
          预设颜色名和 CSS 颜色。整数 count
          使用逐位滚动；显隐动画保留最后一个可见数字和点形态。 支持
          ConfigProvider.badge 的 className、style、classNames、styles 与 RTL。
          自定义 count 节点保留原有样式，style 的 borderColor 可用于内描边。
        </p>
      </details>
      <details>
        <summary>Calendar</summary>
        <p>
          默认接受 Dayjs 日期；Calendar.generateCalendar(generateConfig)
          可生成使用 自定义日期类型的日历，adapter
          的读取、计算、比较、格式化和周数接口与 rc-picker 的 GenerateConfig
          一致。支持受控/非受控日期和面板、有效范围、
          禁用日期、单元格与头部渲染，以及 ConfigProvider 的 locale、direction、
          prefixCls 和 Calendar 样式配置。默认头部使用原生 Octane 的 Select 与
          Radio.Group。支持
          fullBg、fullPanelBg、itemActiveBg、miniContentHeight、
          monthControlWidth 和 yearControlWidth 组件 token，窄屏布局使用主题
          screenXS。 日期与月份单元格沿用 rc-picker
          的点击选择路径，没有单元格方向键导航。 自定义日期库需提供完整
          adapter，相关语言数据应由日期库加载；此 Alpha 版本不代表完整
          API、视觉或无障碍认证。
        </p>
      </details>
      <details>
        <summary>Card</summary>
        <p>
          支持头部背景/字号/高度/内边距、内容内边距、actionsBg、extraColor 组件
          token。保留 headStyle / bodyStyle。Card 的页签配置映射到 Octane Tabs
          支持的参数，tabBarExtraContent 保留左右位置。支持 ConfigProvider.card
          样式、语义化配置与 variant，组件 props 优先；未显式指定 variant 时继承
          Form.variant，再继承组件和全局配置。Card ref 指向外层 div。
        </p>
      </details>
      <details>
        <summary>Carousel</summary>
        <p>
          支持 antd 5 的 Carousel 参数、组件 Token
          和方法，原生实现多面板、分组滚动、 centerMode、variableWidth、rows /
          slidesPerRow、responsive（含 unslick）、
          克隆循环、渐显、纵向、RTL、触摸 / 鼠标拖拽、自动播放、懒加载及联动。
          customPaging、appendDots、自定义箭头接收 Octane 节点；通过
          ref.innerSlider 可访问 list、track、导航与播放控制。非当前面板
          inert，避免键盘进入屏外内容。 内部对象使用原生 DOM 与 Octane
          状态，不是 react-slick 的 React 实例。 CSS 与布局基于 antd 5
          源码，但任意自定义子组件的几何布局、SSR / hydration
          和跨浏览器拖拽尚需进一步验证。
        </p>
      </details>
      <details>
        <summary>Collapse</summary>
        <p>
          支持 headerBg、headerPadding、contentBg、contentPadding 和
          borderlessContent 系列
          token。默认首次打开才挂载，关闭后保留；destroyOnHidden 可销毁。支持
          Collapse.Panel、面板级 styles/classNames、ref、单项销毁和
          onItemClick。展开/收起使用高度与透明度过渡，theme.token.motion=false
          时即时切换。默认点击整个头部；collapsible="header"
          限定到标题和箭头，collapsible="icon" 限定到箭头。
        </p>
      </details>

      <details>
        <summary>Descriptions</summary>
        <p>
          支持
          labelBg、labelColor、contentColor、titleColor、titleMarginBottom、itemPaddingBottom、itemPaddingEnd。支持
          root/header/title/extra/label/content 语义化 styles/classNames。支持
          Descriptions.Item、响应式 span 以及各项的 label/content 样式。column
          的局部响应式配置合并默认断点，filled 和每行末项补齐剩余列。支持
          ConfigProvider.descriptions
          的样式及语义化配置，组件和子项样式依次覆盖。
        </p>
      </details>
      <details>
        <summary>Drawer</summary>
        <p>
          未发布源码按 antd 5.29.3 拆分 Drawer、DrawerPanel、上下文与样式 Hook，
          支持四个方向、预设尺寸、loading、push、关闭按钮位置、drawerRender、
          panelRef、面板事件和语义样式。Provider 与局部 classNames 同时保留，
          ARIA 应用于内容节点，data 属性应用于动画包裹节点。关闭动画结束后触发
          afterOpenChange；保留内容与 destroyOnHidden 的生命周期已有定向检查。
        </p>
        <p>
          默认、深色、紧凑、品牌和组件主题已与同一组上游夹具对照，包含窄屏、RTL、
          嵌套推动、焦点、Escape、遮罩点击及关闭后输入恢复。 closable.disabled
          保留禁用按钮行为；antd 5.29.3 的 DrawerPanel
          未将此参数应用到按钮，这项行为差异未计为对齐。 暂缺依赖 DatePicker
          的上游抽屉表单示例，自定义 motion、SSR
          和跨浏览器组合尚未完成逐项对照。 当前本地站点使用 workspace
          源码，相关改动尚未发布到 npm。
        </p>
        <p>
          Modal 与 Drawer 已共用上游 useZIndex
          上下文，七种定向混合层级案例已检查
          默认、深色、紧凑、品牌和组件主题的桌面、窄屏，以及默认主题 RTL。
          已对照关闭后父层保留、触发按钮焦点恢复、重开后的输入值和滚动锁。
          这些检查不代表所有弹层及所有子组件组合均已对齐。
        </p>
      </details>
      <details>
        <summary>Empty</summary>
        <p>
          支持全局颜色、字体与间距 token。PRESENTED_IMAGE_SIMPLE
          提供上游小图示，默认插画和小图示均采用 antd 5.29.3 的 SVG。 描述读取
          ConfigProvider.locale.Empty；未提供 locale 时默认英文，可通过
          description 覆盖或传 false、null 隐藏。支持 ConfigProvider.empty
          的图片与语义化样式配置。
        </p>
      </details>
      <details>
        <summary>Image</summary>
        <p>
          支持单图及 PreviewGroup
          的受控预览、current、items、fallback、图片属性、容器、
          destroyOnHidden、关闭图标，以及 imageRender、toolbarRender
          和操作回调。 组内缩略图打开时选择对应图片；从外部重开时，未受控的
          current 回到首张。
          缩放、旋转、翻转、拖拽、滚轮、双击和双指缩放使用原生事件；旋转后的边界回弹参考
          rc-image 的坐标算法。onTransform
          按动画帧合并通知，关闭后在预览动画结束时复位。
        </p>
        <p>
          ConfigProvider 的
          prefixCls、direction、image.className/style/fallback/preview.closeIcon
          和 getPopupContainer 会应用到单图；locale.Image.preview
          控制缩略图预览文案，默认使用英文。 五项上游组件 Token
          和预览间距、按钮尺寸、遮罩文案颜色、运动等全局 Token 已接入。
          预览层支持焦点管理、Escape 和方向键；mask: false/null
          只隐藏单图缩略图上的遮层。
        </p>
        <p>
          内置运动使用原生 CSS 动画；rc-motion 的完整中断状态机、iframe
          外部拖拽事件和所有第三方自定义动画组合仍未完全复刻。 PreviewGroup
          的公开类型按当前上游源码排除
          mask、maskClassName；旧文档中的这两项不表示分组对话框参数。
        </p>
      </details>
      <details>
        <summary>List</summary>
        <p>
          支持列表间距、背景、Meta 文字与间距 token，以及 ConfigProvider 的
          componentSize、direction、prefixCls、renderEmpty 和 List 样式配置。
          网格使用 Row/Col；与 Ant Design 5 一样，仅取当前最高活动断点的列数，
          未设置时回退到 grid.column。List.Item 的网格 ref 指向 Col，colStyle
          应用于 Col；非网格 ref 指向 li。actions 与 extra 的 classNames/styles
          合并组件配置和当前 Item 配置。loading 接受布尔值或 SpinProps。
          数据多于 pageSize 时在本地切片；服务端分页可传当前页数据和 total。
          分页、头部、底部及 loadMore 的顺序沿用 Ant Design 5。
          已验证的路径不代表完整 API、视觉或无障碍认证。
        </p>
      </details>
      <details>
        <summary>Message</summary>
        <p>
          支持静态方法、全局配置、Hook
          上下文、键值更新、销毁及最大数量。原生独立根承载静态调用，应用上下文请通过
          Hook 或 App 接入。进出场使用主题动效参数；关闭后保留节点至离场完成，
          离场期间使用同一 key 可更新并重新显示消息。未发布源码已按 antd 5.29.3
          修正 Holder 挂载检查、对象参数优先级、静态调用队列、关闭回调与 Promise
          时序、ConfigProvider 样式快照，以及 Hook / App 的 transitionName。
          只有内容框接收指针点击，两侧空白可穿透。top 保留数字或字符串；onClick
          使用 Octane 原生事件， currentTarget 的类型为 HTMLDivElement，Hook
          返回元组为只读。 未挂载时的调用、尚未展示就关闭的消息、清空与数量淘汰
          不会执行关闭回调或兑现
          Promise。加载图标、长文本及默认、深色、紧凑、嵌套主题和
          窄屏已有定向对比；全部组合行为与 CSS-in-JS 样式隔离仍未覆盖。
        </p>
      </details>
      <details>
        <summary>Modal</summary>
        <p>
          支持响应式宽度、footer 渲染函数、loading、语义样式、静态方法和
          useModal 实例。原生事件替代 React
          合成事件；缩放动画沿用上游曲线与点击起点， transitionName 可接入自定义
          CSS，afterClose 在退出动画结束后触发。
        </p>
        <p>
          未发布源码已按上游拆出 ConfirmDialog、HookModal 和 ActionButton，补齐
          静态方法与 hook / App 实例的返回值、更新、销毁和异步按钮行为。
          静态实例不可 await；hook 实例支持
          await，函数式更新合并配置；静态方法的 函数式更新替换配置。destroy()
          本身不会结算 hook 的确认 Promise。
          已配对检查确认内容、图标、按钮覆盖、失败重试、焦点边界和回调顺序，
          并定向检查五组主题、窄屏和 RTL；这些检查不代表所有组合完全一致。
        </p>
        <p>
          未发布源码的普通 Modal 已拆出面板、Footer、按钮上下文与样式 Hook，
          补齐 Provider 的 closable / centered、panelRef、height、bodyProps /
          maskProps / wrapStyle， 以及按钮属性覆盖、空值、加载骨架、响应式宽度和
          wireframe。 内部焦点哨兵、遮罩点击与 afterClose / afterOpenChange
          顺序已有同输入浏览器对照； 默认、深色、紧凑、品牌色、组件
          Token、窄屏和 RTL 已作定向检查。
          十六个站点样例均已接入对应官方源码的对照夹具。拖拽示例按
          react-draggable 的事件、边界余量和选区处理适配，五组主题的桌面、窄屏及
          默认主题 RTL
          已检查移动、边界和关闭重开；默认主题另检查了正文禁拖和关闭焦点恢复，
          真实触摸设备尚未检查。 Form / Space 上下文隔离、全部自定义动效、SSR
          与跨浏览器行为仍需继续核查。
        </p>
        <p>
          自定义 classNames 的默认层叠也已按上游默认模式对齐：源码版 Modal
          默认注册 为未分层样式，保留上游选择器权重，因此 body padding、content
          边框和 header 边框在相同输入下结果一致。源码版可从 `antd-octane/style`
          引入原生 `StyleProvider`，用 `layer` 选择可选的 antd
          层；这项入口尚未随当前 alpha 包发布，不能作为已发布包 API
          使用。默认、深色、紧凑、品牌色、组件 Token、 桌面、窄屏和默认 RTL
          已作两种层级模式的对照。
        </p>
      </details>
      <details>
        <summary>Notification</summary>
        <p>
          支持静态方法、全局配置、Hook
          上下文、六种位置、进度、暂停与堆叠。堆叠按通知的实际尺寸计算位置，
          悬停时展开并暂停整组通知。进出场与堆叠位移使用主题动效参数，
          关闭后保留节点至离场完成；离场期间可使用同一 key 更新通知。
        </p>
        <p>
          未发布源码已按 antd 5.29.3 补齐 btn 废弃提示、关闭图标优先级、
          closable 对象、容器继承与静态调用队列，并修正状态图标、文字缩进、
          按钮区间距、焦点样式和容器留白处的点击拦截。公开接口已独立拆分： top /
          bottom 接受数字， onClick 声明为无参数回调，type 和 Hook
          返回元组为只读。调用 Hook API 前必须挂载 contextHolder； 进度使用原生
          progress 元素；默认悬停暂停计时与进度，pauseOnHover=false
          时持续计时，键盘焦点不暂停。ShadowRoot 只验证了挂载和语义属性，
          样式注入尚未验证；这些检查不代表 Notification 全部行为完全一致。
        </p>
      </details>
      <details>
        <summary>Popconfirm</summary>
        <p>
          支持受控显隐、十二方位、箭头、语义样式、onPopupClick、本地化与 Promise
          确认。定位和缩放动画共用 Tooltip/Popover
          的原生实现，复杂定位与运动中断场景仍需继续验证。
        </p>
      </details>
      <details>
        <summary>Popover</summary>
        <p>
          继承全局颜色、字体、圆角和阴影，支持
          Popover.zIndexPopup、titleMinWidth、innerPadding。它是非模态浮层，不锁定焦点；复杂表单流程应使用后续的
          Modal。
        </p>
        <p>
          使用 Octane 原生 portal 保留主题与业务上下文。触发内容外增加
          inline-flex
          span，保留子元素事件；请提供一个可聚焦的触发元素，键盘提示需包含 focus
          触发。支持 getPopupContainer 和 ConfigProvider
          默认容器；自定义容器按实际 offset parent
          换算坐标。自动避让目前检查视口边缘，
          不计算任意裁剪祖先的可视区域；旋转或倾斜变换容器不保证对齐。
        </p>
        <p>
          支持 12 种 placement、align 的 points、数字或字符串
          offset/targetOffset、 adjust 溢出配置和内置箭头安全区位移，以及
          useCssRight、useCssBottom 和 useCssTransform。支持 builtinPlacements
          自定义位置表、onPopupAlign、forceRender、 arrow.pointAtCenter、fresh
          和旧 overlayInnerStyle；styles.body 优先于
          overlayInnerStyle。自定义位置表替换内置表，onPopupAlign
          在重新测量位置后调用； forceRender
          会在首次打开前挂载浮层。默认关闭时缓存内容，fresh=true 时继续更新。
        </p>
        <p>
          afterOpenChange 在入场或退场动效完成后触发，初始 open
          也会触发入场回调。 TooltipRef 提供
          forceAlign、forcePopupAlign（旧别名）、nativeElement 和
          popupElement。Popover 的 onOpenChange 在 Escape
          关闭时附带键盘事件，其他 触发只传 open。旧 destroyTooltipOnHide 的
          keepParent
          对象设置仍按上游兼容实现转成布尔值；要控制关闭后是否销毁请使用
          destroyOnHidden。
        </p>
      </details>

      <details>
        <summary>QRCode</summary>
        <p>
          使用 Project Nayuki 的 MIT 编码算法。支持 QRCode 全局 alias token
          覆盖；Canvas 按设备像素比绘制。value 为空时不渲染，超长文本显示提示。
          API 表沿用 antd 5 文档中的 color 默认值 #000；antd 5.29.3
          源码实际默认取 colorText，本组件采用相同实现，随主题变化。
        </p>
        <p>
          支持中心图标、statusRender、imageSettings、自定义静区尺寸与字符串数组分段。
          Canvas 仅在图标加载成功后挖孔，加载失败保留完整矩阵。状态文本读取
          ConfigProvider.locale.QRCode，
          默认使用上游英文文案；无边框时保留透明边框并移除内边距和圆角。
        </p>
        <p>
          minVersion、marginSize/includeMargin、imageSettings、fgColor/level
          别名是原生扩展；antd 5 的 QRCode
          包装层并未将它们全部传给内部渲染器。图标尺寸按 size
          换算为模块坐标，Canvas 位图为 size ×
          设备像素比，显示区域由布局控制。role/aria-* 放在 Canvas 或 SVG；data-*
          和 title 留在外层 div，不生成默认二维码标签。
        </p>
      </details>

      <details>
        <summary>Segmented</summary>
        <p>
          支持
          trackPadding、trackBg、itemColor、itemHoverColor、itemHoverBg、itemSelectedBg、itemActiveBg、itemSelectedColor。支持原生表单字段、受控值、RTL、上下布局以及原生滑块平移动画。
          默认尺寸为 middle，禁用状态由 disabled 属性控制，与 antd 5
          的包装实现一致。 方向键按 rc-segmented 2.7.1 在整个 options
          列表中循环，不增加 Home / End 行为。 ConfigProvider.segmented
          可提供样式与类名；自定义 prefixCls 同时保留 ant-* 样式类。
        </p>
      </details>

      <details>
        <summary>Statistic</summary>
        <p>
          支持 titleFontSize、contentFontSize 和 alias
          token。字符串格式化不经过浮点数转换；precision
          按上游行为截取和补零，不进行四舍五入。支持 Countdown 和 Timer
          的时间格式及回调；Timer
          首次输出占位符，挂载后开始更新，倒计时结束时停止刷新。loading 使用
          Skeleton。ConfigProvider.statistic 提供样式默认值，ref.nativeElement
          指向外层 div。
        </p>
      </details>
      <details>
        <summary>Table</summary>
        <p>
          表格颜色、字体、圆角、单元格间距和交互色使用 Table 组件 token 与全局
          token。支持数据源和列渲染、响应式列、分组表头、左右固定列、受控与非受控分页、排序、内置与自定义筛选、筛选搜索、跨页选择、父子级联选择、行选择禁用、详情展开、树形数据展开、单元格省略及汇总行。使用服务端筛选或排序时，需在
          onChange 中更新 dataSource；服务端分页将当前页数据和总数传入
          pagination.total。
        </p>
        <p>
          未指定 tableLayout 时，固定表头、sticky 或省略列使用
          fixed；开启横向滚动的固定列也使用 fixed，但 scroll.x="max-content"
          时使用 auto。显式设置的 tableLayout 优先于这些默认规则，与 antd 5
          相同。
        </p>
        <p>
          固定列宽度优先取列的
          width，未指定时从表头单元格实测；首次布局可能发生一次偏移校正，建议为固定列指定
          width。sticky 可在页面滚动时固定表头，也可配合 scroll.y
          固定内部滚动容器中的表头；virtual 配合 scroll.y
          会对普通平面行做窗口渲染，表头和固定 Summary 位于 scroll.y
          指定的表体视口之外。未挂载行按字号、内边距和边框估算高度，已挂载行缓存实测高度并校正滚动位置。树形数据或详情展开表格会回退到普通渲染。sticky.offsetHeader
          和 offsetSummary 控制表头与汇总行偏移；横向粘性滚动条会按 getContainer
          判断当前是否可见，并使用 offsetScroll 定位。表头遵循浏览器 CSS sticky
          祖先规则，自定义 getContainer
          不是表格的滚动祖先时不会改变表头的滚动边界。
        </p>
        <p>
          默认 filterMode="menu" 使用嵌套子菜单浮层：多选项显示
          Checkbox，单选项显示
          Radio；搜索只过滤叶子项，匹配不到的父级子菜单仍保留。menu
          支持上下方向键、Home/End，以及按 LTR/RTL
          方向打开或返回子菜单。filterMode="tree" 则使用
          Tree：多选时父子勾选级联并保留半选父节点，单选时只选中单个节点；搜索会高亮匹配节点但保留整棵树，全选覆盖所有筛选项。Tree
          支持方向键导航与 Space 勾选。开发源码的菜单以根 ul 作为 Tab
          入口，子菜单和菜单项不参与顺序 Tab，内嵌输入保留原生焦点能力；Enter
          选择菜单项，Space 只在输入上触发选择。筛选浮层参照 rc-dropdown 处理
          Tab 与 Escape，关闭时恢复触发器焦点，并按 filterOnClose
          决定是否提交；filterDropdownProps.autoFocus 控制打开后的浮层聚焦尝试。
          这些源码修正需随包发布后供 npm
          消费者使用。内置筛选值在回调中按原始筛选项顺序恢复为 filters 中的
          number、boolean 或 string。
        </p>
        <p>
          components 可替换
          table、表头与表体包装器/行/单元格；Table.Summary.Row/Cell、onScroll、getPopupContainer、showSorterTooltip、expandable.columnTitle、筛选
          popup 配置、自定义图标与重置行为、选择列的
          renderCell/onCell/align/getTitleCheckboxProps/selections
          均已接入。rowSelection.onSelectMultiple
          会在当前页数据（包括嵌套子行）的 Shift
          范围选择后触发；范围以最近一次选中的行为锚点。
        </p>
        <p>
          virtual
          当前只对平面数据且未展开详情的行做窗口化，包含实测行高缓存；树形行、展开详情暂不虚拟化，跨行单元格与复杂可变高布局仍需进一步对照。sticky
          可在页面或 scroll.y 内部容器固定表头；自定义 getContainer
          只控制粘性横向滚动条的可见范围，表头仍使用浏览器的最近滚动祖先。Table.Summary.Cell
          的 index 会输出为 data
          属性，并按数据列计算固定列偏移；选择列和展开列位于汇总列前方时，index
          仍从第一列数据列开始。ref.scrollTo 支持当前页的 key/index 定位与
          top/bottom/auto 对齐；虚拟模式可按当前页 key 或 index 定位，未指定
          align 时采用最近可见位置。尚未测量的远处行使用高度估值，挂载后会校正。
        </p>
      </details>
      <details>
        <summary>Tag</summary>
        <p>
          支持 defaultBg、defaultColor 组件 token 和 alias token。预设色支持常用
          13 色及 inverse 变体，状态色支持 success / processing / warning /
          error / default。 CheckableTag 支持 icon、onChange 和
          onClick。关闭配置支持 ARIA 属性。与 5.29.3 源码一致，closable.disabled
          未参与关闭判断。点击型 Tag 与链接标签支持 wave；关闭后使用 hidden
          类保留子节点状态， 与 antd 5 的关闭行为一致。closable、closeIcon
          先使用组件属性，再继承 ConfigProvider.tag 配置；closeIcon=false
          可禁用关闭图标。 支持 RTL。自定义 prefixCls 同时保留本库静态 CSS
          所需的 ant-* 类名。
        </p>
      </details>
      <details>
        <summary>Timeline</summary>
        <p>
          支持 tailColor、tailWidth、dotBorderWidth、dotBg、itemPaddingBottom
          和主题色。支持根节点类名、Timeline.Item 以及 items 单项类名和样式。
          pending、pendingDot、reverse 与标签布局按 antd 5 的条目拆分实现；固定
          left / right 模式覆盖条目的 position，alternate 模式允许条目指定位置。
          支持 ConfigProvider.timeline 的 style / className、RTL。 antd 5 的
          Timeline 未提供语义化 styles/classNames。
        </p>
      </details>
      <details>
        <summary>Tooltip</summary>
        <p>
          继承全局字体、颜色、圆角和阴影，支持 Tooltip.zIndexPopup。color 支持
          antd 预设色名和 CSS 颜色。
        </p>
        <p>
          使用 Octane 原生 portal 保留主题与业务上下文。触发内容外增加
          inline-flex
          span，保留子元素事件；请提供一个可聚焦的触发元素，键盘提示需包含 focus
          触发。支持 `getPopupContainer` 和 ConfigProvider
          默认容器；自定义容器按实际 offset parent
          换算坐标。自动避让目前检查视口边缘，
          不计算任意裁剪祖先的可视区域；旋转或倾斜变换容器不保证对齐。
        </p>
        <p>
          支持 12 种 placement、align 的 points、数字或字符串
          offset/targetOffset、 adjust 溢出配置和内置箭头安全区位移，以及
          useCssRight、useCssBottom 和 useCssTransform。支持 builtinPlacements
          自定义位置表、onPopupAlign、forceRender、 arrow.pointAtCenter、fresh
          和旧 overlayInnerStyle；styles.body 优先于
          overlayInnerStyle。自定义位置表替换内置表，onPopupAlign
          在重新测量位置后调用； forceRender
          会在首次打开前挂载浮层。默认关闭时缓存内容，fresh=true 时继续更新。
        </p>
        <p>
          afterOpenChange 在入场或退场动效完成后触发，初始 open
          也会触发入场回调。 TooltipRef 提供
          forceAlign、forcePopupAlign（旧别名）、nativeElement 和
          popupElement。旧 destroyTooltipOnHide 的 keepParent
          对象设置仍按上游兼容实现转成布尔值；要控制关闭后是否销毁请使用
          destroyOnHidden。
        </p>
      </details>
      <details>
        <summary>Tour</summary>
        <p>
          支持 Tour 的
          zIndexPopup、closeBtnSize、primaryPrevBtnBg、primaryNextBtnHoverBg，以及全局主色、背景、字体、间距、圆角和阴影。target
          可为元素或返回元素的函数，目标缺失且未显式指定 placement 时居中；
          步骤级 placement 优先于 Tour 的配置。滚动和尺寸变化会重新定位。原生
          portal 保留 ConfigProvider 上下文。
        </p>
        <p>
          遮罩默认允许点击高亮目标，disabledInteraction 可禁用目标交互。
          mask=false 隐藏遮罩，不限制焦点；与 antd 5 的 rc-tour 实现一致， Tour
          打开期间仍锁定页面滚动。支持箭头、center placement、
          getPopupContainer、遮罩颜色与样式，以及步骤级 closeIcon、closable 和
          scrollIntoViewOptions。按钮和关闭标签读取 ConfigProvider.locale，
          未配置时使用英文。
        </p>
        <p>
          与当前 rc-tour 源码一致，目标离屏时 scrollIntoViewOptions=false
          会传入原生 scrollIntoView(false)，其含义是底边对齐，而非跳过滚动。
          可传入 ScrollIntoViewOptions 对象指定滚动方式。
        </p>
        <p>
          非受控模式重新打开时重置到第 0 步；受控 current 由调用方更新。
          nextButtonProps、prevButtonProps 的 onClick
          在步骤切换后调用，不接收事件参数。 步骤级
          onClose、onFinish、onNext、onPrev 会覆盖默认步骤回调，
          因此自定义回调需要自行控制相应状态。 antd 5 的 Tour 不提供
          styles/classNames 语义配置；可使用 rootClassName 与步骤
          className/style。高亮区域变化使用主题中的过渡时长。当前尚未完整复刻
          rc-trigger 在复杂变换容器中的定位与对齐事件元数据。
        </p>
      </details>
      <details>
        <summary>Tree</summary>
        <p>
          方向键移动焦点；左方向键收起或返回父级，右方向键展开或进入子级；Home /
          End 定位首尾节点，Enter / Space
          选择或复选。非严格复选按父子关系传导；disabled、 disableCheckbox 与
          checkable=false 节点会截断传导。checkedKeys 对象在 checkStrictly
          模式下保留 halfChecked；普通模式会按数据树重新计算半选状态。
        </p>
        <p>
          支持 treeData、fieldNames、TreeNode 声明、loadData 和 loadedKeys。
          已展开的未加载节点会自动请求数据；默认展开选项只在初始化时生效。
          filterTreeNode 接收包含原始数据、expanded、selected、checked、loaded、
          loading、halfChecked、active
          与拖放状态的节点；匹配只高亮，不隐藏节点。 DirectoryTree 提供 Ctrl /
          Command 多选、可见节点的 Shift 范围选择和 expandAction。disabled
          禁止选择、复选和开始拖拽，仍可操作展开按钮。
        </p>
        <p>
          height 开启虚拟窗口，只渲染视口附近的可见节点；virtual=false
          可关闭窗口渲染。ref.scrollTo 支持 key、index、align 和
          offset，能定位尚未
          渲染的可见节点；折叠分支内的节点需先展开。自定义标题的实际行高会参与滚动
          定位。虚拟滚动不自动计算未渲染标题的横向宽度。
        </p>
        <p>
          展开和收起使用原生高度、透明度动画；motion=null 或
          theme.token.motion=false 可关闭动画。motion
          支持名称或类名映射、准备阶段、起始/活动/结束回调和
          motionDeadline。主题与 ConfigProvider 的
          direction、virtual、tree.className、 tree.style 会参与渲染；RTL
          镜像缩进、展开图标和拖放指示器，键盘仍保持左键 收起、右键展开。
        </p>
        <p>
          拖放按扁平可见节点和鼠标横向偏移计算跨层级位置，支持 allowDrop、
          dropIndicatorRender、dropPosition 与 dropToGap。悬停 800ms
          可展开已有子节点
          的分支，拖动节点自身及其后代不可作为放置目标。回调提供数据和位置，数据重排
          由应用完成。键值须唯一且稳定。
        </p>
        <p>
          本页支持范围描述当前开发源码；新能力需随包发布后供 npm 消费者使用。
          展开动画和窗口滚动由 Octane 实现，内部节点 DOM、焦点容器与 rc-tree
          实例 接口不同；没有提供 rc-tree 的内部实例方法。
        </p>
      </details>

    </>
  );
}
