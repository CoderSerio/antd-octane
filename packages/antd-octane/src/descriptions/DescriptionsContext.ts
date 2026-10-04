import type { CSSProperties } from "octane";
import { createContext } from "octane";

export type SemanticName = "label" | "content";
export interface DescriptionsContextProps {
  labelStyle?: CSSProperties;
  contentStyle?: CSSProperties;
  styles?: Partial<Record<SemanticName, CSSProperties>>;
  classNames?: Partial<Record<SemanticName, string>>;
}
export const DescriptionsContext = createContext<DescriptionsContextProps>({});
