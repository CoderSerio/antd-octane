/** @jsxImportSource octane */
import type { CSSProperties, HTMLAttributes, OctaneNode } from "octane";
import { useComponentTokens } from "../_util/tokens";
import { useConfig } from "../config-provider";
import { useLocale } from "../locale";
import DefaultEmptyImage from "./empty";
import SimpleEmptyImage from "./simple";
export interface EmptyProps extends HTMLAttributes<HTMLDivElement> {
  prefixCls?: string;
  rootClassName?: string;
  image?: OctaneNode;
  /** @deprecated Please use `styles.image` instead. */
  imageStyle?: CSSProperties;
  description?: OctaneNode;
  classNames?: {
    root?: string;
    image?: string;
    description?: string;
    footer?: string;
  };
  styles?: {
    root?: CSSProperties;
    image?: CSSProperties;
    description?: CSSProperties;
    footer?: CSSProperties;
  };
  style?: CSSProperties;
}
const SIMPLE = <SimpleEmptyImage />;
const DEFAULT = <DefaultEmptyImage />;
function InternalEmpty({
  prefixCls,
  image: imageProp,
  imageStyle,
  description,
  children,
  className,
  rootClassName,
  classNames,
  styles,
  style,
  ...rest
}: EmptyProps) {
  const { token: t, base } = useComponentTokens("Empty");
  const config = useConfig();
  const [locale] = useLocale("Empty");
  const context = config.empty;
  const des = description === undefined ? locale.description : description;
  const image = imageProp ?? context?.image ?? DEFAULT;
  const simple = image === SIMPLE;
  const prefix = config.getPrefixCls("empty", prefixCls);
  return (
    <div
      {...rest}
      className={[
        prefix,
        prefix !== "ant-empty" && "ant-empty",
        simple && `${prefix}-normal`,
        simple && prefix !== "ant-empty" && "ant-empty-normal",
        config.direction === "rtl" && `${prefix}-rtl`,
        context?.className,
        className,
        rootClassName,
        context?.classNames?.root,
        classNames?.root,
      ]}
      style={{
        ...base,
        "--ao-empty-image-height": `${simple ? t.controlHeightLG : t.controlHeightLG * 2.5}px`,
        "--ao-empty-image-small-height": `${t.controlHeightLG * 0.875}px`,
        "--ao-empty-margin": `${t.marginXL}px`,
        "--ao-empty-footer-gap": `${t.margin}px`,
        "--ao-empty-opacity": t.opacityImage,
        "--ao-empty-gap": `${t.marginXS}px`,
        "--ao-empty-inline": `${t.marginXS}px`,
        ...context?.styles?.root,
        ...context?.style,
        ...styles?.root,
        ...style,
      }}
    >
      <div
        className={[
          `${prefix}-image`,
          prefix !== "ant-empty" && "ant-empty-image",
          context?.classNames?.image,
          classNames?.image,
        ]}
        style={{ ...imageStyle, ...context?.styles?.image, ...styles?.image }}
      >
        {typeof image === "string" ? (
          <img
            src={image}
            alt={typeof des === "string" ? des : "empty"}
            draggable={false}
          />
        ) : (
          image
        )}
      </div>
      {des && (
        <div
          className={[
            `${prefix}-description`,
            prefix !== "ant-empty" && "ant-empty-description",
            context?.classNames?.description,
            classNames?.description,
          ]}
          style={{ ...context?.styles?.description, ...styles?.description }}
        >
          {des}
        </div>
      )}
      {children && (
        <div
          className={[
            `${prefix}-footer`,
            prefix !== "ant-empty" && "ant-empty-footer",
            context?.classNames?.footer,
            classNames?.footer,
          ]}
          style={{ ...context?.styles?.footer, ...styles?.footer }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
export const Empty = Object.assign(InternalEmpty, {
  PRESENTED_IMAGE_SIMPLE: SIMPLE,
  PRESENTED_IMAGE_DEFAULT: DEFAULT,
});
