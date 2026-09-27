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
const projects = new Set([
  "Table",
  "DatePicker",
  "TimePicker",
  "Tree",
  "TreeSelect",
  "Cascader",
  "AutoComplete",
  "Mentions",
  "Upload",
  "ColorPicker",
]);
const floating = new Set([
  "Tour",
  "Modal",
  "Drawer",
  "Dropdown",
  "Menu",
  "Popconfirm",
  "Message",
  "Notification",
  "Image",
  "FloatButton",
  "App",
]);
export const componentCoverage = upstreamGroups.flatMap(([group, names]) =>
  names.split(" ").map((name) => {
    const page = nav.find(
      (item) =>
        item.category === "components" &&
        item.id !== "components" &&
        item.title.split(" ")[0] === name,
    );
    const implemented = !!page || name === "ConfigProvider";
    return {
      name,
      group,
      implemented,
      href: page
        ? `#${page.id}`
        : name === "ConfigProvider"
          ? "#theme"
          : undefined,
      upstream: `https://5x.ant.design/components/${upstreamSlug(name)}-cn/`,
      status: implemented
        ? "基础版"
        : projects.has(name)
          ? "待专项实现"
          : floating.has(name)
            ? "待浮层基础完善"
            : "待实现",
    };
  }),
);
