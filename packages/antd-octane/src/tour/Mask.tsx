/** @jsxImportSource octane */
import type { CSSProperties } from "octane";
import { useId } from "octane";
import type { TargetRect } from "./interface";

interface MaskProps {
  prefixCls: string;
  rootClassName?: string;
  targetRect: TargetRect | null;
  showMask: boolean;
  disabledInteraction: boolean;
  color: string;
  style?: CSSProperties;
}

// Adapted from @rc-component/tour 1.15.1 Mask (MIT). Transparent cover rectangles
// intercept clicks outside the hole while the highlighted target remains usable.
export default function Mask({
  prefixCls,
  rootClassName,
  targetRect: pos,
  showMask,
  disabledInteraction,
  color,
  style,
}: MaskProps) {
  const id = useId();
  const maskId = `${prefixCls}-mask-${id.replace(/:/g, "")}`;
  return (
    <div
      aria-hidden="true"
      className={[
        "ant-tour-mask",
        prefixCls !== "ant-tour" && `${prefixCls}-mask`,
        !pos && showMask && "ant-tour-full-mask",
        rootClassName,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        pointerEvents: pos && !disabledInteraction ? "none" : "auto",
        ...style,
      }}
    >
      {showMask && (
        <svg width="100%" height="100%" aria-hidden="true">
          <defs>
            <mask id={maskId}>
              <rect x="0" y="0" width="100%" height="100%" fill="white" />
              {pos && (
                <rect
                  x={pos.left}
                  y={pos.top}
                  width={pos.width}
                  height={pos.height}
                  rx={pos.radius}
                  fill="black"
                  className={[
                    "ant-tour-placeholder-animated",
                    prefixCls !== "ant-tour" &&
                      `${prefixCls}-placeholder-animated`,
                  ]
                    .filter(Boolean)
                    .join(" ")}
                />
              )}
            </mask>
          </defs>
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill={color}
            mask={`url(#${maskId})`}
          />
          {pos && (
            <>
              <rect
                x="0"
                y="0"
                width="100%"
                height={Math.max(0, pos.top)}
                fill="transparent"
                pointerEvents="auto"
              />
              <rect
                x="0"
                y="0"
                width={Math.max(0, pos.left)}
                height="100%"
                fill="transparent"
                pointerEvents="auto"
              />
              <rect
                x="0"
                y={pos.top + pos.height}
                width="100%"
                height={`calc(100vh - ${pos.top + pos.height}px)`}
                fill="transparent"
                pointerEvents="auto"
              />
              <rect
                x={pos.left + pos.width}
                y="0"
                width={`calc(100vw - ${pos.left + pos.width}px)`}
                height="100%"
                fill="transparent"
                pointerEvents="auto"
              />
            </>
          )}
        </svg>
      )}
    </div>
  );
}
