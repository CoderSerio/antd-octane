// Ant Design 5.29.3 components/skeleton/Skeleton.tsx (MIT), adapted to Octane.
import { useConfig } from "../config-provider";
import Element from "./Element";
import type {
  SkeletonAvatarProps,
  SkeletonParagraphProps,
  SkeletonProps,
  SkeletonTitleProps,
} from "./interface";
import Paragraph from "./Paragraph";
import Title from "./Title";
import useSkeletonStyle from "./useSkeletonStyle";

function getComponentProps<T>(prop?: T | boolean): T | Record<string, never> {
  return prop && typeof prop === "object" ? prop : {};
}
function getAvatarBasicProps(
  hasTitle: boolean,
  hasParagraph: boolean,
): Omit<SkeletonAvatarProps, "active"> {
  return {
    size: "large",
    shape: hasTitle && !hasParagraph ? "square" : "circle",
  };
}
function getTitleBasicProps(
  hasAvatar: boolean,
  hasParagraph: boolean,
): SkeletonTitleProps {
  return hasParagraph ? { width: hasAvatar ? "50%" : "38%" } : {};
}
function getParagraphBasicProps(
  hasAvatar: boolean,
  hasTitle: boolean,
): SkeletonParagraphProps {
  return {
    ...(!hasAvatar || !hasTitle ? { width: "61%" } : {}),
    rows: !hasAvatar && hasTitle ? 3 : 2,
  };
}
export default function InternalSkeleton(props: SkeletonProps) {
  const {
    prefixCls: customPrefix,
    loading,
    className,
    rootClassName,
    style,
    children,
    avatar = false,
    title = true,
    paragraph = true,
    active,
    round,
  } = props;
  const config = useConfig();
  const prefixCls = config.getPrefixCls("skeleton", customPrefix);
  const { style: base } = useSkeletonStyle();
  if (!(loading || !("loading" in props))) return children ?? null;
  const hasAvatar = !!avatar,
    hasTitle = !!title,
    hasParagraph = !!paragraph;
  const avatarProps = {
    prefixCls: `${prefixCls}-avatar`,
    ...getAvatarBasicProps(hasTitle, hasParagraph),
    ...getComponentProps(avatar),
  };
  const titleProps = {
    prefixCls: `${prefixCls}-title`,
    ...getTitleBasicProps(hasAvatar, hasParagraph),
    ...getComponentProps(title),
  };
  const paragraphProps = {
    prefixCls: `${prefixCls}-paragraph`,
    ...getParagraphBasicProps(hasAvatar, hasTitle),
    ...getComponentProps(paragraph),
  };
  return (
    <div
      className={[
        "ant-skeleton",
        prefixCls,
        hasAvatar && "ant-skeleton-with-avatar",
        hasAvatar && `${prefixCls}-with-avatar`,
        active && "ant-skeleton-active",
        active && `${prefixCls}-active`,
        round && "ant-skeleton-round",
        round && `${prefixCls}-round`,
        config.direction === "rtl" && "ant-skeleton-rtl",
        config.direction === "rtl" && `${prefixCls}-rtl`,
        config.skeleton?.className,
        className,
        rootClassName,
      ]}
      style={{ ...base, ...config.skeleton?.style, ...style }}
    >
      {hasAvatar && (
        <div className={["ant-skeleton-header", `${prefixCls}-header`]}>
          <Element
            {...avatarProps}
            nativePrefixCls={
              avatarProps.prefixCls === `${prefixCls}-avatar`
                ? "ant-skeleton-avatar"
                : undefined
            }
          />
        </div>
      )}
      {(hasTitle || hasParagraph) && (
        <div className={["ant-skeleton-content", `${prefixCls}-content`]}>
          {hasTitle && (
            <Title
              {...titleProps}
              nativePrefixCls={
                titleProps.prefixCls === `${prefixCls}-title`
                  ? "ant-skeleton-title"
                  : undefined
              }
            />
          )}
          {hasParagraph && (
            <Paragraph
              {...paragraphProps}
              nativePrefixCls={
                paragraphProps.prefixCls === `${prefixCls}-paragraph`
                  ? "ant-skeleton-paragraph"
                  : undefined
              }
            />
          )}
        </div>
      )}
    </div>
  );
}
