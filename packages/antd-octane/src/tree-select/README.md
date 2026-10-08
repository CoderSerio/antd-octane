# TreeSelect（未发布源码）

此入口属于下一版源码，已发布的 `0.1.0-alpha.7` 不提供它。以 Ant Design
5.29.3 为 API 参考；当前是原生 Octane 支持子集，不代表完整上游对齐。

支持 `treeData`、`fieldNames`（value/label/children）、字符串/数字唯一值，
单选及 `multiple` 多选，`value/defaultValue`、`onChange`、disabled、
allowClear/onClear、showSearch/searchValue/onSearch，以及受控/非受控弹层。
单选清除回调为 `undefined`，多选为 `[]`；`onChange` 当前仅传值。
搜索匹配文本标题并保留祖先路径；非文本标题按 value 搜索及显示。
Tree 的方向键、Home/End、Enter/Space 行为用于树内导航/选择；触发器
ArrowDown 打开，再按一次进入树，Escape 关闭并回到输入框。
Tab 离开组件及其弹层时关闭。支持原生 Form 值绑定与重置。

复用 Tree 的展开与选择，提供 treeDefaultExpandAll、treeExpandedKeys、
onTreeExpand。多选是独立节点选择，不包含父子复选联动。
未实现 treeCheckable、checked strategy、labelInValue、simple mode、loadData、
虚拟滚动、标签单独删除、render hooks 或完整上游参数。不要传未声明参数。
数据加载由应用负责，通过 treeData 更新；未提供异步加载入口。

支持 size/status、ConfigProvider disabled/size/direction、基础主题 Token、
getPopupContainer、ref.focus()/blur()。当前触发器/弹层复用 Select 基础样式
Token；未对齐 TreeSelect 专属 component token、prefixCls、全部视觉或无障碍细节。
卸载时移除 portal、ResizeObserver 和外部事件监听。

只要传入 `value` 属性就按受控模式处理，包括显式 `value={undefined}`（空值）；
省略该属性才使用内部状态与 defaultValue。Cascader 的空值显示为空路径。
