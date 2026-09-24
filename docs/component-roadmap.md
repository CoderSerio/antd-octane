# 组件扩展清单

目标：在已确认的复杂组件专项之外，逐步完成大部分 antd v5 常用组件。每项同时交付实际交互、主题、文档和验证；未实现项不进入站点菜单。

## 批次与验收

- 基础补全：Button、Input（TextArea / Password / Search / 清除与前后缀）、Checkbox.Group。
- 布局：Flex、Space、Divider、Grid（Row / Col）、Layout。
- 展示：Typography、Tag、Badge、Avatar、Card、Collapse、Descriptions、Empty、List、Statistic、Timeline、Tooltip、Popover、Image、QRCode、Watermark。
- 常规交互：Switch、Radio、Segmented、Rate、Slider、InputNumber、Pagination、Tabs、Steps、Breadcrumb、Menu、Dropdown。
- 反馈与浮层：Alert、Spin、Skeleton、Progress、Result、Modal、Drawer、Popconfirm、message、notification、Affix、FloatButton、Anchor、BackTop。
- 基础设施：共享 portal、定位、焦点、键盘、context；图标入口；ConfigProvider 补全；消费示例与发布前检查。

Form、Table、日期/时间选择、Tree/TreeSelect/Cascader、Select/AutoComplete/Mentions 为专项。Upload 另建上传生命周期设计；Transfer、Tour、Calendar 延后评估。以上是实现顺序，不是永久排除，也不承诺未验证的完整 API。

每批次必须经过 `pnpm check`、`pnpm pack:check`、真实浏览器交互和主题检查。上游对照只证明夹具覆盖的属性与场景；维护组件 API 和主题差异表。文档主题入口与主题页面参考两站继续细化，不将所有示例放入首屏。

## 当前进度

- 已验证基础版：Button、Input、Checkbox、ConfigProvider。
- 已实现并完成首轮验证：Flex、Space、Divider、Switch；主题页补齐品牌色、预设算法、组件级和嵌套主题演示，主题面板使用 Switch。
- 已实现并完成首轮验证：Radio / Checkbox.Group、Tag / CheckableTag、Alert、Card / Meta、Badge、Avatar；各组件的未支持能力见文档。
- 已实现并完成首轮验证：Grid / Layout、Collapse、Tabs、Empty、Statistic、Timeline、Descriptions；包括响应式布局、面板保留/销毁和标签页键盘操作。
- 下一批：Typography、List，以及其余常规交互和共享浮层基础设施。
- 其余条目待实现，不视为已支持。
