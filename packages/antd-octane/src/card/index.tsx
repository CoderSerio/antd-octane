/** @jsxImportSource octane */
import type { CSSProperties, HTMLAttributes, OctaneNode } from "octane";
import { useComponentTokens } from "../_util/tokens";
import { useConfig } from "../config-provider";
import { Skeleton } from "../skeleton";
export interface CardProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title?: OctaneNode;
  extra?: OctaneNode;
  cover?: OctaneNode;
  actions?: OctaneNode[];
  bordered?: boolean;
  hoverable?: boolean;
  size?: "default" | "small";
  loading?: boolean;
  type?: "inner";
  style?: CSSProperties;
  headStyle?: CSSProperties;
  bodyStyle?: CSSProperties;
  styles?: {
    header?: CSSProperties;
    body?: CSSProperties;
    cover?: CSSProperties;
    actions?: CSSProperties;
  };
  classNames?: {
    header?: string;
    body?: string;
    cover?: string;
    actions?: string;
  };
}
function InternalCard({
  title,
  extra,
  cover,
  actions,
  bordered = true,
  hoverable = false,
  size = "default",
  loading = false,
  type,
  children,
  style,
  className,
  headStyle,
  bodyStyle,
  styles,
  classNames,
  ...rest
}: CardProps) {
  const { token: t, base } = useComponentTokens("Card");
  const c = useConfig().theme.components?.Card;
  const small = size === "small";
  return (
    <div
      {...rest}
      className={[
        "ant-card",
        bordered && "ant-card-bordered",
        hoverable && "ant-card-hoverable",
        className,
      ]}
      aria-busy={loading || undefined}
      style={{
        ...base,
        "--ao-card-body-padding": `${small ? (c?.bodyPaddingSM ?? 12) : (c?.bodyPadding ?? t.paddingLG)}px`,
        "--ao-card-header-padding": `${small ? (c?.headerPaddingSM ?? 12) : (c?.headerPadding ?? t.paddingLG)}px`,
        "--ao-card-header-height": `${small ? (c?.headerHeightSM ?? t.fontSize * t.lineHeight + t.paddingXS * 2) : (c?.headerHeight ?? t.fontSizeLG * t.lineHeightLG + t.padding * 2)}px`,
        "--ao-card-header-size": `${small ? (c?.headerFontSizeSM ?? t.fontSize) : (c?.headerFontSize ?? t.fontSizeLG)}px`,
        "--ao-card-header-bg":
          c?.headerBg ?? (type === "inner" ? t.colorFillAlter : "transparent"),
        "--ao-card-actions-bg": c?.actionsBg ?? t.colorBgContainer,
        "--ao-card-extra": c?.extraColor ?? t.colorText,
        "--ao-card-shadow": t.boxShadowCard,
        "--ao-card-weight": t.fontWeightStrong,
        ...style,
      }}
    >
      {(title !== undefined || extra !== undefined) && (
        <div
          className={["ant-card-head", classNames?.header]}
          style={{ ...headStyle, ...styles?.header }}
        >
          <div className="ant-card-head-title">{title}</div>
          {extra && <div className="ant-card-extra">{extra}</div>}
        </div>
      )}
      {cover && (
        <div
          className={["ant-card-cover", classNames?.cover]}
          style={styles?.cover}
        >
          {cover}
        </div>
      )}
      <div
        className={["ant-card-body", classNames?.body]}
        style={{ ...bodyStyle, ...styles?.body }}
      >
        {loading ? (
          <Skeleton active paragraph={{ rows: 4 }} title={false} />
        ) : (
          children
        )}
      </div>
      {Boolean(actions?.length) && (
        <ul
          className={["ant-card-actions", classNames?.actions]}
          style={styles?.actions}
        >
          {actions?.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
export interface CardMetaProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title?: OctaneNode;
  description?: OctaneNode;
  avatar?: OctaneNode;
  style?: CSSProperties;
}
function Meta({
  title,
  description,
  avatar,
  className,
  ...rest
}: CardMetaProps) {
  return (
    <div {...rest} className={["ant-card-meta", className]}>
      {avatar && <div className="ant-card-meta-avatar">{avatar}</div>}
      <div className="ant-card-meta-detail">
        {title && <div className="ant-card-meta-title">{title}</div>}
        {description && (
          <div className="ant-card-meta-description">{description}</div>
        )}
      </div>
    </div>
  );
}
export const Card = Object.assign(InternalCard, { Meta });
