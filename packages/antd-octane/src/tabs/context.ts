import { createContext } from "octane";
import type { TabItem } from "./interface";
export const TabsNavContext = createContext<{
  tabs: TabItem[];
  prefixCls: string;
  onIndicatorSize: (size: number | undefined) => void;
} | null>(null);
