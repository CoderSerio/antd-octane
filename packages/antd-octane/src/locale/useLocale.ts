import { useMemo } from "octane";
import { useConfig } from "../config-provider";
import type { Locale } from ".";
import enUS from "./en_US";

type ComponentName = Exclude<keyof Locale, "locale">;

/** Ant Design 5.29.3 components/locale/useLocale.ts (MIT), adapted to Octane. */
export default function useLocale<C extends ComponentName>(name: C) {
  const { locale } = useConfig();
  const componentLocale = useMemo(
    () => ({ ...enUS[name], ...locale[name] }),
    [name, locale],
  );
  return [componentLocale as NonNullable<Locale[C]>, locale.locale] as const;
}
