import type { OctaneNode } from "octane";
import warning from "../_util/warning";
import type { ThemeConfig } from "../theme/types";
import { type LegacyTheme, registerTheme } from "./cssVariables";
export interface GlobalConfig {
  prefixCls?: string;
  iconPrefixCls?: string;
  holderRender?: (children: OctaneNode) => OctaneNode;
  theme?: ThemeConfig | LegacyTheme;
}
type HolderConfig = Omit<GlobalConfig, "theme"> & { theme?: ThemeConfig };
let globalConfig: HolderConfig = {};
let existThemeConfig = false;
export function registerThemeConfig(configured: boolean) {
  existThemeConfig ||= configured;
}
export function warnContext(component: string) {
  warning(
    !existThemeConfig,
    component,
    "Static function can not consume context like dynamic theme. Please use 'App' component instead.",
  );
}
export function setGlobalConfig(config: GlobalConfig) {
  const next = { ...globalConfig };
  if (config.prefixCls !== undefined) next.prefixCls = config.prefixCls;
  if (config.iconPrefixCls !== undefined)
    next.iconPrefixCls = config.iconPrefixCls;
  if ("holderRender" in config) next.holderRender = config.holderRender;
  if (config.theme) {
    if (Object.keys(config.theme).some((key) => key.endsWith("Color"))) {
      warning(
        false,
        "ConfigProvider",
        "`config` of css variable theme is not work in v5. Please use new `theme` config instead.",
      );
      registerTheme(next.prefixCls || "ant", config.theme as LegacyTheme);
    } else next.theme = config.theme as ThemeConfig;
  }
  globalConfig = next;
}
export function getGlobalConfig() {
  return {
    ...globalConfig,
    prefixCls: globalConfig.prefixCls || "ant",
    iconPrefixCls: globalConfig.iconPrefixCls || "anticon",
  };
}
