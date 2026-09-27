/** @jsxImportSource octane */
import type { CSSProperties, HTMLAttributes, OctaneNode } from "octane";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useState,
} from "octane";
import type { Breakpoint } from "../_util/responsive";
import { useMediaQuery } from "../_util/responsive";
import { useComponentTokens } from "../_util/tokens";
import { useConfig } from "../config-provider";
export interface LayoutProps extends HTMLAttributes<HTMLDivElement> {
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
  };
}
function InternalLayout({
  hasSider,
  children,
  className,
  style,
  ...rest
}: LayoutProps) {
  const [siders, setSiders] = useState<string[]>([]);
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
        "ant-layout",
        (hasSider ?? siders.length > 0) && "ant-layout-has-sider",
        className,
      ]}
      style={{ ...useLayoutVariables(), ...style }}
    >
      <SiderContext value={register}>{children}</SiderContext>
    </div>
  );
}
function Header({ className, style, ...props }: LayoutProps) {
  return (
    <div
      {...props}
      className={["ant-layout-header", className]}
      style={{ ...useLayoutVariables(), ...style }}
    />
  );
}
function Footer({ className, style, ...props }: LayoutProps) {
  return (
    <div
      {...props}
      className={["ant-layout-footer", className]}
      style={{ ...useLayoutVariables(), ...style }}
    />
  );
}
function Content({ className, style, ...props }: LayoutProps) {
  return (
    <div
      {...props}
      className={["ant-layout-content", className]}
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
  className,
  style,
  children,
  ...rest
}: SiderProps) {
  const register = useContext(SiderContext);
  const id = useId();
  useEffect(() => register?.(id), [register, id]);
  const config = useConfig();
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
  const dimension = typeof actual === "number" ? `${actual}px` : actual;
  return (
    <div
      {...rest}
      className={[
        "ant-layout-sider",
        theme === "light" && "ant-layout-sider-light",
        current && "ant-layout-sider-collapsed",
        className,
      ]}
      style={{
        ...useLayoutVariables(),
        flex: `0 0 ${dimension}`,
        maxWidth: dimension,
        minWidth: dimension,
        width: dimension,
        ...style,
      }}
    >
      <div className="ant-layout-sider-children">{children}</div>
      {collapsible && trigger !== null && (
        <button
          className={[
            "ant-layout-sider-trigger",
            (actual === 0 || actual === "0") && "ant-layout-sider-zero-trigger",
          ]}
          type="button"
          aria-label={current ? "展开侧栏" : "收起侧栏"}
          aria-expanded={!current}
          onClick={() => change(!current, "clickTrigger")}
        >
          {trigger ?? (current !== reverseArrow ? "›" : "‹")}
        </button>
      )}
    </div>
  );
}
export const Layout = Object.assign(InternalLayout, {
  Header,
  Footer,
  Content,
  Sider,
});
