import { createContext } from "octane";
import type { MessageConfig, MessageInstance } from "../message/interface";
import type { ModalInstance } from "../modal/interface";
import type { NotificationConfig, NotificationInstance } from "../notification";
export interface AppConfig {
  message?: MessageConfig;
  notification?: NotificationConfig;
}
/** Shared defaults also reach holders created by static APIs. */
export const AppConfigContext = createContext<AppConfig>({});
export interface AppContextValue {
  message: MessageInstance;
  notification: NotificationInstance;
  modal: ModalInstance;
}
// Upstream exposes empty API objects outside App; usable instances come from a holder.
const AppContext = createContext<AppContextValue>({
  message: {},
  notification: {},
  modal: {},
} as AppContextValue);
export default AppContext;
