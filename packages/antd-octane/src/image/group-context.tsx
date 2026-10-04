/** @jsxImportSource octane */
import { createContext } from "octane";
import type { Entry } from "./interface";

export const Context = createContext<{
  register: (entry: Entry) => () => void;
  show: (
    id: string,
    src: string,
    mousePosition?: { x: number; y: number },
  ) => void;
  enabled: boolean;
} | null>(null);
