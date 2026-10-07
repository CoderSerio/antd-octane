import { Divider } from "antd-octane";

export function VerticalDemo() {
  return (
    <>
      Text
      <Divider type="vertical" />
      {/* biome-ignore lint/a11y/useValidAnchor: Upstream Divider demo uses a placeholder link. */}
      <a href="#">Link</a>
      <Divider type="vertical" />
      {/* biome-ignore lint/a11y/useValidAnchor: Upstream Divider demo uses a placeholder link. */}
      <a href="#">Link</a>
    </>
  );
}
