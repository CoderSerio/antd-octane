import { FastColor } from "@ant-design/fast-color";

export type ColorFormatType = "hex" | "rgb" | "hsb";
export interface HSB {
  h: number;
  s: number;
  b: number;
  a: number;
}
export type ColorValue = string | Color | null;

/** Solid-color value. Ant Design's gradient aggregation API is not supported. */
export class Color {
  readonly cleared: boolean;
  private readonly color: FastColor;
  constructor(value: ColorValue | HSB = null) {
    this.cleared =
      value === null ||
      value === "" ||
      (value instanceof Color && value.cleared);
    this.color =
      value instanceof Color
        ? new FastColor(value.color)
        : typeof value === "object" && value !== null
          ? new FastColor({ h: value.h, s: value.s, v: value.b, a: value.a })
          : new FastColor(
              this.cleared ? { r: 0, g: 0, b: 0, a: 0 } : (value ?? ""),
            );
  }
  toHex() {
    return this.toHexString().slice(1);
  }
  toHexString() {
    return this.color.toHexString();
  }
  toRgb() {
    return this.color.toRgb();
  }
  toRgbString() {
    return this.color.toRgbString();
  }
  toCssString() {
    return this.toRgbString();
  }
  toHsb(): HSB {
    const { h, s, v, a } = this.color.toHsv();
    return { h, s, b: v, a };
  }
  toHsbString() {
    const { h, s, b, a } = this.toHsb();
    const values = `${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(b * 100)}%`;
    return a === 1 ? `hsb(${values})` : `hsba(${values}, ${a})`;
  }
}

/** Strict editor parsing: FastColor itself intentionally accepts malformed input. */
export function parseColor(text: string): Color | undefined {
  const value = text.trim();
  if (/^#?(?:[\da-f]{3}|[\da-f]{4}|[\da-f]{6}|[\da-f]{8})$/i.test(value))
    return new Color(value);
  const match =
    /^(rgb|rgba|hsl|hsla|hsb|hsba)\(\s*([\d.]+)(%?)\s*,\s*([\d.]+)(%?)\s*,\s*([\d.]+)(%?)(?:\s*,\s*([\d.]+)(%?))?\s*\)$/i.exec(
      value,
    );
  if (!match) return undefined;
  const kind = match[1].toLowerCase();
  const alpha =
    match[8] === undefined ? 1 : Number(match[8]) / (match[9] ? 100 : 1);
  const nums = [Number(match[2]), Number(match[4]), Number(match[6])];
  if (
    ![...nums, alpha].every(Number.isFinite) ||
    alpha < 0 ||
    alpha > 1 ||
    kind.endsWith("a") !== (match[8] !== undefined)
  )
    return undefined;
  const rgb = kind.startsWith("rgb");
  const units = [match[3], match[5], match[7]];
  if (
    rgb
      ? nums.some((n, i) => n > (units[i] ? 100 : 255))
      : units[0] ||
        !units[1] ||
        !units[2] ||
        nums[0] > 360 ||
        nums[1] > 100 ||
        nums[2] > 100
  )
    return undefined;
  return new Color(value.toLowerCase());
}
export function formatColor(color: Color, format: ColorFormatType) {
  return color.cleared
    ? ""
    : format === "rgb"
      ? color.toRgbString()
      : format === "hsb"
        ? color.toHsbString()
        : color.toHexString();
}
