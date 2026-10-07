/** rc-image 7.12.0 getFixScaleEleTransPosition (MIT), adapted to native DOM. */
function fixPoint(
  key: "x" | "y",
  start: number,
  size: number,
  clientSize: number,
) {
  const end = start + size;
  const offset = (size - clientSize) / 2;
  if (size > clientSize) {
    if (start > 0) return { [key]: offset };
    if (start < 0 && end < clientSize) return { [key]: -offset };
  } else if (start < 0 || end > clientSize) {
    return { [key]: start < 0 ? offset : -offset };
  }
  return {};
}

/** Keep the viewport covered by large images, and center images fitting both axes. */
export default function getFixScaleEleTransPosition(
  width: number,
  height: number,
  left: number,
  top: number,
) {
  const clientWidth = document.documentElement.clientWidth;
  const clientHeight = document.documentElement.clientHeight;
  if (width <= clientWidth && height <= clientHeight) return { x: 0, y: 0 };
  return {
    ...fixPoint("x", left, width, clientWidth),
    ...fixPoint("y", top, height, clientHeight),
  };
}
