import { useLayoutEffect, useMemo, useState } from "octane";
import { useConfig } from "../config-provider";
export const breakpoints = ["xs", "sm", "md", "lg", "xl", "xxl"] as const;
export type Breakpoint = (typeof breakpoints)[number];
export type Screens = Partial<Record<Breakpoint, boolean>>;
export type Responsive<T> = Partial<Record<Breakpoint, T>>;
const observers = new Map<
  string,
  { subscribe: (listener: (screens: Screens) => void) => () => void }
>();
function observe(queries: string[]) {
  const key = queries.join("|");
  const existing = observers.get(key);
  if (existing) return existing;
  const media = queries.map((query) => window.matchMedia(query));
  const listeners = new Set<(screens: Screens) => void>();
  const read = () =>
    Object.fromEntries(
      media.map((item, index) => [breakpoints[index], item.matches]),
    ) as Screens;
  const notify = () => {
    const next = read();
    for (const listener of listeners) listener(next);
  };
  const store = {
    subscribe(listener: (screens: Screens) => void) {
      if (!listeners.size)
        for (const item of media) item.addEventListener("change", notify);
      listeners.add(listener);
      listener(read());
      return () => {
        listeners.delete(listener);
        if (!listeners.size) {
          for (const item of media) item.removeEventListener("change", notify);
          observers.delete(key);
        }
      };
    },
  };
  observers.set(key, store);
  return store;
}
export function useBreakpoint(
  enabled = true,
  componentToken?: ReturnType<typeof useConfig>["token"],
) {
  const config = useConfig();
  const token = componentToken ?? config.token;
  const [screens, setScreens] = useState<Screens>({});
  const queries = useMemo(
    () => [
      `(max-width: ${token.screenXSMax}px)`,
      `(min-width: ${token.screenSM}px)`,
      `(min-width: ${token.screenMD}px)`,
      `(min-width: ${token.screenLG}px)`,
      `(min-width: ${token.screenXL}px)`,
      `(min-width: ${token.screenXXL}px)`,
    ],
    [
      token.screenXSMax,
      token.screenSM,
      token.screenMD,
      token.screenLG,
      token.screenXL,
      token.screenXXL,
    ],
  );
  useLayoutEffect(() => {
    if (!enabled || typeof window === "undefined" || !window.matchMedia) return;
    return observe(queries).subscribe(setScreens);
  }, [enabled, queries]);
  return screens;
}
export function responsiveValue<T>(
  value: T | Responsive<T> | undefined,
  screens: Screens,
  fallback: T,
): T {
  if (value === undefined) return fallback;
  if (typeof value !== "object" || value === null) return value as T;
  let result = fallback;
  for (const bp of breakpoints)
    if (screens[bp] && (value as Responsive<T>)[bp] !== undefined)
      result = (value as Responsive<T>)[bp] as T;
  return result;
}

export function useMediaQuery(query: string | undefined) {
  const [matches, setMatches] = useState<boolean>();
  useLayoutEffect(() => {
    if (!query || typeof window === "undefined" || !window.matchMedia) return;
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [query]);
  return matches;
}
