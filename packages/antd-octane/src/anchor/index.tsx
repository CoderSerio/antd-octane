/** @jsxImportSource octane */
import type { CSSProperties, OctaneNode } from "octane";
import { useLayoutEffect, useRef, useState } from "octane";
import { useComponentTokens } from "../_util/tokens";
import { Affix } from "../affix";
export interface AnchorItem {
  key: string | number;
  href: string;
  title: OctaneNode;
  target?: string;
  children?: AnchorItem[];
}
export interface AnchorProps {
  items?: AnchorItem[];
  affix?: boolean;
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
  const hash = href.startsWith("#") ? href.slice(1) : "";
  try {
    return hash ? document.getElementById(decodeURIComponent(hash)) : null;
  } catch {
    return null;
  }
}
export function Anchor({
  items = [],
  affix = true,
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
  const { token: t, component: c, base } = useComponentTokens("Anchor");
  const [active, setActive] = useState("");
  const current = useRef(""),
    callbacks = useRef({ onChange, getCurrentAnchor });
  callbacks.current = { onChange, getCurrentAnchor };
  const set = (value: string) => {
    const next = callbacks.current.getCurrentAnchor?.(value) ?? value;
    if (current.current !== next) {
      current.current = next;
      setActive(next);
      callbacks.current.onChange?.(next);
    }
  };
  useLayoutEffect(() => {
    const container = getContainer?.() ?? window;
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
        className={[
          "ant-anchor-link",
          active === item.href && "ant-anchor-link-active",
        ]}
      >
        <a
          href={item.href}
          target={item.target}
          aria-current={active === item.href ? "location" : undefined}
          className="ant-anchor-link-title"
          onClick={(event) => {
            onClick?.(event, { title: item.title, href: item.href });
            if (
              event.defaultPrevented ||
              event.button !== 0 ||
              event.metaKey ||
              event.ctrlKey ||
              event.shiftKey ||
              event.altKey ||
              item.target === "_blank"
            )
              return;
            const element = section(item.href);
            if (!element) return;
            event.preventDefault();
            const container = getContainer?.() ?? window;
            const isWindow = container === window;
            const rect = isWindow
              ? { top: 0 }
              : (container as HTMLElement).getBoundingClientRect();
            const scroll = isWindow
              ? window.scrollY
              : (container as HTMLElement).scrollTop;
            container.scrollTo({
              top:
                scroll +
                element.getBoundingClientRect().top -
                rect.top -
                (targetOffset ?? offsetTop),
              behavior: t.motion ? "smooth" : "auto",
            });
            set(item.href);
            if (replace) history.replaceState(null, "", item.href);
            else history.pushState(null, "", item.href);
          }}
        >
          {item.title}
        </a>
        {direction === "vertical" && item.children && links(item.children)}
      </div>
    ));
  const content = (
    <nav
      aria-label="页内导航"
      className={["ant-anchor-wrapper", className]}
      style={{
        ...base,
        "--ao-anchor-pb": `${c?.linkPaddingBlock ?? t.paddingXXS}px`,
        "--ao-anchor-pi": `${c?.linkPaddingInlineStart ?? t.padding}px`,
        ...style,
      }}
    >
      <div
        className={[
          "ant-anchor",
          direction === "horizontal" && "ant-anchor-horizontal",
        ]}
      >
        {links(items)}
      </div>
    </nav>
  );
  return affix ? (
    <Affix offsetTop={offsetTop} target={getContainer}>
      {content}
    </Affix>
  ) : (
    content
  );
}
