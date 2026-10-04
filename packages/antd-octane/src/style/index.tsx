// Native layer context for Ant Design 5's CSS-in-JS StyleProvider behavior.
import type { OctaneNode } from "octane";
import { useMemo } from "octane";
import { StyleContext, useStyleContext } from "./context";

export interface StyleProviderProps {
  layer?: boolean;
  children?: OctaneNode;
}

/** Controls the cascade layer of native registered App and Modal styles. */
export function StyleProvider({ layer, children }: StyleProviderProps) {
  const parent = useStyleContext();
  const value = useMemo(
    () => ({ layer: layer === undefined ? parent.layer : layer }),
    [layer, parent.layer],
  );
  return <StyleContext value={value}>{children}</StyleContext>;
}
