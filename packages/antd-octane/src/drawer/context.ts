import { createContext } from "octane";

export const DrawerContext = createContext<{
  pushDistance: string | number;
  push: () => void;
  pull: () => void;
} | null>(null);
