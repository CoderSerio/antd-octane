/** @jsxImportSource octane */
import type { CSSProperties, HTMLAttributes, OctaneNode, Ref } from "octane";
import {
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  useState,
} from "octane";
import cssSize from "../_util/css-size";
import { useComponentTokens } from "../_util/tokens";
import { useConfig } from "../config-provider";
import { type BadgeRibbonProps, Ribbon } from "./ribbon";
import ScrollNumber from "./ScrollNumber";

export type { ScrollNumberProps } from "./ScrollNumber";

export type { BadgeRibbonProps };

const presetColors = [
  "blue",
  "purple",
  "cyan",
  "green",
  "magenta",
  "pink",
  "red",
  "orange",
  "yellow",
  "volcano",
  "geekblue",
  "lime",
  "gold",
] as const;
type PresetColor = (typeof presetColors)[number];
const isPresetColor = (color: string): color is PresetColor =>
  presetColors.includes(color as PresetColor);

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  ref?: Ref<HTMLSpanElement>;
  count?: OctaneNode;
  showZero?: boolean;
  overflowCount?: number;
  dot?: boolean;
  prefixCls?: string;
  scrollNumberPrefixCls?: string;
  status?: "success" | "processing" | "default" | "error" | "warning";
  text?: OctaneNode;
  color?: string;
  size?: "default" | "small";
  offset?: [number | string, number | string];
  style?: CSSProperties;
  rootClassName?: string;
  classNames?: { root?: string; indicator?: string };
  styles?: { root?: CSSProperties; indicator?: CSSProperties };
}

function InternalBadge({
  ref,
  count,
  showZero = false,
  overflowCount = 99,
  dot = false,
  prefixCls,
  scrollNumberPrefixCls,
  status,
  text,
  color,
  size = "default",
  offset,
  title,
  children,
  className,
  rootClassName,
  classNames,
  styles,
  style,
  ...rest
}: BadgeProps) {
  const config = useConfig();
  const { token: t, component: c, base } = useComponentTokens("Badge");
  const badgeContext = config.badge;
  const prefix = config.getPrefixCls("badge", prefixCls);
  const scrollPrefix = config.getPrefixCls(
    "scroll-number",
    scrollNumberPrefixCls,
  );
  const hasChildren = Boolean(children);
  // The upstream comparison also coerces numeric strings before applying the cap.
  const display =
    (count as number) > overflowCount ? `${overflowCount}+` : (count ?? null);
  const isZero = display === 0 || display === "0" || text === 0 || text === "0";
  const showAsDot = dot && !isZero;
  const mergedCount = showAsDot ? "" : display;
  const isHidden =
    (((mergedCount === null ||
      mergedCount === undefined ||
      mergedCount === "") &&
      (text === undefined || text === null || text === "")) ||
      (isZero && !showZero)) &&
    !showAsDot;
  const ignoreCount =
    count === null || count === undefined || (isZero && !showZero);
  const hasStatus =
    Boolean(
      (status !== undefined && status !== null) ||
        (color !== undefined && color !== null),
    ) && ignoreCount;
  const hasStatusValue = (status !== undefined && status !== null) || !isZero;
  const standaloneStatus =
    !hasChildren &&
    hasStatus &&
    Boolean(text || hasStatusValue || !ignoreCount);
  const textVisible =
    !isHidden && (text === 0 ? showZero : Boolean(text) && text !== true);

  // Keep the last visible number and dot shape while the indicator leaves.
  const countRef = useRef(count);
  const displayCountRef = useRef(mergedCount);
  const dotRef = useRef(showAsDot);
  if (!isHidden) {
    countRef.current = count;
    displayCountRef.current = mergedCount;
    dotRef.current = showAsDot;
  }
  const livingCount = countRef.current;
  const displayCount = displayCountRef.current;
  const isDot = dotRef.current;
  const [present, setPresent] = useState(!isHidden);
  const [phase, setPhase] = useState<"enter" | "leave" | undefined>();
  const previousVisible = useRef(!isHidden);
  useEffect(() => {
    const visible = !isHidden;
    if (visible === previousVisible.current) return;
    previousVisible.current = visible;
    const duration = t.motion
      ? Number.parseFloat(t.motionDurationSlow) * 1000
      : 0;
    setPhase(t.motion ? (visible ? "enter" : "leave") : undefined);
    if (visible) setPresent(true);
    const timer = setTimeout(
      () => {
        setPhase(undefined);
        if (!visible) setPresent(false);
      },
      Number.isFinite(duration) ? duration : 300,
    );
    return () => clearTimeout(timer);
  }, [isHidden, t.motion, t.motionDurationSlow]);

  const statusColor = status
    ? {
        success: t.colorSuccess,
        processing: t.colorInfo,
        default: t.colorTextPlaceholder,
        error: t.colorError,
        warning: t.colorWarning,
      }[status]
    : undefined;
  const customColor =
    color && isPresetColor(color)
      ? (t[`${color}6` as keyof typeof t] as string | undefined)
      : color;
  const indicatorHeight =
    size === "small"
      ? (c?.indicatorHeightSM ?? t.fontSize)
      : (c?.indicatorHeight ??
        Math.round(t.fontSize * t.lineHeight) - 2 * t.lineWidth);
  const rootStyle: CSSProperties &
    Record<`--${string}`, string | number | undefined> = {
    ...base,
    direction: config.direction,
    "--ao-badge-height": cssSize(
      isDot || standaloneStatus
        ? standaloneStatus
          ? (c?.statusSize ?? t.fontSizeSM / 2)
          : (c?.dotSize ?? t.fontSizeSM / 2)
        : indicatorHeight,
    ),
    "--ao-badge-scroll-height": cssSize(
      c?.indicatorHeight ??
        Math.round(t.fontSize * t.lineHeight) - 2 * t.lineWidth,
    ),
    "--ao-badge-animation": t.motion
      ? "ao-badge-pulse 1.2s ease-in-out infinite"
      : "none",
    "--ao-badge-bg":
      customColor ?? (hasStatus ? statusColor : undefined) ?? t.colorError,
    "--ao-badge-hover": customColor ?? t.colorErrorHover,
    "--ao-badge-text": t.colorTextLightSolid,
    "--ao-badge-size": `${size === "small" ? (c?.textFontSizeSM ?? t.fontSizeSM) : (c?.textFontSize ?? t.fontSizeSM)}px`,
    "--ao-badge-padding": `${t.paddingXS}px`,
    "--ao-badge-text-margin": `${t.marginXS}px`,
    "--ao-badge-weight": c?.textFontWeight ?? "normal",
    "--ao-badge-z": c?.indicatorZIndex ?? "auto",
    "--ao-badge-shadow": t.colorBorderBg,
    "--ao-badge-shadow-size": `${t.lineWidth}px`,
    "--ao-badge-duration": t.motion ? t.motionDurationSlow : "0s",
    "--ao-badge-mid-duration": t.motion ? t.motionDurationMid : "0s",
    "--ao-badge-ease": t.motionEaseOutBack,
  };
  const offsetStyle: CSSProperties = offset
    ? {
        marginTop: offset[1],
        ...(config.direction === "rtl"
          ? { left: Number.parseInt(String(offset[0]), 10) }
          : { right: -Number.parseInt(String(offset[0]), 10) }),
      }
    : {};
  const mergedStyle = { ...offsetStyle, ...badgeContext?.style, ...style };
  const indicatorStyle: CSSProperties = {
    ...styles?.indicator,
    ...badgeContext?.styles?.indicator,
    ...mergedStyle,
    ...(color && !isPresetColor(color) ? { background: color } : {}),
  };
  const rootClass = [
    prefix,
    prefix !== "ant-badge" && "ant-badge",
    hasStatus && `${prefix}-status`,
    hasStatus && prefix !== "ant-badge" && "ant-badge-status",
    !hasChildren && `${prefix}-not-a-wrapper`,
    !hasChildren && "ant-badge-standalone",
    config.direction === "rtl" && `${prefix}-rtl`,
    config.direction === "rtl" && "ant-badge-rtl",
    className,
    rootClassName,
    badgeContext?.className,
    badgeContext?.classNames?.root,
    classNames?.root,
  ];
  const statusClass = [
    classNames?.indicator,
    badgeContext?.classNames?.indicator,
    hasStatus && `${prefix}-status-dot`,
    hasStatus && "ant-badge-status-dot",
    status && `${prefix}-status-${status}`,
    status && `ant-badge-status-${status}`,
    color && isPresetColor(color) && `${prefix}-color-${color}`,
  ];
  const titleNode =
    title ??
    (typeof livingCount === "string" || typeof livingCount === "number"
      ? livingCount
      : undefined);
  const displayNode = isValidElement<{ style?: CSSProperties }>(livingCount)
    ? cloneElement(livingCount, {
        style: { ...mergedStyle, ...livingCount.props.style },
      })
    : undefined;

  if (standaloneStatus) {
    return (
      <span
        {...rest}
        ref={ref}
        className={rootClass}
        style={{
          ...rootStyle,
          ...styles?.root,
          ...badgeContext?.styles?.root,
          ...mergedStyle,
        }}
      >
        <span
          className={statusClass}
          style={{
            ...styles?.indicator,
            ...badgeContext?.styles?.indicator,
            ...(color && !isPresetColor(color)
              ? { color, background: color }
              : {}),
          }}
        />
        {textVisible && (
          <span
            className={[`${prefix}-status-text`, "ant-badge-status-text"]}
            style={{ color: mergedStyle.color }}
          >
            {text}
          </span>
        )}
      </span>
    );
  }
  return (
    <span
      {...rest}
      ref={ref}
      className={rootClass}
      style={{ ...rootStyle, ...badgeContext?.styles?.root, ...styles?.root }}
    >
      {children}
      {(!isHidden || present) && (
        <ScrollNumber
          prefixCls={scrollPrefix}
          show={!isHidden}
          count={displayCount}
          title={titleNode}
          motion={t.motion}
          style={indicatorStyle}
          motionClassName={phase ? `ant-badge-zoom-${phase}` : undefined}
          className={[
            `${prefix}-indicator`,
            "ant-badge-indicator",
            !isDot && `${prefix}-count`,
            !isDot && "ant-badge-count",
            size === "small" && `${prefix}-count-sm`,
            size === "small" && "ant-badge-count-sm",
            !isDot &&
              displayCount &&
              String(displayCount).length > 1 &&
              `${prefix}-multiple-words`,
            !isDot &&
              displayCount &&
              String(displayCount).length > 1 &&
              "ant-badge-multiple",
            isDot && `${prefix}-dot`,
            isDot && "ant-badge-dot",
            status && `${prefix}-status-${status}`,
            status && `ant-badge-status-${status}`,
            color && isPresetColor(color) && `${prefix}-color-${color}`,
            classNames?.indicator,
            badgeContext?.classNames?.indicator,
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {displayNode}
        </ScrollNumber>
      )}
      {textVisible && (
        <span className={[`${prefix}-status-text`, "ant-badge-status-text"]}>
          {text}
        </span>
      )}
    </span>
  );
}

export const Badge = Object.assign(InternalBadge, { Ribbon });
