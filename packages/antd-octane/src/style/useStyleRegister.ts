// Native style ownership and CSS-in-JS's default prepend / layered append order.
import { useInsertionEffect } from "octane";
import { useConfig } from "../config-provider";

interface StyleEntry {
  element: HTMLStyleElement;
  users: number;
}
const styles = new WeakMap<Document, Map<string, StyleEntry>>();

export function escapeClass(value: string) {
  return Array.from(value)
    .map((char, index) =>
      /[a-zA-Z0-9_-]/.test(char) &&
      !(index === 0 && /[0-9]/.test(char)) &&
      !(index === 1 && value[0] === "-" && /[0-9]/.test(char))
        ? char
        : `\\${char.codePointAt(0)?.toString(16)} `,
    )
    .join("");
}
export function styleId(name: string, value: string) {
  let hash = 5381;
  for (const char of value) hash = (hash * 33) ^ char.charCodeAt(0);
  return `ao-${name}-${(hash >>> 0).toString(36)}`;
}

export function useStyleRegister(
  name: string,
  hashId: string,
  css: string,
  layer = false,
) {
  const nonce = useConfig().csp?.nonce;
  // Identical CSS under a different document policy needs its own authorized tag.
  const cacheKey = JSON.stringify([name, nonce, css]);
  useInsertionEffect(() => {
    if (typeof document === "undefined") return;
    let cache = styles.get(document);
    if (!cache) {
      cache = new Map();
      styles.set(document, cache);
    }
    let entry = cache.get(cacheKey);
    if (!entry) {
      const element = document.createElement("style");
      element.setAttribute(`data-ao-${name}-style`, hashId);
      if (nonce) element.nonce = nonce;
      element.textContent = css;
      // Layered rules must follow the application's declared layer order.
      // Prepending would create antd before Tailwind base and reverse their precedence.
      if (layer) document.head.append(element);
      else document.head.prepend(element);
      entry = { element, users: 0 };
      cache.set(cacheKey, entry);
    }
    entry.users += 1;
    return () => {
      entry.users -= 1;
      if (entry.users === 0) {
        entry.element.remove();
        cache.delete(cacheKey);
      }
    };
  }, [name, hashId, css, layer, nonce, cacheKey]);
}
