import { useConfig } from "../config-provider";
import { resolveComponentAlias } from "../theme/resolve";
import type { ThemeConfig } from "../theme/types";
export function useComponentTokens<
  K extends keyof NonNullable<ThemeConfig["components"]>,
>(name: K) {
  const config = useConfig();
  const token = resolveComponentAlias(config.theme, config.token, name);
  return {
    token,
    component: config.theme.components?.[name],
    base: {
      "--ao-font": token.fontFamily,
      "--ao-text": token.colorText,
      "--ao-muted": token.colorTextDescription,
      "--ao-font-size": `${token.fontSize}px`,
      "--ao-line": token.lineHeight,
      "--ao-bg": token.colorBgContainer,
      "--ao-border": token.colorBorderSecondary,
      "--ao-radius": `${token.borderRadiusLG}px`,
      "--ao-primary": token.colorPrimary,
      "--ao-focus": token.colorPrimaryBorder,
    },
  };
}
