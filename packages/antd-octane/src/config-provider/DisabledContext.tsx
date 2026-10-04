/** @jsxImportSource octane */
// Native counterpart of Ant Design 5.29.3 DisabledContext (MIT).
import type { OctaneNode } from "octane";
import { createContext, useContext } from "octane";

const DisabledContext = createContext(false);

export function DisabledContextProvider({
  disabled,
  children,
}: {
  disabled?: boolean;
  children?: OctaneNode;
}) {
  const parent = useContext(DisabledContext);
  return (
    <DisabledContext value={disabled ?? parent}>{children}</DisabledContext>
  );
}

export default DisabledContext;
