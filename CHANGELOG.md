# Changelog

此文件记录 `antd-octane` 的版本变化；标注「待发布」的条目尚不可从 npm 安装。组件支持范围与限制见[兼容与迁移](site/src/pages/compatibility.tsx)。

## 0.1.0-alpha.6 — 2026-09-30

- 新增 AutoComplete：自由文本输入与选项确认分离，支持受控值、搜索回调、过滤、清除、禁用选项、键盘操作和自定义浮层容器。
- Form 新增自定义字段属性与事件映射（`valuePropName`、`getValueProps`、`getValueFromEvent`、`trigger`），以及 Promise 形式的自定义校验；过期的异步校验不会覆盖新值或误触发成功提交。
- 新增 `Space.Compact` 和 `Space.Addon`，支持紧凑控件组合、尺寸继承、水平/垂直排列和整行布局。
- 本次仍不含 Form 嵌套字段、动态列表和依赖校验；AutoComplete 自定义输入节点、分组选项及高级渲染能力仍未支持。

## 0.1.0-alpha.5 — 2026-09-29

- Select 新增 `mode="multiple"`：数组形式的受控和非受控值、搜索、选择与移除、清空、键盘操作及多选状态说明；保留原有单选 `SelectProps`，新增 `MultipleSelectProps` 和 `SelectComponentProps` 类型。
- 修复 Input / TextArea 开启 `showCount` 后，固定宽度、百分比宽度及宽度约束与计数区域不一致的问题，覆盖带前后缀和附加内容的输入框。
- 修复 FloatButton.Group 的 `onClick` 被内部展开逻辑覆盖的问题，允许调用方通过 `preventDefault()` 阻止切换。
- Select 多选选中后保留对应高亮项；可搜索输入中的 Home/End 保留原生文本光标行为。
- Select 的标签模式、labelInValue、虚拟列表和高级渲染配置尚未支持；本次多选实现不代表完整上游 API 对齐。

## 0.1.0-alpha.4 — 2026-09-28

- Button 支持 `iconPosition` / `iconPlacement` 控制图标位置，并支持 `loading={{ delay, icon }}`；延迟结束前仍可点击，进入加载态后阻止重复操作。
- Input、Input.Password、Input.Search 与 Input.TextArea 新增基础 `showCount`，支持与原生 `maxLength` 同时显示计数，并让辅助技术读取计数说明。
- 修复 `Spin fullscreen` 处于隐藏状态时仍可能遮挡页面点击的问题。
- `showCount` 暂不支持自定义字符算法或格式化函数；Button 仍未实现完整的 color / variant、按钮组和语义化样式 API。

## 0.1.0-alpha.3 — 2026-09-28

- 新增 Form 基础版：`Form.Item` 字段绑定、初始值、必填及常见长度/正则规则、提交、重置和 `Form.useForm()` 实例方法。
- 验证与 Input、Select、Checkbox、Switch 的组合，并加入独立安装包的 TSX/TSRX 消费检查。
- 暂不支持嵌套字段路径、动态字段列表、字段依赖、异步校验和完整 Ant Design Form API。

## 0.1.0-alpha.2 — 2026-09-27

- 新增 Select 单选基础版：受控与非受控值、搜索过滤、键盘操作、清除、禁用状态及主题尺寸。
- 独立安装包验证新增 Select 的 TSX 与 TSRX/Signal 消费路径。
- 多选、标签模式、labelInValue、虚拟列表及完整 Ant Design Select API 仍待实现。

## 0.1.0-alpha.1 — 2026-09-27

- 将原始 TSX 源码作为 npm 包入口，由消费项目的 Octane 编译器处理；TSX 与 TSRX 共用同一套组件 API。
- 修复 TSRX 消费项目中 `Space`、`Splitter.Panel` 与 `Carousel` 子节点未渲染的问题。
- 扩展独立安装包检查，覆盖非数据展示组件的 TSRX 渲染，以及 Signal `.get()` 驱动的受控输入、选择与导航状态。
- 仍需 Octane `0.4.3` 和显式导入 `antd-octane/style.css`。这是 alpha 版本，不代表完整 Ant Design API、视觉、无障碍或 SSR 兼容。

## 0.1.0-alpha.0 — 2026-09-26

- 首个 npm alpha 预览版本，提供基础组件、主题算法与中文文档站。
- 该版本的预编译包不包含上述 TSRX 子节点修复。
