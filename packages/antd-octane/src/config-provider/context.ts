import type { CSSProperties, OctaneNode } from "octane";
import { createContext } from "octane";
import type { WarningContextProps } from "../_util/warning";
import type { WaveConfig } from "../_util/wave/interface";
import type { BadgeProps } from "../badge";
import type { CardProps } from "../card";
import type { CollapseProps } from "../collapse";
import type { DescriptionsProps } from "../descriptions";
import type { EmptyProps } from "../empty";
import type { ImageProps } from "../image";
import type { ListItemProps } from "../list";
import type { Locale } from "../locale";
import enUS from "../locale/en_US";
import type { PopoverProps } from "../popover";
import type { TagProps } from "../tag";
import { getDesignToken } from "../theme/resolve";
import type { AliasToken, ThemeConfig } from "../theme/types";
import type { TooltipProps } from "../tooltip";
import type { TourProps } from "../tour";

export type DirectionType = "ltr" | "rtl";
export type SizeType = "small" | "middle" | "large";
export type PopupOverflow = "viewport" | "scroll";
/** DOM roots accepted by ConfigProvider popup and target container callbacks. */
export type PopupContainer = HTMLElement | ShadowRoot;
export type TargetContainer = HTMLElement | Window | ShadowRoot;

/** Resolve a DOM element for layout calculations when a popup is mounted in a shadow root. */
export function getPopupContainerElement(
  container: PopupContainer | null | undefined,
): HTMLElement {
  if (!container) return document.body;
  if (typeof ShadowRoot !== "undefined" && container instanceof ShadowRoot) {
    return container.host instanceof HTMLElement
      ? container.host
      : document.body;
  }
  return container as HTMLElement;
}

/** Affix and scroll observers need an event target rather than a portal root. */
export function getTargetContainerElement(
  container: TargetContainer | null | undefined,
): HTMLElement | Window | null {
  if (!container) return null;
  if (container === window || container instanceof HTMLElement)
    return container;
  if (typeof ShadowRoot !== "undefined" && container instanceof ShadowRoot)
    return container.host instanceof HTMLElement ? container.host : window;
  return window;
}
export interface CSPConfig {
  nonce?: string;
}
export interface ComponentStyleConfig {
  className?: string;
  style?: CSSProperties;
}
export type RenderEmptyHandler = (componentName?: string) => OctaneNode;

/** Component defaults follow components/config-provider/context.ts in antd 5.29.3. */
export interface ConfigComponentProps {
  dropdown?: ComponentStyleConfig;
  breadcrumb?: ComponentStyleConfig;
  anchor?: ComponentStyleConfig;
  splitter?: ComponentStyleConfig;
  layout?: ComponentStyleConfig;
  col?: ComponentStyleConfig;
  row?: ComponentStyleConfig;
  divider?: ComponentStyleConfig;
  space?: ComponentStyleConfig &
    Pick<import("../space").SpaceProps, "size" | "classNames" | "styles">;
  flex?: ComponentStyleConfig & Pick<import("../flex").FlexProps, "vertical">;
  button?: ComponentStyleConfig &
    Pick<
      import("../button").ButtonProps,
      "variant" | "color" | "autoInsertSpace"
    >;
  checkbox?: ComponentStyleConfig;
  radio?: ComponentStyleConfig;
  select?: ComponentStyleConfig;
  form?: ComponentStyleConfig & { colon?: boolean };
  alert?: ComponentStyleConfig &
    Pick<import("../alert").AlertProps, "closeIcon" | "closable">;
  affix?: ComponentStyleConfig;
  progress?: ComponentStyleConfig;
  result?: ComponentStyleConfig;
  skeleton?: ComponentStyleConfig;
  spin?: ComponentStyleConfig & Pick<import("../spin").SpinProps, "indicator">;
  message?: ComponentStyleConfig;
  notification?: ComponentStyleConfig & { closeIcon?: OctaneNode };
  modal?: ComponentStyleConfig &
    Pick<
      import("../modal").ModalProps,
      "closeIcon" | "closable" | "centered" | "styles" | "classNames"
    >;
  drawer?: ComponentStyleConfig &
    Pick<
      import("../drawer").DrawerProps,
      "closeIcon" | "closable" | "styles" | "classNames"
    >;
  popconfirm?: Pick<
    import("../popconfirm").PopconfirmProps,
    "className" | "style" | "styles" | "classNames"
  >;
  avatar?: ComponentStyleConfig;
  badge?: ComponentStyleConfig & Pick<BadgeProps, "classNames" | "styles">;
  calendar?: ComponentStyleConfig;
  card?: ComponentStyleConfig &
    Pick<CardProps, "classNames" | "styles" | "variant">;
  carousel?: ComponentStyleConfig;
  collapse?: ComponentStyleConfig & Pick<CollapseProps, "expandIcon">;
  descriptions?: ComponentStyleConfig &
    Pick<DescriptionsProps, "classNames" | "styles">;
  empty?: ComponentStyleConfig &
    Pick<EmptyProps, "classNames" | "styles" | "image">;
  image?: ComponentStyleConfig & {
    fallback?: ImageProps["fallback"];
    preview?: { closeIcon?: OctaneNode };
  };
  list?: ComponentStyleConfig & {
    item?: Pick<ListItemProps, "classNames" | "styles">;
  };
  popover?: Pick<PopoverProps, "className" | "style" | "styles" | "classNames">;
  segmented?: ComponentStyleConfig;
  statistic?: ComponentStyleConfig;
  table?: ComponentStyleConfig & {
    expandable?: {
      expandIcon?: import("../table/types").ExpandableConfig<
        Record<string, unknown>
      >["expandIcon"];
    };
  };
  tag?: ComponentStyleConfig & Pick<TagProps, "closable" | "closeIcon">;
  timeline?: ComponentStyleConfig;
  tooltip?: Pick<TooltipProps, "className" | "style" | "styles" | "classNames">;
  tour?: Pick<TourProps, "closeIcon">;
  tree?: ComponentStyleConfig;
}

export interface Config extends ConfigComponentProps {
  csp?: CSPConfig;
  theme: ThemeConfig;
  token: AliasToken;
  prefixCls: string;
  iconPrefixCls?: string;
  getPrefixCls: (suffix?: string, customPrefix?: string) => string;
  direction: DirectionType;
  virtual?: boolean;
  autoInsertSpaceInButton?: boolean;
  popupMatchSelectWidth?: boolean | number;
  popupOverflow?: PopupOverflow;
  locale: Locale;
  variant?: "outlined" | "borderless" | "filled" | "underlined";
  renderEmpty?: RenderEmptyHandler;
  getPopupContainer?: (triggerNode?: HTMLElement) => PopupContainer;
  getTargetContainer?: () => TargetContainer;
  componentSize?: SizeType;
  componentDisabled?: boolean;
  wave?: WaveConfig;
  warning?: WarningContextProps;
}

export const defaultPrefixCls = "ant";
export const ConfigContext = createContext<Config>({
  theme: {},
  token: getDesignToken(),
  prefixCls: defaultPrefixCls,
  getPrefixCls: (suffix, customPrefix) =>
    customPrefix || (suffix ? `ant-${suffix}` : "ant"),
  direction: "ltr",
  popupOverflow: "viewport",
  locale: enUS,
});
