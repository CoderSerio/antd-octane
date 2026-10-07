import { createRoot, type OctaneNode } from "octane";
import { ConfigProvider } from "../config-provider";
import { getGlobalConfig } from "../config-provider/global";

function GlobalHolder({
  children,
  config,
}: {
  children: OctaneNode;
  config: ReturnType<typeof getGlobalConfig>;
}) {
  const { prefixCls, iconPrefixCls, holderRender, theme } = config;
  return (
    <ConfigProvider
      prefixCls={prefixCls}
      iconPrefixCls={iconPrefixCls}
      theme={theme}
    >
      {holderRender ? holderRender(children) : children}
    </ConfigProvider>
  );
}

/** Static APIs mount an independent native root, matching upstream's context boundary. */
export function mountStaticHolder(
  node: OctaneNode,
  initialConfig = getGlobalConfig(),
) {
  const container = document.createElement("div");
  const root = createRoot(container);
  document.body.append(container);
  const render = (content: OctaneNode, config = getGlobalConfig()) => {
    root.render(<GlobalHolder config={config}>{content}</GlobalHolder>);
  };
  render(node, initialConfig);
  return {
    render,
    unmount() {
      root.unmount();
      container.remove();
    },
  };
}
