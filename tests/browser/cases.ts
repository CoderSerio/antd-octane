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
