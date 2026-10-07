import type { OctaneNode } from "octane";

export type valueType = number | string;
/** @deprecated Use valueType instead. */
export type countdownValueType = valueType;

export type Formatter =
  | false
  | "number"
  | "countdown"
  | ((value: valueType, config?: FormatConfig) => OctaneNode);

export interface FormatConfig {
  formatter?: Formatter;
  decimalSeparator?: string;
  groupSeparator?: string;
  precision?: number;
}

export interface CountdownFormatConfig extends FormatConfig {
  format?: string;
}

const timeUnits: [string, number][] = [
  ["Y", 1000 * 60 * 60 * 24 * 365],
  ["M", 1000 * 60 * 60 * 24 * 30],
  ["D", 1000 * 60 * 60 * 24],
  ["H", 1000 * 60 * 60],
  ["m", 1000 * 60],
  ["s", 1000],
  ["S", 1],
];

export function formatTimeStr(duration: number, format: string) {
  let remaining = duration;
  const escapeRegex = /\[[^\]]*]/g;
  const keepList = (format.match(escapeRegex) || []).map((item) =>
    item.slice(1, -1),
  );
  const template = format.replace(escapeRegex, "[]");
  const replaced = timeUnits.reduce((current, [name, unit]) => {
    if (!current.includes(name)) return current;
    const value = Math.floor(remaining / unit);
    remaining -= value * unit;
    return current.replace(new RegExp(`${name}+`, "g"), (match) =>
      value.toString().padStart(match.length, "0"),
    );
  }, template);
  let index = 0;
  return replaced.replace(escapeRegex, () => keepList[index++] ?? "");
}

export function formatCounter(
  value: valueType,
  config: CountdownFormatConfig,
  countdown: boolean,
) {
  const target = new Date(value).getTime();
  const now = Date.now();
  const difference = countdown
    ? Math.max(target - now, 0)
    : Math.max(now - target, 0);
  return formatTimeStr(difference, config.format ?? "");
}
