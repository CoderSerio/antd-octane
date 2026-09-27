/** @jsxImportSource octane */
import type { CSSProperties, HTMLAttributes, OctaneNode } from "octane";
import { useComponentTokens } from "../_util/tokens";
export interface ResultProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  status?: "success" | "error" | "info" | "warning" | "403" | "404" | "500";
  title?: OctaneNode;
  subTitle?: OctaneNode;
  icon?: OctaneNode;
  extra?: OctaneNode;
  children?: OctaneNode;
  style?: CSSProperties;
}
export function Result({
  status = "info",
  title,
  subTitle,
  icon,
  extra,
  children,
  className,
  style,
  ...rest
}: ResultProps) {
  const { token: t, component: c, base } = useComponentTokens("Result");
  const http = status === "403" || status === "404" || status === "500";
  const color =
    status === "success"
      ? t.colorSuccess
      : status === "error"
        ? t.colorError
        : status === "warning"
          ? t.colorWarning
          : t.colorInfo;
  return (
    <div
      {...rest}
      className={["ant-result", `ant-result-${status}`, className]}
      style={{
        ...base,
        "--ao-result-color": color,
        "--ao-result-title-color": t.colorTextHeading,
        "--ao-result-title-line": t.lineHeightHeading3,
        "--ao-result-title-size": `${c?.titleFontSize ?? t.fontSizeHeading3}px`,
        "--ao-result-subtitle-size": `${c?.subtitleFontSize ?? t.fontSize}px`,
        "--ao-result-icon-size": `${c?.iconFontSize ?? t.fontSizeHeading3 * 3}px`,
        "--ao-result-extra-margin": c?.extraMargin ?? `${t.paddingLG}px 0 0`,
        "--ao-result-padding": `${t.paddingLG * 2}px ${t.paddingXL}px`,
        "--ao-result-content-padding": `${t.paddingLG}px ${t.padding * 2.5}px`,
        "--ao-result-content-bg": t.colorFillAlter,
        "--ao-result-gap": `${t.marginXS}px`,
        "--ao-result-block-gap": `${t.paddingLG}px`,
        ...style,
      }}
    >
      {icon !== null && icon !== false && (
        <div className="ant-result-icon">
          {icon ??
            (http ? (
              <span className="ant-result-http">{status}</span>
            ) : (
              <svg viewBox="0 0 64 64" aria-hidden="true">
                <circle cx="32" cy="32" r="30" fill="currentColor" />
                <g
                  fill="none"
                  stroke="var(--ao-bg)"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {status === "success" ? (
                    <path d="m18 32 9 9 20-21" />
                  ) : status === "error" ? (
                    <path d="m22 22 20 20m0-20L22 42" />
                  ) : status === "warning" ? (
                    <path d="M32 18v18m0 9v1" />
                  ) : (
                    <path d="M32 29v17m0-29v1" />
                  )}
                </g>
              </svg>
            ))}
        </div>
      )}
      {title !== undefined && <div className="ant-result-title">{title}</div>}
      {subTitle !== undefined && (
        <div className="ant-result-subtitle">{subTitle}</div>
      )}
      {extra !== undefined && <div className="ant-result-extra">{extra}</div>}
      {children !== undefined && (
        <div className="ant-result-content">{children}</div>
      )}
    </div>
  );
}
