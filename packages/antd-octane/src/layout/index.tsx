/** @jsxImportSource octane */
import type { CSSProperties, HTMLAttributes, OctaneNode, Ref } from "octane";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useState,
} from "octane";
import { componentClassName } from "../_util/componentClassName";
import {
  BarsOutlined,
  LeftOutlined,
  RightOutlined,
} from "../_util/layout-icons";
import type { Breakpoint } from "../_util/responsive";
import { useMediaQuery } from "../_util/responsive";
import { useComponentTokens } from "../_util/tokens";
import { useConfig } from "../config-provider";
import { SiderCollapseContext } from "./context";
export interface LayoutProps<T extends HTMLElement = HTMLElement>
  extends HTMLAttributes<T> {
  ref?: Ref<T>;
  prefixCls?: string;
  rootClassName?: string;
  hasSider?: boolean;
  style?: CSSProperties;
}
const SiderContext = createContext<((id: string) => () => void) | null>(null);
function useLayoutVariables() {
  const { token: t, base } = useComponentTokens("Layout");
  const c = useConfig().theme.components?.Layout;
  return {
    ...base,
    "--ao-layout-bg": c?.bodyBg ?? t.colorBgLayout,
    "--ao-layout-header-bg": c?.headerBg ?? "#001529",
    "--ao-layout-header-color": c?.headerColor ?? t.colorText,
    "--ao-layout-header-height": `${c?.headerHeight ?? t.controlHeight * 2}px`,
    "--ao-layout-header-padding":
      c?.headerPadding ?? `0 ${t.controlHeightLG * 1.25}px`,
    "--ao-layout-footer-bg": c?.footerBg ?? t.colorBgLayout,
    "--ao-layout-footer-padding":
      c?.footerPadding ??
      `${t.controlHeightSM}px ${t.controlHeightLG * 1.25}px`,
    "--ao-layout-sider-bg": c?.siderBg ?? "#001529",
    "--ao-layout-light-bg": c?.lightSiderBg ?? t.colorBgContainer,
    "--ao-layout-trigger-bg": c?.triggerBg ?? "#002140",
    "--ao-layout-trigger-color": c?.triggerColor ?? t.colorTextLightSolid,
    "--ao-layout-light-trigger-bg": c?.lightTriggerBg ?? t.colorBgContainer,
    "--ao-layout-light-trigger-color": c?.lightTriggerColor ?? t.colorText,
    "--ao-layout-trigger-height": `${c?.triggerHeight ?? t.controlHeightLG + t.marginXXS * 2}px`,
    "--ao-layout-zero-trigger-width": `${c?.zeroTriggerWidth ?? t.controlHeightLG}px`,
    "--ao-layout-zero-trigger-height": `${c?.zeroTriggerHeight ?? t.controlHeightLG}px`,
    "--ao-layout-zero-trigger-font-size": `${t.fontSizeXL}px`,
  };
}
function InternalLayout({
  hasSider,
  children,
  className,
  prefixCls: customPrefixCls,
  rootClassName,
  style,
  ...rest
}: LayoutProps<HTMLDivElement>) {
  const [siders, setSiders] = useState<string[]>([]);
  const config = useConfig();
  const prefixCls = config.getPrefixCls("layout", customPrefixCls);
  const register = useCallback((id: string) => {
    setSiders((previous) =>
      previous.includes(id) ? previous : [...previous, id],
    );
    return () =>
      setSiders((previous) => previous.filter((item) => item !== id));
  }, []);
  return (
    <div
      {...rest}
      className={[
        componentClassName("ant-layout", prefixCls),
        (hasSider ?? siders.length > 0) &&
          componentClassName("ant-layout", prefixCls, "-has-sider"),
        config.direction === "rtl" &&
          componentClassName("ant-layout", prefixCls, "-rtl"),
        config.layout?.className,
        className,
        rootClassName,
      ]}
      style={{
        ...useLayoutVariables(),
        direction: config.direction,
        ...config.layout?.style,
        ...style,
      }}
    >
      <SiderContext value={register}>{children}</SiderContext>
    </div>
  );
}
function Header({
  className,
  style,
  prefixCls: customPrefixCls,
  rootClassName,
  hasSider: _hasSider,
  ...props
}: LayoutProps) {
  const prefixCls =
    customPrefixCls ?? `${useConfig().getPrefixCls("layout")}-header`;
  return (
    <header
      {...props}
      className={[
        componentClassName("ant-layout-header", prefixCls),
        className,
        rootClassName,
      ]}
      style={{ ...useLayoutVariables(), ...style }}
    />
  );
}
function Footer({
  className,
  style,
  prefixCls: customPrefixCls,
  rootClassName,
  hasSider: _hasSider,
  ...props
}: LayoutProps) {
  const prefixCls =
    customPrefixCls ?? `${useConfig().getPrefixCls("layout")}-footer`;
  return (
    <footer
      {...props}
      className={[
        componentClassName("ant-layout-footer", prefixCls),
        className,
        rootClassName,
      ]}
      style={{ ...useLayoutVariables(), ...style }}
    />
  );
}
function Content({
  className,
  style,
  prefixCls: customPrefixCls,
  rootClassName,
  hasSider: _hasSider,
  ...props
}: LayoutProps) {
  const prefixCls =
    customPrefixCls ?? `${useConfig().getPrefixCls("layout")}-content`;
  return (
    <main
      {...props}
      className={[
        componentClassName("ant-layout-content", prefixCls),
        className,
        rootClassName,
      ]}
      style={{ ...useLayoutVariables(), ...style }}
    />
  );
}
export interface SiderProps extends Omit<LayoutProps, "hasSider"> {
  width?: number | string;
  collapsedWidth?: number | string;
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  collapsible?: boolean;
  trigger?: OctaneNode;
  reverseArrow?: boolean;
  theme?: "light" | "dark";
  breakpoint?: Breakpoint;
  onCollapse?: (
    collapsed: boolean,
    type: "clickTrigger" | "responsive",
  ) => void;
  onBreakpoint?: (broken: boolean) => void;
  zeroWidthTriggerStyle?: CSSProperties;
}
function Sider({
  width = 200,
  collapsedWidth = 80,
  collapsed,
  defaultCollapsed = false,
  collapsible = false,
  trigger,
  reverseArrow = false,
  theme = "dark",
  breakpoint,
  onCollapse,
  onBreakpoint,
  zeroWidthTriggerStyle,
  prefixCls: customPrefixCls,
  rootClassName,
  className,
  style,
  children,
  ...rest
}: SiderProps) {
  const register = useContext(SiderContext);
  const id = useId();
  useEffect(() => register?.(id), [register, id]);
  const config = useConfig();
  const prefixCls = config.getPrefixCls("layout-sider", customPrefixCls);
  const thresholds = {
    xs: config.token.screenXS,
    sm: config.token.screenSM,
    md: config.token.screenMD,
    lg: config.token.screenLG,
    xl: config.token.screenXL,
    xxl: config.token.screenXXL,
  };
  const broken = useMediaQuery(
    breakpoint ? `(max-width: ${thresholds[breakpoint] - 0.02}px)` : undefined,
  );
  const [inner, setInner] = useState(defaultCollapsed);
  const current = collapsed ?? inner;
  const change = (next: boolean, type: "clickTrigger" | "responsive") => {
    if (collapsed === undefined) setInner(next);
    onCollapse?.(next, type);
  };
  const matched = broken === undefined ? undefined : !broken;
  useEffect(() => {
    if (matched === undefined) return;
    const broken = !matched;
    onBreakpoint?.(broken);
    if (broken !== current) change(broken, "responsive");
  }, [matched]);
  const actual = current ? collapsedWidth : width;
  const dimension = Number.isFinite(Number(actual))
    ? `${actual}px`
    : String(actual);
  const zeroWidth = Number.parseFloat(String(collapsedWidth)) === 0;
  const showTrigger =
    trigger !== null && (collapsible || (broken && zeroWidth));
  const reverseIcon = (config.direction === "rtl") === !reverseArrow;
  const DefaultIcon = current
    ? reverseIcon
      ? LeftOutlined
      : RightOutlined
    : reverseIcon
      ? RightOutlined
      : LeftOutlined;
  return (
    <aside
      {...rest}
      className={[
        componentClassName("ant-layout-sider", prefixCls),
        componentClassName("ant-layout-sider", prefixCls, `-${theme}`),
        current &&
          componentClassName("ant-layout-sider", prefixCls, "-collapsed"),
        collapsible &&
          trigger !== null &&
          !zeroWidth &&
          componentClassName("ant-layout-sider", prefixCls, "-has-trigger"),
        broken && componentClassName("ant-layout-sider", prefixCls, "-below"),
        Number.parseFloat(dimension) === 0 &&
          componentClassName("ant-layout-sider", prefixCls, "-zero-width"),
        className,
        rootClassName,
      ]}
      style={{
        ...useLayoutVariables(),
        direction: config.direction,
        ...style,
        flex: `0 0 ${dimension}`,
        maxWidth: dimension,
        minWidth: dimension,
        width: dimension,
      }}
    >
      <div
        className={componentClassName(
          "ant-layout-sider",
          prefixCls,
          "-children",
        )}
      >
        <SiderCollapseContext value={current}>{children}</SiderCollapseContext>
      </div>
      {showTrigger && (
        <button
          className={[
            zeroWidth
              ? componentClassName(
                  "ant-layout-sider",
                  prefixCls,
                  "-zero-width-trigger",
                )
              : componentClassName("ant-layout-sider", prefixCls, "-trigger"),
            zeroWidth &&
              componentClassName(
                "ant-layout-sider",
                prefixCls,
                `-zero-width-trigger-${reverseArrow ? "right" : "left"}`,
              ),
          ]}
          style={zeroWidth ? zeroWidthTriggerStyle : { width: dimension }}
          type="button"
          aria-label={current ? "展开侧栏" : "收起侧栏"}
          aria-expanded={!current}
          onClick={() => change(!current, "clickTrigger")}
        >
          {trigger || (zeroWidth ? <BarsOutlined /> : <DefaultIcon />)}
        </button>
      )}
    </aside>
  );
}
export const Layout = Object.assign(InternalLayout, {
  Header,
  Footer,
  Content,
  Sider,
});
