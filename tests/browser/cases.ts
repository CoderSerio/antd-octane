import type { ButtonProps, ThemeConfig } from "../../packages/antd-octane/src";
export const cases: { id: string; props: ButtonProps }[] = [
  { id: "default", props: {} },
  { id: "primary", props: { type: "primary" } },
  { id: "dashed", props: { type: "dashed" } },
  { id: "text", props: { type: "text" } },
  { id: "link", props: { type: "link" } },
  { id: "small", props: { size: "small", type: "primary" } },
  { id: "large", props: { size: "large", type: "primary" } },
  { id: "danger", props: { danger: true } },
  { id: "danger-primary", props: { danger: true, type: "primary" } },
  { id: "danger-text", props: { danger: true, type: "text" } },
  { id: "danger-link", props: { danger: true, type: "link" } },
  { id: "ghost", props: { ghost: true } },
  { id: "ghost-primary", props: { ghost: true, type: "primary" } },
  { id: "disabled", props: { disabled: true } },
  { id: "disabled-primary", props: { disabled: true, type: "primary" } },
  { id: "round", props: { shape: "round" } },
];
export const brand: ThemeConfig = {
  token: {
    colorPrimary: "#722ed1",
    borderRadius: 10,
    fontSize: 15,
    controlHeight: 36,
  },
};
export const component: ThemeConfig = {
  token: { colorPrimary: "#13a8a8" },
  components: {
    Segmented: {
      trackBg: "#fffbe6",
      itemSelectedBg: "#fff1b8",
      trackPadding: 4,
    },
    Rate: { starColor: "#722ed1", starSize: 24 },
    Breadcrumb: { separatorMargin: 12, separatorColor: "#722ed1" },
    Pagination: { itemSize: 36, itemBg: "#fffbe6", itemActiveBg: "#fff1b8" },
    Steps: { iconSize: 36 },
    Spin: { dotSize: 26 },
    Skeleton: {
      titleHeight: 20,
      paragraphLiHeight: 18,
      gradientFromColor: "#e6f7ff",
      gradientToColor: "#bae7ff",
    },
    Progress: {
      defaultColor: "#722ed1",
      remainingColor: "#f0e6ff",
      lineBorderRadius: 4,
    },
    Result: {
      titleFontSize: 28,
      subtitleFontSize: 16,
      iconFontSize: 64,
      extraMargin: "20px 0 0",
    },
    Typography: { titleMarginBottom: "0.8em", colorText: "#123456" },
    List: {
      headerBg: "#fffbe6",
      footerBg: "#e6f7ff",
      itemPadding: "14px 0",
      itemPaddingSM: "10px 20px",
      descriptionFontSize: 15,
    },
    Layout: {
      headerBg: "#112233",
      headerHeight: 72,
      footerPadding: "18px 32px",
    },
    Collapse: {
      headerBg: "#fffbe6",
      headerPadding: "14px 20px",
      contentPadding: "18px 20px",
    },
    Tabs: {
      itemColor: "#123456",
      itemSelectedColor: "#654321",
      titleFontSize: 16,
    },
    Empty: { opacityImage: 0.6 },
    Statistic: { titleFontSize: 16, contentFontSize: 28 },
    Timeline: {
      itemPaddingBottom: 28,
      tailColor: "#123456",
      dotBorderWidth: 3,
    },
    Descriptions: {
      titleColor: "#123456",
      labelBg: "#fffbe6",
      itemPaddingBottom: 20,
    },
    Radio: { radioSize: 20, dotSize: 10, buttonBg: "#fffbe6" },
    Tag: { defaultBg: "#fffbe6", defaultColor: "#ad6800" },
    Alert: { defaultPadding: "10px 18px", withDescriptionPadding: "18px 26px" },
    Card: { headerFontSize: 18, headerHeight: 64, bodyPadding: 20 },
    Badge: { indicatorHeight: 24, textFontSize: 14 },
    Avatar: { containerSize: 36, containerSizeLG: 48 },
    Input: {
      activeBorderColor: "#123456",
      inputFontSize: 15,
      paddingInline: 18,
    },
    Checkbox: { colorPrimary: "#654321", controlInteractiveSize: 20 },
    Button: {
      primaryColor: "#112233",
      fontWeight: 600,
      contentFontSize: 18,
      paddingInline: 24,
      defaultHoverBg: "#fafafa",
    },
  },
};

export const inputCases: {
  id: string;
  props: import("../../packages/antd-octane/src").InputProps;
}[] = [
  { id: "input-default", props: {} },
  { id: "input-small", props: { size: "small" } },
  { id: "input-large", props: { size: "large" } },
  { id: "input-error", props: { status: "error" } },
  { id: "input-warning", props: { status: "warning" } },
  { id: "input-disabled", props: { disabled: true } },
];
export const checkboxCases = [
  { id: "check-default", props: {} },
  { id: "check-checked", props: { defaultChecked: true } },
  { id: "check-mixed", props: { indeterminate: true } },
  { id: "check-disabled", props: { disabled: true } },
  {
    id: "check-disabled-checked",
    props: { disabled: true, defaultChecked: true },
  },
  {
    id: "check-disabled-mixed",
    props: { disabled: true, indeterminate: true },
  },
];

export const switchCases: {
  id: string;
  props: import("../../packages/antd-octane/src").SwitchProps;
}[] = [
  { id: "switch-off", props: {} },
  { id: "switch-on", props: { checked: true } },
  { id: "switch-small", props: { size: "small", checked: true } },
  { id: "switch-disabled", props: { disabled: true, checked: true } },
  { id: "switch-loading", props: { loading: true } },
];
