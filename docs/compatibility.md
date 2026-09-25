# 第一版支持范围

状态：开发原型，未发布 npm。固定基线为 Octane 0.4.3、Ant Design 5.29.3。

## 主题

- 复用 Ant Design 的纯 seed/map/alias 算法，来源和改动记录在包内第三方声明与 `.sync-upstream.json`。
- `theme.getDesignToken` 返回全局派生 token；默认、暗色、紧凑、组合算法及自定义配置与原版 antd 对照。
- `ConfigProvider` 支持 `theme.token`、`theme.algorithm`、`theme.components.Button/Input/Checkbox`、`inherit`、`componentSize` 和 `componentDisabled`。
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

暂不支持 prefix/suffix、allowClear、addonBefore/After、variant、showCount、Input.Search/Password/TextArea/OTP、Form 集成、带 cursor 选项的 focus。onChange 提供原生事件而非 SyntheticEvent；输入法 Enter 被抑制，组合中的 input 事件仍传给调用方。

## Checkbox

支持 `checked/defaultChecked`、`indeterminate`、`disabled`、原生属性、标签 children、`className/style` 与 ref（`input/nativeElement/focus/blur`）。onChange 具有 `target.checked/value`、`nativeEvent`、`preventDefault` 和 `stopPropagation`，不是完整 SyntheticEvent。中间态使用原生 indeterminate 属性与视觉样式。

支持通过 components.Checkbox 覆盖相关全局 token、指定算法及继承主题。支持 Checkbox.Group 的 options / 子项、受控值、禁用、name 和 skipGroup。暂不提供 Form.Item 集成、wave 动效或任意 DOM 结构兼容。

## 样式与包

组件原生运行时不依赖 React；React 和 antd 仅用于开发对照测试。发布前保持包为 private。

组件使用静态 CSS，派生值通过 `--ao-btn-*`、`--ao-input-*`、`--ao-check-*` 局部变量传递。ConfigProvider 不创建额外 DOM，不在全局插入动态 style 标签。构建产物需要显式导入 `antd-octane/style.css`；仅支持 ESM 浏览器消费。SSR 不在本次支持范围。

组件 CSS 位于 `@layer antd`。用户可以通过普通 `className` 和 `style` 扩展，不依赖 Tailwind CSS 或 StyleX；二者完整工具链的消费验证仍待后续完成。请勿把 StyleX 原始样式对象当作 DOM style 对象传入。

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
- List：dataSource / renderItem / rowKey、Item / Meta、actions / extra、header/footer/loadMore、尺寸、分割线、边框、空状态、基础加载状态和响应式 grid。组件间距、背景、Meta 文字 token。暂不支持内置 pagination、SpinProps loading、虚拟列表、colStyle 和 styles/classNames；分页待 Pagination 接入，加载动画待共享 Spin 接入。

文字与列表的五组主题夹具比较 770 项稳定样式值；覆盖基础文字、三级标题、段落、有边框列表/Meta 与小尺寸条目，不等于完整视觉或全部变体兼容。
