// Adapted from Ant Design 5.29.3 (MIT).
import type { CSSProperties } from "octane";

export function getStyleStr(style: CSSProperties): string {
  return Object.entries(style)
    .map(
      ([key, value]) =>
        `${key.replace(/([A-Z])/g, "-$1").toLowerCase()}: ${value};`,
    )
    .join(" ");
}

export function getPixelRatio() {
  return window.devicePixelRatio || 1;
}

export function reRendering(
  mutation: MutationRecord,
  isWatermarkEle: (node: Node) => boolean,
) {
  return (
    Array.from(mutation.removedNodes).some(isWatermarkEle) ||
    (mutation.type === "attributes" && isWatermarkEle(mutation.target))
  );
}
