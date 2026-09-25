import type { CSSProperties, HTMLAttributes, OctaneNode } from "octane";
import { useComponentTokens } from "../_util/tokens";

type Width = string | number;
export interface SkeletonElementProps extends HTMLAttributes<HTMLDivElement> {
  active?: boolean;
  size?: "small" | "default" | "large" | number;
  shape?: "circle" | "square" | "round" | "default";
  block?: boolean;
  style?: CSSProperties;
}
export interface SkeletonProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  loading?: boolean;
  active?: boolean;
  round?: boolean;
  avatar?: boolean | SkeletonElementProps;
  title?: boolean | { width?: Width; style?: CSSProperties };
  paragraph?:
    | boolean
    | { rows?: number; width?: Width | Width[]; style?: CSSProperties };
  style?: CSSProperties;
}
function useSkeletonStyle() {
  const { token: t, component: c, base } = useComponentTokens("Skeleton");
  return {
    t,
    style: {
      ...base,
      "--ao-skeleton-from":
        c?.gradientFromColor ?? c?.color ?? t.colorFillContent,
      "--ao-skeleton-to":
        c?.gradientToColor ?? c?.colorGradientEnd ?? t.colorFill,
      "--ao-skeleton-title": `${c?.titleHeight ?? t.controlHeight / 2}px`,
      "--ao-skeleton-radius": `${c?.blockRadius ?? t.borderRadiusSM}px`,
      "--ao-skeleton-margin": `${c?.paragraphMarginTop ?? t.marginLG + t.marginXXS}px`,
      "--ao-skeleton-line": `${c?.paragraphLiHeight ?? t.controlHeight / 2}px`,
      "--ao-skeleton-gap": `${t.marginSM}px`,
      "--ao-skeleton-title-gap": `${t.controlHeightSM}px`,
      "--ao-skeleton-row-gap": `${t.controlHeightXS}px`,
      "--ao-skeleton-avatar-gap": `${t.padding}px`,
    },
  };
}
function Element({
  kind,
  decorative = false,
  active = false,
  size = "default",
  shape = "default",
  block,
  className,
  style,
  children,
  ...rest
}: SkeletonElementProps & {
  kind: "button" | "avatar" | "input" | "image" | "node";
  decorative?: boolean;
}) {
  const { t, style: base } = useSkeletonStyle();
  const height =
    typeof size === "number"
      ? size
      : size === "large"
        ? t.controlHeightLG
        : size === "small"
          ? t.controlHeightSM
          : t.controlHeight;
  const width =
    kind === "avatar" || (kind === "button" && shape === "circle")
      ? height
      : kind === "button"
        ? height * 2
        : kind === "input"
          ? height * 5
          : 96;
  return (
    // biome-ignore lint/a11y/useAriaPropsSupportedByRole: Decorative variants remove both role and label together.
    <div
      {...rest}
      className={[
        "ant-skeleton",
        "ant-skeleton-element",
        active && "ant-skeleton-active",
        block && "ant-skeleton-block",
        className,
      ]}
      style={base}
      role={decorative ? undefined : "status"}
      aria-label={decorative ? undefined : (rest["aria-label"] ?? "正在加载")}
      aria-hidden={decorative || undefined}
    >
      <span
        className={[`ant-skeleton-${kind}`, `ant-skeleton-${kind}-${shape}`]}
        style={{
          width: block ? "100%" : width,
          height: kind === "image" || kind === "node" ? 96 : height,
          ...style,
        }}
        aria-hidden="true"
      >
        {children ??
          (kind === "image" ? (
            <svg viewBox="0 0 48 48" width="48" height="48">
              <title>图片占位</title>
              <path fill="currentColor" d="M6 8h36v32H6z" opacity=".2" />
              <path fill="currentColor" d="m8 34 10-12 8 8 6-5 8 9z" />
              <circle fill="currentColor" cx="31" cy="17" r="4" />
            </svg>
          ) : null)}
      </span>
    </div>
  );
}
function InternalSkeleton({
  loading = true,
  active,
  round,
  avatar = false,
  title = true,
  paragraph = true,
  children,
  className,
  style,
  ...rest
}: SkeletonProps) {
  const { style: base } = useSkeletonStyle();
  if (!loading) return children ?? null;
  const avatarProps = typeof avatar === "object" ? avatar : {};
  const titleProps = typeof title === "object" ? title : {};
  const p = typeof paragraph === "object" ? paragraph : {};
  const requestedRows = p.rows ?? (!avatar && title ? 3 : 2);
  const rows = Number.isFinite(requestedRows)
    ? Math.max(0, Math.floor(requestedRows))
    : 0;
  const defaultWidth = !avatar || !title || rows > 2 ? "61%" : "100%";
  return (
    <div
      {...rest}
      className={[
        "ant-skeleton",
        avatar && "ant-skeleton-with-avatar",
        active && "ant-skeleton-active",
        round && "ant-skeleton-round",
        className,
      ]}
      style={{ ...base, ...style }}
      role="status"
      aria-label={rest["aria-label"] ?? "正在加载"}
    >
      {avatar && (
        <div className="ant-skeleton-header">
          <Element
            kind="avatar"
            decorative
            size="large"
            shape={title && !paragraph ? "square" : "circle"}
            {...avatarProps}
          />
        </div>
      )}
      {(title || paragraph) && (
        <div className="ant-skeleton-content" aria-hidden="true">
          {title && (
            <div
              className="ant-skeleton-title"
              style={{
                width:
                  titleProps.width ??
                  (paragraph ? (avatar ? "50%" : "38%") : undefined),
                ...titleProps.style,
              }}
            />
          )}
          {paragraph && (
            <ul className="ant-skeleton-paragraph" style={p.style}>
              {Array.from({ length: rows }, (_, i) => (
                <li
                  key={i}
                  style={{
                    width: Array.isArray(p.width)
                      ? p.width[i]
                      : i === rows - 1
                        ? (p.width ?? defaultWidth)
                        : undefined,
                  }}
                />
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
export const Skeleton = Object.assign(InternalSkeleton, {
  Button: (props: SkeletonElementProps) => <Element kind="button" {...props} />,
  Avatar: (props: SkeletonElementProps) => (
    <Element kind="avatar" shape="circle" {...props} />
  ),
  Input: (props: SkeletonElementProps) => <Element kind="input" {...props} />,
  Image: (props: SkeletonElementProps) => <Element kind="image" {...props} />,
  Node: (props: SkeletonElementProps & { children?: OctaneNode }) => (
    <Element kind="node" {...props} />
  ),
});
