import type { CSSProperties, HTMLAttributes, OctaneNode } from "octane";
import { useComponentTokens } from "../_util/tokens";
export interface BreadcrumbItem {
  key?: string | number;
  title?: OctaneNode;
  href?: string;
  onClick?: (event: MouseEvent) => void;
  separator?: OctaneNode;
  type?: "separator";
  className?: string;
}
export interface BreadcrumbProps extends HTMLAttributes<HTMLElement> {
  items?: BreadcrumbItem[];
  separator?: OctaneNode;
  style?: CSSProperties;
}
export function Breadcrumb({
  items = [],
  separator = "/",
  className,
  style,
  ...rest
}: BreadcrumbProps) {
  const { token: t, component: c, base } = useComponentTokens("Breadcrumb");
  return (
    <nav
      {...rest}
      aria-label={rest["aria-label"] ?? "面包屑"}
      className={["ant-breadcrumb", className]}
      style={{
        ...base,
        "--ao-breadcrumb-item": c?.itemColor ?? t.colorTextDescription,
        "--ao-breadcrumb-last": c?.lastItemColor ?? t.colorText,
        "--ao-breadcrumb-link": c?.linkColor ?? t.colorTextDescription,
        "--ao-breadcrumb-hover": c?.linkHoverColor ?? t.colorText,
        "--ao-breadcrumb-separator":
          c?.separatorColor ?? t.colorTextDescription,
        "--ao-breadcrumb-gap": `${c?.separatorMargin ?? t.marginXS}px`,
        ...style,
      }}
    >
      <ol>
        {items.map((item, index) =>
          item.type === "separator" ? (
            <li
              key={item.key ?? index}
              className="ant-breadcrumb-separator"
              aria-hidden="true"
            >
              {item.separator ?? separator}
            </li>
          ) : (
            <li key={item.key ?? index} className={item.className}>
              <span
                className="ant-breadcrumb-link"
                aria-current={index === items.length - 1 ? "page" : undefined}
              >
                {item.href ? (
                  <a href={item.href} onClick={item.onClick}>
                    {item.title}
                  </a>
                ) : item.onClick ? (
                  <button type="button" onClick={item.onClick}>
                    {item.title}
                  </button>
                ) : (
                  item.title
                )}
              </span>
              {index < items.length - 1 &&
                items[index + 1]?.type !== "separator" && (
                  <span className="ant-breadcrumb-separator" aria-hidden="true">
                    {item.separator ?? separator}
                  </span>
                )}
            </li>
          ),
        )}
      </ol>
    </nav>
  );
}
