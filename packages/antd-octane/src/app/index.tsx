/** @jsxImportSource octane */
import type { CSSProperties, HTMLAttributes, OctaneNode } from "octane";
import { createContext, useContext, useMemo } from "octane";
import { useConfig } from "../config-provider";
import {
  type MessageConfig,
  type MessageInstance,
  useMessage,
} from "../message";
import {
  type NotificationConfig,
  type NotificationInstance,
  useNotification,
} from "../notification";
export interface AppContextValue {
  message: MessageInstance;
  notification: NotificationInstance;
}
const AppContext = createContext<AppContextValue | null>(null);
export interface AppProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "style"> {
  style?: CSSProperties;
  message?: MessageConfig;
  notification?: NotificationConfig;
  component?: "div" | false;
  children?: OctaneNode;
}
function useApp(): AppContextValue {
  const value = useContext(AppContext);
  if (!value) throw Error("App.useApp must be called inside an App component.");
  return value;
}
function InternalApp({
  message: messageConfig,
  notification: notificationConfig,
  component = "div",
  children,
  className,
  style,
  ...rest
}: AppProps) {
  const [message, messageHolder] = useMessage(messageConfig);
  const [notification, notificationHolder] =
    useNotification(notificationConfig);
  const { token } = useConfig();
  const value = useMemo(
    () => ({ message, notification }),
    [message, notification],
  );
  const body = (
    <>
      {messageHolder}
      {notificationHolder}
      {children}
    </>
  );
  return (
    <AppContext value={value}>
      {component === false ? (
        body
      ) : (
        <div
          {...rest}
          className={["ant-app", className]}
          style={{
            color: token.colorText,
            fontFamily: token.fontFamily,
            fontSize: token.fontSize,
            lineHeight: token.lineHeight,
            ...style,
          }}
        >
          {body}
        </div>
      )}
    </AppContext>
  );
}
export const App = Object.assign(InternalApp, { useApp });
