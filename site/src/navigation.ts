export const nav = [
  {
    id: "overview",
    title: "项目介绍",
    category: "guide",
    group: "开始",
    keywords: "overview introduction",
  },
  {
    id: "start",
    title: "快速开始",
    category: "guide",
    group: "开始",
    keywords: "getting started 安装 使用",
  },
  {
    id: "theme",
    title: "定制主题",
    category: "guide",
    group: "进阶使用",
    keywords: "theme token ConfigProvider Tailwind StyleX 暗色",
  },
  {
    id: "api-conventions",
    title: "API 与语法约定",
    category: "guide",
    group: "进阶使用",
    keywords: "ref current useState onChange 受控 事件",
  },
  {
    id: "compatibility",
    title: "兼容与迁移",
    category: "guide",
    group: "其他",
    keywords: "limitations differences migration 支持范围",
  },
  {
    id: "components",
    title: "组件总览",
    category: "components",
    group: "组件",
    keywords: "components",
  },
  {
    id: "button",
    title: "Button 按钮",
    category: "components",
    group: "通用",
    keywords: "button 按钮",
  },
  {
    id: "flex",
    title: "Flex 弹性布局",
    category: "components",
    group: "布局",
    keywords: "flex 弹性布局",
  },
  {
    id: "space",
    title: "Space 间距",
    category: "components",
    group: "布局",
    keywords: "space 间距",
  },
  {
    id: "divider",
    title: "Divider 分割线",
    category: "components",
    group: "布局",
    keywords: "divider 分割线",
  },
  {
    id: "switch",
    title: "Switch 开关",
    category: "components",
    group: "数据录入",
    keywords: "switch 开关",
  },
  {
    id: "input",
    title: "Input 输入框",
    category: "components",
    group: "数据录入",
    keywords: "input text 输入 表单",
  },
  {
    id: "checkbox",
    title: "Checkbox 多选框",
    category: "components",
    group: "数据录入",
    keywords: "checkbox check 多选 表单",
  },
  {
    id: "radio",
    title: "Radio 单选框",
    category: "components",
    group: "数据录入",
    keywords: "radio 单选框",
  },
  {
    id: "tag",
    title: "Tag 标签",
    category: "components",
    group: "数据展示",
    keywords: "tag 标签",
  },
  {
    id: "alert",
    title: "Alert 警告提示",
    category: "components",
    group: "反馈",
    keywords: "alert 警告提示",
  },
  {
    id: "card",
    title: "Card 卡片",
    category: "components",
    group: "数据展示",
    keywords: "card 卡片",
  },
  {
    id: "badge",
    title: "Badge 徽标数",
    category: "components",
    group: "数据展示",
    keywords: "badge 徽标数",
  },
  {
    id: "avatar",
    title: "Avatar 头像",
    category: "components",
    group: "数据展示",
    keywords: "avatar 头像",
  },
  {
    id: "grid",
    title: "Grid 栅格",
    category: "components",
    group: "布局",
    keywords: "grid 栅格",
  },
  {
    id: "layout",
    title: "Layout 布局",
    category: "components",
    group: "布局",
    keywords: "layout 布局",
  },
  {
    id: "collapse",
    title: "Collapse 折叠面板",
    category: "components",
    group: "数据展示",
    keywords: "collapse 折叠面板",
  },
  {
    id: "tabs",
    title: "Tabs 标签页",
    category: "components",
    group: "数据展示",
    keywords: "tabs 标签页",
  },
  {
    id: "empty",
    title: "Empty 空状态",
    category: "components",
    group: "数据展示",
    keywords: "empty 空状态",
  },
  {
    id: "statistic",
    title: "Statistic 统计数值",
    category: "components",
    group: "数据展示",
    keywords: "statistic 统计数值",
  },
  {
    id: "timeline",
    title: "Timeline 时间轴",
    category: "components",
    group: "数据展示",
    keywords: "timeline 时间轴",
  },
  {
    id: "descriptions",
    title: "Descriptions 描述列表",
    category: "components",
    group: "数据展示",
    keywords: "descriptions 描述列表",
  },
];
export const toc: Record<string, [string, string][]> = {
  overview: [
    ["features", "特性"],
    ["environment", "支持环境"],
    ["progress", "当前进度"],
    ["contribute", "参与贡献"],
  ],
  start: [
    ["install", "启动文档站"],
    ["integration", "接入现有项目"],
    ["usage", "使用组件"],
    ["build", "构建与验证"],
  ],
  theme: [
    ["configure", "配置主题"],
    ["brand", "修改主题变量"],
    ["algorithms", "使用预设算法"],
    ["component-token", "修改组件变量"],
    ["nested", "局部主题与动态切换"],
    ["styling", "Tailwind CSS 与 StyleX"],
    ["limitations", "迁移边界"],
  ],
  components: [
    ["general", "通用"],
    ["layout", "布局"],
    ["entry", "数据录入"],
    ["display", "数据展示"],
    ["feedback", "反馈"],
    ["configuration", "主题与配置"],
  ],
  "api-conventions": [
    ["state", "状态与受控输入"],
    ["refs", "ref 与原生事件"],
    ["planned", "后续 API 的边界"],
  ],
  compatibility: [
    ["matrix", "支持矩阵"],
    ["migration", "迁移检查"],
    ["pending", "待验证能力"],
  ],
  input: [
    ["when", "何时使用"],
    ["examples", "代码演示"],
    ["basic", "基本使用"],
    ["sizes", "三种大小"],
    ["controlled", "受控输入"],
    ["states", "状态"],
    ["refs", "聚焦与选择"],
    ["api", "API"],
    ["tokens", "主题变量"],
    ["limitations", "已知差异"],
  ],
  checkbox: [
    ["group", "多选组合"],
    ["when", "何时使用"],
    ["examples", "代码演示"],
    ["basic", "基本使用"],
    ["states", "不可用"],
    ["controlled", "受控选择"],
    ["all", "全选与中间态"],
    ["api", "API"],
    ["tokens", "主题变量"],
    ["limitations", "已知差异"],
  ],
  button: [
    ["when", "何时使用"],
    ["examples", "代码演示"],
    ["basic", "按钮类型"],
    ["sizes", "尺寸与形状"],
    ["states", "状态与反馈"],
    ["nested", "嵌套主题"],
    ["component", "组件级覆盖"],
    ["api", "API"],
    ["limitations", "已知差异"],
  ],
};

toc.flex = [
  ["examples", "代码演示"],
  ["api", "API"],
  ["tokens", "主题与支持范围"],
];
toc.space = [
  ["examples", "代码演示"],
  ["api", "API"],
  ["tokens", "主题与支持范围"],
];
toc.divider = [
  ["examples", "代码演示"],
  ["api", "API"],
  ["tokens", "主题与支持范围"],
];
toc.switch = [
  ["examples", "代码演示"],
  ["api", "API"],
  ["tokens", "主题与支持范围"],
];

toc.radio = [
  ["when", "何时使用"],
  ["examples", "代码演示"],
  ["basic", "基本使用"],
  ["more", "组合与交互"],
  ["api", "API"],
  ["tokens", "主题与支持范围"],
];
toc.tag = [
  ["when", "何时使用"],
  ["examples", "代码演示"],
  ["basic", "基本使用"],
  ["more", "组合与交互"],
  ["api", "API"],
  ["tokens", "主题与支持范围"],
];
toc.alert = [
  ["when", "何时使用"],
  ["examples", "代码演示"],
  ["basic", "基本使用"],
  ["more", "组合与交互"],
  ["api", "API"],
  ["tokens", "主题与支持范围"],
];
toc.card = [
  ["when", "何时使用"],
  ["examples", "代码演示"],
  ["basic", "基本使用"],
  ["more", "组合与交互"],
  ["api", "API"],
  ["tokens", "主题与支持范围"],
];
toc.badge = [
  ["when", "何时使用"],
  ["examples", "代码演示"],
  ["basic", "基本使用"],
  ["more", "组合与交互"],
  ["api", "API"],
  ["tokens", "主题与支持范围"],
];
toc.avatar = [
  ["when", "何时使用"],
  ["examples", "代码演示"],
  ["basic", "基本使用"],
  ["more", "组合与交互"],
  ["api", "API"],
  ["tokens", "主题与支持范围"],
];

toc.grid = [
  ["examples", "代码演示"],
  ["basic", "基础栅格"],
  ["more", "响应式布局"],
  ["api", "API"],
  ["tokens", "主题与支持范围"],
];
toc.layout = [
  ["examples", "代码演示"],
  ["basic", "上下结构"],
  ["more", "响应式侧栏"],
  ["api", "API"],
  ["tokens", "主题与支持范围"],
];
toc.collapse = [
  ["examples", "代码演示"],
  ["basic", "折叠与状态保留"],
  ["more", "手风琴与独立操作"],
  ["api", "API"],
  ["tokens", "主题与支持范围"],
];
toc.tabs = [
  ["examples", "代码演示"],
  ["basic", "切换与键盘操作"],
  ["more", "新增和关闭标签"],
  ["api", "API"],
  ["tokens", "主题与支持范围"],
];
toc.empty = [
  ["examples", "代码演示"],
  ["basic", "空状态"],
  ["more", "简洁图与操作入口"],
  ["api", "API"],
  ["tokens", "主题与支持范围"],
];
toc.statistic = [
  ["examples", "代码演示"],
  ["basic", "数值与金额"],
  ["more", "字符串精度"],
  ["api", "API"],
  ["tokens", "主题与支持范围"],
];
toc.timeline = [
  ["examples", "代码演示"],
  ["basic", "事件与状态"],
  ["more", "交替布局与等待状态"],
  ["api", "API"],
  ["tokens", "主题与支持范围"],
];
toc.descriptions = [
  ["examples", "代码演示"],
  ["basic", "成组信息"],
  ["more", "响应式与边框"],
  ["api", "API"],
  ["tokens", "主题与支持范围"],
];
