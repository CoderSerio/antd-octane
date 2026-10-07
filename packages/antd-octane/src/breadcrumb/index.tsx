/** @jsxImportSource octane */
import type { CSSProperties, HTMLAttributes, OctaneNode } from "octane";
import { Children, isValidElement } from "octane";
import { componentClassName } from "../_util/componentClassName";
import { DownOutlined } from "../_util/layout-icons";
import { useComponentTokens } from "../_util/tokens";
import { useConfig } from "../config-provider";
import { Dropdown, type DropdownProps } from "../dropdown";
import type { MenuItem, MenuProps } from "../menu";
export interface BreadcrumbItem {
  key?: string | number;
  title?: OctaneNode;
  href?: string;
  path?: string;
  breadcrumbName?: string;
  children?: BreadcrumbItem[];
  menu?: Omit<MenuProps, "items"> & {
    items?: (Omit<MenuItem, "title"> & {
      title?: OctaneNode;
      path?: string;
      href?: string;
    })[];
  };
  dropdownProps?: DropdownProps;
  overlay?: OctaneNode;
  onClick?: (event: MouseEvent) => void;
  separator?: OctaneNode;
  type?: "separator";
  className?: string;
}
export interface BreadcrumbProps<
  T extends Record<string, unknown> = Record<string, unknown>,
> extends HTMLAttributes<HTMLElement> {
  items?: BreadcrumbItem[];
  routes?: BreadcrumbItem[];
  params?: T;
  itemRender?: (
    route: BreadcrumbItem,
    params: T,
    routes: BreadcrumbItem[],
    paths: string[],
  ) => OctaneNode;
  prefixCls?: string;
  rootClassName?: string;
  separator?: OctaneNode;
  style?: CSSProperties;
}
export interface BreadcrumbItemProps extends Omit<BreadcrumbItem, "children"> {
  children?: OctaneNode;
}
function Item(_props: BreadcrumbItemProps) {
  return null;
}
function Separator(_props: { children?: OctaneNode }) {
  return null;
}
export function Breadcrumb<
  T extends Record<string, unknown> = Record<string, unknown>,
>({
  items: customItems,
  routes,
  children,
  params = {} as T,
  itemRender,
  prefixCls: customPrefix,
  rootClassName,
  separator = "/",
  className,
  style,
  ...rest
}: BreadcrumbProps<T>) {
  const config = useConfig();
  const prefixCls = config.getPrefixCls("breadcrumb", customPrefix);
  const cls = (suffix = "") =>
    componentClassName("ant-breadcrumb", prefixCls, suffix);
  const legacy: BreadcrumbItem[] = [];
  Children.forEach(children, (child) => {
    if (!isValidElement<BreadcrumbItemProps>(child)) return;
    if (child.type === Item) {
      const { children: itemChildren, ...itemProps } = child.props;
      legacy.push({ ...itemProps, title: child.children ?? itemChildren });
    } else if (child.type === Separator)
      legacy.push({
        type: "separator",
        separator: child.children ?? child.props.children,
      });
  });
  const items: BreadcrumbItem[] =
    customItems ??
    routes?.map((route) => ({
      ...route,
      title: route.title ?? route.breadcrumbName,
      menu:
        route.menu ??
        (route.children
          ? {
              items: route.children.map((item) => ({
                key: item.key === undefined ? undefined : String(item.key),
                path: item.path,
                href: item.href,
                title: item.title ?? item.breadcrumbName,
              })),
            }
          : undefined),
    })) ??
    legacy;
  const paths: string[] = [];
  const resolve = (text: string) =>
    text.replace(/:([^/]+)/g, (match, key: string) =>
      params[key] === undefined ? match : String(params[key]),
    );
  const { token: t, component: c, base } = useComponentTokens("Breadcrumb");
  return (
    <nav
      {...rest}
      aria-label={rest["aria-label"] ?? "面包屑"}
      className={[
        cls(),
        config.direction === "rtl" && cls("-rtl"),
        config.breadcrumb?.className,
        className,
        rootClassName,
      ]}
      style={{
        ...base,
        "--ao-breadcrumb-item": c?.itemColor ?? t.colorTextDescription,
        "--ao-breadcrumb-last": c?.lastItemColor ?? t.colorText,
        "--ao-breadcrumb-link": c?.linkColor ?? t.colorTextDescription,
        "--ao-breadcrumb-hover": c?.linkHoverColor ?? t.colorText,
        "--ao-breadcrumb-hover-bg": t.colorBgTextHover,
        "--ao-breadcrumb-radius": `${t.borderRadiusSM}px`,
        "--ao-breadcrumb-height": `${t.fontHeight ?? t.fontSize * t.lineHeight}px`,
        "--ao-breadcrumb-padding": `${t.paddingXXS}px`,
        "--ao-breadcrumb-margin": `${t.marginXXS}px`,
        "--ao-breadcrumb-separator":
          c?.separatorColor ?? t.colorTextDescription,
        "--ao-breadcrumb-gap": `${c?.separatorMargin ?? t.marginXS}px`,
        direction: config.direction,
        ...config.breadcrumb?.style,
        ...style,
      }}
    >
      <ol>
        {items.map((item, index) => {
          if (item.path !== undefined)
            paths.push(resolve(item.path.replace(/^\//, "")));
          const href =
            item.path !== undefined ? `#/${paths.join("/")}` : item.href;
          const title =
            typeof item.title === "object"
              ? item.title
              : item.title === undefined || item.title === null
                ? null
                : String(item.title).replace(
                    /:([\w]+)/g,
                    (match, key: string) =>
                      params[key] === undefined ? match : String(params[key]),
                  );
          const node = itemRender ? (
            itemRender(item, params, customItems ?? routes ?? items, paths)
          ) : href !== undefined ? (
            <a href={href} onClick={item.onClick}>
              {title}
            </a>
          ) : item.onClick ? (
            <button type="button" onClick={item.onClick}>
              {title}
            </button>
          ) : (
            title
          );
          const content =
            item.menu || item.overlay ? (
              <Dropdown
                placement="bottom"
                {...item.dropdownProps}
                overlay={item.overlay}
                menu={
                  item.menu
                    ? {
                        ...item.menu,
                        items: item.menu.items?.map(
                          (
                            {
                              title: menuTitle,
                              label,
                              path,
                              href: menuHref,
                              ...menuItem
                            },
                            menuIndex,
                          ) => ({
                            ...menuItem,
                            key: menuItem.key ?? String(menuIndex),
                            label:
                              path || menuHref ? (
                                <a
                                  href={
                                    path ? `${href ?? ""}${path}` : menuHref
                                  }
                                >
                                  {label ?? menuTitle}
                                </a>
                              ) : (
                                (label ?? menuTitle)
                              ),
                          }),
                        ),
                      }
                    : undefined
                }
              >
                <span className={cls("-overlay-link")}>
                  {node}
                  <DownOutlined />
                </span>
              </Dropdown>
            ) : (
              node
            );
          return item.type === "separator" ? (
            <li
              key={item.key ?? index}
              className={cls("-separator")}
              aria-hidden="true"
            >
              {item.separator ?? "/"}
            </li>
          ) : node !== undefined && node !== null ? (
            <li key={item.key ?? index} className={item.className}>
              <span
                className={cls("-link")}
                aria-current={index === items.length - 1 ? "page" : undefined}
              >
                {content}
              </span>
              {index < items.length - 1 &&
                items[index + 1]?.type !== "separator" && (
                  <span className={cls("-separator")} aria-hidden="true">
                    {item.separator ?? separator}
                  </span>
                )}
            </li>
          ) : null;
        })}
      </ol>
    </nav>
  );
}
Breadcrumb.Item = Item;
Breadcrumb.Separator = Separator;
