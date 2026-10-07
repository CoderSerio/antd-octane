/** @jsxImportSource octane */
// Ant Design 5.29.3 List/Item.tsx (MIT), adapted to Octane.
import type { CSSProperties, HTMLAttributes, OctaneNode, Ref } from "octane";
import { Children, useContext } from "octane";
import { useConfig } from "../config-provider";
import { Col } from "../grid";
import { ListContext } from "./context";

type SemanticName = "actions" | "extra";

export interface ListItemProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "ref"> {
  ref?: Ref<HTMLDivElement>;
  prefixCls?: string;
  actions?: OctaneNode[];
  extra?: OctaneNode;
  classNames?: Partial<Record<SemanticName, string>>;
  styles?: Partial<Record<SemanticName, CSSProperties>>;
  colStyle?: CSSProperties;
  style?: CSSProperties;
}

export function Item({
  ref,
  prefixCls,
  actions,
  extra,
  children,
  className,
  classNames,
  styles,
  colStyle,
  style,
  ...rest
}: ListItemProps) {
  const { grid, itemLayout = "horizontal" } = useContext(ListContext);
  const config = useConfig();
  const itemPrefixCls = config.getPrefixCls("list", prefixCls);
  const hasMixedText =
    Children.count(children) > 1 &&
    Children.toArray(children).some((child) => typeof child === "string");
  const noFlex = itemLayout === "vertical" ? !extra : hasMixedText;
  const itemClasses = [
    itemPrefixCls !== "ant-list" && `${itemPrefixCls}-item`,
    "ant-list-item",
    noFlex && itemPrefixCls !== "ant-list" && `${itemPrefixCls}-item-no-flex`,
    noFlex && "ant-list-item-no-flex",
    className,
  ];
  const actionsContent = actions?.length ? (
    <ul
      className={[
        itemPrefixCls !== "ant-list" && `${itemPrefixCls}-item-action`,
        "ant-list-item-action",
        config.list?.item?.classNames?.actions,
        classNames?.actions,
      ]}
      style={{ ...config.list?.item?.styles?.actions, ...styles?.actions }}
    >
      {actions.map((action, index) => (
        <li key={`${itemPrefixCls}-item-action-${index}`}>
          {action}
          {index < actions.length - 1 && (
            <em
              className={[
                itemPrefixCls !== "ant-list" &&
                  `${itemPrefixCls}-item-action-split`,
                "ant-list-item-action-split",
              ]}
            />
          )}
        </li>
      ))}
    </ul>
  ) : null;
  const content =
    itemLayout === "vertical" && extra ? (
      <>
        <div
          className={[
            itemPrefixCls !== "ant-list" && `${itemPrefixCls}-item-main`,
            "ant-list-item-main",
          ]}
        >
          {children}
          {actionsContent}
        </div>
        <div
          className={[
            itemPrefixCls !== "ant-list" && `${itemPrefixCls}-item-extra`,
            "ant-list-item-extra",
            config.list?.item?.classNames?.extra,
            classNames?.extra,
          ]}
          style={{ ...config.list?.item?.styles?.extra, ...styles?.extra }}
        >
          {extra}
        </div>
      </>
    ) : (
      <>
        {children}
        {actionsContent}
        {extra}
      </>
    );

  if (grid) {
    return (
      <Col ref={ref} flex={1} style={colStyle}>
        <div {...rest} className={itemClasses} style={style}>
          {content}
        </div>
      </Col>
    );
  }

  return (
    <li
      {...(rest as HTMLAttributes<HTMLLIElement>)}
      ref={ref as unknown as Ref<HTMLLIElement>}
      className={itemClasses}
      style={style}
    >
      {content}
    </li>
  );
}

export interface ListItemMetaProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  prefixCls?: string;
  avatar?: OctaneNode;
  title?: OctaneNode;
  description?: OctaneNode;
}

export function Meta({
  prefixCls,
  avatar,
  title,
  description,
  className,
  ...rest
}: ListItemMetaProps) {
  const prefix = useConfig().getPrefixCls("list", prefixCls);
  return (
    <div
      {...rest}
      className={[
        prefix !== "ant-list" && `${prefix}-item-meta`,
        "ant-list-item-meta",
        className,
      ]}
    >
      {avatar && (
        <div
          className={[
            prefix !== "ant-list" && `${prefix}-item-meta-avatar`,
            "ant-list-item-meta-avatar",
          ]}
        >
          {avatar}
        </div>
      )}
      {(title || description) && (
        <div
          className={[
            prefix !== "ant-list" && `${prefix}-item-meta-content`,
            "ant-list-item-meta-content",
          ]}
        >
          {title && (
            <h4
              className={[
                prefix !== "ant-list" && `${prefix}-item-meta-title`,
                "ant-list-item-meta-title",
              ]}
            >
              {title}
            </h4>
          )}
          {description && (
            <div
              className={[
                prefix !== "ant-list" && `${prefix}-item-meta-description`,
                "ant-list-item-meta-description",
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

export const ListItem = Object.assign(Item, { Meta });
