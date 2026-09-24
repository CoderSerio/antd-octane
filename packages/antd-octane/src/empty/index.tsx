import type { CSSProperties, HTMLAttributes, OctaneNode } from "octane";
import { useComponentTokens } from "../_util/tokens";
export interface EmptyProps extends HTMLAttributes<HTMLDivElement> {
  image?: OctaneNode;
  imageStyle?: CSSProperties;
  description?: OctaneNode;
  style?: CSSProperties;
}
const SIMPLE = "antd-octane:empty-simple";
const DEFAULT = "antd-octane:empty-default";
function EmptyImage() {
  return (
    <svg aria-hidden="true" width="64" height="41" viewBox="0 0 64 41">
      <ellipse cx="32" cy="36" rx="30" ry="5" fill="var(--ao-empty-shadow)" />
      <path
        d="M8 14 18 2h28l10 12v20H8Z"
        fill="var(--ao-empty-fill)"
        stroke="var(--ao-empty-stroke)"
      />
      <path
        d="M8 14h15l3 6h12l3-6h15"
        fill="none"
        stroke="var(--ao-empty-stroke)"
      />
    </svg>
  );
}
function InternalEmpty({
  image = DEFAULT,
  imageStyle,
  description = "暂无数据",
  children,
  className,
  style,
  ...rest
}: EmptyProps) {
  const { token: t, base } = useComponentTokens("Empty");
  const simple = image === SIMPLE;
  return (
    <div
      {...rest}
      className={["ant-empty", simple && "ant-empty-normal", className]}
      style={{
        ...base,
        "--ao-empty-fill": t.colorFillQuaternary,
        "--ao-empty-shadow": t.colorFillTertiary,
        "--ao-empty-stroke": t.colorBorder,
        "--ao-empty-image-height": `${simple ? t.controlHeightLG : t.controlHeightLG * 2.5}px`,
        "--ao-empty-margin": `${t.marginXL}px`,
        "--ao-empty-footer-gap": `${t.margin}px`,
        "--ao-empty-opacity": t.opacityImage,
        "--ao-empty-gap": `${t.marginXS}px`,
        ...style,
      }}
    >
      <div className="ant-empty-image" style={imageStyle}>
        {image === SIMPLE || image === DEFAULT ? (
          <EmptyImage />
        ) : typeof image === "string" ? (
          <img
            src={image}
            alt={typeof description === "string" ? description : ""}
          />
        ) : (
          image
        )}
      </div>
      {description !== null && description !== false && (
        <div className="ant-empty-description">{description}</div>
      )}
      {children !== undefined && (
        <div className="ant-empty-footer">{children}</div>
      )}
    </div>
  );
}
export const Empty = Object.assign(InternalEmpty, {
  PRESENTED_IMAGE_SIMPLE: SIMPLE,
  PRESENTED_IMAGE_DEFAULT: DEFAULT,
});
