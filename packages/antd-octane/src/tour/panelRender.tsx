/** @jsxImportSource octane */
import type { OctaneNode, Ref } from "octane";
import { Button } from "../button";
import { useLocale } from "../locale";
import type { TourClosable, TourProps, TourStepProps } from "./interface";

interface TourPanelProps {
  stepProps: Omit<TourStepProps, "closable"> & {
    closable: Exclude<TourClosable, boolean> | null;
  };
  current: number;
  total: number;
  prefixCls: string;
  type?: TourProps["type"];
  indicatorsRender?: TourProps["indicatorsRender"];
  actionsRender?: TourProps["actionsRender"];
  titleId: string;
  panelRef: Ref<HTMLDivElement>;
}

// CloseOutlined SVG: @ant-design/icons-svg 4.6.0 (MIT, Ant UED).
function CloseIcon({ prefixCls }: { prefixCls: string }) {
  return (
    <span
      className={[
        "anticon anticon-close ant-tour-close-icon",
        prefixCls !== "ant-tour" && `${prefixCls}-close-icon`,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-hidden="true"
    >
      <svg
        aria-hidden="true"
        width="1em"
        height="1em"
        viewBox="64 64 896 896"
        fill="currentColor"
        focusable="false"
      >
        <path d="M799.86 166.31c.02 0 .04.02.08.06l57.69 57.7c.04.03.05.05.06.08a.12.12 0 010 .06c0 .03-.02.05-.06.09L569.93 512l287.7 287.7c.04.04.05.06.06.09a.12.12 0 010 .07c0 .02-.02.04-.06.08l-57.7 57.69c-.03.04-.05.05-.07.06a.12.12 0 01-.07 0c-.03 0-.05-.02-.09-.06L512 569.93l-287.7 287.7c-.04.04-.06.05-.09.06a.12.12 0 01-.07 0c-.02 0-.04-.02-.08-.06l-57.69-57.7c-.04-.03-.05-.05-.06-.07a.12.12 0 010-.07c0-.03.02-.05.06-.09L454.07 512l-287.7-287.7c-.04-.04-.05-.06-.06-.09a.12.12 0 010-.07c0-.02.02-.04.06-.08l57.7-57.69c.03-.04.05-.05.07-.06a.12.12 0 01.07 0c.03 0 .05.02.09.06L512 454.07l287.7-287.7c.04-.04.06-.05.09-.06a.12.12 0 01.07 0z" />
      </svg>
    </span>
  );
}

const isNonNullable = (node: OctaneNode) => node !== undefined && node !== null;

// Panel design follows Ant Design 5.29.3 tour/panelRender.tsx (MIT). The panel is
// separate from target geometry and the mask so each can update independently.
export default function TourPanel({
  stepProps,
  current,
  total,
  prefixCls,
  type,
  indicatorsRender,
  actionsRender,
  titleId,
  panelRef,
}: TourPanelProps) {
  const [locale] = useLocale("Tour");
  const [globalLocale] = useLocale("global");
  const {
    title,
    description,
    cover,
    nextButtonProps,
    prevButtonProps,
    closable,
    onClose,
    onPrev,
    onNext,
    onFinish,
  } = stepProps;
  const primary = (stepProps.type ?? type) === "primary";
  const isLastStep = current === total - 1;
  const classNames = (suffix: string, extra?: string) =>
    [
      `ant-tour-${suffix}`,
      prefixCls !== "ant-tour" && `${prefixCls}-${suffix}`,
      extra,
    ]
      .filter(Boolean)
      .join(" ");
  const ariaProps = Object.fromEntries(
    Object.entries(closable ?? {}).filter(([key]) => key.startsWith("aria-")),
  );
  const defaultActions = (
    <>
      {current !== 0 && (
        <Button
          size="small"
          type="default"
          ghost={primary}
          {...prevButtonProps}
          className={classNames("prev-btn", prevButtonProps?.className)}
          onClick={() => {
            onPrev?.();
            prevButtonProps?.onClick?.();
          }}
        >
          {prevButtonProps?.children ?? locale.Previous}
        </Button>
      )}
      <Button
        size="small"
        type={primary ? "default" : "primary"}
        {...nextButtonProps}
        className={classNames("next-btn", nextButtonProps?.className)}
        onClick={() => {
          if (isLastStep) onFinish?.();
          else onNext?.();
          nextButtonProps?.onClick?.();
        }}
      >
        {nextButtonProps?.children ??
          (isLastStep ? locale.Finish : locale.Next)}
      </Button>
    </>
  );
  return (
    <div className={classNames("content")}>
      <div ref={panelRef} className={classNames("inner")}>
        {closable && (
          <button
            type="button"
            className={classNames("close")}
            aria-label={globalLocale.close}
            {...ariaProps}
            onClick={onClose}
          >
            {closable.closeIcon || <CloseIcon prefixCls={prefixCls} />}
          </button>
        )}
        {isNonNullable(cover) && (
          <div className={classNames("cover")}>{cover}</div>
        )}
        {isNonNullable(title) && (
          <div className={classNames("header")}>
            <div id={titleId} className={classNames("title")}>
              {title}
            </div>
          </div>
        )}
        {isNonNullable(description) && (
          <div className={classNames("description")}>{description}</div>
        )}
        <div className={classNames("footer")}>
          {total > 1 && (
            <div className={classNames("indicators")}>
              {indicatorsRender
                ? indicatorsRender(current, total)
                : Array.from({ length: total }, (_, index) => (
                    <span
                      key={index}
                      className={classNames(
                        "indicator",
                        index === current
                          ? classNames("indicator-active")
                          : undefined,
                      )}
                    />
                  ))}
            </div>
          )}
          <div className={classNames("buttons")}>
            {actionsRender
              ? actionsRender(defaultActions, { current, total })
              : defaultActions}
          </div>
        </div>
      </div>
    </div>
  );
}
