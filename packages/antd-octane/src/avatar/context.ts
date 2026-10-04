import { createContext } from "octane";
import type { AvatarSize } from "./types";

export interface AvatarGroupContextValue {
  size?: AvatarSize;
  shape?: "circle" | "square";
}

export const AvatarGroupContext = createContext<AvatarGroupContextValue>({});
