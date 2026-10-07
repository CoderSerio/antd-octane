/** @jsxImportSource octane */
import type { CSSProperties, OctaneNode } from "octane";
import {
  Children,
  isValidElement,
  useLayoutEffect,
  useRef,
  useState,
} from "octane";
import { componentClassName } from "../_util/componentClassName";
import { useComponentTokens } from "../_util/tokens";
import { Affix, type AffixProps } from "../affix";
import { useConfig } from "../config-provider";
import { getTargetContainerElement } from "../config-provider/context";
export interface AnchorItem {
  key: string | number;
  href: string;
  title: OctaneNode;
  target?: string;
  replace?: boolean;
  children?: AnchorItem[];
}
export interface AnchorProps {
  items?: AnchorItem[];
  affix?: boolean | Omit<AffixProps, "offsetTop" | "target" | "children">;
  showInkInFixed?: boolean;
  children?: OctaneNode;
  prefixCls?: string;
  rootClassName?: string;
  offsetTop?: number;
  targetOffset?: number;
  bounds?: number;
  getContainer?: () => Window | HTMLElement;
  getCurrentAnchor?: (activeLink: string) => string;
  onChange?: (currentActiveLink: string) => void;
  onClick?: (
    event: MouseEvent,
    link: { title: OctaneNode; href: string },
  ) => void;
  direction?: "vertical" | "horizontal";
  replace?: boolean;
  className?: string;
  style?: CSSProperties;
}
function flatten(items: AnchorItem[]): AnchorItem[] {
  return items.flatMap((item) => [item, ...flatten(item.children ?? [])]);
}
function section(href: string) {
  const hash = /#([\S ]+)$/.exec(href)?.[1];
  try {
    return hash ? document.getElementById(decodeURIComponent(hash)) : null;
  } catch {
    return null;
  }
}
export interface AnchorLinkProps extends Omit<AnchorItem, "key" | "children"> {
  children?: OctaneNode;
}
function AnchorLink(_props: AnchorLinkProps) {
  return null;
}
function childItems(children: OctaneNode): AnchorItem[] {
  const result: AnchorItem[] = [];
  Children.forEach(children, (child) => {
    if (!isValidElement<AnchorLinkProps>(child) || child.type !== AnchorLink)
      return;
    result.push({
      ...child.props,
      key: child.key ?? child.props.href,
      children: childItems(child.children ?? child.props.children),
    });
  });
  return result;
}
export function Anchor({
  items: customItems,
  children,
  affix = true,
  showInkInFixed = false,
  prefixCls: customPrefix,
  rootClassName,
  offsetTop = 0,
  targetOffset,
  bounds = 5,
  getContainer,
  getCurrentAnchor,
  onChange,
  onClick,
  direction = "vertical",
  replace = false,
  className,
  style,
}: AnchorProps) {
  const config = useConfig();
  const prefixCls = config.getPrefixCls("anchor", customPrefix);
  const cls = (suffix = "") =>
    componentClassName("ant-anchor", prefixCls, suffix);
  const items = customItems ?? childItems(children);
  const containerOf = () =>
    getContainer?.() ??
    getTargetContainerElement(config.getTargetContainer?.()) ??
    window;
  const { token: t, component: c, base } = useComponentTokens("Anchor");
  const [active, setActive] = useState("");
  const current = useRef(""),
    callbacks = useRef({ onChange, getCurrentAnchor });
  callbacks.current = { onChange, getCurrentAnchor };
  const set = (value: string) => {
    if (current.current === value) return;
    const next = callbacks.current.getCurrentAnchor?.(value) ?? value;
    current.current = next;
    setActive(next);
    callbacks.current.onChange?.(value);
  };
  useLayoutEffect(() => {
    if (getCurrentAnchor) set(getCurrentAnchor(current.current));
  }, [getCurrentAnchor]);
  useLayoutEffect(() => {
    const container = containerOf();
    let frame = 0;
    const read = () => {
      const top =
        container === window
          ? 0
          : (container as HTMLElement).getBoundingClientRect().top;
      let next = "",
        highest = -Infinity;
      for (const item of flatten(items)) {
        const element = section(item.href);
        if (!element) continue;
        const distance = element.getBoundingClientRect().top - top;
        if (
          distance <= (targetOffset ?? offsetTop) + bounds &&
          distance > highest
        ) {
          next = item.href;
          highest = distance;
        }
      }
      set(next);
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(read);
    };
    read();
    container.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      container.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [items, getContainer, targetOffset, offsetTop, bounds, getCurrentAnchor]);
  const links = (nodes: AnchorItem[]) =>
    nodes.map((item) => (
      <div
        key={item.key}
        className={[cls("-link"), active === item.href && cls("-link-active")]}
      >
        <a
          href={item.href}
          title={typeof item.title === "string" ? item.title : undefined}
          target={item.target}
          aria-current={active === item.href ? "location" : undefined}
          className={[
            cls("-link-title"),
            active === item.href && cls("-link-title-active"),
          ]}
          onClick={(event) => {
            onClick?.(event, { title: item.title, href: item.href });
            if (
              event.button !== 0 ||
              event.metaKey ||
              event.ctrlKey ||
              event.shiftKey ||
              event.altKey ||
              item.target === "_blank"
            )
              return;
            const element = section(item.href);
            const external = /^https?:\/\//.test(item.href);
            if (external) return;
            const container = containerOf();
            const isWindow = container === window;
            const rect = isWindow
              ? { top: 0 }
              : (container as HTMLElement).getBoundingClientRect();
            const scroll = isWindow
              ? window.scrollY
              : (container as HTMLElement).scrollTop;
            if (element)
              container.scrollTo({
                top:
                  scroll +
                  element.getBoundingClientRect().top -
                  rect.top -
                  (targetOffset ?? offsetTop),
                behavior: t.motion ? "smooth" : "auto",
              });
            set(item.href);
            if (event.defaultPrevented) return;
            event.preventDefault();
            if (item.replace ?? replace)
              history.replaceState(null, "", item.href);
            else history.pushState(null, "", item.href);
          }}
        >
          {item.title}
        </a>
        {direction === "vertical" && item.children && links(item.children)}
      </div>
    ));
  const wrapper = useRef<HTMLElement | null>(null);
  const [ink, setInk] = useState<CSSProperties>({});
  useLayoutEffect(() => {
    const node = wrapper.current?.querySelector<HTMLElement>(
      ".ant-anchor-link-title-active",
    );
    if (!node) return;
    const next =
      direction === "horizontal"
        ? { left: node.offsetLeft, width: node.clientWidth }
        : {
            top: node.offsetTop + node.clientHeight / 2,
            height: node.clientHeight,
          };
    setInk((old) =>
      JSON.stringify(old) === JSON.stringify(next) ? old : next,
    );
  }, [active, direction, items]);
  const content = (
    <nav
      ref={wrapper}
      aria-label="页内导航"
      className={[
        cls("-wrapper"),
        direction === "horizontal" && cls("-wrapper-horizontal"),
        config.direction === "rtl" && cls("-rtl"),
        config.anchor?.className,
        className,
        rootClassName,
      ]}
      style={{
        ...base,
        "--ao-anchor-pb": `${c?.linkPaddingBlock ?? t.paddingXXS}px`,
        "--ao-anchor-pi": `${c?.linkPaddingInlineStart ?? t.padding}px`,
        "--ao-anchor-holder": `${t.paddingXXS}px`,
        "--ao-anchor-secondary": `${t.paddingXXS / 2}px`,
        "--ao-anchor-title-margin": `${(t.fontSize / 14) * 3}px`,
        maxHeight: offsetTop ? `calc(100vh - ${offsetTop}px)` : "100vh",
        direction: config.direction,
        ...config.anchor?.style,
        ...style,
      }}
    >
      <div
        className={[
          cls(),
          !affix && !showInkInFixed && cls("-fixed"),
          direction === "horizontal" && cls("-horizontal"),
        ]}
      >
        <span
          className={[cls("-ink"), !!active && cls("-ink-visible")]}
          style={ink}
        />
        {links(items)}
      </div>
    </nav>
  );
  return affix ? (
    <Affix
      offsetTop={offsetTop}
      target={containerOf}
      {...(typeof affix === "object" ? affix : {})}
    >
      {content}
    </Affix>
  ) : (
    content
  );
}

Anchor.Link = AnchorLink;
