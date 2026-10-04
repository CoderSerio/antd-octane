/** @jsxImportSource octane */
// Adapted from Ant Design 5.29.3 components/result/index.tsx (MIT).
import type { CSSProperties, OctaneNode } from "octane";
import {
  CheckCircleFilled,
  CloseCircleFilled,
  ExclamationCircleFilled,
  WarningFilled,
} from "../_util/feedback-icons";
import { devUseWarning } from "../_util/warning";
import { useConfig } from "../config-provider";
import NoFound from "./noFound";
import ServerError from "./serverError";
import Unauthorized from "./unauthorized";
import useResultStyle from "./useResultStyle";

export const IconMap = {
  success: CheckCircleFilled,
  error: CloseCircleFilled,
  info: ExclamationCircleFilled,
  warning: WarningFilled,
};
export const ExceptionMap = {
  "404": NoFound,
  "500": ServerError,
  "403": Unauthorized,
};
export type ExceptionStatusType = 403 | 404 | 500 | "403" | "404" | "500";
export type ResultStatusType = ExceptionStatusType | keyof typeof IconMap;
export interface ResultProps {
  icon?: OctaneNode;
  status?: ResultStatusType;
  title?: OctaneNode;
  subTitle?: OctaneNode;
  extra?: OctaneNode;
  prefixCls?: string;
  className?: string;
  rootClassName?: string;
  style?: CSSProperties;
  children?: OctaneNode;
}

function partClass(prefixCls: string, part: string) {
  return [...new Set([`ant-result-${part}`, `${prefixCls}-${part}`])].join(" ");
}
function Icon({
  prefixCls,
  icon,
  status,
}: Pick<ResultProps, "icon"> & {
  prefixCls: string;
  status: ResultStatusType;
}) {
  const warning = devUseWarning("Result");
  warning(
    !(typeof icon === "string" && icon.length > 2),
    "breaking",
    `\`icon\` accepts OctaneNode instead of a string icon name. Please check \`${icon}\` at https://ant.design/components/icon`,
  );
  const Exception = ExceptionMap[String(status) as keyof typeof ExceptionMap];
  if (Exception) {
    return (
      <div
        className={`${partClass(prefixCls, "icon")} ${partClass(prefixCls, "image")}`}
      >
        <Exception />
      </div>
    );
  }
  if (icon === null || icon === false) return null;
  const StatusIcon = IconMap[status as keyof typeof IconMap];
  const label =
    status === "success"
      ? "check-circle"
      : status === "error"
        ? "close-circle"
        : status === "warning"
          ? "warning"
          : "exclamation-circle";
  return (
    <div className={partClass(prefixCls, "icon")}>
      {icon || <StatusIcon aria-label={label} />}
    </div>
  );
}
function Extra({
  prefixCls,
  extra,
}: Pick<ResultProps, "extra"> & { prefixCls: string }) {
  if (!extra) return null;
  return <div className={partClass(prefixCls, "extra")}>{extra}</div>;
}
function InternalResult({
  prefixCls: customPrefix,
  className,
  rootClassName,
  subTitle,
  title,
  style,
  children,
  status = "info",
  icon,
  extra,
}: ResultProps) {
  const config = useConfig();
  const prefixCls = config.getPrefixCls("result", customPrefix);
  const tokenStyle = useResultStyle(status);
  return (
    <div
      className={[
        ...new Set([
          "ant-result",
          prefixCls,
          `ant-result-${status}`,
          `${prefixCls}-${status}`,
          className,
          config.result?.className,
          rootClassName,
          config.direction === "rtl" && "ant-result-rtl",
          config.direction === "rtl" && `${prefixCls}-rtl`,
        ]),
      ]}
      style={{ ...tokenStyle, ...config.result?.style, ...style }}
    >
      <Icon prefixCls={prefixCls} status={status} icon={icon} />
      <div className={partClass(prefixCls, "title")}>{title}</div>
      {subTitle && (
        <div className={partClass(prefixCls, "subtitle")}>{subTitle}</div>
      )}
      <Extra prefixCls={prefixCls} extra={extra} />
      {children && (
        <div className={partClass(prefixCls, "content")}>{children}</div>
      )}
    </div>
  );
}

export const Result = Object.assign(InternalResult, {
  PRESENTED_IMAGE_403: ExceptionMap["403"],
  PRESENTED_IMAGE_404: ExceptionMap["404"],
  PRESENTED_IMAGE_500: ExceptionMap["500"],
});
