import { createContext } from "octane";

/** Sider collapse state is shared without importing its runtime component. */
export const SiderCollapseContext = createContext<boolean | undefined>(
  undefined,
);
