/** @jsxImportSource octane */
import type {
  CSSProperties,
  ElementDescriptor,
  HTMLAttributes,
  OctaneNode,
  Ref,
} from "octane";
import {
  Children,
  cloneElement,
  createContext,
  descriptorChildren,
  Fragment,
  isChildrenBlock,
  isValidElement,
  useContext,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
} from "octane";
import { ConfigProvider, useConfig } from "../config-provider";
export type SpaceSize = "small" | "middle" | "large" | number;
export interface SpaceProps extends HTMLAttributes<HTMLDivElement> {
  style?: CSSProperties;
  direction?: "horizontal" | "vertical";
  size?: SpaceSize | [SpaceSize, SpaceSize];
  align?: "start" | "end" | "center" | "baseline";
  wrap?: boolean;
  split?: OctaneNode;
}
function InternalSpace({
  direction = "horizontal",
  size = "small",
  align,
  wrap = false,
  split,
  className,
  style,
  children,
  ...rest
}: SpaceProps) {
  const { token } = useConfig();
  const pixels = (value: SpaceSize) =>
    typeof value === "number"
      ? value
      : value === "small"
        ? token.paddingXS
        : value === "middle"
          ? token.padding
          : token.paddingLG;
  const sizes = Array.isArray(size) ? size : [size, size];
  const items = Children.toArray(children).filter(
    (item) => item !== null && item !== undefined && typeof item !== "boolean",
  );
  return (
    <div
      {...rest}
      className={["ant-space", `ant-space-${direction}`, className]}
      style={{
        display: "inline-flex",
        flexDirection: direction === "vertical" ? "column" : "row",
        alignItems:
          align ?? (direction === "horizontal" ? "center" : undefined),
        flexWrap: wrap ? "wrap" : undefined,
        columnGap: pixels(sizes[0]),
        rowGap: pixels(sizes[1]),
        ...style,
      }}
    >
      {items.map((child, index) => (
        <Fragment key={index}>
          {index > 0 && split !== undefined && (
            <span className="ant-space-split">{split}</span>
          )}
          <div className="ant-space-item">{child}</div>
        </Fragment>
      ))}
    </div>
  );
}
export interface SpaceCompactProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
  style?: CSSProperties;
  size?: "small" | "middle" | "large";
  direction?: "horizontal" | "vertical";
  block?: boolean;
  rootClassName?: string;
}

export interface SpaceAddonProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
  style?: CSSProperties;
}

interface CompactBoundary {
  first: boolean;
  last: boolean;
  direction: "horizontal" | "vertical";
}
const CompactBoundaryContext = createContext<CompactBoundary | null>(null);

const itemClasses = [
  "ant-space-compact-item",
  "ant-space-compact-horizontal-item",
  "ant-space-compact-vertical-item",
  "ant-space-compact-first-item",
  "ant-space-compact-last-item",
];
function syncCompactBoundaries(root: HTMLElement, boundary: CompactBoundary) {
  const items = [...root.children] as HTMLElement[];
  for (const [index, item] of items.entries()) {
    const next = {
      first: index === 0 && boundary.first,
      last: index === items.length - 1 && boundary.last,
      direction: boundary.direction,
    };
    // Count text is outside the bordered input, so the inner control owns corners.
    const control = item.classList.contains("ant-input-count-wrapper")
      ? (item.firstElementChild as HTMLElement | null)
      : item;
    if (!control) continue;
    const wanted = new Set([
      "ant-space-compact-item",
      `ant-space-compact-${next.direction}-item`,
      ...(next.first ? ["ant-space-compact-first-item"] : []),
      ...(next.last ? ["ant-space-compact-last-item"] : []),
    ]);
    for (const name of itemClasses) {
      if (wanted.has(name) !== control.classList.contains(name))
        control.classList.toggle(name, wanted.has(name));
    }
    if (control.classList.contains("ant-space-compact")) {
      const direction = control.classList.contains("ant-space-compact-vertical")
        ? "vertical"
        : "horizontal";
      syncCompactBoundaries(control, {
        first: direction === next.direction ? next.first : true,
        last: direction === next.direction ? next.last : true,
        direction,
      });
    }
  }
}

// Fragments do not create a border or a flex item. Preserve descriptors and keys
// while finding the actual first and last controls, including conditional nodes.
function compactChildren(children: OctaneNode): OctaneNode[] {
  return Children.toArray(children).flatMap((child) => {
    if (isValidElement(child) && child.type === Fragment)
      return compactChildren(child.props.children);
    return child === null || child === undefined || typeof child === "boolean"
      ? []
      : [child];
  });
}

function InternalCompact({
  size,
  direction = "horizontal",
  block = false,
  rootClassName,
  className,
  style,
  children,
  ref,
  ...rest
}: SpaceCompactProps) {
  const config = useConfig();
  const parent = useContext(CompactBoundaryContext);
  const nativeChildren = isChildrenBlock(children);
  const items = nativeChildren ? [] : compactChildren(children);
  const root = useRef<HTMLDivElement | null>(null);
  useImperativeHandle(ref, () => root.current as HTMLDivElement, []);
  const sameDirection = parent?.direction === direction;
  const mergedSize = size ?? config.componentSize ?? "middle";
  // Octane 0.4 only propagates descriptorChildren for bare component bindings.
  // Member tags in TSRX deliver a native render block. Render it without trying
  // to inspect it, then keep boundaries in sync with its actual element roots.
  useLayoutEffect(() => {
    const element = root.current;
    if (!nativeChildren || !element) return;
    const sync = () => {
      // A native parent also assigns boundaries to this group's root. Respect
      // those boundaries so nested observers never undo each other's classes.
      const nestedSameDirection = element.classList.contains(
        `ant-space-compact-${direction}-item`,
      );
      syncCompactBoundaries(element, {
        first: nestedSameDirection
          ? element.classList.contains("ant-space-compact-first-item")
          : !sameDirection || !!parent?.first,
        last: nestedSameDirection
          ? element.classList.contains("ant-space-compact-last-item")
          : !sameDirection || !!parent?.last,
        direction,
      });
    };
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(element, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  });
  if (!nativeChildren && !items.length) return null;
  return (
    <div
      {...rest}
      ref={root}
      className={[
        "ant-space-compact",
        block && "ant-space-compact-block",
        direction === "vertical" && "ant-space-compact-vertical",
        className,
        rootClassName,
      ]}
      style={{
        "--ao-compact-line-width": `${config.token.lineWidth}px`,
        ...style,
      }}
    >
      <ConfigProvider componentSize={mergedSize}>
        {nativeChildren
          ? children
          : items.map((child, index) => {
              const boundary: CompactBoundary = {
                first: index === 0 && (!sameDirection || !!parent?.first),
                last:
                  index === items.length - 1 &&
                  (!sameDirection || !!parent?.last),
                direction,
              };
              const descriptor = isValidElement(child)
                ? (child as ElementDescriptor<Record<string, unknown>>)
                : null;
              return (
                <CompactBoundaryContext
                  key={descriptor?.key ?? index}
                  value={boundary}
                >
                  {descriptor
                    ? cloneElement(descriptor, {
                        className: [
                          descriptor.props.className,
                          "ant-space-compact-item",
                          `ant-space-compact-${direction}-item`,
                          boundary.first && "ant-space-compact-first-item",
                          boundary.last && "ant-space-compact-last-item",
                        ],
                      })
                    : child}
                </CompactBoundaryContext>
              );
            })}
      </ConfigProvider>
    </div>
  );
}

function Addon({ className, style, children, ...rest }: SpaceAddonProps) {
  const { token, componentSize = "middle" } = useConfig();
  const small = componentSize === "small";
  const large = componentSize === "large";
  return (
    <div
      {...rest}
      className={[
        "ant-space-addon",
        `ant-space-addon-${componentSize}`,
        className,
      ]}
      style={{
        color: token.colorText,
        background: token.colorBgContainerDisabled,
        border: `${token.lineWidth}px solid ${token.colorBorder}`,
        borderRadius: small
          ? token.borderRadiusSM
          : large
            ? token.borderRadiusLG
            : token.borderRadius,
        paddingInline: small ? token.paddingXS : token.paddingSM,
        fontSize: small
          ? token.fontSizeSM
          : large
            ? token.fontSizeLG
            : token.fontSize,
        minHeight: small
          ? token.controlHeightSM
          : large
            ? token.controlHeightLG
            : token.controlHeight,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export const Space = descriptorChildren(
  Object.assign(InternalSpace, {
    Compact: descriptorChildren(InternalCompact),
    Addon,
  }),
);
