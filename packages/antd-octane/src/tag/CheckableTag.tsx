/** @jsxImportSource octane */
import type { Ref } from "octane";
import { useComponentTokens } from "../_util/tokens";
import { useConfig } from "../config-provider";
import type { TagProps } from ".";

export interface CheckableTagProps
  extends Omit<
    TagProps,
    "onChange" | "onClick" | "closable" | "onClose" | "visible" | "ref"
  > {
  ref?: Ref<HTMLSpanElement>;
  checked: boolean;
  onChange?: (checked: boolean) => void;
  onClick?: (event: MouseEvent) => void;
}
export default function CheckableTag({
  prefixCls,
  rootClassName,
  ref,
  checked,
  onChange,
  onClick,
  icon,
  children,
  style,
  className,
  ...rest
}: CheckableTagProps) {
  const config = useConfig();
  const { token: t, component: c, base } = useComponentTokens("Tag");
  const {
    color: _color,
    closeIcon: _closeIcon,
    bordered: _bordered,
    ...attrs
  } = rest;
  const prefix = config.getPrefixCls("tag", prefixCls);
  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: Match Ant Design 5 CheckableTag's span DOM contract.
    // biome-ignore lint/a11y/useKeyWithClickEvents: Match Ant Design 5 CheckableTag's click interaction.
    <span
      {...attrs}
      ref={ref}
      className={[
        prefix,
        prefix !== "ant-tag" && "ant-tag",
        config.tag?.className,
        `${prefix}-checkable`,
        "ant-tag-checkable",
        checked && [`${prefix}-checkable-checked`, "ant-tag-checkable-checked"],
        className,
        rootClassName,
      ]}
      onClick={(event) => {
        onChange?.(!checked);
        onClick?.(event);
      }}
      style={{
        ...base,
        "--ao-tag-size": `${t.fontSizeSM}px`,
        "--ao-tag-radius": `${t.borderRadiusSM}px`,
        "--ao-tag-line": `${t.fontSizeSM * t.lineHeightSM}px`,
        "--ao-tag-margin": `${t.marginXS}px`,
        "--ao-tag-bg": checked ? t.colorPrimary : "transparent",
        "--ao-tag-color": checked
          ? t.colorTextLightSolid
          : (c?.defaultColor ?? t.colorText),
        "--ao-tag-border": "transparent",
        "--ao-tag-padding": `${8 - t.lineWidth}px`,
        "--ao-tag-border-width": `${t.lineWidth}px`,
        "--ao-tag-border-style": t.lineType,
        "--ao-tag-duration": t.motion ? t.motionDurationMid : "0s",
        "--ao-tag-primary": t.colorPrimary,
        "--ao-tag-primary-hover": t.colorPrimaryHover,
        "--ao-tag-primary-active": t.colorPrimaryActive,
        "--ao-tag-hover-bg": t.colorFillSecondary,
        "--ao-tag-light": t.colorTextLightSolid,
        ...config.tag?.style,
        ...style,
      }}
    >
      {icon}
      <span>{children}</span>
    </span>
  );
}
