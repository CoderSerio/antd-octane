import { theme } from "antd-octane";
import type { CSSProperties } from "octane";
import { useEffect, useId } from "octane";

export function useTheme() {
  return theme.useToken().token;
}
export function createStyles<T extends Record<string, CSSProperties>>(
  factory: (context: { token: ReturnType<typeof useTheme> }) => T,
) {
  return function useStyles() {
    const token = useTheme();
    const id = useId().replace(/[^\w-]/g, "");
    const rules = factory({ token });
    const styles = Object.fromEntries(
      Object.keys(rules).map((key) => [key, `demo-${id}-${key}`]),
    ) as Record<keyof T, string>;
    const css = Object.entries(rules)
      .map(
        ([key, properties]) =>
          `.${styles[key]}{${Object.entries(properties)
            .map(
              ([property, value]) =>
                `${property.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}:${typeof value === "number" && value !== 0 && !/opacity|zIndex|fontWeight|lineHeight|flex|order/.test(property) ? `${value}px` : value}`,
            )
            .join(";")}}`,
      )
      .join("\n");
    useEffect(() => {
      const element = document.createElement("style");
      element.textContent = css;
      document.head.append(element);
      return () => element.remove();
    }, [css]);
    return { styles };
  };
}
