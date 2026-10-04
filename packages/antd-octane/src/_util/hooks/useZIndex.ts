// Ant Design 5.29.3 components/_util/hooks/useZIndex.ts (MIT), adapted to Octane.
import { useContext } from "octane";
import { useToken } from "../../config-provider";
import { devUseWarning } from "../warning";
import zIndexContext from "../zindexContext";

export type ZIndexContainer =
  | "Modal"
  | "Drawer"
  | "Popover"
  | "Popconfirm"
  | "Tooltip"
  | "Tour"
  | "FloatButton";
export type ZIndexConsumer =
  | "SelectLike"
  | "Dropdown"
  | "DatePicker"
  | "Menu"
  | "ImagePreview";

const CONTAINER_OFFSET = 100;
export const CONTAINER_MAX_OFFSET = CONTAINER_OFFSET * 10;
const CONTAINER_MAX_OFFSET_WITH_CHILDREN =
  CONTAINER_MAX_OFFSET + CONTAINER_OFFSET;

export const containerBaseZIndexOffset: Record<ZIndexContainer, number> = {
  Modal: CONTAINER_OFFSET,
  Drawer: CONTAINER_OFFSET,
  Popover: CONTAINER_OFFSET,
  Popconfirm: CONTAINER_OFFSET,
  Tooltip: CONTAINER_OFFSET,
  Tour: CONTAINER_OFFSET,
  FloatButton: CONTAINER_OFFSET,
};
export const consumerBaseZIndexOffset: Record<ZIndexConsumer, number> = {
  SelectLike: 50,
  Dropdown: 50,
  DatePicker: 50,
  Menu: 50,
  ImagePreview: 1,
};

export function useZIndex(
  componentType: ZIndexContainer | ZIndexConsumer,
  customZIndex?: number,
): [zIndex: number | undefined, contextZIndex: number] {
  const { token } = useToken();
  const parentZIndex = useContext(zIndexContext);
  let result: [number | undefined, number];
  if (customZIndex !== undefined) {
    result = [customZIndex, customZIndex];
  } else {
    let zIndex = parentZIndex ?? 0;
    if (componentType in containerBaseZIndexOffset) {
      zIndex +=
        (parentZIndex ? 0 : token.zIndexPopupBase) +
        containerBaseZIndexOffset[componentType as ZIndexContainer];
    } else {
      zIndex += consumerBaseZIndexOffset[componentType as ZIndexConsumer];
    }
    result = [parentZIndex === undefined ? undefined : zIndex, zIndex];
  }
  const warning = devUseWarning(componentType);
  warning(
    customZIndex !== undefined ||
      (result[0] || 0) <=
        token.zIndexPopupBase + CONTAINER_MAX_OFFSET_WITH_CHILDREN,
    "usage",
    "`zIndex` is over design token `zIndexPopupBase` too much. It may cause unexpected override.",
  );
  return result;
}
