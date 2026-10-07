/** @jsxImportSource octane */
import type { CSSProperties, OctaneNode } from "octane";
import { useContext } from "octane";
import { DescriptionsContext, type SemanticName } from "./DescriptionsContext";

export interface CellProps {
  itemPrefixCls: string;
  span: number;
  className?: string;
  component: "th" | "td";
  style?: CSSProperties;
  styles?: Partial<Record<SemanticName, CSSProperties>>;
  classNames?: Partial<Record<SemanticName, string>>;
  bordered?: boolean;
  label?: OctaneNode;
  content?: OctaneNode;
  colon?: boolean;
  type: "label" | "content" | "item";
}

export default function Cell({
  itemPrefixCls,
  span,
  className,
  component: Component,
  style,
  styles,
  classNames,
  bordered,
  label,
  content,
  colon,
  type,
}: CellProps) {
  const context = useContext(DescriptionsContext);
  const part = (suffix: string) => [
    `${itemPrefixCls}-${suffix}`,
    itemPrefixCls !== "ant-descriptions" && `ant-descriptions-${suffix}`,
  ];
  const hasLabel = label !== undefined && label !== null;
  const hasContent = content !== undefined && content !== null;
  if (bordered) {
    return (
      <Component
        colSpan={span}
        style={style}
        className={[
          className,
          type !== "item" && part(`item-${type}`),
          type === "label" && context.classNames?.label,
          type === "content" && context.classNames?.content,
          type === "label" && classNames?.label,
          type === "content" && classNames?.content,
        ]}
      >
        {hasLabel && <span style={styles?.label}>{label}</span>}
        {hasContent && <span style={styles?.content}>{content}</span>}
      </Component>
    );
  }
  return (
    <Component
      colSpan={span}
      style={style}
      className={[part("item"), className]}
    >
      <div className={part("item-container")}>
        {hasLabel && (
          <span
            className={[
              part("item-label"),
              context.classNames?.label,
              classNames?.label,
              !colon && part("item-no-colon"),
            ]}
            style={styles?.label}
          >
            {label}
          </span>
        )}
        {hasContent && (
          <span
            className={[
              part("item-content"),
              context.classNames?.content,
              classNames?.content,
            ]}
            style={styles?.content}
          >
            {content}
          </span>
        )}
      </div>
    </Component>
  );
}
