/** @jsxImportSource octane */
import type { CSSProperties, HTMLAttributes, OctaneNode } from "octane";

import { useConfig } from "../config-provider";

export interface CardMetaProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  prefixCls?: string;
  title?: OctaneNode;
  description?: OctaneNode;
  avatar?: OctaneNode;
  style?: CSSProperties;
}

export function Meta({
  prefixCls,
  title,
  description,
  avatar,
  className,
  ...rest
}: CardMetaProps) {
  const prefix = useConfig().getPrefixCls("card", prefixCls);
  return (
    <div
      {...rest}
      className={[
        `${prefix}-meta`,
        prefix !== "ant-card" && "ant-card-meta",
        className,
      ]}
    >
      {avatar && (
        <div
          className={[
            `${prefix}-meta-avatar`,
            prefix !== "ant-card" && "ant-card-meta-avatar",
          ]}
        >
          {avatar}
        </div>
      )}
      {(title || description) && (
        <div
          className={[
            `${prefix}-meta-detail`,
            prefix !== "ant-card" && "ant-card-meta-detail",
          ]}
        >
          {title && (
            <div
              className={[
                `${prefix}-meta-title`,
                prefix !== "ant-card" && "ant-card-meta-title",
              ]}
            >
              {title}
            </div>
          )}
          {description && (
            <div
              className={[
                `${prefix}-meta-description`,
                prefix !== "ant-card" && "ant-card-meta-description",
              ]}
            >
              {description}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
