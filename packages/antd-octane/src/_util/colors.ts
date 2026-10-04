import type { AliasToken } from "../theme/types";

const presetColors = [
  "blue",
  "purple",
  "cyan",
  "green",
  "magenta",
  "pink",
  "red",
  "orange",
  "yellow",
  "volcano",
  "geekblue",
  "lime",
  "gold",
] as const;

export function resolvePresetColor(color: string, token: AliasToken) {
  return presetColors.includes(color as (typeof presetColors)[number])
    ? (token[`${color}6` as keyof AliasToken] as string)
    : color;
}
