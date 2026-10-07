// Ant Design 5.29.3 components/_util/warning.ts (MIT), adapted to Octane.
import { createContext, useContext } from "octane";

// Keep the conventional bundler replacement without requiring Node types in consumers.
declare const process: { env: { NODE_ENV?: string } };

export interface WarningContextProps {
  strict?: boolean;
}
export const WarningContext = createContext<WarningContextProps>({});

type WarningType = "deprecated" | "usage" | "breaking";
export type TypeWarning = ((
  valid: boolean,
  type: WarningType,
  message?: string,
) => void) & {
  deprecated: (
    valid: boolean,
    oldProp: string,
    newProp: string,
    message?: string,
  ) => void;
};

let deprecatedWarnList: Record<string, string[]> | null = null;
const warned = new Set<string>();
export function resetWarned() {
  deprecatedWarnList = null;
  warned.clear();
}
export function noop() {}
const noopWarning: TypeWarning = Object.assign(noop, { deprecated: noop });

export default function warning(
  valid: boolean,
  component: string,
  message?: string,
) {
  if (process.env.NODE_ENV === "production" || valid) return;
  const text = `[antd-octane: ${component}] ${message}`;
  if (!warned.has(text)) {
    console.error(`Warning: ${text}`);
    warned.add(text);
  }
  // Upstream permits each test to observe warnings independently.
  if (process.env.NODE_ENV === "test") resetWarned();
}

export function devUseWarning(component: string): TypeWarning {
  if (process.env.NODE_ENV === "production") return noopWarning;
  const { strict } = useContext(WarningContext);
  const typeWarning: TypeWarning = (valid, type, message) => {
    if (valid) return;
    if (strict === false && type === "deprecated") {
      const existing = deprecatedWarnList;
      deprecatedWarnList ??= {};
      deprecatedWarnList[component] ??= [];
      const messages = deprecatedWarnList[component];
      if (!messages.includes(message || "")) messages.push(message || "");
      if (!existing) {
        console.warn(
          "[antd-octane] There exists deprecated usage in your code:",
          deprecatedWarnList,
        );
      }
    } else {
      warning(false, component, message);
    }
  };
  typeWarning.deprecated = (valid, oldProp, newProp, message) => {
    typeWarning(
      valid,
      "deprecated",
      `\`${oldProp}\` is deprecated. Please use \`${newProp}\` instead.${message ? ` ${message}` : ""}`,
    );
  };
  return typeWarning;
}
