/** @jsxImportSource octane */
import type { OctaneNode } from "octane";
import { useContext, useMemo } from "octane";
import warning, {
  devUseWarning,
  WarningContext,
  type WarningContextProps,
} from "./_util/warning";
import {
  type Config,
  type ConfigComponentProps,
  ConfigContext,
  type DirectionType,
  type PopupOverflow,
  type RenderEmptyHandler,
} from "./config-provider/context";
import DisabledContext, {
  DisabledContextProvider,
} from "./config-provider/DisabledContext";
import { registerThemeConfig, setGlobalConfig } from "./config-provider/global";
import MotionWrapper from "./config-provider/MotionWrapper";
import PropWarning from "./config-provider/PropWarning";
import SizeContext, {
  SizeContextProvider,
} from "./config-provider/SizeContext";
import type { Locale } from "./locale";
import { getDesignToken, mergeTheme } from "./theme/resolve";
import type { ThemeConfig } from "./theme/types";

export type { WarningContextProps } from "./_util/warning";
export type {
  ShowWaveEffect,
  WaveComponent,
  WaveConfig,
} from "./_util/wave/interface";
export type {
  ComponentStyleConfig,
  ConfigComponentProps,
  CSPConfig,
  DirectionType,
  PopupContainer,
  PopupOverflow,
  RenderEmptyHandler,
  SizeType,
  TargetContainer,
} from "./config-provider/context";
export interface ConfigProviderProps extends ConfigComponentProps {
  csp?: Config["csp"];
  theme?: ThemeConfig;
  componentSize?: Config["componentSize"];
  componentDisabled?: boolean;
  prefixCls?: string;
  iconPrefixCls?: string;
  direction?: DirectionType;
  virtual?: boolean;
  /** @deprecated Use button.autoInsertSpace instead. */
  autoInsertSpaceInButton?: boolean;
  /** @deprecated Use popupMatchSelectWidth instead. */
  dropdownMatchSelectWidth?: boolean;
  popupMatchSelectWidth?: boolean | number;
  popupOverflow?: PopupOverflow;
  locale?: Locale;
  variant?: Config["variant"];
  renderEmpty?: RenderEmptyHandler;
  getPopupContainer?: Config["getPopupContainer"];
  getTargetContainer?: Config["getTargetContainer"];
  wave?: Config["wave"];
  warning?: WarningContextProps;
  children?: OctaneNode;
}
function InternalConfigProvider(props: ConfigProviderProps) {
  const parent = useContext(ConfigContext);
  registerThemeConfig(!!props.theme);
  // This warning consumes the enclosing provider. PropWarning below consumes
  // this provider's policy, matching upstream ProviderChildren's split.
  const warningFn = devUseWarning("ConfigProvider");
  warningFn(
    !("autoInsertSpaceInButton" in props),
    "deprecated",
    "`autoInsertSpaceInButton` is deprecated. Please use `{ button: { autoInsertSpace: boolean }}` instead.",
  );
  const value = useMemo(() => {
    const theme = mergeTheme(parent.theme, props.theme);
    // Undefined values inherit the enclosing provider, just as upstream's context merge.
    const { children: _children, ...settings } = props;
    const definedSettings = Object.fromEntries(
      Object.entries(settings).filter(([, value]) => value !== undefined),
    );
    const prefixCls = props.prefixCls || parent.prefixCls;
    const config = {
      ...parent,
      ...definedSettings,
      theme,
      token: getDesignToken(theme),
      prefixCls,
      getPrefixCls: (suffix?: string, customPrefix?: string) =>
        customPrefix || (suffix ? `${prefixCls}-${suffix}` : prefixCls),
      componentSize: props.componentSize ?? parent.componentSize,
      componentDisabled: props.componentDisabled ?? parent.componentDisabled,
      csp: props.csp || parent.csp,
      popupOverflow: props.popupOverflow ?? parent.popupOverflow ?? "viewport",
    } as Config;
    const popupMatchSelectWidth =
      props.popupMatchSelectWidth ?? props.dropdownMatchSelectWidth;
    if (popupMatchSelectWidth !== undefined)
      config.popupMatchSelectWidth = popupMatchSelectWidth;
    if (props.autoInsertSpaceInButton !== undefined) {
      config.button = {
        autoInsertSpace: props.autoInsertSpaceInButton,
        ...config.button,
      };
    }
    return config;
  }, [parent, props]);
  return (
    <ConfigContext value={value}>
      <WarningContext value={value.warning ?? {}}>
        <DisabledContextProvider disabled={props.componentDisabled}>
          <SizeContextProvider size={props.componentSize}>
            <MotionWrapper>
              <PropWarning
                dropdownMatchSelectWidth={props.dropdownMatchSelectWidth}
              />
              {props.children}
            </MotionWrapper>
          </SizeContextProvider>
        </DisabledContextProvider>
      </WarningContext>
    </ConfigContext>
  );
}
export function useConfig() {
  const config = useContext(ConfigContext);
  const componentDisabled = useContext(DisabledContext);
  const componentSize = useContext(SizeContext);
  return useMemo(
    () => ({ ...config, componentDisabled, componentSize }),
    [config, componentDisabled, componentSize],
  );
}
function usePublicConfig() {
  const componentDisabled = useContext(DisabledContext);
  const componentSize = useContext(SizeContext);
  return { componentDisabled, componentSize };
}
export const ConfigProvider = Object.assign(InternalConfigProvider, {
  useConfig: usePublicConfig,
  config: setGlobalConfig,
  ConfigContext,
  /** @deprecated Use ConfigProvider.useConfig().componentSize instead. */
  SizeContext,
});
Object.defineProperty(ConfigProvider, "SizeContext", {
  get: () => {
    warning(
      false,
      "ConfigProvider",
      "ConfigProvider.SizeContext is deprecated. Please use `ConfigProvider.useConfig().componentSize` instead.",
    );
    return SizeContext;
  },
});
export function useToken() {
  const config = useConfig();
  return { token: config.token };
}
