/** @jsxImportSource octane */
import { FastColor } from "@ant-design/fast-color";
import type { CSSProperties, HTMLAttributes, OctaneNode, Ref } from "octane";
import {
  cloneElement,
  isValidElement,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "octane";
import { devUseWarning } from "../_util/warning";
import useWave from "../_util/wave/useWave";
import { useConfig } from "../config-provider";
import CheckableTag from "./CheckableTag";
import { getClosable } from "./closable";

export type { CheckableTagProps } from "./CheckableTag";

import { useComponentTokens } from "../_util/tokens";

export interface TagClosableConfig {
  closeIcon?: OctaneNode;
  disabled?: boolean;
  [name: `aria-${string}` | `data-${string}`]:
    | string
    | number
    | boolean
    | undefined;
}

export type ClosableType = boolean | TagClosableConfig;

export interface TagProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, "onClose"> {
  prefixCls?: string;
  rootClassName?: string;
  ref?: Ref<HTMLSpanElement>;
  color?: string;
  icon?: OctaneNode;
  closable?: ClosableType;
  closeIcon?: OctaneNode;
  onClose?: (event: MouseEvent) => void;
  bordered?: boolean;
  /** @deprecated Use conditional rendering instead. */
  visible?: boolean;
  style?: CSSProperties;
}
function InternalTag(tagProps: TagProps) {
  const {
    prefixCls,
    rootClassName,
    ref,
    color,
    icon,
    closable,
    closeIcon,
    onClose,
    bordered = true,
    visible: visibleProp,
    children,
    className,
    style,
    onClick,
    ...rest
  } = tagProps;
  const warning = devUseWarning("Tag");
  warning.deprecated(!("visible" in tagProps), "visible", "visible && <Tag />");
  const [visible, setVisible] = useState(visibleProp ?? true);
  useEffect(() => {
    if (visibleProp !== undefined) setVisible(visibleProp);
  }, [visibleProp]);
  const { token: t, component: c, base } = useComponentTokens("Tag");
  const config = useConfig();
  const outer = useRef<HTMLSpanElement | null>(null);
  const isNeedWave =
    typeof onClick === "function" ||
    (isValidElement(children) && children.type === "a");
  useWave(outer, "Tag", !isNeedWave);
  useImperativeHandle(ref, () => outer.current as HTMLSpanElement, []);
  const closeOptions = getClosable(
    { closable, closeIcon },
    config.tag,
    config.locale.global?.close,
  );
  const closeButtonProps = Object.fromEntries(
    Object.entries(closeOptions ?? {}).filter(
      ([key]) => key === "role" || key.startsWith("aria-"),
    ),
  );
  const prefix = config.getPrefixCls("tag", prefixCls);
  const status =
    color === "success"
      ? "Success"
      : color === "processing"
        ? "Info"
        : color === "error"
          ? "Error"
          : color === "warning"
            ? "Warning"
            : undefined;
  const colors = t as unknown as Record<string, string>;
  const inverse = color?.endsWith("-inverse");
  const baseColor = inverse ? color?.slice(0, -8) : color;
  const preset =
    baseColor &&
    [
      "pink",
      "magenta",
      "red",
      "volcano",
      "orange",
      "yellow",
      "gold",
      "cyan",
      "lime",
      "green",
      "blue",
      "geekblue",
      "purple",
    ].includes(baseColor)
      ? baseColor === "pink"
        ? "magenta"
        : baseColor
      : undefined;
  const internalColor = Boolean(status || preset || color === "default");
  const bg = status
    ? colors[`color${status}Bg`]
    : preset
      ? colors[inverse ? `${preset}6` : `${preset}-1`]
      : ((color && !internalColor ? color : undefined) ??
        c?.defaultBg ??
        new FastColor(t.colorFillQuaternary)
          .onBackground(t.colorBgContainer)
          .toHexString());
  const text = status
    ? colors[`color${status}`]
    : preset
      ? inverse
        ? t.colorTextLightSolid
        : colors[`${preset}-7`]
      : color && !internalColor
        ? t.colorTextLightSolid
        : (c?.defaultColor ?? t.colorText);
  const border = status
    ? colors[`color${status}Border`]
    : preset
      ? colors[inverse ? `${preset}6` : `${preset}-3`]
      : color && !internalColor
        ? "transparent"
        : t.colorBorder;
  const handleClose = (event: MouseEvent) => {
    event.stopPropagation();
    onClose?.(event);
    if (!event.defaultPrevented) setVisible(false);
  };
  const iconNode = closeOptions?.closeIcon;
  const closeNode =
    iconNode === undefined || iconNode === null ? null : isValidElement<{
        className?: string;
        onClick?: (event: MouseEvent) => void;
        "aria-label"?: string;
      }>(iconNode) ? (
      cloneElement(iconNode, {
        ...closeButtonProps,
        "aria-label":
          closeButtonProps["aria-label"] ??
          iconNode.props["aria-label"] ??
          config.locale.global?.close ??
          "Close",
        className: [
          iconNode.props.className,
          `${prefix}-close-icon`,
          prefix !== "ant-tag" && "ant-tag-close-icon",
        ]
          .filter(Boolean)
          .join(" "),
        onClick: (event: MouseEvent) => {
          iconNode.props.onClick?.(event);
          handleClose(event);
        },
      })
    ) : (
      // biome-ignore lint/a11y/noStaticElementInteractions: antd renders custom text close icons in a span.
      // biome-ignore lint/a11y/useKeyWithClickEvents: Match the upstream close icon span.
      // biome-ignore lint/a11y/useAriaPropsSupportedByRole: antd labels its close icon span for custom text nodes.
      <span
        {...closeButtonProps}
        aria-label={
          closeButtonProps["aria-label"] ??
          config.locale.global?.close ??
          "Close"
        }
        className={[`${prefix}-close-icon`, "ant-tag-close-icon"]}
        onClick={handleClose}
      >
        {iconNode}
      </span>
    );
  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: Match antd Tag span and its optional click wave.
    // biome-ignore lint/a11y/useKeyWithClickEvents: The component forwards the consumer click handler without inventing a button role.
    <span
      {...rest}
      ref={outer}
      className={[
        prefix,
        prefix !== "ant-tag" && "ant-tag",
        !visible && `${prefix}-hidden`,
        !visible && "ant-tag-hidden",
        config.direction === "rtl" && `${prefix}-rtl`,
        config.tag?.className,
        !bordered && `${prefix}-borderless`,
        !bordered && "ant-tag-borderless",
        color && internalColor && `${prefix}-${color}`,
        color && internalColor && `ant-tag-${color}`,
        color && !internalColor && `${prefix}-has-color`,
        color && !internalColor && "ant-tag-has-color",
        className,
        rootClassName,
      ]}
      style={{
        ...base,
        "--ao-tag-bg": bg,
        "--ao-tag-color": text,
        "--ao-tag-border": bordered ? border : "transparent",
        "--ao-tag-size": `${t.fontSizeSM}px`,
        "--ao-tag-line": `${t.fontSizeSM * t.lineHeightSM}px`,
        "--ao-tag-radius": `${t.borderRadiusSM}px`,
        "--ao-tag-margin": `${t.marginXS}px`,
        "--ao-tag-padding": `${8 - t.lineWidth}px`,
        "--ao-tag-border-width": `${t.lineWidth}px`,
        "--ao-tag-border-style": t.lineType,
        "--ao-tag-icon-gap": `${8 - t.lineWidth}px`,
        "--ao-tag-close-gap": `${t.paddingXXS - t.lineWidth}px`,
        "--ao-tag-close-size": `${t.fontSizeIcon - t.lineWidth * 2}px`,
        "--ao-tag-close-color": t.colorIcon,
        "--ao-tag-close-hover": t.colorTextHeading,
        "--ao-tag-duration": t.motion ? t.motionDurationMid : "0s",
        direction: config.direction,
        ...config.tag?.style,
        ...style,
      }}
      onClick={onClick}
    >
      {icon || null}
      {icon && children ? <span>{children}</span> : children}
      {closeNode}
    </span>
  );
}
export const Tag = Object.assign(InternalTag, { CheckableTag });
