# Cascader（未发布源码）

此入口属于下一版源码，已发布的 `0.1.0-alpha.7` 不提供它。以 Ant Design
5.29.3 为 API 参考，当前仅提供原生 Octane 单路径选择子集。

支持 options、fieldNames（value/label/children）、value/defaultValue 路径数组、
onChange(path, selectedOptions)、disabled、allowClear/onClear、changeOnSelect。
同级 value 必须唯一，允许不同父节点下重复值。默认仅叶节点提交；
changeOnSelect 也提交中间节点但保留展开菜单；叶节点关闭弹层。
清空产生 `[]` 和空 selectedOptions。支持 Form 值绑定与重置。

showSearch 使用整条文本路径进行包含匹配；非文本 label 按 value 搜索/显示。
支持受控 searchValue/onSearch 和 open/onOpenChange。
触发器 ArrowDown 打开，再按一次进入列表；列表 Up/Down、Home/End 跳过禁用项，
Right 展开下一列，Left 返回上列；Enter 选择，Escape 返回输入框，Tab 离开关闭。
暂不支持 RTL 方向键语义翻转（视觉方向会跟随 ConfigProvider）。

未实现 multiple、loadData、hover 展开、自定义过滤/渲染、Panel、labelInValue、
独立虚拟滚动或完整上游参数。异步 options 由应用管理，未暴露加载方法。
支持 size/status、ConfigProvider disabled/size/direction、基础主题 Token、
getPopupContainer 与 ref.focus()/blur()。触发器/弹层复用 Select 基础样式 Token，
未声称 Cascader 专属 token 或完整视觉/无障碍兼容。
