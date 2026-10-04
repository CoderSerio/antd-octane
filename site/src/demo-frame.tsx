import { ConfigProvider, theme, zhCN } from "antd-octane";
import { useEffect, useRef, useState } from "octane";

type DemoToken = ReturnType<typeof theme.useToken>["token"];
const READY = "antd-octane:demo-ready";
const THEME = "antd-octane:demo-theme";

/** Keep an isolated demo document in sync without remounting its controls. */
export function DemoIframe({
  title,
  demo,
  height,
}: {
  title: string;
  demo: string;
  height: number;
}) {
  const frame = useRef<HTMLIFrameElement | null>(null);
  const { token } = theme.useToken();
  const snapshot = JSON.stringify(token);
  const sendTheme = () =>
    frame.current?.contentWindow?.postMessage(
      { type: THEME, token: JSON.parse(snapshot) },
      location.origin,
    );
  useEffect(() => {
    sendTheme();
    const ready = (event: MessageEvent) => {
      if (
        event.origin === location.origin &&
        event.source === frame.current?.contentWindow &&
        event.data?.type === READY
      )
        sendTheme();
    };
    window.addEventListener("message", ready);
    return () => window.removeEventListener("message", ready);
  }, [snapshot]);
  return (
    <iframe
      ref={frame}
      title={title}
      src={`?demo=${encodeURIComponent(demo)}`}
      onLoad={sendTheme}
      style={{ width: "100%", height, border: 0 }}
    />
  );
}

export function IsolatedDemo({ Demo }: { Demo: () => unknown }) {
  const [token, setToken] = useState<DemoToken>(() => theme.getDesignToken());
  useEffect(() => {
    const update = (event: MessageEvent) => {
      if (
        event.origin !== location.origin ||
        event.source !== window.parent ||
        event.data?.type !== THEME ||
        !event.data.token ||
        typeof event.data.token !== "object"
      )
        return;
      setToken(event.data.token);
    };
    window.addEventListener("message", update);
    if (window.parent !== window)
      window.parent.postMessage({ type: READY }, location.origin);
    return () => window.removeEventListener("message", update);
  }, []);
  useEffect(() => {
    document.body.style.backgroundColor = token.colorBgContainer;
    document.body.style.color = token.colorText;
    document.body.style.fontFamily = token.fontFamily;
    document.body.style.fontSize = `${token.fontSize}px`;
    document.body.style.lineHeight = String(token.lineHeight);
  }, [token]);
  return (
    <ConfigProvider theme={{ token }} locale={zhCN}>
      <Demo />
    </ConfigProvider>
  );
}
