import { createContext, useContext } from "octane";

export const StyleContext = createContext({ layer: false });
export function useStyleContext() {
  return useContext(StyleContext);
}
