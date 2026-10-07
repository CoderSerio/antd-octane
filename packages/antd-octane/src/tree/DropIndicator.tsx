/** @jsxImportSource octane */
// Adapted from antd 5.29.3 components/tree/utils/dropIndicator.tsx (MIT).
import type { CSSProperties } from "octane";
import type { TreeDropIndicatorProps } from "./types";

export function DropIndicator({
  dropPosition,
  dropLevelOffset,
  prefixCls,
  indent,
  direction,
}: TreeDropIndicatorProps) {
  const start = direction === "rtl" ? "right" : "left";
  const end = direction === "rtl" ? "left" : "right";
  const style: CSSProperties = {
    [start]: -dropLevelOffset * indent + 4,
    [end]: 0,
  };
  if (dropPosition === -1) style.top = -3;
  else {
    style.bottom = -3;
    if (dropPosition === 0) style[start] = indent + 4;
  }
  return (
    <div
      style={style}
      className={`${prefixCls}-drop-indicator ant-tree-drop-indicator`}
    />
  );
}
