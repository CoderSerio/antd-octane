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
];
export const toc: Record<string, [string, string][]> = {
  overview: [["progress", "当前进度"]],
  start: [
    ["install", "启动文档站"],
    ["usage", "使用组件"],
    ["build", "构建与验证"],
  ],
  theme: [
    ["contract", "已验证的契约"],
    ["styling", "Tailwind CSS 与 StyleX"],
    ["limitations", "迁移边界"],
  ],
  components: [
    ["general", "通用"],
    ["configuration", "主题与配置"],
  ],
  button: [
    ["when", "何时使用"],
    ["examples", "代码演示"],
    ["api", "API"],
    ["limitations", "已知差异"],
  ],
};
