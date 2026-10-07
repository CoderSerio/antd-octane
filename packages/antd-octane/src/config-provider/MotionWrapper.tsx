// Adapted from Ant Design 5.29.3 components/config-provider/MotionWrapper.tsx (MIT).
import { createContext, type OctaneNode, useContext, useRef } from "octane";
import { ConfigContext } from "./context";

const MotionCacheContext = createContext(true);

export default function MotionWrapper({ children }: { children?: OctaneNode }) {
  const parentMotion = useContext(MotionCacheContext);
  const { motion } = useContext(ConfigContext).token;
  const needWrap = useRef(false);
  needWrap.current ||= parentMotion !== motion;
  // Adding the boundary once follows upstream's child lifecycle. Native motion
  // components already consume ConfigContext's motion token directly.
  return needWrap.current ? (
    <MotionCacheContext value={motion}>{children}</MotionCacheContext>
  ) : (
    children
  );
}
