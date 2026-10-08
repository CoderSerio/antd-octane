import { nav } from "./navigation";
// Inventory follows the Ant Design 5.x component navigation, not package exports.
export const upstreamGroups = [
  ["通用", "Button FloatButton Icon Typography"],
  ["布局", "Divider Flex Grid Layout Space Splitter"],
  ["导航", "Anchor Breadcrumb Dropdown Menu Pagination Steps Tabs"],
  [
    "数据录入",
    "AutoComplete Cascader Checkbox ColorPicker DatePicker Form Input InputNumber Mentions Radio Rate Select Slider Switch TimePicker Transfer TreeSelect Upload",
  ],
  [
    "数据展示",
    "Avatar Badge Calendar Card Carousel Collapse Descriptions Empty Image List Popover QRCode Segmented Statistic Table Tag Timeline Tooltip Tour Tree",
  ],
  [
    "反馈",
    "Alert Drawer Message Modal Notification Popconfirm Progress Result Skeleton Spin Watermark",
  ],
  ["其他", "Affix App ConfigProvider Util"],
] as const;
const specialSlugs: Record<string, string> = {
  FloatButton: "float-button",
  AutoComplete: "auto-complete",
  ColorPicker: "color-picker",
  DatePicker: "date-picker",
  InputNumber: "input-number",
  TimePicker: "time-picker",
  TreeSelect: "tree-select",
  QRCode: "qr-code",
  ConfigProvider: "config-provider",
};
export const upstreamSlug = (name: string) =>
  specialSlugs[name] ?? name.toLowerCase();
// Development source can be ahead of the npm version installed by this site.
// Keep runtime demos pinned to npm; link source-only entries to their scope.
const sourceOnly: Record<string, { path: string; scope: string }> = {
  Calendar: { path: "calendar", scope: "日期/月面板与日期适配器" },
  Table: { path: "table", scope: "表格、分页、排序过滤与行选择" },
  Tree: { path: "tree", scope: "树节点展开、选择与勾选" },
  Util: { path: "_util/type.ts", scope: "GetProps / GetProp / GetRef 类型" },
  Cascader: {
    path: "cascader/README.md",
    scope: "单路径级联、搜索与键盘；不含多选、异步加载",
  },
  ColorPicker: {
    path: "color-picker/README.md",
    scope: "纯色、透明度与预设；不含渐变",
  },
  DatePicker: {
    path: "date-picker/README.md",
    scope: "Dayjs 日期与范围；不含 showTime",
  },
  Mentions: { path: "mentions/README.md", scope: "提及建议、键盘与输入法" },
  TimePicker: {
    path: "time-picker/README.md",
    scope: "24 小时时分秒；不含范围、12 小时制",
  },
  Transfer: { path: "transfer/README.md", scope: "双列表移动、搜索与选择" },
  TreeSelect: {
    path: "tree-select/README.md",
    scope: "树形单选/多选与搜索；不含勾选联动、异步加载",
  },
  Upload: {
    path: "upload/README.md",
    scope: "文件列表、拖放与请求生命周期；不含目录上传",
  },
};
export const componentCoverage = upstreamGroups.flatMap(([group, names]) =>
  names.split(" ").map((name) => {
    const page = nav.find(
      (item) =>
        item.category === "components" &&
        item.id !== "components" &&
        item.title.split(" ")[0] === name,
    );
    const implemented = !!page || name === "ConfigProvider";
    const development = sourceOnly[name];
    return {
      name,
      group,
      implemented,
      sourceImplemented: implemented || !!development,
      sourceHref: development
        ? `https://github.com/CoderSerio/antd-octane/tree/main/packages/antd-octane/src/${development.path}`
        : undefined,
      scope: development?.scope,
      href: page
        ? `#${page.id}`
        : name === "ConfigProvider"
          ? "#theme"
          : undefined,
      upstream: `https://5x.ant.design/components/${upstreamSlug(name)}-cn/`,
      status: implemented
        ? "npm 已提供·支持子集"
        : development
          ? "源码已提供·待发布"
          : "待实现",
    };
  }),
);
