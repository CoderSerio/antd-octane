/** @jsxImportSource octane */
import type { HTMLAttributes } from "octane";

import { useConfig } from "../config-provider";

export interface CardGridProps extends HTMLAttributes<HTMLDivElement> {
  prefixCls?: string;
  hoverable?: boolean;
}

export function Grid({
  prefixCls,
  hoverable = true,
  className,
  ...rest
}: CardGridProps) {
  const prefix = useConfig().getPrefixCls("card", prefixCls);
  return (
    <div
      {...rest}
      className={[
        `${prefix}-grid`,
        prefix !== "ant-card" && "ant-card-grid",
        hoverable && `${prefix}-grid-hoverable`,
        hoverable && prefix !== "ant-card" && "ant-card-grid-hoverable",
        className,
      ]}
    />
  );
}
