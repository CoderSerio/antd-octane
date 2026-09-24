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

支持通过 components.Checkbox 覆盖相关全局 token、指定算法及继承主题。暂不提供 Checkbox.Group、options、Form.Item 集成、wave 动效或任意 DOM 结构兼容。

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
