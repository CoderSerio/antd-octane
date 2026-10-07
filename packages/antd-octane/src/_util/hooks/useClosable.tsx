// Adapted from Ant Design 5.29.3 components/_util/hooks/useClosable.tsx (MIT).
import type { AriaAttributes, OctaneNode } from "octane";
import { cloneElement, isValidElement } from "octane";
import { useConfig } from "../../config-provider";
import type { ClosableType } from "../closable";
import { CloseOutlined } from "../feedback-icons";

type CloseCollection = { closable?: ClosableType; closeIcon?: OctaneNode };
type CloseConfig = Extract<ClosableType, object>;
export function getClosableConfig({
  closable,
  closeIcon,
}: CloseCollection = {}) {
  if (
    !closable &&
    (closable === false || closeIcon === false || closeIcon === null)
  )
    return false;
  if (closable === undefined && closeIcon === undefined) return null;
  return {
    closeIcon:
      typeof closeIcon !== "boolean" && closeIcon !== null
        ? closeIcon
        : undefined,
    ...(typeof closable === "object" ? closable : {}),
  };
}
export function useClosable(
  props?: CloseCollection,
  context?: CloseCollection,
  fallback: CloseCollection & {
    closeIconRender?: (icon: OctaneNode) => OctaneNode;
  } = {},
): [boolean, OctaneNode, boolean, AriaAttributes] {
  const config = useConfig();
  const propClose = getClosableConfig(props);
  const contextClose = getClosableConfig(context);
  const disabled = !!propClose && !!propClose.disabled;
  const enabled =
    propClose === false
      ? false
      : propClose
        ? true
        : contextClose === false
          ? false
          : contextClose
            ? true
            : !!fallback.closable;
  if (!enabled) return [false, null, disabled, {}];
  const merged: CloseConfig = {
    closeIcon: <CloseOutlined aria-label="close" />,
    ...fallback,
  };
  for (const source of [contextClose, propClose]) {
    if (source)
      for (const [key, value] of Object.entries(source)) {
        if (value !== undefined) Object.assign(merged, { [key]: value });
      }
  }
  const attrs = Object.fromEntries(
    Object.entries(merged).filter(
      ([key]) => key.startsWith("aria-") || key.startsWith("data-"),
    ),
  ) as AriaAttributes;
  let icon = merged.closeIcon;
  if (icon !== null && icon !== undefined) {
    if (fallback.closeIconRender) icon = fallback.closeIconRender(icon);
    const originalIcon = icon;
    const label = config.locale.global?.close ?? "Close";
    icon = isValidElement<AriaAttributes>(icon) ? (
      cloneElement(icon, {
        ...icon.props,
        "aria-label": icon.props["aria-label"] ?? label,
        ...attrs,
      })
    ) : (
      // biome-ignore lint/a11y/useAriaPropsSupportedByRole: Preserve upstream close-icon labelling on its wrapper.
      <span aria-label={label} {...attrs}>
        {originalIcon}
      </span>
    );
  }
  return [true, icon, disabled, attrs];
}
