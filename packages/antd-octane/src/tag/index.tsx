/** @jsxImportSource octane */
import { FastColor } from "@ant-design/fast-color";
import type { CSSProperties, HTMLAttributes, OctaneNode } from "octane";
import { useState } from "octane";
import { useComponentTokens } from "../_util/tokens";
import { useConfig } from "../config-provider";
export interface TagProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, "onClose"> {
  color?: string;
  icon?: OctaneNode;
  closable?: boolean;
  closeIcon?: OctaneNode;
  onClose?: (event: MouseEvent) => void;
  bordered?: boolean;
  style?: CSSProperties;
}
function InternalTag({
  color,
  icon,
  closable = false,
  closeIcon,
  onClose,
  bordered = true,
  children,
  className,
  style,
  ...rest
}: TagProps) {
  const [visible, setVisible] = useState(true);
  const { token: t, base } = useComponentTokens("Tag");
  const c = useConfig().theme.components?.Tag;
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
  const preset =
    color &&
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
    ].includes(color)
      ? color === "pink"
        ? "magenta"
        : color
      : undefined;
  const bg = status
    ? colors[`color${status}Bg`]
    : preset
      ? colors[`${preset}-1`]
      : (color ??
        c?.defaultBg ??
        new FastColor(t.colorFillQuaternary)
          .onBackground(t.colorBgContainer)
          .toHexString());
  const text = status
    ? colors[`color${status}`]
    : preset
      ? colors[`${preset}-7`]
      : color
        ? t.colorTextLightSolid
        : (c?.defaultColor ?? t.colorText);
  const border = status
    ? colors[`color${status}Border`]
    : preset
      ? colors[`${preset}-3`]
      : (color ?? t.colorBorder);
  if (!visible) return null;
  return (
    <span
      {...rest}
      className={["ant-tag", className]}
      style={{
        ...base,
        "--ao-tag-bg": bg,
        "--ao-tag-color": text,
        "--ao-tag-border": bordered ? border : "transparent",
        "--ao-tag-size": `${t.fontSizeSM}px`,
        "--ao-tag-line": `${t.fontSizeSM * t.lineHeightSM}px`,
        "--ao-tag-radius": `${t.borderRadiusSM}px`,
        "--ao-tag-margin": `${t.marginXS}px`,
        ...style,
      }}
    >
      {icon && <span className="ant-tag-icon">{icon}</span>}
      {children}
      {closable && (
        <button
          type="button"
          className="ant-tag-close-icon"
          aria-label="关闭标签"
          onClick={(event) => {
            event.stopPropagation();
            onClose?.(event);
            if (!event.defaultPrevented) setVisible(false);
          }}
        >
          {closeIcon ?? "×"}
        </button>
      )}
    </span>
  );
}
export interface CheckableTagProps
  extends Omit<TagProps, "onChange" | "onClick" | "closable" | "onClose"> {
  checked: boolean;
  onChange?: (checked: boolean) => void;
}
function CheckableTag({
  checked,
  onChange,
  children,
  style,
  className,
  ...rest
}: CheckableTagProps) {
  const { token: t, base } = useComponentTokens("Tag");
  const {
    color: _color,
    icon: _icon,
    closeIcon: _closeIcon,
    bordered: _bordered,
    ...attrs
  } = rest;
  return (
    <button
      type="button"
      {...attrs}
      className={[
        "ant-tag-checkable",
        checked && "ant-tag-checkable-checked",
        className,
      ]}
      aria-pressed={checked}
      onClick={() => onChange?.(!checked)}
      style={{
        ...base,
        "--ao-tag-size": `${t.fontSizeSM}px`,
        "--ao-tag-radius": `${t.borderRadiusSM}px`,
        "--ao-tag-line": `${t.fontSizeSM * t.lineHeightSM}px`,
        "--ao-tag-margin": `${t.marginXS}px`,
        "--ao-tag-bg": checked ? t.colorPrimary : "transparent",
        "--ao-tag-color": checked ? t.colorTextLightSolid : t.colorText,
        "--ao-tag-border": "transparent",
        ...style,
      }}
    >
      {children}
    </button>
  );
}
export const Tag = Object.assign(InternalTag, { CheckableTag });
