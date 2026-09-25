# 组件扩展清单

目标：在已确认的复杂组件专项之外，逐步完成大部分 antd v5 常用组件。每项同时交付实际交互、主题、文档和验证；未实现项不进入站点菜单。

## 批次与验收

- 基础补全：Button、Input（TextArea / Password / Search / 清除与前后缀）、Checkbox.Group。
- 布局：Flex、Space、Divider、Grid（Row / Col）、Layout、Splitter。
- 展示：Typography、Tag、Badge、Avatar、Card、Collapse、Descriptions、Empty、List、Carousel、Statistic、Timeline、Tooltip、Popover、Image、QRCode、Watermark。
- 常规交互：Switch、Radio、Segmented、Rate、Slider、InputNumber、Pagination、Tabs、Steps、Breadcrumb、Menu、Dropdown。
- 反馈与浮层：Alert、Spin、Skeleton、Progress、Result、Modal、Drawer、Popconfirm、message、notification、Affix、FloatButton、Anchor、BackTop。
- 基础设施：共享 portal、定位、焦点、键盘、context；图标入口；ConfigProvider 补全；消费示例与发布前检查。

Form、Table、ColorPicker、日期/时间选择、Tree/TreeSelect/Cascader、Select/AutoComplete/Mentions 为专项。Upload 另建上传生命周期设计；Transfer、Calendar 延后评估；Tour 在共享浮层、定位、焦点和遮罩能力完成后实现。以上是实现顺序，不是永久排除，也不承诺未验证的完整 API。

每批次必须经过 `pnpm check`、`pnpm pack:check`、真实浏览器交互和主题检查。上游对照只证明夹具覆盖的属性与场景；维护组件 API 和主题差异表。文档主题入口与主题页面参考两站继续细化，不将所有示例放入首屏。

## 当前进度

- 已验证基础版：Button、Input、Checkbox、ConfigProvider。
- 已实现并完成首轮验证：Flex、Space、Divider、Switch；主题页补齐品牌色、预设算法、组件级和嵌套主题演示，主题面板使用 Switch。
- 已实现并完成首轮验证：Radio / Checkbox.Group、Tag / CheckableTag、Alert、Card / Meta、Badge、Avatar；各组件的未支持能力见文档。
- 已实现并完成首轮验证：Grid / Layout、Collapse、Tabs、Empty、Statistic、Timeline、Descriptions；包括响应式布局、面板保留/销毁和标签页键盘操作。
- 已实现：Typography（复制/编辑/省略）与 List（Meta/操作/响应式网格），验证基础样式与交互，具体差异见兼容清单。
- 已实现：Spin、Skeleton、Progress、Result；List 复用 Spin 加载层，Card 复用 Skeleton 占位。完整 API 与插画差异见兼容清单，验证范围以实际夹具为准。
- 已实现：Segmented、Rate、Breadcrumb、Steps、Pagination、Tooltip、Popover；List 接入内置分页，提示浮层共享 Octane portal 与定位逻辑。基础能力与未支持属性见兼容清单。
- 已实现：Input 前后缀/清除/Password/Search/TextArea、InputNumber、Slider。按 5.x 目录有 55 项基础实现（包含 ConfigProvider），该数量不是功能完成比例。后续继续完善专项组件，已有组件的 API 缺口也需逐项完善。
- 已实现基础子集：Message、Notification、Modal、Drawer、Menu、Dropdown、Popconfirm；完成门户、焦点与事件组合验证，静态调用、完整动效及高级菜单能力仍需完善。
- 已实现基础子集：Affix、Anchor、FloatButton、Image、Carousel、Splitter、Watermark、App、Icon、QRCode、Tour；提供交互示例与主题入口，具体高级能力的缺口见兼容清单。
- 其余专项、Transfer 与 Calendar 仍待实现；Util 仅保留上游目录记录，未定义可用公共 API。

## 5.x 完整目录核对

以 [Ant Design 5.x 文档](https://5x.ant.design/components/tour-cn/)的侧栏目录核对覆盖范围，避免跟随最新版文档混入其他主版本 API。验证包基线仍固定 5.29.3，网站展示的 patch 版本可能不同。

本轮补入此前漏列的 Splitter、ColorPicker、Carousel；Icon、App、Util 属于基础设施，同样进入站点组件总览的完整清单。该清单区分基础实现、待实现、待专项和待浮层基础完善；未实现项只链接上游，不伪装成本库可用组件。
