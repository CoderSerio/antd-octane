/** @jsxImportSource octane */
import type { CSSProperties, OctaneNode } from "octane";
import { useId, useLayoutEffect, useRef, useState } from "octane";
import { DialogLayer } from "../_util/dialog";
import { type Placement, positionPopup } from "../_util/floating";
import { useComponentTokens } from "../_util/tokens";
import { Button, type ButtonProps } from "../button";
export interface TourStepProps {
  target?: HTMLElement | null | (() => HTMLElement | null);
  title?: OctaneNode;
  description?: OctaneNode;
  cover?: OctaneNode;
  placement?: Placement;
  type?: "default" | "primary";
  mask?: boolean;
  closable?: boolean;
  nextButtonProps?: ButtonProps;
  prevButtonProps?: ButtonProps;
}
export interface TourProps {
  steps?: TourStepProps[];
  open?: boolean;
  defaultOpen?: boolean;
  current?: number;
  defaultCurrent?: number;
  onChange?: (current: number) => void;
  onClose?: (current: number) => void;
  onFinish?: () => void;
  placement?: Placement;
  type?: "default" | "primary";
  mask?: boolean;
  closable?: boolean;
  closeIcon?: OctaneNode;
  gap?: { offset?: number | [number, number]; radius?: number };
  scrollIntoViewOptions?: boolean | ScrollIntoViewOptions;
  indicatorsRender?: (current: number, total: number) => OctaneNode;
  zIndex?: number;
  className?: string;
  rootClassName?: string;
  style?: CSSProperties;
}
interface TargetRect {
  left: number;
  top: number;
  width: number;
  height: number;
}
export function Tour({
  steps = [],
  open: controlledOpen,
  defaultOpen = true,
  current: controlledCurrent,
  defaultCurrent = 0,
  onChange,
  onClose,
  onFinish,
  placement = "bottom",
  type = "default",
  mask = true,
  closable = true,
  closeIcon,
  gap,
  scrollIntoViewOptions = true,
  indicatorsRender,
  zIndex,
  className,
  rootClassName,
  style,
}: TourProps) {
  const { token: t, component: c, base } = useComponentTokens("Tour");
  const [innerOpen, setOpen] = useState(defaultOpen),
    [innerCurrent, setCurrent] = useState(defaultCurrent);
  const current = controlledCurrent ?? innerCurrent;
  const step = steps[current];
  const open = (controlledOpen ?? innerOpen) && !!step;
  const id = useId();
  const panel = useRef<HTMLDivElement | null>(null);
  const [targetRect, setTargetRect] = useState<TargetRect | null>(null);
  const [position, setPosition] = useState<{
    x: number;
    y: number;
    side: string;
    arrowX: number;
    arrowY: number;
  } | null>(null);
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const close = () => {
    if (controlledOpen === undefined) setOpen(false);
    onClose?.(current);
  };
  const change = (next: number) => {
    if (controlledCurrent === undefined) setCurrent(next);
    onChange?.(next);
  };
  const finish = () => {
    if (controlledOpen === undefined) setOpen(false);
    onFinish?.();
  };
  const offsetX = Array.isArray(gap?.offset)
      ? gap.offset[0]
      : (gap?.offset ?? 6),
    offsetY = Array.isArray(gap?.offset) ? gap.offset[1] : (gap?.offset ?? 6);
  useLayoutEffect(() => {
    if (!open) return;
    let frame = 0;
    let observedPanel: HTMLElement | null = null;
    const target =
      typeof step.target === "function" ? step.target() : step.target;
    const scroll = scrollIntoViewOptions;
    if (target && scroll) {
      const rect = target.getBoundingClientRect();
      if (
        rect.top < 0 ||
        rect.left < 0 ||
        rect.bottom > window.innerHeight ||
        rect.right > window.innerWidth
      )
        target.scrollIntoView(
          typeof scroll === "object"
            ? scroll
            : { block: "center", inline: "center", behavior: "auto" },
        );
    }
    const read = () => {
      const width = window.innerWidth,
        height = window.innerHeight;
      setViewport((previous) =>
        previous.width === width && previous.height === height
          ? previous
          : { width, height },
      );
      const element =
        typeof step.target === "function" ? step.target() : step.target;
      const raw = element?.isConnected ? element.getBoundingClientRect() : null;
      const rect =
        raw && raw.width > 0 && raw.height > 0
          ? {
              left: raw.left - offsetX,
              top: raw.top - offsetY,
              width: raw.width + offsetX * 2,
              height: raw.height + offsetY * 2,
            }
          : null;
      setTargetRect((previous) =>
        JSON.stringify(previous) === JSON.stringify(rect) ? previous : rect,
      );
      if (panel.current && observedPanel !== panel.current) {
        observedPanel = panel.current;
        observer?.observe(observedPanel);
      }
      const bounds = panel.current?.getBoundingClientRect();
      if (!bounds) return;
      const next = rect
        ? positionPopup(
            rect,
            { width: bounds.width, height: bounds.height },
            { width, height },
            step.placement ?? placement,
            true,
            12,
          )
        : {
            x: Math.max(8, (width - bounds.width) / 2),
            y: Math.max(8, (height - bounds.height) / 2),
            side: "center",
            arrowX: 0,
            arrowY: 0,
          };
      setPosition((previous) =>
        previous &&
        Object.keys(previous).every(
          (key) =>
            previous[key as keyof typeof previous] ===
            next[key as keyof typeof next],
        )
          ? previous
          : next,
      );
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(read);
    };
    schedule();
    window.addEventListener("resize", schedule);
    window.addEventListener("scroll", schedule, true);
    const observer =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(schedule)
        : null;
    if (target) observer?.observe(target);
    if (panel.current) observer?.observe(panel.current);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("scroll", schedule, true);
      observer?.disconnect();
    };
  }, [open, step, placement, offsetX, offsetY, scrollIntoViewOptions]);
  const primary = (step?.type ?? type) === "primary";
  const showMask = step?.mask ?? mask;
  return (
    <DialogLayer
      open={open}
      destroyOnHidden
      mask={showMask}
      maskClosable={false}
      onClose={close}
      titleId={step?.title !== undefined ? id : undefined}
      label="操作引导"
      className={["ant-tour-root", rootClassName].filter(Boolean).join(" ")}
      panelClassName={["ant-tour", primary && "ant-tour-primary", className]
        .filter(Boolean)
        .join(" ")}
      style={{
        ...base,
        "--ao-dialog-mask": "transparent",
        "--ao-tour-mask": t.colorBgMask,
        "--ao-tour-bg": primary ? t.colorPrimary : t.colorBgElevated,
        "--ao-tour-color": primary ? t.colorTextLightSolid : t.colorText,
        "--ao-tour-title": primary ? t.colorTextLightSolid : t.colorTextHeading,
        "--ao-tour-shadow": t.boxShadowSecondary,
        "--ao-tour-radius": `${t.borderRadiusLG}px`,
        "--ao-tour-padding": `${t.padding}px`,
        "--ao-tour-small-padding": `${t.paddingXS}px`,
        "--ao-tour-title-size": `${t.fontSizeLG}px`,
        "--ao-tour-close-size": `${c?.closeBtnSize ?? t.fontSize * t.lineHeight}px`,
        "--ao-tour-prev-bg": c?.primaryPrevBtnBg ?? "rgb(255 255 255 / 15%)",
        "--ao-tour-next-hover": c?.primaryNextBtnHoverBg ?? "rgb(240,240,240)",
        "--ao-tour-next-bg": t.colorTextLightSolid,
        "--ao-tour-next-color": t.colorPrimary,
        "--ao-tour-spot-radius": `${gap?.radius ?? 2}px`,
        zIndex: zIndex ?? c?.zIndexPopup ?? t.zIndexPopupBase + 70,
      }}
      panelStyle={{ left: position?.x ?? 8, top: position?.y ?? 8, ...style }}
    >
      {showMask &&
        (targetRect ? (
          <div
            className="ant-tour-spotlight"
            aria-hidden="true"
            style={{
              left: targetRect.left,
              top: targetRect.top,
              width: targetRect.width,
              height: targetRect.height,
            }}
          />
        ) : (
          <div className="ant-tour-full-mask" aria-hidden="true" />
        ))}
      <div
        ref={panel}
        className="ant-tour-inner"
        style={{
          maxHeight: viewport.height ? viewport.height - 16 : undefined,
        }}
      >
        {(step?.closable ?? closable) &&
          closeIcon !== null &&
          closeIcon !== false && (
            <button
              type="button"
              className="ant-tour-close"
              aria-label="关闭引导"
              onClick={close}
            >
              {closeIcon ?? "×"}
            </button>
          )}
        {step?.cover !== undefined && (
          <div className="ant-tour-cover">{step.cover}</div>
        )}
        {step?.title !== undefined && (
          <div className="ant-tour-header">
            <div id={id} className="ant-tour-title">
              {step.title}
            </div>
          </div>
        )}
        {step?.description !== undefined && (
          <div className="ant-tour-description">{step.description}</div>
        )}
        <div className="ant-tour-footer">
          <div
            className="ant-tour-indicators"
            role="status"
            aria-label={`第 ${current + 1} 步，共 ${steps.length} 步`}
          >
            {indicatorsRender
              ? indicatorsRender(current, steps.length)
              : steps.map((_, index) => (
                  <span
                    key={index}
                    className={
                      index === current
                        ? "ant-tour-indicator-active"
                        : undefined
                    }
                  />
                ))}
          </div>
          <div className="ant-tour-buttons">
            {current > 0 && (
              <Button
                size="small"
                {...step?.prevButtonProps}
                onClick={(event) => {
                  step?.prevButtonProps?.onClick?.(event);
                  if (!event.defaultPrevented) change(current - 1);
                }}
              >
                {step?.prevButtonProps?.children ?? "上一步"}
              </Button>
            )}
            <Button
              size="small"
              type="primary"
              {...step?.nextButtonProps}
              onClick={(event) => {
                step?.nextButtonProps?.onClick?.(event);
                if (!event.defaultPrevented) {
                  if (current === steps.length - 1) finish();
                  else change(current + 1);
                }
              }}
            >
              {step?.nextButtonProps?.children ??
                (current === steps.length - 1 ? "完成" : "下一步")}
            </Button>
          </div>
        </div>
      </div>
    </DialogLayer>
  );
}
