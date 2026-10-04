// Native adaptation of Ant Design 5.29.3 components/app/App.tsx (MIT).
import {
  type CSSProperties,
  createElement,
  type ElementType,
  type OctaneNode,
  useContext,
  useMemo,
} from "octane";
import { useConfig } from "../config-provider";
import { useMessage } from "../message";
import { useModal } from "../modal";
import { useNotification } from "../notification";
import AppContext, { type AppConfig, AppConfigContext } from "./context";
import useStyle from "./style";

export interface AppProps<P = Record<string, unknown>> extends AppConfig {
  style?: CSSProperties;
  className?: string;
  rootClassName?: string;
  prefixCls?: string;
  children?: OctaneNode;
  component?: ElementType<P> | false;
}

export default function App({
  prefixCls: customPrefix,
  children,
  className,
  rootClassName,
  message,
  notification,
  style,
  component = "div",
}: AppProps) {
  const { direction, getPrefixCls } = useConfig();
  const prefixCls = getPrefixCls("app", customPrefix);
  const hashId = useStyle(prefixCls);
  const parent = useContext(AppConfigContext);
  const mergedConfig = useMemo(
    () => ({
      message: { ...parent.message, ...message },
      notification: { ...parent.notification, ...notification },
    }),
    [message, notification, parent.message, parent.notification],
  );
  const [messageApi, messageHolder] = useMessage(mergedConfig.message);
  const [notificationApi, notificationHolder] = useNotification(
    mergedConfig.notification,
  );
  const [modalApi, modalHolder] = useModal();
  const value = useMemo(
    () => ({
      message: messageApi,
      notification: notificationApi,
      modal: modalApi,
    }),
    [messageApi, notificationApi, modalApi],
  );
  const body = (
    <>
      {modalHolder}
      {messageHolder}
      {notificationHolder}
      {children}
    </>
  );
  return (
    <AppContext value={value}>
      <AppConfigContext value={mergedConfig}>
        {component === false
          ? body
          : createElement(
              component,
              {
                className: [
                  hashId,
                  prefixCls,
                  className,
                  rootClassName,
                  direction === "rtl" && `${prefixCls}-rtl`,
                ]
                  .filter(Boolean)
                  .join(" "),
                style,
              },
              body,
            )}
      </AppConfigContext>
    </AppContext>
  );
}
