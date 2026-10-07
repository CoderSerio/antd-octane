/** CSS dimensions accept numeric pixels and explicit CSS units, as in antd tokens. */
export default function cssSize(
  value: number | string | undefined,
): string | undefined {
  return typeof value === "number" ? `${value}px` : value;
}
