/** @jsxImportSource octane */
import type { OctaneNode } from "octane";
import { createContext, useContext, useMemo } from "octane";
import { getDesignToken, mergeTheme } from "./theme/resolve";
import type { AliasToken, ThemeConfig } from "./theme/types";

interface Config {
  theme: ThemeConfig;
  token: AliasToken;
  componentSize?: "small" | "middle" | "large";
  componentDisabled?: boolean;
}
const ConfigContext = createContext<Config>({
  theme: {},
  token: getDesignToken(),
});
export interface ConfigProviderProps {
  theme?: ThemeConfig;
  componentSize?: Config["componentSize"];
  componentDisabled?: boolean;
  children?: OctaneNode;
}
export function ConfigProvider(props: ConfigProviderProps) {
  const parent = useContext(ConfigContext);
  const value = useMemo(() => {
    const theme = mergeTheme(parent.theme, props.theme);
    return {
      theme,
      token: getDesignToken(theme),
      componentSize: props.componentSize ?? parent.componentSize,
      componentDisabled: props.componentDisabled ?? parent.componentDisabled,
    };
  }, [parent, props.theme, props.componentSize, props.componentDisabled]);
  return <ConfigContext value={value}>{props.children}</ConfigContext>;
}
export function useConfig() {
  return useContext(ConfigContext);
}
export function useToken() {
  const config = useConfig();
  return { token: config.token };
}
