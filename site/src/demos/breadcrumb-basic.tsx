import { Breadcrumb } from "antd-octane";

export function BasicDemo() {
  return (
    <Breadcrumb
      items={[
        {
          title: "Home",
        },
        {
          // biome-ignore lint/a11y/useValidAnchor: preserves the upstream placeholder link.
          title: <a href="">Application Center</a>,
        },
        {
          // biome-ignore lint/a11y/useValidAnchor: preserves the upstream placeholder link.
          title: <a href="">Application List</a>,
        },
        {
          title: "An Application",
        },
      ]}
    />
  );
}
