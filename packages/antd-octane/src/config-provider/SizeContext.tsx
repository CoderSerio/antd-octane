/** @jsxImportSource octane */
// Native counterpart of Ant Design 5.29.3 SizeContext (MIT).
import type { OctaneNode } from "octane";
import { createContext, useContext } from "octane";
import type { SizeType } from "./context";

const SizeContext = createContext<SizeType | undefined>(undefined);

export function SizeContextProvider({
  size,
  children,
}: {
  size?: SizeType;
  children?: OctaneNode;
}) {
  const parent = useContext(SizeContext);
  return <SizeContext value={size ?? parent}>{children}</SizeContext>;
}

export default SizeContext;
