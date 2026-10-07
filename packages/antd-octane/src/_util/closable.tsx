import type { AriaAttributes, OctaneNode } from "octane";
import { CloseOutlined } from "./feedback-icons";

export type ClosableType =
  | boolean
  | (AriaAttributes & {
      closeIcon?: OctaneNode;
      disabled?: boolean;
      [key: `data-${string}`]: unknown;
    });
export function resolveClosable(
  closable: ClosableType | undefined,
  closeIcon: OctaneNode,
  contextCloseIcon?: OctaneNode,
) {
  const {
    closeIcon: objectIcon,
    disabled,
    ...aria
  } = typeof closable === "object" ? closable : {};
  const icon =
    objectIcon !== undefined
      ? objectIcon
      : closeIcon !== undefined
        ? closeIcon
        : contextCloseIcon;
  return {
    enabled:
      closable !== false &&
      !(closable === undefined && (icon === false || icon === null)),
    icon: icon === undefined || icon === true ? <CloseOutlined /> : icon,
    disabled,
    aria,
  };
}
