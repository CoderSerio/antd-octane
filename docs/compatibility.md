# 第一版支持范围

状态：开发原型，未发布 npm。固定基线为 Octane 0.4.3、Ant Design 5.29.3。

## 主题

- 复用 Ant Design 的纯 seed/map/alias 算法，来源和改动记录在包内第三方声明与 `.sync-upstream.json`。
- `theme.getDesignToken` 返回全局派生 token；默认、暗色、紧凑、组合算法及自定义配置与原版 antd 对照。
- `ConfigProvider` 支持 `theme.token`、`theme.algorithm`、`theme.components` 中已实现组件的配置（具体字段见各组件页面和 `theme/types.ts`）、`inherit`、`componentSize` 和 `componentDisabled`。
- `theme.useToken()` 当前仅提供 `{ token }`，不提供 React/cssinjs 的 Theme 实例或 hashId。
- Button 组件配置默认直接覆盖 token；`algorithm: true` 跟随全局算法，也可指定组件算法。父子各组件配置分别合并。
- 不支持 `cssVar`、`hashed`、`prefixCls`、StyleProvider、SSR 样式契约和 React 主题插件。主题配置兼容不等于依赖内部 DOM 的 CSS 覆盖兼容。

## Button

支持 `type`（default / primary / dashed / text / link）、`size`、`shape`、`danger`、`ghost`、`block`、布尔 `loading`、`disabled`、`icon`、`children`、`htmlType`、`href`、`target`、`rel`、原生点击、`className`、`style` 与 ref 的 `focus/blur/nativeElement`。

支持的组件 token 以 [`ButtonToken`](../packages/antd-octane/src/theme/types.ts) 为准，包括文字、背景、边框的默认/悬停/按下状态、主要/危险文字色、阴影、字号、字重、图标间距和横向内边距。全局/组件 AliasToken 中与 Button 样式有关的字段会参与计算。

暂不支持 wave 点击动效、自动中文空格、loading 对象/延迟、Button.Group、color / variant、iconPosition、语义 classNames / styles、contentLineHeight、onlyIconSize、groupBorderColor 和自定义 paddingBlock 等未列出的组件 token。链接模式仅透传文档列出的链接属性与基础无障碍属性，不等价于所有原生 anchor 属性。

## Input

支持基础单行输入、`value/defaultValue`、`size`、`status`、`disabled/readOnly`、原生属性、逐次输入 `onChange`、非组合 Enter 的 `onPressEnter`、原生键盘/组合事件、`className/style` 与 ref（`input/nativeElement/focus/blur/select`）。受控值被调用方拒绝时恢复原值，非受控输入支持原生表单重置。

组件 token 以 `InputToken` 为准：paddingBlock/Inline 与 SM/LG 变体、inputFontSize 与 SM/LG 变体、activeBorderColor、hoverBorderColor、activeShadow、errorActiveShadow、warningActiveShadow、hoverBg、activeBg。支持全局和组件算法以及嵌套覆盖。

支持 prefix/suffix、allowClear、addonBefore/After、Input.Password 可见切换、Input.Search 与 Input.TextArea 基础 autoSize。暂不支持 variant、showCount/count、Input.OTP、Form 集成、带 cursor 选项的 focus、Password hover action。TextArea autoSize 基于 scrollHeight，暂不提供隐藏容器预测量与 onResize；Search.enterButton 自定义节点仅作为按钮内容，不应嵌套按钮。onChange 提供原生事件而非 SyntheticEvent；输入法 Enter 被抑制，组合中的 input 事件仍传给调用方。

## Checkbox

支持 `checked/defaultChecked`、`indeterminate`、`disabled`、原生属性、标签 children、`className/style` 与 ref（`input/nativeElement/focus/blur`）。onChange 具有 `target.checked/value`、`nativeEvent`、`preventDefault` 和 `stopPropagation`，不是完整 SyntheticEvent。中间态使用原生 indeterminate 属性与视觉样式。

支持通过 components.Checkbox 覆盖相关全局 token、指定算法及继承主题。支持 Checkbox.Group 的 options / 子项、受控值、禁用、name 和 skipGroup。暂不提供 Form.Item 集成、wave 动效或任意 DOM 结构兼容。

## 样式与包

组件原生运行时不依赖 React；React 和 antd 仅用于开发对照测试。发布前保持包为 private。

组件使用静态 CSS，派生值通过 `--ao-btn-*`、`--ao-input-*`、`--ao-check-*` 局部变量传递。ConfigProvider 不创建额外 DOM，不在全局插入动态 style 标签。构建产物需要显式导入 `antd-octane/style.css`；仅支持 ESM 浏览器消费。SSR 不在本次支持范围。

组件 CSS 位于 `@layer antd`。用户可以通过普通 `className` 和 `style` 扩展，不依赖 Tailwind CSS 或 StyleX；已验证 Tailwind CSS / @tailwindcss/vite 4.3.3 + Octane 0.4.3 + Vite 8.3.1 的独立打包消费，以及 Button 的 Preflight、工具类覆盖、布局、默认/品牌/暗色/紧凑主题与应用侧 token 映射；不代表全量组件兼容。StyleX、Tailwind v3 和 SSR 组合尚未验证。请勿把 StyleX 原始样式对象当作 DOM style 对象传入。

## 验证方式

1. `pnpm test`：全量全局 token 对照与原生交互测试。
2. `pnpm type-check`：组件、文档和测试类型。
3. `pnpm build`：组件 ESM/CSS/声明与静态文档站。
4. `pnpm pack:check`：独立临时项目安装 tarball，检查类型与生产构建，避免源码 alias 掩盖打包问题。
5. 浏览器验收：默认/暗色/紧凑、品牌色、圆角、嵌套作用域、加载操作、源码展开和移动布局。

2026-09-25 浏览器对照：默认、品牌色、暗色、紧凑、组件覆盖共五组主题，16 种按钮场景的基础、hover、active 样式共 1,440 项比较通过。此检查只覆盖夹具列出的 CSS 属性，不表示像素级或全量组件兼容。可通过 `pnpm dev:compare` 和 [浏览器夹具](../tests/browser/README.md) 复核。

新增 Input / Checkbox 浏览器夹具覆盖五组主题、各六种基础场景及 hover/focus 状态，包含 Checkbox 标记伪元素，共 1,760 项属性比较通过。夹具外的 API、动效、像素级完整对照及其他浏览器仍待验证。

## 布局与 Switch

Flex 支持 vertical、wrap、justify、align、flex、gap；Space 支持 direction、size 数值/预设/双轴、align、wrap、split。暂不支持 Flex.component、Space.Compact 和语义化 styles/classNames。两者预设间距随全局 padding token 调整。

Divider 支持水平/垂直、文字、orientation、orientationMargin、plain、dashed；组件变量 textPaddingInline、orientationMargin、verticalMarginInline。暂不支持 size、variant 与新版标题位置 API。

Switch 支持受控/非受控、value 别名、文字、大小、加载、禁用、原生 button ref，以及键盘操作。事件为原生事件。支持轨道/滑块尺寸、背景、阴影 token，暂不支持 innerMargin 系列 token、wave 和完整按压动效。

完整扩展顺序见 [组件路线图](component-roadmap.md)，其中待办不代表已支持。

## 选择与信息展示

- Radio：普通 / 按钮、Group options / 子项、受控 / 非受控、值类型保留、原生 name 与方向键、禁用、大小、block 和 ref。支持组件尺寸、圆点、按钮背景/颜色/间距 token；暂不支持 Form、wireframe、完整动效和语义化 styles/classNames。
- Checkbox.Group：值支持 string / number / boolean，受控 / 非受控、options / 子项、disabled、name、skipGroup。回调按当前挂载选项的 DOM 顺序返回值，移除选项不继续返回。
- Tag：预设色、状态色、自定义 CSS 颜色、边框、图标、可取消关闭和受控 CheckableTag；defaultBg/defaultColor 及 alias token。暂不支持 inverse、closable 对象、visible、关闭动画。
- Alert：四种状态、描述、图标、banner、action、关闭和 afterClose、nativeElement ref；支持三个组件 token。默认 SVG 为本库绘制。暂不支持 ErrorBoundary、closable 对象、关闭动画。
- Card：标题、extra、cover、actions、加载占位、大小、边框、hoverable、Meta、headStyle/bodyStyle 和 header/body/cover/actions 的 styles/classNames；支持头部/内容间距等组件 token。暂不支持 Grid、tabList 和完整 inner 变体。
- Badge：数量、溢出、零值、dot、status/text、CSS color、大小、offset；style 作用于指示器，支持计数与状态尺寸等组件 token。暂不支持 Ribbon、数字滚动动画和预设颜色名映射。
- Avatar：图片、字符、图标、形状、预设/数字尺寸、gap、文字缩放、onError 回退与 nativeElement ref；支持尺寸及字体组件 token。暂不支持 Group、响应式 size 对象和元素形式 src。

各组件文档页列出具体参数和主题变量。新增浏览器夹具比较普通、品牌、暗色、紧凑和组件级主题下的 1,235 项稳定样式值；它不覆盖完整属性、状态、动效或所有浏览器。

## 响应式布局与内容组件

- Grid：Row / Col 的 24 栅格、双轴和响应式 gutter、断点列宽/偏移/顺序、flex、Grid.useBreakpoint；共享并释放断点监听。暂不支持字符串 gutter、SSR 断点预计算和 Grid 组件 token。
- Layout：Header / Content / Footer / Sider、自动识别侧栏、受控/非受控折叠、响应式断点、零宽触发器、主题 token。触发器固定在侧栏内部底部，区别于上游的视口固定定位；未承诺完整 DOM/ref 兼容。
- Collapse：items、受控/非受控、手风琴、禁用、图标触发、extra、ghost、大小、延迟挂载/保留/销毁内容，以及头部和内容 token。暂不支持 Panel 旧语法和高度动画。
- Tabs：items、受控/非受控、方向键/Home/End 焦点移动、Enter/Space 激活、位置、卡片、增删回调、内容保留/销毁及组件 token。超宽标签原生滚动；暂不支持 overflow 更多菜单、动画指示条、自定义 indicator/renderTabBar、TabPane 旧语法和 ref 契约。
- Empty：默认/简洁图、自定义图片/描述/底部内容、图像透明度 token。内置 SVG 为独立绘制，不承诺上游插画一致。
- Statistic：字符串/数字值、千分位、小数精度、前后缀、formatter、加载和字体 token。字符串大数保留精度；小数截取而非四舍五入。暂不支持 Countdown / Timer。
- Timeline：items、状态颜色、自定义节点、标签、左右/交替、pending、reverse 和轨道/节点 token。暂不支持 Item 旧语法、完整动效及语义化样式配置。
- Descriptions：items、响应式 column、span/filled、横向/纵向、有边框、大小、标题/extra 和组件 token。暂不支持 Item 旧语法、响应式 span、styles/classNames。

浏览器夹具在默认、品牌、暗色、紧凑和组件覆盖主题下比较 1,330 项稳定样式值；不覆盖全部变体或完整像素一致性。真实文档检查覆盖面板/标签页输入保留、键盘操作、增删焦点、侧栏折叠、栅格断点和八页移动端溢出。

## 文字与列表

- Typography：Text / Paragraph / Title / Link、文字类型和修饰、禁用链接、复制、受控/非受控编辑状态、编辑提交/取消及焦点恢复、CSS 多行省略、受控/非受控展开。titleMarginTop/titleMarginBottom 与相关全局 token。编辑后的值由 onChange 调用方保存；复制依赖 Clipboard API，失败有状态反馈。暂不支持 tooltip、symbol、可定制操作图标、自动行高和完整 ref 契约。展开入口不做溢出测量，配置后始终显示；后缀和操作按钮在省略区外，不承诺复杂富文本的上游截断算法。
- List：dataSource / renderItem / rowKey、Item / Meta、actions / extra、header/footer/loadMore、尺寸、分割线、边框、空状态、布尔或 SpinProps 加载状态和响应式 grid。组件间距、背景、Meta 文字 token。支持内置 pagination 与 top / bottom / both 位置，本地 dataSource 分页及受控 total / current / pageSize 的服务端分页；暂不支持虚拟列表、colStyle 和 styles/classNames。加载状态复用 Spin；Card 的加载占位复用 Skeleton。

文字与列表的五组主题夹具比较 770 项稳定样式值；覆盖基础文字、三级标题、段落、有边框列表/Meta 与小尺寸条目，不等于完整视觉或全部变体兼容。


## 加载与结果反馈

- Spin：`spinning`、`delay`、三种尺寸、自定义 indicator、嵌套内容和 tip、fullscreen、wrapperClassName。延迟计时器在状态变化或卸载时清理；嵌套加载区域提供 aria-busy，显示加载时内容不可交互。支持 dotSize / dotSizeSM / dotSizeLG / contentHeight 及相关全局 token。tip 仅用于嵌套或全屏；暂不支持 percent / auto 和 setDefaultIndicator 静态方法。全屏层使用固定定位，尚未接入共享 portal，不承诺在带 transform 的祖先中覆盖整个视口。
- Skeleton：loading、active、round、头像/标题/段落配置，以及 Button / Avatar / Input / Image / Node 独立占位。支持渐变颜色、标题/段落高度、圆角与间距 token，并兼容 color / colorGradientEnd 旧 token。图片占位 SVG 为独立绘制；不承诺完整 DOM 或语义化 styles/classNames 兼容。
- Progress：line / circle / dashboard、percent、状态、format、success 段、颜色和渐变、尺寸与线宽、线端形状、圆形缺口、数值 steps。百分比限制在 0–100，steps 限制在 0–1000；active 动效用于线形。支持 defaultColor / remainingColor / circleTextColor / circleTextFontSize / lineBorderRadius。暂不支持圆形 steps、逐段颜色数组、percentPosition、rounding、旧 width 属性；渐变 direction 仅用于线形，分段模式不支持渐变。
- Result：七种状态、title / subTitle、icon、extra 与补充内容，以及 titleFontSize / subtitleFontSize / iconFontSize / extraMargin token。状态 SVG 为独立绘制；403 / 404 / 500 使用简洁数字图示，未移植上游完整插画，自定义 icon 可替换图示。

以上为已实现范围。交互、主题与浏览器对照的实际覆盖以测试夹具及组件页面为准；不据此推导完整像素、全部变体或其他浏览器兼容性。


## 常规选择与导航

- Segmented：字符串/数字 options、标签/图标、受控/非受控、大小、禁用、block、vertical、round、原生 radio name、方向键及 Home / End。支持轨道与条目背景/颜色 token；暂不支持滑块平移动画和 prefixCls。
- Rate：受控/非受控、数量、半星、清除、禁用、自定义字符、hover 回调和键盘调整。使用 slider 语义，支持 starColor / starSize / starHoverScale / starBg。tooltips 为原生 title；暂不支持命令式 ref、autoFocus、RTL 反向选择。
- Breadcrumb：items、链接与原生点击、条目/全局分隔符，支持文字/链接/分隔符颜色与间距 token。暂不支持菜单、旧 routes / children 和 itemRender。
- Steps：items、current / initial、状态、标题/描述/自定义图标、大小、方向、标签位置、窄屏转纵向与点击回调。支持 iconSize / iconSizeSM / descriptionMaxWidth。暂不支持 progressDot、导航式 / inline、percent、旧 Step 子组件。
- Pagination：受控/非受控页码和条数、简洁/小尺寸、前后跳转、条数切换、快速跳页、总数文案、自定义按钮内容、禁用与单页隐藏。支持 itemSize / itemSizeSM / itemBg / itemActiveBg。条数选择为原生 select；暂不支持 locale、align、响应式精简、showQuickJumper 对象。itemRender 仅替换按钮内容，不应嵌套按钮或链接。List 已接入内置分页，可配置顶部、底部或两侧显示。

## 文字提示与气泡卡片

Tooltip 与 Popover 共享 Octane 原生 portal，保留 ConfigProvider 与业务 context。支持受控/非受控、hover / focus / click / contextMenu 及组合触发、延迟、Escape、外部指针点击关闭、十二种位置、视口边缘翻转/位移、滚动/尺寸变化重定位、基础箭头、销毁或保留内容与自定义容器。Tooltip 使用唯一 tooltip id 关联触发元素；Popover 是非模态浮层，内容可以选择，不进行焦点锁定。

- Tooltip：title 节点/函数、CSS color、Tooltip.zIndexPopup 与相关全局颜色/字体/间距/圆角/阴影。
- Popover：title / content 节点/函数、CSS color、Popover.zIndexPopup / titleMinWidth / innerPadding 与相关全局 token。

触发内容增加 inline-flex span 包裹，子元素原有事件保留。应提供单个可聚焦触发元素；键盘提示需包含 focus 触发。默认挂载 body 并采用固定定位，自定义容器需设置定位样式；暂不处理自定义容器任意 transform 缩放或裁剪祖先。暂不支持 arrow 对象、align、fresh、旧 visible 系列属性、动画生命周期、语义化 styles/classNames、完整 ref 契约和上游预设颜色别名。内容始终随状态更新，基础箭头不表示完整上游动效或像素一致。

## InputNumber 与 Slider

- InputNumber：数值模式受控/非受控、min/max、step、precision、formatter/parser、步进按钮、键盘、禁用/只读、状态/尺寸及 ref。编辑时保留中间文本，失焦规范化；十进制步进避免常见浮点累加误差，但不提供 stringMode 任意精度。暂不支持 variant、前后缀、滚轮、长按步进、自定义控制按钮或修饰键倍率。
- Slider：单值/双值范围、受控/非受控、min/max/step、marks/dots、方向、禁用、键盘及指针操作；双柄不交叉。提示为组件内小标签，未提供完整 Tooltip portal/边界翻转。暂不支持可编辑多柄、轨道整体拖动、完整 ref 与语义 styles/classNames。

这两项提供基础 token 支持，具体字段和未支持能力以各组件页面为准；不承诺完整上游 API 或内部 DOM 兼容。

## Message / Notification

提供 `message.useMessage` 与 `notification.useNotification`（以及同名独立 hook），返回 api 和需渲染的 contextHolder。原生 portal 保留 holder 所在位置的主题与业务 context；支持类型、同 key 更新、自动/手动关闭、最大数量、倒计时暂停和卸载清理。Message 返回可调用关闭且可等待的 handle，Notification 支持六种位置、标题/描述/操作按钮。暂不提供静态调用、全局 config、通知堆叠、进度条和完整动画。

## Modal / Drawer

提供受控 open、标题/内容/底部、关闭回调、键盘 Escape、遮罩、焦点循环与恢复、嵌套滚动锁、原生 portal、内容保留或销毁。Modal 支持确认按钮 loading，Drawer 支持四个方向。暂不提供静态方法、useModal、完整动画、Drawer push/resizable 或完整上游语义样式契约。自定义挂载容器不意味着任意变换/裁剪祖先下均兼容。

## Menu / Dropdown / Popconfirm

- Menu：items、分组/分割线、禁用、选择/多选、展开键、受控与非受控、方向键焦点。子菜单当前在同一菜单树内展开；不提供完整浮层子菜单、水平溢出收纳、inlineCollapsed 或暗色 Menu 独立预设。
- Dropdown：menu、click/hover/contextMenu、位置、受控打开、选择后关闭、外部关闭与键盘焦点；使用原生 portal。未提供 Dropdown.Button、popupRender 或完整 overlay 旧 API。
- Popconfirm：标题/说明、确认/取消、按钮自定义、禁用、受控打开和 Promise 确认。Promise 拒绝时保留浮层，错误展示由调用方处理；等待期间仍允许 Escape 或外部点击关闭。定位限制同 Tooltip；不提供完整语义样式、ref 或动画契约。

组件数量只表示有基础实现；每个组件的完整能力仍须按页面支持边界核对。

## 滚动定位与引导

- Affix：窗口/自定义滚动容器、顶部/底部偏移、占位与变化回调。暂不处理祖先 transform、复杂裁剪和任意嵌套滚动坐标变换。
- Anchor：嵌套链接、当前项、滚动定位与自定义容器；不支持完整上游路由与历史行为。
- FloatButton：按钮/链接、分组、展开关闭及 BackTop；基础 token 与键盘操作，不提供完整菜单式多层交互。
- Tour：目标高亮、步骤切换、受控状态、目标滚动和焦点恢复。目标区域默认不可穿透点击；mask=false 仍保留焦点约束和滚动锁，不等同上游非模态模式；不承诺任意变换祖先、自定义容器或完整上游动画/语义样式契约。

## 图片、轮播与内容表面

- Image / PreviewGroup：加载占位与失败回退、单图/分组预览、缩放、切换和关闭。暂不支持完整上游工具栏、下载、旋转/翻转或图片拖拽。
- Carousel：切换、指示器、初始页、ref、自动播放/暂停、键盘与滑动。不是 react-slick 接口兼容层；不支持多列、中心与自定义过渡模式。
- Splitter / Panel：水平/垂直布局、受控/非受控尺寸、拖拽和键盘调整、最小/最大尺寸。暂不支持折叠、延迟拖动、RTL；Panel 需作为直接子节点。
- Watermark：文字/图片、旋转、间距、偏移与字体颜色，Canvas 按设备像素比绘制。图片加载失败回退文字；不提供防篡改保障或完整嵌套继承行为。

## 应用入口、图标与二维码

- App：通过 App.useApp 取得共享 message / notification 实例；不提供 modal 静态实例。App 的上下文入口需放在 App 子组件内调用。
- Icon：原生 SVG、spin/rotate/twoToneColor、createIcon 与图标数据适配。未内置完整图标集合，不使用 React 图标运行时；不提供 iconfont 脚本加载或全局双色配置。
- QRCode：真实二维码编码，Canvas / SVG、四种纠错等级、颜色/尺寸及加载/过期/已扫描状态。编码器使用注明来源的 MIT 实现；不支持中心图标、下载 ref 和自定义状态渲染。二维码色彩对比与实际扫描环境仍需业务验证。

以上均为基础实现；各组件页面列出对应属性和主题 token。现有主题算法兼容不意味着所有组件 token 已完整覆盖。
