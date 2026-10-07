/** @jsxImportSource octane */
import type { CSSProperties, HTMLAttributes, OctaneNode } from "octane";
import { Children, isValidElement } from "octane";
import { componentClassName } from "../_util/componentClassName";
import { CheckOutlined, CloseOutlined } from "../_util/feedback-icons";
import { useBreakpoint } from "../_util/responsive";
import { useComponentTokens } from "../_util/tokens";
import { useConfig } from "../config-provider";
import { Progress } from "../progress";
import { Tooltip } from "../tooltip";
export type StepStatus = "wait" | "process" | "finish" | "error";
export interface StepItem {
  key?: string | number;
  title?: OctaneNode;
  subTitle?: OctaneNode;
  description?: OctaneNode;
  icon?: OctaneNode;
  status?: StepStatus;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
  onClick?: (event: MouseEvent) => void;
}
export interface StepsProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  items?: StepItem[];
  type?: "default" | "navigation" | "inline";
  prefixCls?: string;
  rootClassName?: string;
  progressDot?:
    | boolean
    | ((
        dot: OctaneNode,
        info: {
          index: number;
          status: StepStatus;
          title?: OctaneNode;
          description?: OctaneNode;
        },
      ) => OctaneNode);
  percent?: number;
  current?: number;
  initial?: number;
  status?: StepStatus;
  size?: "default" | "small";
  direction?: "horizontal" | "vertical";
  responsive?: boolean;
  labelPlacement?: "horizontal" | "vertical";
  onChange?: (current: number) => void;
  style?: CSSProperties;
}
function Step(_props: StepItem) {
  return null;
}
export function Steps({
  items: customItems,
  children,
  type = "default",
  prefixCls: customPrefix,
  rootClassName,
  progressDot = false,
  percent,
  current = 0,
  initial = 0,
  status = "process",
  size: customSize,
  direction = "horizontal",
  responsive = true,
  labelPlacement = "horizontal",
  onChange,
  className,
  style,
  ...rest
}: StepsProps) {
  const config = useConfig();
  const size =
    customSize ?? (config.componentSize === "small" ? "small" : "default");
  const prefixCls = config.getPrefixCls("steps", customPrefix);
  const cls = (suffix = "") =>
    componentClassName("ant-steps", prefixCls, suffix);
  const legacyItems: StepItem[] = [];
  Children.forEach(children, (child) => {
    if (isValidElement<StepItem>(child) && child.type === Step)
      legacyItems.push(child.props);
  });
  const items = customItems ?? legacyItems;
  const inline = type === "inline";
  const dot = inline || progressDot;
  const labelsVertical = !!dot || labelPlacement === "vertical";
  const { token: t, component: c, base } = useComponentTokens("Steps");
  const screens = useBreakpoint(responsive);
  const vertical =
    !inline &&
    (direction === "vertical" || (responsive && screens.xs === true));
  return (
    <div
      {...rest}
      className={[
        cls(),
        cls(vertical ? "-vertical" : "-horizontal"),
        !inline && cls(`-${size}`),
        labelsVertical && !vertical && cls("-label-vertical"),
        !!dot && cls("-dot"),
        type !== "default" && cls(`-${type}`),
        !inline && percent !== undefined && cls("-with-progress"),
        config.direction === "rtl" && cls("-rtl"),
        config.steps?.className,
        className,
        rootClassName,
      ]}
      style={{
        ...base,
        "--ao-steps-icon": `${size === "small" ? (c?.iconSizeSM ?? t.fontSizeHeading3) : (c?.iconSize ?? t.controlHeight)}px`,
        "--ao-steps-title": `${size === "small" ? t.fontSize : t.fontSizeLG}px`,
        "--ao-steps-title-line": `${size === "small" ? (c?.iconSizeSM ?? t.fontSizeHeading3) : t.controlHeight}px`,
        "--ao-steps-icon-font": `${size === "small" ? t.fontSizeSM : t.fontSize}px`,
        "--ao-steps-custom-size": `${size === "small" ? (c?.iconSizeSM ?? t.fontSizeHeading3) : (c?.customIconSize ?? t.controlHeight)}px`,
        "--ao-steps-custom-font": `${size === "small" ? (c?.iconSizeSM ?? t.fontSizeHeading3) : (c?.customIconFontSize ?? t.controlHeightSM)}px`,
        "--ao-steps-custom-top": `${c?.customIconTop ?? 0}px`,
        "--ao-steps-gap": `${size === "small" ? t.paddingSM : t.margin}px`,
        "--ao-steps-vertical-gap": `${t.margin}px`,
        "--ao-steps-control-height": `${t.controlHeight}px`,
        "--ao-steps-control-height-lg": `${t.controlHeightLG}px`,
        "--ao-steps-xs": `${t.marginXS}px`,
        "--ao-steps-sm": `${t.paddingSM}px`,
        "--ao-steps-lg": `${t.paddingLG}px`,
        "--ao-steps-xxs": `${t.marginXXS}px`,
        "--ao-steps-padding-xs": `${t.paddingXS}px`,
        "--ao-steps-inline-top": `${t.paddingXS + t.lineWidth}px`,
        "--ao-steps-inline-font": `${t.fontSizeSM}px`,
        "--ao-steps-inline-line": t.lineHeightSM,
        "--ao-steps-label-width": `${t.controlHeightLG * 2 + (c?.iconSize ?? t.controlHeight)}px`,
        "--ao-steps-label-gap": `${t.marginSM}px`,
        "--ao-steps-progress-padding": `${t.paddingXXS}px`,
        "--ao-steps-description": `${c?.descriptionMaxWidth ?? 140}px`,
        "--ao-steps-wait": t.colorFillContent,
        "--ao-steps-dot-wait": t.colorTextDisabled,
        "--ao-steps-primary-bg": t.colorPrimaryBg,
        "--ao-steps-error": t.colorError,
        "--ao-steps-error-bg": t.colorErrorBg,
        "--ao-steps-light": t.colorTextLightSolid,
        "--ao-steps-dot": `${c?.dotSize ?? t.controlHeight / 4}px`,
        "--ao-steps-dot-current": `${c?.dotCurrentSize ?? t.controlHeightLG / 4}px`,
        "--ao-steps-nav-arrow": c?.navArrowColor ?? t.colorTextDisabled,
        "--ao-steps-nav-content": `${c?.navContentMaxWidth ?? "unset"}`,
        "--ao-steps-inline-dot": `${c?.inlineDotSize ?? 6}px`,
        "--ao-steps-inline-title": c?.inlineTitleColor ?? t.colorTextDisabled,
        "--ao-steps-inline-tail": c?.inlineTailColor ?? t.colorSplit,
        direction: config.direction,
        ...config.steps?.style,
        ...style,
      }}
    >
      {items.map((item, index) => {
        const step = index + initial;
        const state =
          item.status ??
          (step === current ? status : step < current ? "finish" : "wait");
        const dotNode = <span className={cls("-icon-dot")} />;
        const baseIcon = (
          <span className={cls("-icon")}>
            {dot
              ? typeof dot === "function"
                ? dot(dotNode, {
                    index: step,
                    status: state,
                    title: item.title,
                    description: item.description,
                  })
                : dotNode
              : (item.icon ??
                (state === "finish" ? (
                  <CheckOutlined />
                ) : state === "error" ? (
                  <CloseOutlined />
                ) : (
                  step + 1
                )))}
          </span>
        );
        const iconNode =
          !inline && state === "process" && percent !== undefined ? (
            <span className={cls("-progress-icon")}>
              <Progress
                type="circle"
                percent={percent}
                size={size === "small" ? 32 : 40}
                strokeWidth={4}
                format={() => null}
              />
              {baseIcon}
            </span>
          ) : (
            baseIcon
          );
        const content = (
          <>
            <span className={cls("-item-tail")} />
            <span className={cls("-item-icon")}>{iconNode}</span>
            <span className="ant-steps-item-content">
              <span className="ant-steps-item-title">
                {item.title}
                {!inline && item.subTitle !== undefined && (
                  <span className="ant-steps-item-subtitle">
                    {item.subTitle}
                  </span>
                )}
              </span>
              {item.description !== undefined && (
                <span className="ant-steps-item-description">
                  {item.description}
                </span>
              )}
            </span>
          </>
        );
        const node = (
          <div
            key={item.key ?? index}
            className={[
              "ant-steps-item",
              inline && index === 0 && "ant-steps-item-first",
              inline && index === items.length - 1 && "ant-steps-item-last",
              `ant-steps-item-${state}`,
              item.disabled && "ant-steps-item-disabled",
              item.icon !== undefined && "ant-steps-item-custom",
              item.className,
              step === current && "ant-steps-item-active",
              status === "error" &&
                index === current - 1 &&
                "ant-steps-next-error",
            ]}
            style={item.style}
            aria-current={step === current ? "step" : undefined}
          >
            {onChange ? (
              <button
                className="ant-steps-item-container"
                type="button"
                disabled={item.disabled}
                onClick={(event) => {
                  item.onClick?.(event);
                  if (step !== current) onChange(step);
                }}
              >
                {content}
              </button>
            ) : (
              // biome-ignore lint/a11y/noStaticElementInteractions lint/a11y/useKeyWithClickEvents: Preserve antd Step's optional pointer callback without changing a passive step into a navigation control.
              <div className="ant-steps-item-container" onClick={item.onClick}>
                {content}
              </div>
            )}
          </div>
        );
        return inline && item.description ? (
          <Tooltip key={item.key ?? index} title={item.description}>
            {node}
          </Tooltip>
        ) : (
          node
        );
      })}
    </div>
  );
}
Steps.Step = Step;
