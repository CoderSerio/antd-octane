// Ant Design 5.29.3 components/form/context.tsx (MIT), adapted to Octane.
import { createContext } from "octane";

export type Variant = "outlined" | "borderless" | "filled" | "underlined";

export const VariantContext = createContext<Variant | undefined>(undefined);
