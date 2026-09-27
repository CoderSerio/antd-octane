/** @jsxImportSource octane */
import type { CSSProperties, HTMLAttributes, OctaneNode } from "octane";
import { useState } from "octane";
import { useComponentTokens } from "../_util/tokens";
import { useConfig } from "../config-provider";
export interface RateProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  value?: number;
  defaultValue?: number;
  count?: number;
  allowHalf?: boolean;
  allowClear?: boolean;
  disabled?: boolean;
  character?: OctaneNode | ((props: { index: number }) => OctaneNode);
  tooltips?: string[];
  onChange?: (value: number) => void;
  onHoverChange?: (value: number | undefined) => void;
  keyboard?: boolean;
  style?: CSSProperties;
}
export function Rate({
  value,
  defaultValue = 0,
  count = 5,
  allowHalf = false,
  allowClear = true,
  disabled,
  character,
  tooltips,
  onChange,
  onHoverChange,
  keyboard = true,
  className,
  style,
  onKeyDown,
  ...rest
}: RateProps) {
  const config = useConfig();
  const { token: t, component: c, base } = useComponentTokens("Rate");
  const blocked = disabled ?? config.componentDisabled;
  const total = Number.isFinite(count) ? Math.max(0, Math.floor(count)) : 5;
  const [inner, setInner] = useState(defaultValue);
  const [hover, setHover] = useState<number | undefined>();
  const clamp = (n: number) =>
    Number.isFinite(n) ? Math.min(total, Math.max(0, n)) : 0;
  const current = clamp(value ?? inner);
  const displayed = hover ?? current;
  const change = (next: number) => {
    if (blocked || next === current) return;
    if (value === undefined) setInner(next);
    onChange?.(next);
  };
  const point = (event: MouseEvent, index: number) => {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    return (
      index +
      (allowHalf && event.clientX - rect.left < rect.width / 2 ? 0.5 : 1)
    );
  };
  return (
    <div
      {...rest}
      className={["ant-rate", blocked && "ant-rate-disabled", className]}
      role="slider"
      aria-label={rest["aria-label"] ?? "评分"}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={current}
      aria-valuetext={tooltips?.[Math.ceil(current) - 1]}
      aria-disabled={blocked || undefined}
      tabIndex={blocked ? -1 : (rest.tabIndex ?? 0)}
      style={{
        ...base,
        "--ao-rate-color": c?.starColor ?? t.yellow6,
        "--ao-rate-size": `${c?.starSize ?? t.controlHeightLG * 0.5}px`,
        "--ao-rate-bg": c?.starBg ?? t.colorFillContent,
        "--ao-rate-scale": c?.starHoverScale ?? "scale(1.1)",
        "--ao-rate-gap": `${t.marginXS}px`,
        ...style,
      }}
      onMouseLeave={() => {
        if (blocked) return;
        setHover(undefined);
        onHoverChange?.(undefined);
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.defaultPrevented || blocked || !keyboard) return;
        const step = allowHalf ? 0.5 : 1;
        const next =
          event.key === "Home"
            ? 0
            : event.key === "End"
              ? total
              : ["ArrowRight", "ArrowUp"].includes(event.key)
                ? clamp(current + step)
                : ["ArrowLeft", "ArrowDown"].includes(event.key)
                  ? clamp(current - step)
                  : undefined;
        if (next !== undefined) {
          event.preventDefault();
          change(next);
        }
      }}
    >
      {Array.from({ length: total }, (_, index) => {
        const node =
          typeof character === "function"
            ? character({ index })
            : (character ?? (
                <span className="ant-rate-icon">
                  <svg
                    viewBox="0 0 1024 1024"
                    width="1em"
                    height="1em"
                    aria-hidden="true"
                  >
                    <path
                      fill="currentColor"
                      d="m512 55 142 288 318 46-230 224 54 317-284-150-284 150 54-317L52 389l318-46z"
                    />
                  </svg>
                </span>
              ));
        return (
          <span
            key={index}
            className={[
              "ant-rate-star",
              displayed >= index + 1
                ? "ant-rate-star-full"
                : allowHalf && displayed >= index + 0.5
                  ? "ant-rate-star-half"
                  : "ant-rate-star-zero",
            ]}
            title={tooltips?.[index]}
            aria-hidden="true"
            onMouseMove={(event) => {
              if (blocked) return;
              const next = point(event, index);
              if (next !== hover) {
                setHover(next);
                onHoverChange?.(next);
              }
            }}
            onClick={(event) => {
              if (blocked) return;
              (
                event.currentTarget.closest(
                  '[role="slider"]',
                ) as HTMLElement | null
              )?.focus();
              const next = point(event, index);
              change(allowClear && next === current ? 0 : next);
              setHover(undefined);
            }}
          >
            <div>
              <div className="ant-rate-star-first">{node}</div>
              <div className="ant-rate-star-second">{node}</div>
            </div>
          </span>
        );
      })}
    </div>
  );
}
